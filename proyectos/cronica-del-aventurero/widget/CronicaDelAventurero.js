// Crónica del Aventurero · Scriptable widget (small, medium and large).
// Shows the current week of https://www.andresb.dev/proyectos/cronica-del-aventurero/:
// level and class, HP/MP/XP, this week's boss, steps and sleep against the goals and, on the
// large size, the Sage's advice and this week's chapter. The data is refreshed every morning by
// the site; the widget keeps the last copy it downloaded so it still works offline.
//
// Install: Scriptable → + → paste this script → name it "Crónica del Aventurero". Then add a
// Scriptable widget to the home screen, edit it and choose this script.

const BASE = "https://www.andresb.dev/proyectos/cronica-del-aventurero/";
const DATA = BASE + "data/widget/";

const C = {
  top: new Color("#2a3dae"), bottom: new Color("#0a1452"), frame: new Color("#eef0ff"),
  ink: new Color("#f4f5ff"), muted: new Color("#aeb6ec"), gold: new Color("#ffd75e"),
  hp: new Color("#52e08c"), mp: new Color("#62b6ff"), xp: new Color("#ffd75e"), red: new Color("#ff7a7a"),
  track: new Color("#050b33"),
};
const pixel = (size) => new Font("Menlo-Bold", size);
const body = (size) => Font.mediumRoundedSystemFont(size);

// ---- data, with an offline copy -------------------------------------------------------
const fm = FileManager.local();
const dir = fm.joinPath(fm.documentsDirectory(), "cronica-widget");
if (!fm.fileExists(dir)) fm.createDirectory(dir, true);
const cached = (name) => fm.joinPath(dir, name);

async function loadData() {
  try {
    const req = new Request(DATA + "widget.json?t=" + Date.now());
    req.timeoutInterval = 15;
    const data = await req.loadJSON();
    fm.writeString(cached("widget.json"), JSON.stringify(data));
    return data;
  } catch (e) {
    if (fm.fileExists(cached("widget.json"))) return JSON.parse(fm.readString(cached("widget.json")));
    throw new Error("Sin conexión y sin datos guardados todavía.");
  }
}
async function loadSprite(name, stamp) {
  const file = cached(name + ".png"), stampFile = cached(name + ".stamp");
  const fresh = fm.fileExists(file) && fm.fileExists(stampFile) && fm.readString(stampFile) === stamp;
  if (!fresh) {
    try {
      const img = await new Request(DATA + name + ".png?t=" + encodeURIComponent(stamp)).loadImage();
      fm.writeImage(file, img);
      fm.writeString(stampFile, stamp);
      return img;
    } catch (e) { /* fall back to the saved copy */ }
  }
  return fm.fileExists(file) ? fm.readImage(file) : null;
}

// ---- drawing helpers --------------------------------------------------------------------
function bar(ratio, color, width, height) {
  const ctx = new DrawContext();
  ctx.size = new Size(width, height);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  ctx.setFillColor(C.frame);
  ctx.fillRect(new Rect(0, 0, width, height));
  ctx.setFillColor(C.track);
  ctx.fillRect(new Rect(1.5, 1.5, width - 3, height - 3));
  const r = Math.max(0, Math.min(1, ratio || 0));
  if (r > 0) {
    ctx.setFillColor(color);
    ctx.fillRect(new Rect(1.5, 1.5, Math.max(2, (width - 3) * r), height - 3));
  }
  return ctx.getImage();
}
function text(stack, value, font, color, lines = 1) {
  const t = stack.addText(String(value));
  t.font = font;
  t.textColor = color;
  t.lineLimit = lines;
  t.minimumScaleFactor = 0.7;
  return t;
}
function meter(stack, label, color, value, max, width, valueText) {
  const row = stack.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  const l = text(row, label, pixel(9), color);
  l.minimumScaleFactor = 1;
  row.addSpacer(4);
  row.addImage(bar(value / max, color, width, 7)).imageSize = new Size(width, 7);
  row.addSpacer(4);
  text(row, valueText ?? `${value}`, pixel(9), C.ink);
}
const n0 = (v) => Math.round(v || 0).toLocaleString("es-CO");
function sprite(stack, img, size) {
  if (!img) return;
  const w = stack.addImage(img);
  w.imageSize = new Size(size, size);
}

