/*
 * The plates. Each one is a subject from the original ink series, redrawn as a
 * field of characters that mean what they depict: wings of 光 and 翼, clouds of
 * 雲 and 霧, a city of 目 and 田, a barrier of katakana strokes around one 人.
 */
import {
  FAMILY,
  FLOW,
  INK,
  KATA,
  LINE,
  clamp,
  fbm,
  hash,
  lineChar,
  loadFonts,
  loadImage,
  rasterize,
  sampleImage,
  smooth,
  type Api,
  type Program,
  type Spec,
} from "./engine";
import { type Colossus, HORIZON, LIES, SHORE, STREAK, colossusField } from "./shore-shape";

function strokes(api: Api) {
  return { h: api.g(LINE.h), v: api.g(LINE.v), up: api.g(LINE.up), down: api.g(LINE.down) };
}

function lineGlyph(api: Api, theta: number) {
  return api.g(lineChar(theta));
}

/** The wave stroke for a direction: 〜 and ︴ where `lineGlyph` would draw ー and ｜. */
function flowGlyph(api: Api, theta: number) {
  return api.g(lineChar(theta, FLOW));
}

/* ------------------------------------------------------------ 天使 hero --- */

const heroRamp: Spec[] = ["丶", "・", "一", "ニ", "白", "天", "羽", "翼", "光", "900:光"];

/*
 * The winged-beams plate, sampled: beams resolve to katakana strokes along their
 * edges and kanji of light inside them. A pulse travels outward from the kneeling
 * figure so the wings breathe. The wordmark is cut out of the same field.
 */
export const hero: Program<{ word?: string }> = {
  glyphs: () => [...heroRamp, "輝", "900:天", "900:使", "900:人"],
  async create(api, o) {
    const { cols, rows } = api;
    const word = o.word ?? "aaen";
    const [img] = await Promise.all([
      loadImage("/assets/gen-winged-beams.jpg"),
      loadFonts(Array.from(word).map((c) => `900:${c}`)),
    ]);
    const narrow = cols < rows;
    const f = sampleImage(img, cols, rows, { fx: narrow ? 0.64 : 0.5, fy: 0.78, contrast: 1.2 });
    const ramp = api.ramp(heroRamp);
    const bright = [api.g("輝"), api.g("光")];
    const fill = api.g("900:光");
    const glints = [api.g("900:天"), api.g("900:使")];

    const mask = rasterize(cols, rows, (ctx, W, H) => {
      ctx.font = `900 100px ${FAMILY}`;
      const m = ctx.measureText(word);
      const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const size = 100 * Math.min((W * (narrow ? 0.86 : 0.74)) / m.width, (H * 0.3) / h);
      ctx.font = `900 ${size}px ${FAMILY}`;
      const mm = ctx.measureText(word);
      const x = W / 2 - (mm.actualBoundingBoxRight - mm.actualBoundingBoxLeft) / 2 + mm.actualBoundingBoxLeft;
      const y = H * 0.45 + (mm.actualBoundingBoxAscent - mm.actualBoundingBoxDescent) / 2;
      ctx.fillText(word, x, y);
    });

    const n = cols * rows;
    const inWord = new Uint8Array(n);
    for (let i = 0; i < n; i++) inWord[i] = mask.cov[i] > 0.4 ? 1 : 0;
    // 1 = knocked out around the letters, 2 = dimmed a little further out.
    const halo = new Uint8Array(n);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (inWord[i]) continue;
        let near = 9;
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= cols || yy >= rows) continue;
            if (inWord[yy * cols + xx]) near = Math.min(near, Math.max(Math.abs(dx), Math.abs(dy)));
          }
        }
        halo[i] = near <= 1 ? 1 : near <= 3 ? 2 : 0;
      }
    }

    const base = new Int16Array(n);
    const level = new Float32Array(n);
    const dist = new Float32Array(n);
    const [fx, fy] = f.map(0.664, 0.835);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const a = Math.pow(clamp((f.cov[i] - 0.34) / 0.56), 1.2);
        level[i] = a;
        dist[i] = Math.hypot(x - fx, (y - fy) * 1.1);
        if (inWord[i]) {
          const edge = mask.cov[i] < 0.9 && mask.energy[i] > 0.02 && mask.coh[i] > 0.45;
          base[i] = edge ? lineGlyph(api, mask.ang[i]) : fill;
        } else {
          const edge = a > 0.08 && f.energy[i] > 0.008 && f.coh[i] > 0.5;
          base[i] = edge ? lineGlyph(api, f.ang[i]) : ramp[Math.round(a * (ramp.length - 1))];
        }
      }
    }
    const figure = api.g("900:人");

    const kana = KATA.map((k) => api.g(k));

    return (t) => {
      const { glyph, alpha, ink } = api;
      const glintTick = Math.floor(t * 2);
      // 0 at rest, 1 once the hero has scrolled most of the way off
      const gone = clamp(window.scrollY / (window.innerHeight * 0.85));
      const fade = 1 - gone * 0.75;
      for (let i = 0; i < n; i++) {
        if (inWord[i] && gone > 0.002) continue;
        if (inWord[i]) {
          glyph[i] = base[i];
          alpha[i] = 1;
          ink[i] = INK.BONE;
          if (base[i] === fill && hash(i, glintTick) > 0.993) {
            glyph[i] = glints[i & 1];
            ink[i] = INK.RED;
          }
          continue;
        }
        if (halo[i] === 1) continue;
        let a = level[i];
        if (a < 0.04) continue;
        a *= 0.58 + 0.42 * (0.5 + 0.5 * Math.sin(dist[i] * 0.3 - t * 1.9));
        if (halo[i] === 2) a *= 0.45;
        a *= fade;
        let g = base[i];
        if (level[i] > 0.72 && hash(i, Math.floor(t * 1.1 + hash(i) * 9)) > 0.965) g = bright[i & 1];
        glyph[i] = g;
        alpha[i] = a;
        ink[i] = INK.BONE;
      }
      if (gone > 0.002) {
        // each letter cell falls at its own rate and loses its shape to kana
        const e = gone * gone;
        const tick = Math.floor(t * 8);
        for (let i = 0; i < n; i++) {
          if (!inWord[i]) continue;
          const x = i % cols;
          const y = (i - x) / cols;
          const r = hash(i, 41);
          const ny = y + e * rows * (0.25 + 1.1 * r);
          const nx = x + (hash(i, 43) - 0.5) * e * 14;
          const scrambled = hash(i, tick) < gone * 1.3;
          api.put(nx, ny, scrambled ? kana[Math.floor(hash(i, tick, 2) * kana.length)] : base[i], 1 - gone * 0.8, scrambled ? (hash(i, 47) < 0.12 ? INK.RED : INK.DIM) : INK.BONE);
        }
      }
      const fi = Math.round(fy) * cols + Math.round(fx);
      if (fi >= 0 && fi < n && !inWord[fi] && halo[fi] !== 1) api.put(fx, fy, figure, 1, INK.RED);
    };
  },
};

/* --------------------------------------------------------- 結界 octagon --- */

/*
 * The barrier: concentric walls round one small 人, drifting outward under a slow
 * pulse. They began as octagons and have softened into ripples — each ring
 * wavers as it travels, and every cell is the wave stroke of its ring's tangent.
 */
export const octagon: Program = {
  glyphs: () => ["・", "丶", "星", "900:人", "壁"],
  create(api) {
    const { cols, rows } = api;
    const dot = api.g("・");
    const speck = api.g("丶");
    const star = api.g("星");
    const wall = api.g("壁");
    const person = api.g("900:人");
    const cx = cols / 2;
    const cy = rows / 2;
    // room at the rim for the ripples, so no ring is ever clipped flat by the plate's edge
    const R = Math.min(cols, rows) / 2 - 3;
    const inner = R * 0.24;
    const sp = Math.max(1.7, (R - inner) / 10);
    // distance out from the centre, rippled by noise: rings like a dropped stone's
    const field = (dx: number, dy: number, t: number) =>
      Math.hypot(dx, dy) +
      Math.sin(Math.atan2(dy, dx) * 5 + t * 0.9) * 1.3 +
      (fbm(dx * 0.1 + 3, dy * 0.1 + t * 0.15, 2) - 0.5) * 4;
    // the stroke of the ring's tangent, jittered a little per cell so the four stroke
    // sectors blend into each other instead of reading as the sides of an octagon
    const tangent = (dx: number, dy: number, t: number) =>
      flowGlyph(
        api,
        Math.atan2(field(dx, dy + 0.5, t) - field(dx, dy - 0.5, t), field(dx + 0.5, dy, t) - field(dx - 0.5, dy, t)) +
          Math.PI / 2 +
          (hash(Math.floor(dx * 2), Math.floor(dy * 2), 7) - 0.5) * 0.9,
      );

    return (t) => {
      const { glyph, alpha, ink } = api;
      const phase = (t * 0.8) % sp;
      const pulse = ((t * 9) % (R * 2.2)) - R * 0.2;
      const P = api.pointer;
      const s2 = (R * 0.32) ** 2;
      const pull = sp * 2.2;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const dx = x + 0.5 - cx;
          const dy = y + 0.5 - cy;
          let d = field(dx, dy, t);
          if (P.on) {
            const px = x + 0.5 - P.x;
            const py = y + 0.5 - P.y;
            d -= pull * Math.exp(-(px * px + py * py) / s2);
          }
          if (d > R + 0.6) {
            const h = hash(x, y, 11);
            if (h > 0.982) {
              glyph[i] = h > 0.996 ? star : speck;
              alpha[i] = 0.15 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.3 + h * 40));
              ink[i] = INK.BONE;
            }
            continue;
          }
          const boost = Math.max(0, 1 - Math.abs(d - pulse) / 1.6);
          // no outer wall: the rings thin out as they reach the rim, like water settling
          const rim = 1 - smooth(R * 0.62, R + 0.6, d);
          if (d > inner) {
            const k = (((d - inner - phase) % sp) + sp) % sp;
            if (k < 1) {
              glyph[i] = tangent(dx, dy, t);
              alpha[i] = (0.4 + 0.6 * boost) * rim;
              ink[i] = INK.BONE;
            } else if (hash(x, y, 3) > 0.55) {
              glyph[i] = dot;
              alpha[i] = 0.07 + 0.2 * boost;
              ink[i] = INK.BONE;
            }
          } else {
            const p = d / inner;
            if (hash(x, y, 5) < 0.25 + 0.5 * p) {
              glyph[i] = p > 0.7 ? wall : speck;
              alpha[i] = 0.08 + 0.3 * p * p;
              ink[i] = INK.BONE;
            }
          }
        }
      }
      api.put(Math.floor(cx), Math.floor(cy), person, 1, INK.RED);
    };
  },
};

/* --------------------------------------------------------------- 読 orb --- */

const orbSurface: Spec[] = ["読", "語", "字", "言", "文", "書", "音", "声"];

/*
 * The orb-and-ring plate, turning: a globe surfaced with the characters of
 * language, ringed by the kana running in orbit, one red star riding the ring,
 * and far below it a single figure falling, as in the ink original.
 */
