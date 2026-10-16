#!/usr/bin/env node
// Pulls daily steps, active minutes, sleep and resting heart rate from the Google Health API
// (https://developers.google.com/health) into days.json for "Crónica del Aventurero".
//
//   node sync.mjs                 # last 120 days
//   node sync.mjs --since 2025-01-01
//
// Needs client_secret.json from Google Cloud (Google Health API enabled, your account added as a
// test user). The first run prints a sign-in link:
//  - "Desktop app" client: the script catches Google's redirect on http://localhost by itself.
//  - "Web application" client (redirect URI https://www.google.com): paste the URL you land on.
// The refresh token is kept in token.json (only on this machine).
//
// In the portfolio's GitHub Action the same values come from secrets instead of files:
// GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN. CRONICA_OUT sets where days.json
// is written and BIRTH_DATE (YYYY-MM-DD, optional) is published with it for the physiological age.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CREDS = path.join(DIR, "client_secret.json");
const TOKEN = path.join(DIR, "token.json");
const OUT = process.env.CRONICA_OUT || path.join(DIR, "days.json");
const ENV = process.env;
const API = "https://health.googleapis.com/v4/users/me/dataTypes";
const REDIRECT = "https://www.google.com";
const SCOPES = [
  "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
  "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
  "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
];

// --- dates -----------------------------------------------------------------------------
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const civil = (s) => { const [year, month, day] = s.split("-").map(Number); return { date: { year, month, day } }; };
const fromCivil = (c) => c?.date ? `${c.date.year}-${String(c.date.month).padStart(2, "0")}-${String(c.date.day).padStart(2, "0")}` : null;
const sinceArg = process.argv.indexOf("--since");
const today = iso(new Date());
const since = sinceArg > 0 ? process.argv[sinceArg + 1] : addDays(today, -120);
const until = addDays(today, 1); // exclusive

// --- OAuth -----------------------------------------------------------------------------
function loadClient() {
  if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) return { id: ENV.GOOGLE_CLIENT_ID, secret: ENV.GOOGLE_CLIENT_SECRET, desktop: true };
  if (!fs.existsSync(CREDS)) {
    console.error(`Falta ${CREDS}. Descarga el JSON del cliente OAuth desde Google Cloud y guárdalo con ese nombre.`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(CREDS, "utf8"));
  const c = raw.web || raw.installed || raw;
  // "Desktop app" clients ("installed") sign in through a loopback redirect on this machine;
  // "Web application" clients use the https://www.google.com redirect and a pasted URL.
  return { id: c.client_id, secret: c.client_secret, desktop: Boolean(raw.installed) };
}

