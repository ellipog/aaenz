/**
 * The Lindrig mark for Gjøvik Fysioterapi.
 *
 * A rounded leaf — calm, organic, "healing/growth" rather than the old
 * lightning-bolt "power" mark. Reads as a body returning to ease. Picks its
 * colour from the palette tokens so it works on bone or moss surfaces.
 */

export function PhysioMark({
  onDark = false,
  className,
  size = 32,
}: {
  /** Whether the mark sits on a deep/moss surface (inverts leaf colour). */
  onDark?: boolean;
  className?: string;
  /** Side length of the square mark, in px. */
  size?: number;
}) {
  // On bone: sage-deep leaf. On moss: soft sage leaf.
  const color = onDark ? "var(--physio-sage)" : "var(--physio-sage-deep)";
  const vein = onDark ? "var(--physio-moss)" : "var(--physio-paper)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* A teardrop leaf, vein down the middle. */}
      <path
        d="M16 3 C 7 9, 6 20, 16 29 C 26 20, 25 9, 16 3 Z"
        fill={color}
      />
      <path
        d="M16 8 L 16 26"
        stroke={vein}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Full lockup: leaf mark + Fraunces wordmark. Used in the header and footer.
 */
export function PhysioLockup({
  onDark = false,
  showTagline = true,
}: {
  onDark?: boolean;
  showTagline?: boolean;
}) {
  const textColor = onDark ? "var(--physio-paper)" : "var(--physio-moss)";
  const softColor = onDark ? "var(--physio-paper)" : "var(--physio-text-soft)";
  return (
    <span className="flex items-center gap-2.5">
      <PhysioMark onDark={onDark} size={26} />
      <span className="flex flex-col leading-none">
        <span
          className="font-medium tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            color: textColor,
            fontSize: "1.1rem",
            letterSpacing: "-0.01em",
          }}
        >
          Gjøvik{" "}
          <span style={{ color: "var(--physio-sage-deep)" }}>Fysio</span>
        </span>
        {showTagline && (
          <span
            className="mt-1 text-[9px] uppercase tracking-[0.24em]"
            style={{ color: softColor }}
          >
            ro i kroppen
          </span>
        )}
      </span>
    </span>
  );
}
