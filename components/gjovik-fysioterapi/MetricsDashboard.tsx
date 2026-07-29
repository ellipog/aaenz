"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/content/gjovik-fysioterapi";
import { tx, dashboard } from "@/content/gjovik-fysioterapi";

/**
 * Gjøvik Fysioterapi — the calm recovery dashboard (Lindrig).
 *
 * Three quiet arc cards: how recovery feels in numbers, without the old
 * telemetry aesthetic. Each card is a sage conic-gradient ring with a short
 * caption. Respects prefers-reduced-motion (static fallback).
 */
export function MetricsDashboard({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {dashboard.arcs.map((arc, i) => {
        const ringText = arc.pct > 0 ? `${arc.pct}%` : (arc.ringText ?? "");
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 rounded-[22px] border p-7"
            style={{
              borderColor: "var(--physio-rule)",
              backgroundColor: "var(--physio-paper)",
            }}
          >
            <Arc pct={arc.pct} text={ringText} reduce={reduce} />
            <div>
              <h3
                className="font-medium"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-text)",
                  fontSize: "1.1rem",
                }}
              >
                {tx(arc.headline, locale)}
              </h3>
              <p
                className="mt-1.5 text-sm leading-relaxed"
                style={{ color: "var(--physio-text-soft)" }}
              >
                {tx(arc.body, locale)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/** A sage conic-gradient arc ring with text in the centre. */
function Arc({
  pct,
  text,
  reduce,
}: {
  pct: number;
  text: string;
  reduce: boolean | null;
}) {
  // For the "1–2" non-numeric card, render a full ring (no proportional fill).
  const fill = pct > 0 ? pct : 100;
  return (
    <div
      className="relative h-20 w-20"
      style={{
        borderRadius: "9999px",
        background: `conic-gradient(var(--physio-sage) ${fill}%, var(--physio-mist) ${fill}%)`,
        WebkitMask: "radial-gradient(circle, transparent 58%, #000 59%)",
        mask: "radial-gradient(circle, transparent 58%, #000 59%)",
      }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span
          className="font-medium"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            color: "var(--physio-moss)",
            fontSize: "1.05rem",
          }}
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
}
