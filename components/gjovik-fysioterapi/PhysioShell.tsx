"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/content/gjovik-fysioterapi";
import { PhysioHeader } from "./PhysioHeader";
import { PhysioFooter } from "./PhysioFooter";

/**
 * The shared chrome wrapper for every Gjøvik Fysioterapi demo page.
 *
 * Because the demo uses ?lang= (not the [locale] segment), the page component
 * reads the lang param server-side and passes it down. This shell then renders
 * the header (which needs client hooks for scroll + search-params) and footer
 * around the page content.
 *
 * Suspense is required around useSearchParams per Next.js App Router rules.
 */
export function PhysioShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <PhysioHeader locale={locale} />
      </Suspense>
      <main>{children}</main>
      <PhysioFooter locale={locale} />
    </>
  );
}

/** Client helper: read the ?lang= param. Kept here for pages that need it. */
export function useDemoLocale(): Locale {
  const sp = useSearchParams();
  return sp.get("lang") === "en" ? "en" : "no";
}
