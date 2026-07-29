"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Gjøvik Fysioterapi — HUD / instrumented primitives.
 *
 * The performance-lab aesthetic is built from these: a faint telemetry grid
 * behind panels, a kinetic velocity-streak field for the hero, and an animated
 * count-up for live stats. All gated behind prefers-reduced-motion.
 */

/** A faint grid laid behind a panel — like instrumented graph paper. */
export function HUDGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--physio-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--physio-grid) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
      aria-hidden
    />
  );
}

/**
 * Kinetic velocity streaks — animated horizontal energy lines that sweep
 * across the hero. The signature Kraft motif, now actually moving.
 */
export function VelocityField({ count = 5 }: { count?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const top = 18 + i * 14;
        const delay = i * 0.5;
        const duration = 3.2 + (i % 3) * 0.8;
        return (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              top: `${top}%`,
              width: `${30 + (i % 4) * 8}%`,
              background:
                i % 2 === 0
                  ? "linear-gradient(90deg, transparent, var(--physio-accent))"
                  : "linear-gradient(90deg, transparent, var(--physio-accent-soft))",
            }}
            initial={reduce ? { x: "-10%" } : { x: "-60%", opacity: 0 }}
            animate={
              reduce
                ? { x: "-10%" }
                : { x: "120%", opacity: [0, 1, 1, 0] }
            }
            transition={
              reduce
                ? undefined
                : { duration, delay, repeat: Infinity, ease: "easeIn" }
            }
          />
        );
      })}
    </div>
  );
}

/**
 * An animated count-up number. Used in the hero's live stats overlay.
 * Counts from 0 to `value` once when it enters the viewport.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / (duration * 1000), 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration, reduce]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
