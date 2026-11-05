#!/usr/bin/env node
// Applies the choices made when the GitHub Action is run by hand to data/build.json: the character's
// path and class, the talents to learn, the dungeon to enter and the pet's name. The page's own rules check level, points and order,
// and a choice that breaks them stops the run with the reason, so nothing is half applied.
//
//   SENDA=viento CLASE=montaraz TALENTOS=zancada,temple MAZMORRA=cripta MASCOTA=Brizna node scripts/cronica/build.mjs
//
// TALENTOS takes the codes shown in the Progreso tab; "-zancada" removes one learned this week.

import path from "node:path";
import { ROOT, openPage, writeJson } from "./lib.mjs";

const pick = (v) => (v === "sin cambio" ? "" : (v || "").trim());
const choices = { senda: pick(process.env.SENDA), clase: pick(process.env.CLASE), talentos: process.env.TALENTOS || "", mazmorra: pick(process.env.MAZMORRA), mascota: process.env.MASCOTA || "" };
if (!choices.senda && !choices.clase && !choices.mazmorra && !choices.talentos.trim() && !choices.mascota.trim()) {
  console.log("Sin elecciones nuevas.");
  process.exit(0);
}

let close;
try {
  const opened = await openPage();
  close = opened.close;
  const { errors, build } = await opened.page.evaluate((c) => window.cronica.applyChoices(c), choices);
  if (errors.length) {
    for (const e of errors) console.error(`  ${e}`);
    console.error("No se guardó ninguna elección.");
    process.exitCode = 1;
  } else {
    writeJson(path.join(ROOT, "data/build.json"), build);
    console.log(`Guardado: senda ${build.path || "sin elegir"}, clase ${build.spec2?.id || build.spec?.id || "sin elegir"}, ${Object.keys(build.talents).length} talento(s), mazmorra ${build.dungeons.at(-1)?.id || "sin elegir"}, mascota "${build.petName}".`);
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (close) await close();
}
