/*
 * The plate engine. Every picture on the site is a grid of characters: kanji for
 * mass, katakana for line. A program writes one glyph, alpha and ink per cell;
 * the engine owns everything around it — the glyph atlas, the decode-in, the
 * pointer lens and click ripple, pausing offscreen, and reduced motion.
 *
 * Cells are square because kanji are: one full-width character per cell, so a
 * plate keeps its proportions without the aspect correction Latin ASCII needs.
 * Glyphs are drawn once into an atlas, and the GPU draws a whole plate from it in
 * one call, tinting each glyph with its ink; a full-screen plate (8–10k cells)
 * costs the main thread little more than packing an array. Without WebGL2 the
 * cells are stamped one by one with drawImage instead.
 */

export type Spec = string; // "光", "900:光" or "900:人@90" — weight prefix and turn (degrees) optional

export const FAMILY = '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif';

// Four inks only: bone for everything, red for the signal, a grey for the field, and void for
// the rare plate that draws on light ground.
export const INK = { BONE: 0, RED: 1, DIM: 2, VOID: 3 } as const;
const PALETTE = ["#ece7db", "#e3271d", "#8c877b", "#050505"];

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

/** Which stroke best follows a line running at `theta` (radians, y down): 0 across, 1 falling, 2 standing, 3 rising. */
export function lineIndex(theta: number): number {
  let a = theta % Math.PI;
  if (a < 0) a += Math.PI;
  const o = Math.PI / 8;
  if (a < o || a >= 7 * o) return 0;
  if (a < 3 * o) return 1;
  if (a < 5 * o) return 2;
  return 3;
}

