// Hero classes: one adult, anime-proportioned body in a three-quarter battle stance, dressed by a config.
import { Sprite, ramp, smooth, hex, mix } from './engine.mjs';
const W = 84, H = 104, INK = '#140d1a';
function weapon(s, kind, R, x, y) {
  const M = R.metal, B = R.blade, L = R.leather, A = R.acc;
  const bar = (a, b, r, m) => s.part(s.limb([[...a, r], [...b, r * .8]], undefined, false), m, { sh: 1, deep: 0, spec: true });
  const blade = (pts, r = B) => s.part(s.poly(pts), r, { sh: 2, deep: 1, spec: true });
  if (kind === 'sword') { blade([[x, y - 2], [x + 20, y - 34], [x + 25, y - 42], [x + 26, y - 33], [x + 6, y + 1]]); s.line(x + 5, y - 3, x + 22, y - 32, B[4]); bar([x - 5, y - 7], [x + 9, y + 3], 1.6, A); bar([x - 3, y + 6], [x + 2, y - 1], 1.3, L); }
  if (kind === 'great') { blade([[x - 2, y - 4], [x + 20, y - 44], [x + 27, y - 54], [x + 31, y - 43], [x + 10, y + 3]]); s.part(s.poly([[x + 7, y - 13], [x + 20, y - 38], [x + 23, y - 36], [x + 11, y - 11]]), A, { sh: 0, deep: 0, hi: 0, line: false }); bar([x - 7, y - 9], [x + 13, y + 5], 2.2, A); bar([x - 7, y + 9], [x + 2, y - 2], 1.6, L); }
  if (kind === 'spear') { bar([x - 18, y + 28], [x + 22, y - 44], 1.1, L); blade([[x + 19, y - 42], [x + 29, y - 62], [x + 28, y - 41], [x + 24, y - 36]]); bar([x + 16, y - 38], [x + 27, y - 35], 1.3, A); s.part(s.limb([[x + 20, y - 36, 1], [x + 14, y - 28, .8], [x + 16, y - 20, .6]]), A, { sh: 0, deep: 0, hi: 0 }); }
  if (kind === 'staff') { bar([x - 8, y + 34], [x + 8, y - 44], 1.2, L); s.part(s.limb([[x + 8, y - 44, 1.5], [x + 1, y - 51, 1.3], [x + 5, y - 58, 1.1], [x + 14, y - 55, 1], [x + 13, y - 47, .8]]), M, { sh: 1, deep: 0, spec: true }); s.part(s.disc(x + 7, y - 50, 3.4), A, { sh: 1, deep: 0, spec: true }); }
  if (kind === 'moon') { bar([x - 8, y + 34], [x + 7, y - 40], 1.2, M); const m = s.disc(x + 9, y - 49, 11); s.cut(m, s.disc(x + 14, y - 51, 9.2)); s.part(m, A, { sh: 1, deep: 0, spec: true }); }
  if (kind === 'bow') { s.part(s.limb([[x, y - 34, .9], [x + 10, y - 20, 1.7], [x + 14, y, 2], [x + 10, y + 20, 1.7], [x, y + 34, .9]]), L, { sh: 1, deep: 0, spec: true }); s.line(x, y - 34, x, y + 34, '#e8e2d2'); bar([x + 11, y - 2], [x + 16, y + 2], 1.3, A); }
  if (kind === 'axe') { bar([x - 10, y + 22], [x + 17, y - 42], 1.3, L); blade([[x + 13, y - 34], [x + 30, y - 47], [x + 37, y - 26], [x + 29, y - 15], [x + 9, y - 25]]); s.part(s.poly([[x + 27, y - 42], [x + 33, y - 27], [x + 28, y - 19]]), A, { sh: 0, deep: 0, hi: 0, line: false }); }
  if (kind === 'scythe') { bar([x - 12, y + 30], [x + 17, y - 46], 1.1, L); blade([[x + 18, y - 48], [x + 2, y - 60], [x - 24, y - 52], [x - 2, y - 51], [x + 13, y - 41]]); s.part(s.disc(x + 16, y - 45, 2.2), A, { sh: 0, deep: 0, spec: true }); }
  if (kind === 'twin') { blade([[x + 1, y - 3], [x + 19, y - 20], [x + 25, y - 22], [x + 21, y - 15], [x + 5, y + 1]]); s.line(x + 5, y - 3, x + 20, y - 18, B[4]); bar([x - 3, y - 5], [x + 5, y + 3], 1.3, A); }
  if (kind === 'orb') { s.part(s.disc(x + 8, y - 11, 7), A, { sh: 3, deep: 1, spec: true }); s.dots([[x + 5, y - 15], [x + 6, y - 15], [x + 5, y - 14]], '#ffffff'); for (const [a, b] of [[-4, -22], [16, -18], [18, -4]]) s.dots([[x + a, y + b]], A[4]); }
  if (kind === 'hammer') { bar([x - 10, y + 20], [x + 16, y - 34], 1.4, L); blade([[x + 4, y - 44], [x + 27, y - 35], [x + 22, y - 20], [x - 1, y - 30]], M); s.part(s.poly([[x + 9, y - 37], [x + 19, y - 33], [x + 17, y - 27], [x + 7, y - 31]]), A, { sh: 0, deep: 0, spec: true }); }
  if (kind === 'lance') { blade([[x - 8, y + 10], [x + 32, y - 40], [x + 41, y - 52], [x + 37, y - 36], [x - 2, y + 14]]); bar([x - 3, y - 6], [x + 7, y + 6], 2.6, A); }
  if (kind === 'book') { s.part(s.poly([[x - 6, y - 6], [x + 9, y - 9], [x + 11, y + 3], [x - 4, y + 7]]), A, { sh: 2, spec: true }); s.line(x + 1, y - 7, x + 3, y + 5, A[0]); }
}
export function hero(c) {
  const s = new Sprite(W, H);
  const R = {
    skin: ramp(c.skin || '#dca582', { cool: '#6d2f4e', warm: '#ffe6cf' }), hair: ramp(c.hair || '#2a2433'), cloth: ramp(c.cloth), under: ramp(c.under || '#262230'), armor: ramp(c.armor || c.cloth),
    acc: ramp(c.acc), cape: ramp(c.cape || c.cloth), leather: ramp(c.leather || '#47301f'), metal: ramp(c.metal || '#a3aec2'), blade: ramp(c.blade || '#d5dfea'), boot: ramp(c.boot || '#2a2430'),
  };
  const ink = hex(INK), eye = c.eye || '#6fb4d8', pose = c.pose || 'guard';
  const fold = (a, b, d, e, m) => s.line(a, b, d, e, mix(m[1], m[0], .5));
  const lite = (a, b, d, e, m) => s.line(a, b, d, e, m[3]);
  s.shadow(41, 98, 27, 4);
  if (c.aura) for (let i = 0; i < 34; i++) { const a = i * 2.4, r = 27 + (i * 7) % 13, x = Math.round(42 + Math.cos(a) * r), y = Math.round(50 + Math.sin(a) * r * 1.35); s.put(x, y, hex(c.aura)); if (i % 3 === 0) s.put(x, y - 1, hex(c.aura)); }
  // Cape, blown back to the left.
  if (c.capeOn !== false) {
    const edge = c.torn ? [[20, 94], [17, 84], [12, 96], [9, 82], [3, 90]] : [[24, 95], [12, 92]];
    s.part(s.poly(smooth([[34, 29], [46, 29], [42, 56], [34, 78], [29, 94], ...edge, [1, 66], [8, 46], [20, 34]], true, 5)), R.cape, { sh: 5, deep: 2 });
    fold(24, 44, 15, 86, R.cape[0] ? R.cape : R.cape); fold(16, 46, 8, 78, R.cape); lite(28, 40, 22, 62, R.cape);
    if (c.capeTrim) s.part(s.poly(smooth([[28, 94], [12, 92], [11, 89], [28, 91]], true, 3)), R.acc, { sh: 0, deep: 0, line: false });
  }
  if (c.tail) s.part(s.limb([[43, 11, 3], [33, 11, 3.6], [25, 20, 3], [19, 36, 2.2], [11, 50, .9]]), R.hair, { sh: 2, spec: true });
  const far = pose === 'guard' ? [60, 53] : pose === 'cast' ? [66, 43] : [63, 53];
  const near = c.nearHand || (pose === 'guard' ? [53, 58] : pose === 'cast' ? [18, 66] : [20, 66]);
  if (!c.nearWeapon) weapon(s, c.w, R, ...far);
  s.part(s.limb([[52, 34, 4], [60, 43, 3.4], [far[0], far[1], 2.8]]), c.sleeve ? R.cloth : R.under, { sh: 2 });
  if (c.gauntlet) s.part(s.limb([[60, 43, 3.7], [far[0], far[1], 3.3]], undefined, false), R.armor, { sh: 2, spec: true });
  s.part(s.disc(far[0], far[1], 2.7), c.gauntlet ? R.armor : R.skin, { sh: 1, deep: 0 });
  // Legs: wide, planted stance; boots up to the shin with a cuff.
  const leg = (hip, knee, ank, toe, mat) => {
    s.part(s.limb([[...hip, 6.4], [...knee, 4.2], [...ank, 3.1]]), mat, { sh: 3, deep: 1 });
    fold(hip[0] + 1, hip[1] + 6, knee[0], knee[1] - 2, mat);
    s.part(s.poly(smooth([[knee[0] - 3.8, knee[1] + 7], [knee[0] + 4.2, knee[1] + 6], [ank[0] + 4, ank[1] + 1], [toe[0] - 2, toe[1] - 3], [toe[0] + 2, toe[1]], [toe[0] + 1, toe[1] + 2], [ank[0] - 5, toe[1] + 2], [ank[0] - 4, ank[1]]], true, 3)), R.boot, { sh: 2, deep: 1, spec: true });
    s.part(s.poly([[knee[0] - 4.8, knee[1] + 6], [knee[0] + 5, knee[1] + 5], [knee[0] + 4.6, knee[1] + 9], [knee[0] - 4.4, knee[1] + 10]]), c.greave ? R.acc : R.leather, { sh: 1, deep: 0, spec: true });
    if (c.greave) { s.part(s.poly(smooth([[knee[0] - 4, knee[1] - 3], [knee[0], knee[1] - 5.5], [knee[0] + 4.6, knee[1] - 3], [knee[0] + 4.4, knee[1] + 4], [knee[0], knee[1] + 7], [knee[0] - 4, knee[1] + 4]], true, 3)), R.armor, { sh: 2, spec: true }); s.part(s.poly([[knee[0] - 3, ank[1] - 11], [knee[0] + 4, ank[1] - 11], [ank[0] + 3, ank[1] + 1], [ank[0] - 3, ank[1] + 1]]), R.armor, { sh: 2, spec: true }); }
  };
  leg([46, 60], [53, 74], [56, 89], [66, 96], R.under);
  leg([34, 60], [27, 74], [23, 89], [33, 96], R.under);
  // Skirts: robe, or long coat tails split at the front.
  if (c.body === 'robe') { s.part(s.poly(smooth([[30, 50], [47, 50], [56, 70], [63, 93], [47, 96], [34, 94], [18, 96], [20, 74]], true, 5)), R.cloth, { sh: 5, deep: 2 }); fold(34, 62, 28, 92, R.cloth); fold(44, 62, 49, 92, R.cloth); lite(30, 64, 24, 90, R.cloth); s.part(s.poly(smooth([[18, 92], [34, 90], [47, 92], [63, 89], [63, 93], [47, 96], [34, 94], [18, 96]], true, 3)), R.acc, { sh: 0, deep: 0, line: false }); s.part(s.poly([[36, 54], [43, 54], [45, 94], [35, 94]]), R.under, { sh: 2, deep: 0 }); }
  if (c.body === 'coat') {
    s.part(s.poly(smooth([[29, 52], [37, 54], [31, 74], [20, 93], [10, 86], [19, 66]], true, 5)), R.cloth, { sh: 3 }); fold(29, 58, 17, 86, R.cloth);
    s.part(s.poly(smooth([[42, 54], [49, 52], [58, 66], [68, 84], [60, 88], [47, 70]], true, 5)), R.cloth, { sh: 3 });
    s.part(s.poly([[10, 86], [20, 93], [21, 90], [12, 83]]), R.acc, { sh: 0, deep: 0, line: false });
  }
  // Torso: broad shoulders, narrow waist.
  const heavy = c.body === 'plate';
  s.part(s.blob([[26, 33], [38, 28], [52, 31], [53, 41], [47, 53], [47, 60], [32, 60], [31, 52], [26, 43]]), heavy ? R.armor : R.cloth, { sh: 4, deep: 1, spec: heavy });
  if (heavy) {
    s.part(s.poly(smooth([[30, 33], [47, 33], [49, 42], [41, 51], [32, 44]], true, 4)), R.metal, { sh: 3, deep: 1, spec: true });
    s.line(40, 34, 40, 50, R.metal[0]); s.line(30, 35, 39, 49, R.acc[2]); s.line(49, 35, 41, 49, R.acc[2]);
    s.part(s.disc(40, 41, 2.6), R.acc, { sh: 0, deep: 0, spec: true });
    for (const y of [52, 55]) s.line(32, y, 47, y, R.armor[0]);
  } else {
    s.line(41, 31, 38, 55, R.acc[2]); s.line(42, 31, 39, 55, R.acc[3]);
    fold(31, 38, 36, 52, R.cloth); fold(47, 37, 44, 52, R.cloth);
    if (c.body !== 'robe') { s.part(s.poly([[30, 36], [33, 34], [50, 53], [46, 55]]), R.leather, { sh: 1, deep: 0, spec: true }); s.part(s.disc(41, 45, 1.8), R.acc, { sh: 0, deep: 0, spec: true }); }
  }
  s.part(s.poly(smooth([[30, 55], [47, 55], [48, 60], [31, 60]], true, 3)), R.leather, { sh: 1, deep: 0, spec: true });
  s.part(s.poly([[37, 55], [43, 55], [43, 60], [37, 60]]), R.acc, { sh: 1, deep: 0, spec: true });
  if (heavy || c.tasset) { s.part(s.poly([[29, 60], [37, 60], [35, 71], [25, 69]]), R.armor, { sh: 2, spec: true }); s.part(s.poly([[42, 60], [49, 60], [54, 69], [44, 71]]), R.armor, { sh: 2, spec: true }); s.line(29, 64, 36, 65, R.armor[0]); s.line(43, 65, 50, 64, R.armor[0]); }
  // Neck, back hair and face: long, sharp jaw, turned to the right.
  s.part(s.limb([[41, 23, 3], [40, 31, 3.8]], undefined, false), R.skin, { sh: 2, deep: 0 });
  s.dots([[39, 27], [40, 27], [41, 27], [42, 27], [43, 27], [40, 28], [41, 28], [42, 28], [43, 28]], R.skin[1]);
  if (c.collar) s.part(s.poly(smooth([[28, 31], [33, 20], [38, 29], [47, 29], [52, 22], [54, 32], [41, 37]], true, 4)), R.cape, { sh: 2, spec: true });
  if (c.scarf) { s.part(s.poly(smooth([[32, 26], [49, 26], [51, 33], [41, 36], [31, 33]], true, 4)), R.acc, { sh: 3 }); s.part(s.poly(smooth([[33, 28], [22, 26], [8, 32], [2, 28], [6, 38], [18, 40], [28, 37], [35, 34]], true, 4)), R.acc, { sh: 3 }); }
  const hs = c.hairStyle || 'spiky';
  const backHair = { long: [[33, 7], [44, 5], [52, 12], [50, 25], [43, 22], [43, 34], [38, 46], [37, 35], [32, 50], [30, 35], [24, 44], [27, 24]], spiky: [[30, 22], [27, 15], [31, 6], [44, 3], [53, 11], [50, 24], [36, 27]], short: [[31, 20], [31, 9], [44, 4], [52, 12], [49, 24], [35, 26]], tied: [[31, 20], [31, 9], [44, 4], [52, 12], [49, 24], [35, 26]] }[hs];
  if (backHair) s.part(hs === 'long' ? s.poly(backHair) : s.blob(backHair), R.hair, { sh: 3, spec: true });
  s.part(s.poly(smooth([[35, 12], [40, 7], [48, 7], [52, 13], [51, 19], [47, 26], [44, 28], [37, 21]], true, 4)), R.skin, { sh: 1, deep: 0, hi: 0 });
  s.dots([[37, 19], [38, 20], [38, 21], [39, 22], [39, 23], [40, 24], [41, 25], [42, 26], [37, 18], [37, 17], [38, 19], [38, 18], [39, 20], [39, 21], [40, 22], [40, 23]], R.skin[1]);
  const visor = c.head === 'helm' || c.head === 'wing' || c.head === 'mask';
  if (!visor) {
    s.line(43, 16, 47, 15, ink); s.dots([[42, 17], [47, 16]], ink); s.dots([[43, 17], [44, 17]], '#efe9df'); s.dots([[45, 17], [46, 17], [45, 18], [46, 18]], eye); s.dots([[46, 17]], ink); s.dots([[45, 17]], '#ffffff'); s.dots([[44, 19], [45, 19]], R.skin[1]);
    s.line(49, 15, 51, 16, ink); s.dots([[49, 17], [50, 17], [49, 18], [50, 18]], eye); s.dots([[50, 17]], ink);
    s.line(42, 14, 46, 13, ink); s.line(49, 13, 51, 14, ink);
    s.dots([[48, 21]], R.skin[1]); s.dots([[48, 20]], R.skin[3]); s.line(45, 24, 48, 24, mix(R.skin[1], R.skin[0], .7));
    if (c.scar) s.line(43, 18, 46, 23, '#9c4f54');
    if (c.beard) { s.part(s.poly(smooth([[37, 20], [42, 23], [48, 23], [51, 21], [50, 26], [46, 35], [42, 42], [39, 34], [36, 25]], true, 4)), R.hair, { sh: 2, deep: 0, spec: true }); s.line(45, 24, 48, 24, R.hair[0]); }
  }
  // Front hair: long sharp locks and a highlight band.
  const fringe = {
    spiky: [[32, 22], [28, 14], [32, 13], [29, 6], [35, 8], [35, 0], [41, 5], [46, -1], [48, 6], [55, 3], [53, 10], [58, 12], [53, 14], [53, 20], [50, 13], [48, 18], [45, 12], [43, 17], [40, 11], [37, 19], [36, 24]],
    short: [[33, 21], [31, 11], [35, 5], [44, 3], [52, 7], [54, 14], [52, 18], [49, 12], [45, 15], [41, 11], [37, 16], [36, 22]],
    tied: [[33, 21], [31, 11], [35, 5], [44, 3], [52, 7], [54, 14], [52, 18], [49, 12], [45, 15], [41, 11], [37, 16], [36, 22]],
    long: [[33, 24], [31, 11], [35, 5], [44, 3], [52, 7], [55, 16], [53, 25], [51, 15], [48, 11], [43, 14], [39, 11], [37, 19], [36, 28]],
  }[hs];
  if (fringe && !['hood', 'helm', 'wing'].includes(c.head)) { s.part(s.poly(fringe), R.hair, { sh: 2, deep: 0, spec: true }); s.line(36, 8, 41, 6, R.hair[4]); s.line(42, 7, 48, 6, R.hair[4]); s.line(36, 9, 38, 8, R.hair[3]); }
  const hg = {
    band: () => { s.part(s.poly([[34, 9], [52, 7], [53, 10], [34, 12]]), R.acc, { sh: 1, deep: 0, line: false }); s.part(s.poly(smooth([[34, 10], [24, 6], [12, 14], [3, 11], [11, 19], [24, 15], [33, 13]], true, 4)), R.acc, { sh: 2 }); },
    hood: () => { s.part(s.poly(smooth([[31, 27], [27, 14], [32, 3], [44, 0], [54, 6], [57, 15], [51, 11], [42, 9], [37, 14], [37, 26], [40, 34], [30, 33]], true, 5)), R.cape, { sh: 3, spec: true }); s.dots([[39, 13], [40, 12], [41, 12], [42, 12], [43, 12], [44, 12], [45, 12], [46, 12], [47, 12], [48, 12], [49, 13]], R.skin[1]); },
    helm: () => {
      s.part(s.poly(smooth([[33, 22], [31, 10], [37, 3], [48, 3], [54, 10], [54, 20], [49, 28], [42, 29], [36, 26]], true, 5)), R.armor, { sh: 3, spec: true });
      s.part(s.poly([[42, 13], [55, 12], [54, 18], [44, 18]]), { 0: ink, 1: ink, 2: ink, 3: ink, 4: ink }, { sh: 0, deep: 0, hi: 0 }); s.dots([[48, 15], [49, 15], [50, 15], [51, 15]], c.eye || '#ff5a4a'); s.line(46, 21, 53, 21, R.armor[0]); s.line(47, 24, 52, 24, R.armor[0]); s.line(36, 6, 49, 5, R.acc[2]);
      s.part(s.poly(smooth([[36, 7], [28, -2], [16, 2], [8, -2], [14, 10], [33, 13]], true, 4)), R.acc, { sh: 2 });
    },
    wing: () => { hg.helm(); s.part(s.poly([[34, 9], [23, 2], [8, 1], [15, 7], [7, 10], [17, 13], [11, 18], [33, 15]]), R.metal, { sh: 2, spec: true }); },
    crown: () => s.part(s.poly([[35, 8], [36, 0], [40, 5], [43, -2], [46, 4], [51, -1], [52, 8], [43, 6]]), R.acc, { sh: 1, deep: 0, spec: true }),
    circlet: () => { s.part(s.poly([[34, 9], [52, 7], [53, 10], [35, 12]]), R.metal, { sh: 0, deep: 0, line: false, spec: true }); s.part(s.disc(46, 8, 2), R.acc, { sh: 0, deep: 0, spec: true }); },
    wizard: () => { s.part(s.poly(smooth([[22, 12], [36, 7], [37, -2], [31, -9], [46, -3], [51, 7], [65, 11], [50, 14], [36, 14]], true, 4)), R.cape, { sh: 3, spec: true }); s.part(s.poly([[33, 10], [52, 9], [52, 13], [33, 14]]), R.acc, { sh: 0, deep: 0, line: false }); },
    horns: () => { s.part(s.limb([[35, 8, 2.4], [28, 3, 1.8], [21, 4, .7]]), R.metal, { sh: 1, deep: 0, spec: true }); s.part(s.limb([[49, 5, 2.4], [54, 0, 1.6], [61, -1, .7]]), R.metal, { sh: 1, deep: 0, spec: true }); },
    mask: () => { s.part(s.poly(smooth([[35, 12], [40, 7], [48, 7], [52, 13], [51, 19], [47, 26], [44, 28], [37, 21]], true, 4)), R.metal, { sh: 2, spec: true }); s.line(43, 16, 47, 16, ink); s.line(49, 16, 51, 16, ink); s.dots([[45, 16], [50, 16]], c.eye || '#7fe3ff'); s.line(44, 22, 49, 22, R.metal[0]); },
  };
  if (hg[c.head]) hg[c.head]();
  // Near arm crosses to the grip, or hangs ready; the shoulder guard goes on top.
  if (c.nearWeapon) weapon(s, c.w, R, ...near);
  if (c.shield) {
    s.part(s.limb([[28, 35, 4.2], [24, 47, 3.4], [22, 56, 3]]), R.under, { sh: 2 });
    s.part(s.poly(smooth([[6, 40], [29, 38], [32, 58], [21, 80], [7, 62]], true, 4)), R.armor, { sh: 4, spec: true });
    s.part(s.poly(smooth([[11, 45], [26, 44], [28, 57], [20, 72], [11, 59]], true, 4)), R.acc, { sh: 3 });
    s.line(19, 46, 20, 70, R.metal[3]); s.line(12, 54, 27, 54, R.metal[3]); s.part(s.disc(19.5, 54, 2.6), R.metal, { sh: 0, deep: 0, spec: true });
  } else {
    const elbow = pose === 'guard' ? [31, 50] : pose === 'cast' ? [21, 50] : [21, 50];
    s.part(s.limb([[28, 35, 4.4], [...elbow, 3.6], [near[0], near[1], 2.9]]), c.sleeve ? R.cloth : R.under, { sh: 2 });
    if (c.gauntlet) s.part(s.limb([[...elbow, 3.9], [near[0], near[1], 3.4]], undefined, false), R.armor, { sh: 2, spec: true });
    s.part(s.disc(near[0], near[1], 2.8), c.gauntlet ? R.armor : R.skin, { sh: 1, deep: 0 });
  }
  if (c.paul) {
    const g = c.paul === 'gold' ? R.acc : R.armor;
    s.part(s.poly(smooth([[17, 38], [20, 28], [32, 25], [37, 32], [31, 41], [22, 44]], true, 5)), g, { sh: 3, spec: true });
    s.part(s.poly(smooth([[19, 41], [21, 34], [29, 34], [29, 41], [23, 46]], true, 4)), g, { sh: 2, spec: true });
    if (c.spike) { s.part(s.poly([[23, 29], [20, 15], [29, 27]]), R.metal, { sh: 1, deep: 0, spec: true }); s.part(s.poly([[30, 27], [31, 18], [34, 29]]), R.metal, { sh: 0, deep: 0, spec: true }); }
  }
  if (c.fur) s.part(s.poly([[20, 40], [19, 31], [24, 33], [25, 26], [30, 29], [35, 24], [38, 29], [45, 27], [47, 31], [54, 30], [51, 35], [43, 35], [34, 34], [27, 41]]), ramp(c.fur), { sh: 2, spec: true });
  if (c.dual) weapon(s, c.dual, R, near[0] + 2, near[1] + 2);
  return s.finish({ rim: c.rim || '#6a7cff', rimStrength: .55 });
}
const plate = { body: 'plate', paul: true, gauntlet: true, greave: true };
// Art id -> outfit. Ids match the class tree in game.js.
export const CLASSES = {
  aprendiz: { cloth: '#7a6a50', under: '#38333c', acc: '#b98f49', w: 'sword', hairStyle: 'short', hair: '#3a2b28', capeOn: false, pose: 'guard', eye: '#7a5a3a' },
  caminante: { cloth: '#46604c', under: '#2f2c32', acc: '#c49044', cape: '#54402e', w: 'staff', hairStyle: 'short', hair: '#3a2b28', pose: 'ready', scarf: true, eye: '#7a5a3a', rim: '#d8a860' },
  guerrero: { ...plate, cloth: '#6b7482', under: '#23262e', armor: '#6f7a8b', acc: '#b8322f', cape: '#6e1a22', w: 'sword', head: 'band', torn: true, rim: '#ff7a5a', scar: true, eye: '#c9a36a' },
  caballero: { ...plate, cloth: '#7f8a99', under: '#23262e', armor: '#7e8a9c', metal: '#b9c3d1', acc: '#a8232f', cape: '#6e1a26', w: 'sword', head: 'helm', shield: true, spike: false, rim: '#ffb46a', capeTrim: true },
  berserker: { cloth: '#5a2c28', under: '#1f1a1e', armor: '#4f4a4e', acc: '#d4402f', cape: '#3a1416', w: 'axe', hair: '#7a1f1f', fur: '#5b4634', paul: true, spike: true, gauntlet: true, torn: true, scar: true, rim: '#ff5a3a', eye: '#ff6a3a', tasset: true },
  paladin: { ...plate, cloth: '#e6dcc0', under: '#3a3440', armor: '#cfc4a2', metal: '#efe8d2', acc: '#e0a92e', cape: '#e9e3d0', w: 'great', head: 'wing', paul: 'gold', rim: '#ffd76a', aura: '#ffd76a', capeTrim: true },
  centinela: { ...plate, cloth: '#3f4a58', under: '#1c2028', armor: '#46566b', metal: '#8ea3bd', acc: '#5fb3d9', cape: '#22303f', w: 'hammer', head: 'helm', spike: true, rim: '#7fd4ff', eye: '#7fd4ff' },
  warlord: { ...plate, cloth: '#3a2022', under: '#181418', armor: '#3b3238', metal: '#7d6a6a', acc: '#c9302c', cape: '#4d1216', w: 'great', head: 'horns', hair: '#d8d2c8', spike: true, torn: true, scar: true, rim: '#ff4a3a', eye: '#ff4a3a', blade: '#b9b2b6' },
  serafin: { ...plate, cloth: '#f2ecd8', under: '#4a4452', armor: '#efe6c8', metal: '#fff6da', acc: '#ffc23e', cape: '#fffaf0', w: 'lance', head: 'wing', paul: 'gold', spike: true, rim: '#fff0a8', aura: '#fff0a8', capeTrim: true },
  baluarte: { ...plate, cloth: '#2c3644', under: '#141820', armor: '#37475c', metal: '#a8c0d8', acc: '#7fe3ff', cape: '#16222f', w: 'hammer', head: 'wing', shield: true, spike: true, rim: '#a8ecff', aura: '#7fe3ff', eye: '#a8ecff' },
  titan: { ...plate, cloth: '#2a1214', under: '#120d10', armor: '#2c1f24', metal: '#6b3a3a', acc: '#ff3b2f', cape: '#5c0f14', w: 'great', head: 'horns', hair: '#efe9df', spike: true, torn: true, rim: '#ff3b2f', aura: '#ff5a3a', eye: '#ffdd55', blade: '#3a2a30' },
  explorador: { body: 'coat', cloth: '#24524a', under: '#1f2a2a', acc: '#d97e36', cape: '#163a35', w: 'spear', head: 'hood', scarf: true, rim: '#58e0cf', eye: '#d8b45f', sleeve: true },
  montaraz: { body: 'coat', cloth: '#2d4a36', under: '#1e2620', acc: '#b98f49', cape: '#20382a', w: 'bow', head: 'hood', paul: true, armor: '#5a4632', rim: '#9fe08a', eye: '#d8b45f', sleeve: true, pose: 'ready' },
  danzarin: { body: 'coat', cloth: '#7c2f3e', under: '#1f1a24', acc: '#f0c35a', cape: '#511d2c', w: 'twin', dual: 'twin', hair: '#d9d3e0', hairStyle: 'spiky', tail: true, scarf: false, capeOn: false, rim: '#ff9fbb', eye: '#f0c35a', sleeve: true },
  vendaval: { body: 'coat', cloth: '#2a8c80', under: '#143a38', acc: '#ffd76a', cape: '#1c6f66', w: 'spear', head: 'circlet', hair: '#dff5ef', hairStyle: 'long', scarf: true, rim: '#7ff0dc', aura: '#58e0cf', eye: '#7ff0dc', sleeve: true },
  cazador: { body: 'coat', cloth: '#3b3a2c', under: '#1d1c18', acc: '#e0883c', cape: '#2a2a20', w: 'bow', hair: '#6e4a2c', hairStyle: 'spiky', scarf: true, fur: '#6e5a42', rim: '#ffb46a', eye: '#e0c070', sleeve: true, pose: 'ready', scar: true },
  sombra: { body: 'coat', cloth: '#1f1e2c', under: '#121018', acc: '#c23b6b', cape: '#15131f', w: 'twin', dual: 'twin', head: 'mask', metal: '#c9cfe0', hair: '#3a3350', tail: true, torn: true, rim: '#ff6aa0', eye: '#ff6aa0', sleeve: true },
  cuatrovientos: { body: 'coat', cloth: '#39b3a0', under: '#123a38', acc: '#fff0a8', cape: '#28907f', w: 'lance', head: 'crown', hair: '#eafff8', hairStyle: 'long', scarf: true, rim: '#b8fff0', aura: '#b8fff0', eye: '#b8fff0', sleeve: true },
  errante: { body: 'coat', cloth: '#4a3f33', under: '#1e1a16', acc: '#f0b84a', cape: '#2f271f', w: 'staff', head: 'hood', torn: true, scarf: true, beard: false, rim: '#ffd27a', aura: '#ffd27a', eye: '#ffe08a', sleeve: true },
  tempestad: { body: 'coat', cloth: '#26263e', under: '#101018', acc: '#8fd8ff', cape: '#181830', w: 'twin', dual: 'twin', head: 'horns', metal: '#c8d8ff', hair: '#b8d8ff', hairStyle: 'spiky', torn: true, rim: '#8fd8ff', aura: '#8fd8ff', eye: '#8fd8ff', sleeve: true },
  vigia: { body: 'robe', cloth: '#2c2a6e', under: '#17163a', acc: '#cdbf86', cape: '#1a1850', w: 'moon', head: 'hood', rim: '#8f86ff', eye: '#b58bff', sleeve: true, pose: 'ready' },
  hechicero: { body: 'robe', cloth: '#4a3496', under: '#231a54', acc: '#e8d089', cape: '#2e2070', w: 'moon', head: 'wizard', hair: '#d8d2ea', hairStyle: 'long', rim: '#b58bff', eye: '#ffd76a', sleeve: true, pose: 'ready', collar: true },
  onirico: { body: 'coat', cloth: '#30245e', under: '#17122e', acc: '#ff9fd0', cape: '#221946', w: 'book', hair: '#8f7fd8', hairStyle: 'long', collar: true, rim: '#ff9fd0', eye: '#ff9fd0', sleeve: true, pose: 'cast' },
  oraculo: { body: 'robe', cloth: '#221d5e', under: '#141040', acc: '#ffe28f', cape: '#17134a', w: 'moon', head: 'crown', hair: '#e8e6f6', hairStyle: 'long', rim: '#8f86ff', aura: '#8f86ff', eye: '#ffe28f', sleeve: true, pose: 'ready', collar: true },
  astromante: { body: 'robe', cloth: '#143250', under: '#0c1c30', acc: '#7fd8ff', cape: '#0f2640', w: 'orb', head: 'circlet', hair: '#b8e4ff', hairStyle: 'long', rim: '#7fd8ff', aura: '#7fd8ff', eye: '#7fd8ff', sleeve: true, pose: 'cast', collar: true },
  tejedor: { body: 'robe', cloth: '#4a1f5a', under: '#22102c', acc: '#ff7fc0', cape: '#34143f', w: 'scythe', head: 'mask', metal: '#e0d8ea', hair: '#b08fd8', hairStyle: 'long', rim: '#ff7fc0', eye: '#ff7fc0', sleeve: true, collar: true },
  selene: { body: 'robe', cloth: '#d8dcf6', under: '#30305e', acc: '#fff0a8', cape: '#ecefff', w: 'moon', head: 'crown', hair: '#f6f6ff', hairStyle: 'long', rim: '#dfe4ff', aura: '#dfe4ff', eye: '#8f86ff', sleeve: true, pose: 'ready', capeTrim: true },
  archimago: { body: 'robe', cloth: '#0e2440', under: '#081424', acc: '#ffd76a', cape: '#0b1c34', w: 'orb', head: 'wizard', beard: false, hair: '#e6eefc', hairStyle: 'long', rim: '#a8d8ff', aura: '#ffd76a', eye: '#ffd76a', sleeve: true, pose: 'cast', collar: true },
  segador: { body: 'robe', cloth: '#1c0f2a', under: '#0e0816', acc: '#ff5a9a', cape: '#120a1e', w: 'scythe', head: 'hood', torn: true, rim: '#ff5a9a', aura: '#ff5a9a', eye: '#ff5a9a', sleeve: true },
  sabio: { body: 'robe', cloth: '#4e2f7a', under: '#28163f', acc: '#e0bd62', cape: '#341f58', w: 'staff', head: 'wizard', hair: '#e8e2d6', hairStyle: 'long', beard: true, skin: '#cfa184', rim: '#c9a6ff', eye: '#7ab8d8', sleeve: true, pose: 'ready' },
};
