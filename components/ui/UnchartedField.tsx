"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import {
  createProgram,
  initFullscreenGeometry,
  syncCanvasSize,
} from "@/lib/gl/webgl-utils";

/**
 * UnchartedField — the 404 scene: drifting fog over unmapped terrain, a slow
 * compass-rose sweep, and a single procedural sea-serpent contour undulating
 * through the murk. "Here be dragons."
 *
 * Self-contained (used on the locale 404 and the global not-found, which sits
 * outside the intl provider). One static frame under reduced-motion.
 */
export function UnchartedField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    let program: WebGLProgram;
    try {
      program = createProgram(gl, VERT, FRAG);
    } catch (err) {
      console.error("[UnchartedField] shader init failed:", err);
      return;
    }
    const geo = initFullscreenGeometry(gl, program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.useProgram(program);

    const u = {
      time: gl.getUniformLocation(program, "uTime"),
      res: gl.getUniformLocation(program, "uRes"),
      moss: gl.getUniformLocation(program, "uMoss"),
      stone: gl.getUniformLocation(program, "uStone"),
      ochre: gl.getUniformLocation(program, "uOchre"),
    } as const;

    const moss = cssTri("--color-moss", [0.227, 0.353, 0.243]);
    const stone = cssTri("--color-stone", [0.541, 0.529, 0.447]);
    const ochre = cssTri("--color-ochre", [0.784, 0.471, 0.165]);

    const ro = new ResizeObserver(() => render());
    ro.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const still = reduce;

    function render(tOverride?: number) {
      syncCanvasSize(canvas!, gl!);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(u.time, tOverride ?? (performance.now() - start) / 1000);
      gl!.uniform2f(u.res, canvas!.width, canvas!.height);
      gl!.uniform3fv(u.moss, moss);
      gl!.uniform3fv(u.stone, stone);
      gl!.uniform3fv(u.ochre, ochre);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    render(still ? 0 : undefined);

    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };
    if (!still) raf = requestAnimationFrame(loop);

    function onVis() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!still && !raf) {
        raf = requestAnimationFrame(loop);
      }
    }
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      gl.deleteBuffer(geo.vbo);
      gl.deleteVertexArray(geo.vao);
      gl.deleteProgram(program);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
    />
  );
}

function cssTri(varName: string, fallback: [number, number, number]): [number, number, number] {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw.startsWith("#") || raw.length < 7) return fallback;
  return [
    parseInt(raw.slice(1, 3), 16) / 255,
    parseInt(raw.slice(3, 5), 16) / 255,
    parseInt(raw.slice(5, 7), 16) / 255,
  ];
}

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 frag;
uniform float uTime;
uniform vec2 uRes;
uniform vec3 uMoss;
uniform vec3 uStone;
uniform vec3 uOchre;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.05;

  // Drifting fog — slow, layered domain-warped fBm.
  vec2 q = vec2(fbm(p * 2.0 + vec2(t, t * 0.7)),
                fbm(p * 2.0 + vec2(-t * 0.6, t)));
  float fog = fbm(p * 1.6 + q * 1.8 + vec2(t * 1.3, 0.0));
  fog = smoothstep(0.25, 0.85, fog);

  // Faint unmapped terrain contours behind the fog.
  float terrain = fbm(p * 3.0 + vec2(0.0, -t * 0.4));
  float contour = abs(fract(terrain * 6.0) - 0.5);
  float fw = fwidth(terrain * 6.0) + 0.02;
  float line = 1.0 - smoothstep(fw, fw * 3.0, contour);

  vec3 col = mix(uStone * 0.4, uMoss * 0.5, line);
  col = mix(col, uStone * 0.7, fog * 0.7);

  // Compass-rose sweep — a rotating faint wedge from screen centre.
  vec2 c = uv - vec2(0.72, 0.62);
  float ang = atan(c.y, c.x);
  float r = length(c) * aspect;
  float sweep = sin(ang * 8.0 - uTime * 0.25) * 0.5 + 0.5;
  sweep *= smoothstep(0.5, 0.0, abs(r - 0.18));
  col += uOchre * sweep * 0.10;
  // Compass ring + tick marks.
  float ring = smoothstep(0.004, 0.0, abs(r - 0.18)) * 0.5;
  float ticks = step(0.86, fract(ang / 6.2831 * 16.0));
  col += mix(uMoss, uOchre, 0.3) * (ring + ring * ticks * 0.6) * 0.7;

  // The serpent — a single SDF wave contour undulating across the lower murk.
  float sx = p.x;
  float surface = 0.34 + sin(sx * 3.5 + uTime * 0.4) * 0.04
                + sin(sx * 8.0 - uTime * 0.6) * 0.02;
  float serp = abs(p.y - surface);
  float serpLine = (1.0 - smoothstep(0.0, 0.006, serp)) * 0.6;
  // A few humps (the body) where the wave is highest.
  float humps = smoothstep(0.32, 0.40, surface);
  col += uMoss * serpLine * humps * 0.8;
  // Eye glints along the crest.
  float eyePhase = fract(sx * 1.5 - uTime * 0.1);
  float eye = smoothstep(0.97, 1.0, eyePhase) * humps;
  col += uOchre * eye * 0.6;

  // Vignette toward edges — "edges of the known map".
  vec2 qv = uv - 0.5;
  col *= 1.0 - 0.35 * smoothstep(0.3, 0.75, dot(qv, qv) * 2.0);

  frag = vec4(col, 0.55);
}`;
