#!/usr/bin/env node
// Writes the campaign's chronicle ("La crónica") into data/cronica.json for the copy of
// "Crónica del Aventurero" published on andresb.dev: one chapter per week, in order, each built
// with the page's own chronicler prompt and the summaries of the chapters before it.
//
// A week gets a chapter when it has none, when it's the current week (rewritten every day until
// it ends), or when its outcome changed since it was written (e.g. a battle still under way that
// ended with the boss escaping). So the first run also writes every past week. Run after sync.mjs:
//
//   ANTHROPIC_API_KEY=... [ANTHROPIC_WORKSPACE_ID=...] node scripts/cronica/cronica.mjs

import path from "node:path";
import { ROOT, askClaude, explainError, openPage, readJson, writeJson } from "./lib.mjs";

const OUT = path.join(ROOT, "data/cronica.json");
const CHAPTER_SCHEMA = {
  type: "object",
  properties: { titulo: { type: "string" }, texto: { type: "string" }, resumen: { type: "string" } },
  required: ["titulo", "texto", "resumen"],
  additionalProperties: false,
};

let page, info, close;
try {
  ({ page, info, close } = await openPage());
} catch (e) {
  console.error(explainError(e));
  process.exit(1);
}

const saved = readJson(OUT, { weeks: {}, prologue: null });
saved.weeks ||= {};
const last = info.weeks.length - 1;
let written = 0, failed = 0;
try {
  for (const [i, week] of info.weeks.entries()) {
    const ch = saved.weeks[week.start];
    if (ch && i !== last && ch.status === week.status) continue;
    try {
      const prompt = await page.evaluate(({ i, chapters }) => window.cronica.chapterPrompt(i, chapters), { i, chapters: saved });
      const { answer, model } = await askClaude(prompt, CHAPTER_SCHEMA);
      saved.weeks[week.start] = { ...answer, status: week.status, createdAt: Date.now(), model };
      writeJson(OUT, saved); // after every chapter, so a failure later keeps what's done
      written++;
      console.log(`  ${week.start} (${week.status}): ${answer.titulo}`);
    } catch (e) {
      // Later chapters build on this one, so stop here; the next run picks up from this week.
      console.error(`  ${week.start}: ${explainError(e)}`);
      failed++;
      break;
    }
  }
} finally {
  await close();
}
console.log(`Crónica: ${written} capítulo(s) escrito(s), ${Object.keys(saved.weeks).length} de ${info.weeks.length} semanas con capítulo.`);
if (failed) process.exit(1);
