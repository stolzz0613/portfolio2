#!/usr/bin/env node
// Writes data/widget/ for the Scriptable widget (static/proyectos/cronica-del-aventurero/widget/):
// widget.json with the current week as the page computes it (level, bars, boss, steps against the
// goals), the Sage's first piece of advice and this week's chapter title, plus the hero, boss and
// Sage sprites pre-scaled to 128 px with hard pixel edges. Run after sync.mjs (and the Sage and
// chronicle steps, so their latest text is included):
//
//   node scripts/cronica/widget.mjs

import fs from "node:fs";
import path from "node:path";
import { ROOT, openPage, readJson, writeJson } from "./lib.mjs";

const OUT = path.join(ROOT, "data/widget");
let page, close;
try {
  ({ page, close } = await openPage());
  const summary = await page.evaluate(() => widgetSummary());
  const sprites = await page.evaluate(async (t) => ({ hero: await tilePng(t.hero), boss: await tilePng(t.boss), sage: await tilePng(t.sage) }), summary.tiles);
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, url] of Object.entries(sprites)) fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(url.split(",")[1], "base64"));

  const sage = readJson(path.join(ROOT, "data/sabio.json"), { weeks: {} }).weeks?.[summary.weekStart];
  const chapter = readJson(path.join(ROOT, "data/cronica.json"), { weeks: {} }).weeks?.[summary.weekStart];
  delete summary.tiles;
  writeJson(path.join(OUT, "widget.json"), {
    ...summary,
    sage: sage ? { greeting: sage.saludo, tip: sage.consejos?.[0] ? { title: sage.consejos[0].titulo, action: sage.consejos[0].accion } : null, mission: sage.mision } : null,
    chapter: chapter ? chapter.titulo : null,
    generatedAt: new Date().toISOString(),
  });
  console.log(`Widget: nivel ${summary.level} ${summary.job}, ${summary.boss.name} ${summary.boss.hp}/${summary.boss.maxHp} PV → ${OUT}`);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (close) await close();
}