export const orb: Program = {
  glyphs: () => [...orbSurface, ...orbSurface.map((s) => `900:${s}`), "900:星", "人", "・"],
  create(api) {
    const { cols, rows } = api;
    const thin = orbSurface.map((s) => api.g(s));
    const heavy = orbSurface.map((s) => api.g(`900:${s}`));
    const kana = KATA.map((k) => api.g(k));
    const star = api.g("900:星");
    const fall = api.g("人");
    const dot = api.g("・");
    const cx = cols / 2;
    const cy = rows * 0.44;
    const R = Math.max(3, Math.min(rows * 0.3, cols / 5.4));
    const rx = R * 2.35;
    const ry = R * 0.44;
    const tilt = -0.09;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const lx = 0.5;
    const ly = -0.5;
    const lz = Math.sqrt(1 - lx * lx - ly * ly);
    const perimeter = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    const N = Math.max(24, Math.round(perimeter));

    const ring = (phi: number, scale = 1): [number, number, boolean] => {
      const px = Math.cos(phi) * rx * scale;
      const py = Math.sin(phi) * ry * scale;
      return [cx + px * ct - py * st, cy + px * st + py * ct, Math.sin(phi) < 0];
    };
    const onDisc = (x: number, y: number) => Math.hypot(x + 0.5 - cx, y + 0.5 - cy) < R + 0.2;

    return (t) => {
      const { glyph, alpha, ink } = api;
      const spin = t * 0.3;

      // a faint field of dust, so the globe hangs in something
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const h = hash(x, y, 31);
          if (h > 0.986) api.put(x, y, dot, 0.12 + 0.2 * (0.5 + 0.5 * Math.sin(t + h * 50)), INK.BONE);
        }
      }

      const y0 = Math.max(0, Math.floor(cy - R - 1));
      const y1 = Math.min(rows - 1, Math.ceil(cy + R + 1));
      const x0 = Math.max(0, Math.floor(cx - R - 1));
      const x1 = Math.min(cols - 1, Math.ceil(cx + R + 1));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = (x + 0.5 - cx) / R;
          const dy = (y + 0.5 - cy) / R;
          const r2 = dx * dx + dy * dy;
          if (r2 > 1) continue;
          const i = y * cols + x;
          const nz = Math.sqrt(1 - r2);
          const shade = Math.max(0, dx * lx + dy * ly + nz * lz);
          if (r2 > 0.82) {
            glyph[i] = flowGlyph(api, Math.atan2(dy, dx) + Math.PI / 2);
            alpha[i] = 0.3 + 0.6 * shade;
            ink[i] = INK.BONE;
            continue;
          }
          const lon = Math.atan2(dx, nz) + spin;
          const lat = Math.asin(dy);
          const u = Math.floor((lon / (Math.PI * 2)) * 22 + 1000);
          const v = Math.floor(((lat + Math.PI / 2) / Math.PI) * 11);
          const k = Math.floor(hash(u, v, 21) * thin.length);
          glyph[i] = shade > 0.62 ? heavy[k] : thin[k];
          alpha[i] = 0.06 + 0.94 * Math.pow(shade, 1.6);
          ink[i] = INK.BONE;
        }
      }

      // the ring: an outer stream of kana, an inner hairline of strokes
      const step = Math.floor(t * 3.2);
      for (let k = 0; k < N; k++) {
        const phi = (k / N) * Math.PI * 2;
        const [x, y, back] = ring(phi);
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        if (xi < 0 || yi < 0 || xi >= cols || yi >= rows) continue;
        if (back && onDisc(xi, yi)) continue;
        api.put(xi, yi, kana[(((k - step) % kana.length) + kana.length) % kana.length], back ? 0.4 : 1, INK.BONE);
        const [hx, hy, hb] = ring(phi, 0.86);
        const hxi = Math.floor(hx);
        const hyi = Math.floor(hy);
        if (hb && onDisc(hxi, hyi)) continue;
        const tx = -Math.sin(phi) * rx;
        const ty = Math.cos(phi) * ry;
        const tangent = Math.atan2(tx * st + ty * ct, tx * ct - ty * st);
        if (hb && glyph[hyi * cols + hxi] >= 0) continue;
        api.put(hxi, hyi, flowGlyph(api, tangent), hb ? 0.18 : 0.45, INK.DIM);
      }

      const [sx, sy, sback] = ring(t * 0.4);
      if (!(sback && onDisc(Math.floor(sx), Math.floor(sy)))) api.put(Math.floor(sx), Math.floor(sy), star, 1, INK.RED);

      const fy = cy + R * 2.15 + Math.sin(t * 0.6) * 0.5;
      if (fy < rows - 1) api.put(Math.floor(cx + Math.sin(t * 0.25) * 2), Math.floor(fy), fall, 0.8, INK.BONE);
    };
  },
};

/* ------------------------------------------------------- 光 cross / city --- */

const city: Spec[] = ["目", "田", "口", "日", "皿", "亠"];

/*
 * The beam-city plate: a cross of light over a city drawn in the characters that
 * look like buildings — 目 for towers, 田 for lit grids, 口 for blocks. Rays turn
 * slowly; windows come on and go out.
 */
export const rays: Program = {
  glyphs: () => [...city, "光", "900:光", "輝", "900:輝", "・", "丶"],
  create(api) {
    const { cols, rows } = api;
    const L = strokes(api);
    const lit = api.g("田");
    const kinds = [api.g("目"), api.g("口"), api.g("日"), api.g("皿")];
    const roof = api.g("亠");
    const beam = api.g("900:光");
    const beamSoft = api.g("光");
    const core = api.g("900:輝");
    const dot = api.g("・");
    const cx = Math.floor(cols * 0.44) + 0.5;
    const horizon = rows - Math.max(3, Math.round(rows * 0.1));
    const cy = Math.round(horizon * 0.44) + 0.5;
    const maxD = Math.hypot(Math.max(cx, cols - cx), Math.max(cy, rows - cy));
    const NR = 150;

    const height = new Int16Array(cols);
    const kind = new Uint8Array(cols);
    const edge = new Uint8Array(cols);
    let x = 0;
    let b = 0;
    while (x < cols) {
      const w = 2 + Math.floor(hash(b, 1) * 4);
      const env = 0.3 + 0.7 * smooth(0.58, 0.85, x / cols) + (hash(b, 2) > 0.88 ? 0.45 : 0);
      const h = Math.max(1, Math.round(rows * 0.2 * env * (0.35 + 0.65 * hash(b, 3))));
      for (let j = 0; j < w && x + j < cols; j++) {
        height[x + j] = h;
        kind[x + j] = b % kinds.length;
        edge[x + j] = j === 0 || j === w - 1 ? 1 : 0;
      }
      x += w + (hash(b, 4) > 0.75 ? 1 : 0);
      b++;
    }

    return (t) => {
      const { glyph, alpha, ink } = api;
      const rot = t * 0.18;
      const breathe = 0.25 * Math.sin(t * 0.9);
      const glowH = Math.max(3, Math.round(rows * 0.22));
      for (let y = 0; y < horizon; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const dx = x + 0.5 - cx;
          const dy = y + 0.5 - cy;
          const d = Math.hypot(dx, dy);
          if (d < 3.6) {
            glyph[i] = core;
            alpha[i] = 1;
            ink[i] = INK.BONE;
            continue;
          }
          if (Math.abs(dx) < 1.1 + breathe + Math.abs(dy) * 0.012) {
            glyph[i] = Math.abs(dx) < 0.6 ? beam : beamSoft;
            alpha[i] = 0.95;
            ink[i] = INK.BONE;
            continue;
          }
          if (Math.abs(dy) < 0.75 + breathe * 0.5) {
            const a = Math.exp(-Math.abs(dx) / (cols * 0.32));
            glyph[i] = a > 0.6 ? beam : L.h;
            alpha[i] = 0.35 + 0.65 * a;
            ink[i] = INK.BONE;
            continue;
          }
          const th = Math.atan2(dy, dx);
          const u = (th / (Math.PI * 2) + 0.5) * NR + rot;
          const k = Math.floor(u);
          const fr = u - k;
          const kk = ((k % NR) + NR) % NR;
          const w = 0.12 + 0.4 * hash(kk, 1);
          if (fr < w && d > 5) {
            const bright = 0.25 + 0.75 * hash(kk, 2);
            const fall = 0.4 + 0.6 * clamp(1 - d / (maxD * 1.05));
            const flick = 0.75 + 0.25 * Math.sin(t * 1.4 + kk * 1.7);
            glyph[i] = lineGlyph(api, th);
            alpha[i] = bright * fall * flick;
            ink[i] = INK.BONE;
          }
          if (y >= horizon - glowH && glyph[i] < 0) {
            const p = (y - (horizon - glowH)) / glowH;
            if (hash(x, y, 9) < p * 0.85) {
              glyph[i] = dot;
              alpha[i] = 0.1 + 0.45 * p;
              ink[i] = INK.BONE;
            }
          }
        }
      }
      // skyline over the glow
      for (let x = 0; x < cols; x++) {
        const h = height[x];
        for (let k = 0; k < h; k++) {
          const y = horizon - 1 - k;
          if (y < 0) break;
          const i = y * cols + x;
          if (k === h - 1) {
            glyph[i] = roof;
            alpha[i] = 0.4;
            ink[i] = INK.BONE;
            continue;
          }
          const on = !edge[x] && hash(x, y, Math.floor(t * 0.22 + hash(x, y, 2) * 8)) > 0.84;
          glyph[i] = on ? lit : kinds[kind[x]];
          alpha[i] = on ? 0.95 : 0.2;
          ink[i] = on && hash(x, y, 5) > 0.95 ? INK.RED : INK.BONE;
        }
      }
      for (let x = 0; x < cols; x++) {
        api.put(x, horizon, L.h, 0.5, INK.BONE);
        for (let y = horizon + 1; y < rows; y++) {
          const h = hash(x, y, Math.floor(t * 0.5));
          if (h > 0.93) api.put(x, y, dot, 0.12, INK.BONE);
        }
      }
    };
  },
};

/* ------------------------------------------------------ 使者 stream ------ */

/*
 * Send word: one red 人, and words streaming away from it — 言 語 文 信 字 声 —
 * carried on a current that curls as it goes. Every word leaves a wake, and the
 * wake is drawn in the stroke of the way it was moving, fading behind it.
 */
export const stream: Program<{ x?: number; y?: number }> = {
  glyphs: () => ["言", "語", "文", "信", "字", "声", "900:人", "・"],
  create(api, o) {
    const { cols, rows } = api;
    const words = ["言", "語", "文", "信", "字", "声"].map((w) => api.g(w));
    const me = api.g("900:人");
    const dot = api.g("・");
    const ox = Math.floor(cols * (o.x ?? 0.72));
    const oy = Math.floor(rows * (o.y ?? 0.5));
    const N = cols * rows;
    const wake = new Float32Array(N);
    const dir = new Float32Array(N);
    const n = Math.max(40, Math.round(N / 46));
    const px = new Float32Array(n);
    const py = new Float32Array(n);
    const life = new Float32Array(n);
    const word = new Uint8Array(n);
    let seed = 1;

    const spawn = (k: number) => {
      seed++;
      // most rise from the messenger; some are already out on the current
      if (hash(k, seed) < 0.55) {
        const a = hash(seed, k, 1) * Math.PI * 2;
        px[k] = ox + Math.cos(a) * 1.5;
        py[k] = oy + Math.sin(a) * 1.5;
      } else {
        px[k] = hash(seed, k, 2) * cols;
        py[k] = hash(seed, k, 3) * rows;
      }
      life[k] = 3 + hash(seed, k, 4) * 6;
      word[k] = Math.floor(hash(seed, k, 5) * words.length);
    };
    for (let k = 0; k < n; k++) spawn(k);

    let last = 0;
    const step = (t: number, dt: number) => {
      for (let i = 0; i < N; i++) wake[i] *= Math.pow(0.18, dt);
      for (let k = 0; k < n; k++) {
        const dx = px[k] - ox;
        const dy = py[k] - oy;
        const out = Math.atan2(dy, dx);
        const curl = (fbm(px[k] * 0.045, py[k] * 0.06 + t * 0.08, 3) - 0.5) * 5.5;
        const near = Math.exp(-(dx * dx + dy * dy) / 60);
        const a = out * near + (curl + Math.PI) * (1 - near);
        const v = 9 * dt;
        px[k] += Math.cos(a) * v;
        py[k] += Math.sin(a) * v * 0.6;
        life[k] -= dt;
        const x = Math.floor(px[k]);
        const y = Math.floor(py[k]);
        if (life[k] <= 0 || x < 0 || y < 0 || x >= cols || y >= rows) {
          spawn(k);
          continue;
        }
        const i = y * cols + x;
        wake[i] = Math.min(1, wake[i] + 0.7);
        dir[i] = Math.atan2(Math.sin(a) * 0.6, Math.cos(a));
      }
    };
    // run the current a while first, so even a still frame has its wakes
    for (let k = 0; k < 90; k++) step(k / 30, 1 / 30);

    return (t) => {
      const dt = Math.min(0.1, Math.max(0, t - last));
      last = t;
      step(t + 3, dt);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const w = wake[i];
          if (w > 0.04) api.put(x, y, flowGlyph(api, dir[i]), 0.12 + 0.6 * w, INK.BONE);
          else if (hash(x, y, 21) > 0.985) api.put(x, y, dot, 0.08, INK.DIM);
        }
      }
      for (let k = 0; k < n; k++) {
        const x = Math.floor(px[k]);
        const y = Math.floor(py[k]);
        const fade = Math.min(1, life[k] / 1.5);
        api.put(x, y, words[word[k]], 0.85 * fade, hash(k, 9) > 0.93 ? INK.RED : INK.BONE);
      }
      api.put(ox, oy, me, 1, INK.RED);
    };
  },
};

/* ------------------------------------------------------- 核 vortex ------ */

/*
 * kern: one 核 at the heart, a fleet of server instances — 機 — in orbit round it.
 * Spiral currents wind in towards the core and turn with it; each instance
 * keeps its own orbit, the inner ones quicker, trailing a wake of the strokes
 * of its own path. One of them is red.
 */
