import type { Concept } from "@/content/gjovik-fysioterapi";

/**
 * Renders one design concept as a card with a live mini-hero preview.
 *
 * The preview uses the concept's own palette + fonts via inline styles (scoped
 * to the preview element so it never leaks into the host aaen brand). Each
 * preview is a tiny but real representation of how the clinic hero would feel —
 * not a literal final design, but enough to judge the direction.
 */
export function ConceptCard({
  concept,
  index,
  locale,
}: {
  concept: Concept;
  index: number;
  locale: "no" | "en";
}) {
  const { palette, type } = concept;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-ink bg-paper">
      {/* Live mini-hero preview in the concept's own palette + fonts */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ backgroundColor: palette.bg }}
      >
        {/* fonts for the preview */}
        {type.fontsHref ? (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link rel="stylesheet" href={type.fontsHref} />
        ) : null}

        {/* Concept-specific hero composition */}
        <ConceptHero concept={concept} />

        {/* Index badge — always top-left, mono, in the host brand voice */}
        <span
          className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: palette.textSoft }}
        >
          0{index} / {concept.codename}
        </span>
      </div>

      {/* Description block in the host aaen brand voice */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
          {locale === "no" ? concept.name.no : concept.name.en}
        </h3>
        <p className="mt-1 font-display text-sm italic text-moss">
          {locale === "no" ? concept.tagline.no : concept.tagline.en}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          {locale === "no" ? concept.mood.no : concept.mood.en}
        </p>

        {/* Palette swatches */}
        <div className="mt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
            {locale === "no" ? "palett" : "palette"}
          </p>
          <div className="flex gap-1.5">
            {[
              ["bg", palette.bg],
              ["surface", palette.surface],
              ["accent", palette.accent],
              ["accentSoft", palette.accentSoft],
              ["text", palette.text],
            ].map(([label, color]) => (
              <div key={label} className="flex-1">
                <div
                  className="h-8 w-full rounded-xs border border-stone-soft/60"
                  style={{ backgroundColor: color }}
                  title={`${label}: ${color}`}
                />
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-stone">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Type pairing */}
        <div className="mt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
            {locale === "no" ? "typografi" : "type"}
          </p>
          <div className="flex items-baseline gap-3">
            <span
              className="text-2xl"
              style={{ fontFamily: type.displayStack, color: "var(--color-ink)" }}
            >
              Aa
            </span>
            <span
              className="text-base text-ink-soft"
              style={{ fontFamily: type.bodyStack }}
            >
              Aa
            </span>
            <span className="ml-auto font-mono text-[10px] text-stone">
              {type.display} / {type.body}
            </span>
          </div>
        </div>

        {/* Signature element */}
        <div className="mt-5 border-t border-stone-soft/40 pt-4">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
            {locale === "no" ? "signatur-element" : "signature"}
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            {locale === "no" ? concept.signature.no : concept.signature.en}
          </p>
        </div>

        {/* Logo idea */}
        <div className="mt-4">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
            {locale === "no" ? "logo-ide" : "logo idea"}
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            {locale === "no" ? concept.logoIdea.no : concept.logoIdea.en}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * The live hero composition for each concept — this is what makes the direction
 * legible at a glance. Each is a small, real-feeling clinic hero rendered in the
 * concept's own palette and fonts.
 */
function ConceptHero({ concept }: { concept: Concept }) {
  const { palette, type } = concept;

  const displayStyle: React.CSSProperties = {
    fontFamily: type.displayStack,
    color: palette.text,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: type.bodyStack,
    color: palette.textSoft,
  };

  switch (concept.id) {
    case "klinikk":
      // Clinical: white, blue, a grid of available appointment slots
      return (
        <div className="absolute inset-0 flex flex-col p-5">
          <h4
            className="text-2xl font-bold tracking-tight"
            style={{ ...displayStyle, color: palette.text }}
          >
            Gjøvik <span style={{ color: palette.accent }}>Fysio</span>
          </h4>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em]" style={bodyStyle}>
            klinikk · bestill time
          </p>
          {/* slot grid */}
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {["Man", "Tir", "Ons", "Tor", "Fre", "Lør"].map((d, i) => (
              <div
                key={d}
                className="rounded-[3px] px-1.5 py-1 text-center text-[9px]"
                style={{
                  fontFamily: type.bodyStack,
                  backgroundColor: i === 2 ? palette.accent : palette.surface,
                  color: i === 2 ? "#fff" : palette.textSoft,
                }}
              >
                <div className="font-semibold">{d}</div>
                <div className="font-mono tabular-nums">
                  {i === 2 ? "14:00" : `${9 + i}:15`}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "varme":
      // Warmth: cream, terracotta, hand-drawn body line
      return (
        <div className="absolute inset-0 overflow-hidden">
          {/* hand-drawn spine/body line */}
          <svg
            className="absolute -right-2 bottom-0 h-3/4 w-2/3 opacity-30"
            viewBox="0 0 120 160"
            fill="none"
            aria-hidden
          >
            {/* spine */}
            <path
              d="M60 10 C 58 40, 62 70, 60 150"
              stroke={palette.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* shoulders */}
            <path
              d="M30 40 C 45 35, 75 35, 90 42"
              stroke={palette.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* arm */}
            <path
              d="M90 42 C 95 60, 92 80, 88 95"
              stroke={palette.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* hip */}
            <path
              d="M35 95 C 50 92, 70 92, 85 96"
              stroke={palette.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* leg */}
            <path
              d="M50 96 C 48 115, 52 135, 50 152"
              stroke={palette.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center p-6">
            <h4
              className="text-3xl leading-none"
              style={{ ...displayStyle, fontWeight: 500 }}
            >
              Gjøvik
            </h4>
            <h4
              className="text-3xl italic leading-tight"
              style={{ ...displayStyle, color: palette.accent, fontWeight: 500 }}
            >
              Fysioterapi
            </h4>
            <p className="mt-3 text-xs italic" style={bodyStyle}>
              omsorg fra første time
            </p>
          </div>
        </div>
      );

    case "kraft":
      // Power: dark, electric lime, velocity lines
      return (
        <div className="absolute inset-0 overflow-hidden">
          {/* velocity streaks */}
          <div className="absolute inset-0" aria-hidden>
            {[18, 34, 50, 66, 82].map((y, i) => (
              <div
                key={i}
                className="absolute h-px"
                style={{
                  top: `${y}%`,
                  left: `${10 + i * 4}%`,
                  width: `${40 - i * 3}%`,
                  background: `linear-gradient(90deg, transparent, ${palette.accent}${i < 2 ? "" : "55"})`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <span
              className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em]"
              style={{ color: palette.accent }}
            >
              tilbake i aksjon
            </span>
            <h4
              className="text-4xl uppercase leading-none tracking-tight"
              style={{ ...displayStyle, color: palette.text, fontWeight: 900 }}
            >
              Gjøvik
            </h4>
            <h4
              className="text-4xl uppercase leading-none tracking-tight"
              style={{ ...displayStyle, color: palette.accent, fontWeight: 900 }}
            >
              Fysio
            </h4>
            {/* injury → back arrow */}
            <div className="mt-4 flex items-center gap-2 text-[10px]" style={bodyStyle}>
              <span style={{ color: palette.textSoft }}>skadet</span>
              <svg width="40" height="8" viewBox="0 0 40 8" aria-hidden>
                <path
                  d="M0 4 H 34"
                  stroke={palette.accent}
                  strokeWidth="1.5"
                />
                <path
                  d="M30 1 L 34 4 L 30 7"
                  fill="none"
                  stroke={palette.accent}
                  strokeWidth="1.5"
                />
              </svg>
              <span style={{ color: palette.accent }} className="font-bold">
                tilbake
              </span>
            </div>
          </div>
        </div>
      );

    case "salong":
      // Salon: monochrome, brass accent, editorial single column
      return (
        <div className="absolute inset-0 flex flex-col p-6">
          <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: palette.text }}>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: palette.textSoft }}>
              est. mmxix
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: palette.accent }}>
              privat klinikk
            </span>
          </div>
          <div className="mt-6 text-center">
            <h4
              className="text-3xl leading-none"
              style={{ ...displayStyle, fontWeight: 500, letterSpacing: "0.01em" }}
            >
              Gjøvik
            </h4>
            <h4
              className="text-xl italic leading-tight"
              style={{ ...displayStyle, color: palette.accent, fontWeight: 400 }}
            >
              Fysioterapi
            </h4>
          </div>
          <p
            className="mt-5 text-center text-[9px] italic leading-relaxed"
            style={{ ...bodyStyle, borderTop: `1px solid ${palette.text}22`, paddingTop: 8 }}
          >
            én time · én pasient · én behandler
          </p>
        </div>
      );

    case "ro":
      // Calm: sage, breathing circle, rounded forms
      return (
        <div className="absolute inset-0 overflow-hidden">
          {/* breathing circle */}
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2"
            width="90"
            height="90"
            viewBox="0 0 90 90"
            aria-hidden
          >
            <circle
              cx="45"
              cy="45"
              r="40"
              fill="none"
              stroke={palette.accent}
              strokeWidth="1"
              opacity="0.3"
            />
            <circle
              cx="45"
              cy="45"
              r="30"
              fill="none"
              stroke={palette.accent}
              strokeWidth="1.5"
              opacity="0.6"
            />
            <circle
              cx="45"
              cy="45"
              r="20"
              fill="none"
              stroke={palette.accent}
              strokeWidth="1"
            />
            {/* open arc — the breath */}
            <path
              d="M 45 25 A 20 20 0 0 1 65 45"
              fill="none"
              stroke={palette.accentSoft}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <span
              className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: palette.textSoft }}
            >
              ro · gjenoppretting
            </span>
            <h4
              className="text-3xl leading-none"
              style={{ ...displayStyle, fontWeight: 500 }}
            >
              Gjøvik
            </h4>
            <h4
              className="text-3xl italic leading-tight"
              style={{ ...displayStyle, color: palette.accent, fontWeight: 500 }}
            >
              Fysioterapi
            </h4>
            <p className="mt-3 text-[11px] italic" style={bodyStyle}>
              hele mennesket, ikke bare skaden
            </p>
          </div>
        </div>
      );

    case "sving":
      // Motion: bright, purple, curved motion path
      return (
        <div className="absolute inset-0 overflow-hidden">
          {/* curved motion path */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M-20 220 C 120 220, 140 80, 280 80 S 420 120, 420 120"
              fill="none"
              stroke={palette.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="0"
            />
            {/* dots along the path */}
            <circle cx="60" cy="220" r="4" fill={palette.accentSoft} />
            <circle cx="200" cy="140" r="4" fill={palette.accent} />
            <circle cx="360" cy="95" r="6" fill={palette.accent} />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <span
              className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: palette.accent }}
            >
              book · betal · kom
            </span>
            <h4
              className="text-3xl leading-none tracking-tight"
              style={{ ...displayStyle, fontWeight: 700 }}
            >
              Gjøvik
            </h4>
            <h4
              className="text-3xl leading-none tracking-tight"
              style={{ ...displayStyle, color: palette.accent, fontWeight: 700 }}
            >
              Fysio
            </h4>
          </div>
        </div>
      );

    default:
      return null;
  }
}
