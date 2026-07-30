"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ContourFieldGL } from "@/components/ui/ContourFieldGL";

/**
 * Hero — the surveyor's thesis. "Kartlegg terrenget før du bygger."
 * The contour mark draws its rings on mount (brand "draw" primitive).
 */
export function Hero() {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Subtle contour grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-contour-grid"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — copy */}
        <div>
          <motion.p
            className="t-eyebrow flex items-center gap-2.5"
            initial={reduce ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="block h-px w-6 bg-moss" aria-hidden />
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            className="mt-4 font-display text-5xl font-normal leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {t("titleLead")}{" "}
            <span className="italic text-moss">{t("titleEmphasis")}</span>{" "}
            {t("titleTail")}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl font-display text-lg leading-relaxed text-ink-soft"
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            {t("lede")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <Button href="#kontakt">{t("ctaPrimary")}</Button>
            <Button href="#priser" variant="secondary">
              {t("ctaSecondary")}
            </Button>
          </motion.div>

          <motion.p
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-stone"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            {t("meta")}
          </motion.p>
        </div>

        {/* Right — the relief terrain, full-bleed (no frame, no padding). */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-sm shadow-[0_24px_60px_-30px_rgba(42,51,39,0.55)]"
          initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContourFieldGL
            opacity={1}
            levels={7}
            showFootsteps={false}
            showPeaks
            className="absolute inset-0 h-full w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
