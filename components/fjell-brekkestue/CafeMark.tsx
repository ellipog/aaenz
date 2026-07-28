/**
 * Fjell Brekkestue — logo / wordmark.
 *
 * Concept 02 "Nedtur" logo idea: a wordmark in a tight heavy grotesque, with a
 * small triangular peak form standing in for the dot on the i. The peak is the
 * one signal-orange accent — it's the only color in the whole identity.
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
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      style={{ color: textColor }}
    >
      <PeakMark className="h-[1em] w-auto" />
      <span
        className="text-[0.95em] font-extrabold uppercase leading-none"
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          letterSpacing: "-0.01em",
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
