/*
 * The plate engine. Every picture on the site is a grid of characters: kanji for
 * mass, katakana for line. A program writes one glyph, alpha and ink per cell;
 * the engine owns everything around it — the glyph atlas, the decode-in, the
 * pointer lens and click ripple, pausing offscreen, and reduced motion.
 *
 * Cells are square because kanji are: one full-width character per cell, so a
 * plate keeps its proportions without the aspect correction Latin ASCII needs.
 * Glyphs are drawn once into an atlas per ink and stamped with drawImage, which
 * keeps a full-screen plate (8–10k cells) well inside a frame budget.
 */

export type Spec = string; // "光" or "900:光" — weight prefix optional

export const FAMILY = '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif';

// Three inks only: bone for everything, red for the signal, a grey for the field.
export const INK = { BONE: 0, RED: 1, DIM: 2 } as const;
const PALETTE = ["#ece7db", "#e3271d", "#8c877b"];

export const KATA = Array.from(
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
);

// Katakana carry the line work: ー across, ノ rising, ヽ falling, ｜ standing.
export const LINE = { h: "ー", v: "｜", up: "ノ", down: "ヽ" } as const;
// Waves carry the flow: the same, but 〜 across and ︴ standing — for plates that run like water.
export const FLOW = { h: "〜", v: "︴", up: "ノ", down: "ヽ" } as const;
const LINES: Spec[] = [LINE.h, LINE.v, LINE.up, LINE.down, FLOW.h, FLOW.v];

/* ----------------------------------------------------------------- noise --- */

export function hash(x: number, y = 0, z = 0): number {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function fade(t: number) {
  return t * t * (3 - 2 * t);
}

export function vnoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += vnoise(x, y) * amp;
    norm += amp;
    x = x * 2.03 + 17.1;
    y = y * 2.03 + 9.7;
    amp *= 0.5;
  }
  return sum / norm;
}

export function clamp(v: number, lo = 0, hi = 1) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function smooth(e0: number, e1: number, v: number) {
  const t = clamp((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** The stroke that best follows a line running at `theta` (radians, y down), from `set`. */
export function lineChar(theta: number, set: typeof LINE | typeof FLOW = LINE): Spec {
  let a = theta % Math.PI;
  if (a < 0) a += Math.PI;
  const o = Math.PI / 8;
  if (a < o || a >= 7 * o) return set.h;
  if (a < 3 * o) return set.down;
  if (a < 5 * o) return set.v;
  return set.up;
}

/* --------------------------------------------------------------- fields --- */

/** Per-cell coverage plus a structure tensor: which way the ink inside the cell runs. */
export interface Field {
  cov: Float32Array;
  ang: Float32Array;
  coh: Float32Array;
  energy: Float32Array;
}

function analyze(lum: Float32Array, W: number, H: number, cols: number, rows: number, S: number): Field {
  const n = cols * rows;
  const cov = new Float32Array(n);
  const ang = new Float32Array(n);
  const coh = new Float32Array(n);
  const energy = new Float32Array(n);
  const ss = S * S;
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let sum = 0;
      let jxx = 0;
      let jyy = 0;
      let jxy = 0;
      for (let sy = 0; sy < S; sy++) {
        const py = cy * S + sy;
        const up = Math.max(0, py - 1) * W;
        const dn = Math.min(H - 1, py + 1) * W;
        const row = py * W;
        for (let sx = 0; sx < S; sx++) {
          const px = cx * S + sx;
          sum += lum[row + px];
          const gx = lum[row + Math.min(W - 1, px + 1)] - lum[row + Math.max(0, px - 1)];
          const gy = lum[dn + px] - lum[up + px];
          jxx += gx * gx;
          jyy += gy * gy;
          jxy += gx * gy;
        }
      }
      const i = cy * cols + cx;
      const e = jxx + jyy;
      cov[i] = sum / ss;
      energy[i] = e / ss;
      coh[i] = e > 1e-6 ? Math.sqrt((jxx - jyy) * (jxx - jyy) + 4 * jxy * jxy) / e : 0;
      ang[i] = 0.5 * Math.atan2(2 * jxy, jxx - jyy) + Math.PI / 2;
    }
  }
  return { cov, ang, coh, energy };
}

function lumOf(ctx: CanvasRenderingContext2D, W: number, H: number, contrast = 1): Float32Array {
  const d = ctx.getImageData(0, 0, W, H).data;
  const out = new Float32Array(W * H);
  for (let i = 0; i < out.length; i++) {
    const l = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
    out[i] = contrast === 1 ? l : clamp((l - 0.5) * contrast + 0.5);
  }
  return out;
}

const images = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = images.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    images.set(src, p);
  }
  return p;
}

