import Image from "next/image";
import {
  type Locale,
  tx,
  hero,
  treatments,
  therapists,
  priceRows,
  priceNotes,
  bookingDays,
  story,
  treatmentPhoto,
  contact,
  clinic,
  articles,
  pageMeta,
  dashboard,
} from "@/content/gjovik-fysioterapi";
import { PhysioShell } from "@/components/gjovik-fysioterapi/PhysioShell";
import {
  PhysioSection,
  SectionEyebrow,
} from "@/components/gjovik-fysioterapi/shared";
import { PhysioReveal, PhysioMotionPanel } from "@/components/gjovik-fysioterapi/PhysioReveal";
import { PhysioMark } from "@/components/gjovik-fysioterapi/PhysioMark";
import { BookingFlow } from "@/components/gjovik-fysioterapi/BookingFlow";
import { MetricsDashboard } from "@/components/gjovik-fysioterapi/MetricsDashboard";

export const dynamicParams = false;

/** Allowed ?lang= values; anything else falls back to "no". */
function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "no";
}

/**
 * Pre-render both locales statically so the demo is fast and crawlable.
 * Generates /demos/gjovik-fysioterapi?lang=no and ?lang=en at build time.
 */
export function generateStaticParams() {
  return [{ lang: "no" }, { lang: "en" }];
}

function pageHref(slug: string, locale: Locale): string {
  return `/demos/gjovik-fysioterapi/${slug}?lang=${locale}`;
}

