import Image from "next/image";
import {
  type Locale,
  tx,
  business,
  hero,
  services,
  projects,
  detail,
  process,
  story,
  contact,
  langSwitchTarget,
} from "@/content/strand-treverk";
import { WorkshopHeader } from "@/components/strand-treverk/WorkshopHeader";
import { WorkshopFooter } from "@/components/strand-treverk/WorkshopFooter";
import { WorkshopMark } from "@/components/strand-treverk/WorkshopMark";
import { WorkshopContactForm } from "@/components/strand-treverk/WorkshopContactForm";

/** Allowed ?lang= values; anything else falls back to "no". */
function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "no";
}

export default async function WorkshopPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const switchTo = langSwitchTarget(locale);
  const isNo = locale === "no";

  return (
    <>
      <WorkshopHeader
        locale={locale}
        langSwitchHref={`?lang=${switchTo}`}
        langSwitchLabel={switchTo === "en" ? "English" : "Norsk"}
      />

      {/* ============================================================ */}
      {/* HERO — the workshop photo, with a dimension annotation overlaid */}
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
        {/* Tonal grading — warm/darken so the kraft-graphite text reads */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(38,34,27,0.30) 0%, rgba(38,34,27,0.10) 30%, rgba(38,34,27,0.72) 100%)",
          }}
          aria-hidden
        />

        {/* The hero composition */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-20 sm:px-8 sm:pb-24">
          {/* Eyebrow — mono caption, like a drawing title block */}
          <p
            className="mb-5 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em]"
            style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-on-dark-soft)" }}
          >
            <WorkshopMark markOnly className="h-4 w-4" />
            {tx(hero.eyebrow, locale)}
          </p>

          {/* The name — mono, heavy, the strongest thing on screen */}
          <h1
            className="relative z-10 font-bold uppercase leading-[0.9] tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-plex-mono), monospace",
              color: "var(--ws-on-dark)",
              fontSize: "clamp(2.5rem, 10vw, 7.5rem)",
            }}
          >
            Strand
            <br />
            Treverk
          </h1>

          {/* Accent rule — the burnt-orange dimension line */}
          <span
            className="relative z-10 mt-7 h-[3px] w-16"
            style={{ backgroundColor: "var(--ws-accent)" }}
            aria-hidden
          />

          <p
            className="relative z-10 mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--ws-on-dark-soft)" }}
          >
            {tx(hero.subtitle, locale)}
          </p>

          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <a
              href="#prosjekter"
              className="inline-flex items-center rounded-[2px] px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5"
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                backgroundColor: "var(--ws-accent)",
                color: "var(--ws-on-dark)",
              }}
            >
              {tx(hero.primaryCta, locale)}
            </a>
            <a
              href="#kontakt"
              className="inline-flex items-center rounded-[2px] border px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.1em] transition-colors"
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                borderColor: "var(--ws-on-dark)",
                color: "var(--ws-on-dark)",
              }}
            >
              {tx(hero.secondaryCta, locale)}
            </a>
          </div>
        </div>

        {/* Dimension callout on the photo — the workshop signature */}
        <div
          className="absolute right-6 top-1/3 z-10 hidden -translate-y-1/2 sm:block"
          aria-hidden
        >
          <DimensionCallout
            value="20"
            unit={isNo ? "ÅR" : "YRS"}
            label={isNo ? "MED TREVERK" : "IN TIMBER"}
          />
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2" aria-hidden>
          <span
            className="block h-10 w-px animate-pulse"
            style={{ backgroundColor: "var(--ws-on-dark-soft)" }}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* STATS — dimension callouts (the workshop signature) */}
      {/* ============================================================ */}
      <section
        className="border-b"
        style={{ borderColor: "var(--ws-rule)" }}
      >
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="grid grid-cols-3 gap-6">
            {hero.stats.map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <div
                  className="font-bold leading-none tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-plex-mono), monospace",
                    fontSize: "clamp(1.75rem, 4vw, 3rem)",
                    color: i === 0 ? "var(--ws-accent)" : "var(--ws-text)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{
                    fontFamily: "var(--font-plex-mono), monospace",
                    color: "var(--ws-text-soft)",
                  }}
                >
                  {tx(stat.label, locale)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES — like a bill of materials */}
      {/* ============================================================ */}
      <section
        id="tjenester"
        className="border-b"
        style={{ borderColor: "var(--ws-rule)" }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no="Tjenester" en="Services" />
          <h2 className={headingCls}>
            {isNo ? "Hva jeg" : "What I"}{" "}
            <span style={{ color: "var(--ws-accent)" }}>{isNo ? "bygger" : "build"}</span>
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[3px] border sm:grid-cols-2"
            style={{ backgroundColor: "var(--ws-rule)", borderColor: "var(--ws-rule)" }}>
            {services.map((s) => (
              <div key={s.id} className="p-7" style={{ backgroundColor: "var(--ws-bg)" }}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className="text-lg font-bold uppercase tracking-[0.02em]"
                    style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text)" }}
                  >
                    {tx(s.title, locale)}
                  </h3>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-accent)" }}
                  >
                    {tx(s.spec, locale)}
                  </span>
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--ws-text-soft)" }}
                >
                  {tx(s.desc, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MATERIALS / DETAIL — the grain photo + copy */}
      {/* ============================================================ */}
      <section
        id="materialer"
        className="border-b"
        style={{
          backgroundColor: "var(--ws-surface)",
          borderColor: "var(--ws-rule)",
        }}
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1.1fr_1fr] md:items-center">
          {/* Detail photo */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[3px]">
            <Image
              src={detail.photo}
              alt={tx(detail.title, locale)}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>

          {/* Copy */}
          <div>
            <SectionEyebrow locale={locale} no={detail.eyebrow.no} en={detail.eyebrow.en} />
            <h2 className={`${headingCls} max-w-md`}>
              {tx(detail.title, locale)}
            </h2>
            <p
              className="mt-6 max-w-md text-base leading-relaxed"
              style={{ color: "var(--ws-text-soft)" }}
            >
              {tx(detail.body, locale)}
            </p>
            {/* wood-spec callouts */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Eik", "Ask", "Furu", "Lerk"].map((wood) => (
                <span
                  key={wood}
                  className="rounded-[2px] border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "var(--font-plex-mono), monospace",
                    borderColor: "var(--ws-rule)",
                    color: "var(--ws-text-soft)",
                  }}
                >
                  {wood}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PORTFOLIO — the projects, each with a spec callout */}
      {/* ============================================================ */}
      <section
        id="prosjekter"
        className="border-b"
        style={{ borderColor: "var(--ws-rule)" }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no="Prosjekter" en="Work" />
          <h2 className={headingCls}>
            {isNo ? "Noe av det" : "Some of"}{" "}
            <span style={{ color: "var(--ws-accent)" }}>{isNo ? "jeg har bygget" : "what I've built"}</span>
          </h2>

          <div className="mt-12 space-y-8">
            {projects.map((p, i) => (
              <article
                key={p.id}
                className="grid gap-6 rounded-[3px] border p-5 sm:grid-cols-[1.4fr_1fr] sm:p-6"
                style={{ borderColor: "var(--ws-rule)", backgroundColor: "var(--ws-bg)" }}
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] sm:aspect-[16/10]">
                  <Image
                    src={p.photo}
                    alt={tx(p.title, locale)}
                    fill
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-cover"
                  />
                  {/* index stamp */}
                  <span
                    className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      fontFamily: "var(--font-plex-mono), monospace",
                      color: "var(--ws-on-dark)",
                      backgroundColor: "rgba(38,34,27,0.7)",
                      padding: "2px 6px",
                      borderRadius: "2px",
                    }}
                  >
                    0{i + 1} / {p.year}
                  </span>
                </div>

                {/* Copy */}
                <div className="flex flex-col justify-center">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.16em]"
                    style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-accent)" }}
                  >
                    {tx(p.category, locale)}
                  </span>
                  <h3
                    className="mt-2 text-2xl font-bold uppercase tracking-[0.01em]"
                    style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text)" }}
                  >
                    {tx(p.title, locale)}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--ws-text-soft)" }}
                  >
                    {tx(p.blurb, locale)}
                  </p>
                  {/* spec row — place + dimension spec */}
                  <div
                    className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-4 font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: "var(--font-plex-mono), monospace",
                      borderColor: "var(--ws-rule)",
                      color: "var(--ws-text-soft)",
                    }}
                  >
                    <span>◷ {tx(p.place, locale)}</span>
                    <span style={{ color: "var(--ws-accent)" }}>{tx(p.spec, locale)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROCESS — numbered like a drawing revision log */}
      {/* ============================================================ */}
      <section
        id="prosessen"
        className="border-b"
        style={{
          backgroundColor: "var(--ws-surface)",
          borderColor: "var(--ws-rule)",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no={process.eyebrow.no} en={process.eyebrow.en} />
          <h2 className={`${headingCls} max-w-2xl`}>
            {tx(process.title, locale)}
          </h2>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[3px] border sm:grid-cols-2 lg:grid-cols-4"
            style={{ backgroundColor: "var(--ws-rule)", borderColor: "var(--ws-rule)" }}>
            {process.steps.map((step, i) => (
              <li key={i} className="p-7" style={{ backgroundColor: "var(--ws-bg)" }}>
                <div
                  className="font-mono text-sm font-bold tabular-nums"
                  style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-accent)" }}
                >
                  0{i + 1}
                </div>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: "var(--ws-text-soft)" }}
                >
                  {tx(step, locale)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ABOUT — the craftsman + portrait */}
      {/* ============================================================ */}
      <section
        id="om-meg"
        className="border-b"
        style={{ borderColor: "var(--ws-rule)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1fr_1.1fr] md:items-center">
          {/* Portrait */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px]">
            <Image
              src={story.photo}
              alt={story.person.name}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>

          {/* Copy */}
          <div>
            <SectionEyebrow locale={locale} no={story.eyebrow.no} en={story.eyebrow.en} />
            <h2 className={headingCls}>
              {tx(story.title, locale)}
            </h2>
            <div className="mt-6 space-y-4">
              {story.body.map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed"
                  style={{ color: "var(--ws-text-soft)" }}
                >
                  {tx(para, locale)}
                </p>
              ))}
            </div>

            {/* Quote */}
            <blockquote
              className="mt-8 border-l-2 pl-4"
              style={{ borderColor: "var(--ws-accent)" }}
            >
              <p
                className="text-base font-medium italic leading-relaxed"
                style={{ color: "var(--ws-text)" }}
              >
                “{tx(story.person.quote, locale)}”
              </p>
              <footer className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}>
                {story.person.name} · {tx(story.person.role, locale)}
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTACT — the form + direct details */}
      {/* ============================================================ */}
      <section id="kontakt">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
            {/* Left — pitch + details */}
            <div>
              <SectionEyebrow locale={locale} no={contact.eyebrow.no} en={contact.eyebrow.en} />
              <h2 className={headingCls}>
                {tx(contact.title, locale)}
              </h2>
              <p
                className="mt-6 max-w-md text-base leading-relaxed"
                style={{ color: "var(--ws-text-soft)" }}
              >
                {tx(contact.intro, locale)}
              </p>

              <div className="mt-8 space-y-3">
                <ContactRow label={isNo ? "E-post" : "Email"} value={contact.details.email} href={`mailto:${contact.details.email}`} />
                <ContactRow label={isNo ? "Telefon" : "Phone"} value={contact.details.phone} href={`tel:${contact.details.phone.replace(/\s/g, "")}`} />
                <ContactRow label={isNo ? "Adresse" : "Address"} value={tx(contact.details.address, locale)} />
                <ContactRow label={isNo ? "Timer" : "Hours"} value={tx(contact.details.hours, locale)} />
              </div>
            </div>

            {/* Right — the form */}
            <div
              className="rounded-[3px] border p-6 sm:p-8"
              style={{ backgroundColor: "var(--ws-surface)", borderColor: "var(--ws-rule)" }}
            >
              <WorkshopContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <WorkshopFooter locale={locale} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks — the workshop's shared voice                 */
