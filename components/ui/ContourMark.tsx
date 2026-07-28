/**
 * Aaen Studios primary mark — concentric contour rings closing to a summit.
 * Geometry from branding/assets/svg/mark-primary.svg (canonical source).
 *
 * "Map the terrain before you build" — elevation encoded as line.
 */
type Props = {
  className?: string;
  /** Pulse the summit point — brand motion primitive, respects reduced-motion via CSS. */
  pulse?: boolean;
};

export function ContourMark({ className, pulse }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      role="presentation"
    >
      <g transform="translate(0,4)">
        <path
          d="M24 6 C32 6 40 14 40 22 C40 30 32 34 24 34 C16 34 8 30 8 22 C8 14 16 6 24 6 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.35"
        />
        <path
          d="M24 10 C30 10 36 16 36 22 C36 28 30 31 24 31 C18 31 12 28 12 22 C12 16 18 10 24 10 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.55"
        />
        <path
          d="M24 14 C28 14 32 18 32 22 C32 26 28 28 24 28 C20 28 16 26 16 22 C16 18 20 14 24 14 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.8"
        />
        <ellipse
          cx="24"
          cy="22"
          rx="4"
          ry="3.5"
          fill="currentColor"
          className={pulse ? "animate-pulse-summit" : undefined}
        />
      </g>
    </svg>
  );
}

/** Lockup — the contour mark beside the "aaen studios" wordmark. */
export function ContourLockup({
  className,
  showWord = true,
  reversed = false,
}: {
  className?: string;
  showWord?: boolean;
  reversed?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <ContourMark className={`h-8 w-8 shrink-0 ${reversed ? "text-paper" : "text-moss"}`} />
      {showWord && (
        <span
          className={`font-display text-xl font-medium tracking-tight ${
            reversed ? "text-paper" : "text-ink"
          }`}
        >
          aaen studios
        </span>
      )}
    </span>
  );
}
