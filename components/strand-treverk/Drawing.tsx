/**
 * Strand Treverk — drawing-sheet primitives.
 *
 * The "Verksted" direction treats the page as a carpenter's working drawing.
 * These primitives make that systemic rather than a one-off hero flourish:
 *
 *  - `BlueprintGrid`  a faint dotted/dashed graph-paper grid behind a section
 *  - `DimensionCallout`  a dimension line + value box, like an annotation on a plan
 *  - `SpecRow`         a "parts list" row: mono label + value
 *  - `RulerTicks`      a horizontal row of ruled tick marks (a measuring motif)
 *
 * Drawn in the accent (burnt-orange) / graphite so they read as markup, not as
 * UI chrome.
 */

type Props = { className?: string };

/** A faint graph-paper grid laid behind a section. Pointer-events none. */
export function BlueprintGrid({ className }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--ws-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--ws-grid) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
      aria-hidden
    />
  );
}

/** A dimension callout — a small extension line + value box, like a plan note. */
export function DimensionCallout({
  value,
  unit,
  label,
  className,
}: {
  value: string;
  unit?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center ${className ?? ""}`}
      style={{ color: "var(--ws-accent)" }}
    >
      <svg width="2" height="48" aria-hidden>
        <line x1="1" y1="0" x2="1" y2="48" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div
        className="mt-1 border px-3 py-1.5 text-center"
        style={{ borderColor: "currentColor", backgroundColor: "var(--ws-bg)" }}
      >
        <div
          className="font-bold leading-none"
          style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: "1.5rem" }}
        >
          {value}
          {unit ? <span className="ml-1 text-[10px] tracking-[0.1em]">{unit}</span> : null}
        </div>
        {label ? (
          <div
            className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** A parts-list row — mono label on the left, value on the right. */
export function SpecRow({
  label,
  children,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className="flex items-baseline gap-4 border-b pb-2.5"
      style={{ borderColor: "var(--ws-rule)" }}
    >
      <span
        className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-text-soft)" }}
      >
        {label}
      </span>
      <span
        className="font-mono text-xs leading-relaxed"
        style={{
          fontFamily: "var(--font-plex-mono), monospace",
          color: accent ? "var(--ws-accent)" : "var(--ws-text)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/** A row of ruled tick marks — a measuring motif for section edges. */
export function RulerTicks({ count = 24, className }: Props & { count?: number }) {
  return (
    <div
      className={`flex items-center ${className ?? ""}`}
      style={{ color: "var(--ws-accent)" }}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const major = i % 5 === 0;
        return (
          <span
            key={i}
            style={{
              display: "block",
              width: 1,
              height: major ? 10 : 6,
              marginRight: "calc((100% - 1px) / " + (count - 1) + ")",
              backgroundColor: "currentColor",
              opacity: major ? 0.9 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
