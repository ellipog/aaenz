"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from "motion/react";

/**
 * Aaen Studios primary mark — concentric contour rings closing to a summit.
 * Geometry from branding/assets/svg/mark-primary.svg (canonical source).
 *
 * Living version: the rings parallax toward the pointer (outer ring moves
 * most → depth), and a contour ring emits from the summit on hover. All
 * motion is disabled under prefers-reduced-motion (static mark).
 */
type Props = {
  className?: string;
  /** Pulse the summit point — brand motion primitive, respects reduced-motion via CSS. */
  pulse?: boolean;
};

export function ContourMark({ className, pulse }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [emit, setEmit] = useState(0);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 15, mass: 0.3 });
  const sy = useSpring(py, { stiffness: 120, damping: 15, mass: 0.3 });
  // Outer ring drifts furthest, inner least — a sense of layered elevation.
  const r1x = useTransform(sx, (v) => v * 2.6);
  const r1y = useTransform(sy, (v) => v * 2.6);
  const r2x = useTransform(sx, (v) => v * 1.5);
  const r2y = useTransform(sy, (v) => v * 1.5);
  const r3x = useTransform(sx, (v) => v * 0.7);
  const r3y = useTransform(sy, (v) => v * 0.7);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      role="presentation"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onHoverStart={reduce ? undefined : () => setEmit((n) => n + 1)}
    >
      <g transform="translate(0,4)">
        <motion.g style={reduce ? undefined : { x: r1x, y: r1y }}>
          <path
            d="M24 6 C32 6 40 14 40 22 C40 30 32 34 24 34 C16 34 8 30 8 22 C8 14 16 6 24 6 Z"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.35"
          />
        </motion.g>
        <motion.g style={reduce ? undefined : { x: r2x, y: r2y }}>
          <path
            d="M24 10 C30 10 36 16 36 22 C36 28 30 31 24 31 C18 31 12 28 12 22 C12 16 18 10 24 10 Z"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.55"
          />
        </motion.g>
        <motion.g style={reduce ? undefined : { x: r3x, y: r3y }}>
          <path
            d="M24 14 C28 14 32 18 32 22 C32 26 28 28 24 28 C20 28 16 26 16 22 C16 18 20 14 24 14 Z"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.8"
          />
        </motion.g>
        <ellipse
          cx="24"
          cy="22"
          rx="4"
          ry="3.5"
          fill="currentColor"
          className={pulse ? "animate-pulse-summit" : undefined}
        />
        {/* Contour ring emitted from the summit on each hover (replays via key). */}
        {emit > 0 && !reduce && (
          <motion.circle
            key={emit}
            cx="24"
            cy="22"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        )}
      </g>
    </motion.svg>
  );
}

/** Lockup — the contour mark beside the "aaen studios" wordmark. */
export function ContourLockup({
  className,
  showWord = true,
  reversed = false,
}: {
  className?: string;
  showWord?: boolean;
  reversed?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <ContourMark className={`h-8 w-8 shrink-0 ${reversed ? "text-paper" : "text-moss"}`} />
      {showWord && (
        <span
          className={`font-display text-xl font-medium tracking-tight ${
            reversed ? "text-paper" : "text-ink"
          }`}
        >
          aaen studios
        </span>
      )}
    </span>
  );
}
