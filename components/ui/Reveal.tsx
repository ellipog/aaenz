"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before the reveal begins. */
  delay?: number;
  /** Direction the content travels from. */
  from?: "up" | "down" | "left" | "right" | "none";
  /** Render as a different element (default div). */
  as?: "div" | "section" | "li" | "span";
};

/**
 * Scroll-triggered reveal — brand "draw" motion primitive.
 * Respects prefers-reduced-motion: renders immediately, no transform.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  as = "div",
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const offset = 24;
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
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
