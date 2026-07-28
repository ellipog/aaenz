"use client";

import { useLocale, useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { products } from "@/content/products";
import { demoSites } from "@/content/portfolio";
import { tx } from "@/content/types";

const statusTone = {
  live: "moss",
  beta: "ochre",
  "open-source": "neutral",
} as const;

export function Portfolio() {
  const t = useTranslations("Portfolio");
  const locale = useLocale() as "no" | "en";

  return (
    <section id="arbeid" className="border-t border-stone-soft/50 bg-paper-deep/30">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading number={t("eyebrow")} title={t("title")} lede={t("lede")} />

        {/* Demo sites */}
        <div className="mt-12">
          <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
            {t("demosLabel")}
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {demoSites.map((d, i) => (
              <Reveal key={d.slug} delay={i * 0.08} as="div">
                <article
                  className={`flex h-full flex-col rounded-sm border p-6 ${
                    d.demoUrl
                      ? "border-stone-soft/60 bg-paper"
                      : "border-dashed border-stone-soft/60 bg-paper-deep/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-xl font-medium text-ink">
                      {tx(d.business, locale)}
                    </h4>
                    <Tag tone="ochre">{t("demoTag")}</Tag>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {tx(d.blurb, locale)}
                  </p>
                  <span className="mt-5 inline-flex w-fit items-center gap-1 rounded-xs border border-stone-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-stone">
                    {tx(d.sector, locale)}
                  </span>
                  {d.demoUrl ? (
                    <a
                      href={d.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-moss"
                    >
                      {t("visitDemo")}
                    </a>
                  ) : (
                    <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-soft">
                      {t("comingSoon")}
                    </span>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="mt-16">
          <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
            {t("productsLabel")}
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08} as="div">
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-sm border border-stone-soft/60 bg-paper p-6 transition-all hover:border-moss hover:shadow-[0_1px_0_0_var(--color-moss)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-2xl font-medium text-ink">
                      {p.name}
                    </h4>
                    <Tag tone={statusTone[p.status]}>{p.status}</Tag>
                  </div>
                  <p className="mt-1 font-display italic text-moss">
                    {tx(p.tagline, locale)}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                    {tx(p.blurb, locale)}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-xs border border-stone-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-stone"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-moss transition-transform group-hover:translate-x-1">
                    {t("visit")}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
