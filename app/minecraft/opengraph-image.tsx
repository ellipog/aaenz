import { ImageResponse } from "next/og";
import { suite } from "@/lib/mods";
import { C, type Cell, Grid, OG_SIZE, glyphsOf, ogFonts } from "@/lib/og";

/*
 * The Minecraft page's share card: its title card over a strip of the block
 * world in cross-section, every block its kanji, one red figure on the grass,
 * and the suite named in the corner.
 */

export const alt = "Stellar by aaen studios — the load-bearing parts";
export const size = OG_SIZE;
export const contentType = "image/png";

const COLS = 44;
const ROWS = 11;
const TITLE = "The load-bearing parts.";

function worldStrip(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
  const surface = Array.from({ length: COLS }, (_, x) => {
    const lake = x < 8 ? 7 : 0;
    return Math.max(2, Math.min(8, lake || Math.round(4.5 + 1.8 * Math.sin(x * 0.24) + 1.1 * Math.sin(x * 0.61 + 1))));
  });
  const sea = 6;
  for (let x = 0; x < COLS; x++) {
    const s = surface[x];
    for (let y = 0; y < ROWS; y++) {
      const ore = (x * 31 + y * 17) % 29;
      let c: Cell = null;
      if (y === ROWS - 1) c = { ch: "盤", a: 0.62 };
      else if (y > s + 2) c = ore === 0 ? { ch: "鉄", a: 0.82 } : ore === 7 ? { ch: "炭", a: 0.75 } : ore === 13 && y > 8 ? { ch: "金", a: 0.9 } : { ch: "石", a: 0.3 };
      else if (y > s) c = s >= sea && y > s + 1 ? { ch: "石", a: 0.3 } : { ch: s >= sea ? "砂" : "土", a: 0.55 };
      else if (y === s) c = { ch: s >= sea ? "砂" : "草", a: 0.95 };
      else if (y >= sea) c = { ch: y === sea ? "〜" : "水", a: y === sea ? 0.8 : 0.4 };
      grid[y][x] = c;
    }
  }
  // trees on the higher ground
  for (const x of [15, 28, 37]) {
    const s = surface[x];
    grid[s - 1][x] = { ch: "木", a: 0.7 };
    grid[s - 2][x] = { ch: "木", a: 0.7 };
    for (const [dx, dy] of [[-1, -3], [0, -3], [1, -3], [-1, -2], [1, -2], [0, -4]]) {
      if (s + dy >= 0) grid[s + dy][x + dx] = { ch: "葉", a: 0.6 };
    }
  }
  // the walker, and the sun
  grid[surface[22] - 1][22] = { ch: "人", a: 1, red: true };
  grid[0][41] = { ch: "日", a: 1 };
  grid[1][3] = { ch: "〜", a: 0.25 };
  grid[1][4] = { ch: "〜", a: 0.25 };
  return grid;
}

const strip = worldStrip();

export default async function Image() {
  const { jp, display, fonts } = await ogFonts(`${TITLE}星${glyphsOf(strip)}`);

  return new ImageResponse(
    (
      <div style={{ backgroundColor: C.void, color: C.bone, display: "flex", fontFamily: "JetBrains Mono", height: "100%", position: "relative", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", left: 84, position: "absolute", top: 64 }}>
          <span style={{ color: C.faint, fontSize: 18, letterSpacing: 5 }}>MINECRAFT · AAEN STUDIOS</span>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: display, fontSize: 92, fontWeight: 900, lineHeight: 0.98, marginTop: 18 }}>
            <div style={{ display: "flex" }}>
              The <span style={{ color: C.red, marginLeft: 26 }}>load-bearing</span>
            </div>
            <div style={{ display: "flex", paddingLeft: 116 }}>parts.</div>
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: 14, left: 200, position: "absolute", top: 296 }}>
          {jp ? <span style={{ color: C.red, fontFamily: display, fontSize: 22 }}>星</span> : null}
          <span style={{ color: C.dim, fontSize: 17, letterSpacing: 5 }}>
            STELLAR · {suite.map((m) => m.name.toUpperCase()).join(" · ")}
          </span>
          <span style={{ color: C.faint, fontSize: 15, letterSpacing: 4 }}>· RELEASED AS ELLIPOG</span>
        </div>
        {jp ? (
          <div style={{ bottom: 6, display: "flex", left: 6, position: "absolute" }}>
            <Grid font={display} grid={strip} size={27} />
          </div>
        ) : null}
      </div>
    ),
    { ...size, fonts },
  );
}