export const vortex: Program<{ x?: number; y?: number }> = {
  glyphs: () => ["900:核", "機", "・"],
  create(api, o) {
    const { cols, rows } = api;
    const core = api.g("900:核");
    const unit = api.g("機");
    const dot = api.g("・");
    // on a narrow screen the text sits below, so the core rises to the middle-top
    const narrow = cols < 50;
    const cx = cols * (narrow ? 0.5 : o.x ?? 0.66);
    const cy = rows * (narrow ? 0.34 : o.y ?? 0.5);
    const R = Math.min(cols * (narrow ? 0.62 : 0.48), rows * 0.62);
    const ARMS = 3;
    const B = 1.5; // how tightly the arms wind
    const fleet = Array.from({ length: 9 }, (_, k) => ({
      r: R * (0.22 + 0.68 * (k / 8)) * (0.9 + 0.2 * hash(k, 1)),
      a: hash(k, 2) * Math.PI * 2,
      w: 1.5 / Math.sqrt(R * (0.22 + 0.68 * (k / 8))),
      red: k === 5,
    }));

    return (t) => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dx = x + 0.5 - cx;
          const dy = y + 0.5 - cy;
          const r = Math.hypot(dx, dy);
          if (r < 1.2 || r > R * 1.15) {
            if (hash(x, y, 31) > 0.988) api.put(x, y, dot, 0.08, INK.DIM);
            continue;
          }
          const th = Math.atan2(dy, dx);
          const arm = 0.5 + 0.5 * Math.cos(ARMS * (th - B * Math.log(r)) + t * 0.7);
          const env = smooth(1.5, 4, r) * (1 - smooth(R * 0.55, R * 1.15, r));
          const a = arm ** 10 * env;
          if (a < 0.08) continue;
          // the arm's own direction: perpendicular to the gradient of its phase
          const gx = -dy - B * dx;
          const gy = dx - B * dy;
          api.put(x, y, flowGlyph(api, Math.atan2(gy, gx) + Math.PI / 2), 0.08 + 0.5 * a, INK.BONE);
        }
      }
      for (const f of fleet) {
        const ang = f.a + t * f.w;
        for (let j = 12; j >= 1; j--) {
          const b = ang - j / f.r;
          const x = Math.floor(cx + Math.cos(b) * f.r);
          const y = Math.floor(cy + Math.sin(b) * f.r);
          api.put(x, y, flowGlyph(api, b + Math.PI / 2), 0.5 * (1 - j / 13), f.red ? INK.RED : INK.BONE);
        }
        api.put(Math.floor(cx + Math.cos(ang) * f.r), Math.floor(cy + Math.sin(ang) * f.r), unit, 1, f.red ? INK.RED : INK.BONE);
      }
      api.put(Math.floor(cx), Math.floor(cy), core, 1, INK.BONE);
    };
  },
};

/* -------------------------------------------------------- 詠 river ------ */

/*
 * galdr: raw media in, enchanted media out. On the left the stream churns —
 * strokes at every angle, 音 映 像 声 tumbling through it. A column of 詠 and 唱
 * stands across it, the incantation, a red pulse running down it. Past it the
 * water runs clean: even lanes of waves, and every word carried along one.
 */
export const river: Program<{ gate?: number }> = {
  glyphs: () => ["音", "映", "像", "声", "詠", "唱", "・"],
  create(api, o) {
    const { cols, rows } = api;
    const media = ["音", "映", "像", "声"].map((m) => api.g(m));
    const chant = [api.g("詠"), api.g("唱")];
    const dot = api.g("・");
    const gx = Math.floor(cols * (o.gate ?? 0.34));
    const S = Math.max(3, Math.round(rows / 8)); // lane spacing
    const A = S * 0.9;
    const wave = (x: number, t: number) => smooth(gx + 1, gx + 14, x) * A * Math.sin(x * 0.11 - t * 1.3);
    const slope = (x: number, t: number) => wave(x + 0.5, t) - wave(x - 0.5, t);
    const n = Math.max(10, Math.round(cols / 3));
    const words = Array.from({ length: n }, (_, k) => ({
      x: hash(k, 1) * cols,
      lane: Math.floor(hash(k, 2) * (rows / S + 1)),
      v: 5 + hash(k, 3) * 4,
      g: Math.floor(hash(k, 4) * media.length),
      red: hash(k, 5) > 0.9,
    }));
    let last = 0;

    return (t) => {
      const dt = Math.min(0.1, Math.max(0, t - last));
      last = t;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (x < gx - 1) {
            // raw: turbulence, strokes every which way
            const c = fbm(x * 0.17 + t * 0.4, y * 0.22 - t * 0.3, 2) * smooth(0, gx * 0.5, x);
            if (c > 0.58) {
              const ang = (fbm(x * 0.1, y * 0.1 + t * 0.6, 2) - 0.5) * 9;
              api.put(x, y, flowGlyph(api, ang), 0.1 + (c - 0.58) * 1.6, INK.BONE);
            }
          } else if (x === gx) {
            // the incantation
            const head = (t * 9) % (rows + 12) - 6;
            const hot = Math.abs(y - head) < 2;
            api.put(x, y, chant[y % 2], hot ? 1 : 0.45, hot ? INK.RED : INK.BONE);
          } else if (x > gx + 1) {
            // enchanted: even lanes, each riding the same wave
            const v = y - wave(x, t);
            const lane = Math.round(v / S);
            if (Math.abs(v - lane * S) < 0.55) {
              const swell = 0.5 + 0.5 * Math.sin(x * 0.22 - t * 3 + lane);
              api.put(x, y, flowGlyph(api, Math.atan2(slope(x, t), 1)), 0.22 + 0.5 * swell, INK.BONE);
            }
          } else if (hash(x, y, 41) > 0.7) {
            api.put(x, y, dot, 0.15, INK.DIM);
          }
        }
      }
      for (const w of words) {
        w.x += w.v * dt;
        if (w.x >= cols) {
          w.x -= cols;
          w.g = (w.g + 1) % media.length;
        }
        const x = Math.floor(w.x);
        if (x === gx) continue;
        let y: number;
        if (x < gx) y = Math.round(w.lane * S + (fbm(w.x * 0.2, w.lane * 3 + t * 0.8, 2) - 0.5) * S * 2.4);
        else y = Math.round(w.lane * S + wave(x, t));
        const raw = x < gx;
        api.put(x, y, media[w.g], raw ? 0.55 : 1, w.red && !raw ? INK.RED : raw ? INK.DIM : INK.BONE);
      }
    };
  },
};

/* ------------------------------------------------------ 流 current ------ */

/*
 * The current under the whole site: a fixed, faint field of strokes that run
 * down the page in slow meanders. Its water belongs to the page, not the
 * window — scroll, and the wakes travel up with the content, as if read through
 * water. Drawn dim and sparse, so it is felt more than seen.
 */
export const current: Program = {
  glyphs: () => ["・"],
  create(api) {
    const { cols, rows } = api;
    const N = cols * rows;
    const wake = new Float32Array(N);
    const dir = new Float32Array(N);
    const n = Math.max(20, Math.round(N / 110));
    const px = new Float32Array(n);
    const py = new Float32Array(n);
    const life = new Float32Array(n);
    let seed = 1;
    const spawn = (k: number) => {
      seed++;
      px[k] = hash(seed, k, 1) * cols;
      py[k] = hash(seed, k, 2) * rows;
      life[k] = 4 + hash(seed, k, 3) * 6;
    };
    for (let k = 0; k < n; k++) spawn(k);
    const cellPx = () => window.innerHeight / rows;
    let scrolled = window.scrollY / cellPx();
    let carry = 0;
    let last = 0;

    const step = (t: number, dt: number, shift: number) => {
      // carry the water with the page: whole rows of wake move up as it scrolls
      carry += shift;
      const whole = Math.trunc(carry);
      if (whole !== 0) {
        carry -= whole;
        if (Math.abs(whole) >= rows) wake.fill(0);
        else if (whole > 0) {
          wake.copyWithin(0, whole * cols);
          dir.copyWithin(0, whole * cols);
          wake.fill(0, (rows - whole) * cols);
        } else {
          wake.copyWithin(-whole * cols, 0, (rows + whole) * cols);
          dir.copyWithin(-whole * cols, 0, (rows + whole) * cols);
          wake.fill(0, 0, -whole * cols);
        }
      }
      const fade = Math.pow(0.3, dt);
      for (let i = 0; i < N; i++) wake[i] *= fade;
      for (let k = 0; k < n; k++) {
        py[k] -= shift;
        const page = py[k] + scrolled;
        const a = Math.PI / 2 + (fbm(px[k] * 0.03, page * 0.022 + t * 0.03, 3) - 0.5) * 13;
        px[k] += Math.cos(a) * 3.2 * dt;
        py[k] += Math.sin(a) * 3.2 * dt;
        life[k] -= dt;
        const x = Math.floor(px[k]);
        const y = Math.floor(py[k]);
        if (life[k] <= 0 || x < 0 || y < 0 || x >= cols || y >= rows) {
          spawn(k);
          continue;
        }
        const i = y * cols + x;
        wake[i] = Math.min(1, wake[i] + 0.45);
        dir[i] = a;
      }
    };
    for (let k = 0; k < 150; k++) step(k / 30, 1 / 30, 0);

    return (t) => {
      const dt = Math.min(0.1, Math.max(0, t - last));
      last = t;
      const now = window.scrollY / cellPx();
      const shift = now - scrolled;
      scrolled = now;
      step(t + 5, dt, shift);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (wake[i] > 0.05) api.put(x, y, flowGlyph(api, dir[i]), 0.04 + 0.17 * wake[i], INK.DIM);
        }
      }
    };
  },
};

/* ------------------------------------------------------- 道 causeway ------ */

const hatch: Spec[] = ["・", "ニ", "ミ", "彡", "云"];

/*
 * The clouds-engraving plate: a sea of 雲 drifting left, cut like an engraving —
 * contour lines in katakana strokes, a lit rim on every billow — with causeways
 * of light laid diagonally across it and processions of 人 walking them upward.
 */
export const clouds: Program = {
  glyphs: () => [...hatch, "900:雲", "900:人", "一"],
  create(api) {
    const { cols, rows } = api;
    const L = strokes(api);
    const shade = hatch.map((h) => api.g(h));
    const crest = api.g("900:雲");
    const walker = api.g("900:人");
    const path = api.g("一");
    const slope = 0.58;
    const cosA = 1 / Math.sqrt(1 + slope * slope);
    const bands = [
      { b: rows * 1.05 + cols * slope * 0.15, w: 1.7, speed: 1.1 },
      { b: rows * 0.62 + cols * slope * 0.35, w: 1.0, speed: 0.8 },
      { b: rows * 0.2 + cols * slope * 0.55, w: 0.75, speed: 0.6 },
    ];
    const n = cols * rows;
    const dens = new Float32Array(n);

    return (t) => {
      const { glyph, alpha, ink } = api;
      const drift = t * 0.04;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x * 0.05 + drift;
          const ny = y * 0.095;
          const wx = fbm(nx * 0.7 + 5.2, ny * 0.7 + t * 0.01, 2);
          const wy = fbm(nx * 0.7 + 1.3, ny * 0.7 + 7.7, 2);
          dens[y * cols + x] = fbm(nx + wx * 1.6, ny + wy * 1.2 + 3.1, 3);
        }
      }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const c = dens[i];
          let onBand = 0;
          for (let k = 0; k < bands.length; k++) {
            const dist = (y + 0.5 - (bands[k].b - slope * (x + 0.5))) * cosA;
            if (Math.abs(dist) < bands[k].w) {
              onBand = Math.abs(dist) > bands[k].w - 0.75 ? 2 : 1;
              break;
            }
          }
          const cloud = smooth(0.42, 0.5, c);
          if (onBand && cloud < 0.6) {
            glyph[i] = onBand === 2 ? L.up : path;
            alpha[i] = onBand === 2 ? 0.95 : 0.3;
            ink[i] = INK.BONE;
            continue;
          }
          if (cloud < 0.05) continue;
          const depth = clamp((c - 0.44) / 0.3);
          const l = x > 0 ? dens[i - 1] : c;
          const r = x < cols - 1 ? dens[i + 1] : c;
          const u = y > 0 ? dens[i - cols] : c;
          const d = y < rows - 1 ? dens[i + cols] : c;
          const gx = r - l;
          const gy = d - u;
          const rim = clamp((c - u) * 9);
          if (cloud < 0.95) {
            // the billow's outline
            glyph[i] = flowGlyph(api, Math.atan2(gy, gx) + Math.PI / 2);
            alpha[i] = 0.55 + 0.4 * rim;
          } else if (rim > 0.45 && depth < 0.45) {
            glyph[i] = crest;
            alpha[i] = 0.5 + 0.45 * rim;
          } else if ((depth * 5) % 1 < 0.2 && Math.hypot(gx, gy) > 0.012) {
            // engraved contour inside the billow
            glyph[i] = flowGlyph(api, Math.atan2(gy, gx) + Math.PI / 2);
            alpha[i] = 0.3 + 0.25 * (1 - depth);
          } else {
            glyph[i] = shade[Math.min(shade.length - 1, Math.floor(depth * shade.length))];
            alpha[i] = 0.1 + 0.32 * (1 - depth * 0.6) + 0.2 * rim;
          }
          ink[i] = INK.BONE;
        }
      }
      // processions, walking up the causeways
      for (const band of bands) {
        const xStart = Math.max(0, (band.b - rows) / slope);
        const xEnd = Math.min(cols, band.b / slope);
        if (xEnd <= xStart) continue;
        const len = (xEnd - xStart) / cosA;
        const count = Math.floor(len / 3.2);
        for (let j = 0; j < count; j++) {
          if (hash(j, Math.round(band.b)) > 0.82) continue;
          const s = (((j * 3.2 + hash(j, 9) * 1.4 + t * band.speed) % len) + len) % len;
          const x = xStart + s * cosA;
          const y = band.b - slope * x;
          const xi = Math.floor(x);
          const yi = Math.floor(y - 0.5);
          if (xi < 0 || yi < 0 || xi >= cols || yi >= rows) continue;
          if (dens[yi * cols + xi] > 0.47) continue;
          api.put(xi, yi, walker, 1, INK.BONE);
        }
      }
    };
  },
};

