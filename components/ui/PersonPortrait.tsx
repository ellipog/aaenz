/**
 * PersonPortrait — a simple, universal "profile" avatar placeholder.
 * Circle head + rounded shoulders bust. Filled silhouette.
 */
export function PersonPortrait({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="currentColor"
      aria-hidden
      role="presentation"
      className={className}
    >
      <circle cx="60" cy="44" r="22" />
      <path d="M 18 120 C 18 90, 36 74, 60 74 C 84 74, 102 90, 102 120 Z" />
    </svg>
  );
}
