#!/usr/bin/env node
// Writes the Sage's advice for the current week into data/sabio.json for the copy of
// "Crónica del Aventurero" published on andresb.dev, where the page can't call Claude itself.
//
// It opens the page in a headless browser to take exactly the prompt the page would send (same
// adaptive goals, campaign and physiological age), asks Claude, and keeps one entry per week.
// Run it after sync.mjs has refreshed data/days.json:
//
//   ANTHROPIC_API_KEY=... [ANTHROPIC_WORKSPACE_ID=...] node scripts/cronica/sage.mjs

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../static/proyectos/cronica-del-aventurero");
const OUT = path.join(ROOT, "data/sabio.json");
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".png": "image/png" };

// --- the page's own prompt -------------------------------------------------------------
async function pagePrompt() {
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
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.cronica, null, { timeout: 30000 });
    return await page.evaluate(() => window.cronica);
  } finally {
    await browser.close();
    server.close();
  }
}

// --- Claude ----------------------------------------------------------------------------
const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    saludo: { type: "string" },
    consejos: {
      type: "array",
      items: {
        type: "object",
        properties: { titulo: { type: "string" }, accion: { type: "string" }, porque: { type: "string" } },
        required: ["titulo", "accion", "porque"],
        additionalProperties: false,
      },
    },
    mision: { type: "string" },
  },
  required: ["saludo", "consejos", "mision"],
  additionalProperties: false,
};

async function askSage(prompt) {
  // Keys that aren't scoped to a workspace must name one on every request.
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID;
  const client = new Anthropic(workspace ? { defaultHeaders: { "anthropic-workspace-id": workspace } } : {});
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    // On a policy decline the API re-runs the request on a fallback model in the same call.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: { type: "json_schema", schema: ANSWER_SCHEMA } },
    messages: [{ role: "user", content: prompt }],
  });
  if (response.stop_reason === "refusal") throw new Error(`Claude no quiso responder (${response.stop_details?.category ?? "sin categoría"}).`);
  if (response.stop_reason === "max_tokens") throw new Error("La respuesta se cortó por max_tokens.");
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return { answer: JSON.parse(text), model: response.model };
}

// --- main ------------------------------------------------------------------------------
const data = await pagePrompt();
if (data.source !== "live" || !data.week) {
  console.error("La página no cargó data/days.json. Ejecuta antes sync.mjs.");
  process.exit(1);
}
if (typeof data.prompt !== "string" || !data.prompt.trim()) {
  console.error("La página no devolvió el prompt del Sabio.");
  process.exit(1);
}

let result;
try {
  result = await askSage(data.prompt);
} catch (e) {
  if (e instanceof Anthropic.AuthenticationError) console.error("ANTHROPIC_API_KEY no es válida.");
  else if (e instanceof Anthropic.RateLimitError) console.error("Límite de peticiones de la API; vuelve a intentarlo más tarde.");
  else if (e instanceof Anthropic.APIError) console.error(`Error de la API (${e.status}): ${e.message}`);
  else console.error(e.message);
  process.exit(1);
}

let saved = { weeks: {} };
try { saved = JSON.parse(fs.readFileSync(OUT, "utf8")); } catch {}
saved.weeks[data.week] = { ...result.answer, consejos: result.answer.consejos.slice(0, 3), generatedAt: new Date().toISOString(), model: result.model };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(saved, null, 2) + "\n");
console.log(`Consejos del Sabio para la semana del ${data.week} guardados en ${OUT}`);
