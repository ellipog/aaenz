import Image from "next/image";
import {
  type Locale,
  tx,
  articles,
  faq,
  pageMeta,
} from "@/content/gjovik-fysioterapi";
import { PhysioShell } from "@/components/gjovik-fysioterapi/PhysioShell";
import {
  PhysioSection,
  PageTitle,
  SectionEyebrow,
} from "@/components/gjovik-fysioterapi/shared";
import {
  PhysioReveal,
  PhysioMotionPanel,
} from "@/components/gjovik-fysioterapi/PhysioReveal";

export const dynamicParams = false;

function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "no";
}

export function generateStaticParams() {
  return [{ lang: "no" }, { lang: "en" }];
}

export default async function KunnskapPage({
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
            eyebrow={pageMeta.kunnskap.eyebrow}
            title={pageMeta.kunnskap.title}
          />
          <p
            className="mt-2 max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {isNo
              ? "Kort, ærlig og uten oppsalg. Det vi ville sagt til en venn — om skader, trening, og å komme tilbake."
              : "Short, honest, no upselling. What we'd tell a friend — about injuries, training, and coming back."}
          </p>
        </div>
      </section>

      {/* Articles */}
      <PhysioSection>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <PhysioReveal key={article.slug} delay={i * 0.06} as="article">
              <a
                href="#"
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
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: "var(--physio-accent)" }}
                    >
                      {tx(article.category, locale)}
                    </span>
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: "var(--physio-text-soft)" }}
                    >
                      {article.readMins} {isNo ? "min" : "min read"}
                    </span>
                  </div>
                  <h3
                    className="mt-3 flex-1 font-bold leading-snug tracking-tight"
                    style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                  >
                    {tx(article.title, locale)}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--physio-text-soft)" }}
                  >
                    {tx(article.excerpt, locale)}
                  </p>
                  <span
                    className="mt-4 text-xs font-bold uppercase tracking-[0.12em] transition-transform group-hover:translate-x-1"
                    style={{
                      fontFamily: "var(--font-archivo), sans-serif",
                      color: "var(--physio-accent)",
                    }}
                  >
                    {isNo ? "Les" : "Read"} →
                  </span>
                </div>
              </a>
            </PhysioReveal>
          ))}
        </div>
      </PhysioSection>

      {/* Video / motion section */}
      <PhysioSection surface id="video">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div>
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
                ? "Rehabilitering skjer ikke på behandlingsbordet alene. Se hvordan vi bygger styrke som varer — med utstyr, oppfølging og mål som faktisk teller."
                : "Rehab doesn't happen on the treatment table alone. See how we build strength that lasts — with equipment, follow-up, and goals that actually matter."}
            </p>
          </div>
          <PhysioMotionPanel
            caption={isNo ? "klinikken · 0:48" : "the clinic · 0:48"}
          />
        </div>
      </PhysioSection>

      {/* FAQ */}
      <PhysioSection id="faq">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionEyebrow locale={locale} no="FAQ" en="FAQ" />
            <h2
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              {isNo ? "Vanlige spørsmål" : "Common questions"}
            </h2>
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <PhysioReveal key={i} delay={i * 0.04}>
                <details
                  className="group rounded-[4px] border p-5"
                  style={{ borderColor: "var(--physio-rule)" }}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold"
                    style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                  >
                    {tx(item.q, locale)}
                    <span
                      className="font-mono text-xl transition-transform group-open:rotate-45"
                      style={{ color: "var(--physio-accent)" }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--physio-text-soft)" }}
                  >
                    {tx(item.a, locale)}
                  </p>
                </details>
              </PhysioReveal>
            ))}
          </div>
        </div>
      </PhysioSection>
    </PhysioShell>
  );
}