// ---- layouts ----------------------------------------------------------------------------
function header(widget, d) {
  const row = widget.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  text(row, "CRÓNICA", pixel(10), C.gold);
  row.addSpacer();
  const when = d.syncedAt ? new Date(d.syncedAt) : null;
  if (when) {
    const df = new DateFormatter();
    df.dateFormat = "d MMM HH:mm";
    df.locale = "es_CO";
    text(row, df.string(when), pixel(8), C.muted);
  }
}
function heroBlock(stack, d, img, size) {
  const row = stack.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  sprite(row, img, size);
  row.addSpacer(6);
  const col = row.addStack();
  col.layoutVertically();
  text(col, d.name.toUpperCase(), pixel(11), C.ink);
  text(col, d.job, body(12), C.gold);
  text(col, `NV ${d.level} · ${d.wins} jefes`, pixel(9), C.muted);
}
function bossBlock(stack, d, img, size, barWidth) {
  const b = d.boss;
  const row = stack.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  sprite(row, img, size);
  row.addSpacer(6);
  const col = row.addStack();
  col.layoutVertically();
  text(col, b.status === "derrotado" ? "¡DERROTADO!" : "JEFE", pixel(8), b.status === "derrotado" ? C.gold : C.muted);
  text(col, b.name, pixel(11), C.red);
  col.addSpacer(2);
  col.addImage(bar(b.hp / b.maxHp, C.red, barWidth, 7)).imageSize = new Size(barWidth, 7);
  text(col, `${n0(b.hp)}/${n0(b.maxHp)} PV`, pixel(8), C.ink);
}
function weekBlock(stack, d, width) {
  const w = d.week;
  meter(stack, "PAS", C.gold, w.steps, w.stepsGoal, width, `${n0(w.steps)}/${n0(w.stepsGoal)}`);
  stack.addSpacer(3);
  meter(stack, "ACT", C.hp, w.activeMin, w.activeGoal, width, `${w.activeMin}/${w.activeGoal} min`);
  stack.addSpacer(3);
  meter(stack, "SUE", C.mp, w.sleepH, w.sleepGoal, width, `${w.sleepH}/${w.sleepGoal} h`);
}

function small(widget, d, s) {
  header(widget, d);
  widget.addSpacer(6);
  heroBlock(widget, d, s.hero, 40);
  widget.addSpacer(4);
  meter(widget, "XP", C.xp, d.xp.value, d.xp.next, 54, `${Math.round((d.xp.value / d.xp.next) * 100)}%`);
  widget.addSpacer();
  bossBlock(widget, d, s.boss, 32, 70);
}
function medium(widget, d, s) {
  header(widget, d);
  widget.addSpacer(6);
  const row = widget.addStack();
  row.layoutHorizontally();
  const left = row.addStack();
  left.layoutVertically();
  heroBlock(left, d, s.hero, 44);
  left.addSpacer(6);
  meter(left, "PV", C.hp, d.hp, 999, 66, `${d.hp}`);
  left.addSpacer(3);
  meter(left, "PM", C.mp, d.mp, 999, 66, `${d.mp}`);
  left.addSpacer(3);
  meter(left, "XP", C.xp, d.xp.value, d.xp.next, 66, `${Math.round((d.xp.value / d.xp.next) * 100)}%`);
  row.addSpacer();
  const right = row.addStack();
  right.layoutVertically();
  bossBlock(right, d, s.boss, 36, 84);
  right.addSpacer(6);
  weekBlock(right, d, 42);
}
function large(widget, d, s) {
  medium(widget, d, s);
  widget.addSpacer(10);
  if (d.sage?.tip) {
    const box = widget.addStack();
    box.layoutHorizontally();
    box.setPadding(8, 8, 8, 8);
    box.backgroundColor = new Color("#000000", 0.22);
    box.borderColor = new Color("#ffffff", 0.25);
    box.borderWidth = 1;
    box.cornerRadius = 4;
    sprite(box, s.sage, 34);
    box.addSpacer(8);
    const col = box.addStack();
    col.layoutVertically();
    text(col, "CONSEJO DEL SABIO", pixel(8), C.muted);
    text(col, d.sage.tip.title, pixel(10), C.gold, 2);
    text(col, d.sage.tip.action, body(12), C.ink, 4);
  }
  if (d.sage?.mission) {
    widget.addSpacer(8);
    text(widget, "MISIÓN EXTRA", pixel(8), C.muted);
    text(widget, d.sage.mission, body(12), C.ink, 3);
  }
  widget.addSpacer();
  if (d.chapter) {
    text(widget, "LA CRÓNICA DE ESTA SEMANA", pixel(8), C.muted);
    text(widget, d.chapter, body(13), C.ink, 2);
  }
  if (d.age) {
    widget.addSpacer(4);
    text(widget, `Edad real ${d.age.real} · fisiológica ${d.age.phys}`, pixel(8), C.muted);
  }
}

// ---- main ---------------------------------------------------------------------------------
const widget = new ListWidget();
const g = new LinearGradient();
g.colors = [C.top, C.bottom];
g.locations = [0, 1];
widget.backgroundGradient = g;
widget.setPadding(12, 14, 12, 14);
widget.url = BASE;
widget.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

const family = config.widgetFamily || "medium";
try {
  const d = await loadData();
  const stamp = d.generatedAt || d.syncedAt || "";
  const s = { hero: await loadSprite("hero", stamp), boss: await loadSprite("boss", stamp), sage: family === "large" ? await loadSprite("sage", stamp) : null };
  if (family === "small") small(widget, d, s);
  else if (family === "large") large(widget, d, s);
  else medium(widget, d, s);
} catch (e) {
  text(widget, "CRÓNICA", pixel(10), C.gold);
  widget.addSpacer(6);
  text(widget, e.message, body(12), C.ink, 3);
}

if (config.runsInWidget) {
  Script.setWidget(widget);
} else if (family === "large") {
  await widget.presentLarge();
} else if (family === "small") {
  await widget.presentSmall();
} else {
  await widget.presentMedium();
}
Script.complete();
