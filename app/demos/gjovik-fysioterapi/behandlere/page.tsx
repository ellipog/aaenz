import Image from "next/image";
import {
  type Locale,
  tx,
  team,
  story,
  pageMeta,
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

export default async function BehandlerePage({
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
            eyebrow={pageMeta.behandlere.eyebrow}
            title={pageMeta.behandlere.title}
          />
        </div>
      </section>

      {/* Bios — alternating layout */}
      <PhysioSection>
        <div className="space-y-20">
          {team.map((person, i) => {
            const reversed = i % 2 === 1;
            return (
              <PhysioReveal key={person.id}>
                <article className="grid gap-10 md:grid-cols-2 md:items-center">
                  {/* Photo */}
                  <div
                    className={`relative aspect-[4/5] w-full overflow-hidden rounded-[6px] ${
                      reversed ? "md:order-2" : ""
                    }`}
                  >
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 512px"
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className={reversed ? "md:order-1" : ""}>
                    <span
                      className="font-mono text-xs uppercase tracking-[0.16em]"
                      style={{ color: "var(--physio-accent)" }}
                    >
                      {tx(person.role, locale)}
                    </span>
                    <h3
                      className="mt-2 font-black uppercase leading-[0.95] tracking-tight"
                      style={{
                        fontFamily: "var(--font-archivo), sans-serif",
                        fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                      }}
                    >
                      {person.name}
                    </h3>
                    <p
                      className="mt-2 text-sm font-medium uppercase tracking-[0.1em]"
                      style={{ color: "var(--physio-text-soft)" }}
                    >
                      {tx(person.specialty, locale)} · {person.years}{" "}
                      {isNo ? "år" : "yrs"}
                    </p>

                    <blockquote
                      className="mt-5 border-l-2 pl-4"
                      style={{ borderColor: "var(--physio-accent)" }}
                    >
                      <p
                        className="text-base italic leading-relaxed"
                        style={{ color: "var(--physio-text)" }}
                      >
                        “{tx(person.quote, locale)}”
                      </p>
                    </blockquote>

                    <p
                      className="mt-5 text-sm leading-relaxed"
                      style={{ color: "var(--physio-text-soft)" }}
                    >
                      {tx(person.bio, locale)}
                    </p>

                    {/* Credentials */}
                    <div className="mt-6">
                      <p
                        className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em]"
                        style={{
                          fontFamily: "var(--font-archivo), sans-serif",
                          color: "var(--physio-text-soft)",
                        }}
                      >
                        {isNo ? "Kompetanse" : "Credentials"}
                      </p>
                      <ul className="space-y-1">
                        {person.creds.map((cred, ci) => (
                          <li
                            key={ci}
                            className="flex items-baseline gap-2 text-sm"
                            style={{ color: "var(--physio-text)" }}
                          >
                            <span
                              className="font-mono text-[10px]"
                              style={{ color: "var(--physio-accent)" }}
                            >
                              ▸
                            </span>
                            {tx(cred, locale)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </PhysioReveal>
            );
          })}
        </div>
      </PhysioSection>

      {/* The clinic — story recap */}
      <PhysioSection surface id="klinikken">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] md:order-2">
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
    </PhysioShell>
  );
}
