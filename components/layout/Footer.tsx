"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ContourLockup } from "@/components/ui/ContourMark";
import { Ridgeline } from "@/components/ui/Ridgeline";
import { CONTACT_EMAIL } from "@/lib/site";

const sections = [
  { key: "services", anchor: "prosess" },
  { key: "work", anchor: "arbeid" },
  { key: "pricing", anchor: "priser" },
] as const;

const LINKEDIN_URL = "https://www.linkedin.com/company/aaen-studios/";
const GITHUB_URL = "https://github.com/aaen-studios";

export function Footer() {
  const t = useTranslations("Nav");
  const tF = useTranslations("Footer");
  const pathname = usePathname();
  const locale = useLocale();
  const withoutLocale = pathname.replace(/^\/(no|en)(?=\/|$)/, "");
  const isHome = withoutLocale === "" || withoutLocale === "/";
  const enPrefix = locale === "en" ? "/en" : "";
  const anchorHref = (anchor: string) =>
    isHome ? `#${anchor}` : `${enPrefix}/#${anchor}`;

  return (
    <>
    <Ridgeline seed={13} bg="var(--color-moss-deep)" fill="var(--color-paper-deep)" tone="paper" className="-mb-px" />
    <footer className="bg-paper-deep">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <ContourLockup />
            <p className="mt-4 max-w-xs font-display text-lg italic text-moss">
              {tF("tagline")}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
              {tF("navTitle")}
            </h3>
            <ul className="mt-4 space-y-2">
              {sections.map((s) => (
                <li key={s.key}>
                  <Link
                    href={anchorHref(s.anchor)}
                    className="text-sm text-ink-soft transition-colors hover:text-moss"
                  >
                    {t(s.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/om-oss"
                  className="text-sm text-ink-soft transition-colors hover:text-moss"
                >
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
              {tF("contactTitle")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-ink-soft transition-colors hover:text-moss"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="text-ink-soft">{tF("location")}</li>
              <li className="text-ink-soft">{tF("established")}</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
              {tF("socialTitle")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-soft transition-colors hover:text-moss"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-soft transition-colors hover:text-moss"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/om-oss"
                  className="text-ink-soft transition-colors hover:text-moss"
                >
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-soft/50 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
            {tF("rights")}
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
