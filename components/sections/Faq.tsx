"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/content/faq";
import { tx } from "@/content/types";

export function Faq() {
  const t = useTranslations("Faq");
  const locale = useLocale() as "no" | "en";
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-stone-soft/50">
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          number={t("eyebrow")}
          title={t("title")}
          lede={t("lede")}
          align="center"
        />

        <div className="mt-12 divide-y divide-stone-soft/50 border-y border-stone-soft/50">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-medium text-ink">
                    {tx(item.q, locale)}
                  </span>
                  <span
                    className={`shrink-0 text-moss transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl leading-relaxed text-ink-soft">
                      {tx(item.a, locale)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
