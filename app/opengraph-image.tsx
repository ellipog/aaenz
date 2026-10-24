import { ImageResponse } from "next/og";
import { hash } from "@/components/ascii/engine";
import { HORIZON, LIES, SHORE, STREAK, colossusField } from "@/components/ascii/shore-shape";
import { C, type Cell, Grid, OG_SIZE, glyphsOf, ogFonts, stroke } from "@/lib/og";

/*
 * The share card, drawn at build: the footer's shore, caught still. Stars and
 * the red streak overhead, the two colossi hung over the red sea, the glint on
 * the horizon, and on the white strand the wordmark written in black beside
 * one of us lying where the footprints stop.
 */

export const alt = "aaen studios — software studio";
export const size = OG_SIZE;
export const contentType = "image/png";

const CELL = 18;
const COLS = 67;
const ROWS = 35;
const TOP = 0;

function shorePlate(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
  const set = (x: number, y: number, c: Cell) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < COLS && y < ROWS) grid[y][x] = c;
  };
  const hz = Math.round(ROWS * HORIZON);
  const sh = ROWS * SHORE;
  const glintX = Math.round(COLS * 0.6);

  const colossi = [
    { x: COLS * 0.27, y: hz + 1 - 17, h: 17, lean: 0.05, broken: false },
    { x: COLS * 0.8, y: hz + 0.5 - 9.4, h: 9.4, lean: -0.24, broken: true },
  ].map((c) => colossusField(COLS, ROWS, c, 6));
  const cover = (x: number, y: number) => colossi.reduce((m, f) => Math.max(m, x < 0 || y < 0 || x >= COLS || y >= ROWS ? 0 : f[y * COLS + x]), 0);

  // the stars, thick overhead and thinning into the haze
  for (let y = 0; y < hz - 1; y++) {
    const lift = 1 - y / hz;
    for (let x = 0; x < COLS; x++) {
      if (hash(x, y, 1) > 0.03 + 0.09 * lift * lift) continue;
      const k = hash(x, y, 2);
      set(x, y, { ch: k < 0.7 ? "・" : k < 0.93 ? "丶" : k < 0.98 ? "星" : "十", a: (0.2 + 0.45 * hash(x, y, 3)) * (0.4 + 0.6 * lift) });
    }
  }
  // the streak, thick at the top and thinning to its tip
  const [s0x, s0y, s2x, s2y] = STREAK.wide;
  for (let j = 0; j <= 80; j++) {
    const s = j / 80;
    const px = COLS * (s0x + (s2x - s0x) * s);
    const py = ROWS * (s0y + (s2y - s0y) * s);
    const w = 0.4 + 1.7 * (1 - s);
    for (let o = -w; o <= w; o += 0.5) set(px + o, py, { ch: Math.abs(o) < w * 0.5 ? "ヽ" : "・", a: (Math.abs(o) < w * 0.5 ? 0.95 : 0.45) * (1 - s * 0.4), red: true });
  }
  // the colossi: outlines stroked along their run, red where they face the sea, the flesh in kanji
  for (let y = 0; y < hz; y++) {
    for (let x = 0; x < COLS; x++) {
      const cv = cover(x, y);
      if (cv < 0.12) continue;
      const ex = cover(x + 1, y) - cover(x - 1, y);
      const ey = cover(x, y + 1) - cover(x, y - 1);
      const down = ey < -0.1;
      if (cv < 0.55 && Math.hypot(ex, ey) > 0.1) {
        set(x, y, { ch: stroke(-ey, ex), a: down ? 0.95 : 0.55, red: down });
        continue;
      }
      const k = hash(x, y, 4);
      set(x, y, { ch: k < 0.3 ? "白" : k < 0.55 ? "肉" : k < 0.8 ? "身" : "骨", a: 0.4 + 0.35 * hash(x, y, 5), red: k > 0.62 && hash(x, y, 6) < 0.45 });
    }
  }
  // a ruin at the edge of the world
  for (const [x, h] of [[1, 3], [2, 5], [3, 4], [4, 6], [6, 2], [7, 3]]) for (let k = 0; k < h; k++) set(x, hz - 1 - k, { ch: k % 2 ? "目" : "口", a: 0.26 });
  // the sea, and the road of light down from the glint
  for (let y = hz; y < Math.ceil(sh); y++) {
    for (let x = 0; x < COLS; x++) {
      if (y === hz) set(x, y, { ch: "ー", a: 0.95, red: true });
      else if (Math.abs(x - glintX) < 0.6 + (y - hz) * 0.5) set(x, y, { ch: "一", a: 0.85 });
      else set(x, y, { ch: (x + y * 3) % 5 === 0 ? "〜" : (x * 7 + y) % 3 ? "ー" : "・", a: 0.6 + 0.3 * hash(x, y, 7), red: true });
    }
  }
  // the glint
  for (let k = 1; k <= 9; k++) {
    set(glintX - k, hz, { ch: "ー", a: 1 - k / 10 });
    set(glintX + k, hz, { ch: "ー", a: 1 - k / 10 });
  }
  set(glintX, hz - 1, { ch: "｜", a: 0.7 });
  set(glintX, hz, { ch: "十", a: 1 });
  // the swash's wet line, and the footprints up out of it to where one of us lies
  for (let x = 0; x < COLS; x++) if (hash(x, 9) > 0.2) set(x, Math.ceil(sh), { ch: "〜", a: 0.5, dark: true });
  const [lx, ly] = LIES.wide;
  const me = { x: COLS * lx, y: sh + (ROWS - sh) * ly };
  for (let j = 1; j <= 7; j++) set(me.x + 1.4 + j * 1.3, me.y - j * 0.4, { ch: "・", a: 0.5, dark: true });
  return grid;
}