// Desktop clients: listen on a free localhost port and take the code straight from Google's
// redirect, so nothing has to be copied by hand.
async function startLoopback() {
  let settle;
  const code = new Promise((resolve, reject) => { settle = { resolve, reject }; });
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://localhost");
    const got = u.searchParams.get("code"), error = u.searchParams.get("error");
    if (!got && !error) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(got ? "<h2>Listo. Ya puedes cerrar esta pestaña y volver a la terminal.</h2>" : `<h2>Google devolvió un error: ${error}</h2>`);
    server.close();
    got ? settle.resolve(got) : settle.reject(new Error(`Google rechazó la autorización: ${error}`));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { redirect: `http://localhost:${server.address().port}`, code };
}
async function tokenRequest(fields) {
  const res = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: new URLSearchParams(fields) });
  const body = await res.json();
  if (!res.ok) throw new Error(`OAuth ${res.status}: ${body.error_description || body.error || JSON.stringify(body)}`);
  return body;
}
async function accessToken() {
  const client = loadClient();
  if (ENV.GOOGLE_REFRESH_TOKEN) {
    const t = await tokenRequest({ client_id: client.id, client_secret: client.secret, refresh_token: ENV.GOOGLE_REFRESH_TOKEN, grant_type: "refresh_token" });
    return t.access_token;
  }
  if (ENV.CI) {
    console.error("Falta el secret GOOGLE_REFRESH_TOKEN: en GitHub Actions no se puede iniciar sesión en el navegador.");
    process.exit(1);
  }
  if (fs.existsSync(TOKEN)) {
    const saved = JSON.parse(fs.readFileSync(TOKEN, "utf8"));
    if (saved.refresh_token) {
      const t = await tokenRequest({ client_id: client.id, client_secret: client.secret, refresh_token: saved.refresh_token, grant_type: "refresh_token" });
      return t.access_token;
    }
  }
  const loopback = client.desktop ? await startLoopback() : null;
  const redirect = loopback ? loopback.redirect : REDIRECT;
  const url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
    client_id: client.id, redirect_uri: redirect, response_type: "code", scope: SCOPES.join(" "),
    access_type: "offline", prompt: "consent",
  });
  let code;
  if (loopback) {
    console.log("\nAbre este enlace, entra con tu cuenta de Google y acepta los permisos:\n\n" + url + "\n");
    console.log("Esperando a que termines en el navegador…");
    code = await loopback.code;
  } else {
    console.log("\n1. Abre este enlace, entra con tu cuenta de Google y acepta los permisos:\n\n" + url + "\n");
    console.log("2. Google te llevará a https://www.google.com/?code=... Copia esa URL completa de la barra del navegador.\n");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const pasted = (await rl.question("Pega aquí la URL (o solo el code): ")).trim();
    rl.close();
    code = pasted.includes("code=") ? new URL(pasted).searchParams.get("code") : pasted;
  }
  const t = await tokenRequest({ client_id: client.id, client_secret: client.secret, code, redirect_uri: redirect, grant_type: "authorization_code" });
  if (!t.refresh_token) console.warn("Google no devolvió refresh_token: tendrás que volver a autorizar la próxima vez.");
  // Google's consent screen lets you untick permissions; say which metrics that leaves out.
  const granted = new Set((t.scope || "").split(" "));
  const missing = SCOPES.filter((s) => !granted.has(s)).map((s) => s.split(".").slice(-2, -1)[0]);
  if (missing.length) console.warn(`Aviso: no diste permiso para ${missing.join(", ")}; esos datos saldrán vacíos. Borra token.json y vuelve a autorizar para darlos.`);
  fs.writeFileSync(TOKEN, JSON.stringify({ refresh_token: t.refresh_token }, null, 2), { mode: 0o600 });
  return t.access_token;
}

// --- API calls -------------------------------------------------------------------------
let TOKEN_VALUE;
async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${TOKEN_VALUE}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url.replace(API, "")} → HTTP ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}
// dailyRollUp accepts at most 90 days per call (14 for active-minutes), so walk the range in chunks.
async function dailyRollUp(dataType, maxDays, onPoint) {
  for (let start = since; start < until; start = addDays(start, maxDays)) {
    const end = addDays(start, maxDays) < until ? addDays(start, maxDays) : until;
    let pageToken;
    do {
      const r = await api("POST", `${API}/${dataType}/dataPoints:dailyRollUp`, {
        range: { start: civil(start), end: civil(end) }, windowSizeDays: 1, pageSize: 1000, ...(pageToken ? { pageToken } : {}),
      });
      for (const p of r.rollupDataPoints || []) onPoint(fromCivil(p.civilStartTime), p);
      pageToken = r.nextPageToken;
    } while (pageToken);
  }
}
async function list(dataType, filter, pageSize, onPoint) {
  let pageToken;
  do {
    const q = new URLSearchParams({ filter, pageSize: String(pageSize), ...(pageToken ? { pageToken } : {}) });
    const r = await api("GET", `${API}/${dataType}/dataPoints?${q}`);
    for (const p of r.dataPoints || []) onPoint(p);
    pageToken = r.nextPageToken;
  } while (pageToken);
}

// --- main ------------------------------------------------------------------------------
const days = {};
const day = (d) => (days[d] ||= { date: d, steps: null, sleepMin: null, activeMin: null, restingHr: null });

TOKEN_VALUE = await accessToken();

