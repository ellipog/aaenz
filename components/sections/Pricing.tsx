import { useLocale, useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WizardTrigger } from "@/components/wizard/WizardTrigger";
import { pricingTiers, pricingTrust, oneTimeServices } from "@/content/pricing";
import { tx, txList } from "@/content/types";

export function Pricing() {
  const t = useTranslations("Pricing");
  const locale = useLocale() as "no" | "en";

  return (
    <section id="priser" className="border-t border-stone-soft/50">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading number={t("eyebrow")} title={t("title")} lede={t("lede")} />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.slug} delay={i * 0.08} as="div">
              <article
                className={`relative flex h-full flex-col rounded-sm border p-8 ${
                  tier.featured
                    ? "border-moss bg-moss text-paper shadow-[0_0_0_1px_var(--color-moss)]"
                    : "border-stone-soft/60 bg-paper-deep/40 text-ink"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 rounded-xs bg-clay px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                    {t("featured")}
                  </span>
                )}

                <h3
                  className={`font-display text-2xl font-medium ${
                    tier.featured ? "text-paper" : "text-ink"
                  }`}
                >
                  {tx(tier.name, locale)}
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className={`font-display text-4xl font-medium ${
                      tier.featured ? "text-paper" : "text-ink"
                    }`}
                  >
                    {tx(tier.price, locale)}
                  </span>
                  <span
                    className={`font-mono text-xs ${
                      tier.featured ? "text-paper/70" : "text-stone"
                    }`}
                  >
                    {tx(tier.period, locale)}
                  </span>
                </div>

                <p
                  className={`mt-3 text-sm ${
                    tier.featured ? "text-paper/80" : "text-ink-soft"
                  }`}
                >
                  {tx(tier.summary, locale)}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {txList(tier.features, locale).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          tier.featured ? "text-paper" : "text-moss"
                        }`}
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M3 8.5l3 3 7-7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className={tier.featured ? "text-paper/90" : "text-ink-soft"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <WizardTrigger
                  tier={tier.slug}
                  variant={tier.featured ? "secondary" : "primary"}
                  className={`mt-8 w-full ${
                    tier.featured ? "w-auto" : ""
                  }`}
                >
                  {tx(tier.cta, locale)}
                </WizardTrigger>
              </article>
            </Reveal>
          ))}
        </div>

        {/* One-time services (engangstjenester) */}
        <div className="mt-20">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
              {locale === "no" ? "Engangstjenester" : "One-time services"}
            </h3>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-soft">
              {locale === "no" ? "Legges til ved oppstart" : "Add at any time"}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {oneTimeServices.map((svc, i) => (
              <Reveal key={svc.slug} delay={i * 0.08} as="div">
                <article className="flex h-full flex-col rounded-sm border border-stone-soft/60 bg-paper-deep/40 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-xl font-medium text-ink">
                      {tx(svc.name, locale)}
                    </h4>
                    <div className="text-right">
                      <div className="font-display text-xl font-medium text-ink">
                        {tx(svc.price, locale)}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-stone">
                        {tx(svc.period, locale)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">{tx(svc.summary, locale)}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {txList(svc.features, locale).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-moss"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M3 8.5l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-ink-soft">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <WizardTrigger
                    service={svc.slug}
                    variant="primary"
                    className="mt-5 w-fit font-mono text-[11px] uppercase tracking-[0.14em]"
                  >
                    {tx(svc.cta, locale)} →
                  </WizardTrigger>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Trust line */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2">
          {txList(pricingTrust, locale).map((line, i) => (
            <span
              key={i}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone"
            >
              · {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