export interface ImageField extends Field {
  /** Image-normalised coordinates → cell coordinates, after the cover crop. */
  map(nx: number, ny: number): [number, number];
}

/** Cover-crop an image onto the grid, focal point (fx, fy), and read it per cell. */
export function sampleImage(
  img: HTMLImageElement,
  cols: number,
  rows: number,
  o: { fx?: number; fy?: number; zoom?: number; contrast?: number } = {},
): ImageField {
  const S = 4;
  const W = cols * S;
  const H = rows * S;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const A = cols / rows;
  let cw = iw;
  let ch = ih;
  if (iw / ih > A) cw = ih * A;
  else ch = iw / A;
  const zoom = o.zoom ?? 1;
  cw /= zoom;
  ch /= zoom;
  const sx = (iw - cw) * (o.fx ?? 0.5);
  const sy = (ih - ch) * (o.fy ?? 0.5);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, cw, ch, 0, 0, W, H);
  const field = analyze(lumOf(ctx, W, H, o.contrast), W, H, cols, rows, S);
  return {
    ...field,
    map: (nx, ny) => [((nx * iw - sx) / cw) * cols, ((ny * ih - sy) / ch) * rows],
  };
}

/** Draw anything (usually type) in white onto a grid-sized canvas and read it per cell. */
export function rasterize(
  cols: number,
  rows: number,
  draw: (ctx: CanvasRenderingContext2D, W: number, H: number) => void,
): Field {
  const S = 4;
  const W = cols * S;
  const H = rows * S;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  draw(ctx, W, H);
  return analyze(lumOf(ctx, W, H), W, H, cols, rows, S);
}

/* ---------------------------------------------------------------- atlas --- */

function parse(spec: Spec): [string, number] {
  const i = spec.indexOf(":");
  return i > 0 ? [spec.slice(i + 1), Number(spec.slice(0, i))] : [spec, 400];
}

class Atlas {
  readonly canvas = document.createElement("canvas");
  readonly index = new Map<Spec, number>();
  readonly coverage: Float32Array;

  constructor(
    readonly specs: Spec[],
    readonly px: number,
  ) {
    const n = specs.length;
    this.canvas.width = n * px;
    this.canvas.height = PALETTE.length * px;
    const ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    specs.forEach((s, i) => {
      this.index.set(s, i);
      const [ch, w] = parse(s);
      ctx.font = `${w} ${Math.round(px * 0.9)}px ${FAMILY}`;
      PALETTE.forEach((col, row) => {
        ctx.fillStyle = col;
        ctx.fillText(ch, i * px + px / 2, row * px + px * 0.53);
      });
    });
    const data = ctx.getImageData(0, 0, n * px, px).data;
    this.coverage = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let y = 0; y < px; y++) {
        for (let x = 0; x < px; x++) sum += data[(y * n * px + i * px + x) * 4 + 3];
      }
      this.coverage[i] = sum / (px * px * 255);
    }
  }
}

const loadedFonts = new Map<string, Promise<unknown>>();

export function loadFonts(specs: Spec[]): Promise<unknown> {
  const byWeight = new Map<number, string>();
  for (const s of specs) {
    const [ch, w] = parse(s);
    byWeight.set(w, (byWeight.get(w) ?? "") + ch);
  }
  return Promise.all(
    [...byWeight].map(([w, text]) => {
      const key = `${w}:${text}`;
      let p = loadedFonts.get(key);
      if (!p) {
        p = document.fonts?.load(`${w} 32px "Noto Serif JP"`, text).catch(() => null) ?? Promise.resolve();
        loadedFonts.set(key, p);
      }
      return p;
    }),
  );
}

/* -------------------------------------------------------------- program --- */

