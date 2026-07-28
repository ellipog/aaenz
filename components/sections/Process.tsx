import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Step = {
  n: string;
  titleKey: "step1" | "step2" | "step3";
  icon: React.ReactNode;
};

const icons = {
  survey: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      <path d="M16 1v4M16 27v4M1 16h4M27 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  map: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M4 8l8-3 8 3 8-3v20l-8 3-8-3-8 3V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 5v20M20 8v20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  summit: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M2 26L10 12l6 8 4-6 10 12H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 8l2-3 2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
} as const;

const steps: Step[] = [
  { n: "01", titleKey: "step1", icon: icons.survey },
  { n: "02", titleKey: "step2", icon: icons.map },
  { n: "03", titleKey: "step3", icon: icons.summit },
];

export function Process() {
  const t = useTranslations("Process");

  return (
    <section id="prosess" className="border-t border-stone-soft/50">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          number={t("eyebrow")}
          title={t("title")}
          lede={t("lede")}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1} as="div">
              <article className="group relative h-full rounded-sm border border-stone-soft/60 bg-paper-deep/40 p-8 transition-colors hover:border-moss">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-3xl font-medium text-stone-soft transition-colors group-hover:text-moss">
                    {step.n}
                  </span>
                  <span className="text-moss">{step.icon}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-ink">
                  {t(`${step.titleKey}.title`)}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  {t(`${step.titleKey}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
