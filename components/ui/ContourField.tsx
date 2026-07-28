"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  generateHeightmap,
  marchingSquares,
  findValleyPath,
  findPeaks,
  type Point,
} from "@/lib/terrain";

type Props = {
  /** Optional fixed seed (overrides the per-load random seed). */
  seed?: string;
  /** Number of contour levels to draw. */
  levels?: number;
  /** Grid resolution. Higher = smoother but slower. */
  resolution?: number;
  /** Opacity of the whole field (0–1). */
  opacity?: number;
  /** Show animated footsteps following the valley path. */
  showFootsteps?: boolean;
  /** Show summit markers + elevation labels. */
  showPeaks?: boolean;
  /** SVG viewBox dimensions. */
  width?: number;
  height?: number;
  className?: string;
};

/**
 * ContourField — a procedurally-generated topographic contour map.
 *
 * Generates a heightmap from value-noise (fBm), extracts contour lines via
 * marching squares, and optionally overlays animated surveyor's bootprints
 * that follow the lowest route (valleys) across the terrain.
 *
 * A new random seed is rolled on every page load (after mount, to avoid
 * hydration mismatches), so each visit shows fresh terrain.
 *
 * Respects prefers-reduced-motion: footsteps render statically.
 */
export function ContourField({
  seed: fixedSeed,
  levels = 7,
  resolution = 96,
  opacity = 1,
  showFootsteps = false,
  showPeaks = true,
  width = 400,
  height = 400,
  className,
}: Props) {
  const reduce = useReducedMotion();
  // SSR + first client render use a stable fallback seed (no hydration gap).
  const [seed, setSeed] = useState(fixedSeed ?? "aaen-default-terrain");

  // After mount, roll a random seed unless one was fixed.
  useEffect(() => {
    if (!fixedSeed) {
      setSeed(
        Math.random().toString(36).slice(2) + Date.now().toString(36),
      );
    }
  }, [fixedSeed]);

  // Generate terrain from the current seed.
  const { heightmap, contourPaths, valleyPath, peaks } = useMemo(() => {
    const hm = generateHeightmap(seed, resolution);
    // Evenly spaced contour levels between 0.08 and 0.92 (skip extremes
    // so we don't get a single tiny ring or a border-hugging line).
    const paths: { d: string; level: number }[] = [];
    for (let i = 0; i < levels; i++) {
      const t = 0.08 + (0.84 * (i + 0.5)) / levels;
      const lines = marchingSquares(hm, resolution, t, width, height);
      for (const d of lines) {
        paths.push({ d, level: i });
      }
    }
    const vp = showFootsteps
      ? findValleyPath(hm, resolution, width, height)
      : null;
    const pk = showPeaks
      ? findPeaks(hm, resolution, 3, width, height)
      : [];
    return { heightmap: hm, contourPaths: paths, valleyPath: vp, peaks: pk };
  }, [seed, resolution, levels, width, height, showFootsteps, showPeaks]);

  // Distribute footprints along the valley path.
  // Each footprint sits slightly off-center (alternating left/right, like a
  // real stride) and is oriented along the direction of travel.
  const footprints = useMemo(() => {
    if (!valleyPath || valleyPath.length < 2) return [];
    const spaced: { pt: Point; rot: number }[] = [];
    const targetCount = 6;
    const totalLen = pathLength(valleyPath);
    const step = totalLen / (targetCount + 1);
    // How far each footprint sits off the centerline (alternating).
    const strideOffset = 6;

    let accumulated = 0;
    let nextAt = step;
    let foot = 0; // alternates 0 (right), 1 (left)

    for (let i = 1; i < valleyPath.length; i++) {
      const a = valleyPath[i - 1];
      const b = valleyPath[i];
      const segLen = Math.hypot(b.x - a.x, b.y - a.y);
      if (segLen < 1e-6) continue;
      while (accumulated + segLen >= nextAt && spaced.length < targetCount) {
        const t = (nextAt - accumulated) / segLen;
        // Center point on the path.
        const cx = a.x + (b.x - a.x) * t;
        const cy = a.y + (b.y - a.y) * t;
        // Travel direction in degrees (atan2: 0=east, 90=south in SVG).
        const travelDeg = angle(a, b);
        // Perpendicular to travel; alternate sides each step.
        const side = foot % 2 === 0 ? 1 : -1;
        const perpRad = ((travelDeg + 90) * Math.PI) / 180;
        const offX = Math.cos(perpRad) * strideOffset * side;
        const offY = Math.sin(perpRad) * strideOffset * side;
        // The footprint SVG path is drawn pointing UP (negative Y = up).
        // atan2 travel angle: 0°=east, 90°=south. To make the footprint's
        // "up" point along the travel direction, add 90°.
        spaced.push({
          pt: { x: cx + offX, y: cy + offY },
          rot: travelDeg + 90,
        });
        nextAt += step;
        foot++;
      }
      accumulated += segLen;
    }
    return spaced;
  }, [valleyPath]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ opacity }}
      aria-hidden
      role="presentation"
    >
      {/* Paper fill so the field is self-contained. */}
      <rect width={width} height={height} fill="var(--color-paper-deep)" />

      {/* Contour lines — each level fades toward the outer (lower) rings. */}
      {contourPaths.map((p, i) => {
        // Inner levels (high elevation) are darker; outer are fainter.
        const levelOpacity = 0.55 * Math.pow(0.78, levels - 1 - p.level);
        return (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke="var(--color-moss)"
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={levelOpacity}
          />
        );
      })}

      {/* Summit markers + elevation labels. */}
      {peaks.map((peak, i) => {
        // Derive an elevation from the heightmap value at the peak.
        const px = Math.floor((peak.x / width) * resolution);
        const py = Math.floor((peak.y / height) * resolution);
        const h = heightmap[py * resolution + px] ?? 0;
        const elevation = Math.round(400 + h * 1900);
        return (
          <g key={`peak-${i}`}>
            <g
              transform={`translate(${peak.x} ${peak.y})`}
              stroke="var(--color-ochre)"
              strokeWidth={1.2}
              opacity={0.8}
            >
              <path d="M-5 0 L5 0 M0 -5 L0 5" />
            </g>
            <text
              x={peak.x + 7}
              y={peak.y - 5}
              fontFamily="var(--font-mono), monospace"
              fontSize={9}
              fill="var(--color-moss)"
              opacity={0.6}
              letterSpacing={0.5}
            >
              ▲ {elevation}m
            </text>
          </g>
        );
      })}

      {/* Valley path + animated footprints. */}
      {showFootsteps && valleyPath && valleyPath.length > 1 && (
        <>
          {/* The dashed surveyor's trail (smooth curve). */}
          <motion.path
            d={toSmoothPathData(valleyPath)}
            fill="none"
            stroke="var(--color-moss)"
            strokeWidth={1.5}
            strokeDasharray="3 5"
            strokeLinecap="round"
            opacity={0.5}
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Bootprints appearing along the trail.
              Each is a single footprint shape, rotated to point in the
              direction of travel and offset alternately left/right of the
              centerline (like a real stride). */}
          {footprints.map((fp, i) => (
            <motion.path
              key={`fp-${i}`}
              d="M 0 -7 C 2.4 -7 3.2 -3 3.2 1 C 3.2 4 1.6 5.5 0 5.5 C -1.6 5.5 -3.2 4 -3.2 1 C -3.2 -3 -2.4 -7 0 -7 Z"
              transform={`translate(${fp.pt.x.toFixed(1)} ${fp.pt.y.toFixed(1)}) rotate(${fp.rot.toFixed(1)})`}
              fill="var(--color-ink)"
              initial={reduce ? undefined : { opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{
                duration: 0.4,
                delay: reduce ? 0 : 0.4 + i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Final waypoint marker at the end of the trail. */}
          {(() => {
            const end = valleyPath[valleyPath.length - 1];
            return (
              <motion.g
                transform={`translate(${end.x} ${end.y})`}
                initial={reduce ? undefined : { opacity: 0, scale: 0 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : 0.4 + footprints.length * 0.3 + 0.2,
                }}
              >
                <circle
                  r={6}
                  fill="none"
                  stroke="var(--color-ochre)"
                  strokeWidth={1.5}
                />
                <path
                  d="M-3 0 L0 3 L3 -3"
                  fill="none"
                  stroke="var(--color-ochre)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            );
          })()}
        </>
      )}
    </svg>
  );
}

// ─── Path helpers ─────────────────────────────────────────────────────────

function pathLength(pts: Point[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len;
}

function angle(a: Point, b: Point): number {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

/**
 * Convert a polyline to a smooth SVG path using Catmull-Rom splines
 * converted to cubic Béziers. Produces natural, flowing curves instead of
 * jagged line segments.
 *
 * The path is first decimated (every Nth point kept) so the curve has fewer,
 * gentler control points — the raw valley path has ~96 grid-cell points
 * which would produce a busy, jittery curve. Lower tension (0.3) avoids
 * overshoot on sharp turns.
 */
function toSmoothPathData(pts: Point[]): string {
  if (pts.length === 0) return "";
  // Decimate: keep every ~6th point, plus always first and last.
  const decimated: Point[] = [];
  const stride = Math.max(3, Math.floor(pts.length / 14));
  for (let i = 0; i < pts.length; i += stride) decimated.push(pts[i]);
  const last = pts[pts.length - 1];
  if (decimated[decimated.length - 1] !== last) decimated.push(last);

  if (decimated.length === 1) return `M ${decimated[0].x} ${decimated[0].y}`;
  if (decimated.length === 2) {
    return `M ${decimated[0].x.toFixed(1)} ${decimated[0].y.toFixed(1)} L ${decimated[1].x.toFixed(1)} ${decimated[1].y.toFixed(1)}`;
  }

  // Catmull-Rom → Bézier with reduced tension (factor 0.3 → divide by ~3.3).
  // Standard is /6 (tension 0.5); /10 gives gentler curves, less overshoot.
  const tension = 10;
  let d = `M ${decimated[0].x.toFixed(1)} ${decimated[0].y.toFixed(1)}`;
  for (let i = 0; i < decimated.length - 1; i++) {
    const p0 = decimated[i - 1] ?? decimated[i];
    const p1 = decimated[i];
    const p2 = decimated[i + 1];
    const p3 = decimated[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / tension;
    const cp1y = p1.y + (p2.y - p0.y) / tension;
    const cp2x = p2.x - (p3.x - p1.x) / tension;
    const cp2y = p2.y - (p3.y - p1.y) / tension;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}