export interface Api {
  readonly cols: number;
  readonly rows: number;
  readonly glyph: Int16Array;
  readonly alpha: Float32Array;
  readonly ink: Uint8Array;
  readonly pointer: { x: number; y: number; on: boolean };
  /** Clicks and taps in cell coordinates, oldest first; a program shifts off what it uses. */
  readonly taps: { x: number; y: number }[];
  /** Atlas index of a glyph spec (must be declared by the program). */
  g(spec: Spec): number;
  /** Indices sorted from least to most ink, measured from the atlas itself. */
  ramp(specs: Spec[]): number[];
  put(x: number, y: number, g: number, a: number, ink?: number): void;
}

export interface Program<O = Record<string, unknown>> {
  glyphs(opts: O): Spec[];
  create(api: Api, opts: O): Promise<(t: number) => void> | ((t: number) => void);
}

export interface EngineConfig {
  cell: number;
  cellSm: number;
  fps: number;
  reveal: "scan" | "center" | "none";
  interactive: boolean;
  /** Draw the octagonal ring on click (programs that use taps themselves turn it off). */
  ripple?: boolean;
}

/* ------------------------------------------------------------ scheduler --- */

const live = new Set<Engine>();
let raf = 0;

function loop(now: number) {
  live.forEach((e) => e.tick(now));
  raf = live.size ? requestAnimationFrame(loop) : 0;
}

function wake(e: Engine) {
  live.add(e);
  if (!raf) raf = requestAnimationFrame(loop);
}

/* --------------------------------------------------------------- engine --- */

const REVEAL_FLICKER = 0.32;

export class Engine {
  private ctx: CanvasRenderingContext2D;
  private atlas: Atlas | null = null;
  private specs: Spec[];
  private cols = 0;
  private rows = 0;
  private px = 0;
  private ox = 0;
  private oy = 0;
  private api: Api | null = null;
  private frameFn: ((t: number) => void) | null = null;
  private delay = new Float32Array(0);
  private maxDelay = 0;
  private kata: number[] = [];
  private lines: Record<"h" | "v" | "up" | "down", number> = { h: 0, v: 0, up: 0, down: 0 };
  private t0 = performance.now();
  private revealAt = -1;
  private last = 0;
  private visible = false;
  private destroyed = false;
  private generation = 0;
  private readonly still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private readonly pointer = { x: -99, y: -99, on: false };
  private ripples: { x: number; y: number; t: number }[] = [];
  private readonly taps: { x: number; y: number }[] = [];
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private resizeTimer = 0;

