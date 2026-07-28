/**
 * The Kraft logo for Gjøvik Fysioterapi.
 *
 * A power mark: a lightning-bolt spine. The bolt's zig-zag doubles as a
 * stylised spine/vertebrae column — "kraft" (power) read through a body that
 * moves again. Set on the demo's own palette so it works on dark surfaces.
 *
 * The lockup pairs the mark with the wordmark "GJØVIK / FYSIO" stacked in a
 * condensed heavy face — read as a performance lab, not a hospital.
 */
export function PhysioMark({
  onDark = true,
  className,
  size = 32,
}: {
  /** Whether the mark sits on a dark surface (controls default colour). */
  onDark?: boolean;
  className?: string;
  /** Side length of the square mark, in px. */
  size?: number;
}) {
  const color = onDark
    ? "var(--physio-accent)"
    : "var(--physio-text)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* The bolt-spine: a lightning bolt whose zig-zag reads as vertebrae. */}
      <path
        d="M17 2 L 7 17 H 14 L 13 30 L 25 13 H 18 Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full lockup: mark + stacked wordmark. Used in the header and footer.
 */
export function PhysioLockup({
  onDark = true,
  showTagline = true,
}: {
  onDark?: boolean;
  showTagline?: boolean;
}) {
  const textColor = onDark ? "var(--physio-text)" : "var(--physio-text)";
  const softColor = onDark
    ? "var(--physio-text-soft)"
    : "var(--physio-text-soft)";
  return (
    <span className="flex items-center gap-2.5">
      <PhysioMark onDark={onDark} size={30} />
      <span className="flex flex-col leading-none">
        <span
          className="font-black uppercase tracking-tight"
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            color: textColor,
            fontSize: "1.05rem",
            letterSpacing: "0.01em",
          }}
        >
          Gjøvik{" "}
          <span style={{ color: "var(--physio-accent)" }}>Fysio</span>
        </span>
        {showTagline && (
          <span
            className="mt-1 font-mono text-[8px] uppercase tracking-[0.28em]"
            style={{ color: softColor }}
          >
            tilbake i aksjon
          </span>
        )}
      </span>
    </span>
  );
}
