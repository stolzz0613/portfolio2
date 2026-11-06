#!/usr/bin/env node
// Records the owner's choices in data/build.json. The page reads them from Firebase and applies the
// game's rules as it loads, so this saves the result: from here on the week stamped on each choice
// stays put. If Firebase can't be reached, the page falls back to the published file and nothing changes.

import path from "node:path";
import { ROOT, openPage, writeJson } from "./lib.mjs";

let close;
try {
  const opened = await openPage();
  close = opened.close;
  const { build, skipped } = await opened.page.evaluate(() => window.cronica.choices());
  for (const reason of skipped) console.warn(`  Sin aplicar: ${reason}`);
  writeJson(path.join(ROOT, "data/build.json"), build);
  console.log(`Guardado: senda ${build.path || "sin elegir"}, clase ${build.spec2?.id || build.spec?.id || "sin elegir"}, ${Object.keys(build.talents).length} talento(s), mazmorra ${build.dungeons.at(-1)?.id || "sin elegir"}, mascota "${build.petName}".`);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (close) await close();
}
