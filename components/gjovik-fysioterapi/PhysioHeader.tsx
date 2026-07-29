"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale, Localized } from "@/content/gjovik-fysioterapi";
import { nav, clinic, langSwitchTarget } from "@/content/gjovik-fysioterapi";
import { PhysioLockup } from "./PhysioMark";

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
        backgroundColor: scrolled ? "rgba(246,241,233,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--physio-rule)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href={homeHref} aria-label={clinic.name} className="flex items-center">
          <PhysioLockup onDark={false} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.slug);
            return (
              <Link
                key={item.slug}
                href={`/demos/gjovik-fysioterapi/${item.slug}?${qs()}`}
                className="text-sm font-medium tracking-[0.08em] transition-colors"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: active
                    ? "var(--physio-sage-deep)"
                    : "var(--physio-text-soft)",
                }}
              >
                {item.label[locale] ?? item.label.no}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/demos/gjovik-fysioterapi?${qs({ lang: switchTo })}`}
            className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              borderColor: "var(--physio-text)",
              color: "var(--physio-text)",
            }}
          >
            {switchTo === "en" ? "EN" : "NO"}
          </Link>
          <Link
            href={`${homeHref}#booking`}
            className="hidden rounded-full px-5 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 sm:inline-flex"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              backgroundColor: "var(--physio-moss)",
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
            backgroundColor: "rgba(246,241,233,0.97)",
            backdropFilter: "blur(10px)",
            borderColor: "var(--physio-rule)",
          }}
        >
          <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <div className="flex flex-col gap-1">
              <Link
                href={homeHref}
                className="rounded-full px-3 py-2.5 text-sm font-medium tracking-[0.08em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: pathname === "/demos/gjovik-fysioterapi" ? "var(--physio-sage-deep)" : "var(--physio-text-soft)",
                }}
              >
                {locale === "no" ? "Hjem" : "Home"}
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/demos/gjovik-fysioterapi/${item.slug}?${qs()}`}
                  className="rounded-full px-3 py-2.5 text-sm font-medium tracking-[0.08em]"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    color: isActive(item.slug) ? "var(--physio-sage-deep)" : "var(--physio-text-soft)",
                  }}
                >
                  {item.label[locale] ?? item.label.no}
                </Link>
              ))}
              <Link
                href={`${homeHref}#booking`}
                className="mt-2 rounded-full px-3 py-2.5 text-center text-sm font-medium"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  backgroundColor: "var(--physio-moss)",
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
