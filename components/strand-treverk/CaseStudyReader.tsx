"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Locale, Project } from "@/content/strand-treverk";
import { tx } from "@/content/strand-treverk";
import { SpecRow } from "./Drawing";

/**
 * Strand Treverk — the annotated case-study reader.
 *
 * One entry per project. Reads like flipping through a craftsman's project
 * book: a sticky spec sidebar (the drawing's parts list) beside a photo with
 * dimension annotations that stroke in as the reader scrolls into view.
 *
 * Motion is calm by design — lines draw themselves, callouts fade up, the
 * photo parallaxes only slightly. All gated behind prefers-reduced-motion.
 */
export function CaseStudyReader({
  project,
  index,
  locale,
}: {
  project: Project;
  index: number;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle parallax on the photo — never more than ~24px.
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, 12]);

  const ann = project.annotations ?? [];
  const specs = project.specs;

  return (
    <article
      ref={ref}
      className="grid gap-8 border lg:grid-cols-[1fr_300px] lg:gap-10"
      style={{ borderColor: "var(--ws-rule)" }}
    >
      {/* Photo + scroll-driven annotation overlays */}
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <motion.div style={{ y: reduce ? 0 : photoY }} className="absolute inset-0 -m-6">
          <Image
            src={project.photo}
            alt={tx(project.title, locale)}
            fill
            sizes="(max-width: 1024px) 100vw, 760px"
            className="object-cover"
          />
        </motion.div>

        {/* drawing-sheet index stamp */}
        <span
          className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-plex-mono), monospace",
            color: "var(--ws-on-dark)",
            backgroundColor: "rgba(38,34,27,0.72)",
            padding: "3px 7px",
          }}
        >
          0{index + 1} / {project.year}
        </span>

        {/* annotations — dimension lines + values that draw/fade in on scroll */}
        {ann.map((a, i) => (
          <DimensionAnnotation
            key={i}
            value={a.value}
            label={tx(a.label, locale)}
            left={a.left}
            top={a.top}
            progress={scrollYProgress}
            reduce={!!reduce}
            delay={i * 0.12}
          />
        ))}
      </div>

      {/* Sticky spec sidebar — the parts list */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border-l-2 pl-5" style={{ borderColor: "var(--ws-accent)" }}>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-accent)" }}
          >
            {tx(project.category, locale)}
          </span>
          <h3
            className="mt-2 text-2xl font-bold uppercase leading-tight tracking-[0.01em]"
            style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text)" }}
          >
            {tx(project.title, locale)}
          </h3>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--ws-text-soft)" }}
          >
            {tx(project.blurb, locale)}
          </p>

          <div className="mt-6 space-y-2.5">
            <SpecRow label={locale === "no" ? "Art" : "Species"}>
              {specs ? tx(specs.species, locale) : "—"}
            </SpecRow>
            <SpecRow label={locale === "no" ? "Overflate" : "Finish"}>
              {specs ? tx(specs.finish, locale) : "—"}
            </SpecRow>
            <SpecRow label={locale === "no" ? "Skjøter" : "Joinery"}>
              {specs ? tx(specs.joinery, locale) : "—"}
            </SpecRow>
            <SpecRow label={locale === "no" ? "Mål" : "Dimensions"}>
              {specs ? tx(specs.dimensions, locale) : tx(project.spec, locale)}
            </SpecRow>
            <SpecRow label={locale === "no" ? "Sted" : "Place"}>
              {tx(project.place, locale)}
            </SpecRow>
            <SpecRow label={locale === "no" ? "Tid" : "Duration"} accent>
              {specs ? tx(specs.duration, locale) : project.year}
            </SpecRow>
          </div>
        </div>
      </aside>
    </article>
  );
}

/**
 * A single dimension annotation layered over a photo: a short leader line
 * (draws in) + a value box (fades/slides up). Anchored at a % position.
 */
function DimensionAnnotation({
  value,
  label,
  left,
  top,
  progress,
  reduce,
  delay,
}: {
  value: string;
  label: string;
  left: string;
  top: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
  delay: number;
}) {
  // Line draws in over the first half of the entry window.
  const lineScale = useTransform(progress, [0.1 + delay, 0.4 + delay], reduce ? [1, 1] : [0, 1]);
  const boxOpacity = useTransform(progress, [0.2 + delay, 0.45 + delay], reduce ? [1, 1] : [0, 1]);
  const boxY = useTransform(progress, [0.2 + delay, 0.45 + delay], reduce ? [0, 0] : [8, 0]);

  return (
    <div
      className="absolute z-10 flex items-start gap-1.5"
      style={{ left, top, transform: "translate(-50%, -50%)" }}
    >
      {/* leader line */}
      <motion.span
        className="block w-px origin-top"
        style={{ height: 28, scaleY: lineScale, backgroundColor: "var(--ws-accent)" }}
        aria-hidden
      />
      {/* value box */}
      <motion.div
        className="border px-2 py-1"
        style={{
          opacity: boxOpacity,
          y: boxY,
          borderColor: "var(--ws-accent)",
          backgroundColor: "rgba(232,227,214,0.92)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div
          className="font-bold leading-none"
          style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: "0.8rem", color: "var(--ws-accent)" }}
        >
          {value}
        </div>
        <div
          className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em]"
          style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-graphite)" }}
        >
          {label}
        </div>
      </motion.div>
    </div>
  );
}
