import { Tag } from "./Tag";

type Props = {
  /** Section number/label shown as a moss outline tag (e.g. "01", "PRISAR"). */
  number?: string;
  title: string;
  /** Italic moss-colored emphasis word appended to the title. */
  emphasis?: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Section header — eyebrow tag + display heading + optional lede.
 * Mirrors the `.sh-hd` + `.sh-in` pattern from branding/index.html.
 */
export function SectionHeading({
  number,
  title,
  emphasis,
  lede,
  align = "left",
  className = "",
}: Props) {
  const isCenter = align === "center";
  return (
    <div
      className={`${isCenter ? "mx-auto max-w-2xl text-center" : ""} ${className}`}
    >
      {number && (
        <div className={isCenter ? "flex justify-center" : ""}>
          <Tag tone="moss">{number}</Tag>
        </div>
      )}
      <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
        {title}{" "}
        {emphasis && <span className="italic text-moss">{emphasis}</span>}
      </h2>
      {lede && (
        <p
          className={`mt-5 font-display text-lg leading-relaxed text-ink-soft ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
