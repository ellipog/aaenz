"use client";

import { useEffect, useState } from "react";
import type { Locale, Localized } from "@/content/strand-treverk";
import { tx } from "@/content/strand-treverk";
import { WorkshopMark } from "./WorkshopMark";
import { ScrollRuler } from "./ScrollRuler";

type NavItem = { href: string; label: Localized };

const navItems: NavItem[] = [
  { href: "#tjenester", label: { no: "Tjenester", en: "Services" } },
  { href: "#prosjekter", label: { no: "Prosjekter", en: "Work" } },
  { href: "#prosessen", label: { no: "Prosessen", en: "Process" } },
  { href: "#om-meg", label: { no: "Om meg", en: "About" } },
  { href: "#kontakt", label: { no: "Kontakt", en: "Contact" } },
];

/** Section labels for the left-edge scroll ruler (kept in sync with the page). */
const rulerSections = [
  { id: "top", label: "00 HERO" },
  { id: "tjenester", label: "01 SERVICES" },
  { id: "materialer", label: "02 MATERIALS" },
  { id: "prosjekter", label: "03 WORK" },
  { id: "prosessen", label: "04 PROCESS" },
  { id: "om-meg", label: "05 ABOUT" },
  { id: "kontakt", label: "06 CONTACT" },
];

export function WorkshopHeader({
  locale,
  langSwitchHref,
  langSwitchLabel,
}: {
  locale: Locale;
  langSwitchHref: string;
  langSwitchLabel: string;
}) {
  // Transparent over the hero, gains a surface once scrolled.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* The left-edge scroll ruler — both nav and motif. */}
      <ScrollRuler sections={rulerSections} />

      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? "var(--ws-bg)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--ws-rule)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" aria-label="Strand Treverk" className="flex items-center">
            <WorkshopMark onDark={!scrolled} />
          </a>

          {/* Section index strip — mono caption anchors, like a drawing legend */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
                style={{
                  fontFamily: "var(--font-plex-mono), monospace",
                  color: scrolled ? "var(--ws-text-soft)" : "var(--ws-on-dark-soft)",
                }}
              >
                <span
                  className="text-[9px] opacity-50"
                  style={{ color: "var(--ws-accent)" }}
                >
                  0{i + 1}
                </span>
                {tx(item.label, locale)}
              </a>
            ))}
          </nav>

          <a
            href={langSwitchHref}
            className="rounded-[2px] border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors"
            style={{
              fontFamily: "var(--font-plex-mono), monospace",
              borderColor: scrolled ? "var(--ws-text)" : "var(--ws-on-dark)",
              color: scrolled ? "var(--ws-text)" : "var(--ws-on-dark)",
            }}
          >
            {langSwitchLabel}
          </a>
        </div>
      </header>
    </>
  );
}
