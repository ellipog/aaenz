import Image from "next/image";
import {
  type Locale,
  tx,
  business,
  hero,
  hours as hoursData,
  seasonNote,
  menu,
  view,
  story,
  findus,
  langSwitchTarget,
} from "@/content/fjell-brekkestue";
import { CafeHeader } from "@/components/fjell-brekkestue/CafeHeader";
import { CafeFooter } from "@/components/fjell-brekkestue/CafeFooter";
import { CafeMark } from "@/components/fjell-brekkestue/CafeMark";

/** Allowed ?lang= values; anything else falls back to "no". */
function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "no";
}

export default async function CafePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const switchTo = langSwitchTarget(locale);

  return (
    <>
      <CafeHeader
        locale={locale}
        langSwitchHref={`?lang=${switchTo}`}
        langSwitchLabel={switchTo === "en" ? "English" : "Norsk"}
      />

      {/* ============================================================ */}
      {/* HERO — the fog photo, with the café name cut as negative space */}
      {/* ============================================================ */}
      <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <Image
          src="/demos/fjell-brekkestue/hero-cabin.jpg"
          alt={tx(view.title, locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Tonal grading — keep the cabin visible up top, darken the bottom
            foreground so the name + copy read against it. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,36,34,0.10) 0%, rgba(28,36,34,0.00) 30%, rgba(28,36,34,0.55) 72%, rgba(28,36,34,0.82) 100%)",
          }}
          aria-hidden
        />

        {/* The hero composition — name + subtitle over the cabin photo.
            The image carries the scene; we keep copy minimal and bottom-left
            where the foreground is darkest. */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-20 sm:px-8 sm:pb-24">
          <p
            className="mb-5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: "var(--cafe-on-dark-soft)" }}
          >
            <CafeMark markOnly className="h-4 w-4" />
            {tx(hero.eyebrow, locale)} · {business.elevation}
          </p>

          {/* The name — solid, legible, the strongest thing on screen. */}
          <h1
            className="relative z-10 font-black uppercase leading-[0.86] tracking-[-0.03em]"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              color: "var(--cafe-on-dark)",
              fontSize: "clamp(2.75rem, 11vw, 8.5rem)",
            }}
          >
            Fjell
            <br />
            Brekkestue
          </h1>

          {/* Accent rule — the one signal-orange line, ties name to subtitle */}
          <span
            className="relative z-10 mt-7 h-[3px] w-16"
            style={{ backgroundColor: "var(--cafe-accent)" }}
            aria-hidden
          />

          <p
            className="relative z-10 mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--cafe-on-dark-soft)" }}
          >
            {tx(hero.subtitle, locale)}
          </p>

          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <a
              href="#meny"
              className="inline-flex items-center rounded-[3px] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--cafe-accent)",
                color: "var(--cafe-on-dark)",
              }}
            >
              {tx(hero.primaryCta, locale)}
            </a>
            <a
              href="#finne-oss"
              className="inline-flex items-center rounded-[3px] border px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] transition-colors"
              style={{
                borderColor: "var(--cafe-on-dark)",
                color: "var(--cafe-on-dark)",
              }}
            >
              {tx(hero.secondaryCta, locale)}
            </a>
          </div>
        </div>

        {/* scroll cue */}
        <div
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
          aria-hidden
        >
          <span
            className="block h-10 w-px animate-pulse"
            style={{ backgroundColor: "var(--cafe-on-dark-soft)" }}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOURS */}
      {/* ============================================================ */}
      <section
        id="apningstider"
        className="border-b"
        style={{ borderColor: "var(--cafe-rule)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <SectionEyebrow locale={locale} no="Åpningstider" en="Opening hours" />
            <h2
              className="mt-4 font-bold uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              {locale === "no" ? "Når vi" : "When we're"}{" "}
              <span style={{ color: "var(--cafe-accent)" }}>
                {locale === "no" ? "fyrer opp" : "lit the stove"}
              </span>
            </h2>
            <p
              className="mt-6 max-w-md text-base leading-relaxed"
              style={{ color: "var(--cafe-text-soft)" }}
            >
              {tx(seasonNote, locale)}
            </p>
          </div>

          {/* Hours table — editorial, ruled lines */}
          <div className="rounded-[4px] border" style={{ borderColor: "var(--cafe-rule)" }}>
            {hoursData.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-6 py-5"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--cafe-rule)",
                }}
              >
                <div className="flex items-center gap-3">
                  {row.current && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{
                        backgroundColor: "var(--cafe-accent)",
                        color: "var(--cafe-on-dark)",
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: "var(--cafe-on-dark)" }}
                      />
                      {locale === "no" ? "Nå" : "Now"}
                    </span>
                  )}
                  <span className="text-sm font-semibold sm:text-base">
                    {tx(row.days, locale)}
                  </span>
                </div>
                <span
                  className="font-mono text-sm tabular-nums"
                  style={{ color: "var(--cafe-text-soft)" }}
                >
                  {tx(row.hours, locale)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MENU */}
      {/* ============================================================ */}
      <section
        id="meny"
        className="border-b"
        style={{
          backgroundColor: "var(--cafe-surface)",
          borderColor: "var(--cafe-rule)",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionEyebrow locale={locale} no="Meny" en="Menu" />
              <h2
                className="mt-4 font-bold uppercase leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {locale === "no" ? "Hva vi serverer" : "What we serve"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/demos/fjell-brekkestue/coffee.jpg"
                alt=""
                width={120}
                height={120}
                className="h-20 w-20 rounded-[3px] object-cover sm:h-24 sm:w-24"
              />
              <p
                className="max-w-[16rem] text-sm italic leading-relaxed"
                style={{ color: "var(--cafe-text-soft)" }}
              >
                {locale === "no"
                  ? "Brygget for hånd. Bakst fra jernet. Ingenting ferdigpakket."
                  : "Hand-brewed. Baked on the iron. Nothing pre-packed."}
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {menu.map((category) => (
              <div key={category.id}>
                <div
                  className="flex items-baseline justify-between border-b pb-3"
                  style={{ borderColor: "var(--cafe-text)" }}
                >
                  <h3 className="text-lg font-bold uppercase tracking-[0.04em]">
                    {tx(category.title, locale)}
                  </h3>
                  {category.note && (
                    <span
                      className="hidden text-xs italic sm:block"
                      style={{ color: "var(--cafe-text-soft)" }}
                    >
                      {tx(category.note, locale)}
                    </span>
                  )}
                </div>
                {category.note && (
                  <p
                    className="mt-2 text-xs italic sm:hidden"
                    style={{ color: "var(--cafe-text-soft)" }}
                  >
                    {tx(category.note, locale)}
                  </p>
                )}
                <ul className="mt-5 space-y-4">
                  {category.items.map((item) => (
                    <li key={tx(item.name, locale)} className="flex items-baseline gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-semibold">
                            {tx(item.name, locale)}
                          </span>
                          {item.signature && (
                            <span
                              className="text-[10px] font-bold uppercase tracking-[0.1em]"
                              style={{ color: "var(--cafe-accent)" }}
                            >
                              ★
                            </span>
                          )}
                        </div>
                        {item.desc && (
                          <p
                            className="mt-0.5 text-sm leading-relaxed"
                            style={{ color: "var(--cafe-text-soft)" }}
                          >
                            {tx(item.desc, locale)}
                          </p>
                        )}
                      </div>
                      {/* dotted leader between name and price */}
                      <span
                        className="mb-1 flex-1"
                        aria-hidden
                        style={{
                          borderBottom: "1px dotted var(--cafe-text-soft)",
                          opacity: 0.4,
                        }}
                      />
                      <span className="font-mono text-base font-medium tabular-nums">
                        {item.price},-
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            className="mt-12 text-xs"
            style={{ color: "var(--cafe-text-soft)" }}
          >
            {locale === "no"
              ? "Alle priser i kroner. Kontanter og Vipps."
              : "All prices in NOK. Cash and Vipps."}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* THE VIEW */}
      {/* ============================================================ */}
      <section
        id="utsikten"
        className="border-b"
        style={{ borderColor: "var(--cafe-rule)" }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no={view.eyebrow.no} en={view.eyebrow.en} />
          <h2
            className="mt-4 max-w-3xl font-bold leading-[1.0] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
          >
            {tx(view.title, locale)}
          </h2>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--cafe-text-soft)" }}
          >
            {tx(view.body, locale)}
          </p>

          {/* The panorama */}
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-[4px]">
            <Image
              src={view.photo}
              alt={tx(view.title, locale)}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "var(--cafe-rule)" }}>
            {view.stats.map((stat, i) => (
              <div key={i}>
                <div
                  className="font-black leading-none tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 3rem)",
                    color: i === 0 ? "var(--cafe-accent)" : "var(--cafe-text)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-2 text-xs uppercase tracking-[0.12em]"
                  style={{ color: "var(--cafe-text-soft)" }}
                >
                  {tx(stat.label, locale)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STORY */}
      {/* ============================================================ */}
      <section
        id="historie"
        className="border-b"
        style={{
          backgroundColor: "var(--cafe-surface)",
          borderColor: "var(--cafe-rule)",
        }}
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1.1fr_1fr] md:items-center">
          {/* Photo */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] md:order-2">
            <Image
              src={story.photo}
              alt={tx(story.title, locale)}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>

          {/* Copy */}
          <div className="md:order-1">
            <SectionEyebrow locale={locale} no={story.eyebrow.no} en={story.eyebrow.en} />
            <h2
              className="mt-4 font-bold leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              {tx(story.title, locale)}
            </h2>
            <div className="mt-6 space-y-4">
              {story.body.map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed"
                  style={{ color: "var(--cafe-text-soft)" }}
                >
                  {tx(para, locale)}
                </p>
              ))}
            </div>

            {/* People / quotes */}
            <div className="mt-8 space-y-5">
              {story.people.map((person) => (
                <blockquote
                  key={person.name}
                  className="border-l-2 pl-4"
                  style={{ borderColor: "var(--cafe-accent)" }}
                >
                  <p
                    className="text-base font-medium italic leading-relaxed"
                    style={{ color: "var(--cafe-text)" }}
                  >
                    “{tx(person.quote, locale)}”
                  </p>
                  <footer className="mt-2">
                    <span className="text-sm font-semibold">{person.name}</span>
                    <span
                      className="ml-2 text-xs uppercase tracking-[0.1em]"
                      style={{ color: "var(--cafe-text-soft)" }}
                    >
                      {tx(person.role, locale)}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FIND US */}
      {/* ============================================================ */}
      <section id="finne-oss">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionEyebrow locale={locale} no={findus.eyebrow.no} en={findus.eyebrow.en} />
          <h2
            className="mt-4 max-w-3xl font-bold leading-[1.0] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
          >
            {tx(findus.title, locale)}
          </h2>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--cafe-text-soft)" }}
          >
            {tx(findus.intro, locale)}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            {/* Steps */}
            <div className="grid gap-6 sm:grid-cols-3">
              {findus.steps.map((step, i) => (
                <div
                  key={i}
                  className="rounded-[4px] border p-6"
                  style={{
                    backgroundColor: "var(--cafe-bg)",
                    borderColor: "var(--cafe-rule)",
                  }}
                >
                  <div
                    className="font-mono text-sm font-bold tabular-nums"
                    style={{ color: "var(--cafe-accent)" }}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="mt-3 text-base font-bold uppercase tracking-[0.02em]">
                    {tx(step.title, locale)}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--cafe-text-soft)" }}
                  >
                    {tx(step.body, locale)}
                  </p>
                </div>
              ))}
            </div>

            {/* Trail photo */}
            <div className="relative aspect-square w-full overflow-hidden rounded-[4px]">
              <Image
                src={findus.photo}
                alt={locale === "no" ? "Stien opp" : "The trail up"}
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Contact CTA */}
          <div
            className="mt-12 rounded-[4px] p-8 sm:p-10"
            style={{
              backgroundColor: "var(--cafe-text)",
              color: "var(--cafe-on-dark)",
            }}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className="font-bold uppercase tracking-[-0.01em]"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                >
                  {locale === "no" ? "Spør oss direkte" : "Ask us directly"}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--cafe-on-dark-soft)" }}
                >
                  {locale === "no"
                    ? "Vi svarer når vi har dekning. Som oftest samme kveld."
                    : "We reply when we have signal. Usually the same evening."}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <a
                  href={`mailto:${findus.contact.email}`}
                  className="font-mono text-sm font-medium underline-offset-4 hover:underline"
                >
                  {findus.contact.email}
                </a>
                <a
                  href={`tel:${findus.contact.phone.replace(/\s/g, "")}`}
                  className="font-mono text-sm font-medium underline-offset-4 hover:underline"
                  style={{ color: "var(--cafe-on-dark-soft)" }}
                >
                  {findus.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CafeFooter locale={locale} />
    </>
  );
}

/** Small reusable section eyebrow — mono caps label with the peak mark. */
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
      <CafeMark markOnly className="h-3.5 w-3.5" />
      <span
        className="text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: "var(--cafe-accent)" }}
      >
        {locale === "no" ? no : en}
      </span>
    </div>
  );
}
