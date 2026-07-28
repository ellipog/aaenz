"use client";

import { motion } from "motion/react";

type Props = {
  /** Total number of steps. */
  total: number;
  /** Current step index (0-based). */
  current: number;
};

/**
 * Surveyor-style progress: one contour segment per step.
 * Filled segments are moss, upcoming are stone-soft. The current step
 * gets a subtle pulse.
 */
export function ProgressBar({ total, current }: Props) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <motion.span
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-xs bg-stone-soft/50"
          >
            <motion.span
              className="block h-full rounded-xs bg-moss"
              initial={false}
              animate={{
                width: done || active ? "100%" : "0%",
                opacity: active ? [1, 0.6, 1] : 1,
              }}
              transition={
                active
                  ? { opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }
                  : { duration: 0.4, ease: "easeOut" }
              }
            />
          </motion.span>
        );
      })}
    </div>
  );
}