/** The stroke that best follows a line running at `theta` (radians, y down), from `set`. */
export function lineChar(theta: number, set: typeof LINE | typeof FLOW = LINE): Spec {
  const k = lineIndex(theta);
  return k === 0 ? set.h : k === 1 ? set.down : k === 2 ? set.v : set.up;
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

function parse(spec: Spec): [string, number, number] {
  const turn = /@(-?\d+)$/.exec(spec);
  const body = turn ? spec.slice(0, turn.index) : spec;
  const i = body.indexOf(":");
  return [i > 0 ? body.slice(i + 1) : body, i > 0 ? Number(body.slice(0, i)) : 400, turn ? Number(turn[1]) : 0];
}

// The GPU tints glyphs itself, so its atlas is one band of white; the 2D fallback stamps
// pre-inked glyphs, one band per ink.
const WHITE = ["#fff"];

class Atlas {
  readonly canvas = document.createElement("canvas");
  readonly index = new Map<Spec, number>();
  readonly coverage: Float32Array;
  /** Glyphs per row of the grid, and rows per band: kept inside any GPU's texture limit. */
  readonly perRow: number;
  readonly gridRows: number;

  constructor(
    readonly specs: Spec[],
    readonly px: number,
    readonly bands: string[],
  ) {
    const n = specs.length;
    this.perRow = Math.max(1, Math.min(n, Math.floor(2048 / px)));
    this.gridRows = Math.ceil(n / this.perRow);
    const bandH = this.gridRows * px;
    this.canvas.width = this.perRow * px;
    this.canvas.height = bands.length * bandH;
    const ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    specs.forEach((s, i) => {
      this.index.set(s, i);
      const [ch, w, turn] = parse(s);
      const gx = (i % this.perRow) * px;
      const gy = Math.floor(i / this.perRow) * px;
      ctx.font = `${w} ${Math.round(px * 0.9)}px ${FAMILY}`;
      bands.forEach((col, band) => {
        const y = band * bandH + gy;
        ctx.fillStyle = col;
        if (!turn) {
          ctx.fillText(ch, gx + px / 2, y + px * 0.53);
          return;
        }
        ctx.save();
        ctx.translate(gx + px / 2, y + px / 2);
        ctx.rotate((turn * Math.PI) / 180);
        ctx.fillText(ch, 0, px * 0.03);
        ctx.restore();
      });
    });
    const W = this.perRow * px;
    const data = ctx.getImageData(0, 0, W, bandH).data;
    this.coverage = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const gx = (i % this.perRow) * px;
      const gy = Math.floor(i / this.perRow) * px;
      let sum = 0;
      for (let y = 0; y < px; y++) {
        for (let x = 0; x < px; x++) sum += data[((gy + y) * W + gx + x) * 4 + 3];
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
  /** CSS pixels per cell. */
  readonly cell: number;
  /** Carry the whole plate `dy` CSS pixels off its grid: a shift finer than a cell, made by the canvas. */
  nudge(dy: number): void;
  /** Atlas index of a glyph spec (must be declared by the program). */
  g(spec: Spec): number;
  /** Indices sorted from least to most ink, measured from the atlas itself. */
  ramp(specs: Spec[]): number[];
  put(x: number, y: number, g: number, a: number, ink?: number): void;
}

export interface Program<O = Record<string, unknown>> {
  glyphs(opts: O): Spec[];
  /** Keep the display's pace while the page scrolls (a plate fixed to the viewport that draws the page). */
  scroll?: boolean;
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

/* ------------------------------------------------------------- renderers --- */

/*
 * Two ways onto the screen. The GPU draws a whole plate in one call: the cells go
 * up as one packed array (glyph, alpha, ink) and every glyph is a quad cut from
 * the atlas and tinted there, so a full-screen plate costs the main thread about
 * what it costs to fill an array. Where WebGL2 is missing the 2D canvas stamps
 * each cell with drawImage, as it always did. Either way a draw can be limited to
 * a band of rows, which is all the pointer's lens needs between frames.
 */

interface Frame {
  W: number;
  H: number;
  px: number;
  cols: number;
  rows: number;
  ox: number;
  oy: number;
  glyph: Int16Array;
  alpha: Float32Array;
  ink: Uint8Array;
  atlas: Atlas;
}

interface Renderer {
  readonly kind: "gl" | "2d";
  readonly canvas: HTMLCanvasElement;
  /** False once the GPU has taken the context back. */
  draw(f: Frame, lo: number, hi: number): boolean;
  /** Leave the host: a GPU renderer goes back to the pool for another plate, a 2D one is dropped. */
  release(): void;
}

function makeCanvas() {
  const c = document.createElement("canvas");
  c.setAttribute("aria-hidden", "true");
  c.style.cssText = "position:absolute;inset:0;display:block;width:100%;height:100%";
  return c;
}

const VERT = `#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in uint aCell;
uniform vec2 uView;
uniform vec2 uOrigin;
uniform float uPx;
uniform int uCols;
uniform int uPerRow;
uniform vec2 uAtlas;
uniform vec3 uInk[4];
out vec2 vUv;
flat out vec4 vInk;
void main() {
  uint g = aCell & 65535u;
  uint a = (aCell >> 16) & 255u;
  vUv = vec2(0.0);
  vInk = vec4(0.0);
  if (g == 65535u || a == 0u) {
    gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);
    return;
  }
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  vec2 cell = vec2(float(gl_InstanceID % uCols), float(gl_InstanceID / uCols));
  vec2 p = uOrigin + (cell + corner) * uPx;
  gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
  int gi = int(g);
  vUv = (vec2(float(gi % uPerRow), float(gi / uPerRow)) + corner) * uPx / uAtlas;
  vInk = vec4(uInk[min(int(aCell >> 24), 3)], float(a) / 255.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
in vec2 vUv;
flat in vec4 vInk;
out vec4 o;
void main() {
  float c = texture(uTex, vUv).a * vInk.a;
  o = vec4(vInk.rgb * c, c);
}`;

const EMPTY = 0xffff;
const INK_RGB = new Float32Array(PALETTE.flatMap((hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255)));

/*
 * GPU contexts are few (browsers cap them near 16) and slow to make, so a page makes
 * only a handful and passes them from plate to plate: a canvas keeps its context when
 * it moves to another host, so a plate coming into view takes over the one that a
 * plate far out of view has let go.
 */
const MAX_GL = 8;
const spare: GLRenderer[] = [];
let made = 0;
let glOk: boolean | null = null;

/** Whether this browser can give a plate a WebGL2 context (asked once; the answer is kept as the first context). */
function canGL(): boolean {
  if (glOk === null) {
    try {
      spare.push(new GLRenderer());
      made++;
      glOk = true;
    } catch {
      glOk = false;
    }
  }
  return glOk;
}

class GLRenderer implements Renderer {
  readonly kind = "gl";
  readonly canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private buf: WebGLBuffer;
  private tex: WebGLTexture;
  private packed = new Uint32Array(0);
  private atlas: Atlas | null = null;
  private lost = false;

  constructor() {
    this.canvas = makeCanvas();
    const gl = this.canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("no webgl2");
    this.gl = gl;
    this.canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.lost = true;
    });
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      throw new Error("plate shader failed to link");
    }
    gl.useProgram(prog);
    for (const name of ["uView", "uOrigin", "uPx", "uCols", "uPerRow", "uAtlas", "uInk", "uTex"]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    gl.uniform3fv(this.u.uInk, INK_RGB);
    gl.uniform1i(this.u.uTex, 0);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    this.buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribIPointer(0, 1, gl.UNSIGNED_INT, 4, 0);
    gl.vertexAttribDivisor(0, 1);
    this.tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);
  }

  draw(f: Frame, lo: number, hi: number) {
    const { gl } = this;
    if (this.lost || gl.isContextLost()) return false;
    const n = f.cols * f.rows;
    if (this.canvas.width !== f.W || this.canvas.height !== f.H) {
      this.canvas.width = f.W;
      this.canvas.height = f.H;
    }
    if (this.atlas !== f.atlas) {
      this.atlas = f.atlas;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, f.atlas.canvas);
      gl.uniform2f(this.u.uAtlas, f.atlas.canvas.width, f.atlas.canvas.height);
      gl.uniform1i(this.u.uPerRow, f.atlas.perRow);
    }
    if (this.packed.length !== n) {
      this.packed = new Uint32Array(n);
      gl.bufferData(gl.ARRAY_BUFFER, n * 4, gl.DYNAMIC_DRAW);
      lo = 0;
      hi = f.rows - 1;
    }
    // pack the band that changed: glyph in the low half, alpha and ink above it
    const { glyph, alpha, ink } = f;
    const p = this.packed;
    const i0 = lo * f.cols;
    const i1 = (hi + 1) * f.cols;
    for (let i = i0; i < i1; i++) {
      const g = glyph[i];
      const a = alpha[i];
      p[i] = g < 0 || a < 0.03 ? EMPTY : g | ((a >= 1 ? 255 : (a * 255 + 0.5) | 0) << 16) | (ink[i] << 24);
    }
    if (i1 > i0) gl.bufferSubData(gl.ARRAY_BUFFER, i0 * 4, p, i0, i1 - i0);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(this.u.uView, f.W, f.H);
    gl.uniform2f(this.u.uOrigin, f.ox, f.oy);
    gl.uniform1f(this.u.uPx, f.px);
    gl.uniform1i(this.u.uCols, f.cols);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
    return true;
  }

  attach(host: HTMLElement) {
    host.appendChild(this.canvas);
  }

  release() {
    this.canvas.remove();
    this.canvas.style.transform = "";
    if (this.lost || this.gl.isContextLost()) {
      made--;
      return;
    }
    // park it small, and forget the last plate so the next one starts clean
    this.canvas.width = this.canvas.height = 1;
    this.atlas = null;
    this.packed = new Uint32Array(0);
    spare.push(this);
  }
}

