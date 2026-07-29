/**
 * Fjell Brekkestue — logo / wordmark (warm "Arv" revision).
 *
 * Original "Nedtur" idea: a wordmark in a tight heavy grotesque, with a small
 * triangular peak form. The warm revision keeps the peak mark (the one
 * antique-gold accent) but sets the wordmark in the Allura script, so the
 * header lockup reads like a hand-lettered sign instead of a modern logotype.
 *
 * Two variants: `lockup` (mark + wordmark, for headers/footers) and `mark`
 * (just the peak triangle, for favicons / small placements).
 */

type Props = {
  /** Mark only, no wordmark. Good for compact headers / favicons. */
  markOnly?: boolean;
  /** Render in the dark variant (light text) — use on image/dark backgrounds. */
  onDark?: boolean;
  className?: string;
};

export function CafeMark({ markOnly = false, onDark = false, className }: Props) {
  const textColor = onDark ? "var(--cafe-on-dark)" : "var(--cafe-text)";

  if (markOnly) {
    return <PeakMark className={className} />;
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      style={{ color: textColor }}
    >
      <PeakMark className="h-[0.9em] w-auto" />
      <span
        className="leading-none"
        style={{
          fontFamily: "var(--font-allura), cursive",
          fontSize: "1.6em",
          fontWeight: 400,
        }}
      >
        Fjell Brekkestue
      </span>
    </span>
  );
}

/** The triangular peak mark — a sharp ridge silhouette. */
function PeakMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* main peak */}
      <path
        d="M3 21 L12 4 L21 21 Z"
        fill="var(--cafe-accent)"
        stroke="var(--cafe-accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* secondary, smaller ridge behind, lighter */}
      <path
        d="M9 21 L15 12 L21 21 Z"
        fill="var(--cafe-accent-soft)"
        opacity="0.5"
      />
      {/* snow line notch on the main peak */}
      <path
        d="M9.5 11.5 L12 8 L14.5 11.5"
        fill="none"
        stroke="var(--cafe-bg)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
