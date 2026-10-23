import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * The share card, drawn at build as an episode title card: void ground, the wordmark
 * in heavy Mincho, a small character plate of light rays at the right.
 *
 * Satori (behind `next/og`) needs TTF/OTF data. JetBrains Mono is the static TTF kept
 * in `app/fonts/` with its OFL licence. Noto Serif JP is far too large to keep whole,
 * so the build asks Google Fonts for a subset holding exactly the characters drawn
 * here (a non-browser request is answered with TTF). If that request fails the card
 * still builds, Latin-only, rather than breaking the build.
 */

export const alt = "aaen studios — 第壱話, the studio awakens";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VOID = "#050505";
const BONE = "#ece7db";
const DIM = "#a39d90";
const FAINT = "#67625a";
const RED = "#e3271d";

// The plate: rays fanning up from one point, each cell the stroke that follows it.
const COLS = 15;
const ROWS = 13;
function rayPlate(): { ch: string; a: number; red?: boolean }[][] {
  const ox = 7;
  const oy = 11.5;
  const rows = [];
  for (let y = 0; y < ROWS; y++) {
    const row = [];
    for (let x = 0; x < COLS; x++) {
      const dx = x - ox;
      const dy = y - oy;
      const d = Math.hypot(dx, dy);
      if (x === ox && y === 12) {
        row.push({ ch: "人", a: 1, red: true });
        continue;
      }
      if (dy > 0.5) {
        row.push({ ch: "ー", a: 0.35 });
        continue;
      }
      const th = Math.atan2(dy, dx);
      const k = Math.round(((th + Math.PI) / Math.PI) * 18);
      const on = k % 3 !== 1;
      if (d < 2.2) row.push({ ch: "光", a: 1 });
      else if (!on) row.push({ ch: "・", a: 0.18 });
      else {
        let a = th % Math.PI;
        if (a < 0) a += Math.PI;
        const o = Math.PI / 8;
        const ch = a < o || a >= 7 * o ? "ー" : a < 3 * o ? "ヽ" : a < 5 * o ? "｜" : "ノ";
        row.push({ ch: d < 5 && k % 3 === 0 ? "翼" : ch, a: Math.max(0.25, 1 - d / 15) });
      }
    }
    rows.push(row);
  }
  return rows;
}

const plate = rayPlate();
const jpText = `aen第壱話核詠基律読${plate.flat().map((c) => c.ch).join("")}`;

async function loadNoto(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@${weight}&text=${encodeURIComponent(
          [...new Set(jpText)].join(""),
        )}`,
      )
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [mono, mincho] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/JetBrainsMono.ttf")),
    loadNoto(900),
  ]);
  const jp = mincho !== null;
  const display = jp ? "Noto Serif JP" : "JetBrains Mono";

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: VOID,
          color: BONE,
          display: "flex",
          fontFamily: "JetBrains Mono",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 84, width: 700 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
            <div style={{ backgroundColor: RED, display: "flex", height: 12, width: 12 }} />
            <span style={{ color: jp ? RED : FAINT, fontFamily: display, fontSize: jp ? 26 : 18, letterSpacing: jp ? 8 : 5 }}>
              {jp ? "第壱話" : "EPISODE:01"}
            </span>
          </div>
          <div style={{ display: "flex", fontFamily: display, fontSize: 250, fontWeight: 900, letterSpacing: 4, lineHeight: 1, marginTop: 6 }}>
            aaen
          </div>
          <div style={{ color: DIM, display: "flex", fontSize: 18, letterSpacing: 7, marginTop: 18 }}>
            SOFTWARE STUDIO · AAENZ.NO
          </div>
          <div style={{ backgroundColor: RED, display: "flex", height: 1, marginTop: 30, width: 140 }} />
          <div style={{ color: FAINT, display: "flex", fontFamily: display, fontSize: 17, gap: 18, letterSpacing: 3, marginTop: 26 }}>
            {jp ? "核 KERN · 詠 GALDR · 基 ARMATURE · 律 TENET · 読 YOMION" : "KERN · GALDR · ARMATURE · TENET · YOMION"}
          </div>
        </div>

        {jp ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: display,
              fontSize: 26,
              lineHeight: 1,
              position: "absolute",
              right: 96,
              top: 150,
            }}
          >
            {plate.map((row, y) => (
              <div key={y} style={{ display: "flex" }}>
                {row.map((c, x) => (
                  <span
                    key={x}
                    style={{ color: c.red ? RED : BONE, display: "flex", height: 28, justifyContent: "center", opacity: c.a, width: 26 }}
                  >
                    {c.ch}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ) : null}

      </div>
    ),
    {
      ...size,
      fonts: [
        { data: mono, name: "JetBrains Mono", style: "normal", weight: 400 },
        ...(mincho ? [{ data: mincho, name: "Noto Serif JP", style: "normal" as const, weight: 900 as const }] : []),
      ],
    },
  );
}