class CanvasRenderer implements Renderer {
  readonly kind = "2d";
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(host: HTMLElement) {
    this.canvas = makeCanvas();
    host.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
  }

  draw(f: Frame, lo: number, hi: number) {
    const { ctx } = this;
    const { px, cols, ox, oy, glyph, alpha, ink } = f;
    if (this.canvas.width !== f.W || this.canvas.height !== f.H) {
      this.canvas.width = f.W;
      this.canvas.height = f.H;
      lo = 0;
      hi = f.rows - 1;
    }
    const atlas = f.atlas.canvas;
    const { perRow, gridRows } = f.atlas;
    const bandH = gridRows * px;
    if (lo === 0 && hi === f.rows - 1) ctx.clearRect(0, 0, f.W, f.H);
    else ctx.clearRect(0, oy + lo * px, f.W, (hi - lo + 1) * px);
    let lastA = -1;
    for (let y = lo; y <= hi; y++) {
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
        ctx.drawImage(atlas, (g % perRow) * px, ink[i] * bandH + Math.floor(g / perRow) * px, px, px, ox + x * px, dy, px, px);
      }
    }
    ctx.globalAlpha = 1;
    return true;
  }

  release() {
    this.canvas.remove();
  }
}

/* ------------------------------------------------------------ scheduler --- */

