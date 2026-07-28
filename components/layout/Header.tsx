"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ContourLockup } from "@/components/ui/ContourMark";
import { LocaleSwitch } from "./LocaleSwitch";

/**
 * In-page section anchors. On the homepage these scroll smoothly to the
 * section; on other pages (e.g. /om-oss) they navigate back to the homepage
 * root with the hash, so the link always lands somewhere real.
 *
 * "about" is special — it links to the /om-oss page, not an in-page anchor.
 */
const sections = [
  { key: "services", anchor: "prosess" },
  { key: "work", anchor: "arbeid" },
  { key: "pricing", anchor: "priser" },
] as const;

export function Header() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Strip the locale prefix so we know which page we're on.
  // Pathname looks like "/no", "/en", "/no/om-oss", "/en/om-oss", "/".
  const withoutLocale = pathname.replace(/^\/(no|en)(?=\/|$)/, "");
  const isHome = withoutLocale === "" || withoutLocale === "/";

  /** Build a link that scrolls on the homepage, navigates from subpages. */
  function anchorHref(anchor: string): string {
    return isHome ? `#${anchor}` : `/#${anchor}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-soft/50 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="aaen studios — heim">
          <ContourLockup />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <Link
              key={s.key}
              href={anchorHref(s.anchor)}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-moss"
            >
              {t(s.key)}
            </Link>
          ))}
          <Link
            href="/om-oss"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-moss"
            aria-current={pathname.includes("/om-oss") ? "page" : undefined}
          >
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitch className="hidden sm:inline-flex" />
          <Link
            href={anchorHref("kontakt")}
            className="inline-flex items-center rounded-sm bg-moss px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-moss-deep"
          >
            {t("contact")}
          </Link>
          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm p-2 text-ink md:hidden"
            aria-label="Meny"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-stone-soft/50 bg-paper px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {sections.map((s) => (
              <li key={s.key}>
                <Link
                  href={anchorHref(s.anchor)}
                  onClick={() => setOpen(false)}
                  className="block py-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft hover:text-moss"
                >
                  {t(s.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/om-oss"
                onClick={() => setOpen(false)}
                className="block py-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft hover:text-moss"
              >
                {t("about")}
              </Link>
            </li>
            <li className="pt-2">
              <LocaleSwitch />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
