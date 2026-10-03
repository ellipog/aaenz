import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * The share card, drawn at build with the site's own two faces: paper #f3f1ec,
 * ink #101010, the red seal, the wordmark — the same plate the hero prints.
 *
 * The TTFs under `app/fonts/` are here because Satori (behind `next/og`) reads neither
 * the woff2 files the live page loads from Google nor the variable originals: these are
 * the static instances, pulled once. Per-family OFL licences sit beside them, as the
 * licence requires.
 */

export const alt = "aaen studios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [serif, mono] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/CormorantGaramond.ttf")),
    readFile(join(process.cwd(), "app/fonts/JetBrainsMono.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#f3f1ec",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Cormorant Garamond",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid #d4d0c7",
            bottom: 40,
            left: 40,
            position: "absolute",
            right: 40,
            top: 40,
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 16,
            left: 64,
            position: "absolute",
            top: 64,
          }}
        >
          <div style={{ backgroundColor: "#b31212", height: 14, width: 14 }} />
          <span
            style={{ color: "#8b8880", fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: 5 }}
          >
            SOFTWARE STUDIO
          </span>
        </div>
        <div style={{ color: "#101010", display: "flex", fontSize: 300, fontWeight: 300, letterSpacing: 14, lineHeight: 1 }}>
          aaen
        </div>
        <div
          style={{
            color: "#101010",
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            letterSpacing: 10,
            marginTop: 16,
          }}
        >
          AAEN STUDIOS
        </div>
        <div style={{ backgroundColor: "#b31212", display: "flex", height: 1, marginTop: 28, width: 132 }} />
        <div
          style={{
            color: "#8b8880",
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            letterSpacing: 4,
            marginTop: 28,
          }}
        >
          KERN · GALDR · YOMION — AAENZ.NO
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { data: serif, name: "Cormorant Garamond", style: "normal", weight: 300 },
        { data: mono, name: "JetBrains Mono", style: "normal", weight: 400 },
      ],
    }
  );
}