/*
 * One loop drives every plate. A plate draws at its own rate (24–30fps), but on a
 * fast display many of them would land on the same frame and stall the cursor, so
 * each frame takes the plates that are due, most overdue first, only until a
 * slice of the frame is spent; the rest go a frame later, which at their rate is
 * never seen. The pointer's lens and the click ring are cheaper still and keep the
 * display's own pace. Between plate frames, with nothing under the pointer moving,
 * the loop sleeps instead of waking on every refresh of a 240Hz screen.
 */

const live = new Set<Engine>();
let raf = 0;
let timer = 0;
let gap = 1000 / 60; // the display's frame interval, learned from the loop itself
let prev = 0;
let chained = false; // this frame was asked for by the last one, so the time between them is the display's

// a governor for slow machines: if plates take more than their share of the main
// thread, every plate slows down a little, and speeds back up when there is room
let busy = 0;
let windowStart = 0;
let pace = 1;

function loop(now: number) {
  raf = 0;
  if (chained && now - prev < 100) gap += (now - prev - gap) * 0.05;
  prev = now;
  const start = performance.now();
  const due: Engine[] = [];
  live.forEach((e) => {
    if (e.due(now)) due.push(e);
    else e.follow(now);
  });
  due.sort((a, b) => a.next - b.next);
  const slice = Math.max(2, gap * 0.4);
  for (let k = 0; k < due.length; k++) {
    if (k > 0 && performance.now() - start > slice) due[k].follow(now);
    else due[k].frame(now);
  }
  busy += performance.now() - start;
  if (!windowStart) windowStart = now;
  else if (now - windowStart > 2000) {
    const load = busy / (now - windowStart);
    if (load > 0.3) pace = Math.max(0.4, pace * 0.8);
    else if (load < 0.12) pace = Math.min(1, pace * 1.15);
    busy = 0;
    windowStart = now;
  }
  // sleep until the next plate is due, a frame and a half early, unless something is moving now
  let soonest = Infinity;
  let moving = false;
  for (const e of live) {
    soonest = Math.min(soonest, e.nextDue());
    if (e.moving()) moving = true;
  }
  chained = false;
  if (!moving && soonest === Infinity) return;
  const wait = soonest - now - gap * 1.5;
  if (moving || wait < gap) {
    chained = true;
    raf = requestAnimationFrame(loop);
  } else timer = window.setTimeout(resume, wait);
}

function resume() {
  timer = 0;
  if (!raf) raf = requestAnimationFrame(loop);
}

/** Run the loop on the next frame, waking it if it sleeps (and add a plate to it). */
function wake(e?: Engine) {
  if (e) live.add(e);
  if (raf) return;
  clearTimeout(timer);
  timer = 0;
  raf = requestAnimationFrame(loop);
}

/*
 * Plates are prepared — atlas, program, first state — when they come within a
 * screen of view, or before that whenever the page is idle, nearest first. A page
 * of ten plates no longer builds all ten in its first second.
 */
const waiting = new Set<Engine>();
let idleTimer = 0;

const idle = (fn: () => void) =>
  typeof requestIdleCallback === "function" ? requestIdleCallback(fn, { timeout: 2500 }) : window.setTimeout(fn, 300);

function prepareSoon(e: Engine) {
  waiting.add(e);
  if (!idleTimer) idleTimer = idle(drain);
}

function drain() {
  idleTimer = 0;
  let best: Engine | null = null;
  let bestD = Infinity;
  for (const e of waiting) {
    const d = e.distance();
    if (d < bestD) {
      best = e;
      bestD = d;
    }
  }
  best?.prepare();
  if (waiting.size) idleTimer = idle(drain);
}

// the plates holding a GPU context now
const holding = new Set<Engine>();

/* --------------------------------------------------------------- engine --- */

const REVEAL_FLICKER = 0.32;

