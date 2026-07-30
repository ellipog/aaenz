"use client";

import { useMemo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from "motion/react";

type Props = {
  /** Variation seed — give each divider a distinct ridge. */
  seed?: number;
  /**
   * The UPPER section's colour (what sits above the seam), as an exact CSS
   * colour. Pass the section's *rendered* background — including translucent
   * blends via `color-mix(...)`, since `bg-paper-deep/30` renders as a mix,
   * not solid `--color-paper-deep`.
   */
  bg?: string;
  /**
   * The LOWER section's colour. The wedge fills with this so the colour
   * boundary climbs the wave. Omit (or set equal to `bg`) on a same-colour
   * seam → crest only, no fill (avoids a phantom wave edge).
   */
  fill?: string;
  /** Stroke tone for the ridge crest line. */
  tone?: "moss" | "paper" | "ochre";
  /** viewBox width. */
  width?: number;
  /** Divider height in px (amplitude scales with it). */
  height?: number;
  className?: string;
};

/**
 * Ridgeline — the land between two sections, rendered as the colour boundary
 * itself. The box paints the upper section's colour; a filled wedge (the
 * lower section's colour) climbs the wave so the colour *follows the ridge*
 * instead of cutting straight. On a same-colour seam the wedge is dropped and
 * only the contour crest draws. A whisper of cursor parallax.
 * SVG + motion (a dozen WebGL contexts for these would be waste).
 *
 * Reduced motion → renders the full ridge statically.
 */
export function Ridgeline({
  seed = 1,
  bg = "var(--color-paper)",
  fill,
  tone = "moss",
  width = 1200,
  height = 22,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const parallax = useSpring(px, { stiffness: 60, damping: 18, mass: 0.4 });
  const xShift = useTransform(parallax, (v) => (v - 0.5) * width * 0.024);

  const crest = useMemo(() => buildCrest(seed, width, height), [seed, width, height]);
  // Closed wedge: across the top along the ridge, back across the bottom.
  const wedge = useMemo(() => `${crest} L ${width} ${height} L 0 ${height} Z`, [crest, width, height]);

  const stroke =
    tone === "paper"
      ? "var(--color-paper)"
      : tone === "ochre"
        ? "var(--color-ochre)"
        : "var(--color-stone-soft)";
  // Only paint the wedge when the two sides actually differ; otherwise this is
  // a same-colour seam and a fill would produce a phantom straight edge.
  const fillCss = fill && fill !== bg ? fill : "transparent";
  const lineOpacity = tone === "paper" ? 0.4 : tone === "ochre" ? 0.7 : 0.5;

  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ height, background: bg }}
      aria-hidden
      onPointerMove={reduce ? undefined : (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
      }}
      onPointerLeave={reduce ? undefined : () => px.set(0.5)}
    >
      <motion.svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ x: reduce ? 0 : xShift }}
      >
        {/* The coloured wedge — the lower section's colour climbing the wave. */}
        {fillCss !== "transparent" && (
          <motion.path
            d={wedge}
            fill={fillCss}
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
        {/* The contour crest drawn over the wedge edge. */}
        <motion.path
          d={crest}
          fill="none"
          stroke={stroke}
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1, opacity: lineOpacity }}
          animate={reduce ? { opacity: lineOpacity } : undefined}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            pathLength: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.4 },
          }}
        />
      </motion.svg>
    </div>
  );
}

/**
 * A deterministic elevation profile (seeded fBm of sines) → a smooth
 * Catmull-Rom path running along the top of the band. Pure → SSR/client match.
 */
function buildCrest(seed: number, width: number, height: number): string {
  const N = 64;
  const pts: [number, number][] = [];
  const rnd = mulberry32(seed * 2654435761);
  const octs = [
    { f: 2.0 + rnd() * 1.5, a: 0.55, p: rnd() * Math.PI * 2 },
    { f: 5.0 + rnd() * 2.0, a: 0.28, p: rnd() * Math.PI * 2 },
    { f: 11.0 + rnd() * 3.0, a: 0.14, p: rnd() * Math.PI * 2 },
    { f: 23.0 + rnd() * 4.0, a: 0.06, p: rnd() * Math.PI * 2 },
  ];
  let min = Infinity;
  let max = -Infinity;
  const raw: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    let v = 0;
    for (const o of octs) v += Math.sin(t * o.f * Math.PI + o.p) * o.a;
    raw.push(v);
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  const amp = height - 6;
  const baseline = height - 3;
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * width;
    const y = baseline - ((raw[i] - min) / range) * amp;
    pts.push([x, y]);
  }
  return catmullRom(pts);
}

function catmullRom(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
