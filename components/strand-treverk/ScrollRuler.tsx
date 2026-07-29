"use client";

import { useEffect, useState } from "react";

/**
 * Strand Treverk — the left-edge scroll ruler.
 *
 * A persistent vertical ruler pinned to the left of the viewport. It does two
 * jobs at once: it is a measuring motif (the carpenter's rule) AND it shows
 * scroll progress, marking which section the viewer is in with a tick + label.
 *
 * On small screens it collapses to a thin progress bar (the labels would crowd
 * a phone). Respects reduced-motion: the progress fill is instant, not eased.
 */
type Section = { id: string; label: string };

export function ScrollRuler({ sections }: { sections: Section[] }) {
  const [progress, setProgress] = useState(0); // 0..1 of the whole page
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0);
    };

    // Highlight whichever section is nearest the top of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [sections]);

  return (
    <>
      {/* Desktop: vertical ruler pinned to the left edge */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-12 lg:block"
        aria-hidden
      >
        <div className="relative flex h-full flex-col items-center justify-between py-24">
          {/* The rule's vertical line */}
          <div
            className="absolute left-1/2 top-24 bottom-24 w-px -translate-x-1/2"
            style={{ backgroundColor: "var(--ws-rule)" }}
          />
          {/* The progress fill */}
          <div
            className="absolute left-1/2 top-24 w-px -translate-x-1/2"
            style={{
              height: `calc((100vh - 12rem) * ${progress})`,
              backgroundColor: "var(--ws-accent)",
            }}
          />
          {/* Section ticks + labels */}
          {sections.map((s) => {
            const active = s.id === activeId;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="pointer-events-auto group relative flex items-center gap-2"
              >
                <span
                  className="block w-2.5 -translate-x-1/2 transition-all"
                  style={{
                    height: active ? 16 : 8,
                    width: active ? 3 : 1,
                    backgroundColor: active ? "var(--ws-accent)" : "var(--ws-text-soft)",
                    opacity: active ? 1 : 0.5,
                  }}
                />
                <span
                  className="absolute left-4 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] transition-opacity"
                  style={{
                    fontFamily: "var(--font-plex-mono), monospace",
                    color: active ? "var(--ws-accent)" : "var(--ws-text-soft)",
                    opacity: active ? 1 : 0,
                  }}
                >
                  {s.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Mobile: a thin progress bar across the very top, under the header */}
      <div className="fixed inset-x-0 top-0 z-40 h-[2px] lg:hidden" aria-hidden>
        <div
          className="h-full origin-left"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: "var(--ws-accent)",
          }}
        />
      </div>
    </>
  );
}
