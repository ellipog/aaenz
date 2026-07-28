import type { Locale } from "@/content/strand-treverk";
import { tx, footer, contact, business } from "@/content/strand-treverk";
import { WorkshopMark } from "./WorkshopMark";

export function WorkshopFooter({ locale }: { locale: Locale }) {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--ws-surface)",
        borderColor: "var(--ws-rule)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + colophon */}
          <div>
            <WorkshopMark />
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--ws-text-soft)" }}
            >
              {tx(footer.colophon, locale)}
            </p>
            <p
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em]"
              style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
            >
              est. {business.established} · {tx(business.tagline, locale)}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text)" }}
            >
              {locale === "no" ? "Kontakt" : "Contact"}
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "var(--ws-text-soft)" }}
            >
              <li>
                <a
                  href={`mailto:${contact.details.email}`}
                  className="transition-colors hover:text-[var(--ws-accent)]"
                >
                  {contact.details.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.details.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[var(--ws-accent)]"
                >
                  {contact.details.phone}
                </a>
              </li>
              <li>{tx(contact.details.address, locale)}</li>
            </ul>
          </div>

          {/* Hours quick reference */}
          <div>
            <h4
              className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text)" }}
            >
              {locale === "no" ? "Verkstedet" : "Workshop"}
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--ws-text-soft)" }}
            >
              {tx(contact.details.hours, locale)}
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center"
          style={{ borderColor: "var(--ws-rule)" }}
        >
          <p className="font-mono text-[11px]" style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}>
            © {new Date().getFullYear()} Strand Treverk ·{" "}
            {locale === "no" ? "fiktiv snekker" : "a fictional carpenter"}
          </p>
          <a
            href="/"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-[var(--ws-accent)]"
            style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
          >
            {tx(footer.backToAaen, locale)} →
          </a>
        </div>
      </div>
    </footer>
  );
}
