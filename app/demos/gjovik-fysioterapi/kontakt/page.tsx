import {
  type Locale,
  contact,
  pageMeta,
  nav,
} from "@/content/gjovik-fysioterapi";
import { PhysioShell } from "@/components/gjovik-fysioterapi/PhysioShell";
import {
  PhysioSection,
  PageTitle,
  SectionEyebrow,
} from "@/components/gjovik-fysioterapi/shared";
import { PhysioReveal } from "@/components/gjovik-fysioterapi/PhysioReveal";
import { ContactForm } from "@/components/gjovik-fysioterapi/ContactForm";

export const dynamicParams = false;

function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "no";
}

export function generateStaticParams() {
  return [{ lang: "no" }, { lang: "en" }];
}

export default async function KontaktPage({
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
            eyebrow={pageMeta.kontakt.eyebrow}
            title={pageMeta.kontakt.title}
          />
          <p
            className="mt-2 max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {isNo
              ? "Send en melding, ring, eller kom innom. Vi svarer samme dagen — som regel innen et par timer."
              : "Send a message, call, or drop in. We reply the same day — usually within a couple of hours."}
          </p>
        </div>
      </section>

      <PhysioSection>
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
          {/* Form (client) */}
          <PhysioReveal>
            <ContactForm locale={locale} />
          </PhysioReveal>

          {/* Contact details + map */}
          <div className="space-y-8">
            <PhysioReveal>
              <div>
                <SectionEyebrow locale={locale} no={contact.eyebrow.no} en={contact.eyebrow.en} />
                <h3
                  className="mt-4 font-black uppercase tracking-tight"
                  style={{
                    fontFamily: "var(--font-archivo), sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  }}
                >
                  {isNo ? "Ring eller kom innom" : "Call or drop in"}
                </h3>
                <ul className="mt-5 space-y-4">
                  <li>
                    <span
                      className="block text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: "var(--font-archivo), sans-serif",
                        color: "var(--physio-text-soft)",
                      }}
                    >
                      {isNo ? "Telefon" : "Phone"}
                    </span>
                    <a
                      href={`tel:${contact.details.phone.replace(/\s/g, "")}`}
                      className="text-base font-medium transition-colors hover:text-[var(--physio-accent)]"
                    >
                      {contact.details.phone}
                    </a>
                  </li>
                  <li>
                    <span
                      className="block text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: "var(--font-archivo), sans-serif",
                        color: "var(--physio-text-soft)",
                      }}
                    >
                      E-post
                    </span>
                    <a
                      href={`mailto:${contact.details.email}`}
                      className="text-base font-medium transition-colors hover:text-[var(--physio-accent)]"
                    >
                      {contact.details.email}
                    </a>
                  </li>
                  <li>
                    <span
                      className="block text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: "var(--font-archivo), sans-serif",
                        color: "var(--physio-text-soft)",
                      }}
                    >
                      {isNo ? "Adresse" : "Address"}
                    </span>
                    <span className="text-base font-medium">
                      {contact.details.address.no}
                    </span>
                  </li>
                </ul>
              </div>
            </PhysioReveal>

            {/* Hours */}
            <PhysioReveal>
              <div
                className="rounded-[4px] border p-5"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <h4
                  className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    fontFamily: "var(--font-archivo), sans-serif",
                    color: "var(--physio-text-soft)",
                  }}
                >
                  {isNo ? "Åpningstider" : "Opening hours"}
                </h4>
                <ul className="space-y-2 text-sm">
                  {contact.details.hours.map((h) => (
                    <li key={h.time} className="flex justify-between gap-4">
                      <span style={{ color: "var(--physio-text-soft)" }}>
                        {h.days[locale] ?? h.days.no}
                      </span>
                      <span
                        className="font-mono tabular-nums"
                        style={{ color: "var(--physio-text)" }}
                      >
                        {h.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </PhysioReveal>

            {/* Map embed */}
            <PhysioReveal>
              <div
                className="overflow-hidden rounded-[4px] border"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <iframe
                  title="Gjøvik Fysioterapi — kart"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=10.69%2C60.785%2C10.72%2C60.795&layer=mapnik&marker=60.790%2C10.705"
                  className="h-56 w-full"
                  style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg)" }}
                  loading="lazy"
                />
              </div>
              <a
                href="/demos/gjovik-fysioterapi"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] transition-transform hover:translate-x-1"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  color: "var(--physio-accent)",
                }}
              >
                ← {nav.booking[locale] ?? nav.booking.no}
              </a>
            </PhysioReveal>
          </div>
        </div>
      </PhysioSection>
    </PhysioShell>
  );
}
