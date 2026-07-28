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

  const offset = 28;
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
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
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
 * An ambient "video" panel built from CSS — animated velocity streaks crossing
 * a dark field, looping forever. Used where a real video would go; avoids any
 * external media dependency while keeping the premium, alive feel.
 */
export function PhysioMotionPanel({
  caption,
}: {
  caption?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-[6px] border"
      style={{
        backgroundColor: "var(--physio-bg)",
        borderColor: "var(--physio-rule)",
      }}
    >
      {/* velocity streaks */}
      <div className="absolute inset-0" aria-hidden>
        {[16, 26, 36, 46, 56, 66, 76, 86].map((y, i) => {
          const dur = 3 + (i % 4) * 0.8;
          return (
            <motion.div
              key={i}
              className="absolute h-px"
              style={{
                top: `${y}%`,
                left: "-40%",
                width: `${30 + (i % 3) * 12}%`,
                background: `linear-gradient(90deg, transparent, var(--physio-accent)${i % 2 ? "88" : ""}, transparent)`,
              }}
              animate={reduce ? undefined : { x: ["0%", "380%"] }}
              transition={
                reduce
                  ? undefined
                  : { duration: dur, repeat: Infinity, ease: "linear", delay: i * 0.4 }
              }
            />
          );
        })}
      </div>
      {/* central bolt + play affordance */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            border: "2px solid var(--physio-accent)",
            color: "var(--physio-accent)",
          }}
          animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
          transition={
            reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor" aria-hidden>
            <path d="M18 2 L2 11 H9 L7 20 L18 11 H11 Z" />
          </svg>
        </motion.div>
        {caption && (
          <p
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
