// Crónica del Aventurero · Scriptable widget (small, medium and large).
// Shows the current week of https://www.andresb.dev/proyectos/cronica-del-aventurero/:
// level and class, the pet or its egg, the week's missions with their pace and the boss. The large
// size adds the pet's gift, the Sage's advice and this week's chapter. The data is refreshed every
// morning by the site; the widget keeps the last copy it downloaded so it still works offline.
//
// Install: Scriptable → + → paste this script → name it "Crónica del Aventurero". Then add a
// Scriptable widget to the home screen, edit it and choose this script.

const BASE = "https://www.andresb.dev/proyectos/cronica-del-aventurero/";
const DATA = BASE + "data/widget/";

const C = {
  top: new Color("#0c0e14"), bottom: new Color("#2b1a10"), panel: new Color("#ffffff", 0.06),
  cream: new Color("#f6efe1"), mist: new Color("#aeb4c2"), ember: new Color("#f5853f"), track: new Color("#272c3a"),
  steps: new Color("#f5853f"), active: new Color("#35c9a0"), sleep: new Color("#8f86ff"), heart: new Color("#ff5c7a"),
  ok: new Color("#5fdb90"), warn: new Color("#f6c453"), bad: new Color("#ff7a7a"), info: new Color("#aeb4c2"),
};
const black = (size) => Font.blackSystemFont(size);
const bold = (size) => Font.boldSystemFont(size);
const body = (size) => Font.mediumSystemFont(size);

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
function canvas(width, height) {
  const ctx = new DrawContext();
  ctx.size = new Size(width, height);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  return ctx;
}
function rounded(ctx, x, y, w, h, r, color) {
  const p = new Path();
  p.addRoundedRect(new Rect(x, y, w, h), r, r);
  ctx.addPath(p);
  ctx.setFillColor(color);
  ctx.fillPath();
}
// A meter; `tick` marks where the week should be by now.
function bar(ratio, color, width, height, tick) {
  const pad = tick == null ? 0 : 2, ctx = canvas(width, height + pad * 2), r = height / 2;
  rounded(ctx, 0, pad, width, height, r, C.track);
  const v = Math.max(0, Math.min(1, ratio || 0));
  if (v > 0) rounded(ctx, 0, pad, Math.max(height, width * v), height, r, color);
  if (tick != null) rounded(ctx, Math.min(width - 2, width * tick - 1), 0, 2, height + pad * 2, 1, C.cream);
  return ctx.getImage();
}
function segments(ratio, width, height, count = 14) {
  const gap = 2, w = (width - gap * (count - 1)) / count, on = Math.round(Math.max(0, Math.min(1, ratio || 0)) * count), ctx = canvas(width, height);
  for (let i = 0; i < count; i++) rounded(ctx, i * (w + gap), 0, w, height, 1, i < on ? C.ember : C.track);
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
function image(stack, img, width, height = width) {
  if (!img) return;
  stack.addImage(img).imageSize = new Size(width, height);
}
function row(stack) {
  const s = stack.addStack();
  s.layoutHorizontally();
  s.centerAlignContent();
  return s;
}
function column(stack) {
  const s = stack.addStack();
  s.layoutVertically();
  return s;
}
const n0 = (v) => Math.round(v || 0).toLocaleString("es-CO");

// ---- blocks -------------------------------------------------------------------------------
function level(stack, d, size) {
  const r = row(stack);
  r.bottomAlignContent();
  text(r, "NV", black(Math.round(size * 0.42)), C.ember);
  r.addSpacer(3);
  const n = text(r, d.level, black(size), C.cream);
  n.shadowColor = C.ember;
  n.shadowOffset = new Point(1.5, 1.5);
  n.shadowRadius = 0;
}
function identity(stack, d, size) {
  const col = column(stack);
  level(col, d, size);
  text(col, d.job.toUpperCase(), bold(10), C.ember);
}
function xp(stack, d, width) {
  image(stack, segments(d.xp.value / d.xp.next, width, 6), width, 6);
  stack.addSpacer(3);
  const stale = d.syncedAt ? Math.floor((Date.now() - new Date(d.syncedAt)) / 864e5) : 0;
  if (stale >= 2) text(stack, `Datos de hace ${stale} días`, body(10), C.warn);
  else text(stack, `${n0(d.toNext ?? d.xp.next - d.xp.value)} XP para NV ${d.level + 1}`, body(10), C.mist);
}
const petLine = (p) => p.state === "pet" ? `${p.stage} · NV ${p.level}`
  : p.waiting ? "Esperando datos" : `Día ${p.day} · ${p.leader}`;
function petRow(stack, d, img, size, width) {
  if (!d.pet) return;
  const r = row(stack);
  r.size = new Size(width, 0);
  image(r, img, size);
  r.addSpacer(5);
  const col = column(r);
  text(col, d.pet.state === "pet" ? d.pet.name : "Huevo", bold(11), C.cream);
  text(col, petLine(d.pet), body(10), C.mist);
}
function bossRow(stack, d, img, size, width) {
  const b = d.boss, won = b.status === "derrotado", r = row(stack);
  if (size) {
    image(r, img, size);
    r.addSpacer(6);
  }
  const col = column(r), head = row(col);
  head.size = new Size(width, 0);
  text(head, b.name, bold(11), won ? C.ok : C.cream);
  head.addSpacer();
  text(head, won ? "Vencido" : width < 110 ? n0(b.hp) : `${n0(b.hp)} PV`, body(10), won ? C.ok : C.mist);
  col.addSpacer(3);
  image(col, bar(b.hp / b.maxHp, C.heart, width, 5), width, 5);
}
function missionRow(stack, m, width) {
  const head = row(stack);
  head.size = new Size(width, 0);
  text(head, m.label, bold(10), C.cream);
  head.addSpacer(4);
  text(head, m.value, body(10), C.mist);
  head.addSpacer();
  text(head, m.status, bold(10), C[m.kind] || C.info);
  stack.addSpacer(2);
  const height = m.tick == null ? 5 : 9;
  image(stack, bar(m.pct, C[m.key], width, 5, m.tick), width, height);
}
function missionList(stack, d, width, count) {
  (d.missions || []).slice(0, count).forEach((m, i) => {
    if (i) stack.addSpacer(4);
    missionRow(stack, m, width);
  });
}
function panel(stack) {
  const box = stack.addStack();
  box.layoutHorizontally();
  box.centerAlignContent();
  box.setPadding(6, 8, 6, 8);
  box.backgroundColor = C.panel;
  box.cornerRadius = 8;
  return box;
}
const label = (stack, value) => text(stack, value, bold(9), C.mist);

// ---- layouts ------------------------------------------------------------------------------
// Widget sizes follow the phone, so every width comes from the space really available.
const phone = Math.min(Device.screenSize().width, Device.screenSize().height);
const wide = phone >= 414 ? 360 : phone >= 390 ? 338 : 322, narrow = phone >= 414 ? 170 : phone >= 390 ? 158 : 148;
const PAD = 14;

function top(stack, d, s, width) {
  const r = row(stack);
  r.size = new Size(width, 0);
  identity(r, d, 30);
  r.addSpacer();
  image(r, s.hero, 54);
  stack.addSpacer(2);
  petRow(stack, d, s.pet, 26, width);
  stack.addSpacer(4);
  xp(stack, d, width);
}
function small(widget, d, s) {
  const inner = narrow - PAD * 2;
  top(widget, d, s, inner);
  widget.addSpacer();
  bossRow(widget, d, s.boss, 18, inner - 24);
}
function medium(widget, d, s, height) {
  const inner = wide - PAD * 2, leftW = Math.round(inner * 0.42), rightW = inner - leftW - 14;
  const r = widget.addStack();
  r.layoutHorizontally();
  r.topAlignContent();
  r.size = new Size(inner, height);
  const left = column(r);
  left.size = new Size(leftW, height);
  top(left, d, s, leftW);
  r.addSpacer();
  const right = column(r);
  right.size = new Size(rightW, height);
  right.addSpacer(2);
  missionList(right, d, rightW, 3);
  right.addSpacer();
  bossRow(right, d, s.boss, 24, rightW - 30);
}
function card(widget, img, inner) {
  const box = panel(widget);
  box.size = new Size(inner, 0);
  image(box, img, 36);
  box.addSpacer(8);
  const col = column(box);
  col.size = new Size(inner - 36 - 8 - 16, 0);
  return col;
}
function large(widget, d, s) {
  const inner = wide - PAD * 2;
  medium(widget, d, s, 116);
  widget.addSpacer(8);
  if (d.pet?.state === "pet") {
    const col = card(widget, s.pet, inner);
    label(col, `REGALO DE ${d.pet.name.toUpperCase()} · ${d.pet.mood.toUpperCase()}`);
    text(col, d.pet.gift, bold(12), C.cream);
    if (d.pet.next) {
      col.addSpacer(3);
      const w = inner - 36 - 8 - 16;
      image(col, bar((d.pet.bond - d.pet.floor) / (d.pet.next - d.pet.floor), C.ember, w, 5), w, 5);
    }
    widget.addSpacer(6);
  } else if (d.pet?.state === "egg" && !d.pet.waiting) {
    const col = card(widget, s.pet, inner);
    label(col, "HACIA DÓNDE SE INCLINA EL HUEVO");
    text(col, `${d.pet.leader}: ${d.pet.share} %`, bold(12), C.cream);
    widget.addSpacer(6);
  }
  if (d.sage?.tip) {
    const col = card(widget, s.sage, inner);
    label(col, "CONSEJO DEL SABIO");
    text(col, d.sage.tip.title, bold(12), C.ember);
    text(col, d.sage.tip.action, body(11), C.cream, 2);
  }
  widget.addSpacer();
  if (d.chapter) {
    label(widget, "LA CRÓNICA DE ESTA SEMANA");
    text(widget, d.chapter, bold(12), C.cream);
  }
  if (d.age) {
    widget.addSpacer(2);
    text(widget, `Edad real ${d.age.real} · fisiológica ${String(d.age.phys).replace(".", ",")}`, body(10), C.mist);
  }
}

// ---- main ---------------------------------------------------------------------------------
const widget = new ListWidget();
const g = new LinearGradient();
g.colors = [C.top, C.bottom];
g.locations = [0.35, 1];
g.startPoint = new Point(0, 0);
g.endPoint = new Point(1, 1);
widget.backgroundGradient = g;
widget.setPadding(12, PAD, 12, PAD);
widget.url = BASE;
widget.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

const family = config.widgetFamily || "medium";
try {
  const d = await loadData();
  const stamp = d.generatedAt || d.syncedAt || "";
  const s = {
    hero: await loadSprite("hero", stamp), boss: await loadSprite("boss", stamp),
    pet: d.pet ? await loadSprite("pet", stamp) : null, sage: family === "large" ? await loadSprite("sage", stamp) : null,
  };
  if (family === "small") small(widget, d, s);
  else if (family === "large") large(widget, d, s);
  else medium(widget, d, s, 134);
} catch (e) {
  text(widget, "CRÓNICA", black(14), C.ember);
  widget.addSpacer(6);
  text(widget, e.message, body(12), C.cream, 3);
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
