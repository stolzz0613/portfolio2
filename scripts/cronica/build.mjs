#!/usr/bin/env node
// Applies the choices made when the GitHub Action is run by hand to data/build.json: the character's
// path, the talents to learn and the pet's name. The page's own rules check level, points and order,
// and a choice that breaks them stops the run with the reason, so nothing is half applied.
//
//   SENDA=viento TALENTOS=zancada,temple MASCOTA=Brizna node scripts/cronica/build.mjs
//
// TALENTOS takes the codes shown in the Progreso tab; "-zancada" removes one learned this week.

import path from "node:path";
import { ROOT, openPage, writeJson } from "./lib.mjs";

const senda = process.env.SENDA === "sin cambio" ? "" : process.env.SENDA || "";
const choices = { senda, talentos: process.env.TALENTOS || "", mascota: process.env.MASCOTA || "" };
if (!choices.senda && !choices.talentos.trim() && !choices.mascota.trim()) {
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
    console.log(`Guardado: senda ${build.path || "sin elegir"}, ${Object.keys(build.talents).length} talento(s), mascota "${build.petName}".`);
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (close) await close();
}