/* ------------------------------------------------------------------ */

const headingCls =
  "mt-4 font-bold uppercase leading-[0.95] tracking-[-0.015em]";

/** Section eyebrow — mono caption with the square mark. */
function SectionEyebrow({
  locale,
  no,
  en,
}: {
  locale: Locale;
  no: string;
  en: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <WorkshopMark markOnly className="h-3.5 w-3.5" />
      <span
        className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-accent)" }}
      >
        {locale === "no" ? no : en}
      </span>
    </div>
  );
}

/** A contact detail row — mono label + value, like a parts list. */
function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span style={{ color: "var(--ws-text)" }}>{value}</span>
  );
  return (
    <div className="flex gap-4 border-b pb-3" style={{ borderColor: "var(--ws-rule)" }}>
      <span
        className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
      >
        {label}
      </span>
      <span className="text-sm" style={{ color: href ? undefined : "var(--ws-text)" }}>
        {href ? (
          <a href={href} className="transition-colors hover:text-[var(--ws-accent)]">
            {content}
          </a>
        ) : (
          content
        )}
      </span>
    </div>
  );
}

/**
 * DimensionCallout — the workshop signature. A dimension line with extension
 * marks and a value, like an annotation on a working drawing. Drawn in the
 * accent (red pencil) so it reads as a markup, not a UI element.
 */
function DimensionCallout({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center" style={{ color: "var(--ws-accent)" }}>
      <svg width="2" height="48" aria-hidden>
        <line x1="1" y1="0" x2="1" y2="48" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div
        className="mt-1 border px-3 py-1.5 text-center"
        style={{
          borderColor: "currentColor",
          backgroundColor: "rgba(38,34,27,0.55)",
        }}
      >
        <div
          className="font-bold leading-none"
          style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: "1.5rem" }}
        >
          {value}
          <span className="ml-1 text-[10px] tracking-[0.1em]">{unit}</span>
        </div>
        <div
          className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em]"
          style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-on-dark-soft)" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
