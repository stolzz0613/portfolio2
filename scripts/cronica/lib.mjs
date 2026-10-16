// Shared by sage.mjs and cronica.mjs: open the published copy of "Crónica del Aventurero" in a
// headless browser (so the prompts come from the page's own game logic) and ask Claude for JSON.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { chromium } from "playwright";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../static/proyectos/cronica-del-aventurero");
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".png": "image/png" };

// Serves ROOT on a local port and opens the page; resolves once window.cronica is ready.
export async function openPage() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, "http://localhost").pathname).replace(/\/$/, "/index.html");
    const file = path.join(ROOT, path.normalize(rel));
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  // CHROMIUM_PATH: use an already installed Chromium instead of the one `npx playwright install` adds.
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const close = async () => { await browser.close(); server.close(); };
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.cronica, null, { timeout: 30000 });
    const info = await page.evaluate(() => ({ source: window.cronica.source, week: window.cronica.week, prompt: window.cronica.prompt, weeks: window.cronica.weeks }));
    if (info.source !== "live" || !info.week) throw new Error("La página no cargó data/days.json. Ejecuta antes sync.mjs.");
    return { page, info, close };
  } catch (e) {
    await close();
    throw e;
  }
}

export function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

// Keys that aren't scoped to a workspace must name one on every request.
const workspace = process.env.ANTHROPIC_WORKSPACE_ID;
const client = new Anthropic(workspace ? { defaultHeaders: { "anthropic-workspace-id": workspace } } : {});

// One structured-output request; returns the parsed object and the model that answered.
export async function askClaude(prompt, schema) {
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    // On a policy decline the API re-runs the request on a fallback model in the same call.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: prompt }],
  });
  if (response.stop_reason === "refusal") throw new Error(`Claude no quiso responder (${response.stop_details?.category ?? "sin categoría"}).`);
  if (response.stop_reason === "max_tokens") throw new Error("La respuesta se cortó por max_tokens.");
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return { answer: JSON.parse(text), model: response.model };
}

export function explainError(e) {
  if (e instanceof Anthropic.AuthenticationError) return "ANTHROPIC_API_KEY no es válida.";
  if (e instanceof Anthropic.RateLimitError) return "Límite de peticiones de la API; vuelve a intentarlo más tarde.";
  if (e instanceof Anthropic.APIError) return `Error de la API (${e.status}): ${e.message}`;
  return e.message;
}
