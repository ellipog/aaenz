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
} from "@/content/gjovik-fysioterapi";
import { PhysioShell } from "@/components/gjovik-fysioterapi/PhysioShell";
import {
  PhysioSection,
  SectionEyebrow,
} from "@/components/gjovik-fysioterapi/shared";
import { PhysioReveal, PhysioMotionPanel } from "@/components/gjovik-fysioterapi/PhysioReveal";
import { PhysioMark } from "@/components/gjovik-fysioterapi/PhysioMark";
import { BookingFlow } from "@/components/gjovik-fysioterapi/BookingFlow";

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
      {/* HERO — dark, the cut word "tilbake/back" bleeding into photo */}
      {/* ============================================================ */}
      <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <Image
          src={hero.photo}
          alt={tx(story.title, locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark grade — the Kraft ground pulled over the photo. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,17,22,0.55) 0%, rgba(14,17,22,0.35) 40%, rgba(14,17,22,0.92) 100%)",
          }}
          aria-hidden
        />

        {/* velocity streaks — the signature Kraft element */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[22, 40, 58].map((y, i) => (
            <div
              key={i}
              className="absolute h-px"
              style={{
                top: `${y}%`,
                left: `${8 + i * 6}%`,
                width: `${34 - i * 4}%`,
                background: `linear-gradient(90deg, transparent, var(--physio-accent)${i === 0 ? "" : "66"})`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-20 sm:px-8 sm:pb-24">
          <PhysioReveal from="up">
            <p
              className="mb-4 text-xs font-bold uppercase tracking-[0.28em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
                color: "var(--physio-accent)",
              }}
            >
              {tx(hero.eyebrow, locale)}
            </p>
          </PhysioReveal>

          {/* The headline, with the cut word in accent. */}
          <PhysioReveal delay={0.1}>
            <h1
              className="font-black uppercase leading-[0.88] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
                color: "var(--physio-text)",
                fontSize: "clamp(3rem, 11vw, 9rem)",
              }}
            >
              {isNo ? "Tilbake" : "Back"}
              <br />
              <span style={{ color: "var(--physio-accent)" }}>
                {isNo ? "i aksjon" : "in action"}
              </span>
            </h1>
          </PhysioReveal>

          <PhysioReveal delay={0.2}>
            <p
              className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {tx(hero.subtitle, locale)}
            </p>
          </PhysioReveal>

          <PhysioReveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#booking"
                className="inline-flex items-center rounded-[3px] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  backgroundColor: "var(--physio-accent)",
                  color: "var(--physio-on-accent)",
                }}
              >
                {tx(hero.primaryCta, locale)}
              </a>
              <a
                href="#priser"
                className="inline-flex items-center rounded-[3px] border px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] transition-colors"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  borderColor: "var(--physio-text)",
                  color: "var(--physio-text)",
                }}
              >
                {tx(hero.secondaryCta, locale)}
              </a>
            </div>
          </PhysioReveal>

          {/* Stats strip */}
          <PhysioReveal delay={0.4}>
            <div className="mt-10 flex gap-8">
              {[hero.stat1, hero.stat2, hero.stat3].map((stat, i) => (
                <div key={i}>
                  <div
                    className="font-black leading-none tracking-[-0.02em]"
                    style={{
                      fontFamily: "var(--font-archivo), sans-serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                      color: i === 0 ? "var(--physio-accent)" : "var(--physio-text)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: "var(--font-archivo), sans-serif",
                      color: "var(--physio-text-soft)",
                    }}
                  >
                    {tx(stat.label, locale)}
                  </div>
                </div>
              ))}
            </div>
          </PhysioReveal>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2" aria-hidden>
          <span
            className="block h-10 w-px animate-pulse"
            style={{ backgroundColor: "var(--physio-accent-soft)" }}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* BOOKING — the mock flow */}
      {/* ============================================================ */}
      <PhysioSection id="booking">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div className="md:sticky md:top-28">
            <PhysioReveal>
              <SectionEyebrow locale={locale} no="Bestill time" en="Booking" />
              <h2
                className="mt-4 font-black uppercase leading-[0.92] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                {isNo ? (
                  <>
                    Tre minutter,{" "}
                    <span style={{ color: "var(--physio-accent)" }}>ferdig.</span>
                  </>
                ) : (
                  <>
                    Three minutes,{" "}
                    <span style={{ color: "var(--physio-accent)" }}>done.</span>
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
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
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
              className="h-20 w-20 rounded-[3px] object-cover sm:h-24 sm:w-24"
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
                      ★ {isNo ? "Flaggskip" : "Flagship"}
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
                <div className="mt-4 flex items-center gap-4">
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] transition-transform hover:translate-x-1"
                    style={{
                      fontFamily: "var(--font-archivo), sans-serif",
                      color: "var(--physio-accent)",
                    }}
                  >
                    {isNo ? "Bestill denne" : "Book this"} →
                  </a>
                  <a
                    href={pageHref("behandling", locale)}
                    className="text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:text-[var(--physio-text)]"
                    style={{
                      fontFamily: "var(--font-archivo), sans-serif",
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
            className="hidden text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:text-[var(--physio-accent)] sm:inline"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              color: "var(--physio-text-soft)",
            }}
          >
            {isNo ? "Møt alle" : "Meet all"} →
          </a>
        </div>
        <h2
          className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
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
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px]">
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3
                  className="mt-4 text-lg font-bold uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                >
                  {p.name}
                </h3>
                <p className="text-sm" style={{ color: "var(--physio-accent)" }}>
                  {tx(p.role, locale)}
                </p>
                <p
                  className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em]"
                  style={{ color: "var(--physio-text-soft)" }}
                >
                  {tx(p.specialty, locale)} · {p.years} {isNo ? "år" : "yrs"}
                </p>
                <blockquote
                  className="mt-4 border-l-2 pl-4"
                  style={{ borderColor: "var(--physio-accent)" }}
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
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              }}
            >
              {isNo ? (
                <>
                  En runde i{" "}
                  <span style={{ color: "var(--physio-accent)" }}>styrkerommet.</span>
                </>
              ) : (
                <>
                  A round in the{" "}
                  <span style={{ color: "var(--physio-accent)" }}>strength room.</span>
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
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
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
              className="overflow-hidden rounded-[4px] border"
              style={{ borderColor: "var(--physio-rule)" }}
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
                    <span className="text-sm font-semibold sm:text-base">
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
                    className="font-mono text-base font-bold tabular-nums"
                    style={{ color: "var(--physio-accent)" }}
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
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] md:order-2">
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
              className="mt-4 font-black leading-[1.0] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
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
                    className="font-black leading-none tracking-[-0.02em]"
                    style={{
                      fontFamily: "var(--font-archivo), sans-serif",
                      fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                      color: i === 0 ? "var(--physio-accent)" : "var(--physio-text)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: "var(--font-archivo), sans-serif",
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
            className="hidden text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:text-[var(--physio-accent)] sm:inline"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              color: "var(--physio-text-soft)",
            }}
          >
            {isNo ? "Alle artikler" : "All articles"} →
          </a>
        </div>
        <h2
          className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
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
                className="group flex h-full flex-col overflow-hidden rounded-[4px] border transition-colors hover:border-[var(--physio-accent)]"
                style={{ borderColor: "var(--physio-rule)" }}
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
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "var(--physio-accent)" }}
                  >
                    {tx(article.category, locale)} · {article.readMins}{" "}
                    {isNo ? "min" : "min"}
                  </span>
                  <h3
                    className="mt-3 flex-1 font-bold leading-snug tracking-tight"
                    style={{ fontFamily: "var(--font-archivo), sans-serif" }}
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
                  backgroundColor: "var(--physio-accent)",
                  color: "var(--physio-on-accent)",
                }}
              >
                <PhysioMark onDark={false} size={26} />
              </span>
            </div>
            <h2
              className="font-black uppercase leading-[0.92] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
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
                className="inline-flex items-center rounded-[3px] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  backgroundColor: "var(--physio-accent)",
                  color: "var(--physio-on-accent)",
                }}
              >
                {isNo ? "Kontakt oss" : "Contact us"} →
              </a>
              <a
                href={`mailto:${contact.details.email}`}
                className="inline-flex items-center rounded-[3px] border px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] transition-colors"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  borderColor: "var(--physio-text)",
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
