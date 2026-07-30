"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  generateHeightmap,
  findValleyPathDetailed,
  findPeaks,
} from "@/lib/terrain";
import { ContourField } from "./ContourField";

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
  /** Terrain coordinate space (the overlay uses the same space). */
  width?: number;
  height?: number;
  className?: string;
};

/**
 * ContourFieldGL — the GPU-rendered topographic relief map.
 *
 * Same terrain seed as ContourField, but the whole map — relief, contours,
 * the valley trail, the surveyor's footprints, the waypoint and the summit
 * crosses — is drawn in a single WebGL2 fragment shader. The height field is
 * sampled bicubically so the contours are smooth flowing curves, and the
 * trail/footprints are signed-distance fields that genuinely press into the
 * hillshade. A survey-style sweep charts the map from the valleys up on
 * mount. The light is fixed (no cursor tracking).
 *
 * Only the tiny elevation labels live in the DOM (GL can't render type);
 * they're positioned to match the shader's slice transform exactly.
 *
 * Falls back to the plain-SVG ContourField when WebGL2 is unavailable.
 * Respects prefers-reduced-motion: renders a single static frame.
 */
export function ContourFieldGL({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<ContourRenderer | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

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

  // Generate terrain + a detailed valley route + footprints (all in the same
  // [0,width]×[0,height] space; feet/path are also exposed in unit space for
  // the shader).
  const terrain = useMemo(() => {
    const hm = generateHeightmap(seed, resolution);
    const pk = showPeaks ? findPeaks(hm, resolution, 3, width, height) : [];
    const path = showFootsteps
      ? findValleyPathDetailed(seed, width, height)
      : [];

    // Footprints distributed by arc-length with an alternating stride, in
    // unit space, oriented along travel (screen-space angle, y-down).
    const feet: { x: number; y: number; rot: number }[] = [];
    if (path.length > 1) {
      const u = path.map((p) => ({ x: p.x / width, y: p.y / height }));
      const seg: number[] = [];
      let total = 0;
      for (let i = 1; i < u.length; i++) {
        const d = Math.hypot(u[i].x - u[i - 1].x, u[i].y - u[i - 1].y);
        seg.push(d);
        total += d;
      }
      const count = 6;
      const step = total / (count + 1);
      const stride = 0.016;
      let acc = 0;
      let next = step;
      let j = 0;
      let foot = 0;
      while (j < seg.length && feet.length < count) {
        while (j < seg.length && acc + seg[j] < next) {
          acc += seg[j];
          j++;
        }
        if (j >= seg.length) break;
        const t = seg[j] > 1e-9 ? (next - acc) / seg[j] : 0;
        const a = u[j];
        const b = u[j + 1];
        const cx = a.x + (b.x - a.x) * t;
        const cy = a.y + (b.y - a.y) * t;
        const travel = Math.atan2(b.y - a.y, b.x - a.x);
        const side = foot % 2 === 0 ? 1 : -1;
        feet.push({
          x: cx + Math.cos(travel + Math.PI / 2) * stride * side,
          y: cy + Math.sin(travel + Math.PI / 2) * stride * side,
          rot: travel,
        });
        next += step;
        foot++;
      }
    }

    const pathPts = path.map((p) => [p.x / width, p.y / height] as [number, number]);
    return { hm, pk, feet, pathPts };
  }, [seed, resolution, width, height, showFootsteps, showPeaks]);

  const { hm: heightmap, pk: peaks, feet: feetUnit, pathPts } = terrain;

  // Peak labels: elevation + height (for stagger) + unit position (for the
  // shader crosshair and the DOM text placement).
  const peakMeta = useMemo(
    () =>
      peaks.map((peak) => {
        const px = Math.floor((peak.x / width) * resolution);
        const py = Math.floor((peak.y / height) * resolution);
        const h = heightmap[py * resolution + px] ?? 0;
        return {
          ux: peak.x / width,
          uy: peak.y / height,
          h,
          elevation: Math.round(400 + h * 1900),
        };
      }),
    [peaks, heightmap, width, height, resolution],
  );

  // DOM elevation labels are positioned in CSS px to match the shader's
  // slice transform; recomputed on resize.
  const [labelPos, setLabelPos] = useState<{ left: number; top: number }[]>(
    [],
  );

  // Keep the canvas backing store matched to its on-screen size × dpr, and
  // reposition the DOM labels with the same cover transform as the shader.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || webglFailed) return;

    const sync = () => {
      const canvas = canvasRef.current;
      const rect = container.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(W * dpr));
        const h = Math.max(1, Math.round(H * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      }
      const aspect = W / H || 1;
      const coverX = aspect >= 1 ? 1 : aspect;
      const coverY = aspect >= 1 ? 1 / aspect : 1;
      setLabelPos(
        peakMeta.map((p) => ({
          left: W * ((p.ux - 0.5) * coverX + 0.5),
          top: H * ((p.uy - 0.5) * coverY + 0.5),
        })),
      );
      rendererRef.current?.renderFrame();
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(container);
    return () => ro.disconnect();
  }, [webglFailed, peakMeta]);

  // (Re)build the renderer when the terrain or settings change.
  useEffect(() => {
    if (webglFailed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: ContourRenderer;
    try {
      renderer = new ContourRenderer(canvas);
    } catch (err) {
      // Surface shader-compile / context errors so they're debuggable rather
      // than a silent drop to the SVG fallback.
      console.error("[ContourFieldGL] WebGL init failed, using SVG fallback:", err);
      setWebglFailed(true);
      return;
    }
    rendererRef.current = renderer;
    renderer.setHeightmap(heightmap, resolution);
    renderer.setLevels(levels);
    renderer.setPath(pathPts, pathPts.length);
    renderer.setMarks(feetUnit, peakMeta);

    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (rect && rect.width > 0) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }
    renderer.beginReveal();
    if (reduce) renderer.finishReveal();

    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [heightmap, resolution, levels, reduce, webglFailed, pathPts, feetUnit, peakMeta]);

  // Keep footprints/peaks in sync if they change without a full rebuild.
  useEffect(() => {
    rendererRef.current?.setMarks(feetUnit, peakMeta);
  }, [feetUnit, peakMeta]);

  // Drive the reveal / grain animation; the renderer only redraws on change.
  useEffect(() => {
    if (webglFailed) return;
    let raf = 0;
    const loop = () => {
      rendererRef.current?.tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [webglFailed]);

  if (webglFailed) {
    return (
      <ContourField
        seed={seed}
        levels={levels}
        resolution={resolution}
        opacity={opacity}
        showFootsteps={showFootsteps}
        showPeaks={showPeaks}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Elevation labels only — the crosshairs live in the shader. Positioned
          in CSS px to match the slice transform, fading in as the survey
          sweep reaches each summit's altitude. */}
      {showPeaks &&
        peakMeta.map((peak, i) => {
          const pos = labelPos[i];
          if (!pos) return null;
          return (
            <motion.span
              key={`lbl-${i}`}
              initial={reduce ? undefined : { opacity: 0 }}
              animate={{ opacity: 0.72 }}
              transition={{
                duration: 0.5,
                delay: reduce ? 0 : 0.3 + peak.h * 1.9,
              }}
              className="pointer-events-none absolute select-none font-mono text-[9px] tracking-[0.04em] text-moss"
              style={{
                left: pos.left + 7,
                top: pos.top - 11,
                whiteSpace: "nowrap",
              }}
            >
              ▲ {peak.elevation}m
            </motion.span>
          );
        })}
    </div>
  );
}

// ─── WebGL renderer ────────────────────────────────────────────────────────

const VERT_SRC = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uHeight;     // heightmap, values in [0,1]
uniform sampler2D uPath;       // RG = unit-space trail polyline, one texel/point
uniform float uRes;            // heightmap grid resolution
uniform float uPathN;          // number of trail points in uPath
uniform vec2 uCover;           // "slice" crop so square terrain fills the canvas
uniform float uLevels;         // contour line count
uniform float uBands;          // elevation band count
uniform float uReveal;         // 0..1 survey sweep
uniform vec3 uLightDir;        // normalized; xy across the map, z up (fixed)
uniform float uTime;           // seconds, for grain drift
uniform float uAspect;         // canvas width / height
uniform vec4 uFoot[7];         // xy = unit-space centre, z = travel angle (rad), w = enable
uniform int  uFootN;
uniform vec4 uPeak[4];         // xy = unit-space centre, z = enable, w unused

// Brand palette (globals.css tokens), linear-ish.
const vec3 PAPER = vec3(0.906, 0.871, 0.804);
const vec3 PAPER_DEEP = vec3(0.863, 0.827, 0.745);
const vec3 MOSS = vec3(0.227, 0.353, 0.243);
const vec3 MOSS_DEEP = vec3(0.141, 0.251, 0.157);
const vec3 STONE = vec3(0.541, 0.529, 0.447);
const vec3 INK = vec3(0.165, 0.200, 0.153);
const vec3 OCHRE = vec3(0.784, 0.471, 0.165);

// Catmull-Rom cubic weight.
float crw(float t) {
  float a = abs(t);
  float a2 = a * a;
  float a3 = a2 * a;
  if (a <= 1.0) return 1.5 * a3 - 2.5 * a2 + 1.0;
  return -0.5 * a3 + 2.5 * a2 - 4.0 * a + 2.0;
}

// Bicubic (Catmull-Rom) sample of the height field — C1 continuous, so the
// contour lines and hillshade come out smooth instead of texel-stepped.
float heightBicubic(vec2 uv) {
  vec2 tsize = vec2(uRes);
  vec2 coord = uv * tsize - 0.5;
  vec2 i0 = floor(coord);
  vec2 f = coord - i0;
  float s = 0.0;
  for (int y = -1; y <= 2; y++) {
    float wy = crw(f.y - float(y));
    for (int x = -1; x <= 2; x++) {
      float wx = crw(f.x - float(x));
      vec2 p = (i0 + vec2(float(x), float(y)) + 0.5) / tsize;
      s += wx * wy * texture(uHeight, p).r;
    }
  }
  return s;
}

// Analytic gradient of the bicubic field (continuous → smooth normals).
vec2 heightGradient(vec2 uv) {
  vec2 tsize = vec2(uRes);
  vec2 coord = uv * tsize - 0.5;
  vec2 i0 = floor(coord);
  vec2 f = coord - i0;
  vec2 g = vec2(0.0);
  for (int y = -1; y <= 2; y++) {
    float wy = crw(f.y - float(y));
    float dy = 0.0;
    float ay = abs(f.y - float(y));
    float ay2 = ay * ay;
    if (ay <= 1.0) dy = sign(f.y - float(y)) * (4.5 * ay2 - 5.0 * ay);
    else dy = sign(f.y - float(y)) * (-1.5 * ay2 + 5.0 * ay - 4.0);
    for (int x = -1; x <= 2; x++) {
      float wx = crw(f.x - float(x));
      float dx = 0.0;
      float ax = abs(f.x - float(x));
      float ax2 = ax * ax;
      if (ax <= 1.0) dx = sign(f.x - float(x)) * (4.5 * ax2 - 5.0 * ax);
      else dx = sign(f.x - float(x)) * (-1.5 * ax2 + 5.0 * ax - 4.0);
      vec2 p = (i0 + vec2(float(x), float(y)) + 0.5) / tsize;
      float h = texture(uHeight, p).r;
      g += vec2(dx * wy, wx * dy) * h;
    }
  }
  return g; // per-texel; main() scales to per-uv
}

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// A polyline is stored in unit space (uPath); convert to the same screen-
// fraction space as vUv so distances are isotropic in pixels.
vec2 unitToVUv(vec2 u) { return (u - 0.5) * uCover + 0.5; }

// Distance from point p (in vUv space) to segment a→b (vUv space), in vUv.
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-7), 0.0, 1.0);
  return length(pa - ba * t);
}

// Closest distance to the trail polyline, plus the arc-param (0..1) of the
// nearest point (used to reveal the trail progressively).
vec2 trailDistance(vec2 pVUv) {
  float best = 1e6;
  float bestT = 0.0;
  int N = int(uPathN);
  vec2 prev = unitToVUv(texture(uPath, vec2(0.5 / uPathN, 0.5)).rg);
  for (int i = 1; i < 512; i++) {
    if (i >= N) break;
    vec2 cur = unitToVUv(texture(uPath, vec2((float(i) + 0.5) / uPathN, 0.5)).rg);
    float d = segDist(pVUv, prev, cur);
    if (d < best) { best = d; bestT = float(i) / uPathN; }
    prev = cur;
  }
  return vec2(best, bestT);
}

void main() {
  // "xMidYMid slice" — square terrain covering the canvas, cropped.
  vec2 tuv = (vUv - 0.5) * uCover + 0.5;
  vec2 border = smoothstep(0.0, 0.03, tuv) * (1.0 - smoothstep(0.97, 1.0, tuv));
  tuv = clamp(tuv, 0.002, 0.998);
  float edgeFade = border.x * border.y;

  float h = heightBicubic(tuv);

  // Elevation bands ("steps") + a soft hypsometric tint for depth.
  float bands = uBands;
  float hb = floor(h * bands) / bands;
  float bandFrac = fract(h * bands);
  vec3 col = mix(PAPER_DEEP, mix(PAPER, STONE, 0.18), hb);
  col = mix(col, mix(PAPER_DEEP, STONE, 0.5), smoothstep(0.25, 0.95, h) * 0.12);
  float seam = smoothstep(0.08, 0.0, min(bandFrac, 1.0 - bandFrac));
  col = mix(col, MOSS_DEEP, seam * 0.05);

  // Hillshade from the analytic gradient (continuous → no faceting).
  vec2 grad = heightGradient(tuv) * uRes; // now per-uv
  const float RELIEF = 0.17;
  vec3 normal = normalize(vec3(-grad.x * RELIEF, grad.y * RELIEF, 1.0));
  float lambert = clamp(dot(normal, uLightDir), 0.0, 1.0);
  float shade = 0.82 + 0.36 * lambert;
  vec3 halfv = normalize(uLightDir + vec3(0.0, 0.0, 1.0));
  float spec = pow(clamp(dot(normal, halfv), 0.0, 1.0), 28.0);
  col = col * shade + vec3(1.0) * spec * 0.045;

  // Slope darkening — steep faces read as shaded ravines (slope shading).
  float slope = clamp(length(grad) * 0.5, 0.0, 1.0);
  col = mix(col, MOSS_DEEP, slope * 0.10);

  // Contour lines — fwidth AA on the smooth field; every 3rd is an index
  // contour; weight breathes with slope so lines bunch on steep ground.
  float scaled = h * uLevels;
  float dist = abs(fract(scaled) - 0.5);
  float fw = fwidth(scaled);
  float widthMod = 1.0 + slope * 0.6;
  float lineMinor = 1.0 - smoothstep(0.5 * fw * widthMod, 1.4 * fw * widthMod, dist);
  float lineMajor = 1.0 - smoothstep(0.8 * fw * widthMod, 2.2 * fw * widthMod, dist);
  float level = scaled - 0.5;
  float major = 1.0 - step(0.5, abs(fract(level / 3.0) - 0.5));
  float fade = 0.4 + 0.6 * clamp(level / uLevels, 0.0, 1.0);
  vec3 lineCol = mix(MOSS, MOSS_DEEP, major * 0.6);
  float lineA = max(lineMinor * 0.40, lineMajor * 0.62) * fade;
  col = mix(col, lineCol, clamp(lineA, 0.0, 1.0));

  // Paper grain + vignette.
  float grain = hash21(gl_FragCoord.xy + vec2(uTime * 4.0, -uTime * 3.0));
  col += (grain - 0.5) * 0.03;
  vec2 q = vUv - 0.5;
  col *= 1.0 - 0.09 * smoothstep(0.32, 0.85, dot(q, q) * 2.0);

  // Survey sweep — low ground charted first, wet-ink band at the frontier.
  float frontier = uReveal * 1.12;
  float revealed = 1.0 - smoothstep(frontier - 0.06, frontier + 0.02, h);
  float wetEdge = smoothstep(frontier - 0.10, frontier - 0.03, h)
                * (1.0 - smoothstep(frontier - 0.03, frontier + 0.04, h));
  col *= 1.0 - 0.12 * wetEdge;

  // ── Trail + footsteps + waypoint + summit marks (all SDF, in vUv space) ──
  // vUv maps uniformly to pixels on both axes, so fwidth(vUv.x) is exactly
  // one physical pixel expressed in vUv units — isotropic, crop-independent.
  float pix = fwidth(vUv.x);

  if (uPathN > 1.0) {
    vec2 tr = trailDistance(vUv);
    float dTrail = tr.x;
    float param = tr.y;
    // Trail drawn in only as the survey reaches it (param vs reveal of trail).
    float trailFront = smoothstep(0.0, 1.0, (uReveal - 0.35) / 0.65);
    float trailMask = step(param, trailFront);
    // Dashed surveyor's line: alternate along arc-length (approx by param).
    float dashPhase = fract(param * 38.0);
    float dash = smoothstep(0.0, 0.06, dashPhase) * (1.0 - smoothstep(0.55, 0.61, dashPhase));
    float trailLine = (1.0 - smoothstep(0.6 * pix, 1.6 * pix, dTrail)) * dash * trailMask;
    // Pressed-in look: darken + a 1px lit lower edge from the height gradient.
    col = mix(col, MOSS_DEEP, trailLine * 0.5);
    col += vec3(1.0) * trailLine * 0.04 * lambert;
  }

  // Footsteps — oriented rounded-toe SDFs that genuinely indent the relief.
  for (int i = 0; i < 7; i++) {
    if (i >= uFootN) break;
    vec4 f = uFoot[i];
    if (f.w < 0.5) continue;
    vec2 cVUv = unitToVUv(f.xy);
    vec2 d = vUv - cVUv;
    float ca = cos(-f.z), sa = sin(-f.z);
    // Rotate into foot-local vUv space (vUv is isotropic → no shear).
    vec2 loc = vec2(ca * d.x - sa * d.y, sa * d.x + ca * d.y);
    float a = 7.0 * pix;   // half-length
    float b = 3.4 * pix;   // half-width
    // Rounded-toe superellipse → boot silhouette.
    vec2 qf = abs(loc);
    float toe = pow(qf.x / a, 2.4) + pow(qf.y / b, 2.4);
    float dFoot = (toe - 1.0) * min(a, b);
    // Appear staggered with the trail reveal.
    float appear = smoothstep(float(i) / 7.0 * 0.6 + 0.4, float(i) / 7.0 * 0.6 + 0.5, uReveal);
    float body = 1.0 - smoothstep(0.0, 1.2 * pix, dFoot);
    // Indent: offset sample along the light for an inner shadow + rim light.
    float hHere = h;
    float hOff = heightBicubic(clamp(tuv + vec2(0.6, -0.6) * pix * 3.0, 0.0, 1.0));
    float emboss = clamp((hOff - hHere) * 9.0, -1.0, 1.0);
    float press = body * appear;
    col = mix(col, INK, press * 0.55);
    col += vec3(1.0) * press * 0.10 * max(emboss, 0.0);   // lit rim
    col -= vec3(0.12) * press * max(-emboss, 0.0);         // inner shadow
  }

  // Waypoint at the trail end — ochre ring + checkmark, drawn on reveal.
  if (uPathN > 1.0) {
    vec2 endU = texture(uPath, vec2((uPathN - 0.5) / uPathN, 0.5)).rg;
    vec2 eVUv = unitToVUv(endU);
    float dEnd = length(vUv - eVUv);
    float wpAppear = smoothstep(0.9, 1.0, uReveal);
    float ring = (1.0 - smoothstep(0.5 * pix, 1.5 * pix, abs(dEnd - 6.0 * pix))) * wpAppear;
    // Checkmark = two short SDF strokes in vUv space around the centre.
    vec2 ld = vUv - eVUv;
    float chkA = segDist(ld, vec2(-3.0, 0.0) * pix, vec2(-0.5, 2.6) * pix);
    float chkB = segDist(ld, vec2(-0.5, 2.6) * pix, vec2(3.5, -3.0) * pix);
    float check = (1.0 - smoothstep(0.4 * pix, 1.4 * pix, min(chkA, chkB))) * wpAppear;
    col = mix(col, OCHRE, max(ring, check));
  }

  // Summit crosshairs (ochre) — text labels are added in the DOM overlay.
  for (int i = 0; i < 4; i++) {
    if (uPeak[i].z < 0.5) continue;
    vec2 pVUv = unitToVUv(uPeak[i].xy);
    vec2 d = vUv - pVUv;
    float arm = 5.0 * pix;
    float thick = 1.3 * pix;
    float horiz = step(abs(d.x), arm) * step(abs(d.y), thick);
    float vert = step(abs(d.y), arm) * step(abs(d.x), thick);
    float c = max(horiz, vert);
    float appear = smoothstep(0.35, 0.65, uReveal);
    col = mix(col, OCHRE, c * 0.85 * appear);
  }

  fragColor = vec4(col, revealed * edgeFade);
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("gl.createShader returned null");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

/**
 * Minimal WebGL2 renderer for the contour relief. Owns one full-screen
 * triangle, the heightmap texture and a uniform cache; redraws only when
 * a uniform actually changed (the tick loop is otherwise near-free).
 */
class ContourRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private vbo: WebGLBuffer;
  private texture: WebGLTexture | null = null;
  private pathTex: WebGLTexture | null = null;
  private pathN = 0;
  private textureSize = 0;
  private uniforms: Record<string, WebGLUniformLocation | null>;
  private footData = new Float32Array(7 * 4);
  private footN = 0;
  private peakData = new Float32Array(4 * 4);

  // Animated state.
  private revealStart = -1;
  private reveal = 0;
  private startTime = performance.now();
  private lastGrainT = -1;

  // Fixed light direction (the cursor-following light was removed).
  private static LIGHT_X = 0.55;
  private static LIGHT_Y = 0.4;
  private static LIGHT_Z = 0.62;

  // Uniform cache values.
  private lastReveal = -1;

  private static REVEAL_MS = 2400;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;

    const program = gl.createProgram();
    if (!program) throw new Error("gl.createProgram returned null");
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
    }
    this.program = program;

    // Full-screen triangle (one oversized tri beats two — no diagonal seam,
    // half the vertices).
    const vao = gl.createVertexArray();
    if (!vao) throw new Error("gl.createVertexArray returned null");
    this.vao = vao;
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    if (!buf) throw new Error("gl.createBuffer returned null");
    this.vbo = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    this.uniforms = {};
    for (const name of [
      "uHeight",
      "uPath",
      "uRes",
      "uPathN",
      "uCover",
      "uLevels",
      "uBands",
      "uReveal",
      "uLightDir",
      "uTime",
      "uAspect",
      "uFoot",
      "uFootN",
      "uPeak",
    ]) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    gl.uniform1i(this.uniforms.uHeight, 0);
    gl.uniform1i(this.uniforms.uPath, 1);
    // Fixed light direction, normalized once.
    const lx = ContourRenderer.LIGHT_X;
    const ly = ContourRenderer.LIGHT_Y;
    const lz = ContourRenderer.LIGHT_Z;
    const inv = 1 / Math.hypot(lx, ly, lz);
    gl.uniform3f(this.uniforms.uLightDir, lx * inv, ly * inv, lz * inv);
  }

  setHeightmap(data: Float32Array, size: number) {
    const gl = this.gl;
    if (!this.texture) this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    // Flip vertically so the heightmap's first row (terrain top, y=0) lines
    // up with the SVG overlay's top — otherwise the relief renders mirrored
    // against the footprints and summit labels.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // R32F + linear filtering needs an extension; fall back to R16F (whose
    // linear filtering is core WebGL2) — 11 mantissa bits is plenty for a
    // normalized height field.
    let uploaded = false;
    if (gl.getExtension("OES_texture_float_linear")) {
      try {
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.R32F, size, size, 0, gl.RED, gl.FLOAT, data,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        uploaded = true;
      } catch {
        uploaded = false;
      }
    }
    if (!uploaded) {
      const half = new Uint16Array(data.length);
      for (let i = 0; i < data.length; i++) half[i] = floatToHalf(data[i]);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.R16F, size, size, 0, gl.RED, gl.HALF_FLOAT, half,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.textureSize = size;
    this.renderFrame();
  }

  setLevels(levels: number) {
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.uniform1f(this.uniforms.uLevels, levels);
    gl.uniform1f(this.uniforms.uBands, levels * 2);
    this.renderFrame();
  }

  /** Upload the trail polyline (unit-space points) as an RG32F row texture. */
  setPath(points: ArrayLike<number>[], count: number) {
    const gl = this.gl;
    if (!this.pathTex) this.pathTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.pathTex);
    // 1×N data texture — no vertical flip (would corrupt the single row).
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    // A zero-width texture is invalid; upload a 1×1 dummy so the binding is
    // always legal (the shader skips the trail when uPathN <= 1).
    const w = Math.max(1, count);
    const data = new Float32Array(w * 2);
    for (let i = 0; i < count; i++) {
      data[i * 2] = points[i][0];
      data[i * 2 + 1] = points[i][1];
    }
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RG32F, w, 1, 0, gl.RG, gl.FLOAT, data,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.pathN = count;
    this.renderFrame();
  }

  /** Upload footprint + summit data (unit space). */
  setMarks(
    feet: { x: number; y: number; rot: number }[],
    peaks: { ux: number; uy: number; h: number }[],
  ) {
    this.footData.fill(0);
    this.footN = Math.min(feet.length, 7);
    for (let i = 0; i < this.footN; i++) {
      this.footData[i * 4] = feet[i].x;
      this.footData[i * 4 + 1] = feet[i].y;
      this.footData[i * 4 + 2] = feet[i].rot;
      this.footData[i * 4 + 3] = 1;
    }
    this.peakData.fill(0);
    const pn = Math.min(peaks.length, 4);
    for (let i = 0; i < pn; i++) {
      this.peakData[i * 4] = peaks[i].ux;
      this.peakData[i * 4 + 1] = peaks[i].uy;
      this.peakData[i * 4 + 2] = 1;
      this.peakData[i * 4 + 3] = peaks[i].h;
    }
    this.renderFrame();
  }

  beginReveal() {
    this.reveal = 0;
    this.revealStart = performance.now();
    this.lastReveal = -1;
    this.renderFrame();
  }

  /** Skip straight to the fully-revealed state (reduced motion). */
  finishReveal() {
    this.reveal = 1;
    this.revealStart = -1;
    this.lastReveal = -1;
    this.renderFrame();
  }

  /** Advance animations one step; draws only when a uniform changed. */
  tick() {
    let changed = false;

    if (this.revealStart >= 0) {
      const t = (performance.now() - this.revealStart) / ContourRenderer.REVEAL_MS;
      if (t >= 1) {
        this.reveal = 1;
        this.revealStart = -1;
      } else {
        // easeOutCubic — the sweep slows as it finishes.
        this.reveal = 1 - Math.pow(1 - t, 3);
      }
      changed = true;
    }

    // Grain drift — throttled to ~7.5fps, only while the map is revealing.
    const t = (performance.now() - this.startTime) / 1000;
    const grainT = Math.floor(t * 7.5) / 7.5;
    if (grainT !== this.lastGrainT && this.reveal < 1) {
      this.lastGrainT = grainT;
      changed = true;
    }

    if (changed) this.renderFrame();
  }

  /** Draw one frame immediately (e.g. after a resize). */
  renderFrame() {
    const gl = this.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    if (canvas.width === 0 || canvas.height === 0) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(this.program);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (!this.texture) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (this.pathTex) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.pathTex);
    }

    const aspect = canvas.width / canvas.height;
    gl.uniform1f(this.uniforms.uRes, this.textureSize);
    gl.uniform1f(this.uniforms.uAspect, aspect);
    gl.uniform1f(this.uniforms.uPathN, this.pathN);
    // "xMidYMid slice": scale the square terrain so it covers the canvas,
    // cropping the long axis (wide canvas crops left/right, tall crops top/
    // bottom). The uniform shrinks the terrain-uv range accordingly.
    gl.uniform2f(
      this.uniforms.uCover,
      aspect >= 1 ? 1 : aspect,
      aspect >= 1 ? 1 / aspect : 1,
    );
    gl.uniform1i(this.uniforms.uFootN, this.footN);
    gl.uniform4fv(this.uniforms.uFoot, this.footData);
    gl.uniform4fv(this.uniforms.uPeak, this.peakData);

    if (this.reveal !== this.lastReveal) {
      gl.uniform1f(this.uniforms.uReveal, this.reveal);
      this.lastReveal = this.reveal;
    }
    gl.uniform1f(this.uniforms.uTime, this.lastGrainT >= 0 ? this.lastGrainT : 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    const gl = this.gl;
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.pathTex) gl.deleteTexture(this.pathTex);
    gl.deleteBuffer(this.vbo);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
    // Deliberately do NOT loseContext() here: the effect that owns this
    // renderer re-runs on every seed change, reusing the same canvas. Losing
    // the context would make the next getContext() return null and strand the
    // component on the SVG fallback. Context loss is a device event, not ours.
  }
}

// ─── Float32 → float16 ─────────────────────────────────────────────────────

/** Convert a JS number to IEEE 754 half-precision bits. */
function floatToHalf(value: number): number {
  floatView[0] = value;
  const x = int32View[0];
  const sign = (x >>> 16) & 0x8000;
  let exp = ((x >>> 23) & 0xff) - 127 + 15;
  let frac = (x >>> 13) & 0x3ff;

  if (exp <= 0) {
    // Subnormal or zero — heights are [0,1], so flush tiny values to zero.
    if (exp < -10) return sign;
    frac |= 0x400;
    const shift = 1 - exp;
    return sign | (frac >> shift);
  }
  if (exp >= 0x1f) {
    // Overflow → max finite half (heights never exceed 1, but be safe).
    return sign | 0x7bff;
  }
  return sign | (exp << 10) | frac;
}

const floatView = new Float32Array(1);
const int32View = new Int32Array(floatView.buffer);
