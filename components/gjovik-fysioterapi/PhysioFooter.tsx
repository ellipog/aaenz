import Link from "next/link";
import type { Locale, Localized } from "@/content/gjovik-fysioterapi";
import {
  tx,
  footer,
  contact,
  clinic,
  nav,
} from "@/content/gjovik-fysioterapi";
import { PhysioLockup } from "./PhysioMark";

const footerNav: { slug: string; label: Localized }[] = [
  { slug: "", label: { no: "Hjem", en: "Home" } },
  { slug: "behandling", label: nav.treatments },
  { slug: "behandlere", label: nav.staff },
  { slug: "kunnskap", label: { no: "Kunnskap", en: "Knowledge" } },
  { slug: "kontakt", label: nav.contact },
];

function linkHref(slug: string, locale: Locale): string {
  const base =
    slug === ""
      ? "/demos/gjovik-fysioterapi"
      : `/demos/gjovik-fysioterapi/${slug}`;
  return `${base}?lang=${locale}`;
}

export function PhysioFooter({ locale }: { locale: Locale }) {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--physio-surface-deep)",
        borderColor: "var(--physio-rule)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand + colophon */}
          <div>
            <PhysioLockup onDark={false} showTagline={false} />
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {tx(footer.colophon, locale)}
            </p>
            <p
              className="mt-3 text-[10px] tracking-[0.14em]"
              style={{ color: "var(--physio-text-soft)" }}
            >
              est. {clinic.established} · {tx(clinic.addressLine, locale)}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4
              className="mb-3 text-xs font-medium tracking-[0.14em]"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {locale === "no" ? "Meny" : "Menu"}
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {footerNav.map((item) => (
                <li key={item.slug || "home"}>
                  <Link
                    href={linkHref(item.slug, locale)}
                    className="transition-colors hover:text-[var(--physio-accent)]"
                  >
                    {tx(item.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="mb-3 text-xs font-medium tracking-[0.14em]"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {tx(contact.eyebrow, locale)}
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "var(--physio-text-soft)" }}
            >
              <li>
                <a
                  href={`mailto:${contact.details.email}`}
                  className="transition-colors hover:text-[var(--physio-accent)]"
                >
                  {contact.details.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.details.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[var(--physio-accent)]"
                >
                  {contact.details.phone}
                </a>
              </li>
              <li>{tx(contact.details.address, locale)}</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4
              className="mb-3 text-xs font-medium tracking-[0.14em]"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {locale === "no" ? "Åpningstider" : "Hours"}
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {contact.details.hours.map((h) => (
                <li key={h.time} className="flex justify-between gap-4">
                  <span>{tx(h.days, locale)}</span>
                  <span
                    className="tabular-nums"
                    style={{ color: "var(--physio-text)" }}
                  >
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center"
          style={{ borderColor: "var(--physio-rule)" }}
        >
          <p
            className="text-[10px] tracking-[0.14em]"
            style={{ color: "var(--physio-text-soft)" }}
          >
            © {new Date().getFullYear()} {clinic.name}
          </p>
          <Link
            href="/"
            className="text-[10px] tracking-[0.14em] transition-colors hover:text-[var(--physio-sage-deep)]"
            style={{ color: "var(--physio-text-soft)" }}
          >
            ↑ {tx(footer.backToAaen, locale)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
