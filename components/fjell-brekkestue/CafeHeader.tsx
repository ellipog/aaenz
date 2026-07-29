"use client";

import { useEffect, useState } from "react";
import type { Locale, Localized } from "@/content/fjell-brekkestue";
import { tx } from "@/content/fjell-brekkestue";
import { CafeMark } from "./CafeMark";

type NavItem = { href: string; label: Localized };

const navItems: NavItem[] = [
  { href: "#apningstider", label: { no: "Timer", en: "Hours" } },
  { href: "#meny", label: { no: "Meny", en: "Menu" } },
  { href: "#utsikten", label: { no: "Utsikt", en: "View" } },
  { href: "#historie", label: { no: "Historie", en: "Story" } },
  { href: "#finne-oss", label: { no: "Finne oss", en: "Find us" } },
];

export function CafeHeader({
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
        backgroundColor: scrolled ? "var(--cafe-bg)" : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--cafe-rule)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" aria-label="Fjell Brekkestue" className="flex items-center">
          <CafeMark onDark={!scrolled} />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg italic underline-offset-4 transition-colors hover:underline"
              style={{
                color: scrolled ? "var(--cafe-text-soft)" : "var(--cafe-on-dark-soft)",
              }}
            >
              {tx(item.label, locale)}
            </a>
          ))}
        </nav>

        <a
          href={langSwitchHref}
          className="rounded-[3px] border px-3.5 py-1.5 text-base italic transition-colors"
          style={{
            borderColor: scrolled ? "var(--cafe-accent)" : "var(--cafe-accent-soft)",
            color: scrolled ? "var(--cafe-text)" : "var(--cafe-on-dark)",
          }}
        >
          {langSwitchLabel}
        </a>
      </div>
    </header>
  );
}