const plate = shorePlate();
const products = [["核", "KERN"], ["詠", "GALDR"], ["星", "STELLAR"], ["読", "YOMION"]] as const;
const hzPx = TOP + Math.round(ROWS * HORIZON) * CELL;
const shPx = TOP + ROWS * SHORE * CELL;
const [lx, ly] = LIES.wide;
const mePx = { x: COLS * lx * CELL + CELL / 2, y: TOP + (ROWS * SHORE + ROWS * (1 - SHORE) * ly) * CELL + CELL / 2 };

export default async function Image() {
  const { jp, display, fonts } = await ogFonts(`aen核詠星読大${glyphsOf(plate)}`);

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: C.void,
          backgroundImage: `linear-gradient(to bottom, transparent ${hzPx - 140}px, rgba(227,39,29,.16) ${hzPx - 4}px, rgba(227,39,29,.34) ${hzPx + 4}px, rgba(227,39,29,.22) ${shPx - 6}px, #c9c2b6 ${shPx + 6}px, ${C.bone} ${shPx + 70}px)`,
          color: C.void,
          display: "flex",
          fontFamily: "JetBrains Mono",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        {jp ? (
          <div style={{ display: "flex", left: 0, position: "absolute", top: TOP }}>
            <Grid font={display} grid={plate} size={CELL} />
          </div>
        ) : null}
        {jp ? (
          <span
            style={{ color: C.red, display: "flex", fontFamily: display, fontSize: 30, left: mePx.x - 15, lineHeight: 1, position: "absolute", top: mePx.y - 15, transform: "rotate(-90deg)" }}
          >
            大
          </span>
        ) : null}
        <div style={{ display: "flex", fontFamily: display, fontSize: 150, fontWeight: 900, left: 76, letterSpacing: 4, lineHeight: 1, position: "absolute", top: shPx + 14 }}>
          aaen
        </div>
        <div style={{ alignItems: "center", bottom: 28, display: "flex", justifyContent: "space-between", left: 84, position: "absolute", right: 64 }}>
          <span style={{ color: "rgba(5,5,5,.6)", fontSize: 17, letterSpacing: 5 }}>SOFTWARE STUDIO · AAENZ.NO</span>
          <span style={{ display: "flex", fontSize: 17, gap: 22, letterSpacing: 3 }}>
            {products.map(([glyph, name]) => (
              <span key={name} style={{ display: "flex", gap: 8 }}>
                {jp ? <span style={{ color: C.red, fontFamily: display }}>{glyph}</span> : null}
                {name}
              </span>
            ))}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
