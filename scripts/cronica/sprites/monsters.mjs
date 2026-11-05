// Monsters: thirteen body plans in a dark register, each dressed by a palette and a few flags.
import { Sprite, ramp, smooth, hex, mix } from './engine.mjs';
const S = 104, INK = hex('#120b16');
const palette = (o) => ({ a: ramp(o.a), b: ramp(o.b || o.a), c: ramp(o.c || '#2a2230'), acc: ramp(o.acc || '#c9c1b0'), eye: o.eye || '#ff4a3a', rim: o.rim || o.eye || '#ff4a3a' });
const glow = (s, c, n = 20) => { for (let i = 0; i < n; i++) { const a = i * 2.4, r = 40 + (i * 5) % 10; s.put(Math.round(52 + Math.cos(a) * r), Math.round(52 + Math.sin(a) * r * .9), hex(c)); } };
const eyes = (s, list, c) => { for (const [x, y] of list) { s.dots([[x, y], [x + 1, y], [x + 2, y - 1]], c); s.dots([[x, y + 1]], '#ffffff'); } };
const plans = {
  demon(s, p, o) {
    s.shadow(52, 98, 34, 4);
    if (o.wings !== false) for (const d of [-1, 1]) { const X = (x) => 52 + d * x; s.part(s.poly([[X(12), 40], [X(30), 10], [X(50), 4], [X(46), 24], [X(52), 30], [X(44), 44], [X(50), 58], [X(36), 56], [X(30), 68], [X(20), 58]]), p.c, { sh: 3, deep: 1 }); s.line(X(14), 42, X(48), 8, p.a[1]); s.line(X(14), 46, X(50), 30, p.a[1]); s.line(X(14), 50, X(46), 54, p.a[1]); }
    s.part(s.limb([[42, 72, 4], [18, 82, 4], [8, 70, 2.4], [4, 60, 1]]), p.a, { sh: 2 }); s.part(s.poly([[1, 62], [5, 50], [9, 62]]), p.acc, { sh: 1, deep: 0, spec: true });
    for (const d of [-1, 1]) { const X = (x) => 52 + d * x; s.part(s.limb([[X(10), 66, 8.4], [X(17), 80, 6], [X(16), 92, 4.6]]), p.a, { sh: 3, deep: 1 }); s.part(s.poly([[X(9), 90], [X(24), 89], [X(28), 98], [X(8), 98]]), p.c, { sh: 1, deep: 0, spec: true }); }
    s.part(s.blob([[30, 32], [52, 26], [74, 32], [72, 50], [62, 66], [42, 66], [32, 50]]), p.a, { sh: 5, deep: 1, spec: true });
    s.line(52, 34, 52, 62, p.a[1]); for (const y of [46, 52, 58]) s.line(44, y, 60, y, p.a[1]); s.line(36, 40, 50, 42, p.a[1]); s.line(68, 40, 54, 42, p.a[1]);
    if (o.core) s.part(s.disc(52, 40, 4), ramp(p.eye), { sh: 1, deep: 0, spec: true });
    for (const d of [-1, 1]) { const X = (x) => 52 + d * x; s.part(s.limb([[X(23), 36, 7.4], [X(33), 52, 6], [X(31), 66, 5]]), p.a, { sh: 3, deep: 1 }); s.part(s.poly([[X(27), 70], [X(26), 78], [X(30), 72], [X(32), 80], [X(34), 72], [X(38), 77], [X(36), 67]]), p.acc, { sh: 0, deep: 0, spec: true }); s.part(s.poly(smooth([[X(14), 34], [X(22), 25], [X(33), 28], [X(33), 38], [X(23), 41]], true, 4)), p.c, { sh: 2, spec: true }); }
    s.part(s.blob([[42, 16], [52, 10], [62, 16], [62, 28], [56, 36], [48, 36], [42, 28]]), p.a, { sh: 3, deep: 1 });
    for (const d of [-1, 1]) { const X = (x) => 52 + d * x; s.part(s.limb([[X(9), 15, 3.4], [X(20), 8, 3], [X(30), 12, 2], [X(32), 2, .8]]), p.acc, { sh: 1, deep: 0, spec: true }); }
    eyes(s, [[45, 22], [55, 22]], p.eye); s.line(47, 30, 57, 30, INK); for (const x of [48, 51, 54]) s.dots([[x, 31]], '#efe6d8');
  },
  brute(s, p, o) {
    s.shadow(52, 98, 34, 4);
    if (o.weapon) { s.part(s.limb([[84, 62, 3], [92, 30, 5], [90, 12, 7.4]]), p.c, { sh: 3 }); for (const [x, y] of [[84, 18], [96, 12], [90, 6], [97, 24]]) s.part(s.poly([[x - 2, y + 3], [x + 1, y - 5], [x + 4, y + 3]]), p.acc, { sh: 0, deep: 0, spec: true }); }
    for (const d of [-1, 1]) { const X = (x) => 50 + d * x; s.part(s.limb([[X(13), 70, 11], [X(16), 84, 8], [X(15), 93, 7]]), p.a, { sh: 4, deep: 1 }); s.part(s.poly([[X(7), 92], [X(25), 92], [X(28), 98], [X(6), 98]]), p.a, { sh: 1, deep: 0 }); }
    s.part(s.blob([[20, 40], [34, 22], [66, 22], [82, 40], [76, 64], [62, 78], [38, 78], [24, 64]]), p.a, { sh: 7, deep: 2, spec: true });
    s.part(s.blob([[36, 50], [64, 50], [66, 70], [50, 77], [34, 70]]), p.b, { sh: 4, deep: 1 });
    s.line(50, 52, 50, 74, p.b[1]);
    for (const d of [-1, 1]) { const X = (x) => 50 + d * x, hx = d > 0 ? 84 : 12; s.part(s.limb([[X(32), 36, 10.5], [X(40), 52, 9], [hx, 68, 8]]), p.a, { sh: 4, deep: 1 }); s.part(s.disc(hx, 71, 7.4), p.b, { sh: 2, deep: 0 }); }
    if (o.fur) for (const [x, y] of [[26, 34], [38, 24], [60, 24], [74, 34], [24, 48], [78, 50]]) s.part(s.poly([[x - 6, y + 5], [x, y - 7], [x + 6, y + 5]]), p.b, { sh: 1, deep: 0 });
    s.part(s.blob([[38, 26], [50, 16], [64, 26], [62, 40], [50, 45], [40, 40]]), p.a, { sh: 3, deep: 1 });
    if (o.cyclops) { s.part(s.disc(51, 29, 7.6), ramp('#e8e0d0'), { sh: 2, deep: 0 }); s.part(s.disc(53, 29, 3.8), ramp(p.eye), { sh: 1, deep: 0, spec: true }); s.dots([[53, 29], [54, 29]], '#120b16'); s.line(43, 22, 59, 22, INK); s.part(s.limb([[50, 18, 3], [50, 8, 1]], undefined, false), p.acc, { sh: 1, deep: 0, spec: true }); }
    else eyes(s, [[43, 30], [54, 30]], p.eye);
    s.part(s.poly([[42, 38], [60, 38], [58, 43], [44, 43]]), p.c, { sh: 0, deep: 0, hi: 0 }); s.part(s.poly([[44, 44], [46, 34], [48, 42]]), p.acc, { sh: 0, deep: 0, spec: true }); s.part(s.poly([[54, 42], [56, 34], [58, 44]]), p.acc, { sh: 0, deep: 0, spec: true });
    if (o.horns) for (const d of [-1, 1]) s.part(s.limb([[50 + d * 11, 22, 3.4], [50 + d * 21, 16, 2.4], [50 + d * 24, 6, .8]]), p.acc, { sh: 1, deep: 0, spec: true });
  },
  knight(s, p, o) {
    s.shadow(50, 98, 26, 4);
    s.part(s.poly(smooth([[42, 30], [58, 30], [52, 58], [44, 80], [34, 96], [26, 88], [20, 96], [10, 84], [6, 64], [14, 42]], true, 4)), p.c, { sh: 5, deep: 2 });
    s.part(s.poly([[72, 66], [90, 4], [96, 2], [95, 12], [79, 69]]), o.hood ? ramp('#7a7f8e') : ramp('#aeb6c4'), { sh: 2, spec: true }); if (o.great) s.part(s.poly([[78, 40], [88, 10], [90, 12], [82, 42]]), ramp(p.eye), { sh: 0, deep: 0, hi: 0, line: false }); s.part(s.limb([[66, 62, 2.4], [84, 72, 2.2]], undefined, false), p.acc, { sh: 1, deep: 0, spec: true }); s.part(s.limb([[75, 66, 2], [71, 78, 2]], undefined, false), p.c, { sh: 1, deep: 0 });
    for (const [h, k, a, t] of [[[58, 62], [66, 76], [68, 90], [78, 96]], [[42, 62], [34, 76], [30, 90], [40, 96]]]) { s.part(s.limb([[...h, 6.6], [...k, 5], [...a, 4]]), p.a, { sh: 3, deep: 1, spec: true }); s.part(s.disc(k[0], k[1], 4.4), p.b, { sh: 1, spec: true }); s.part(s.poly([[a[0] - 5, a[1] - 3], [a[0] + 4, a[1] - 3], [t[0], t[1] - 2], [t[0], t[1] + 1], [a[0] - 5, t[1] + 1]]), p.a, { sh: 1, deep: 0, spec: true }); }
    s.part(s.blob([[34, 34], [50, 28], [66, 34], [64, 50], [58, 62], [42, 62], [36, 50]]), p.a, { sh: 5, deep: 1, spec: true });
    s.part(s.poly(smooth([[38, 36], [62, 36], [60, 48], [50, 56], [40, 48]], true, 3)), p.b, { sh: 3, spec: true }); s.line(50, 36, 50, 55, p.b[0]);
    s.part(s.poly([[38, 60], [62, 60], [68, 74], [56, 72], [50, 76], [44, 72], [32, 74]]), p.a, { sh: 3, deep: 0, spec: true });
    s.part(s.limb([[68, 38, 5], [72, 52, 4.2], [76, 64, 3.8]]), p.a, { sh: 2, spec: true }); s.part(s.limb([[33, 38, 5], [26, 52, 4.4], [32, 64, 3.8]]), p.a, { sh: 2, spec: true });
    for (const x of [30, 70]) { s.part(s.poly(smooth([[x - 9, 38], [x - 6, 28], [x + 6, 28], [x + 9, 38], [x, 44]], true, 4)), p.b, { sh: 3, spec: true }); s.part(s.poly([[x - 4, 30], [x, 16], [x + 4, 30]]), p.acc, { sh: 0, deep: 0, spec: true }); }
    if (o.hood) { s.part(s.poly(smooth([[36, 32], [38, 12], [50, 4], [64, 12], [66, 32], [58, 36], [44, 36]], true, 4)), p.c, { sh: 3 }); s.part(s.blob([[43, 20], [58, 19], [60, 28], [50, 33], [43, 28]]), ramp('#0f0a12'), { sh: 0, deep: 0, hi: 0 }); eyes(s, [[46, 25], [54, 25]], p.eye); }
    else { s.part(s.blob([[39, 22], [50, 10], [62, 22], [61, 34], [50, 39], [40, 34]]), p.b, { sh: 3, spec: true }); s.part(s.poly([[43, 22], [62, 21], [61, 28], [44, 28]]), ramp('#0f0a12'), { sh: 0, deep: 0, hi: 0 }); eyes(s, [[46, 25], [55, 25]], p.eye); s.line(50, 11, 50, 22, p.b[0]); if (o.crest) s.part(s.poly(smooth([[50, 10], [42, 0], [26, 2], [18, 12], [32, 9], [44, 14]], true, 4)), ramp(o.crest), { sh: 2 }); }
  },
  wraith(s, p, o) {
    s.part(s.poly([[30, 40], [52, 14], [76, 40], [82, 74], [88, 94], [74, 86], [68, 98], [56, 88], [46, 100], [36, 88], [26, 98], [20, 84], [10, 92], [18, 70]]), p.a, { sh: 6, deep: 2 });
    for (const [a, b, c, d] of [[40, 50, 32, 88], [52, 44, 52, 92], [66, 50, 72, 86]]) s.line(a, b, c, d, p.a[0]);
    if (o.scythe) { s.part(s.limb([[86, 92, 1.5], [78, 8, 1.3]], undefined, false), p.acc, { sh: 1, deep: 0 }); s.part(s.poly([[80, 10], [58, 2], [34, 10], [58, 9], [78, 18]]), ramp('#c9d0dc'), { sh: 2, spec: true }); }
    s.part(s.limb([[34, 42, 5], [22, 52, 4], [12, 44, 2.6]]), p.a, { sh: 2 }); s.part(s.limb([[72, 42, 5], [82, 54, 4], [80, 48, 2.6]]), p.a, { sh: 2 });
    for (const [x, y] of [[10, 44], [80, 50]]) { s.part(s.limb([[x, y, 1.6], [x - 4, y - 8, .7]], undefined, false), p.b, { sh: 0, deep: 0 }); s.part(s.limb([[x + 2, y, 1.6], [x + 3, y - 9, .7]], undefined, false), p.b, { sh: 0, deep: 0 }); s.part(s.limb([[x + 3, y + 1, 1.6], [x + 9, y - 6, .7]], undefined, false), p.b, { sh: 0, deep: 0 }); }
    s.part(s.poly(smooth([[34, 40], [36, 18], [52, 6], [70, 18], [72, 40], [62, 48], [44, 48]], true, 5)), p.a, { sh: 4, spec: true });
    s.part(s.blob([[42, 22], [60, 20], [64, 34], [54, 44], [44, 40]]), ramp(o.face || '#0c0810'), { sh: 0, deep: 0, hi: 0 });
    if (o.mask) { s.part(s.blob([[44, 22], [60, 21], [62, 33], [54, 43], [46, 38]]), ramp('#d8d2c6'), { sh: 2, spec: true }); s.dots([[48, 29], [49, 29], [50, 29], [56, 29], [57, 29], [58, 29]], '#120b16'); s.dots([[49, 28], [57, 28]], p.eye); } else eyes(s, [[47, 29], [56, 29]], p.eye);
    if (o.crown) s.part(s.poly([[38, 18], [40, 6], [46, 13], [52, 2], [58, 13], [64, 6], [66, 18], [52, 14]]), p.acc, { sh: 1, deep: 0, spec: true });
  },
  hound(s, p, o) {
    s.shadow(50, 96, 38, 4);
    s.part(s.limb([[30, 54, 4], [14, 44, 3.2], [6, 28, 1]]), p.a, { sh: 2 });
    for (const [a, b] of [[34, 68], [76, 68]]) s.part(s.limb([[a, b, 6], [a + 4, b + 14, 4], [a + 2, 94, 3]]), p.c, { sh: 2 });
    s.part(s.blob([[24, 54], [40, 42], [66, 40], [84, 48], [80, 66], [62, 74], [36, 74], [24, 68]]), p.a, { sh: 6, deep: 1, spec: true });
    if (o.bones) { for (let x = 34; x < 72; x += 8) s.line(x, 50, x + 3, 70, p.b[3]); s.line(30, 52, 76, 48, p.b[3]); }
    for (let x = 30; x < 80; x += 8) s.part(s.poly([[x - 3, 45], [x + 1, 35], [x + 4, 44]]), p.b, { sh: 0, deep: 0, spec: true });
    for (const [a, b] of [[26, 68], [66, 68]]) { s.part(s.limb([[a, b, 7], [a - 2, b + 14, 4.6], [a + 2, 94, 3.4]]), p.a, { sh: 3 }); s.part(s.poly([[a - 3, 92], [a + 11, 92], [a + 12, 98], [a - 3, 98]]), p.acc, { sh: 0, deep: 0, spec: true }); }
    s.part(s.limb([[76, 52, 9], [84, 42, 7]]), p.a, { sh: 3 });
    s.part(s.poly([[76, 28], [78, 12], [86, 26]]), p.a, { sh: 1, deep: 0 }); s.part(s.poly([[86, 26], [93, 12], [93, 30]]), p.a, { sh: 1, deep: 0 });
    s.part(s.blob([[74, 34], [84, 26], [94, 32], [103, 44], [100, 52], [90, 54], [78, 50]]), p.a, { sh: 3, deep: 0 });
    s.part(s.poly([[86, 46], [103, 44], [99, 54], [88, 54]]), ramp('#2a0e14'), { sh: 0, deep: 0, hi: 0 }); for (const x of [90, 94, 98]) s.dots([[x, 47], [x, 48]], '#efe6d8'); eyes(s, [[85, 36]], p.eye);
  },
  rat(s, p, o) {
    s.shadow(48, 94, 34, 4);
    s.part(s.limb([[22, 78, 4], [6, 80, 3], [4, 62, 1.8], [16, 50, .8]]), p.b, { sh: 1, deep: 0 });
    s.part(s.blob([[16, 76], [22, 52], [44, 38], [66, 44], [76, 62], [72, 84], [24, 88]]), p.a, { sh: 7, deep: 2, spec: true });
    for (const [x, y] of [[28, 50], [40, 42], [52, 40], [62, 46], [22, 62]]) s.part(s.poly([[x - 4, y + 4], [x, y - 7], [x + 4, y + 4]]), p.c, { sh: 0, deep: 0 });
    for (const x of [30, 62]) { s.part(s.limb([[x, 80, 7], [x + 4, 92, 3.4]], undefined, false), p.c, { sh: 2 }); s.part(s.poly([[x, 90], [x + 12, 90], [x + 13, 95], [x, 95]]), p.b, { sh: 0, deep: 0 }); }
    s.part(s.limb([[66, 58, 11], [80, 54, 7], [92, 60, 2.4]]), p.a, { sh: 3 });
    s.part(s.disc(66, 42, 7), p.a, { sh: 2 }); s.part(s.disc(66, 42, 4), p.b, { sh: 0, deep: 0, hi: 0, line: false });
    eyes(s, [[76, 51]], p.eye); s.dots([[92, 59], [93, 59], [93, 60]], '#1a0f16'); s.part(s.poly([[84, 62], [86, 70], [88, 62]]), ramp('#efe6d8'), { sh: 0, deep: 0, hi: 0 });
  },
  flyer(s, p, o) {
    for (const d of [-1, 1]) { const X = (x) => 52 + d * x; s.part(s.poly([[X(6), 42], [X(22), 18], [X(50), 12], [X(44), 28], [X(50), 42], [X(38), 44], [X(36), 60], [X(24), 54], [X(16), 66]]), o.feather ? p.a : p.c, { sh: 3, deep: 1 }); s.line(X(8), 42, X(48), 14, p.a[1]); s.line(X(8), 46, X(46), 40, p.a[1]); s.line(X(8), 50, X(35), 58, p.a[1]); if (o.moth) for (const [a, b] of [[28, 30], [38, 28], [24, 44]]) s.part(s.disc(X(a), b, 3), ramp(p.eye), { sh: 0, deep: 0, spec: true }); }
    s.part(s.blob([[42, 34], [52, 26], [62, 34], [64, 58], [56, 76], [48, 76], [40, 58]]), p.a, { sh: 4, deep: 1 });
    s.part(s.blob([[46, 48], [58, 48], [58, 66], [52, 74], [46, 66]]), p.b, { sh: 2, deep: 0, line: false });
    if (o.feather) { s.part(s.poly([[46, 30], [58, 30], [52, 12]]), p.a, { sh: 1, deep: 0 }); s.part(s.poly([[56, 38], [70, 42], [56, 44]]), p.acc, { sh: 0, deep: 0, spec: true }); }
    else for (const d of [-1, 1]) s.part(s.poly([[52 + d * 3, 32], [52 + d * 15, 10], [52 + d * 12, 32]]), p.a, { sh: 1, deep: 0 });
    if (o.moth) for (const d of [-1, 1]) s.part(s.limb([[52 + d * 3, 28, 1], [52 + d * 12, 16, .9], [52 + d * 18, 18, .7]]), p.acc, { sh: 0, deep: 0 });
    eyes(s, [[45, 36], [55, 36]], p.eye); if (!o.feather) { s.part(s.poly([[46, 44], [48, 50], [50, 44]]), ramp('#efe6d8'), { sh: 0, deep: 0, hi: 0 }); s.part(s.poly([[54, 44], [56, 50], [58, 44]]), ramp('#efe6d8'), { sh: 0, deep: 0, hi: 0 }); }
    for (const x of [46, 58]) s.part(s.limb([[x, 74, 2], [x, 84, 1.4], [x + 2, 90, .8]]), p.acc, { sh: 0, deep: 0 });
  },
  spider(s, p, o) {
    s.shadow(52, 96, 42, 4);
    for (const d of [-1, 1]) for (let i = 0; i < 4; i++) { const X = (x) => 52 + d * x, h = [30, 42, 54, 62][i]; s.part(s.limb([[X(14), 60 + i * 3, 3.6], [X(34 + i * 2), h - 6, 3], [X(46 - i), 96 - (3 - i) * 3, 1]]), p.c, { sh: 1, deep: 0, spec: true }); }
    s.part(s.blob([[28, 40], [52, 26], [76, 40], [78, 62], [52, 74], [26, 62]]), p.a, { sh: 7, deep: 2, spec: true });
    s.part(s.poly([[52, 30], [60, 42], [52, 48], [44, 42]]), ramp(p.eye), { sh: 1, deep: 0, spec: true }); s.part(s.poly([[52, 52], [58, 60], [52, 66], [46, 60]]), ramp(p.eye), { sh: 1, deep: 0, spec: true });
    s.part(s.blob([[38, 66], [52, 60], [66, 66], [64, 80], [52, 86], [40, 80]]), p.b, { sh: 4, deep: 1, spec: true });
    eyes(s, [[43, 69], [55, 69]], p.eye); s.dots([[48, 73], [51, 73], [54, 73], [47, 67], [56, 67]], p.eye);
    s.part(s.limb([[46, 82, 2.4], [44, 92, .8]]), p.acc, { sh: 0, deep: 0, spec: true }); s.part(s.limb([[58, 82, 2.4], [60, 92, .8]]), p.acc, { sh: 0, deep: 0, spec: true });
  },
  beetle(s, p, o) {
    s.shadow(52, 96, 40, 4);
    for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { const X = (x) => 52 + d * x; s.part(s.limb([[X(26), 54 + i * 9, 3], [X(40), 58 + i * 11, 2.4], [X(42), 90 + i, .9]]), p.c, { sh: 1, deep: 0, spec: true }); }
    s.part(s.blob([[24, 56], [36, 34], [52, 30], [68, 34], [80, 56], [76, 80], [52, 90], [28, 80]]), p.a, { sh: 7, deep: 2, spec: true });
    s.line(52, 34, 52, 88, INK); s.line(50, 34, 44, 84, p.a[3]); for (const [a, b] of [[34, 50], [40, 66], [64, 48], [68, 66]]) s.part(s.disc(a, b, 3), ramp(p.eye), { sh: 0, deep: 0, spec: true });
    s.part(s.blob([[34, 34], [52, 16], [70, 34], [62, 44], [42, 44]]), p.b, { sh: 4, deep: 1, spec: true });
    eyes(s, [[42, 30], [56, 30]], p.eye);
    for (const d of [-1, 1]) s.part(s.limb([[52 + d * 8, 20, 3], [52 + d * 16, 8, 2], [52 + d * 6, 2, .8]]), p.acc, { sh: 1, deep: 0, spec: true });
  },
  serpent(s, p, o) {
    s.shadow(50, 96, 38, 4);
    s.part(s.limb([[84, 90, 1.5], [66, 90, 8], [34, 90, 11], [16, 74, 12], [30, 56, 11], [62, 56, 10], [76, 40, 8], [64, 24, 7.4]]), p.a, { sh: 5, deep: 1, spec: true });
    s.part(s.limb([[66, 94, 2.4], [34, 96, 4], [16, 82, 3]]), p.b, { sh: 0, deep: 0, line: false });
    for (const [x, y] of [[22, 62], [40, 48], [56, 48], [70, 30], [10, 76], [46, 80], [70, 82]]) s.part(s.poly([[x - 4, y + 3], [x, y - 7], [x + 4, y + 3]]), o.fin ? ramp(p.eye) : p.c, { sh: 0, deep: 0, spec: true });
    s.part(s.blob([[50, 20], [62, 12], [76, 18], [90, 28], [86, 34], [70, 38], [54, 34]]), p.a, { sh: 3, deep: 0 });
    s.part(s.poly([[68, 30], [90, 28], [84, 40], [72, 42]]), ramp('#2a0e14'), { sh: 0, deep: 0, hi: 0 }); for (const x of [74, 82]) s.part(s.poly([[x, 30], [x + 2, 38], [x + 4, 30]]), ramp('#efe6d8'), { sh: 0, deep: 0, hi: 0 });
    eyes(s, [[64, 21]], p.eye);
    if (o.horns) s.part(s.limb([[58, 16, 2.6], [46, 8, 1.8], [40, 12, .8]]), p.acc, { sh: 1, deep: 0, spec: true });
  },
  golem(s, p, o) {
    s.shadow(52, 98, 34, 4);
    const rock = (pts, m = p.a, sh = 4) => s.part(s.poly(pts), m, { sh, deep: 1, spec: true });
    for (const d of [-1, 1]) { const X = (x) => 51 + d * x; rock([[X(6), 70], [X(24), 68], [X(26), 88], [X(30), 98], [X(4), 98], [X(8), 86]]); }
    rock([[22, 34], [36, 20], [68, 20], [84, 36], [76, 64], [62, 76], [40, 76], [28, 64]], p.a, 7);
    s.part(s.poly([[46, 40], [58, 40], [62, 50], [52, 60], [42, 50]]), ramp(p.eye), { sh: 2, deep: 0, spec: true });
    for (const [a, b, c, d] of [[30, 36, 44, 44], [76, 38, 62, 46], [40, 66, 50, 58], [66, 62, 56, 58]]) { s.line(a, b, c, d, p.a[0]); s.line(a, b + 1, c, d + 1, p.eye); }
    for (const d of [-1, 1]) { const X = (x) => 51 + d * x, ex = d > 0 ? 88 : 14; rock([[X(30), 22], [X(46), 28], [X(47), 44], [X(34), 46]], p.b, 3); rock([[X(36), 44], [ex + d * 2, 46], [ex + d * 4, 70], [ex - d * 8, 72]]); rock([[ex - d * 10, 70], [ex + d * 6, 68], [ex + d * 8, 84], [ex - d * 8, 88]], p.b, 3); }
    rock([[40, 24], [48, 12], [62, 14], [66, 26], [60, 36], [44, 36]], p.b, 3); eyes(s, [[47, 25], [56, 25]], p.eye);
    if (o.crystal) for (const [x, y, h] of [[30, 26, 16], [72, 28, 18], [20, 30, 12], [84, 30, 11]]) s.part(s.poly([[x - 4, y], [x, y - h], [x + 4, y]]), ramp(p.eye), { sh: 1, deep: 0, spec: true });
    if (o.gear) { const m = s.disc(52, 50, 11); s.cut(m, s.disc(52, 50, 5)); s.part(m, p.acc, { sh: 2, deep: 0, spec: true }); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s.part(s.disc(52 + Math.cos(a) * 12, 50 + Math.sin(a) * 12, 2), p.acc, { sh: 0, deep: 0, spec: true }); } }
  },
  plant(s, p, o) {
    s.shadow(52, 98, 36, 4);
    for (const [c, sw] of [[[20, 96], 1], [[84, 96], -1], [[36, 98], 1], [[68, 98], -1]]) s.part(s.limb([[52, 76, 7], [c[0] + sw * 12, 86, 4], [c[0], c[1], 1.4]]), p.c, { sh: 2 });
    for (const [a, b] of [[[34, 62], [8, 44]], [[70, 62], [96, 44]], [[38, 54], [14, 26]], [[66, 54], [90, 26]]]) { s.part(s.limb([[...a, 4.4], [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 8, 3], [...b, 1]]), p.b, { sh: 2, spec: true }); s.part(s.poly([[b[0] - 7, b[1] + 3], [b[0], b[1] - 8], [b[0] + 7, b[1] + 3], [b[0], b[1] + 9]]), p.b, { sh: 1, deep: 0, spec: true }); }
    s.part(s.blob([[40, 54], [52, 44], [64, 54], [68, 78], [52, 84], [36, 78]]), p.c, { sh: 4, deep: 1 });
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + .3, x = 52 + Math.cos(a) * 24, y = 34 + Math.sin(a) * 21, x2 = 52 + Math.cos(a + .5) * 14, y2 = 34 + Math.sin(a + .5) * 12, x3 = 52 + Math.cos(a - .5) * 14, y3 = 34 + Math.sin(a - .5) * 12; s.part(s.poly([[x, y], [x2, y2], [x3, y3]]), p.a, { sh: 2, spec: true }); }
    s.part(s.disc(52, 34, 15, 13), ramp('#1a0a14'), { sh: 0, deep: 0, hi: 0 });
    for (let i = 0; i < 9; i++) { const a = i * 2 * Math.PI / 9, x = 52 + Math.cos(a) * 13, y = 34 + Math.sin(a) * 11; s.part(s.poly([[x - 2, y], [52 + Math.cos(a) * 6, 34 + Math.sin(a) * 5], [x + 2, y + 1]]), ramp('#efe6d8'), { sh: 0, deep: 0, hi: 0 }); }
    eyes(s, [[46, 33], [54, 33]], p.eye);
  },
  eye(s, p, o) {
    for (let i = 0; i < 6; i++) { const a = -.4 + i * .84, d = i % 2 ? 1 : -1; s.part(s.limb([[52 + Math.cos(a + 1) * 20, 62, 4.4], [52 + (i - 2.5) * 13, 80, 3.4], [52 + (i - 2.5) * 20 + d * 4, 92, 2], [52 + (i - 2.5) * 16, 100, .8]]), p.b, { sh: 2, spec: true }); }
    s.part(s.blob([[18, 44], [30, 18], [52, 8], [74, 18], [86, 44], [76, 70], [52, 80], [28, 70]]), p.a, { sh: 8, deep: 2, spec: true });
    if (o.veins) for (const [a, b, c, d] of [[22, 40, 34, 44], [30, 22, 38, 34], [74, 22, 66, 34], [82, 42, 70, 46], [30, 66, 40, 58], [72, 66, 64, 58]]) s.line(a, b, c, d, p.eye);
    s.part(s.disc(52, 42, 22, 19), ramp('#efe6d6'), { sh: 4, deep: 1 });
    s.part(s.disc(54, 42, 12), ramp(p.eye), { sh: 3, deep: 1, spec: true }); s.part(s.disc(55, 42, 4.5, 7), ramp('#0c0810'), { sh: 0, deep: 0, hi: 0, line: false }); s.dots([[50, 37], [51, 37], [50, 36]], '#ffffff');
    s.part(s.poly([[26, 30], [52, 18], [78, 30], [66, 24], [52, 22], [38, 24]]), p.a, { sh: 1, deep: 0 });
    for (const [x, y] of [[22, 20], [84, 22], [14, 44], [90, 46]]) { s.part(s.limb([[x, y + 6, 2], [x + (x < 52 ? -3 : 3), y - 8, .8]], undefined, false), p.acc, { sh: 0, deep: 0, spec: true }); }
  },
  slime(s, p, o) {
    s.shadow(52, 96, 40, 4);
    s.part(s.blob([[10, 92], [14, 66], [30, 44], [48, 30], [68, 36], [84, 56], [94, 92], [76, 96], [52, 92], [28, 96]]), p.a, { sh: 8, deep: 2, spec: true });
    for (const [x, y, r] of [[30, 76, 5], [70, 70, 7], [52, 82, 4], [80, 86, 3]]) s.part(s.disc(x, y, r), p.b, { sh: 1, deep: 0, hi: 0, line: false });
    for (const [x, y] of [[20, 58], [34, 40], [76, 46]]) s.part(s.limb([[x, y + 8, 3.4], [x - 2, y - 4, 1.8], [x + 2, y - 10, .8]]), p.a, { sh: 1, deep: 0, spec: true });
    s.part(s.disc(42, 58, 7), ramp('#0f0a12'), { sh: 0, deep: 0, hi: 0 }); s.part(s.disc(64, 56, 8), ramp('#0f0a12'), { sh: 0, deep: 0, hi: 0 }); eyes(s, [[40, 58], [63, 56]], p.eye);
    s.part(s.poly([[38, 74], [52, 70], [68, 74], [60, 82], [46, 82]]), ramp('#0f0a12'), { sh: 0, deep: 0, hi: 0 }); for (const x of [44, 50, 56, 62]) s.part(s.poly([[x - 2, 73], [x, 79], [x + 2, 73]]), ramp('#efe6d8'), { sh: 0, deep: 0, hi: 0 });
    if (o.bones) for (const [a, b, c, d] of [[20, 88, 34, 80], [68, 88, 82, 80]]) s.line(a, b, c, d, '#e8e0d0');
    if (o.crown) s.part(s.poly([[36, 34], [40, 18], [47, 28], [54, 12], [61, 28], [68, 18], [72, 36], [54, 30]]), p.acc, { sh: 1, deep: 0, spec: true });
  },
};
export const FOES = {
  nyxra: ['flyer', { a: '#3c2a5a', c: '#22183c', b: '#8a6aa8', eye: '#ff5a7a' }], grisel: ['rat', { a: '#55505c', b: '#c49a9a', c: '#2c2830', eye: '#ffc23e' }], morvath: ['wraith', { a: '#39465a', acc: '#a8b4c8', eye: '#7fe3ff' }, { scythe: true }],
  tejesombras: ['spider', { a: '#2c2436', b: '#43344f', c: '#1c1626', eye: '#b56aff' }], ascuar: ['beetle', { a: '#6e2a1c', b: '#3a1a18', c: '#2a1414', acc: '#ffb636', eye: '#ff8a3a' }], kargan: ['knight', { a: '#4a3f33', b: '#6e5a42', c: '#3b1f1f', acc: '#a89a7a', eye: '#ffd27a' }, { hood: true }],
  umbrog: ['brute', { a: '#3f5238', b: '#2c3a2a', c: '#3a2a20', acc: '#d8cfae', eye: '#d6ff5a' }, { fur: true, weapon: true }], hielvar: ['golem', { a: '#6fa4c4', b: '#a8d0e6', c: '#2a4a62', eye: '#d8f6ff' }, { crystal: true }], ojounico: ['brute', { a: '#8a6a50', b: '#6e4a3a', c: '#3a2a20', acc: '#e0d6bc', eye: '#ffb636' }, { cyclops: true, weapon: true }],
  carmesi: ['demon', { a: '#8a1f2c', c: '#3a0d18', acc: '#e0d6c4', eye: '#ffdd55', rim: '#ff4a3a' }, { core: true }, 28],
  larva: ['slime', { a: '#4a2a6e', b: '#7a4ab0', eye: '#ff5ad0' }], hueco: ['knight', { a: '#3c3a48', b: '#565466', c: '#20182c', acc: '#8a8698', eye: '#b56aff' }, {}], heraldo: ['wraith', { a: '#4a4038', acc: '#8a7a68', eye: '#ffb636' }, { mask: true }],
  polilla: ['flyer', { a: '#6a6a8e', c: '#3a3a5e', b: '#c8c8e0', acc: '#d8d2a8', eye: '#ffe28f' }, { moth: true }], monje: ['wraith', { a: '#2c2c4e', acc: '#7a7aa0', eye: '#9fa8ff' }, { mask: true }], lamento: ['wraith', { a: '#5a6a7e', acc: '#c8d8e6', eye: '#e6f6ff', face: '#1a2430' }, {}], desvelo: ['wraith', { a: '#3a1e5e', acc: '#ffe28f', eye: '#ffe28f', rim: '#b58bff' }, { crown: true, scythe: true }, 22],
  ratatumba: ['rat', { a: '#3f3a34', b: '#a89a7a', c: '#26221e', eye: '#d6ff5a' }], osario: ['knight', { a: '#5a4a3a', b: '#8a7a62', c: '#2c241e', acc: '#c8bea6', eye: '#ff8a3a' }, { hood: true }], huesero: ['hound', { a: '#3a3430', b: '#d8cfba', c: '#26221e', acc: '#c8bea6', eye: '#ff5a3a' }, { bones: true }], guardacaminos: ['knight', { a: '#54483a', b: '#b08a4a', c: '#5e1f1f', acc: '#d8c07a', eye: '#ffd76a' }, { great: true, crest: '#a8322c' }, 24],
  escoria: ['slime', { a: '#5a2a1c', b: '#ff7a2a', eye: '#ffd76a' }, { bones: true }], automata: ['golem', { a: '#8a6030', b: '#b08444', c: '#3a2614', acc: '#d8b46a', eye: '#ffb636' }, { gear: true }], salamandra: ['serpent', { a: '#a83a1c', b: '#ffb636', c: '#4a140e', acc: '#ffd27a', eye: '#ffe07a' }, { fin: true, horns: true }], yunque: ['brute', { a: '#4a3a3e', b: '#ff6a2a', c: '#22181a', acc: '#d8cfae', eye: '#ffb636' }, { horns: true, weapon: true }, 22],
  somnifera: ['plant', { a: '#a84a8a', b: '#4f7a4a', c: '#2c4a34', eye: '#ffe28f' }], escarabajo: ['beetle', { a: '#a88a2c', b: '#6e5a1c', c: '#3a2e14', acc: '#ffe28f', eye: '#d6ff5a' }], driade: ['plant', { a: '#6e7a3a', b: '#8a6a3a', c: '#3a2a1c', eye: '#d6ff5a' }], hiedra: ['serpent', { a: '#3a6e3a', b: '#a8d86a', c: '#1c3a24', acc: '#d8cfae', eye: '#ff5a7a' }, { fin: false }], modorra: ['slime', { a: '#6a5a8a', b: '#a8a0c8', acc: '#e0c070', eye: '#ffe28f' }, { crown: true }, 18],
  cuervo: ['flyer', { a: '#2a3a5a', c: '#1a2440', b: '#8fb8d8', acc: '#d8e6f0', eye: '#7fe3ff' }, { feather: true }], lobo: ['hound', { a: '#c8d4e0', b: '#eef6fa', c: '#7a8ea4', acc: '#39465a', eye: '#ff5a5a' }], congelado: ['knight', { a: '#6e8aa4', b: '#a8c8e0', c: '#2a4a62', acc: '#d8f0ff', eye: '#d8f6ff' }, {}], hielo: ['golem', { a: '#4f8fb0', b: '#8fc4dc', c: '#1f4a62', eye: '#7fe3ff' }, { crystal: true }], granizo: ['wraith', { a: '#7a9ab4', acc: '#e6f4fa', eye: '#7fe3ff', face: '#14242f' }, { crown: true }], ventisca: ['brute', { a: '#c4d4e0', b: '#8faabf', c: '#3a5a72', acc: '#7fb8d8', eye: '#7fe3ff' }, { fur: true, horns: true }, 22],
  sanguijuela: ['serpent', { a: '#5e1f2c', b: '#a84a5a', c: '#2e0d16', acc: '#d8cfae', eye: '#ffc23e' }, {}], latido: ['eye', { a: '#8a2a3a', b: '#6e1f2c', acc: '#d8c4b0', eye: '#ff5a5a' }, { veins: true }], venas: ['spider', { a: '#5e1426', b: '#7a2030', c: '#2e0d16', eye: '#ff3a4a' }], fatiga: ['eye', { a: '#4a3a5a', b: '#3a2a4a', acc: '#a89ac0', eye: '#d6ff5a' }, {}], arterial: ['knight', { a: '#6e1420', b: '#a82030', c: '#2e0d16', acc: '#e0c0a8', eye: '#ffdd55' }, { hood: true, great: true }], abismo: ['eye', { a: '#a81f30', b: '#7a1420', acc: '#ffe0c8', eye: '#ffdd55', rim: '#ff4a3a' }, { veins: true }, 22],
  segundero: ['beetle', { a: '#6e7a8a', b: '#39465a', c: '#22303f', acc: '#d8b46a', eye: '#7fe3ff' }], minutero: ['knight', { a: '#3f5268', b: '#d8b46a', c: '#1f2c3a', acc: '#efe0b8', eye: '#ffe28f' }, {}], tiempo: ['flyer', { a: '#a8905a', c: '#5e4e30', b: '#e6d8a8', acc: '#efe0b8', eye: '#7fe3ff' }, { moth: true }], mimico: ['golem', { a: '#5a4030', b: '#8a6a44', c: '#2c1f18', acc: '#e0bd62', eye: '#ffb636' }, { gear: true }], cronofago: ['serpent', { a: '#39465a', b: '#a8b8d0', c: '#1a2430', acc: '#e0bd62', eye: '#ffe28f' }, { horns: true, fin: true }], custodio: ['wraith', { a: '#54483a', acc: '#e0bd62', eye: '#7fe3ff' }, { scythe: true, mask: true }], manana: ['demon', { a: '#2c3a5a', c: '#141c34', acc: '#e0bd62', eye: '#7fe3ff', rim: '#7fe3ff' }, { core: true }, 24],
  escriba: ['wraith', { a: '#20202c', acc: '#8a8aa0', eye: '#e6e6f6', face: '#000000' }, { mask: true }], olvido: ['demon', { a: '#2a2436', c: '#0e0a14', acc: '#f4efe6', eye: '#ffffff', rim: '#c8c0ff' }, { core: true }, 34],
  guardia: ['knight', { a: '#4a4c5c', b: '#6e7082', c: '#26283a', acc: '#a8aabc', eye: '#ff5a3a' }, {}],
};
export function foe(key) {
  const [plan, pal, o = {}, g = 0] = FOES[key], s = new Sprite(S, S), p = palette(pal);
  if (g) glow(s, p.rim, g);
  plans[plan](s, p, o);
  return s.finish({ rim: p.rim, rimStrength: .55 });
}
