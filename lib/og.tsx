import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * What the share cards have in common: the palette, the fonts, and a way to
 * set a character plate as a grid of glyphs.
 *
 * Satori (behind `next/og`) needs TTF/OTF data. JetBrains Mono is the static TTF kept
 * in `app/fonts/` with its OFL licence. Noto Serif JP is far too large to keep whole,
 * so the build asks Google Fonts for a subset holding exactly the characters drawn
 * (a non-browser request is answered with TTF). If that request fails the card still
 * builds, Latin-only, rather than breaking the build.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const C = { void: "#050505", bone: "#ece7db", dim: "#a39d90", faint: "#67625a", red: "#e3271d" };

export type Cell = { ch: string; a: number; red?: boolean } | null;

export async function ogFonts(text: string) {
  const mono = await readFile(join(process.cwd(), "app/fonts/JetBrainsMono.ttf"));
  let mincho: ArrayBuffer | null = null;
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@900&text=${encodeURIComponent([...new Set(text)].join(""))}`,
      )
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (src) {
      const res = await fetch(src[1]);
      if (res.ok) mincho = await res.arrayBuffer();
    }
  } catch {
    mincho = null;
  }
  return {
    jp: mincho !== null,
    display: mincho ? "Noto Serif JP" : "JetBrains Mono",
    fonts: [
      { data: mono, name: "JetBrains Mono", style: "normal" as const, weight: 400 as const },
      ...(mincho ? [{ data: mincho, name: "Noto Serif JP", style: "normal" as const, weight: 900 as const }] : []),
    ],
  };
}

/** The katakana stroke for a direction, y pointing down: ー, ヽ, ｜ or ノ. */
export function stroke(dx: number, dy: number) {
  let a = Math.atan2(dy, dx) % Math.PI;
  if (a < 0) a += Math.PI;
  const o = Math.PI / 8;
  return a < o || a >= 7 * o ? "ー" : a < 3 * o ? "ヽ" : a < 5 * o ? "｜" : "ノ";
}

/** Every character a grid uses, for the font subset. */
export const glyphsOf = (grid: Cell[][]) => grid.flat().map((c) => c?.ch ?? "").join("");

export function Grid({ grid, size, font }: { grid: Cell[][]; size: number; font: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: font, fontSize: size * 0.92, lineHeight: 1 }}>
      {grid.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.map((c, x) => (
            <span
              key={x}
              style={{
                color: c?.red ? C.red : C.bone,
                display: "flex",
                height: size,
                justifyContent: "center",
                opacity: c ? c.a : 0,
                width: size,
              }}
            >
              {c?.ch ?? ""}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