export class Engine {
  private renderer: Renderer | null = null;
  private atlas: Atlas | null = null;
  private specs: Spec[];
  private frameData: Frame | null = null;
  private api: Api | null = null;
  private frameFn: ((t: number) => void) | null = null;
  // the program's last frame, before the lens and ring are laid over it
  private baseGlyph = new Int16Array(0);
  private baseAlpha = new Float32Array(0);
  private baseInk = new Uint8Array(0);
  // rows the lens and ring last wrote to, so the next pass can put them back
  private ovLo = 0;
  private ovHi = -1;
  private delay = new Float32Array(0);
  private maxDelay = 0;
  private kata: number[] = [];
  private lines: Record<"h" | "v" | "up" | "down", number> = { h: 0, v: 0, up: 0, down: 0 };
  private t0 = performance.now();
  private revealAt = -1;
  next = 0;
  private visible = false;
  private near = false;
  private lastSeen = 0;
  private destroyed = false;
  private generation = 0;
  private laying = false;
  private glFailures = 0;
  private readonly still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private readonly pointer = { x: -99, y: -99, on: false };
  private moved = false;
  private scrolled = false;
  private nudgeY = 0;
  private dpr = 1;
  private ripples: { x: number; y: number; t: number }[] = [];
  private readonly taps: { x: number; y: number }[] = [];
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private far: IntersectionObserver;
  private resizeTimer = 0;