export default async function PhysioPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const isNo = locale === "no";

  return (
    <PhysioShell locale={locale}>
      {/* ============================================================ */}
      {/* HERO — calm. Soft sage/clay radial glows behind a copy +       */}
      {/* photo two-column. The headline is a gentle Fraunces phrase;   */}
      {/* no velocity streaks, no telemetry overlay.                    */}
      {/* ============================================================ */}
      <section id="top" className="relative overflow-hidden">
        {/* Soft sage + clay radial glows instead of HUD grid / velocity streaks */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute"
            style={{
              width: "620px",
              height: "620px",
              top: "-180px",
              right: "-160px",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(169,190,160,0.38), transparent 62%)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: "420px",
              height: "420px",
              bottom: "-160px",
              left: "-120px",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(194,135,98,0.20), transparent 62%)",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-36 sm:px-8 md:grid-cols-[1.15fr_0.85fr]">
          {/* Copy */}
          <div>
            <PhysioReveal from="up">
              <p
                className="mb-5 text-xs font-medium uppercase tracking-[0.22em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-sage-deep)",
                }}
              >
                {tx(hero.eyebrow, locale)}
              </p>
            </PhysioReveal>

            <PhysioReveal delay={0.1}>
              <h1
                className="font-light leading-[1.02] tracking-[-0.025em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-moss)",
                  fontSize: "clamp(2.6rem, 6vw, 4.6rem)",
                }}
              >
                {isNo ? "Ro i kroppen." : "Calm in the body."}
                <br />
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--physio-sage-deep)",
                  }}
                >
                  {isNo ? "Veien hjem til bevegelse." : "The way home to movement."}
                </em>
              </h1>
            </PhysioReveal>

            <PhysioReveal delay={0.2}>
              <p
                className="mt-7 max-w-xl text-lg leading-relaxed"
                style={{ color: "var(--physio-text-soft)" }}
              >
                {tx(hero.subtitle, locale)}
              </p>
            </PhysioReveal>

            <PhysioReveal delay={0.3}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    backgroundColor: "var(--physio-moss)",
                    color: "var(--physio-on-accent)",
                  }}
                >
                  {tx(hero.primaryCta, locale)} →
                </a>
                <a
                  href="#dashboard"
                  className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    borderColor: "var(--physio-rule)",
                    color: "var(--physio-text)",
                  }}
                >
                  {tx(hero.secondaryCta, locale)}
                </a>
              </div>
            </PhysioReveal>
          </div>

          {/* Photo panel */}
          <PhysioReveal delay={0.2}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
              <Image
                src={hero.photo}
                alt={tx(story.title, locale)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
              <div
                className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm"
                style={{ backgroundColor: "rgba(251,248,242,0.92)" }}
              >
                <span
                  className="block h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--physio-sage-deep)" }}
                />
                {isNo ? "Ledig time i morgen, kl. 10:30" : "Open slot tomorrow, 10:30"}
              </div>
            </div>
          </PhysioReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DASHBOARD — the performance-lab centerpiece. Live telemetry    */}
      {/* across recovery, operations, outcomes, and a personal check.  */}
      {/* Dense and instrumented — the opposite of Strand's whitespace. */}
      {/* ============================================================ */}
      <PhysioSection id="dashboard">
        <div className="mb-10 max-w-2xl">
          <SectionEyebrow locale={locale} no={dashboard.eyebrow.no} en={dashboard.eyebrow.en} />
          <h2
            className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              color: "var(--physio-moss)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            {tx(dashboard.title, locale)}
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--physio-text-soft)" }}>
            {tx(dashboard.intro, locale)}
          </p>
        </div>
        <PhysioReveal>
          <MetricsDashboard locale={locale} />
        </PhysioReveal>
      </PhysioSection>

      {/* ============================================================ */}
      {/* BOOKING — the mock flow */}
      {/* ============================================================ */}
      <PhysioSection id="booking">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div className="md:sticky md:top-28">
            <PhysioReveal>
              <SectionEyebrow locale={locale} no="Bestill time" en="Booking" />
              <h2
                className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-moss)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                {isNo ? (
                  <>
                    Tre minutter,{" "}
                    <span style={{ color: "var(--physio-sage-deep)" }}>ferdig.</span>
                  </>
                ) : (
                  <>
                    Three minutes,{" "}
                    <span style={{ color: "var(--physio-sage-deep)" }}>done.</span>
                  </>
                )}
              </h2>
              <p
                className="mt-6 max-w-md text-base leading-relaxed"
                style={{ color: "var(--physio-text-soft)" }}
              >
                {isNo
                  ? "Velg behandling, finn en ledig tid, betal med kort. Du får bekreftelse på e-post med én gang. Ingen telefonvent — book når det passer deg."
                  : "Pick a treatment, find an open slot, pay by card. You get an email confirmation straight away. No phone queue — book when it suits you."}
              </p>
            </PhysioReveal>
          </div>

          <PhysioReveal delay={0.1}>
            <BookingFlow
              locale={locale}
              treatments={treatments}
              days={bookingDays}
            />
          </PhysioReveal>
        </div>
      </PhysioSection>

      {/* ============================================================ */}
      {/* TREATMENTS */}
      {/* ============================================================ */}
      <PhysioSection surface id="behandling">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionEyebrow locale={locale} no="Behandling" en="Treatment" />
            <h2
              className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                color: "var(--physio-moss)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              {isNo ? "Hva vi gjør" : "What we do"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src={treatmentPhoto}
              alt=""
              width={120}
              height={120}
              className="h-20 w-20 rounded-[22px] object-cover sm:h-24 sm:w-24"
            />
            <p
              className="max-w-[16rem] text-sm leading-relaxed"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {isNo
                ? "Hendene på kroppen. Diagnosen først, behandlingen etterpå."
                : "Hands on the body. Diagnosis first, treatment after."}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {treatments.map((t, i) => (
            <PhysioReveal key={t.id} delay={i * 0.06} as="article">
              <article
                className="flex h-full flex-col rounded-[22px] border p-7 transition-transform hover:-translate-y-1"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-xl font-medium normal-case tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
                  >
                    {tx(t.name, locale)}
                  </h3>
                  {t.flagship && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[9px] font-medium tracking-[0.1em]"
                      style={{
                        backgroundColor: "var(--physio-clay)",
                        color: "var(--physio-on-accent)",
                      }}
                    >
                      ★ {isNo ? "Flaggskip" : "Flagship"}
                    </span>
                  )}
                </div>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--physio-sage-deep)" }}
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
                    className="text-xs tracking-[0.14em]"
                    style={{ color: "var(--physio-text-soft)" }}
                  >
                    {t.duration} min
                  </span>
                  <span className="text-lg font-semibold tabular-nums" style={{ color: "var(--physio-moss)" }}>
                    {t.price} kr
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1 text-xs font-medium tracking-[0.08em] transition-transform hover:translate-x-1"
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      color: "var(--physio-sage-deep)",
                    }}
                  >
                    {isNo ? "Bestill denne" : "Book this"} →
                  </a>
                  <a
                    href={pageHref("behandling", locale)}
                    className="text-xs font-medium tracking-[0.08em] transition-colors hover:text-[var(--physio-text)]"
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      color: "var(--physio-text-soft)",
                    }}
                  >
                    {isNo ? "Se alle" : "See all"} →
                  </a>
                </div>
              </article>
            </PhysioReveal>
          ))}
        </div>
      </PhysioSection>

      {/* ============================================================ */}
      {/* STAFF */}
      {/* ============================================================ */}
      <PhysioSection id="behandlere">
        <div className="flex items-end justify-between gap-4">
          <SectionEyebrow locale={locale} no="Behandlere" en="Therapists" />
          <a
            href={pageHref("behandlere", locale)}
            className="hidden text-xs font-medium tracking-[0.08em] transition-colors hover:text-[var(--physio-sage-deep)] sm:inline"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              color: "var(--physio-text-soft)",
            }}
          >
            {isNo ? "Møt alle" : "Meet all"} →
          </a>
        </div>
        <h2
          className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            color: "var(--physio-moss)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          {isNo ? "De som fikser deg" : "Who'll fix you"}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {therapists.map((p, i) => (
            <PhysioReveal key={p.id} delay={i * 0.08}>
              <a
                href={pageHref("behandlere", locale)}
                className="group block"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3
                  className="mt-4 text-lg font-medium normal-case tracking-tight"
                  style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
                >
                  {p.name}
                </h3>
                <p className="text-sm" style={{ color: "var(--physio-sage-deep)" }}>
                  {tx(p.role, locale)}
                </p>
                <p
                  className="mt-1 text-[11px] tracking-[0.1em]"
                  style={{ color: "var(--physio-text-soft)" }}
                >
                  {tx(p.specialty, locale)} · {p.years} {isNo ? "år" : "yrs"}
                </p>
                <blockquote
                  className="mt-4 border-l-2 pl-4"
                  style={{ borderColor: "var(--physio-sage)" }}
                >
                  <p
                    className="text-sm italic leading-relaxed"
                    style={{ color: "var(--physio-text)" }}
                  >
                    “{tx(p.quote, locale)}”
                  </p>
                </blockquote>
              </a>
            </PhysioReveal>
          ))}
        </div>
      </PhysioSection>

      {/* ============================================================ */}
      {/* VIDEO / MOTION */}
      {/* ============================================================ */}
      <PhysioSection surface id="video">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
          <PhysioReveal>
            <SectionEyebrow
              locale={locale}
              no={isNo ? "Se hvordan vi jobber" : "See how we work"}
              en={isNo ? "See how we work" : "See how we work"}
            />
            <h2
              className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                color: "var(--physio-moss)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              }}
            >
              {isNo ? (
                <>
                  En pust i{" "}
                  <span style={{ color: "var(--physio-sage-deep)" }}>bevegelsen.</span>
                </>
              ) : (
                <>
                  A breath in{" "}
                  <span style={{ color: "var(--physio-sage-deep)" }}>movement.</span>
                </>
              )}
            </h2>
            <p
              className="mt-5 max-w-md text-base leading-relaxed"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {isNo
                ? "Rehabilitering skjer ikke på behandlingsbordet alene. Vi bygger styrke som varer — med utstyr, oppfølging og mål som faktisk teller."
                : "Rehab doesn't happen on the treatment table alone. We build strength that lasts — with equipment, follow-up, and goals that actually matter."}
            </p>
          </PhysioReveal>
          <PhysioReveal delay={0.1}>
            <PhysioMotionPanel
              caption={isNo ? "klinikken · 0:48" : "the clinic · 0:48"}
            />
          </PhysioReveal>
        </div>
      </PhysioSection>

      {/* ============================================================ */}
      {/* PRICING */}
      {/* ============================================================ */}
      <PhysioSection id="priser">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionEyebrow locale={locale} no="Priser" en="Pricing" />
            <h2
              className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                color: "var(--physio-moss)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              {isNo ? "Tydelig pris" : "Clear price"}
            </h2>
            <p
              className="mt-5 max-w-md text-base leading-relaxed"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {isNo
                ? "Ingen pakker du må kjøpe, ingen skjulte tillegg. Du betaler for timen du får."
                : "No packages you have to buy, no hidden add-ons. You pay for the session you get."}
            </p>
            <p
              className="mt-4 max-w-md text-xs leading-relaxed"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {tx(priceNotes.refund, locale)}
            </p>
          </div>
          <PhysioReveal>
            <div
              className="overflow-hidden rounded-[22px] border"
              style={{ borderColor: "var(--physio-rule)", backgroundColor: "var(--physio-paper)" }}
            >
              {priceRows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--physio-rule)",
                  }}
                >
                  <div>
                    <span className="text-sm font-medium sm:text-base">
                      {tx(row.label, locale)}
                    </span>
                    {row.note && (
                      <span
                        className="ml-2 text-xs italic"
                        style={{ color: "var(--physio-text-soft)" }}
                      >
                        {tx(row.note, locale)}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-base font-semibold tabular-nums"
                    style={{ color: "var(--physio-moss)" }}
                  >
                    {row.price}
                  </span>
                </div>
              ))}
            </div>
          </PhysioReveal>
        </div>
      </PhysioSection>

      {/* ============================================================ */}
      {/* STORY / THE CLINIC */}
      {/* ============================================================ */}
      <PhysioSection surface id="klinikken">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] md:order-2">
            <Image
              src={story.photo}
              alt={tx(story.title, locale)}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>
          <div className="md:order-1">
            <SectionEyebrow locale={locale} no={story.eyebrow.no} en={story.eyebrow.en} />
            <h2
              className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                color: "var(--physio-moss)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              }}
            >
              {tx(story.title, locale)}
            </h2>
            <div className="mt-6 space-y-4">
              {story.body.map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed"
                  style={{ color: "var(--physio-text-soft)" }}
                >
                  {tx(para, locale)}
                </p>
              ))}
            </div>
            <div
              className="mt-8 grid grid-cols-3 gap-6 border-t pt-8"
              style={{ borderColor: "var(--physio-rule)" }}
            >
              {story.stats.map((stat, i) => (
                <div key={i}>
                  <div
                    className="font-medium leading-none tracking-[-0.02em]"
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                      color: i === 0 ? "var(--physio-sage-deep)" : "var(--physio-moss)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-2 text-[10px] tracking-[0.12em]"
                    style={{
                      color: "var(--physio-text-soft)",
                    }}
                  >
                    {tx(stat.label, locale)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PhysioSection>

      {/* ============================================================ */}
      {/* KNOWLEDGE TEASER */}
      {/* ============================================================ */}
      <PhysioSection id="kunnskap">
        <div className="flex items-end justify-between gap-4">
          <SectionEyebrow locale={locale} no="Kunnskap" en="Knowledge" />
          <a
            href={pageHref("kunnskap", locale)}
            className="hidden text-xs font-medium tracking-[0.08em] transition-colors hover:text-[var(--physio-sage-deep)] sm:inline"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              color: "var(--physio-text-soft)",
            }}
          >
            {isNo ? "Alle artikler" : "All articles"} →
          </a>
        </div>
        <h2
          className="mt-5 font-light normal-case leading-[1.02] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            color: "var(--physio-moss)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          {isNo ? "Lær av oss" : "Learn from us"}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <PhysioReveal key={article.slug} delay={i * 0.07} as="article">
              <a
                href={pageHref("kunnskap", locale)}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border transition-colors hover:border-[var(--physio-sage-deep)]"
                style={{ borderColor: "var(--physio-rule)", backgroundColor: "var(--physio-paper)" }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={article.photo}
                    alt={tx(article.title, locale)}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span
                    className="text-[10px] font-medium tracking-[0.14em]"
                    style={{ color: "var(--physio-sage-deep)" }}
                  >
                    {tx(article.category, locale)} · {article.readMins}{" "}
                    {isNo ? "min" : "min"}
                  </span>
                  <h3
                    className="mt-3 flex-1 font-medium leading-snug tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
                  >
                    {tx(article.title, locale)}
                  </h3>
                </div>
              </a>
            </PhysioReveal>
          ))}
        </div>
      </PhysioSection>

      {/* ============================================================ */}
      {/* CONTACT CTA */}
      {/* ============================================================ */}
      <PhysioSection surface id="kontakt">
        <div className="mx-auto max-w-3xl text-center">
          <PhysioReveal>
            <div className="mb-6 flex justify-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--physio-moss)",
                  color: "var(--physio-on-accent)",
                }}
              >
                <PhysioMark onDark size={26} />
              </span>
            </div>
            <h2
              className="font-light normal-case leading-[1.02] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                color: "var(--physio-moss)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              {tx(contact.title, locale)}
            </h2>
            <p
              className="mx-auto mt-5 max-w-xl text-lg leading-relaxed"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {tx(contact.intro, locale)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={pageHref("kontakt", locale)}
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  backgroundColor: "var(--physio-moss)",
                  color: "var(--physio-on-accent)",
                }}
              >
                {isNo ? "Kontakt oss" : "Contact us"} →
              </a>
              <a
                href={`mailto:${contact.details.email}`}
                className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  borderColor: "var(--physio-rule)",
                  color: "var(--physio-text)",
                }}
              >
                {contact.details.email}
              </a>
            </div>
          </PhysioReveal>
        </div>
      </PhysioSection>
    </PhysioShell>
  );
}
