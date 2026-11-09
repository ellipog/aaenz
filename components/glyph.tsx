/*
 * A product's red glyph, hung small at the shoulder of its name: an accent beside the
 * word rather than a label above it. It scales with the name, never below micro-type.
 */
export default function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="mincho ml-[.16em] inline-block align-top text-[max(13px,.16em)] leading-none text-red"
    >
      {children}
    </span>
  );
}
