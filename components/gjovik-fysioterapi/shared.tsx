import type { Locale, Localized } from "@/content/gjovik-fysioterapi";
import { tx } from "@/content/gjovik-fysioterapi";
import { PhysioMark } from "./PhysioMark";

/**
 * Shared presentational helpers for the Gjøvik Fysioterapi demo pages.
 * Pure server components (no client hooks) — safe to use on every page.
 */

/** Section eyebrow — mono caps label with the bolt mark. */
export function SectionEyebrow({
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
      <PhysioMark onDark size={14} />
      <span
        className="text-xs font-bold uppercase tracking-[0.2em]"
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          color: "var(--physio-accent)",
        }}
      >
        {locale === "no" ? no : en}
      </span>
    </div>
  );
}

/** A localized eyebrow that takes a Localized value directly. */
export function LocalizedEyebrow({
  locale,
  value,
}: {
  locale: Locale;
  value: Localized;
}) {
  return <SectionEyebrow locale={locale} no={value.no} en={value.en} />;
}

/** Standard section wrapper with the Kraft border + max width. */
export function PhysioSection({
  id,
  surface = false,
  children,
}: {
  id?: string;
  /** Whether this section sits on the raised surface colour. */
  surface?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-b"
      style={{
        backgroundColor: surface ? "var(--physio-surface)" : undefined,
        borderColor: "var(--physio-rule)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        {children}
      </div>
    </section>
  );
}

/**
 * Build an internal href that preserves the current ?lang= value across
 * multi-page navigation within the demo.
 *
 * The demo lives at /demos/gjovik-fysioterapi and sub-pages at
 * /demos/gjovik-fysioterapi/<slug>. The lang search param is threaded through
 * so language persists as the visitor moves between pages.
 */
export function physioHref(slug: string, locale: Locale): string {
  const base =
    slug === "" || slug === "/"
      ? "/demos/gjovik-fysioterapi"
      : `/demos/gjovik-fysioterapi/${slug.replace(/^\/+/, "")}`;
  return `${base}?lang=${locale}`;
}

/** Resolve a Localized value (re-exported for page convenience). */
export { tx };

/** Page title block — eyebrow + big black display heading. */
export function PageTitle({
  locale,
  eyebrow,
  title,
}: {
  locale: Locale;
  eyebrow: Localized;
  title: Localized;
}) {
  return (
    <div className="mb-12">
      <LocalizedEyebrow locale={locale} value={eyebrow} />
      <h1
        className="mt-4 font-black uppercase leading-[0.92] tracking-[-0.02em]"
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
        }}
      >
        {tx(title, locale)}
      </h1>
    </div>
  );
}