// The Google account must have a Google Health profile (set up in the Google Health app, or a
// Fitbit account moved to Google) or every data call fails with 400 ACCOUNT_NOT_LINKED.
// See https://developers.google.com/health/migration#handle_unlinked_google_accounts
try {
  await api("GET", "https://health.googleapis.com/v4/users/me/identity");
} catch (e) {
  if (String(e.message).includes("ACCOUNT_NOT_LINKED")) {
    console.error("\nTu cuenta de Google todavía no está vinculada a Google Health.");
    console.error("Abre la app Google Health en el móvil e inicia sesión con esta misma cuenta de Google");
    console.error("(o mueve tu cuenta de Fitbit a Google: https://fitbit.google.com/auth/signup). Luego vuelve a ejecutar este script.");
    process.exit(1);
  }
  throw e;
}

console.log(`Descargando desde ${since} hasta ${today}…`);
// Each metric is fetched on its own: one that fails (a permission you didn't grant, say)
// is reported and left empty instead of stopping the rest.
async function step(label, fn) {
  try { await fn(); console.log(`  ${label} ✓`); }
  catch (e) { console.warn(`  ${label} ✗ ${e.message}`); }
}

await step("pasos", () => dailyRollUp("steps", 90, (d, p) => { if (d && p.steps?.countSum != null) day(d).steps = Number(p.steps.countSum); }));

// Active minutes per WHO guidance: moderate + vigorous (light activity left out).
await step("minutos activos", () => dailyRollUp("active-minutes", 14, (d, p) => {
  const v = Object.values(p).find((x) => x && Array.isArray(x.activeMinutesRollupByActivityLevel));
  if (!d || !v) return;
  day(d).activeMin = v.activeMinutesRollupByActivityLevel
    .filter((l) => l.activityLevel !== "LIGHT" && l.activityLevel !== "ACTIVITY_LEVEL_UNSPECIFIED")
    .reduce((a, l) => a + Number(l.activeMinutesSum || 0), 0);
}));

await step("FC en reposo", () => list("daily-resting-heart-rate", `daily_resting_heart_rate.date >= "${since}"`, 1000, (p) => {
  const v = p.dailyRestingHeartRate;
  const d = fromCivil({ date: v?.date });
  if (d && v.beatsPerMinute != null) day(d).restingHr = Number(v.beatsPerMinute);
}));

// Sleep counts toward the day you woke up; naps on the same day are added. The API returns the
// session as UTC endTime + endUtcOffset (e.g. "-18000s"), not civilEndTime, so the local wake-up
// date is computed from those; the civil-time filter also returned too few sessions, so filter on
// the physical end time instead.
const localDate = (utc, offset) => {
  if (!utc) return null;
  const secs = Number(String(offset || "0s").replace("s", "")) || 0;
  return new Date(Date.parse(utc) + secs * 1000).toISOString().slice(0, 10);
};
await step("sueño", () => list("sleep", `sleep.interval.end_time >= "${since}T00:00:00Z"`, 25, (p) => {
  const s = p.sleep;
  const d = fromCivil(s?.interval?.civilEndTime) || localDate(s?.interval?.endTime, s?.interval?.endUtcOffset);
  const mins = Number(s?.summary?.minutesAsleep || 0);
  if (d && mins) day(d).sleepMin = (day(d).sleepMin || 0) + mins;
}));

// Days before this run's window are kept from the previous days.json, so the history keeps growing.
let kept = [];
try { kept = JSON.parse(fs.readFileSync(OUT, "utf8")).days.filter((d) => d.date < since); } catch {}
const fresh = Object.values(days).filter((d) => d.date >= since && d.date <= today);
const out = [...kept, ...fresh].sort((a, b) => a.date.localeCompare(b.date));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ source: "Google Health", syncedAt: new Date().toISOString(), ...(ENV.BIRTH_DATE ? { birthDate: ENV.BIRTH_DATE } : {}), days: out }));
console.log(`\nListo: ${out.length} días en ${OUT}`);
