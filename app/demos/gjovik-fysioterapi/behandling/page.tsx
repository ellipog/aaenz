import Image from "next/image";
import {
  type Locale,
  tx,
  treatments,
  treatmentPhoto,
  injuryAreas,
  approach,
  photos,
  pageMeta,
  priceRows,
  priceNotes,
} from "@/content/gjovik-fysioterapi";
import { PhysioShell } from "@/components/gjovik-fysioterapi/PhysioShell";
import {
  PhysioSection,
  PageTitle,
  SectionEyebrow,
} from "@/components/gjovik-fysioterapi/shared";
import { PhysioReveal } from "@/components/gjovik-fysioterapi/PhysioReveal";

export const dynamicParams = false;

function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "no";
}

export function generateStaticParams() {
  return [{ lang: "no" }, { lang: "en" }];
}

export default async function BehandlingerPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const isNo = locale === "no";

  return (
    <PhysioShell locale={locale}>
      {/* Page header */}
      <section
        id="top"
        className="relative overflow-hidden border-b pt-32"
        style={{ borderColor: "var(--physio-rule)" }}
      >
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <PageTitle
            locale={locale}
            eyebrow={pageMeta.behandlinger.eyebrow}
            title={pageMeta.behandlinger.title}
          />
        </div>
      </section>

      {/* Treatment catalog */}
      <PhysioSection>
        <div className="grid gap-6 md:grid-cols-2">
          {treatments.map((t, i) => (
            <PhysioReveal key={t.id} delay={i * 0.05} as="article">
              <article
                className="flex h-full flex-col rounded-[4px] border p-6"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-xl font-bold uppercase tracking-tight"
                    style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                  >
                    {tx(t.name, locale)}
                  </h3>
                  {t.flagship && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                      style={{
                        backgroundColor: "var(--physio-accent)",
                        color: "var(--physio-on-accent)",
                      }}
                    >
                      ★
                    </span>
                  )}
                </div>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--physio-accent)" }}
                >
                  {tx(t.punch, locale)}
                </p>
                <p
                  className="mt-4 flex-1 text-sm leading-relaxed"
                  style={{ color: "var(--physio-text-soft)" }}
                >
                  {tx(t.desc, locale)}
                </p>
                <div
                  className="mt-5 flex items-baseline justify-between border-t pt-4"
                  style={{ borderColor: "var(--physio-rule)" }}
                >
                  <span
                    className="font-mono text-xs uppercase tracking-[0.14em]"
                    style={{ color: "var(--physio-text-soft)" }}
                  >
                    {t.duration} min
                  </span>
                  <span className="font-mono text-lg font-bold tabular-nums">
                    {t.price} kr
                  </span>
                </div>
              </article>
            </PhysioReveal>
          ))}
        </div>
      </PhysioSection>

      {/* The approach — four steps */}
      <PhysioSection surface id="slik-jobber-vi">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-start">
          <div className="md:sticky md:top-28">
            <SectionEyebrow locale={locale} no={approach.eyebrow.no} en={approach.eyebrow.en} />
            <h2
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              {tx(approach.title, locale)}
            </h2>
            <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-[4px]">
              <Image
                src={photos.manual}
                alt={tx(approach.title, locale)}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            {approach.steps.map((step, i) => (
              <PhysioReveal key={step.n} delay={i * 0.06}>
                <div
                  className="rounded-[4px] border p-6"
                  style={{ borderColor: "var(--physio-rule)" }}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="font-mono text-2xl font-black tabular-nums"
                      style={{ color: "var(--physio-accent)" }}
                    >
                      {step.n}
                    </span>
                    <div>
                      <h3
                        className="text-lg font-bold uppercase tracking-tight"
                        style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                      >
                        {tx(step.title, locale)}
                      </h3>
                      <p
                        className="mt-1 text-sm leading-relaxed"
                        style={{ color: "var(--physio-text-soft)" }}
                      >
                        {tx(step.body, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              </PhysioReveal>
            ))}
          </div>
        </div>
      </PhysioSection>

      {/* Injury areas — body map */}
      <PhysioSection id="kroppsomrade">
        <SectionEyebrow
          locale={locale}
          no={isNo ? "Hvor gjør det vondt?" : "Where does it hurt?"}
          en={isNo ? "Hvor gjør det vondt?" : "Where does it hurt?"}
        />
        <h2
          className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          {isNo ? "Velg området" : "Pick the area"}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {injuryAreas.map((area, i) => (
            <PhysioReveal key={area.id} delay={i * 0.05}>
              <article
                className="h-full rounded-[4px] border p-6"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <h3
                  className="text-lg font-bold uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                >
                  {tx(area.name, locale)}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--physio-text-soft)" }}
                >
                  {tx(area.common, locale)}
                </p>
                <p
                  className="mt-3 border-t pt-3 text-sm leading-relaxed"
                  style={{ borderColor: "var(--physio-rule)", color: "var(--physio-accent)" }}
                >
                  {tx(area.approach, locale)}
                </p>
              </article>
            </PhysioReveal>
          ))}
        </div>
      </PhysioSection>

      {/* Pricing recap */}
      <PhysioSection surface id="priser">
        <SectionEyebrow locale={locale} no="Priser" en="Pricing" />
        <h2
          className="mt-4 max-w-2xl font-black uppercase leading-[0.95] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          {isNo ? "Tydelig pris" : "Clear price"}
        </h2>
        <div
          className="mt-10 max-w-2xl overflow-hidden rounded-[4px] border"
          style={{ borderColor: "var(--physio-rule)" }}
        >
          {priceRows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-6 py-4"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--physio-rule)",
              }}
            >
              <span className="text-sm font-semibold sm:text-base">
                {tx(row.label, locale)}
              </span>
              <span
                className="font-mono text-base font-bold tabular-nums"
                style={{ color: "var(--physio-accent)" }}
              >
                {row.price}
              </span>
            </div>
          ))}
        </div>
        <p
          className="mt-6 max-w-2xl text-xs leading-relaxed"
          style={{ color: "var(--physio-text-soft)" }}
        >
          {tx(priceNotes.refund, locale)}
        </p>

        <a
          href="/demos/gjovik-fysioterapi"
          className="mt-8 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] transition-transform hover:translate-x-1"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            color: "var(--physio-accent)",
          }}
        >
          {isNo ? "Til bestilling" : "To booking"} →
        </a>
      </PhysioSection>
    </PhysioShell>
  );
}
