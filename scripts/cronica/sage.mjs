#!/usr/bin/env node
// Writes the Sage's advice for the current week into data/sabio.json for the copy of
// "Crónica del Aventurero" published on andresb.dev, where the page can't call Claude itself.
//
// It takes exactly the prompt the page would send (same adaptive goals, campaign and
// physiological age), asks Claude, and keeps one entry per week. Run it after sync.mjs:
//
//   ANTHROPIC_API_KEY=... [ANTHROPIC_WORKSPACE_ID=...] node scripts/cronica/sage.mjs

import path from "node:path";
import { ROOT, askClaude, explainError, openPage, readJson, writeJson } from "./lib.mjs";

const OUT = path.join(ROOT, "data/sabio.json");
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

try {
  const { info, close } = await openPage();
  await close();
  if (typeof info.prompt !== "string" || !info.prompt.trim()) throw new Error("La página no devolvió el prompt del Sabio.");
  const { answer, model } = await askClaude(info.prompt, ANSWER_SCHEMA);
  const saved = readJson(OUT, { weeks: {} });
  saved.weeks[info.week] = { ...answer, consejos: answer.consejos.slice(0, 3), generatedAt: new Date().toISOString(), model };
  writeJson(OUT, saved);
  console.log(`Consejos del Sabio para la semana del ${info.week} guardados en ${OUT}`);
} catch (e) {
  console.error(explainError(e));
  process.exit(1);
}
