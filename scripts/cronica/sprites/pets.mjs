// Pets: five lines of beasts. Stages 0-4 grow in size and presence; from stage 2 each has two forms
// (line "a" or "b"), decided in game.js by what you did while it was young.
import { Sprite, ramp, smooth, hex, mix } from './engine.mjs';
const S = 84, BASE = 78;
const PAL = {
  senda: { a: { a: '#d9702c', b: '#f4e6d0', c: '#6e2a1c', acc: '#58e0cf', eye: '#ffe08a', rim: '#ffb46a' }, b: { a: '#2c3f6e', b: '#dfe8f6', c: '#141c3a', acc: '#ffe25a', eye: '#ffe25a', rim: '#ffe25a' } },
  forja: { a: { a: '#b23a2c', b: '#f0b45a', c: '#4a1216', acc: '#ffb636', eye: '#ffe07a', rim: '#ff8a4a' }, b: { a: '#2c2830', b: '#7a6a70', c: '#121014', acc: '#ff5a2a', eye: '#ff7a3a', rim: '#ff5a2a' } },
  noche: { a: { a: '#3f3c9e', b: '#cfd2f6', c: '#1c1a52', acc: '#ffe28f', eye: '#ffc65a', rim: '#a8a2ff' }, b: { a: '#5e1f3c', b: '#e6b8c8', c: '#280a1a', acc: '#ff5a7a', eye: '#ff7a9a', rim: '#ff7a9a' } },
  roca: { a: { a: '#4f8f62', b: '#d8dca0', c: '#1f4a34', acc: '#a9e85f', eye: '#fff0a8', rim: '#c8f08a', sh: '#7a5e44' }, b: { a: '#2f7f8f', b: '#d0f0e8', c: '#123a48', acc: '#ff8fa8', eye: '#c8fff0', rim: '#8fe8ff', sh: '#3a5f78' } },
  marea: { a: { a: '#e0799c', b: '#ffdce8', c: '#7a2a50', acc: '#6adcff', eye: '#fff4c9', rim: '#ffb8d0' }, b: { a: '#1f6e7a', b: '#b8f0e0', c: '#0c3440', acc: '#6affd8', eye: '#c8fff0', rim: '#6affd8' } },
};
const SIZE = [.5, .68, .84, .94, 1];
function frame(s, stage, line, id) {
  const p = PAL[id][stage >= 2 ? line : 'a'], k = SIZE[stage];
  const R = { a: ramp(p.a), b: ramp(p.b), c: ramp(p.c), acc: ramp(p.acc), sh: ramp(p.sh || p.c) };
  const X = (x) => 42 + (x - 42) * k, Y = (y) => BASE - (BASE - y) * k;
  const P = (pts) => pts.map(([x, y]) => [X(x), Y(y)]);
  const L = (chain) => chain.map(([x, y, r]) => [X(x), Y(y), Math.max(.8, r * k)]);
  return { p, k, R, X, Y, P, L };
}
const glow = (s, c, n = 26, r = 34, cy = 44) => { for (let i = 0; i < n; i++) { const a = i * 2.4, q = r + (i * 5) % 9, x = Math.round(42 + Math.cos(a) * q * 1.1), y = Math.round(cy + Math.sin(a) * q * .9); s.put(x, y, hex(c)); } };
const finish = (s, f, stage) => { if (stage >= 3) glow(s, f.p.rim, stage === 4 ? 34 : 20); return s.finish({ rim: f.p.rim, rimStrength: .5 }); };
function quad(s, f, o) { // A lean four-legged body facing right.
  const { R, P, L } = f, sh = Math.max(1, Math.round(3 * f.k));
  s.part(s.limb(L([[30, 56, 4.4], [34, 66, 3.4], [33, 76, 2.8]])), R.c, { sh: 1 });
  s.part(s.limb(L([[56, 56, 4], [60, 66, 3.2], [60, 76, 2.6]])), R.c, { sh: 1 });
  s.part(s.blob(P(o.body || [[20, 45], [34, 38], [52, 38], [62, 45], [60, 56], [46, 60], [30, 60], [20, 55]])), R.a, { sh, deep: 1 });
  s.part(s.blob(P([[36, 56], [52, 54], [56, 58], [44, 60], [34, 60]])), R.b, { sh: 1, deep: 0, line: false });
  s.part(s.limb(L([[25, 54, 5], [21, 66, 3.6], [24, 76, 3]])), R.a, { sh: 2 });
  s.part(s.limb(L([[50, 54, 4.6], [50, 66, 3.4], [53, 76, 2.8]])), R.a, { sh: 2 });
}
const drawers = {
  senda(s, stage, line) {
    const f = frame(s, stage, line, 'senda'), { R, P, L, p } = f;
    s.shadow(40, 79, 18 + stage * 5, 3);
    const tails = [1, 1, 2, 3, 5][stage];
    for (let i = 0; i < tails; i++) { const t = (i - (tails - 1) / 2) * 11; s.part(s.limb(L([[24, 47, 3.4], [10 - t * .4, 42 - t, 7], [4 - t * .6, 26 - t * 1.1, 6], [12 - t * .7, 10 - t, 1.4]])), R.a, { sh: 3, deep: 1 }); s.part(s.limb(L([[7 - t * .6, 20 - t * 1.1, 4], [12 - t * .7, 10 - t, 1.4]])), R.b, { sh: 1, deep: 0, line: false }); }
    quad(s, f, {});
    s.part(s.limb(L([[56, 46, 7], [62, 36, 5.6]])), R.a, { sh: 2 });
    s.part(s.limb(L([[52, 40, 3], [60, 42, 4], [58, 50, 2]])), R.b, { sh: 1, deep: 0, line: false });
    s.part(s.poly(P([[58, 26], [59, 8], [66, 20]])), R.a, { sh: 1, deep: 0 }); s.part(s.poly(P([[66, 22], [72, 8], [73, 25]])), R.a, { sh: 1, deep: 0 }); s.part(s.poly(P([[68, 20], [71, 13], [71, 24]])), R.c, { sh: 0, deep: 0, hi: 0, line: false });
    s.part(s.blob(P([[56, 28], [64, 21], [72, 24], [82, 32], [80, 35], [70, 38], [60, 37]])), R.a, { sh: 2, deep: 0 });
    s.part(s.poly(P([[68, 31], [82, 32], [80, 35], [70, 38]])), R.b, { sh: 1, deep: 0, line: false });
    s.part(s.disc(f.X(81), f.Y(32), Math.max(1, 1.3 * f.k)), R.c, { sh: 0, deep: 0, hi: 0, line: false });
    s.dots([[Math.round(f.X(68)), Math.round(f.Y(28))], [Math.round(f.X(69)), Math.round(f.Y(28))], [Math.round(f.X(69)), Math.round(f.Y(27))]], p.eye);
    if (stage >= 2) { s.part(s.poly(P([[32, 39], [40, 30], [44, 39]])), R.acc, { sh: 0, deep: 0, spec: true }); s.part(s.poly(P([[44, 39], [50, 30], [54, 40]])), R.acc, { sh: 0, deep: 0, spec: true }); }
    if (stage >= 4) s.part(s.poly(P([[60, 22], [66, 4], [70, 21]])), R.acc, { sh: 0, deep: 0, spec: true });
    return finish(s, f, stage);
  },
  forja(s, stage, line) {
    const f = frame(s, stage, line, 'forja'), { R, P, L, p } = f;
    s.shadow(40, 79, 18 + stage * 6, 3);
    if (stage >= 1) { const w = [0, .55, .8, 1, 1.2][stage]; const pts = [[44, 42], [38, 6 + (1 - w) * 30], [16, -2 + (1 - w) * 26], [20, 14], [6, 16], [14, 30], [4, 34], [18, 44], [30, 50]]; s.part(s.poly(P(pts)), R.c, { sh: 3, deep: 1 }); for (const [a, b] of [[38, 8], [20, 14], [14, 30]]) s.line(f.X(44), f.Y(42), f.X(a), f.Y(b + (1 - w) * 20), R.a[1]); }
    s.part(s.limb(L([[22, 50, 6], [8, 56, 4.6], [2, 44, 3], [8, 34, 1]])), R.a, { sh: 2, deep: 1 });
    s.part(s.poly(P([[3, 38], [8, 26], [13, 36], [8, 40]])), R.acc, { sh: 1, deep: 0, spec: true });
    quad(s, f, { body: [[20, 46], [34, 36], [52, 36], [64, 44], [60, 57], [46, 61], [30, 61], [20, 56]] });
    for (let i = 0; i < 5; i++) s.part(s.poly(P([[28 + i * 7, 39 - (i === 0 ? -1 : 0)], [31 + i * 7, 31], [34 + i * 7, 39]])), R.acc, { sh: 0, deep: 0, spec: true });
    s.part(s.limb(L([[56, 46, 7], [64, 34, 5], [68, 26, 4.2]])), R.a, { sh: 2, deep: 1 });
    s.part(s.limb(L([[58, 50, 3], [65, 36, 2.6], [67, 28, 2]])), R.b, { sh: 1, deep: 0, line: false });
    const hl = [[0, 12], [0, 16], [0, 22], [0, 24], [0, 28]][stage][1];
    s.part(s.limb(L([[64, 20, 2.6], [56, 14, 2], [46, 22 - hl * .7, .9]])), R.b, { sh: 1, deep: 0, spec: true });
    s.part(s.limb(L([[70, 18, 2.2], [68, 10, 1.6], [60, 22 - hl * .8, .8]])), R.b, { sh: 1, deep: 0, spec: true });
    s.part(s.blob(P([[60, 22], [68, 16], [76, 20], [83, 28], [81, 33], [72, 35], [62, 31]])), R.a, { sh: 2, deep: 0 });
    s.line(f.X(70), f.Y(32), f.X(82), f.Y(31), R.a[0]);
    s.dots([[Math.round(f.X(70)), Math.round(f.Y(24))], [Math.round(f.X(71)), Math.round(f.Y(24))], [Math.round(f.X(72)), Math.round(f.Y(25))]], p.eye);
    if (stage >= 3) { const x = f.X(84), y = f.Y(31); s.part(s.limb([[x, y, 1.6], [x + 3, y - 3, 1], [x + 1, y - 8, .6]], undefined), R.acc, { sh: 0, deep: 0, hi: 0, line: false }); }
    if (line === 'b' && stage >= 2) for (const [a, b, c, d] of [[30, 44, 36, 52], [42, 42, 40, 54], [50, 46, 54, 54]]) s.line(f.X(a), f.Y(b), f.X(c), f.Y(d), p.acc);
    return finish(s, f, stage);
  },
  noche(s, stage, line) {
    const f = frame(s, stage, line, 'noche'), { R, P, L, p } = f;
    s.shadow(42, 79, 14 + stage * 4, 3);
    if (stage >= 3) { const spread = stage === 4 ? 1.15 : 1; for (const d of [-1, 1]) { const px = (x) => 42 + d * x * spread; s.part(s.poly(P([[px(8), 30], [px(26), 12], [px(40), 18], [px(46), 34], [px(39), 34], [px(41), 46], [px(33), 44], [px(32), 56], [px(24), 52], [px(14), 56]])), R.c, { sh: 2, deep: 1 }); s.line(f.X(px(10)), f.Y(32), f.X(px(36)), f.Y(20), R.a[1]); s.line(f.X(px(10)), f.Y(38), f.X(px(36)), f.Y(36), R.a[1]); } }
    s.part(s.blob(P([[42, 16], [60, 26], [62, 50], [52, 68], [42, 72], [32, 68], [22, 50], [24, 26]])), R.a, { sh: 4, deep: 1 });
    s.part(s.blob(P([[42, 38], [54, 44], [52, 62], [42, 69], [32, 62], [30, 44]])), R.b, { sh: 2, deep: 0, line: false });
    for (let y = 44; y < 66; y += 6) for (let x = 33; x < 53; x += 6) s.dots([[Math.round(f.X(x + (y % 12 ? 0 : 3))), Math.round(f.Y(y))]], R.a[1]);
    if (stage < 3) { s.part(s.blob(P([[24, 34], [30, 38], [32, 56], [24, 66], [18, 52]])), R.c, { sh: 2, deep: 0 }); s.part(s.blob(P([[60, 34], [54, 38], [52, 56], [60, 66], [66, 52]])), R.c, { sh: 2, deep: 0 }); }
    s.part(s.poly(P([[26, 26], [22, 6], [40, 18]])), R.a, { sh: 2, deep: 0 }); s.part(s.poly(P([[58, 26], [62, 6], [44, 18]])), R.a, { sh: 2, deep: 0 });
    s.part(s.disc(f.X(33), f.Y(30), 9 * f.k), R.b, { sh: 2, deep: 0 }); s.part(s.disc(f.X(51), f.Y(30), 9 * f.k), R.b, { sh: 2, deep: 0 });
    s.part(s.disc(f.X(34), f.Y(30), Math.max(1.4, 4.4 * f.k)), { 0: hex('#120c18'), 1: hex('#120c18'), 2: hex(p.eye), 3: hex(p.eye), 4: hex('#ffffff') }, { sh: 1, deep: 0, spec: true }); s.part(s.disc(f.X(50), f.Y(30), Math.max(1.4, 4.4 * f.k)), { 0: hex('#120c18'), 1: hex('#120c18'), 2: hex(p.eye), 3: hex(p.eye), 4: hex('#ffffff') }, { sh: 1, deep: 0, spec: true });
    s.part(s.poly(P([[22, 20], [42, 31], [62, 20], [60, 25], [42, 37], [24, 25]])), R.c, { sh: 0, deep: 0, hi: 0, line: false });
    s.part(s.poly(P([[39, 36], [45, 36], [42, 44]])), R.acc, { sh: 1, deep: 0, spec: true });
    for (const x of [34, 50]) s.part(s.limb(L([[x, 70, 3], [x, 76, 2.6]]), undefined, false), R.acc, { sh: 1, deep: 0 });
    if (stage >= 2) { const m = s.disc(f.X(42), f.Y(4), 9 * f.k); s.cut(m, s.disc(f.X(46), f.Y(2), 7.6 * f.k)); s.part(m, R.acc, { sh: 0, deep: 0, spec: true }); }
    return finish(s, f, stage);
  },
  roca(s, stage, line) {
    const f = frame(s, stage, line, 'roca'), { R, P, L, p } = f;
    s.shadow(40, 79, 20 + stage * 5, 3);
    if (stage === 4) { s.part(s.poly(P([[14, 46], [24, 18], [32, 30], [42, 2], [54, 26], [62, 16], [70, 46]])), line === 'a' ? ramp('#6e7687') : ramp('#e0719a'), { sh: 4, deep: 1, spec: true }); s.part(s.poly(P([[36, 16], [42, 2], [48, 15], [43, 12]])), ramp('#f4f4fa'), { sh: 0, deep: 0, line: false }); }
    s.part(s.limb(L([[20, 62, 6.5], [14, 76, 6]]), undefined, false), R.a, { sh: 2 }); s.part(s.limb(L([[58, 62, 6.5], [64, 76, 6]]), undefined, false), R.a, { sh: 2 });
    s.part(s.limb(L([[12, 62, 3], [4, 66, 1]]), undefined, false), R.a, { sh: 1, deep: 0 });
    s.part(s.limb(L([[58, 54, 7], [70, 44, 6], [74, 38, 6.4]])), R.a, { sh: 2, deep: 1 });
    s.part(s.blob(P([[66, 34], [74, 29], [83, 34], [84, 40], [76, 45], [68, 42]])), R.a, { sh: 2, deep: 0 });
    s.line(f.X(74), f.Y(41), f.X(83), f.Y(40), R.a[0]);
    s.dots([[Math.round(f.X(75)), Math.round(f.Y(35))], [Math.round(f.X(76)), Math.round(f.Y(35))]], p.eye);
    s.part(s.blob(P([[8, 62], [12, 42], [26, 28], [46, 25], [62, 34], [70, 52], [72, 62], [40, 68]])), R.sh, { sh: 4, deep: 1, spec: true });
    for (const [x, y] of [[26, 44], [44, 38], [58, 48], [36, 54], [52, 58], [20, 56]]) { const m = s.mask(); s.poly(P([[x - 7, y], [x - 3, y - 6], [x + 4, y - 6], [x + 8, y], [x + 4, y + 6], [x - 3, y + 6]]), m); s.part(m, R.c, { sh: 1, deep: 0 }); }
    s.part(s.blob(P([[8, 62], [40, 58], [72, 62], [66, 69], [40, 72], [14, 69]])), R.b, { sh: 2, deep: 0 });
    for (let i = 0; i < stage + 1; i++) { const x = 18 + i * 11, y = 28 + Math.abs(2 - i) * 5; s.part(s.limb(L([[x, y + 5, 1.2], [x + 1, y - 3, 1], [x + 4, y - 7, .8]])), R.acc, { sh: 0, deep: 0, hi: 0 }); s.part(s.disc(f.X(x + 4), f.Y(y - 8), Math.max(1.2, 2.2 * f.k)), R.acc, { sh: 0, deep: 0, spec: true }); }
    return finish(s, f, stage);
  },
  marea(s, stage, line) {
    const f = frame(s, stage, line, 'marea'), { R, P, L, p } = f;
    s.shadow(42, 79, 18 + stage * 5, 3);
    if (stage >= 3) { const m = s.disc(f.X(38), f.Y(42), 34 * f.k, 30 * f.k); s.cut(m, s.disc(f.X(38), f.Y(42), 31 * f.k, 27.4 * f.k)); s.part(m, R.acc, { sh: 0, deep: 0, hi: 0, line: false }); }
    s.part(s.poly(P([[4, 56], [2, 30], [14, 42], [26, 52], [22, 66], [12, 72]])), R.acc, { sh: 2, deep: 0, line: false });
    s.part(s.limb(L([[8, 58, 2], [20, 60, 6], [36, 62, 9.5], [54, 58, 9.5], [62, 46, 8]])), R.a, { sh: 3, deep: 1 });
    s.part(s.limb(L([[24, 66, 3], [38, 70, 4], [54, 66, 4]])), R.b, { sh: 1, deep: 0, line: false });
    for (const [x, y] of [[24, 66], [50, 66]]) s.part(s.limb(L([[x, y, 3], [x - 2, y + 6, 2.2], [x + 2, y + 10, 1.6]])), R.c, { sh: 1 });
    for (let i = 0; i < 3; i++) { const a = [[-16, -14], [-20, -2], [-14, 10]][i]; s.part(s.limb(L([[56, 36, 2], [56 + a[0], 36 + a[1], 2.4 + stage * .3], [56 + a[0] * 1.5, 36 + a[1] * 1.45, 1]])), R.acc, { sh: 1, deep: 0, spec: true }); }
    s.part(s.blob(P([[52, 40], [56, 26], [70, 22], [82, 30], [82, 40], [70, 47], [58, 47]])), R.a, { sh: 3, deep: 0 });
    s.part(s.limb(L([[74, 22, 1.6], [84, 16, 2], [86, 10, .8]])), R.acc, { sh: 1, deep: 0, spec: true });
    s.line(f.X(70), f.Y(42), f.X(82), f.Y(39), R.a[0]);
    s.dots([[Math.round(f.X(72)), Math.round(f.Y(32))], [Math.round(f.X(73)), Math.round(f.Y(32))], [Math.round(f.X(72)), Math.round(f.Y(33))], [Math.round(f.X(73)), Math.round(f.Y(33))]], p.eye);
    if (stage >= 2) for (const [x, y] of [[30, 52], [42, 53], [52, 50]]) s.part(s.disc(f.X(x), f.Y(y), Math.max(1, 2.2 * f.k)), R.acc, { sh: 0, deep: 0, spec: true });
    return finish(s, f, stage);
  },
};
export const pet = (id, stage, line = 'a') => drawers[id](new Sprite(S, S), stage, line);
export const PET_FORMS = Object.keys(drawers).flatMap((id) => [0, 1, 2, 3, 4].flatMap((st) => (st < 2 ? [[id, st, 'a']] : [[id, st, 'a'], [id, st, 'b']])));
// Eggs: leathery, heavy, with speckles of the winning line and cracks that glow.
export const EGG_TINTS = { senda: '#d9702c', forja: '#b23a2c', noche: '#4f4ab0', roca: '#4f8f62', marea: '#e0799c', neutral: '#6e7487', ember: '#e0702c' };
export function egg(tint, crack = 0) {
  const s = new Sprite(64, 72), sh = ramp('#cfc4b0'), T = ramp(tint), G = ramp('#ffd37a');
  s.shadow(32, 67, 18, 3);
  s.part(s.blob([[32, 5], [44, 16], [52, 38], [48, 58], [32, 66], [16, 58], [12, 38], [20, 16]]), sh, { sh: 5, deep: 2, spec: true });
  for (const [x, y, a, b] of [[24, 24, 5, 6], [40, 20, 3, 4], [42, 38, 6, 7], [22, 46, 4, 5], [32, 34, 3, 3], [33, 56, 5, 3], [17, 34, 2, 3]]) s.part(s.disc(x, y, a, b), T, { sh: 2, deep: 0, hi: 0, line: false });
  const paths = [[], [[14, 38, 20, 34, 24, 40, 30, 35]], [[14, 38, 20, 34, 24, 40, 30, 35, 36, 41, 43, 35, 50, 39]], [[14, 38, 20, 34, 24, 40, 30, 35, 36, 41, 43, 35, 50, 39], [30, 35, 28, 44, 33, 50], [43, 35, 41, 26, 45, 20]]][crack];
  for (const p of paths) for (let i = 0; i + 3 < p.length; i += 2) { s.line(p[i], p[i + 1], p[i + 2], p[i + 3], '#120b16'); s.line(p[i], p[i + 1] + 1, p[i + 2], p[i + 3] + 1, G[3]); }
  return s.finish({ rim: tint, rimStrength: .35 });
}
