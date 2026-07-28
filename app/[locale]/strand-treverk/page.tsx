import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { ConceptCard } from "@/components/strand-treverk/ConceptCard";
import { concepts, brief } from "@/content/strand-treverk";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StrandTreverk" });
  return { title: t("title"), description: t("lede") };
}

export default async function StrandTreverkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "StrandTreverk" });
  const isNo = locale === "no";

  return (
    <>
      {/* Hero — framed as a design brief, not the carpenter itself */}
      <section className="relative overflow-hidden border-b border-stone-soft/50">
        <div className="pointer-events-none absolute inset-0 bg-contour-grid" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
          <Reveal>
            <div className="mb-8 flex items-center gap-2.5">
              <span className="block h-px w-8 bg-moss" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                {isNo ? "designkonsept · velg en retning" : "design concept · pick a direction"}
              </span>
            </div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Tag tone="ochre">{isNo ? "Demo" : "Demo"}</Tag>
              <Tag tone="clay">{isNo ? "Vekst-pakke" : "Vekst package"}</Tag>
              <Tag tone="neutral">{isNo ? "Håndverk" : "Trades"}</Tag>
            </div>
            <h1 className="font-display text-5xl font-normal leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Strand Treverk
              <span className="block italic text-moss">
                {isNo ? "seks retninger" : "six directions"}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl font-display text-xl leading-relaxed text-ink-soft">
              {t("lede")}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
              {isNo
                ? "Hver retning har sin egen identitet — farger, typografi, logo-ide og signatur-element. Klikk en for å velge, så bygger jeg den fullt ut med prosjektportefølje, kontaktskjema, og alle seksjonene."
                : "Each direction has its own identity — palette, typography, a logo idea, and a signature element. Pick one, and I'll build it out fully with a project portfolio, contact form, and all the sections."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* The brief — what we're designing for */}
      <section className="border-b border-stone-soft/50 bg-paper-deep/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="block h-px w-6 bg-moss" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                    {isNo ? "klient" : "client"}
                  </span>
                </div>
                <p className="font-display text-lg text-ink">{brief.client.name}</p>
                <p className="text-sm text-ink-soft">
                  {isNo ? brief.client.kind.no : brief.client.kind.en}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="block h-px w-6 bg-moss" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                    {isNo ? "sted" : "location"}
                  </span>
                </div>
                <p className="font-display text-lg text-ink">
                  {isNo ? brief.location.place.no : brief.location.place.en}
                </p>
                <p className="text-sm text-ink-soft">
                  {isNo ? brief.location.detail.no : brief.location.detail.en}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="block h-px w-6 bg-moss" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                    {isNo ? "behov" : "needs"}
                  </span>
                </div>
                <p className="font-display text-lg text-ink">
                  {isNo ? brief.needs.headline.no : brief.needs.headline.en}
                </p>
                <p className="text-sm text-ink-soft">
                  {isNo ? brief.needs.detail.no : brief.needs.detail.en}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="block h-px w-6 bg-moss" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                    {isNo ? "følelse" : "feel"}
                  </span>
                </div>
                <p className="font-display text-lg text-ink">
                  {isNo ? brief.feel.headline.no : brief.feel.headline.en}
                </p>
                <p className="text-sm text-ink-soft">
                  {isNo ? brief.feel.detail.no : brief.feel.detail.en}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The 6 concepts */}
      <section className="border-b border-stone-soft/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <div className="mb-12 flex items-center gap-2.5">
              <span className="block h-px w-8 bg-moss" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                {isNo ? "de seks retningene" : "the six directions"}
              </span>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {concepts.map((concept, i) => (
              <Reveal key={concept.id} delay={i * 0.06} as="div">
                <ConceptCard concept={concept} index={i + 1} locale={isNo ? "no" : "en"} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to pick */}
      <section>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
              {isNo ? "Hvordan velge?" : "How to pick?"}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              {isNo
                ? "Svar med et nummer (1–6), eller si hva du liker ved flere – så kan jeg blande. Når du har valgt, bygger jeg hele snekkersiden med portefølje, kontaktskjema, priser og alle seksjonene."
                : "Reply with a number (1–6), or tell me what you like across several — I can blend them. Once you've picked, I'll build the full carpenter site with portfolio, contact form, pricing, and all the sections."}
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-moss transition-transform hover:translate-x-1 inline-block"
              >
                ← {isNo ? "Tilbake til aaen" : "Back to aaen"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