/* --------------------------------------------------- big kanji in kanji --- */

/*
 * A single seal kanji, set huge and filled with the words it stands for — the
 * successor to the old image-filled type. A scan bar passes down it in red.
 */
export const kanji: Program<{ ch: string; fill: string }> = {
  glyphs: (o) => [...Array.from(o.fill), ...Array.from(o.fill).map((c) => `900:${c}`), "十", "・"],
  async create(api, o) {
    const { cols, rows } = api;
    await loadFonts([`900:${o.ch}`]);
    const field = rasterize(cols, rows, (ctx, W, H) => {
      const size = Math.min(W, H) * 0.86;
      ctx.font = `900 ${size}px ${FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(o.ch, W / 2, H / 2 + size * 0.03);
    });
    const fill = Array.from(o.fill).map((c) => api.g(`900:${c}`));
    const plus = api.g("十");
    const n = cols * rows;
    const base = new Int16Array(n).fill(-1);
    for (let i = 0; i < n; i++) {
      const c = field.cov[i];
      if (c > 0.3 && c < 0.88 && field.energy[i] > 0.02 && field.coh[i] > 0.5) {
        base[i] = lineGlyph(api, field.ang[i]);
      }
    }

    return (t) => {
      const { glyph, alpha, ink } = api;
      const scan = ((t * 5) % (rows + 14)) - 7;
      const flow = Math.floor(t * 1.2);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const c = field.cov[i];
          const near = Math.abs(y - scan) < 1.2;
          if (base[i] >= 0) {
            glyph[i] = base[i];
            alpha[i] = 0.95;
            ink[i] = near ? INK.RED : INK.BONE;
          } else if (c >= 0.5) {
            glyph[i] = fill[(((x + y * 3 - flow) % fill.length) + fill.length) % fill.length];
            alpha[i] = near ? 1 : 0.78;
            ink[i] = near ? INK.RED : INK.BONE;
          } else if (x % 4 === 0 && y % 4 === 0) {
            glyph[i] = plus;
            alpha[i] = near ? 0.35 : 0.1;
            ink[i] = near ? INK.RED : INK.DIM;
          }
        }
      }
    };
  },
};

/* ------------------------------------------------------ 地層 world ------ */

/*
 * A block world in cross-section, every cell the kanji for its block: 草 grass
 * on 土 dirt on 石 stone, seams of 炭 鉄 金 玉 and red 紅, snow 雪 on the peaks,
 * lakes of 水, trees of 木 and 葉, and a floor of 盤 — base, bedrock, the layer
 * everything stands on. A new world grows on every page load, and lives there.
 *
 * In it, one red 人 gets on with things. It wanders both ways, stops to look
 * around, hops, swims; it fells trees and the leaves come down after them; it
 * digs mineshafts and climbs back out on a ladder it leaves behind; it plants
 * saplings that grow into trees, bridges gaps and water with planks, and
 * builds itself a pillar to look out from. Water runs into whatever is dug
 * beside it. Day turns to night. A click breaks blocks.
 */

const [AIR, GRASS, DIRT, STONE, COAL, IRON, GOLD, GEM, RUBY, BED, WATER, SAND, LOG, LEAF, SNOW, FLOWER, SAPLING, LAVA, PLANK, LADDER, COBBLE] =
  Array.from({ length: 21 }, (_, n) => n);
const BLOCK = ["", "草", "土", "石", "炭", "鉄", "金", "玉", "紅", "盤", "水", "砂", "木", "葉", "雪", "花", "苗", "炎", "板", "梯", "礫"];
const SHADE = [0, 0.95, 0.55, 0.3, 0.75, 0.82, 0.9, 1, 0.95, 0.62, 0.4, 0.7, 0.7, 0.6, 0.9, 0.8, 0.8, 0.85, 0.8, 0.65, 0.5];
// strikes it takes to break
const HARD = [0, 2, 2, 4, 4, 5, 5, 6, 6, 99, 0, 2, 3, 1, 1, 1, 1, 99, 2, 1, 3];
const solid = (b: number) =>
  b !== AIR && b !== WATER && b !== LEAF && b !== FLOWER && b !== SAPLING && b !== LAVA && b !== LADDER;
const breakable = (b: number) => b !== AIR && b !== WATER && b !== BED && b !== LAVA;

type Job =
  | { kind: "walk"; steps: number }
  | { kind: "rest"; ticks: number }
  | { kind: "hop"; times: number }
  | { kind: "mine"; cells: number[]; hits: number; felled: boolean }
  | { kind: "dig"; depth: number; dug: number; hits: number }
  | { kind: "climb"; height: number; ladder: boolean }
  | { kind: "plant" };

interface World {
  blk: Uint8Array;
  /** The surface as it grew, so the dark behind a cave or a shaft can be told from sky. */
  ground: Int16Array;
  sea: number;
  me: { x: number; y: number; dir: number; job: Job; wood: number; rock: number };
  growing: Map<number, number>; // sapling → when it becomes a tree
  decay: Map<number, number>; // leaf → when it may fall
  struck: Map<number, number>; // block → when it was last hit
  placed: Map<number, number>; // block → when it was set down
  falling: { x: number; y: number; leaf: boolean; at: number }[];
  clock: number;
  nextThink: number;
  nextFlow: number;
}

// One world per page load: the seed is drawn once, and the world grown from it
// — everything dug, built and planted in it too — survives re-layouts and
// remounts. Only a full reload grows another.
let worldSeed = -1;
const worlds = new Map<string, World>();

function setTree(blk: Uint8Array, cols: number, x: number, base: number, height: number, pine: boolean) {
  const set = (xx: number, yy: number, b: number) => {
    if (xx < 0 || xx >= cols || yy < 0) return;
    const i = yy * cols + xx;
    if (blk[i] === AIR || blk[i] === SAPLING || (b === LOG && blk[i] === LEAF)) blk[i] = b;
  };
  for (let k = 0; k < height; k++) set(x, base - k, LOG);
  const top = base - height + 1;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const inPine = Math.abs(dx) <= [0, 1, 1, 2, 2][dy + 2];
      const inOak = dy <= 1 && Math.abs(dx) + Math.abs(dy) <= 3 && !(Math.abs(dx) === 2 && dy === -2);
      if ((pine ? inPine : inOak) && !(dx === 0 && dy >= 0)) set(x + dx, top + dy, LEAF);
    }
  }
}

function growWorld(cols: number, rows: number, seed: number): World {
  const N = cols * rows;
  const o = (seed % 997) * 1.37;
  const blk = new Uint8Array(N);
  const ground = new Int16Array(cols);
  const sea = Math.round(rows * 0.62);
  const floor = rows - 1;
  for (let x = 0; x < cols; x++) {
    // the left of the world sinks to a lake, so the title has calm water under it
    const w = clamp((0.45 - x / cols) / 0.35);
    const calm = w * w * (3 - 2 * w);
    const hills = (fbm(x * 0.03 + o, 1.7, 3) - 0.5) * rows * 0.6;
    const ridge = 1 - Math.abs(fbm(x * 0.07 + o * 1.7, 4.2, 2) * 2 - 1);
    const range = smooth(0.48, 0.72, fbm(x * 0.011 + o * 0.3, 9.1, 2));
    const h = rows * 0.5 + hills - range * ridge * rows * 0.34 * (1 - calm) + rows * 0.18 * calm;
    ground[x] = Math.max(Math.round(rows * 0.2), Math.min(rows - 7, Math.round(h)));
  }
  for (let x = 0; x < cols; x++) {
    const s = ground[x];
    for (let y = 0; y < rows; y++) {
      let b = AIR;
      if (y >= floor) b = BED;
      else if (y > s) {
        const depth = y - s;
        const cave = depth > 3 && fbm(x * 0.09 + o, y * 0.16 + 40, 2) > 0.63;
        if (cave) b = y >= floor - 2 ? LAVA : AIR;
        else if (depth <= 3) b = s >= sea - 1 && depth <= 2 ? SAND : s < rows * 0.34 ? STONE : DIRT;
        else {
          const h = hash(x + seed, y, 3);
          const deep = y / rows;
          if (deep > 0.86 && h > 0.996) b = GEM;
          else if (deep > 0.76 && hash(x + seed, y, 9) > 0.991) b = RUBY;
          else if (deep > 0.8 && h > 0.988) b = GOLD;
          else if (depth > 8 && h > 0.972) b = IRON;
          else if (depth > 4 && h > 0.94) b = COAL;
          else b = STONE;
        }
      } else if (y === s) b = s >= sea ? SAND : s < rows * 0.3 ? SNOW : GRASS;
      else if (y >= sea) b = WATER;
      blk[y * cols + x] = b;
    }
  }
  // trees, pines on the high ground, and flowers between them
  let lastTree = -9;
  for (let x = 2; x < cols - 2; x++) {
    const s = ground[x];
    if (blk[s * cols + x] !== GRASS) continue;
    if (hash(x + seed, 77) > 0.83 && x - lastTree > 3) {
      setTree(blk, cols, x, s - 1, 3 + Math.floor(hash(x + seed, 78) * 2), s < rows * 0.42);
      lastTree = x;
    } else if (hash(x + seed, 79) > 0.86 && blk[(s - 1) * cols + x] === AIR) blk[(s - 1) * cols + x] = FLOWER;
  }
  // the walker starts on its feet, somewhere right of centre
  const x = Math.round(cols * 0.62);
  let y = 0;
  while (y < rows - 1 && !solid(blk[(y + 1) * cols + x]) && blk[(y + 1) * cols + x] !== WATER) y++;
  return {
    blk,
    ground,
    sea,
    me: { x, y, dir: 1, job: { kind: "rest", ticks: 4 }, wood: 0, rock: 0 },
    growing: new Map(),
    decay: new Map(),
    struck: new Map(),
    placed: new Map(),
    falling: [],
    clock: 0,
    nextThink: 0,
    nextFlow: 0,
  };
}

export const world: Program = {
  glyphs: () => [...BLOCK.slice(1), "900:人", "〜", "破", "・", "日", "月", "雲"],
  create(api) {
    const { cols, rows } = api;
    if (worldSeed < 0) worldSeed = Math.floor(Math.random() * 1e6);
    const key = `${cols}x${rows}`;
    const w = worlds.get(key) ?? growWorld(cols, rows, worldSeed);
    worlds.set(key, w);
    const { blk, ground, sea, me } = w;
    const glyph = BLOCK.map((c) => (c ? api.g(c) : -1));
    const G = {
      me: api.g("900:人"), wave: api.g("〜"), hit: api.g("破"), dot: api.g("・"),
      sun: api.g("日"), moon: api.g("月"), cloud: api.g("雲"),
    };
    const idx = (x: number, y: number) => y * cols + x;
    const get = (x: number, y: number) => (x < 0 || x >= cols || y >= rows ? BED : y < 0 ? AIR : blk[idx(x, y)]);
    const rand = Math.random;

    /* -- changing the world ------------------------------------------------- */

    const place = (x: number, y: number, b: number) => {
      if (x < 0 || x >= cols || y < 0 || y >= rows - 1) return;
      blk[idx(x, y)] = b;
      w.placed.set(idx(x, y), w.clock);
    };
    const spend = () => {
      if (me.wood > 0) {
        me.wood--;
        return PLANK;
      }
      me.rock--;
      return COBBLE;
    };
    const smash = (i: number, mine: boolean) => {
      const b = blk[i];
      if (!breakable(b)) return;
      blk[i] = AIR;
      w.struck.set(i, w.clock);
      w.growing.delete(i);
      if (mine) {
        if (b === LOG || b === PLANK) me.wood = Math.min(24, me.wood + 1);
        else if (solid(b)) me.rock = Math.min(24, me.rock + 1);
      }
      const x = i % cols;
      const y = (i - x) / cols;
      w.falling.push({ x, y, leaf: false, at: w.clock });
      // whatever stood on it goes with it
      if (y > 0 && (blk[i - cols] === FLOWER || blk[i - cols] === SAPLING)) smash(i - cols, false);
      // a log gone: the leaves round it may lose their hold
      if (b === LOG) {
        for (let dy = -5; dy <= 2; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx < cols && yy < rows && blk[idx(xx, yy)] === LEAF) {
              w.decay.set(idx(xx, yy), w.clock + 0.4 + rand() * 3.5);
            }
          }
        }
      }
    };
    const held = (i: number) => {
      const x = i % cols;
      const y = (i - x) / cols;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > 3) continue;
          if (get(x + dx, y + dy) === LOG) return true;
        }
      }
      return false;
    };

    /* -- the walker ---------------------------------------------------------- */

    const choose = () => {
      const r = rand();
      const under = get(me.x, me.y + 1);
      const standing = solid(under);
      const wet = [-1, 0, 1].some((dx) => get(me.x + dx, me.y) === WATER || get(me.x + dx, me.y + 1) === WATER);
      if (rand() < 0.3) me.dir = -me.dir;
      if (r < 0.42) me.job = { kind: "walk", steps: 5 + Math.floor(rand() * 14) };
      else if (r < 0.55) me.job = { kind: "rest", ticks: 3 + Math.floor(rand() * 7) };
      else if (r < 0.67 && standing && !wet && under !== PLANK && under !== COBBLE) {
        me.job = { kind: "dig", depth: 3 + Math.floor(rand() * 6), dug: 0, hits: 0 };
      } else if (r < 0.76 && standing && w.growing.size < 4) me.job = { kind: "plant" };
      else if (r < 0.85) me.job = { kind: "hop", times: 1 + Math.floor(rand() * 2) };
      else if (r < 0.93 && standing && me.wood + me.rock >= 3) me.job = { kind: "climb", height: 2 + Math.floor(rand() * 2), ladder: false };
      else me.job = { kind: "walk", steps: 6 + Math.floor(rand() * 10) };
    };

    const think = () => {
      const here = get(me.x, me.y);
      const below = get(me.x, me.y + 1);
      if (solid(here)) {
        me.y--; // buried: climb out
        return;
      }
      if (here === LAVA || me.y >= rows - 1) {
        // lost to the deep: back on the surface somewhere
        me.x = Math.max(1, Math.min(cols - 2, me.x));
        me.y = 0;
        return;
      }
      const swimming = here === WATER;
      const holding = here === LADDER;
      if (!swimming && !holding && !solid(below)) {
        me.y++;
        return;
      }
      if (swimming && get(me.x, me.y - 1) === WATER) {
        me.y--;
        return;
      }
      const job = me.job;

      if (job.kind === "rest") {
        if (rand() < 0.15) me.dir = -me.dir; // looking round
        if (--job.ticks <= 0) choose();
      } else if (job.kind === "hop") {
        if (job.times <= 0) choose();
        else if (solid(below) && !solid(get(me.x, me.y - 1))) {
          me.y--;
          job.times--;
        }
      } else if (job.kind === "walk") {
        const nx = me.x + me.dir;
        const ahead = get(nx, me.y);
        if (nx < 1 || nx > cols - 2 || ahead === LAVA || get(nx, me.y + 1) === LAVA) {
          me.dir = -me.dir;
          return;
        }
        if (!solid(ahead)) {
          if (!swimming) {
            let drop = 0;
            while (drop < 6) {
              const b = get(nx, me.y + 1 + drop);
              if (solid(b) || b === WATER || b === LADDER) break;
              drop++;
            }
            const water = get(nx, me.y + 1) === WATER;
            if ((drop >= 4 || (water && rand() < 0.5)) && me.wood + me.rock > 0) place(nx, me.y + 1, spend());
            else if (drop >= 4) {
              me.dir = -me.dir;
              return;
            }
          }
          me.x = nx;
        } else if (!solid(get(nx, me.y - 1)) && !solid(get(me.x, me.y - 1))) {
          me.x = nx; // a step up
          me.y--;
        } else if (ahead === LOG) {
          // a tree in the way: fell it, the trunk from here up
          const cells: number[] = [];
          for (let y = me.y; y >= 0 && get(nx, y) === LOG; y--) cells.push(idx(nx, y));
          me.job = { kind: "mine", cells, hits: 0, felled: false };
          return;
        } else if (ahead !== BED && rand() < 0.6) {
          me.job = { kind: "mine", cells: [idx(nx, me.y), idx(nx, me.y - 1)], hits: 0, felled: false }; // tunnel through
          return;
        } else if (me.wood + me.rock >= 2 && rand() < 0.5) {
          me.job = { kind: "climb", height: 2, ladder: false }; // build up and over
          return;
        } else me.dir = -me.dir;
        if (--job.steps <= 0) choose();
      } else if (job.kind === "mine") {
        while (job.cells.length && !breakable(blk[job.cells[0]])) job.cells.shift();
        if (!job.cells.length) {
          me.job = { kind: "walk", steps: 3 + Math.floor(rand() * 6) };
          return;
        }
        const i = job.cells[0];
        const b = blk[i];
        w.struck.set(i, w.clock);
        if (++job.hits >= (job.felled ? 1 : HARD[b])) {
          smash(i, true);
          job.hits = 0;
          job.cells.shift();
          if (b === LOG) job.felled = true;
        }
      } else if (job.kind === "dig") {
        const b = get(me.x, me.y + 1);
        if (job.depth <= 0 || !breakable(b) || b === WATER || get(me.x, me.y + 2) === LAVA) {
          me.job = { kind: "climb", height: job.dug, ladder: true };
          return;
        }
        w.struck.set(idx(me.x, me.y + 1), w.clock);
        if (++job.hits >= HARD[b]) {
          smash(idx(me.x, me.y + 1), true);
          job.hits = 0;
          job.depth--;
          job.dug++;
        }
      } else if (job.kind === "climb") {
        if (job.height <= 0) {
          me.job = job.ladder ? { kind: "walk", steps: 4 + Math.floor(rand() * 8) } : { kind: "rest", ticks: 4 + Math.floor(rand() * 4) };
          return;
        }
        if (solid(get(me.x, me.y - 1))) {
          me.job = { kind: "mine", cells: [idx(me.x, me.y - 1)], hits: 0, felled: false };
          return;
        }
        if (job.ladder) {
          place(me.x, me.y, LADDER); // up the shaft, leaving a ladder
          me.y--;
        } else {
          if (me.wood + me.rock <= 0) {
            choose();
            return;
          }
          me.y--; // jump and set a block underfoot
          place(me.x, me.y + 1, spend());
        }
        job.height--;
      } else if (job.kind === "plant") {
        const tx = me.x + me.dir;
        const soil = get(tx, me.y + 1);
        if (get(tx, me.y) === AIR && (soil === GRASS || soil === DIRT)) {
          place(tx, me.y, SAPLING);
          w.growing.set(idx(tx, me.y), w.clock + 25 + rand() * 35);
        }
        me.job = { kind: "rest", ticks: 3 };
      }
    };

    /* -- the world going on round it ----------------------------------------- */

    const tend = () => {
      // water runs down into anything open, and out sideways at sea level and below
      const wet: number[] = [];
      for (let y = rows - 2; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          const i = idx(x, y);
          if (blk[i] !== WATER) continue;
          const d = blk[i + cols];
          if (d === AIR) wet.push(i + cols);
          else if ((solid(d) || d === WATER) && y >= sea) {
            if (x > 0 && blk[i - 1] === AIR) wet.push(i - 1);
            if (x < cols - 1 && blk[i + 1] === AIR) wet.push(i + 1);
          }
        }
      }
      for (const i of wet.slice(0, 60)) blk[i] = WATER;
      // saplings grow, if there is room
      for (const [i, when] of w.growing) {
        if (w.clock < when) continue;
        const x = i % cols;
        const y = (i - x) / cols;
        let room = true;
        for (let k = 1; k <= 5; k++) if (get(x, y - k) !== AIR && get(x, y - k) !== LEAF) room = false;
        w.growing.delete(i);
        if (room && blk[i] === SAPLING) setTree(blk, cols, x, y, 3 + Math.floor(rand() * 2), y < rows * 0.42);
        else if (blk[i] === SAPLING) w.growing.set(i, w.clock + 20);
      }
      // leaves with nothing left to hold them come down
      for (const [i, when] of w.decay) {
        if (w.clock < when) continue;
        w.decay.delete(i);
        if (blk[i] === LEAF && !held(i)) {
          blk[i] = AIR;
          const x = i % cols;
          w.falling.push({ x, y: (i - x) / cols, leaf: true, at: w.clock });
        }
      }
    };

    let last = 0;
    return (t) => {
      const dt = Math.min(0.1, Math.max(0, t - last));
      last = t;
      w.clock += dt;
      const now = w.clock;
      if (now >= w.nextThink) {
        think();
        w.nextThink = now + 0.3;
      }
      if (now >= w.nextFlow) {
        tend();
        w.nextFlow = now + 0.35;
      }

      for (const tap of api.taps.splice(0)) {
        const cx = Math.floor(tap.x);
        const cy = Math.floor(tap.y);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (Math.abs(dx) + Math.abs(dy) > 1 && hash(cx + dx, cy + dy, 3) > 0.5) continue;
            const x = cx + dx;
            const y = cy + dy;
            if (x >= 0 && x < cols && y >= 0 && y < rows - 1) smash(idx(x, y), false);
          }
        }
      }

      // the sky turns: the sun crosses, then the moon, and the stars come out between
      const day = (now / 150 + 0.48) % 1;
      const lit = day < 0.66;
      const arc = lit ? day / 0.66 : (day - 0.66) / 0.34;
      const bodyX = Math.round(cols * (0.04 + 0.92 * arc));
      const bodyY = Math.round(rows * (0.34 - 0.26 * Math.sin(Math.PI * arc)));
      const night = smooth(0.62, 0.7, day) * (1 - smooth(0.94, 1, day));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const b = blk[i];
          const hit = w.struck.get(i);
          if (hit !== undefined && now - hit < 0.22) {
            api.put(x, y, G.hit, 1, INK.RED);
            continue;
          }
          if (b === AIR) {
            if (y > ground[x]) {
              // the dark behind a cave or a shaft
              if ((x + y) % 2 === 0) api.put(x, y, G.dot, 0.07, INK.DIM);
              continue;
            }
            if (y < rows * 0.3) {
              const band = Math.exp(-(((y - rows * 0.13) / (rows * 0.08)) ** 2));
              const puff = smooth(0.42, 0.62, fbm((x + now * 0.7) * 0.025, 5.1, 2));
              const cn = fbm((x + now * 0.7) * 0.05, y * 0.3 + now * 0.04, 3) * band * (0.35 + 0.75 * puff);
              if (cn > 0.6) {
                api.put(x, y, G.cloud, 0.24 + (cn - 0.6) * 1.8);
                continue;
              }
              if (cn > 0.46) {
                api.put(x, y, G.wave, 0.12 + (cn - 0.46) * 1.6);
                continue;
              }
            }
            const d = Math.hypot(x - bodyX, (y - bodyY) * 1.1);
            if (d === 0) api.put(x, y, lit ? G.sun : G.moon, 1);
            else if (lit && d < 6) {
              const ring = Math.sin(d * 1.7 - now * 2);
              if (ring > 0.75 && (x + y) % 2 === 0) api.put(x, y, G.dot, 0.3 * (1 - d / 6));
            } else if (night > 0 && hash(x, y, 13) < 0.014) {
              api.put(x, y, G.dot, (0.08 + 0.3 * (0.5 + 0.5 * Math.sin(now * 1.3 + hash(x, y, 4) * 30))) * night);
            }
            continue;
          }
          let a = SHADE[b];
          let g = glyph[b];
          if (b === STONE) {
            const depth = y - ground[x];
            a = Math.max(0.14, 0.32 - (depth - 4) * 0.005) * (0.55 + 0.9 * fbm(x * 0.07 - now * 0.05, y * 0.11 + now * 0.03, 2));
          } else if (b === LEAF) a *= 0.75 + 0.25 * Math.sin(now * 1.6 + x * 0.9 + y);
          else if (b === FLOWER) a *= 0.8 + 0.2 * Math.sin(now * 2 + x);
          else if (b === LAVA) a *= 0.7 + 0.3 * Math.sin(now * 3 + x * 0.7);
          else if (b === WATER) {
            if (y > 0 && blk[i - cols] === AIR) {
              const crest = Math.sin(x * 0.55 - now * 2.2) > 0.1;
              g = crest ? G.wave : g;
              a = crest ? 0.8 : 0.5;
            } else a = 0.3 + 0.16 * Math.sin(x * 0.3 - now * 1.4 + y * 0.7);
          }
          const set = w.placed.get(i);
          if (set !== undefined && now - set < 0.5) a = 1;
          api.put(x, y, g, a, b === RUBY || b === LAVA ? INK.RED : INK.BONE);
        }
      }

      // leaves drifting down, and chips flying off what was broken
      w.falling = w.falling.filter((f) => {
        const age = now - f.at;
        if (f.leaf) {
          if (age > 4) return false;
          const y = Math.floor(f.y + age * 2.2);
          const x = Math.round(f.x + Math.sin(age * 3 + f.x) * 1.2);
          if (y >= rows || solid(get(x, y))) return false;
          api.put(x, y, glyph[LEAF], 0.55 * (1 - age / 4), INK.BONE);
          return true;
        }
        if (age > 0.45) return false;
        api.put(f.x + (f.x % 2 ? 1 : -1), Math.floor(f.y + age * 6), G.dot, 0.7 * (1 - age / 0.45), INK.BONE);
        return true;
      });

      api.put(me.x, me.y, G.me, 1, INK.RED);
    };
  },
};

/* ----------------------------------------------------- 層 strata ------ */

/*
 * Armature as the stratum it is: four bands of their own kanji — 草 the mods on
 * top, 基 the seam in red, 土 the loaders, 盤 the bedrock. At the left edge the
 * bands lie level, where the page labels them; further right they start to flow,
 * edged in the strokes of their own slope, with a swell running through each.
 */
// band centres as fractions of the plate's height; the Minecraft page sets its labels on these
const STRATA = [0.16, 0.4, 0.63, 0.86];

export const strata: Program = {
  glyphs: () => ["草", "基", "土", "盤", "・"],
  create(api) {
    const { cols, rows } = api;
    const bands = [
      { g: api.g("草"), a: 0.5, c: INK.BONE },
      { g: api.g("基"), a: 0.95, c: INK.RED },
      { g: api.g("土"), a: 0.42, c: INK.BONE },
      { g: api.g("盤"), a: 0.55, c: INK.BONE },
    ];
    const dot = api.g("・");
    const half = Math.max(1, rows * 0.06);
    const amp = rows * 0.11;

    return (t) => {
      for (let x = 0; x < cols; x++) {
        const ramp = smooth(cols * 0.02, cols * 0.34, x);
        for (let i = 0; i < bands.length; i++) {
          const b = bands[i];
          const at = (xx: number) =>
            STRATA[i] * rows + ramp * amp * (Math.sin(xx * 0.07 + t * 0.45 + i * 0.9) + 0.4 * Math.sin(xx * 0.16 - t * 0.3 + i));
          const cy = at(x);
          const slope = at(x + 0.5) - at(x - 0.5);
          const edge = flowGlyph(api, Math.atan2(slope, 1));
          const thick = half * (1 + ramp * 0.45 * Math.sin(x * 0.11 - t * 0.6 + i * 2));
          const top = Math.round(cy - thick);
          const bot = Math.round(cy + thick);
          for (let y = top; y <= bot; y++) {
            if (y < 0 || y >= rows) continue;
            const swell = 0.5 + 0.5 * Math.sin(x * 0.22 - t * (i === 1 ? 2.6 : 1.2) + y * 0.4);
            const rim = y === top || y === bot;
            if (rim && Math.abs(slope) > 0.22) api.put(x, y, edge, b.a * (0.55 + 0.45 * swell), b.c);
            else api.put(x, y, b.g, b.a * (rim ? 0.35 : 1) * (0.45 + 0.55 * swell), b.c);
          }
        }
        if (hash(x, 7) > 0.7) {
          const y = Math.floor(hash(x, 8) * rows);
          api.put(x, y, dot, 0.07, INK.DIM);
        }
      }
    };
  },
};

/* ---------------------------------------------------- 律 quest graph ------ */

/*
 * A quest line as Tenet keeps it: nodes as bracketed kanji — 章 the start, 任 a
 * task, 条 a condition, 報 a reward — and the occasional 墓, a deleted node
 * lingering as a tombstone until restored. Edges are S-curves, each cell the
 * stroke of the curve's own slope; current runs along them all the time, and a
 * completion front sweeps the line from start to reward, then the line resets.
 */
export const quests: Program = {
  glyphs: () => ["任", "報", "条", "章", "墓", "【", "】", "・"],
  create(api) {
    const { cols, rows } = api;
    const open = api.g("【");
    const close = api.g("】");
    const dot = api.g("・");
    const grave = api.g("墓");
    const kinds = { start: api.g("章"), task: api.g("任"), cond: api.g("条"), reward: api.g("報") };

    const colW = cols < 40 ? 8 : cols < 60 ? 11 : 15;
    const C = Math.max(3, Math.min(7, Math.floor((cols - 4) / colW) + 1));
    const left = Math.floor((cols - (C - 1) * colW) / 2);
    type Node = { x: number; y: number; base: number; col: number; g: number; dead: boolean };
    const nodes: Node[] = [];
    const byCol: Node[][] = [];
    for (let c = 0; c < C; c++) {
      const n = c === 0 || c === C - 1 ? 1 : 2 + Math.floor(hash(c, 1) * 1.9);
      const top = Math.round(rows * 0.14);
      const span = rows - 2 * top;
      // the whole line drifts on a slow wave, so the graph reads as one current
      const sway = Math.sin(c * 0.9) * rows * 0.12;
      const list: Node[] = [];
      for (let k = 0; k < n; k++) {
        const base = n === 1 ? top + span / 2 : top + (span * (k + 0.5)) / n;
        const y = Math.max(1, Math.min(rows - 2, Math.round(base + sway * (n === 1 ? 0.4 : 1) + (hash(c, k, 2) - 0.5) * 3)));
        const r = hash(c, k, 3);
        const dead = c > 0 && c < C - 1 && n > 2 && hash(c, k, 4) > 0.82;
        const g =
          c === 0 ? kinds.start : c === C - 1 ? kinds.reward : r < 0.58 ? kinds.task : r < 0.8 ? kinds.cond : kinds.reward;
        const node = { x: left + c * colW, y, base: y, col: c, g, dead };
        list.push(node);
        nodes.push(node);
      }
      byCol.push(list);
    }

    // an edge is a cubic with level tangents at both ends: out of one node, into the next
    type Cell = { x: number; y: number; g: number };
    const trace = (a: Node, b: Node) => {
      const x0 = a.x + 2;
      const x1 = b.x - 2;
      const y0 = a.y;
      const y1 = b.y;
      const mx = (x1 - x0) * 0.5;
      const cells: Cell[] = [];
      const steps = Math.max(8, (Math.abs(x1 - x0) + Math.abs(y1 - y0)) * 3);
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const v = 1 - u;
        const x = v * v * v * x0 + 3 * v * v * u * (x0 + mx) + 3 * v * u * u * (x1 - mx) + u * u * u * x1;
        const y = v * v * v * y0 + 3 * v * v * u * y0 + 3 * v * u * u * y1 + u * u * u * y1;
        const dx = 3 * v * v * mx + 6 * v * u * (x1 - x0 - 2 * mx) + 3 * u * u * mx;
        const dy = 6 * v * u * (y1 - y0);
        const cx = Math.round(x);
        const cy = Math.round(y);
        const last = cells[cells.length - 1];
        if (last && last.x === cx && last.y === cy) continue;
        cells.push({ x: cx, y: cy, g: flowGlyph(api, Math.atan2(dy, dx)) });
      }
      return cells;
    };
    type Edge = { a: Node; b: Node; col: number; dead: boolean };
    const edges: Edge[] = [];
    const link = (a: Node, b: Node) => edges.push({ a, b, col: a.col, dead: a.dead || b.dead });
    for (let c = 0; c < C - 1; c++) {
      const next = byCol[c + 1];
      const fed = new Set<Node>();
      for (const a of byCol[c]) {
        const sorted = [...next].sort((p, q) => Math.abs(p.y - a.y) - Math.abs(q.y - a.y));
        link(a, sorted[0]);
        fed.add(sorted[0]);
        if (sorted[1] && hash(a.x, a.y, 5) > 0.45) {
          link(a, sorted[1]);
          fed.add(sorted[1]);
        }
      }
      for (const b of next) {
        if (fed.has(b)) continue;
        const nearest = [...byCol[c]].sort((p, q) => Math.abs(p.y - b.y) - Math.abs(q.y - b.y))[0];
        link(nearest, b);
      }
    }

    const STEP = 1.3;
    const period = C * STEP + 2.6;

    return (t) => {
      const tt = t % period;
      // the whole graph breathes on a slow wave running from start to reward
      for (const nd of nodes) {
        nd.y = Math.max(1, Math.min(rows - 2, Math.round(nd.base + Math.sin(t * 0.35 - nd.col * 0.7) * 1.4)));
      }

      for (const e of edges) {
        const cells = trace(e.a, e.b);
        const f = clamp((tt - (e.col + 1) * STEP) / STEP);
        const head = Math.floor(f * cells.length);
        cells.forEach(({ x, y, g }, i) => {
          if (e.dead) {
            if (i % 3 === 0) api.put(x, y, dot, 0.18, INK.DIM);
            return;
          }
          // the current: a soft swell travelling down every edge, always
          const swell = 0.5 + 0.5 * Math.sin(i * 0.45 - t * 3.2);
          if (i < head) api.put(x, y, g, 0.55 + 0.45 * swell, INK.BONE);
          else if (i <= head + 1 && f > 0 && f < 1) api.put(x, y, g, 1, INK.RED);
          else api.put(x, y, g, 0.12 + 0.18 * swell, INK.DIM);
        });
      }

      for (const nd of nodes) {
        const start = (nd.col + 1) * STEP;
        const done = tt >= start + STEP * 0.6;
        const live = tt >= start && !done;
        if (nd.dead) {
          api.put(nd.x - 1, nd.y, open, 0.2, INK.DIM);
          api.put(nd.x, nd.y, grave, 0.38, INK.DIM);
          api.put(nd.x + 1, nd.y, close, 0.2, INK.DIM);
          continue;
        }
        const blink = live && Math.floor(t * 6) % 2 === 0;
        const a = done || live ? 1 : 0.4;
        const c = live ? INK.RED : done ? INK.BONE : INK.DIM;
        api.put(nd.x - 1, nd.y, open, blink ? 0.4 : a, c);
        api.put(nd.x, nd.y, nd.g, a, c);
        api.put(nd.x + 1, nd.y, close, blink ? 0.4 : a, c);
      }
    };
  },
};

/* ------------------------------------------------------- 星 stars ------ */

/*
 * Stellar, the developer suite: a constellation across a night of faint dust.
 * Every star is 星, the lines between them run in wave strokes, and light
 * travels the chain from one star to the next, each flaring as it arrives. A
 * river of dust crosses the sky behind. One star is red.
 */
export const stars: Program = {
  glyphs: () => ["・", "丶", "星", "900:星"],
  create(api) {
    const { cols, rows } = api;
    const N = cols * rows;
    const dot = api.g("・");
    const mote = api.g("丶");
    const small = api.g("星");
    const big = api.g("900:星");
    const ray = strokes(api);

    // the stars, strung along a loose S from one side of the sky to the other
    const K = cols < 50 ? 5 : Math.min(9, Math.max(6, Math.round(cols / 16)));
    const sx: number[] = [];
    const sy: number[] = [];
    for (let k = 0; k < K; k++) {
      sx.push(Math.round(cols * (0.08 + (0.84 * k) / (K - 1) + (hash(k, 7) - 0.5) * 0.05)));
      sy.push(Math.round(rows * (0.5 + 0.28 * Math.sin(k * 1.9 + 0.4) + (hash(k, 8) - 0.5) * 0.12)));
    }
    const red = Math.min(K - 1, 2);

    // the chain, plus a spur off every third star; each line bows a little
    const pairs: [number, number][] = [];
    for (let k = 0; k + 1 < K; k++) pairs.push([k, k + 1]);
    for (let k = 0; k + 2 < K; k += 3) pairs.push([k, k + 2]);
    const edges = pairs.map(([a, b], e) => {
      const [ax, ay, bx, by] = [sx[a], sy[a], sx[b], sy[b]];
      const len = Math.hypot(bx - ax, by - ay);
      const bend = (hash(e, 11) - 0.5) * len * 0.5;
      const cx = (ax + bx) / 2 - ((by - ay) / len) * bend;
      const cy = (ay + by) / 2 + ((bx - ax) / len) * bend;
      const cells: { x: number; y: number; s: number; g: number }[] = [];
      const seen = new Set<number>();
      const steps = Math.ceil(len * 2.5);
      for (let j = 0; j <= steps; j++) {
        const s = j / steps;
        const u = 1 - s;
        const x = Math.round(u * u * ax + 2 * u * s * cx + s * s * bx);
        const y = Math.round(u * u * ay + 2 * u * s * cy + s * s * by);
        const nearStar =
          Math.max(Math.abs(x - ax), Math.abs(y - ay)) < 2 || Math.max(Math.abs(x - bx), Math.abs(y - by)) < 2;
        if (nearStar || x < 0 || y < 0 || x >= cols || y >= rows || seen.has(y * cols + x)) continue;
        seen.add(y * cols + x);
        const dx = 2 * u * (cx - ax) + 2 * s * (bx - cx);
        const dy = 2 * u * (cy - ay) + 2 * s * (by - cy);
        cells.push({ x, y, s, g: flowGlyph(api, Math.atan2(dy, dx)) });
      }
      return { a, cells };
    });

    // the dust: denser in a river that crosses the sky on a slant
    const dust = new Float32Array(N);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const across =
          (y - rows * 0.15 - (x * rows * 0.7) / cols) / rows + (fbm(x * 0.05, y * 0.05, 3) - 0.5) * 0.5;
        const band = Math.exp(-across * across * 30);
        dust[y * cols + x] = hash(x, y, 3) < 0.012 + 0.14 * band ? 0.3 + band * 0.7 : -band;
      }
    }
    // the river runs along its own slant
    const riverGlyph = flowGlyph(api, Math.atan((rows * 0.7) / cols));

    const cycle = K + 1.5;
    return (t) => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const d = dust[y * cols + x];
          if (d < 0) {
            // between the motes, the river itself drifts along the band
            if (d < -0.45 && fbm(x * 0.09 - t * 0.12, y * 0.09 + t * 0.05, 2) > 0.6) {
              api.put(x, y, riverGlyph, -d * 0.16, INK.DIM);
            }
            continue;
          }
          if (!d) continue;
          const h = hash(x, y, 5);
          const tw = 0.5 + 0.5 * Math.sin(t * (0.5 + h * 1.6) + h * 40);
          api.put(x, y, h < 0.82 ? dot : mote, (0.08 + 0.3 * tw) * d, INK.DIM);
        }
      }

      // light runs the chain: at `u` it is on the line leaving star floor(u)
      const u = (t * 0.42) % cycle;
      for (const e of edges) {
        const at = u - e.a;
        for (const c of e.cells) {
          // a head of light with a tail that trails it back towards the star it left
          const lag = at - c.s;
          const glow = at < 0 || at > 1.4 ? 0 : lag >= 0 ? Math.max(0, 1 - lag / 0.4) : Math.max(0, 1 + lag / 0.06);
          api.put(c.x, c.y, c.g, 0.3 + 0.7 * glow, glow > 0.25 ? INK.BONE : INK.DIM);
        }
      }

      for (let k = 0; k < K; k++) {
        const flare = Math.max(0, 1 - Math.abs(u - k) * 1.6);
        api.put(sx[k], sy[k], big, 0.78 + 0.22 * flare, k === red ? INK.RED : INK.BONE);
        const r = 0.2 + 0.6 * flare;
        api.put(sx[k] - 1, sy[k], ray.h, r, INK.DIM);
        api.put(sx[k] + 1, sy[k], ray.h, r, INK.DIM);
        api.put(sx[k], sy[k] - 1, ray.v, r, INK.DIM);
        api.put(sx[k], sy[k] + 1, ray.v, r, INK.DIM);
        // at the flare, the light reaches out on the diagonals too
        if (flare > 0.2) {
          api.put(sx[k] - 1, sy[k] - 1, ray.down, flare * 0.5, INK.DIM);
          api.put(sx[k] + 1, sy[k] + 1, ray.down, flare * 0.5, INK.DIM);
          api.put(sx[k] + 1, sy[k] - 1, ray.up, flare * 0.5, INK.DIM);
          api.put(sx[k] - 1, sy[k] + 1, ray.up, flare * 0.5, INK.DIM);
        }
      }

      // a few lesser stars off the chain, breathing slowly
      for (let k = 0; k < K * 2; k++) {
        const x = Math.floor(hash(k, 21) * cols);
        const y = Math.floor(hash(k, 22) * rows);
        api.put(x, y, small, 0.25 + 0.25 * (0.5 + 0.5 * Math.sin(t * 0.7 + k * 2.3)), INK.DIM);
      }
    };
  },
};

/* ---------------------------------------------------------- 渚 shore ----- */

const ruinGlyphs: Spec[] = ["口", "目", "田"];
const colossusRamp: Spec[] = ["・", "二", "工", "白", "肉", "身", "骨"];

/*
 * The close: the shore after everything. A night sky thick with stars and a
 * red streak bleeding down it; two colossi hung on nothing, arms out, dark
 * against the stars and lit red from the sea beneath, shedding salt; a band of
 * red sea, its swell rolling in under a glint that flares on the horizon, a
 * ruin at the edge of the world; then the white strand, the swash running up
 * it and sliding back, wind combing the sand, and lying where a line of
 * footprints out of the water stops, one of us. The sand is drawn in void ink:
 * the footer lays the white under it.
 */
export const shore: Program = {
  glyphs: () => [
    "・", "丶", "星", "十", "900:十", "一", "水", "900:ー",
    ...ruinGlyphs, ...colossusRamp,
    `900:${LINE.h}`, `900:${LINE.v}`, `900:${LINE.up}`, `900:${LINE.down}`,
  ],
  create(api) {
    const { cols, rows } = api;
    const portrait = cols < rows;
    const hz = Math.round(rows * HORIZON);
    const sh = rows * SHORE;
    const beach = rows - sh;
    const G = {
      dot: api.g("・"), mote: api.g("丶"), star: api.g("星"), cross: api.g("十"), glint: api.g("900:十"),
      flat: api.g("一"), water: api.g("水"), line: api.g("900:ー"),
    };
    const wave = flowGlyph(api, 0);
    const ray = strokes(api);
    const heavy = (theta: number) => api.g(`900:${lineChar(theta)}`);
    const mass = api.ramp(colossusRamp);
    const ruinG = ruinGlyphs.map((s) => api.g(s));

    // the colossi, drawn as silhouettes and read back cell by cell
    // the near one stands knee-deep in the sea, the far one hangs just over it
    const hA = Math.min(hz * 0.9, cols * (portrait ? 0.62 : 0.42));
    const hB = hA * 0.55;
    const colossi: (Colossus & { seed: number })[] = [
      { x: cols * (portrait ? 0.36 : 0.27), y: hz + hA * 0.06 - hA, h: hA, lean: 0.05, broken: false, seed: 1 },
      { x: cols * (portrait ? 0.82 : 0.8), y: hz + 0.5 - hB, h: hB, lean: -0.24, broken: true, seed: 2 },
    ];
    const glintX = Math.round(cols * (portrait ? 0.62 : 0.6));
    // a box blur over a cell field, so a silhouette has a slope to read a surface from
    const soften = (src: Float32Array, r: number) => {
      const tmp = new Float32Array(src.length);
      const out = new Float32Array(src.length);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let sum = 0;
          for (let d = -r; d <= r; d++) sum += src[y * cols + Math.min(cols - 1, Math.max(0, x + d))];
          tmp[y * cols + x] = sum / (2 * r + 1);
        }
      }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let sum = 0;
          for (let d = -r; d <= r; d++) sum += tmp[Math.min(rows - 1, Math.max(0, y + d)) * cols + x];
          out[y * cols + x] = sum / (2 * r + 1);
        }
      }
      return out;
    };
    const shapes = colossi.map((c) => {
      // the light on each comes up off the sea, from the glint's side
      const lx = (glintX - c.x) / cols;
      const LX = lx / Math.hypot(lx, 0.9);
      const LY = 0.9 / Math.hypot(lx, 0.9);
      const cov = colossusField(cols, rows, c);
      const soft = soften(soften(cov, 2), 1);
      const at = (a: Float32Array, x: number, y: number) => (x < 0 || y < 0 || x >= cols || y >= rows ? 0 : a[y * cols + x]);
      const cells: { x: number; y: number; g: number; a: number; ink: number; lit: number; edge: boolean; v: number }[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cv = at(cov, x, y);
          if (cv < 0.08) continue;
          const v = (y - c.y) / c.h;
          const ex = at(cov, x + 1, y) - at(cov, x - 1, y);
          const ey = at(cov, x, y + 1) - at(cov, x, y - 1);
          const el = Math.hypot(ex, ey);
          if (cv < 0.55 && el > 0.1) {
            // the outline, stroked along its run
            const lit = (-ex * LX - ey * LY) / el;
            cells.push({ x, y, g: lineGlyph(api, Math.atan2(ey, ex) + Math.PI / 2), a: 0, ink: INK.DIM, lit, edge: true, v });
            continue;
          }
          // inside, the surface turned towards the light as far as the softened silhouette can tell,
          // set in kanji from the faintest to the fullest; only the deepest shadow drops to strokes
          const sx = at(soft, x + 1, y) - at(soft, x - 1, y);
          const sy = at(soft, x, y + 1) - at(soft, x, y - 1);
          const sl = Math.hypot(sx, sy);
          const turn = smooth(0, 0.16, sl);
          const facing = sl > 1e-4 ? ((-sx * LX - sy * LY) / sl) * turn : 0;
          const under = sl > 1e-4 ? (-sy / sl) * turn : 0;
          const b = clamp(0.42 + 0.5 * facing + 0.3 * (fbm(x * 0.35, y * 0.35, 2) - 0.5));
          const g =
            b > 0.2 || sl < 0.03
              ? mass[Math.min(mass.length - 1, Math.round(b * (mass.length - 1)))]
              : lineGlyph(api, Math.atan2(sy, sx) + Math.PI / 2);
          const ink = b > 0.62 && under > 0.3 ? INK.RED : b > 0.55 ? INK.BONE : INK.DIM;
          cells.push({ x, y, g, a: 0.2 + 0.55 * b, ink, lit: 0, edge: false, v });
        }
      }
      return { ...c, cov, cells, edges: cells.filter((e) => e.edge && e.y < hz - 1) };
    });
    const behind = (x: number, y: number) => shapes.some((s) => s.cov[y * cols + x] > 0.05);

    // the stars: thick overhead, thinning into the haze, a faint river of them on a slant
    const sky: number[] = [];
    for (let y = 0; y < hz - 1; y++) {
      const lift = 1 - y / hz;
      for (let x = 0; x < cols; x++) {
        if (behind(x, y)) continue;
        const across = y / hz - 0.95 + (x / cols) * 0.85 + (fbm(x * 0.06, y * 0.06, 3) - 0.5) * 0.4;
        const band = Math.exp(-across * across * 22);
        if (hash(x, y, 1) > 0.01 + 0.07 * lift * lift + 0.1 * band) continue;
        const k = hash(x, y, 2);
        const g = k < 0.62 ? G.dot : k < 0.9 ? G.mote : k < 0.975 ? G.star : G.cross;
        sky.push(x, y, g, (0.18 + 0.5 * hash(x, y, 3)) * (0.35 + 0.65 * lift), 0.4 + hash(x, y, 4) * 1.8, hash(x, y, 5) * 40);
      }
    }

    // the red streak, falling down the sky out of frame, thick at the top and thinning to a point
    const [s0x, s0y, s2x, s2y] = STREAK[portrait ? "tall" : "wide"];
    const curve = (s: number) => ({
      x: cols * (s0x + (s2x - s0x) * s),
      y: rows * (s0y + (s2y - s0y) * s),
      dx: cols * (s2x - s0x),
      dy: rows * (s2y - s0y),
    });
    const streakAt = new Map<number, { s: number; d: number; g: number }>();
    for (let j = 0; j <= 360; j++) {
      const s = j / 360;
      const p = curve(s);
      const l = Math.hypot(p.dx, p.dy);
      const nx = -p.dy / l;
      const ny = p.dx / l;
      const theta = Math.atan2(p.dy, p.dx);
      const w = 0.35 + 2.1 * Math.pow(1 - s, 0.9);
      for (let o = -w - 1.5; o <= w + 1.5; o += 0.4) {
        const x = Math.floor(p.x + nx * o);
        const y = Math.floor(p.y + ny * o);
        if (x < 0 || y < 0 || x >= cols || y >= hz) continue;
        const i = y * cols + x;
        const d = Math.abs(o) / w;
        const prev = streakAt.get(i);
        if (!prev || d < prev.d) streakAt.set(i, { s, d, g: d < 0.5 ? heavy(theta) : lineGlyph(api, theta) });
      }
    }
    const streak = [...streakAt].map(([i, c]) => ({ x: i % cols, y: Math.floor(i / cols), ...c }));

    // a ruin at the edge of the world, broken off unevenly
    const ruins: { x: number; y: number; g: number; a: number }[] = [];
    const scale = hz / 26;
    const towers = portrait
      ? [[0.03, 2, 4], [0.075, 2, 7], [0.12, 1, 3]]
      : [[0.02, 2, 4], [0.045, 3, 8], [0.08, 1, 5], [0.1, 2, 3]];
    towers.forEach(([fx, w, h], n) => {
      const x0 = Math.round(cols * fx);
      for (let dx = 0; dx < w; dx++) {
        const top = Math.max(1, Math.round(h * scale * (0.55 + 0.45 * hash(n, dx, 81))));
        for (let k = 0; k < top; k++) {
          ruins.push({ x: x0 + dx, y: hz - 1 - k, g: ruinG[Math.floor(hash(n, dx * 9 + k, 82) * ruinG.length)], a: 0.16 + 0.14 * hash(n, k, 83) });
        }
      }
    });
    const beacon = { x: Math.round(cols * towers[1][0]), y: hz - 1 - Math.max(1, Math.round(towers[1][2] * scale * 0.55)) - 1 };

    // the footprints that come up out of the water to where one of us lies (the footer sets the figure in type)
    const [lx, ly] = LIES[portrait ? "tall" : "wide"];
    const me = { x: Math.round(cols * lx), y: Math.round(sh + beach * ly) };
    const prints: { x: number; y: number }[] = [];
    {
      const P0 = { x: me.x + (portrait ? -7 : 13), y: sh + 0.6 };
      const P1 = { x: me.x + (portrait ? -8 : 4), y: (sh + me.y) / 2 + 1 };
      const P2 = { x: me.x + 2.5, y: me.y };
      const seen = new Set<number>();
      for (let j = 0, side = 1; j <= 40; j++, side = -side) {
        const s = j / 40;
        const u = 1 - s;
        const x = u * u * P0.x + 2 * u * s * P1.x + s * s * P2.x;
        const y = u * u * P0.y + 2 * u * s * P1.y + s * s * P2.y + side * 0.3;
        const k = Math.round(y) * cols + Math.round(x);
        if (seen.has(k) || s > 0.94) continue;
        seen.add(k);
        prints.push({ x: Math.round(x), y: Math.round(y) });
      }
    }

    const edge = new Float32Array(cols);
    const reach = new Float32Array(cols);
    const damp = new Float32Array(cols);
    const SWASH = 7;

    return (t) => {
      const flick = Math.floor(t * 12);

      // the stars, each breathing at its own rate
      for (let k = 0; k < sky.length; k += 6) {
        const tw = 0.5 + 0.5 * Math.sin(t * sky[k + 4] + sky[k + 5]);
        api.put(sky[k], sky[k + 1], sky[k + 2], sky[k + 3] * (0.45 + 0.55 * tw), tw > 0.92 && sky[k + 2] === G.cross ? INK.BONE : INK.DIM);
      }

      // now and then a star falls
      const fall = Math.floor(t / 9.5);
      const fa = t - fall * 9.5;
      if (fa < 0.9 && fall > 0) {
        const left = hash(fall, 73) > 0.5;
        const theta = left ? Math.PI - 0.5 : 0.5;
        const x0 = cols * (0.12 + 0.76 * hash(fall, 71));
        const y0 = hz * (0.04 + 0.3 * hash(fall, 72));
        const head = fa * 30;
        const fade = 1 - fa / 0.9;
        for (let q = 0; q < 11; q++) {
          const d = head - q;
          if (d < 0) break;
          const x = Math.round(x0 + Math.cos(theta) * d);
          const y = Math.round(y0 + Math.sin(theta) * d);
          if (y >= hz - 2 || x < 0 || x >= cols || behind(x, y)) continue;
          api.put(x, y, q === 0 ? G.cross : lineGlyph(api, theta), (q === 0 ? 1 : 0.7 * (1 - q / 11)) * fade, q < 3 ? INK.BONE : INK.DIM);
        }
      }

      // the streak: pulses of light running down it, the edges guttering
      for (const c of streak) {
        const pulse = Math.pow(Math.max(0, Math.sin(c.s * 13 - t * 1.9)), 2);
        const tip = smooth(1, 0.8, c.s);
        if (c.d < 0.5) api.put(c.x, c.y, c.g, (0.72 + 0.28 * pulse) * tip, INK.RED);
        else if (c.d < 1) {
          if (hash(c.x, c.y, flick) < 0.85) api.put(c.x, c.y, c.g, (0.32 + 0.45 * pulse) * tip, INK.RED);
        } else if (hash(c.x, c.y, flick) > 0.62) api.put(c.x, c.y, G.dot, (0.12 + 0.25 * pulse) * tip * (1.6 - c.d * 0.5), INK.RED);
      }
      // and drops of it shaken loose, falling
      for (let k = 0; k < 16; k++) {
        const life = 3.6;
        const tt = t + hash(k, 61) * life;
        const age = tt % life;
        const gen = Math.floor(tt / life);
        const p = curve(0.3 + 0.7 * hash(k, gen, 62));
        const x = p.x + (hash(k, gen, 63) - 0.5) * 3 + age * 0.7;
        const y = p.y + age * 0.8 + age * age * 0.5;
        if (y < hz - 1) api.put(x, y, G.dot, (1 - age / life) * 0.75, INK.RED);
      }

      // the colossi: dark against the stars, their undersides lit red, a red light climbing them now and then
      const breathe = 0.85 + 0.15 * Math.sin(t * 0.6);
      for (const C of shapes) {
        const climb = ((t + C.seed * 5.3) % 13) / 7;
        const at = 1 - climb;
        for (const c of C.cells) {
          const tide = climb <= 1 ? Math.max(0, 1 - Math.abs(at - c.v) / 0.07) : 0;
          if (!c.edge) {
            api.put(c.x, c.y, c.g, Math.min(1, c.a + 0.4 * tide), tide > 0.35 ? INK.RED : c.ink);
            continue;
          }
          // red from the sea beneath, a cold rim of starlight on what faces up
          const lit = Math.max(0, c.lit) * breathe;
          const cold = Math.max(0, -c.lit);
          api.put(
            c.x,
            c.y,
            c.g,
            Math.min(1, 0.3 + 0.62 * lit + 0.3 * cold + 0.6 * tide),
            tide > 0.3 || lit > 0.6 ? INK.RED : lit > 0.12 || cold > 0.45 ? INK.BONE : INK.DIM,
          );
        }
        // salt, shed off their edges and drifting down into the haze
        for (let k = 0; k < Math.round(C.edges.length * 0.06); k++) {
          const life = 5.5;
          const tt = t + hash(k, C.seed, 51) * life;
          const age = tt % life;
          const gen = Math.floor(tt / life);
          const e = C.edges[Math.floor(hash(k, gen, C.seed) * C.edges.length)];
          const x = e.x + age * (hash(k, gen, 53) - 0.3) * 0.9;
          const y = e.y + 0.5 + age * age * 0.32;
          if (y < hz - 1) api.put(x, y, age < 0.8 ? G.mote : G.dot, (1 - age / life) * 0.6, INK.BONE);
        }
      }

      // the ruin, one light still burning in it
      for (const r of ruins) api.put(r.x, r.y, r.g, r.a, INK.DIM);
      if (Math.sin(t * 1.3) > 0.3) api.put(beacon.x, beacon.y, G.dot, 0.9, INK.RED);

      // haze along the horizon, in the gaps
      for (let y = hz - 9; y < hz; y++) {
        const near = 1 - (hz - y) / 9;
        for (let x = 0; x < cols; x++) {
          if (api.glyph[y * cols + x] >= 0) continue;
          const m = fbm(x * 0.05 - t * 0.04, y * 0.35 + t * 0.02, 3);
          if (m > 0.52 - near * 0.12) api.put(x, y, wave, (m - 0.38) * 0.55 * near, INK.RED);
        }
      }

      // how far up the sand the swash has run, column by column
      for (let x = 0; x < cols; x++) {
        const tl = t + 1.3 * Math.sin(x * 0.045) + 0.6 * Math.sin(x * 0.11 + 2);
        const gen = Math.floor(tl / SWASH);
        const ph = tl / SWASH - gen;
        const far = beach * 0.15 * (0.4 + 0.6 * fbm(x * 0.08, gen * 3.7, 2));
        const run = ph < 0.3 ? 1 - (1 - ph / 0.3) ** 2 : (1 - (ph - 0.3) / 0.7) ** 1.5;
        edge[x] = sh + 0.3 + far * run;
        reach[x] = sh + 0.3 + far;
        damp[x] = ph < 0.3 ? 0 : 1 - (ph - 0.3) / 0.7;
      }

      // the red sea: swell lines rolling in, crowding together towards the horizon
      const sway = Math.sin(t * 0.7);
      for (let x = 0; x < cols; x++) {
        for (let y = hz; y <= edge[x] && y < rows; y++) {
          if (y === hz) {
            api.put(x, y, G.line, 0.9, INK.RED);
            continue;
          }
          const D = 10 / (y - hz + 0.7);
          const n = fbm(x * 0.06 + D * 0.2, y * 0.45 - t * 0.12, 2) - 0.5;
          const swell = 0.5 + 0.5 * Math.sin(D * 2.3 + t * 1.25 + n * 5);
          let a = swell > 0.78 ? 0.92 : swell > 0.42 ? 0.62 : 0.36;
          let g = swell > 0.78 ? wave : swell > 0.42 ? G.flat : hash(x, y, 7) < 0.15 ? G.water : G.dot;
          // the colossi stand dark in it, wavering
          for (const C of shapes) {
            const rx = Math.round(x + Math.sin(y * 1.7 + t * 2.4) * 0.6);
            const ry = Math.round(hz - 1 - (y - hz) * 1.7);
            if (ry >= 0 && rx >= 0 && rx < cols && C.cov[ry * cols + rx] > 0.25) a *= 0.3;
          }
          // a road of light down from the glint
          const off = Math.abs(x - glintX - sway * (y - hz) * 0.3);
          if (off < 0.6 + (y - hz) * 0.45 && hash(x, y, flick) > 0.4) {
            api.put(x, y, G.flat, 0.5 + 0.4 * hash(x, y, flick + 1), INK.BONE);
            continue;
          }
          if (y >= sh) {
            // over the sand the water is a thin film, its leading edge a line of wet
            if (y >= Math.floor(edge[x])) {
              api.put(x, y, wave, 0.55, INK.VOID);
              continue;
            }
            a = 0.42 + 0.35 * swell;
            g = swell > 0.5 ? wave : G.flat;
          }
          api.put(x, y, g, a, INK.RED);
        }
      }

      // the glint on the horizon, flaring
      const flare = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(t * 0.75), 5);
      const L = 2 + Math.round(13 * flare);
      for (let k = 1; k <= L; k++) {
        const a = (1 - k / (L + 1)) * (0.45 + 0.55 * flare);
        api.put(glintX - k, hz, ray.h, a, INK.BONE);
        api.put(glintX + k, hz, ray.h, a, INK.BONE);
      }
      const V = 1 + Math.round(3 * flare);
      for (let k = 1; k <= V; k++) {
        const a = (1 - k / (V + 1)) * (0.4 + 0.6 * flare);
        api.put(glintX, hz - k, ray.v, a, INK.BONE);
        api.put(glintX, hz + k, ray.v, a * 0.8, INK.BONE);
      }
      if (flare > 0.55) {
        for (const [dx, dy, g] of [[-1, -1, ray.down], [1, 1, ray.down], [1, -1, ray.up], [-1, 1, ray.up]] as const) {
          api.put(glintX + dx, hz + dy, g, (flare - 0.45) * 1.2, INK.BONE);
        }
      }
      api.put(glintX, hz, G.glint, 1, INK.BONE);

      // the sand: ripples the wind combed into it, grains running on the wind, damp where the water was
      for (let x = 0; x < cols; x++) {
        for (let y = Math.max(Math.floor(edge[x]) + 1, Math.ceil(sh)); y < rows; y++) {
          if (y <= reach[x] && damp[x] > 0) {
            if (hash(x, y, 91) < 0.55) api.put(x, y, G.dot, 0.2 * damp[x], INK.VOID);
            continue;
          }
          const rip = Math.sin((y - sh) * 1.2 + Math.sin(x * 0.07) * 2.2 + fbm(x * 0.03, y * 0.12, 2) * 4);
          if (rip > 0.95 && hash(x, y, 93) < 0.6) {
            api.put(x, y, wave, 0.06 + 0.05 * hash(x, y, 94), INK.VOID);
            continue;
          }
          const drift = fbm(x * 0.09 - t * 0.55, y * 0.6 + t * 0.04, 2);
          if (drift > 0.64 && hash(x, y, flick) > 0.45) api.put(x, y, G.dot, (drift - 0.58) * 0.45, INK.VOID);
        }
      }
      for (const p of prints) if (p.y > edge[p.x]) api.put(p.x, p.y, G.dot, 0.5, INK.VOID);
    };
  },
};

export const programs = { hero, octagon, orb, rays, stream, vortex, river, current, clouds, kanji, world, strata, quests, stars, shore };
export type ProgramName = keyof typeof programs;