  constructor(
    private host: HTMLElement,
    private program: Program<Record<string, unknown>>,
    private opts: Record<string, unknown>,
    private cfg: EngineConfig,
  ) {
    this.specs = [...new Set([...program.glyphs(opts), ...KATA, ...LINES])];
    this.ro = new ResizeObserver(() => {
      if (!this.api && !this.near) return;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.layout(), this.api ? 160 : 0);
    });
    this.ro.observe(host);
    this.io = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible) {
          this.lastSeen = performance.now();
          if (this.revealAt < 0 && this.api) this.revealAt = this.now();
          if (!this.still) wake(this);
          else this.renderStill();
        } else live.delete(this);
      },
      { rootMargin: "80px 0px" },
    );
    this.io.observe(host);
    // a screen either side: close enough to get ready, far enough to let go of the GPU
    this.far = new IntersectionObserver(
      ([entry]) => {
        this.near = entry.isIntersecting;
        if (this.near) {
          if (!this.api) this.prepare();
          else this.warmSoon();
        } else this.dropRenderer();
      },
      { rootMargin: "100% 0px" },
    );
    this.far.observe(host);
    if (cfg.interactive && !this.still) {
      host.addEventListener("pointermove", this.onMove);
      host.addEventListener("pointerleave", this.onLeave);
      host.addEventListener("pointerdown", this.onDown);
    }
    if (program.scroll && !this.still) window.addEventListener("scroll", this.onScroll, { passive: true });
    prepareSoon(this);
  }

  destroy() {
    this.destroyed = true;
    live.delete(this);
    waiting.delete(this);
    this.ro.disconnect();
    this.io.disconnect();
    this.far.disconnect();
    clearTimeout(this.resizeTimer);
    this.host.removeEventListener("pointermove", this.onMove);
    this.host.removeEventListener("pointerleave", this.onLeave);
    this.host.removeEventListener("pointerdown", this.onDown);
    window.removeEventListener("scroll", this.onScroll);
    this.dropRenderer();
  }

  /** How far the plate is from the viewport, in px (0 when on screen). */
  distance() {
    const r = this.host.getBoundingClientRect();
    return r.bottom < 0 ? -r.bottom : r.top > window.innerHeight ? r.top - window.innerHeight : 0;
  }

  prepare() {
    waiting.delete(this);
    if (!this.api && !this.laying) this.layout();
  }

  private now() {
    return (performance.now() - this.t0) / 1000;
  }

  private cellAt(e: PointerEvent): [number, number] {
    const f = this.frameData;
    if (!f) return [-99, -99];
    const r = this.host.getBoundingClientRect();
    const dpr = f.W / Math.max(1, r.width);
    return [((e.clientX - r.left) * dpr - f.ox) / f.px, ((e.clientY - r.top) * dpr - f.oy) / f.px];
  }

  private onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const [x, y] = this.cellAt(e);
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.on = true;
    this.moved = true;
    if (this.visible) wake();
  };

  private onLeave = () => {
    this.pointer.on = false;
    this.moved = true;
    if (this.visible) wake();
  };

  private onScroll = () => {
    this.scrolled = true;
    if (this.visible) wake();
  };

  private onDown = (e: PointerEvent) => {
    const [x, y] = this.cellAt(e);
    this.taps.push({ x, y });
    if (this.taps.length > 8) this.taps.shift();
    if (this.visible) wake();
    if (this.cfg.ripple === false) return;
    this.ripples.push({ x, y, t: this.now() });
    if (this.ripples.length > 4) this.ripples.shift();
  };

  private async layout() {
    const gen = ++this.generation;
    waiting.delete(this);
    this.laying = true;
    try {
      await this.build(gen);
    } finally {
      if (gen === this.generation) this.laying = false;
    }
  }

  private async build(gen: number) {
    const rect = this.host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cellCss = rect.width < 640 ? this.cfg.cellSm : this.cfg.cell;
    const px = Math.max(4, Math.round(cellCss * dpr));
    const W = Math.round(rect.width * dpr);
    const H = Math.round(rect.height * dpr);
    const cols = Math.max(1, Math.floor(W / px));
    const rows = Math.max(1, Math.floor(H / px));
    const bands = this.glFailures < 3 && canGL() ? WHITE : PALETTE;

    if (!this.atlas || this.atlas.px !== px || this.atlas.bands !== bands) {
      await loadFonts(this.specs);
      if (gen !== this.generation || this.destroyed) return;
      this.atlas = new Atlas(this.specs, px, bands);
    }
    const atlas = this.atlas;

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
      cell: px / dpr,
      nudge: (dy) => {
        this.nudgeY = dy;
      },
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

    const frame = await this.program.create(api, this.opts);
    if (gen !== this.generation || this.destroyed) return;
    if (missing.size && process.env.NODE_ENV !== "production") {
      console.warn("plate: undeclared glyphs", [...missing].join(""));
    }

    // Reveal order: a top-down scan with grain, or a bloom from the centre.
    const delay = new Float32Array(n);
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
        delay[i] = d;
        if (d > max) max = d;
      }
    }

    // everything the draw reads changes together, so a frame never sees half a layout
    this.delay = delay;
    this.maxDelay = max;
    this.kata = KATA.map((k) => atlas.index.get(k)!);
    this.lines = {
      h: atlas.index.get(LINE.h)!,
      v: atlas.index.get(LINE.v)!,
      up: atlas.index.get(LINE.up)!,
      down: atlas.index.get(LINE.down)!,
    };
    this.baseGlyph = new Int16Array(n).fill(-1);
    this.baseAlpha = new Float32Array(n);
    this.baseInk = new Uint8Array(n);
    this.ovLo = 0;
    this.ovHi = -1;
    this.frameData = {
      W,
      H,
      px,
      cols,
      rows,
      ox: Math.floor((W - cols * px) / 2),
      oy: Math.floor((H - rows * px) / 2),
      glyph,
      alpha,
      ink,
      atlas,
    };
    this.api = api;
    this.frameFn = frame;
    this.dpr = dpr;
    if (this.visible && this.revealAt < 0) this.revealAt = this.now();
    if (this.still) this.renderStill();
    else if (this.visible) {
      this.next = 0;
      wake(this);
    } else if (this.near) this.warmSoon();
  }

  // take a canvas and set it up while the page is idle, so a plate's first frame on screen isn't
  // also the one that pays for its GPU context and atlas
  private warmSoon() {
    idle(() => {
      const f = this.frameData;
      if (f && this.near && !this.renderer && !this.destroyed) this.draw(0, f.rows - 1);
    });
  }

  private renderStill() {
    if (!this.api || !this.frameFn) return;
    this.revealAt = -100;
    this.render(24);
  }

  /** When the program's next frame is due, or never if it isn't drawing. */
  nextDue() {
    return this.visible && this.api && !this.destroyed ? this.next : Infinity;
  }

  /** Whether the lens or a ring has moved since the last frame, so the display's pace is wanted. */
  moving() {
    return this.visible && !!this.api && (this.moved || this.scrolled || this.ripples.length > 0);
  }

  /** Whether the program's next frame is due. */
  due(now: number) {
    if (!this.visible || !this.api || this.destroyed || document.hidden) return false;
    return now >= this.next || this.scrolled;
  }

  /** A full frame: the program draws, then the lens and ring go over it. */
  frame(now: number) {
    const fps = this.cfg.fps * pace;
    // land on the display's own frames: due a little early rather than a frame late
    this.next = now + 1000 / fps - gap * 0.5;
    this.lastSeen = now;
    this.scrolled = false;
    this.render(this.now());
  }

  /** Between frames: only the lens and the ring move, at the display's pace, and only when they do. */
  follow(now: number) {
    if (!this.visible || !this.api || this.destroyed) return;
    if (!this.moved && !this.ripples.length) return;
    this.lastSeen = now;
    this.lay(this.now());
  }

  private render(t: number) {
    const api = this.api!;
    api.glyph.fill(-1);
    this.frameFn!(t);
    this.reveal(t);
    this.baseGlyph.set(api.glyph);
    this.baseAlpha.set(api.alpha);
    this.baseInk.set(api.ink);
    this.ovLo = api.rows;
    this.ovHi = -1;
    this.overlay(t);
    this.draw(0, api.rows - 1);
  }

  // put back the rows the overlays last touched, lay them again, and draw only that band
  private lay(t: number) {
    const api = this.api!;
    const lo0 = this.ovLo;
    const hi0 = this.ovHi;
    if (hi0 >= lo0) {
      const a = lo0 * api.cols;
      const b = (hi0 + 1) * api.cols;
      api.glyph.set(this.baseGlyph.subarray(a, b), a);
      api.alpha.set(this.baseAlpha.subarray(a, b), a);
      api.ink.set(this.baseInk.subarray(a, b), a);
    }
    this.ovLo = api.rows;
    this.ovHi = -1;
    this.overlay(t);
    const lo = Math.min(lo0, this.ovLo);
    const hi = Math.max(hi0, this.ovHi);
    if (hi >= lo) this.draw(Math.max(0, lo), Math.min(api.rows - 1, hi));
  }

  private overlay(t: number) {
    this.moved = false;
    if (this.pointer.on) this.lens(t);
    if (this.ripples.length) {
      this.ripple(t);
      // the last ring just closed: one more pass to take it away
      if (!this.ripples.length) this.moved = true;
    }
  }

  private touch(y0: number, y1: number) {
    if (y0 < this.ovLo) this.ovLo = y0;
    if (y1 > this.ovHi) this.ovHi = y1;
  }

  private draw(lo: number, hi: number) {
    const f = this.frameData;
    if (!f) return;
    const r = this.renderer ?? this.makeRenderer();
    if (!r) return;
    if (r.draw(f, lo, hi)) {
      // the program's nudge, on a whole device pixel so the canvas is never resampled soft
      const dy = Math.round(this.nudgeY * this.dpr) / this.dpr;
      const t = dy ? `translate3d(0,${dy}px,0)` : "";
      if (r.canvas.style.transform !== t) r.canvas.style.transform = t;
      return;
    }
    // the GPU took the context back: start again on a fresh canvas, or fall back for good
    this.glFailures++;
    this.dropRenderer();
    if (this.glFailures >= 3) {
      this.layout();
      return;
    }
    this.makeRenderer()?.draw(f, 0, f.rows - 1);
  }

  private makeRenderer(): Renderer | null {
    const f = this.frameData;
    if (!f || this.destroyed) return null;
    if (f.atlas.bands === WHITE) {
      let r = spare.pop();
      if (!r && made >= MAX_GL) {
        // every context is out: take back the one held by the plate seen longest ago
        let oldest: Engine | null = null;
        for (const e of holding) if (!e.visible && (!oldest || e.lastSeen < oldest.lastSeen)) oldest = e;
        oldest?.dropRenderer();
        r = spare.pop();
      }
      if (!r) {
        try {
          r = new GLRenderer();
          made++;
        } catch {
          this.glFailures = 3;
          this.layout();
          return null;
        }
      }
      r.attach(this.host);
      this.renderer = r;
      holding.add(this);
      return r;
    }
    this.renderer = new CanvasRenderer(this.host);
    return this.renderer;
  }

  private dropRenderer() {
    if (!this.renderer) return;
    this.renderer.release();
    this.renderer = null;
    holding.delete(this);
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
    const { glyph, alpha, ink, cols, rows } = this.api!;
    const r = Math.max(4, Math.min(9, cols / 14));
    const px = this.pointer.x;
    const py = this.pointer.y;
    const tick = Math.floor(t * 12);
    const x0 = Math.max(0, Math.floor(px - r));
    const x1 = Math.min(cols - 1, Math.ceil(px + r));
    const y0 = Math.max(0, Math.floor(py - r));
    const y1 = Math.min(rows - 1, Math.ceil(py + r));
    if (y1 < y0 || x1 < x0) return;
    this.touch(y0, y1);
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
    const { glyph, alpha, ink, cols, rows } = this.api!;
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
        if (y1 < y0 || x1 < x0) continue;
        this.touch(y0, y1);
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
}
