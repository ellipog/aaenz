"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  createProgram,
  initFullscreenGeometry,
  syncCanvasSize,
} from "@/lib/gl/webgl-utils";

/**
 * SummitFlag — a one-shot celebration canvas for a successful submission.
 * Terrain draws in survey-style (low → high), a flag plants at the peak,
 * and a brief ochre particle burst fires on arrival. Then it sits still.
 *
 * Renders a single static frame under prefers-reduced-motion (flag planted,
 * terrain already drawn — no particles).
 */
export function SummitFlag({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount the canvas one tick later so the card's layout is settled before
  // we size the backing store (avoids a 0×0 first frame).
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
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
      console.error("[SummitFlag] shader init failed:", err);
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
      ochre: gl.getUniformLocation(program, "uOchre"),
      paper: gl.getUniformLocation(program, "uPaper"),
    } as const;

    const moss = cssTri("--color-moss", [0.227, 0.353, 0.243]);
    const ochre = cssTri("--color-ochre", [0.784, 0.471, 0.165]);
    const paper = cssTri("--color-paper", [0.945, 0.918, 0.851]);

    const ro = new ResizeObserver(() => render());
    ro.observe(canvas);

    const start = performance.now();
    const DURATION = 2200;
    let raf = 0;

    function render() {
      syncCanvasSize(canvas!, gl!);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      const elapsed = (performance.now() - start) / 1000;
      const t = reduce ? 1 : Math.min(1, (elapsed * 1000) / DURATION);
      gl!.uniform1f(u.time, reduce ? 1 : t);
      gl!.uniform2f(u.res, canvas!.width, canvas!.height);
      gl!.uniform3fv(u.moss, moss);
      gl!.uniform3fv(u.ochre, ochre);
      gl!.uniform3fv(u.paper, paper);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    render();

    if (!reduce) {
      const loop = () => {
        render();
        if (performance.now() - start < DURATION + 600) {
          raf = requestAnimationFrame(loop);
        }
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      gl.deleteBuffer(geo.vbo);
      gl.deleteVertexArray(geo.vao);
      gl.deleteProgram(program);
    };
  }, [mounted, reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={mounted ? undefined : { opacity: 0 }}
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
uniform float uTime; // 0..1 progress
uniform vec2 uRes;
uniform vec3 uMoss;
uniform vec3 uOchre;
uniform vec3 uPaper;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vec2(vUv.x * aspect, vUv.y);

  // A single rounded ridge rising to a peak at the right.
  float baseN = noise(vec2(uv.x * 2.0, 0.3));
  float ridgeH = 0.30 + baseN * 0.10
               + smoothstep(0.2, 0.8, uv.x) * 0.34; // climbs to the peak
  // Carve the survey reveal in: terrain appears as uTime sweeps upward.
  float revealH = ridgeH * uTime;
  float ground = step(uv.y, revealH);

  vec3 col = uPaper;
  // Hillshade: cheap gradient based on the ridge slope.
  float slope = ridgeH - noise(vec2((uv.x - 0.02) * 2.0, 0.3)) * 0.10
               - smoothstep(0.18, 0.78, uv.x - 0.02) * 0.34;
  float shade = clamp(0.7 + slope * 6.0, 0.4, 1.1);
  col = mix(col, uMoss * shade, ground * 0.85);
  // Contour line on the ridge surface.
  float band = abs(fract(revealH * 8.0) - 0.5);
  float near = smoothstep(0.012, 0.0, abs(uv.y - revealH));
  col = mix(col, uMoss, near * 0.5);

  // The flagpole + flag at the peak (x ≈ 0.8 * aspect).
  float peakX = 0.8 * aspect;
  float pole = smoothstep(0.004, 0.0, abs(uv.x - peakX)) * step(uv.y, 0.92);
  col = mix(col, uMoss, pole * 0.9);
  // Flag triangle waves once uTime passes ~0.6.
  float flagT = smoothstep(0.6, 1.0, uTime);
  float wave = sin(uv.x * 30.0 - uTime * 8.0) * 0.015;
  float flag = step(peakX, uv.x) * step(uv.x, peakX + 0.18)
             * step(0.80 + wave, uv.y) * step(uv.y, 0.90);
  col = mix(col, uOchre, flag * flagT * 0.95);

  // Particle burst at the peak when the flag plants (uTime ≈ 0.6).
  float burstPhase = smoothstep(0.55, 0.95, uTime) * (1.0 - smoothstep(0.9, 1.2, uTime));
  float burst = 0.0;
  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    float ang = fi * 0.6283;
    vec2 dir = vec2(cos(ang), sin(ang)) * (0.05 + burstPhase * 0.22);
    vec2 pp = vec2(peakX, 0.88) + dir;
    burst += smoothstep(0.006, 0.0, distance(uv, pp));
  }
  col += uOchre * burst * burstPhase * 0.9;

  frag = vec4(col, 0.9);
}`;
