"use client";

import { useEffect, useState } from "react";
import type { Locale, Localized } from "@/content/strand-treverk";
import { tx } from "@/content/strand-treverk";
import { WorkshopMark } from "./WorkshopMark";

type NavItem = { href: string; label: Localized };

const navItems: NavItem[] = [
  { href: "#tjenester", label: { no: "Tjenester", en: "Services" } },
  { href: "#prosjekter", label: { no: "Prosjekter", en: "Work" } },
  { href: "#prosessen", label: { no: "Prosessen", en: "Process" } },
  { href: "#om-meg", label: { no: "Om meg", en: "About" } },
  { href: "#kontakt", label: { no: "Kontakt", en: "Contact" } },
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

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                color: scrolled ? "var(--ws-text-soft)" : "var(--ws-on-dark-soft)",
              }}
            >
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
  );
}
