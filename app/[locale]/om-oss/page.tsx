import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { ContourMark } from "@/components/ui/ContourMark";
import { ContourField } from "@/components/ui/ContourField";
import { PersonPortrait } from "@/components/ui/PersonPortrait";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return { title: t("title"), description: t("lede") };
}

/** Contour-line icons matching the brand icon-set vocabulary (no emoji). */
function AreaIcon({ kind }: { kind: "web" | "edtech" | "opensource" }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true as const,
    className: "text-moss",
  };
  if (kind === "web") {
    return (
      <svg {...common}>
        {/* window / site frame */}
        <rect x="4" y="6" width="24" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 11h24" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="8.5" r="0.8" fill="currentColor" />
        <circle cx="9.5" cy="8.5" r="0.8" fill="currentColor" />
        <path d="M9 22V14M14 22V16M19 22V13M24 22V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "edtech") {
    return (
      <svg {...common}>
        {/* book / open path */}
        <path d="M4 7c4-2 8-2 12 0v18c-4-2-8-2-12 0V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M28 7c-4-2-8-2-12 0v18c4-2 8-2 12 0V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 7v18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  // opensource — branching nodes
  return (
    <svg {...common}>
      <circle cx="16" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="24" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="25" cy="24" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 8.5v6M16 14.5L9 21.5M16 14.5L23 21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const areas = [
  { key: "web" as const, href: "/#priser" },
  { key: "edtech" as const, href: "https://yomion.com" },
  { key: "opensource" as const, href: "https://galdr.aaenz.no" },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const isNo = locale === "no";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-soft/50">
        <div className="pointer-events-none absolute inset-0 bg-contour-grid" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
          <Reveal>
            <div className="mb-8 flex items-center gap-2.5">
              <span className="block h-px w-8 bg-moss" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                aaen studios · est. 2024
              </span>
            </div>
            <h1 className="font-display text-5xl font-normal leading-[1.05] tracking-tight text-ink sm:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl font-display text-xl leading-relaxed text-ink-soft">
              {t("lede")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story — with animated footsteps across contour terrain */}
      <section className="border-b border-stone-soft/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              {/* Copy */}
              <div>
                <div className="mb-6 flex items-center gap-2.5">
                  <span className="block h-px w-8 bg-moss" aria-hidden />
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                    {isNo ? "Vår regel" : "Our rule"}
                  </span>
                </div>
                <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
                  {isNo ? "Vi bygger på grunn vi har gått." : "We build on ground we've walked."}
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                  {t("story")}
                </p>
              </div>

              {/* Visual — contour field with footprints tracing a valley path */}
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-sm border border-ink bg-paper-deep">
                <ContourField
                  opacity={1}
                  levels={7}
                  showFootsteps
                  showPeaks
                  className="absolute inset-0 h-full w-full"
                />
                {/* Corner registration ticks — surveyor's marks */}
                <span className="absolute left-2 top-2 z-10 h-2 w-2 border-l border-t border-ink" aria-hidden />
                <span className="absolute right-2 top-2 z-10 h-2 w-2 border-r border-t border-ink" aria-hidden />
                <span className="absolute bottom-2 left-2 z-10 h-2 w-2 border-b border-l border-ink" aria-hidden />
                <span className="absolute bottom-2 right-2 z-10 h-2 w-2 border-b border-r border-ink" aria-hidden />
                <span className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.1em] text-stone">
                  {isNo ? "stien gått" : "path walked"}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder */}
      <section className="border-b border-stone-soft/50 bg-paper-deep/30">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <div className="mb-8 flex items-center gap-2.5">
              <span className="block h-px w-8 bg-moss" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                {t("founder.eyebrow")}
              </span>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
              {/* Portrait — line-only silhouette (no fill, matches brand). */}
              <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-sm border border-ink bg-paper p-12">
                <PersonPortrait className="mx-auto h-full w-auto text-moss" />
                <span className="absolute left-3 top-3 z-10 h-2 w-2 border-l border-t border-ink" aria-hidden />
                <span className="absolute right-3 top-3 z-10 h-2 w-2 border-r border-t border-ink" aria-hidden />
                <span className="absolute bottom-3 left-3 z-10 h-2 w-2 border-b border-l border-ink" aria-hidden />
                <span className="absolute bottom-3 right-3 z-10 h-2 w-2 border-b border-r border-ink" aria-hidden />
                <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.1em] text-stone">
                  elliot · gjøvik
                </span>
              </div>
              {/* Bio */}
              <div>
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink">
                  {t("founder.title")}
                </h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
                  {t("founder.role")}
                </p>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                  {t("founder.body")}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center rounded-sm bg-moss px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-moss-deep"
                  >
                    {t("founder.cta")}
                  </a>
                  <a
                    href="https://www.linkedin.com/company/aaen-studios/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-sm border border-ink bg-paper-deep px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-moss hover:text-moss"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Ellipog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-sm border border-ink bg-paper-deep px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-moss hover:text-moss"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Three areas — contour icons */}
      <section className="border-b border-stone-soft/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              {isNo ? "Tre områder" : "Three areas"}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {areas.map((area, i) => (
              <Reveal key={area.key} delay={i * 0.1} as="div">
                <article className="flex h-full flex-col rounded-sm border border-stone-soft/60 bg-paper-deep/40 p-8">
                  <AreaIcon kind={area.key} />
                  <h3 className="mt-4 font-display text-2xl font-medium text-ink">
                    {t(`areas.${area.key}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-ink-soft">
                    {t(`areas.${area.key}.body`)}
                  </p>
                  <a
                    href={area.href}
                    className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-moss hover:underline"
                  >
                    {isNo ? "Se mer" : "See more"} →
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal>
            <ContourMark className="mx-auto h-16 w-16 text-moss" />
            <h2 className="mt-8 font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
              {t("contactCta.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-display text-lg leading-relaxed text-ink-soft">
              {t("contactCta.body")}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button href="/#kontakt">
                {t("contactCta.cta")}
              </Button>
              <Button href={`mailto:${CONTACT_EMAIL}`} variant="secondary">
                {CONTACT_EMAIL}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
