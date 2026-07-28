import type { Locale } from "@/content/fjell-brekkestue";
import { tx, footer, findus, business } from "@/content/fjell-brekkestue";
import { CafeMark } from "./CafeMark";

export function CafeFooter({ locale }: { locale: Locale }) {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--cafe-surface)",
        borderColor: "var(--cafe-rule)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + colophon */}
          <div>
            <CafeMark />
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--cafe-text-soft)" }}
            >
              {tx(footer.colophon, locale)}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em]">
              <span style={{ color: "var(--cafe-text-soft)" }}>
                {locale === "no" ? "est." : "est."} {business.established} ·{" "}
                {business.elevation}
              </span>
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--cafe-text)" }}
            >
              {locale === "no" ? "Kontakt" : "Contact"}
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "var(--cafe-text-soft)" }}
            >
              <li>
                <a
                  href={`mailto:${findus.contact.email}`}
                  className="transition-colors hover:text-[var(--cafe-accent)]"
                >
                  {findus.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${findus.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[var(--cafe-accent)]"
                >
                  {findus.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${findus.contact.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--cafe-accent)]"
                >
                  {findus.contact.instagram}
                </a>
              </li>
              <li style={{ color: "var(--cafe-text-soft)" }}>
                {tx(findus.contact.addressLine, locale)}
              </li>
            </ul>
          </div>

          {/* Hours quick reference */}
          <div>
            <h4
              className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--cafe-text)" }}
            >
              {locale === "no" ? "Åpent nå" : "Open now"}
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--cafe-text-soft)" }}
            >
              {locale === "no"
                ? "Lørdag–søndag 09–17"
                : "Saturday–Sunday 09–17"}
            </p>
            <p
              className="mt-1 text-xs italic"
              style={{ color: "var(--cafe-text-soft)" }}
            >
              {locale === "no"
                ? "Mens stien er bar."
                : "While the trail is bare."}
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center"
          style={{ borderColor: "var(--cafe-rule)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--cafe-text-soft)" }}
          >
            © {new Date().getFullYear()} Fjell Brekkestue ·{" "}
            {locale === "no" ? "fiktiv kafé" : "a fictional café"}
          </p>
          <a
            href="/"
            className="text-xs font-medium uppercase tracking-[0.12em] transition-colors hover:text-[var(--cafe-accent)]"
            style={{ color: "var(--cafe-text-soft)" }}
          >
            {tx(footer.backToAaen, locale)} →
          </a>
        </div>
      </div>
    </footer>
  );
}
