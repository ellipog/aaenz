"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gjøvik Fysioterapi — numeric primitives (Lindrig).
 *
 * The old HUD / instrumented look (telemetry grid + velocity streaks) was
 * removed with the healing redesign. What remains is the CountUp helper,
 * retained in case any calm stat wants a gentle one-shot count.
 */

/**
 * An animated count-up number. Counts from 0 to `value` once when it enters
 * the viewport. Respects prefers-reduced-motion (renders the final value).
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
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
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
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
