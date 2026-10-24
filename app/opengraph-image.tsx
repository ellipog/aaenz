import { ImageResponse } from "next/og";
import { DESCENT, HIDDEN, PATHS, SPHERES } from "@/components/ascii/tree-shape";
import { C, type Cell, Grid, OG_SIZE, glyphsOf, ogFonts, stroke } from "@/lib/og";

/*
 * The share card, drawn at build as a title card: the wordmark in heavy Mincho
 * on the left, and on the right the footer's picture caught at its height — the
 * Tree of Life in characters, the red bolt run down it, the cross of light
 * standing up the middle pillar, one small red figure on the horizon.
 */

export const alt = "aaen studios — software studio";
export const size = OG_SIZE;
export const contentType = "image/png";

const COLS = 21;
const ROWS = 23;

function treePlate(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
  const set = (x: number, y: number, c: Cell) => {
    if (x >= 0 && y >= 0 && x < COLS && y < ROWS) grid[y][x] = c;
  };
  const th = 19;
  const tw = th * 0.56;
  const cx = 10;
  const at = (u: number, v: number) => ({ x: Math.round(cx + (u - 0.5) * tw), y: Math.round(1 + v * th) });
  const spheres = SPHERES.map((s) => at(s.u, s.v));
  const horizon = spheres[9].y + 1;
  const line = (a: { x: number; y: number }, b: { x: number; y: number }, c: (ch: string) => Cell) => {
    const n = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    const ch = stroke(b.x - a.x, b.y - a.y);
    for (let k = 1; k < n; k++) set(Math.round(a.x + ((b.x - a.x) * k) / n), Math.round(a.y + ((b.y - a.y) * k) / n), c(ch));
  };

  // a faint sea under the horizon, and dust in the sky
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (y > horizon) set(x, y, (x * 7 + y * 3) % 4 ? { ch: "〜", a: 0.22 } : null);
      else if ((x * 13 + y * 29) % 23 === 0) set(x, y, { ch: "・", a: 0.25 });
    }
  }
  // the cross of light: up the middle pillar and across at the hidden sphere
  const bar = at(HIDDEN.u, HIDDEN.v).y;
  for (let y = 0; y <= horizon - 1; y++) set(cx, y, { ch: "光", a: 0.85 });
  for (let x = 0; x < COLS; x++) if (x !== cx) set(x, bar, { ch: "光", a: Math.max(0.3, 0.85 - Math.abs(x - cx) * 0.05) });
  // its reflection in the water
  for (let y = horizon + 1; y < ROWS; y++) set(cx, y, { ch: "〜", a: 0.7 });
  // the paths
  for (const [a, b] of PATHS) line(spheres[a], spheres[b], (ch) => ({ ch, a: 0.4 }));
  // the bolt, crown to kingdom
  for (let h = 0; h + 1 < DESCENT.length; h++) line(spheres[DESCENT[h]], spheres[DESCENT[h + 1]], (ch) => ({ ch, a: 1, red: true }));
  // the spheres, each its kanji
  SPHERES.forEach((s, n) => set(spheres[n].x, spheres[n].y, { ch: s.glyph, a: 1, red: n === 9 }));
  // and one of us on the horizon
  set(2, horizon, { ch: "人", a: 1, red: true });
  return grid;
}

const plate = treePlate();

export default async function Image() {
  const { jp, display, fonts } = await ogFonts(`aen核詠星読${glyphsOf(plate)}`);

  return new ImageResponse(
    (
      <div style={{ backgroundColor: C.void, color: C.bone, display: "flex", fontFamily: "JetBrains Mono", height: "100%", position: "relative", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 84, width: 680 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
            <div style={{ backgroundColor: C.red, display: "flex", height: 12, width: 12 }} />
            <span style={{ color: C.faint, fontSize: 18, letterSpacing: 5 }}>AAEN STUDIOS</span>
          </div>
          <div style={{ display: "flex", fontFamily: display, fontSize: 240, fontWeight: 900, letterSpacing: 4, lineHeight: 1, marginTop: 6 }}>
            aaen
          </div>
          <div style={{ color: C.dim, display: "flex", fontSize: 18, letterSpacing: 7, marginTop: 18 }}>
            SOFTWARE STUDIO · AAENZ.NO
          </div>
          <div style={{ backgroundColor: C.red, display: "flex", height: 1, marginTop: 30, width: 140 }} />
          <div style={{ color: C.faint, display: "flex", fontFamily: display, fontSize: 17, gap: 18, letterSpacing: 3, marginTop: 26 }}>
            {jp ? "核 KERN · 詠 GALDR · 星 STELLAR · 読 YOMION" : "KERN · GALDR · STELLAR · YOMION"}
          </div>
        </div>
        {jp ? (
          <div style={{ display: "flex", position: "absolute", right: 64, top: 39 }}>
            <Grid font={display} grid={plate} size={24} />
          </div>
        ) : null}
      </div>
    ),
    { ...size, fonts },
  );
}
