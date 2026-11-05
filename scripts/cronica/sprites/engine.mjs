// Tiny pixel-art engine: rasterizes shapes into masks, shades each part with cel bands (cool shadow,
// warm light, light from the upper left), draws inner lines and a dark outline, and writes PNGs.
import zlib from 'node:zlib';
export const hex = (s) => { s = s.replace('#', ''); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
export const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
export function ramp(base, o = {}) {
  const b = hex(base), cool = hex(o.cool || '#1b1242'), warm = hex(o.warm || '#fff1c9');
  return [mix(b, hex('#0a0614'), .74), mix(b, cool, .48), b, mix(b, warm, .3), mix(b, warm, .66)];
}
export const smooth = (pts, closed = true, n = 6) => {
  const out = [], L = pts.length, at = (i) => (closed ? pts[(i + L) % L] : pts[Math.max(0, Math.min(L - 1, i))]);
  for (let i = 0; i < (closed ? L : L - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((a) => .5 * (2 * p1[a] + (p2[a] - p0[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (3 * p1[a] - p0[a] - 3 * p2[a] + p3[a]) * t3)));
    }
  }
  if (!closed) out.push(pts[L - 1]);
  return out;
};
export class Sprite {
  constructor(w, h) { Object.assign(this, { w, h, rgba: new Uint8ClampedArray(w * h * 4), occ: new Uint8Array(w * h) }); }
  mask() { return new Uint8Array(this.w * this.h); }
  poly(pts, m = this.mask()) {
    const { w, h } = this, ys = pts.map((p) => p[1]), y0 = Math.max(0, Math.floor(Math.min(...ys))), y1 = Math.min(h - 1, Math.ceil(Math.max(...ys)));
    for (let y = y0; y <= y1; y++) {
      const c = y + .5, xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= c && by > c) || (by <= c && ay > c)) xs.push(ax + ((c - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.max(0, Math.round(xs[i])); x < Math.min(w, Math.round(xs[i + 1])); x++) m[y * w + x] = 1;
    }
    return m;
  }
  blob(pts, m) { return this.poly(smooth(pts), m); }
  disc(x, y, rx, ry = rx, m = this.mask()) {
    for (let j = Math.floor(y - ry); j <= y + ry; j++) for (let i = Math.floor(x - rx); i <= x + rx; i++) {
      if (i < 0 || j < 0 || i >= this.w || j >= this.h) continue;
      const dx = (i + .5 - x) / rx, dy = (j + .5 - y) / ry;
      if (dx * dx + dy * dy <= 1) m[j * this.w + i] = 1;
    }
    return m;
  }
  // A tapered chain [[x, y, r], ...]: arms, legs, tails, tentacles.
  limb(chain, m = this.mask(), curve = true) {
    const pts = curve && chain.length > 2 ? (() => { const s = smooth(chain.map((p) => [p[0], p[1]]), false, 8), rs = smooth(chain.map((p, i) => [p[2], i]), false, 8); return s.map((p, i) => [p[0], p[1], rs[i][0]]); })() : chain;
    for (let i = 0; i + 1 < pts.length; i++) {
      const [a, b] = [pts[i], pts[i + 1]], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 2) + 1;
      for (let k = 0; k <= n; k++) { const t = k / n; this.disc(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.max(.6, a[2] + (b[2] - a[2]) * t), undefined, m); }
    }
    return m;
  }
  cut(m, c) { for (let i = 0; i < m.length; i++) if (c[i]) m[i] = 0; return m; }
  in(m, x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h && m[y * this.w + x]; }
  put(x, y, c, a = 255) { if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; const i = (y * this.w + x) * 4; this.rgba[i] = c[0]; this.rgba[i + 1] = c[1]; this.rgba[i + 2] = c[2]; this.rgba[i + 3] = a; if (a === 255) this.occ[y * this.w + x] = 1; }
  // Paint a mask with cel bands: a shadow crescent on the lower right, a thin light on the upper left.
  part(m, R, o = {}) {
    const { w, h } = this, sh = o.sh ?? 2, deep = o.deep ?? 1, hi = o.hi ?? 1, lx = o.lx ?? 1, ly = o.ly ?? 1, line = o.line ?? true;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!m[y * w + x]) continue;
      let t = 2;
      if (hi && !this.in(m, x - hi * lx, y - hi * ly)) t = o.spec ? 4 : 3;
      if (sh && !this.in(m, x + sh * lx, y + sh * ly)) t = 1;
      if (deep && !this.in(m, x + deep * lx, y + deep * ly)) t = o.flatDeep ? 1 : 0.5;
      const c = t === .5 ? mix(R[1], R[0], .55) : R[t];
      const edge = line && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const X = x + a, Y = y + b; return !this.in(m, X, Y) && X >= 0 && Y >= 0 && X < w && Y < h && this.occ[Y * w + X]; });
      this.put(x, y, edge ? mix(R[0], [8, 5, 14], .5) : c);
    }
    return this;
  }
  flat(m, c) { const v = typeof c === 'string' ? hex(c) : c; for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (m[y * this.w + x]) this.put(x, y, v); return this; }
  dots(list, c) { const v = typeof c === 'string' ? hex(c) : c; for (const [x, y] of list) this.put(x, y, v); return this; }
  line(x0, y0, x1, y1, c) { const v = typeof c === 'string' ? hex(c) : c, n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))); for (let i = 0; i <= n; i++) this.put(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), v); return this; }
  // Finish: dark outer outline, optional rim light on the side facing away from the key light.
  finish(o = {}) {
    const { w, h } = this, line = hex(o.line || '#0e0914'), add = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (this.occ[y * w + x]) continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => this.in(this.occ, x + a, y + b))) add.push([x, y]);
    }
    if (o.rim) {
      const rim = hex(o.rim), st = o.rimStrength ?? .62;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (this.occ[y * w + x] && !this.in(this.occ, x + 1, y) ) { const i = (y * w + x) * 4; this.put(x, y, mix([this.rgba[i], this.rgba[i + 1], this.rgba[i + 2]], rim, st)); }
      }
    }
    for (const [x, y] of add) this.put(x, y, line);
    return this;
  }
  shadow(x, y, rx, ry, a = 90) { const m = this.disc(x, y, rx, ry); for (let j = 0; j < this.h; j++) for (let i = 0; i < this.w; i++) if (m[j * this.w + i] && !this.occ[j * this.w + i]) { const k = (j * this.w + i) * 4; this.rgba[k + 3] = a; } return this; }
  png() { return encodePng(this.w, this.h, this.rgba); }
}
const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (b) => { let c = 0xffffffff; for (const v of b) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const n = Buffer.alloc(4); n.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([n, td, c]); };
export function encodePng(w, h, rgba) {
  const colors = new Map(); let idx = true;
  for (let i = 0; i < rgba.length; i += 4) { const k = rgba[i + 3] === 0 ? 0 : (rgba[i] << 24 >>> 0) + (rgba[i + 1] << 16) + (rgba[i + 2] << 8) + rgba[i + 3]; if (!colors.has(k)) { colors.set(k, colors.size); if (colors.size > 256) { idx = false; break; } } }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = idx ? 3 : 6;
  const parts = [Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr)];
  let raw;
  if (idx) {
    const pal = Buffer.alloc(colors.size * 3), tr = Buffer.alloc(colors.size);
    for (const [k, i] of colors) { pal[i * 3] = (k >>> 24) & 255; pal[i * 3 + 1] = (k >>> 16) & 255; pal[i * 3 + 2] = (k >>> 8) & 255; tr[i] = k & 255; }
    parts.push(chunk('PLTE', pal), chunk('tRNS', tr));
    raw = Buffer.alloc((w + 1) * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const p = (y * w + x) * 4, k = rgba[p + 3] === 0 ? 0 : (rgba[p] << 24 >>> 0) + (rgba[p + 1] << 16) + (rgba[p + 2] << 8) + rgba[p + 3]; raw[y * (w + 1) + 1 + x] = colors.get(k); }
  } else {
    raw = Buffer.alloc((w * 4 + 1) * h);
    for (let y = 0; y < h; y++) Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  parts.push(chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)));
  return Buffer.concat(parts);
}
// Contact sheet for review: sprites side by side at an integer scale, on a dark ground.
export function sheet(list, cols, scale = 3, bg = '#1a1722') {
  const cw = Math.max(...list.map((s) => s.w)) * scale + 8, ch = Math.max(...list.map((s) => s.h)) * scale + 8, rows = Math.ceil(list.length / cols);
  const W = cols * cw, H = rows * ch, out = new Uint8ClampedArray(W * H * 4), g = hex(bg);
  for (let i = 0; i < W * H; i++) { out[i * 4] = g[0]; out[i * 4 + 1] = g[1]; out[i * 4 + 2] = g[2]; out[i * 4 + 3] = 255; }
  list.forEach((s, n) => {
    const ox = (n % cols) * cw + 4, oy = Math.floor(n / cols) * ch + 4;
    for (let y = 0; y < s.h * scale; y++) for (let x = 0; x < s.w * scale; x++) {
      const p = (Math.floor(y / scale) * s.w + Math.floor(x / scale)) * 4, a = s.rgba[p + 3] / 255; if (!a) continue;
      const q = ((oy + y) * W + ox + x) * 4; for (let c = 0; c < 3; c++) out[q + c] = s.rgba[p + c] * a + out[q + c] * (1 - a);
    }
  });
  return encodePng(W, H, out);
}
