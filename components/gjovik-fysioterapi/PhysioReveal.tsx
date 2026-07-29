"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the reveal begins. */
  delay?: number;
  /** Direction the content travels from. */
  from?: "up" | "down" | "left" | "right" | "none";
  /** Render as a different element (default div). */
  as?: "div" | "section" | "li" | "span" | "article";
};

/**
 * Scroll-triggered reveal for the Gjøvik Fysioterapi demo.
 * Mirrors the host aaen Reveal primitive but styled for the Kraft palette.
 * Respects prefers-reduced-motion: renders immediately, no transform.
 */
export function PhysioReveal({
  children,
  className,
  delay = 0,
  from = "up",
  as = "div",
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const offset = 16;
  const travel = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    none: {},
  }[from];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...travel }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * A continuously-animated accent bar — the "energy" line that draws along its
 * width when scrolled into view. Used as a section divider / eyebrow accent.
 */
export function PhysioEnergyBar({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span
        className={`block h-px w-full ${className ?? ""}`}
        style={{ backgroundColor: "var(--physio-accent)" }}
        aria-hidden
      />
    );
  }
  return (
    <motion.span
      className={`block h-px w-full origin-left ${className ?? ""}`}
      style={{ backgroundColor: "var(--physio-accent)" }}
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/**
 * A calm media panel — a rounded photo treatment with an optional soft play
 * affordance. Replaces the old velocity-streak "video" panel. Used where a
 * real photo/video would go; no moving streaks, no pulsing bolt.
 */
export function PhysioMotionPanel({
  caption,
}: {
  caption?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px]"
      style={{ backgroundColor: "var(--physio-mist)" }}
    >
      {/* soft sage radial wash instead of streaks */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 90% at 30% 30%, rgba(169,190,160,0.45), transparent 60%), linear-gradient(160deg, var(--physio-sage) 0%, var(--physio-mist) 100%)",
        }}
      />
      {/* central soft play affordance */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(251,248,242,0.9)",
            color: "var(--physio-moss)",
          }}
          animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
          transition={
            reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor" aria-hidden>
            <path d="M2 2 L16 10 L2 18 Z" />
          </svg>
        </motion.div>
        {caption && (
          <p
            className="mt-4 text-xs tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              color: "var(--physio-moss)",
            }}
          >
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
