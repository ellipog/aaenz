"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Language toggle — switches between `no` and `en`, preserving the path.
 * Norwegian lives at `/`, English at `/en/...` (as-needed prefix).
 */
export function LocaleSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale() as (typeof routing.locales)[number];
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === "no" ? "en" : "no";

  function switchTo(next: "no" | "en") {
    // Strip the current locale segment from the pathname, then let next-intl
    // re-prefix appropriately via router.push.
    const current = params.locale as string | undefined;
    let path = pathname;

    if (current && path.startsWith(`/${current}`)) {
      path = path.slice(`/${current}`.length) || "/";
    }

    // For the default locale (no), the path stays unprefixed.
    const target = next === routing.defaultLocale ? path : `/${next}${path === "/" ? "" : path}`;
    startTransition(() => {
      router.replace(target);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={() => switchTo(otherLocale)}
      disabled={isPending}
      aria-label="Switch language"
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-moss disabled:opacity-50 ${className}`}
    >
      <span className={locale === "no" ? "text-ink" : ""}>NO</span>
      <span aria-hidden className="text-stone-soft">/</span>
      <span className={locale === "en" ? "text-ink" : ""}>EN</span>
    </button>
  );
}
