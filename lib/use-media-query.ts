"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — SSR-safe media query hook.
 * Returns `false` on the server and during the first client render, then
 * updates after mount. Prevents hydration mismatches for responsive-only UI.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the viewport is mobile-width (< 768px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