  constructor(
    private host: HTMLElement,
    private canvas: HTMLCanvasElement,
    private program: Program<Record<string, unknown>>,
    private opts: Record<string, unknown>,
    private cfg: EngineConfig,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.specs = [...new Set([...program.glyphs(opts), ...KATA, ...LINES])];
    this.ro = new ResizeObserver(() => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.layout(), this.api ? 160 : 0);
    });
    this.ro.observe(host);
    this.io = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible) {
          if (this.revealAt < 0 && this.api) this.revealAt = this.now();
          if (!this.still) wake(this);
          else this.renderStill();
        } else live.delete(this);
      },
      { rootMargin: "80px 0px" },
    );
    this.io.observe(host);
    if (cfg.interactive && !this.still) {
      host.addEventListener("pointermove", this.onMove);
      host.addEventListener("pointerleave", this.onLeave);
      host.addEventListener("pointerdown", this.onDown);
    }
  }

  destroy() {
    this.destroyed = true;
    live.delete(this);
    this.ro.disconnect();
    this.io.disconnect();
    clearTimeout(this.resizeTimer);
    this.host.removeEventListener("pointermove", this.onMove);
    this.host.removeEventListener("pointerleave", this.onLeave);
    this.host.removeEventListener("pointerdown", this.onDown);
  }

  private now() {
    return (performance.now() - this.t0) / 1000;
  }

  private cellAt(e: PointerEvent): [number, number] {
    const r = this.canvas.getBoundingClientRect();
    const dpr = this.canvas.width / Math.max(1, r.width);
    return [((e.clientX - r.left) * dpr - this.ox) / this.px, ((e.clientY - r.top) * dpr - this.oy) / this.px];
  }

  private onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const [x, y] = this.cellAt(e);
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.on = true;
  };

  private onLeave = () => {
    this.pointer.on = false;
  };

  private onDown = (e: PointerEvent) => {
    const [x, y] = this.cellAt(e);
    this.taps.push({ x, y });
    if (this.taps.length > 8) this.taps.shift();
    if (this.cfg.ripple === false) return;
    this.ripples.push({ x, y, t: this.now() });
    if (this.ripples.length > 4) this.ripples.shift();
  };

  private async layout() {
    const gen = ++this.generation;
    const rect = this.host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cellCss = rect.width < 640 ? this.cfg.cellSm : this.cfg.cell;
    const px = Math.max(4, Math.round(cellCss * dpr));
    const W = Math.round(rect.width * dpr);
    const H = Math.round(rect.height * dpr);
    const cols = Math.max(1, Math.floor(W / px));
    const rows = Math.max(1, Math.floor(H / px));

    if (!this.atlas || this.atlas.px !== px) {
      await loadFonts(this.specs);
      if (gen !== this.generation || this.destroyed) return;
      this.atlas = new Atlas(this.specs, px);
    }
    const atlas = this.atlas;

    this.canvas.width = W;
    this.canvas.height = H;
    this.px = px;
    this.cols = cols;
    this.rows = rows;
    this.ox = Math.floor((W - cols * px) / 2);
    this.oy = Math.floor((H - rows * px) / 2);

    const n = cols * rows;
    const glyph = new Int16Array(n).fill(-1);
    const alpha = new Float32Array(n);
    const ink = new Uint8Array(n);
    const missing = new Set<Spec>();
    const api: Api = {
      cols,
      rows,
      glyph,
      alpha,
      ink,
      pointer: this.pointer,
      taps: this.taps,
      g: (spec) => {
        const i = atlas.index.get(spec);
        if (i === undefined) {
          missing.add(spec);
          return -1;
        }
        return i;
      },
      ramp: (specs) =>
        specs
          .map((s) => atlas.index.get(s))
          .filter((i): i is number => i !== undefined)
          .sort((a, b) => atlas.coverage[a] - atlas.coverage[b]),
      put: (x, y, g, a, c = 0) => {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || y < 0 || x >= cols || y >= rows || g < 0) return;
        const i = y * cols + x;
        glyph[i] = g;
        alpha[i] = a;
        ink[i] = c;
      },
    };
    this.kata = KATA.map((k) => atlas.index.get(k)!);
    this.lines = {
      h: atlas.index.get(LINE.h)!,
      v: atlas.index.get(LINE.v)!,
      up: atlas.index.get(LINE.up)!,
      down: atlas.index.get(LINE.down)!,
    };

    const frame = await this.program.create(api, this.opts);
    if (gen !== this.generation || this.destroyed) return;
    if (missing.size && process.env.NODE_ENV !== "production") {
      console.warn("plate: undeclared glyphs", [...missing].join(""));
    }

    // Reveal order: a top-down scan with grain, or a bloom from the centre.
    this.delay = new Float32Array(n);
    let max = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const j = hash(x, y, 7);
        let d = 0;
        if (this.cfg.reveal === "scan") d = (y / rows) * 1.1 + j * 0.55;
        else if (this.cfg.reveal === "center") {
          const dx = (x - cols / 2) / (cols / 2);
          const dy = (y - rows / 2) / (rows / 2);
          d = Math.min(1, Math.hypot(dx, dy) / 1.2) * 1.1 + j * 0.45;
        }
        this.delay[i] = d;
        if (d > max) max = d;
      }
    }
    this.maxDelay = max;

    this.api = api;
    this.frameFn = frame;
    if (this.visible && this.revealAt < 0) this.revealAt = this.now();
    if (this.still) this.renderStill();
    else if (this.visible) {
      this.last = 0;
      wake(this);
    }
  }

  private renderStill() {
    if (!this.api || !this.frameFn) return;
    this.revealAt = -100;
    this.render(24);
  }

  tick(now: number) {
    if (!this.visible || !this.api || !this.frameFn || this.destroyed) return;
    if (document.hidden) return;
    if (now - this.last < 1000 / this.cfg.fps - 2) return;
    this.last = now;
    this.render(this.now());
  }

  private render(t: number) {
    this.api!.glyph.fill(-1);
    this.frameFn!(t);
    this.reveal(t);
    if (this.pointer.on) this.lens(t);
    if (this.ripples.length) this.ripple(t);
    this.draw();
  }

  private reveal(t: number) {
    if (this.cfg.reveal === "none" || this.revealAt < -50) return;
    if (this.revealAt < 0) {
      this.api!.glyph.fill(-1);
      return;
    }
    const e = t - this.revealAt;
    if (e > this.maxDelay + REVEAL_FLICKER) return;
    const { glyph, alpha, ink } = this.api!;
    const tick = Math.floor(t * 20);
    for (let i = 0; i < glyph.length; i++) {
      if (glyph[i] < 0) continue;
      const d = this.delay[i];
      if (e < d) glyph[i] = -1;
      else if (e < d + REVEAL_FLICKER) {
        glyph[i] = this.kata[Math.floor(hash(i, tick) * this.kata.length)];
        ink[i] = e < d + REVEAL_FLICKER * 0.3 ? INK.RED : INK.DIM;
        alpha[i] = Math.max(alpha[i], 0.75);
      }
    }
  }

  // A scanner lens under the pointer: ink brightens, its core turns red, the empty field shows its kana.
  private lens(t: number) {
    const { glyph, alpha, ink } = this.api!;
    const { cols, rows } = this;
    const r = Math.max(4, Math.min(9, cols / 14));
    const px = this.pointer.x;
    const py = this.pointer.y;
    const tick = Math.floor(t * 12);
    const x0 = Math.max(0, Math.floor(px - r));
    const x1 = Math.min(cols - 1, Math.ceil(px + r));
    const y0 = Math.max(0, Math.floor(py - r));
    const y1 = Math.min(rows - 1, Math.ceil(py + r));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const d = Math.hypot(x + 0.5 - px, y + 0.5 - py);
        if (d > r) continue;
        const f = 1 - d / r;
        const i = y * cols + x;
        const h = hash(x, y, tick);
        if (glyph[i] >= 0) {
          if (f > 0.62 && h < f) ink[i] = INK.RED;
          alpha[i] = Math.min(1, alpha[i] + 0.45 * f);
        } else if (h < f * 0.35) {
          glyph[i] = this.kata[Math.floor(hash(i, tick, 3) * this.kata.length)];
          alpha[i] = 0.5 * f;
          ink[i] = INK.DIM;
        }
      }
    }
  }

  // Click: an octagonal barrier ring opens from the point and fades.
  private ripple(t: number) {
    const { glyph, alpha, ink } = this.api!;
    const { cols, rows } = this;
    const life = 1.5;
    this.ripples = this.ripples.filter((r) => t - r.t < life);
    for (const rp of this.ripples) {
      const age = t - rp.t;
      const fadeOut = 1 - age / life;
      for (const [rad, c] of [
        [age * 26, INK.RED],
        [age * 26 - 3, INK.DIM],
      ] as const) {
        if (rad < 1) continue;
        const x0 = Math.max(0, Math.floor(rp.x - rad * 1.1 - 1));
        const x1 = Math.min(cols - 1, Math.ceil(rp.x + rad * 1.1 + 1));
        const y0 = Math.max(0, Math.floor(rp.y - rad * 1.1 - 1));
        const y1 = Math.min(rows - 1, Math.ceil(rp.y + rad * 1.1 + 1));
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const dx = x + 0.5 - rp.x;
            const dy = y + 0.5 - rp.y;
            const ax = Math.abs(dx);
            const ay = Math.abs(dy);
            const ad = (ax + ay) * Math.SQRT1_2;
            const d = Math.max(ax, ay, ad);
            if (Math.abs(d - rad) > 0.6) continue;
            const i = y * cols + x;
            glyph[i] =
              ad >= ax && ad >= ay
                ? dx * dy > 0
                  ? this.lines.up
                  : this.lines.down
                : ax > ay
                  ? this.lines.v
                  : this.lines.h;
            alpha[i] = fadeOut;
            ink[i] = c;
          }
        }
      }
    }
  }

  private draw() {
    const { ctx, px, cols, rows, ox, oy } = this;
    const atlas = this.atlas!.canvas;
    const { glyph, alpha, ink } = this.api!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let lastA = -1;
    for (let y = 0; y < rows; y++) {
      const dy = oy + y * px;
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const g = glyph[i];
        if (g < 0) continue;
        const a = alpha[i];
        if (a < 0.03) continue;
        const qa = Math.round(a * 32) / 32;
        if (qa !== lastA) {
          ctx.globalAlpha = qa > 1 ? 1 : qa;
          lastA = qa;
        }
        ctx.drawImage(atlas, g * px, ink[i] * px, px, px, ox + x * px, dy, px, px);
      }
    }
    ctx.globalAlpha = 1;
  }
}
