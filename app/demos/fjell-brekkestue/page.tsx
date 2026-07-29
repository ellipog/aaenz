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
      {/* HERO — the fog photo, with the café name in flowing script */}
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
        {/* Tonal grading — warm-graded to match the Arv palette: keep the cabin
            visible up top, deepen the bottom foreground toward forest-ink so
            the script name + copy read against it. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,26,18,0.08) 0%, rgba(20,26,18,0.00) 32%, rgba(18,22,16,0.55) 70%, rgba(16,20,14,0.86) 100%)",
          }}
          aria-hidden
        />
        {/* Paper-grain overlay — the faint texture that gives the page its
            "old" feel. Kept very subtle so it never competes with the photo. */}
        <div className="cafe-grain absolute inset-0" aria-hidden />

        {/* The hero composition — name + subtitle over the cabin photo.
            The image carries the scene; we keep copy minimal and bottom-left
            where the foreground is darkest. */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-20 sm:px-8 sm:pb-24">
          <p
            className="mb-3 flex items-center gap-2.5 text-base italic"
            style={{
              color: "var(--cafe-on-dark-soft)",
              letterSpacing: "0.01em",
            }}
          >
            <CafeMark markOnly className="h-4 w-4" />
            {tx(hero.eyebrow, locale)} · {business.elevation}
          </p>

          {/* The name — the script is the star. Sized large with a soft shadow
              so it lifts off the photograph like a hand-painted sign. */}
          <h1
            className="relative z-10 leading-[0.82]"
            style={{
              fontFamily: "var(--font-allura), cursive",
              fontWeight: 400,
              color: "var(--cafe-on-dark)",
              fontSize: "clamp(4rem, 15vw, 11rem)",
              textShadow: "0 2px 22px rgba(0,0,0,0.42)",
            }}
          >
            Fjell Brekkestue
          </h1>

          {/* Accent rule — the antique-gold hairline tying name to subtitle */}
          <span
            className="relative z-10 mt-8 h-[2px] w-16"
            style={{ backgroundColor: "var(--cafe-accent-soft)" }}
            aria-hidden
          />

          <p
            className="relative z-10 mt-6 max-w-xl text-xl leading-relaxed sm:text-2xl"
            style={{ color: "var(--cafe-on-dark-soft)" }}
          >
            {tx(hero.subtitle, locale)}
          </p>

          <div className="relative z-10 mt-9 flex flex-wrap gap-3">
            <a
              href="#meny"
              className="inline-flex items-center rounded-[3px] px-6 py-3 text-lg italic transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--cafe-accent)",
                color: "var(--cafe-on-dark)",
              }}
            >
              {tx(hero.primaryCta, locale)}
            </a>
            <a
              href="#finne-oss"
              className="inline-flex items-center rounded-[3px] border px-6 py-3 text-lg italic transition-colors"
              style={{
                borderColor: "var(--cafe-accent-soft)",
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
              className="mt-3 leading-[0.95]"
              style={{
                fontFamily: "var(--font-allura), cursive",
                fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
              }}
            >
              {locale === "no" ? "Når vi" : "When we're"}{" "}
              <span style={{ color: "var(--cafe-accent)" }}>
                {locale === "no" ? "fyrer opp" : "lit the stove"}
              </span>
            </h2>
            <p
              className="mt-6 max-w-md text-lg italic leading-relaxed"
              style={{ color: "var(--cafe-text-soft)" }}
            >
              {tx(seasonNote, locale)}
            </p>
          </div>

          {/* Hours table — the ledger: ruled lines, tabular numerals */}
          <div
            className="rounded-[3px] border"
            style={{ borderColor: "var(--cafe-rule)", backgroundColor: "var(--cafe-surface)" }}
          >
            {hoursData.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-6 py-6"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--cafe-rule)",
                }}
              >
                <div className="flex items-center gap-3">
                  {row.current && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-[0.14em]"
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
                  <span className="text-lg" style={{ fontWeight: 500 }}>
                    {tx(row.days, locale)}
                  </span>
                </div>
                <span
                  className="text-lg tabular-nums"
                  style={{ color: "var(--cafe-text-soft)", letterSpacing: "0.02em" }}
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
                className="mt-3 leading-[0.95]"
                style={{
                  fontFamily: "var(--font-allura), cursive",
                  fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
                }}
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
                className="max-w-[16rem] text-base italic leading-relaxed"
                style={{ color: "var(--cafe-text-soft)" }}
              >
                {locale === "no"
                  ? "Brygget for hånd. Bakst fra jernet. Ingenting ferdigpakket."
                  : "Hand-brewed. Baked on the iron. Nothing pre-packed."}
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-x-16 gap-y-14 md:grid-cols-2">
            {menu.map((category) => (
              <div key={category.id}>
                <div
                  className="flex items-baseline justify-between border-b-[1.5px] pb-2"
                  style={{ borderColor: "var(--cafe-text)" }}
                >
                  <h3
                    className="leading-none"
                    style={{
                      fontFamily: "var(--font-allura), cursive",
                      fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                    }}
                  >
                    {tx(category.title, locale)}
                  </h3>
                  {category.note && (
                    <span
                      className="hidden text-sm italic sm:block"
                      style={{ color: "var(--cafe-text-soft)" }}
                    >
                      {tx(category.note, locale)}
                    </span>
                  )}
                </div>
                {category.note && (
                  <p
                    className="mt-2 text-sm italic sm:hidden"
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
                          <span className="text-lg" style={{ fontWeight: 600 }}>
                            {tx(item.name, locale)}
                          </span>
                          {item.signature && (
                            <span
                              className="text-sm"
                              style={{ color: "var(--cafe-accent)" }}
                            >
                              ★
                            </span>
                          )}
                        </div>
                        {item.desc && (
                          <p
                            className="mt-0.5 text-sm italic leading-relaxed"
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
                      <span
                        className="text-lg tabular-nums"
                        style={{ fontWeight: 600 }}
                      >
                        {item.price},-
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            className="mt-12 text-sm italic"
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
            className="mt-3 max-w-3xl leading-[1.0]"
            style={{
              fontFamily: "var(--font-allura), cursive",
              fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
            }}
          >
            {tx(view.title, locale)}
          </h2>
          <p
            className="mt-6 max-w-2xl text-xl leading-relaxed"
            style={{ color: "var(--cafe-text-soft)" }}
          >
            {tx(view.body, locale)}
          </p>

          {/* The panorama */}
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-[3px]">
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
                  className="leading-none"
                  style={{
                    fontFamily: "var(--font-allura), cursive",
                    fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                    color: i === 0 ? "var(--cafe-accent)" : "var(--cafe-text)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-3 text-sm italic"
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
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] md:order-2">
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
              className="mt-3 leading-[1.05]"
              style={{
                fontFamily: "var(--font-allura), cursive",
                fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              }}
            >
              {tx(story.title, locale)}
            </h2>
            <div className="mt-6 space-y-4">
              {story.body.map((para, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed"
                  style={{ color: "var(--cafe-text-soft)" }}
                >
                  {tx(para, locale)}
                </p>
              ))}
            </div>

            {/* People / quotes */}
            <div className="mt-8 space-y-6">
              {story.people.map((person) => (
                <blockquote
                  key={person.name}
                  className="border-l-2 pl-5"
                  style={{ borderColor: "var(--cafe-accent-soft)" }}
                >
                  <p
                    className="text-xl font-medium italic leading-relaxed"
                    style={{ color: "var(--cafe-text)" }}
                  >
                    “{tx(person.quote, locale)}”
                  </p>
                  <footer className="mt-2 flex items-baseline gap-2">
                    <span
                      className="text-base"
                      style={{ fontWeight: 600 }}
                    >
                      {person.name}
                    </span>
                    <span
                      className="text-sm italic"
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
            className="mt-3 max-w-3xl leading-[1.0]"
            style={{
              fontFamily: "var(--font-allura), cursive",
              fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
            }}
          >
            {tx(findus.title, locale)}
          </h2>
          <p
            className="mt-6 max-w-2xl text-xl leading-relaxed"
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
                  className="rounded-[3px] border p-6"
                  style={{
                    backgroundColor: "var(--cafe-bg)",
                    borderColor: "var(--cafe-rule)",
                  }}
                >
                  <div
                    className="text-2xl tabular-nums"
                    style={{
                      fontFamily: "var(--font-allura), cursive",
                      color: "var(--cafe-accent)",
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3
                    className="mt-3 text-xl"
                    style={{ fontWeight: 600 }}
                  >
                    {tx(step.title, locale)}
                  </h3>
                  <p
                    className="mt-2 text-base leading-relaxed"
                    style={{ color: "var(--cafe-text-soft)" }}
                  >
                    {tx(step.body, locale)}
                  </p>
                </div>
              ))}
            </div>

            {/* Trail photo */}
            <div className="relative aspect-square w-full overflow-hidden rounded-[3px]">
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
            className="mt-12 rounded-[3px] p-8 sm:p-10"
            style={{
              backgroundColor: "var(--cafe-text)",
              color: "var(--cafe-on-dark)",
            }}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className="leading-[1.0]"
                  style={{
                    fontFamily: "var(--font-allura), cursive",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                  }}
                >
                  {locale === "no" ? "Spør oss direkte" : "Ask us directly"}
                </h3>
                <p
                  className="mt-3 text-base italic leading-relaxed"
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
                  className="text-lg underline-offset-4 hover:underline"
                  style={{ fontWeight: 500 }}
                >
                  {findus.contact.email}
                </a>
                <a
                  href={`tel:${findus.contact.phone.replace(/\s/g, "")}`}
                  className="text-lg tabular-nums underline-offset-4 hover:underline"
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

/** Small reusable section eyebrow — italic serif label with the peak mark. */
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
        className="text-sm italic"
        style={{ color: "var(--cafe-accent)", letterSpacing: "0.02em" }}
      >
        {locale === "no" ? no : en}
      </span>
    </div>
  );
}
