"use client";

import { motion } from "motion/react";

type Props = {
  /** Total number of steps. */
  total: number;
  /** Current step index (0-based). */
  current: number;
};

/**
 * Surveyor-style progress: one contour mark per step, drawn as three
 * concentric rings — a miniature of the brand's summit marks. Completed
 * steps fill with moss, the active step's rings draw themselves in and
 * its summit dot pulses, upcoming steps wait as faint stone outlines.
 */
export function ProgressBar({ total, current }: Props) {
  return (
    <div
      className="flex items-center justify-between gap-1"
      role="img"
      aria-label={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        // Moss when reached, faint stone otherwise.
        const stroke = done || active ? "var(--color-moss)" : "var(--color-stone-soft)";
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`h-5 w-5 shrink-0 ${done || active ? "" : "opacity-70"}`}
            aria-hidden
          >
            {/* Contour rings — the active step draws them in, like the
                brand's "draw" primitive. */}
            {[10, 6.5, 3.2].map((r, ri) => (
              <motion.circle
                key={r}
                cx={12}
                cy={12}
                r={r}
                fill="none"
                stroke={stroke}
                strokeWidth={done || active ? 1.4 : 1.2}
                strokeLinecap="round"
                initial={false}
                animate={{
                  pathLength: done || active ? 1 : 0,
                  opacity: done ? 0.9 : active ? 1 : 0.5,
                }}
                transition={{
                  pathLength: {
                    duration: 0.45,
                    delay: ri * 0.07,
                    ease: "easeOut",
                  },
                }}
              />
            ))}
            {/* Summit dot — filled once the step is done, pulsing while
                it's the current step. */}
            <motion.circle
              cx={12}
              cy={12}
              r={1.6}
              fill={stroke}
              initial={false}
              animate={{
                scale: done || active ? 1 : 0,
                opacity: active ? [1, 0.45, 1] : 1,
              }}
              transition={
                active
                  ? {
                      opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 0.3, ease: "easeOut" },
                    }
                  : { duration: 0.3, ease: "easeOut" }
              }
              style={{ transformOrigin: "center", transformBox: "fill-box" }}
            />
          </svg>
        );
      })}
    </div>
  );
}
