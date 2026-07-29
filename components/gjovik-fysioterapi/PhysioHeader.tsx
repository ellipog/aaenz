"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale, Localized } from "@/content/gjovik-fysioterapi";
import { nav, clinic, langSwitchTarget } from "@/content/gjovik-fysioterapi";
import { PhysioLockup } from "./PhysioMark";
import { StatusReadout } from "./StatusReadout";

/**
 * Multi-page nav items for the clinic demo. Each links to a sub-page under
 * /demos/gjovik-fysioterapi/<slug>, preserving ?lang=.
 */
const navItems: { slug: string; label: Localized }[] = [
  { slug: "behandling", label: nav.treatments },
  { slug: "behandlere", label: nav.staff },
  { slug: "kunnskap", label: { no: "Kunnskap", en: "Knowledge" } as Localized },
  { slug: "kontakt", label: nav.contact },
];

export function PhysioHeader({
  locale,
}: {
  locale: Locale;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const langQ = searchParams.get("lang");
  const switchTo = langSwitchTarget(locale);
  // Preserve all current search params when navigating.
  const qs = (extra?: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    if (langQ) p.set("lang", langQ);
    if (extra) Object.entries(extra).forEach(([k, v]) => p.set(k, v));
    return p.toString();
  };
  const homeHref = `/demos/gjovik-fysioterapi?${qs()}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (slug: string) =>
    pathname === `/demos/gjovik-fysioterapi/${slug}`;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? "var(--physio-bg)" : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--physio-rule)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href={homeHref} aria-label={clinic.name} className="flex items-center">
          <PhysioLockup onDark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.slug);
            return (
              <Link
                key={item.slug}
                href={`/demos/gjovik-fysioterapi/${item.slug}?${qs()}`}
                className="text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  color: active
                    ? "var(--physio-accent)"
                    : "var(--physio-text-soft)",
                }}
              >
                {item.label[locale] ?? item.label.no}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <StatusReadout onlineLabel={locale === "no" ? "PÅLINJE" : "ONLINE"} />
          <Link
            href={`/demos/gjovik-fysioterapi?${qs({ lang: switchTo })}`}
            className="rounded-[3px] border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              borderColor: "var(--physio-text)",
              color: "var(--physio-text)",
            }}
          >
            {switchTo === "en" ? "EN" : "NO"}
          </Link>
          <Link
            href={`${homeHref}#booking`}
            className="hidden rounded-[3px] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5 sm:inline-flex"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              backgroundColor: "var(--physio-accent)",
              color: "var(--physio-on-accent)",
            }}
          >
            {nav.booking[locale] ?? nav.booking.no}
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            style={{ color: "var(--physio-text)" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {mobileOpen ? (
                <path
                  d="M5 5 L17 17 M17 5 L5 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <path d="M3 6 H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 11 H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 16 H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="border-t lg:hidden"
          style={{
            backgroundColor: "var(--physio-bg)",
            borderColor: "var(--physio-rule)",
          }}
        >
          <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <div className="flex flex-col gap-1">
              <Link
                href={homeHref}
                className="rounded-[3px] px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.12em]"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  color: pathname === "/demos/gjovik-fysioterapi" ? "var(--physio-accent)" : "var(--physio-text-soft)",
                }}
              >
                {locale === "no" ? "Hjem" : "Home"}
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/demos/gjovik-fysioterapi/${item.slug}?${qs()}`}
                  className="rounded-[3px] px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "var(--font-archivo), sans-serif",
                    color: isActive(item.slug) ? "var(--physio-accent)" : "var(--physio-text-soft)",
                  }}
                >
                  {item.label[locale] ?? item.label.no}
                </Link>
              ))}
              <Link
                href={`${homeHref}#booking`}
                className="mt-2 rounded-[3px] px-3 py-2.5 text-center text-sm font-bold uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  backgroundColor: "var(--physio-accent)",
                  color: "var(--physio-on-accent)",
                }}
              >
                {nav.booking[locale] ?? nav.booking.no}
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
