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
import { BlueprintGrid, DimensionCallout, RulerTicks, SpecRow } from "@/components/strand-treverk/Drawing";
import { CaseStudyReader } from "@/components/strand-treverk/CaseStudyReader";

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

      {/* ================================================================ */}
      {/* HERO — a drawing sheet, not a photo backdrop. Asymmetric split:   */}
      {/* the workshop photo on one side, a technical title-block sidebar   */}
      {/* on the other. Reads like the title block of an architect's sheet. */}
      {/* ================================================================ */}
      <section id="top" className="relative w-full overflow-hidden">
        <BlueprintGrid />
        <div className="relative mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 px-5 pt-28 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:pt-20">
          {/* LEFT — the photo pane, full height, slightly inset */}
          <div className="relative order-2 mt-8 aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:order-1 lg:mt-0 lg:h-[calc(100svh-7rem)] lg:aspect-auto">
            <Image
              src={hero.photo}
              alt={tx(story.title, locale)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
            {/* a single dimension callout drawn onto the photo */}
            <div className="absolute right-5 top-1/3 z-10 hidden -translate-y-1/2 sm:block">
              <DimensionCallout
                value="20"
                unit={isNo ? "ÅR" : "YRS"}
                label={isNo ? "MED TREVERK" : "IN TIMBER"}
              />
            </div>
            {/* index stamp on the photo */}
            <span
              className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                color: "var(--ws-on-dark)",
                backgroundColor: "rgba(38,34,27,0.72)",
                padding: "3px 7px",
              }}
            >
              {isNo ? "FIG 1 · VERKSTEDET" : "FIG 1 · THE WORKSHOP"}
            </span>
          </div>

          {/* RIGHT — the title block, pinned, reads like a drawing's title block */}
          <div className="order-1 flex flex-col justify-center py-8 lg:order-2 lg:py-0">
            {/* Eyebrow — sheet index */}
            <p
              className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em]"
              style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
            >
              <WorkshopMark markOnly className="h-4 w-4" />
              {tx(hero.eyebrow, locale)}
            </p>

            {/* The name — mono, heavy, the strongest thing on screen */}
            <h1
              className="mt-6 font-bold uppercase leading-[0.88] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                color: "var(--ws-text)",
                fontSize: "clamp(2.75rem, 7vw, 6rem)",
              }}
            >
              Strand
              <br />
              Treverk
            </h1>

            {/* Accent rule — the burnt-orange dimension line */}
            <span
              className="mt-6 h-[3px] w-16"
              style={{ backgroundColor: "var(--ws-accent)" }}
              aria-hidden
            />

            <p
              className="mt-6 max-w-md text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--ws-text-soft)" }}
            >
              {tx(hero.subtitle, locale)}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
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
                  borderColor: "var(--ws-text)",
                  color: "var(--ws-text)",
                }}
              >
                {tx(hero.secondaryCta, locale)}
              </a>
            </div>

            {/* Title-block metadata — like a drawing sheet's title block */}
            <div className="mt-10 max-w-md border-t pt-5">
              <RulerTicks count={20} className="mb-4 opacity-70" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <TitleBlockField label={isNo ? "Ark" : "Sheet"} value={tx(hero.titleBlock.sheet, locale)} />
                <TitleBlockField label={isNo ? "Skala" : "Scale"} value={tx(hero.titleBlock.scale, locale)} />
                <TitleBlockField label={isNo ? "Tegnet" : "Drawn"} value={tx(hero.titleBlock.drawn, locale)} />
                <TitleBlockField label={isNo ? "År" : "Year"} value={hero.titleBlock.date} />
              </div>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2" aria-hidden>
          <span
            className="block h-10 w-px animate-pulse"
            style={{ backgroundColor: "var(--ws-text-soft)" }}
          />
        </div>
      </section>

      {/* ================================================================ */}
      {/* STATS — three dimension callouts on a rule (narrow band)         */}
      {/* ================================================================ */}
      <section className="border-b" style={{ borderColor: "var(--ws-rule)" }}>
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <RulerTicks count={32} className="mb-8 opacity-60" />
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

      {/* ================================================================ */}
      {/* SERVICES — like a bill of materials (wider, grid of hairlines)   */}
      {/* ================================================================ */}
      <section id="tjenester" className="relative border-b" style={{ borderColor: "var(--ws-rule)" }}>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no="Tjenester" en="Services" />
          <h2 className={headingCls}>
            {isNo ? "Hva jeg" : "What I"}{" "}
            <span style={{ color: "var(--ws-accent)" }}>{isNo ? "bygger" : "build"}</span>
          </h2>

          <div
            className="mt-12 grid gap-px overflow-hidden rounded-[3px] border sm:grid-cols-2"
            style={{ backgroundColor: "var(--ws-rule)", borderColor: "var(--ws-rule)" }}
          >
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
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ws-text-soft)" }}>
                  {tx(s.desc, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MATERIALS / DETAIL — photo + copy, on a surfaced ground          */}
      {/* ================================================================ */}
      <section
        id="materialer"
        className="border-b"
        style={{ backgroundColor: "var(--ws-surface)", borderColor: "var(--ws-rule)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-[3px]">
            <Image
              src={detail.photo}
              alt={tx(detail.title, locale)}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>

          <div>
            <SectionEyebrow locale={locale} no={detail.eyebrow.no} en={detail.eyebrow.en} />
            <h2 className={`${headingCls} max-w-md`}>{tx(detail.title, locale)}</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: "var(--ws-text-soft)" }}>
              {tx(detail.body, locale)}
            </p>
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

      {/* ================================================================ */}
      {/* PORTFOLIO — the annotated case-study reader. Signature section.  */}
      {/* Wider than the rest; each project is a full reader entry.        */}
      {/* ================================================================ */}
      <section id="prosjekter" className="relative border-b" style={{ borderColor: "var(--ws-rule)" }}>
        <BlueprintGrid />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no="Prosjekter" en="Work" />
          <h2 className={`${headingCls} max-w-2xl`}>
            {isNo ? "Noe av det" : "Some of"}{" "}
            <span style={{ color: "var(--ws-accent)" }}>
              {isNo ? "jeg har bygget" : "what I've built"}
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed" style={{ color: "var(--ws-text-soft)" }}>
            {isNo
              ? "Hvert prosjekt er tegnet opp med mål og materialvalg. Bla gjennom — notatene tegner seg selv etter hvert som du ruller."
              : "Each project is drawn up with dimensions and materials. Scroll through — the notes draw themselves in as you go."}
          </p>

          <div className="mt-12 space-y-8">
            {projects.map((p, i) => (
              <CaseStudyReader key={p.id} project={p} index={i} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PROCESS — narrowed to a measured column, like a spec sheet        */}
      {/* ================================================================ */}
      <section
        id="prosessen"
        className="border-b"
        style={{ backgroundColor: "var(--ws-surface)", borderColor: "var(--ws-rule)" }}
      >
        <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no={process.eyebrow.no} en={process.eyebrow.en} />
          <h2 className={headingCls}>{tx(process.title, locale)}</h2>

          <ol className="mt-10 divide-y" style={{ borderColor: "var(--ws-rule)" }}>
            {process.steps.map((step, i) => (
              <li key={i} className="flex gap-6 py-6">
                <div
                  className="font-mono text-sm font-bold tabular-nums"
                  style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-accent)" }}
                >
                  0{i + 1}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ws-text-soft)" }}>
                  {tx(step, locale)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ABOUT — the craftsman + portrait                                  */}
      {/* ================================================================ */}
      <section id="om-meg" className="border-b" style={{ borderColor: "var(--ws-rule)" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px]">
            <Image
              src={story.photo}
              alt={story.person.name}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>

          <div>
            <SectionEyebrow locale={locale} no={story.eyebrow.no} en={story.eyebrow.en} />
            <h2 className={headingCls}>{tx(story.title, locale)}</h2>
            <div className="mt-6 space-y-4">
              {story.body.map((para, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: "var(--ws-text-soft)" }}>
                  {tx(para, locale)}
                </p>
              ))}
            </div>

            <blockquote
              className="mt-8 border-l-2 pl-4"
              style={{ borderColor: "var(--ws-accent)" }}
            >
              <p className="text-base font-medium italic leading-relaxed" style={{ color: "var(--ws-text)" }}>
                “{tx(story.person.quote, locale)}”
              </p>
              <footer
                className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
              >
                {story.person.name} · {tx(story.person.role, locale)}
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CONTACT — the form + direct details                               */}
      {/* ================================================================ */}
      <section id="kontakt">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
            <div>
              <SectionEyebrow locale={locale} no={contact.eyebrow.no} en={contact.eyebrow.en} />
              <h2 className={headingCls}>{tx(contact.title, locale)}</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: "var(--ws-text-soft)" }}>
                {tx(contact.intro, locale)}
              </p>

              <div className="mt-8 space-y-2.5">
                <SpecRow label={isNo ? "E-post" : "Email"}>
                  <a href={`mailto:${contact.details.email}`} className="transition-colors hover:text-[var(--ws-accent)]">
                    {contact.details.email}
                  </a>
                </SpecRow>
                <SpecRow label={isNo ? "Telefon" : "Phone"}>
                  <a href={`tel:${contact.details.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-[var(--ws-accent)]">
                    {contact.details.phone}
                  </a>
                </SpecRow>
                <SpecRow label={isNo ? "Adresse" : "Address"}>
                  {tx(contact.details.address, locale)}
                </SpecRow>
                <SpecRow label={isNo ? "Timer" : "Hours"} accent>
                  {tx(contact.details.hours, locale)}
                </SpecRow>
              </div>
            </div>

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

const headingCls = "mt-4 font-bold uppercase leading-[0.95] tracking-[-0.015em]";

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

/** A title-block field — mono label + value, like a drawing sheet's metadata. */
function TitleBlockField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="font-mono text-[9px] uppercase tracking-[0.16em]"
        style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
      >
        {label}
      </div>
      <div
        className="mt-1 font-mono text-[12px]"
        style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text)" }}
      >
        {value}
      </div>
    </div>
  );
}
