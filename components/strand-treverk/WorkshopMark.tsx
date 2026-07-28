/**
 * Strand Treverk — logo / wordmark. Concept 02 "Verksted" (workshop).
 *
 * The workshop direction's signature is the dimension line: the logo is a
 * carpenter's square (vinkelhake) — the L-shaped marking tool — with the
 * wordmark in IBM Plex Mono. The burnt-orange accent stands in for a red
 * pencil mark on a working drawing.
 *
 * Variants: `lockup` (mark + wordmark, for headers/footers) and `mark`
 * (just the square, for favicons / compact placements).
 */

type Props = {
  /** Mark only, no wordmark. Good for compact headers / favicons. */
  markOnly?: boolean;
  /** Render in the dark variant (light text) — use on image/dark backgrounds. */
  onDark?: boolean;
  className?: string;
};

export function WorkshopMark({ markOnly = false, onDark = false, className }: Props) {
  const textColor = onDark ? "var(--ws-on-dark)" : "var(--ws-text)";

  if (markOnly) {
    return <SquareMark className={className} />;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      style={{ color: textColor }}
    >
      <SquareMark className="h-[1em] w-auto" />
      <span
        className="text-[0.95em] font-bold uppercase leading-none"
        style={{
          fontFamily: "var(--font-plex-mono), monospace",
          letterSpacing: "0.02em",
        }}
      >
        Strand Treverk
      </span>
    </span>
  );
}

/**
 * The carpenter's square mark — an L (vinkelhake) with a ruled tick.
 * The accent leg + tick are the burnt-orange "pencil mark".
 */
function SquareMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* the square: a thick L */}
      {/* vertical leg (graphite) */}
      <rect x="4" y="3" width="3" height="18" fill="currentColor" />
      {/* horizontal leg (accent — the red pencil mark) */}
      <rect x="4" y="18" width="17" height="3" fill="var(--ws-accent)" />
      {/* ruled tick mark where the two legs meet — the measuring notch */}
      <rect x="9" y="18" width="1" height="3" fill="var(--ws-bg)" />
      <rect x="14" y="18" width="1" height="3" fill="var(--ws-bg)" />
    </svg>
  );
}
