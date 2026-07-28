"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ContourMark } from "@/components/ui/ContourMark";
import { ContourField } from "@/components/ui/ContourField";

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

        {/* Right — the contour mark, drawing in */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-sm border border-ink bg-paper-deep p-12"
          initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Contour field backdrop — procedurally generated terrain. */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <ContourField
              opacity={1}
              levels={7}
              showFootsteps={false}
              showPeaks
              className="h-full w-full"
            />
          </div>
          {/* corner registration ticks — surveyor's marks */}
          <span className="absolute left-3 top-3 h-2 w-2 border-l border-t border-ink" aria-hidden />
          <span className="absolute right-3 top-3 h-2 w-2 border-r border-t border-ink" aria-hidden />
          <span className="absolute bottom-3 left-3 h-2 w-2 border-b border-l border-ink" aria-hidden />
          <span className="absolute bottom-3 right-3 h-2 w-2 border-b border-r border-ink" aria-hidden />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.1em] text-stone">
            aaen · 2024
          </span>
        </motion.div>
      </div>
    </section>
  );
}
