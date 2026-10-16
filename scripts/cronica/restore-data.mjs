#!/usr/bin/env node
// The published copy on the gh-pages branch is where "Crónica del Aventurero" keeps its data:
// the daily GitHub Action can't commit to master (it's protected), so it deploys days.json and
// sabio.json straight to gh-pages. This copies the published files back into static/ before a
// sync or a build, so the history keeps growing and a manual `npm run deploy` doesn't roll the
// live data back to the older copy in master.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FILES = ["days.json", "sabio.json"];
const git = (...args) => execFileSync("git", args, { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

try {
  git("fetch", "--quiet", "--depth", "1", "origin", "gh-pages");
} catch (e) {
  console.warn(`No se pudo leer la rama gh-pages; se usan los datos de static/. (${e.stderr?.trim() || e.message})`);
  process.exit(0);
}
for (const name of FILES) {
  let content;
  try {
    content = git("show", `FETCH_HEAD:proyectos/cronica-del-aventurero/data/${name}`);
  } catch {
    console.log(`  ${name}: todavía no está publicado, se queda el de static/`);
    continue;
  }
  const out = path.join(REPO, "static/proyectos/cronica-del-aventurero/data", name);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
  console.log(`  ${name}: recuperado de gh-pages`);
}
