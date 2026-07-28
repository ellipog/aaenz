import type { Concept } from "@/content/strand-treverk";

/**
 * Renders one design concept as a card with a live mini-hero preview.
 *
 * The preview uses the concept's own palette + fonts via inline styles (scoped
 * to the preview element so it never leaks into the host aaen brand). Each
 * preview is a tiny but real representation of how the carpenter's hero would
 * feel — not a literal final design, but enough to judge the direction.
 *
 * Mirrors the gjøvik-fysioterapi ConceptCard structure exactly.
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
            {(
              [
                ["bg", palette.bg],
                ["surface", palette.surface],
                ["accent", palette.accent],
                ["accentSoft", palette.accentSoft],
                ["text", palette.text],
              ] as const
            ).map(([label, color]) => (
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
 * legible at a glance. Each is a small, real-feeling carpenter's hero rendered
 * in the concept's own palette and fonts.
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
    case "drage":
      return <DriftwoodHero palette={palette} displayStyle={displayStyle} bodyStyle={bodyStyle} />;
    case "verksted":
      return <WorkshopHero palette={palette} displayStyle={displayStyle} bodyStyle={bodyStyle} />;
    case "tre":
      return <TimberHero palette={palette} displayStyle={displayStyle} bodyStyle={bodyStyle} />;
    case "havn":
      return <BoatyardHero palette={palette} displayStyle={displayStyle} bodyStyle={bodyStyle} />;
    case "joiner":
      return <JoinerHero palette={palette} displayStyle={displayStyle} bodyStyle={bodyStyle} />;
    case "skogsjø":
      return <ShorelineHero palette={palette} displayStyle={displayStyle} bodyStyle={bodyStyle} />;
    default:
      return null;
  }
}

type HeroProps = {
  palette: Concept["palette"];
  displayStyle: React.CSSProperties;
  bodyStyle: React.CSSProperties;
};

/* ============================================================ */
/* 1. DRIFTWOOD — bleached planks + a floating tide line         */
/* ============================================================ */
function DriftwoodHero({ palette, displayStyle, bodyStyle }: HeroProps) {
  return (
    <div className="absolute inset-0 p-6">
      {/* horizontal planks receding, with one tide line */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[58%]"
        viewBox="0 0 400 240"
        preserveAspectRatio="none"
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="0"
            y={i * 48}
            width="400"
            height="44"
            fill={i % 2 === 0 ? palette.surface : palette.bg}
            stroke={palette.textSoft}
            strokeOpacity="0.12"
          />
        ))}
        {/* the floating tide line — the signature */}
        <path
          d="M0,140 Q100,124 200,140 T400,140"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2.5"
        />
      </svg>
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={bodyStyle}>
          kyst · håndverk
        </p>
        <h4 className="mt-2 text-3xl leading-[0.95]" style={displayStyle}>
          Strand
          <br />
          <span style={{ fontStyle: "italic", color: palette.accent }}>Treverk</span>
        </h4>
      </div>
    </div>
  );
}

/* ============================================================ */
/* 2. WORKSHOP — technical dimension drawing on kraft            */
/* ============================================================ */
function WorkshopHero({ palette, displayStyle, bodyStyle }: HeroProps) {
  return (
    <div className="absolute inset-0 p-6" style={{ color: palette.text }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" aria-hidden>
        {/* graph grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" stroke={palette.textSoft} strokeOpacity="0.08" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke={palette.textSoft} strokeOpacity="0.08" />
        ))}
        {/* the workpiece — a measured plank */}
        <rect x="70" y="150" width="260" height="70" fill="none" stroke={palette.text} strokeWidth="1.5" />
        {/* dimension line — width */}
        <line x1="70" y1="245" x2="330" y2="245" stroke={palette.accent} strokeWidth="1" />
        <line x1="70" y1="240" x2="70" y2="250" stroke={palette.accent} strokeWidth="1" />
        <line x1="330" y1="240" x2="330" y2="250" stroke={palette.accent} strokeWidth="1" />
        {/* dimension line — height */}
        <line x1="45" y1="150" x2="45" y2="220" stroke={palette.accent} strokeWidth="1" />
        <line x1="40" y1="150" x2="50" y2="150" stroke={palette.accent} strokeWidth="1" />
        <line x1="40" y1="220" x2="50" y2="220" stroke={palette.accent} strokeWidth="1" />
      </svg>
      <div className="relative" style={displayStyle}>
        <h4 className="text-2xl leading-none uppercase tracking-tight">Strand Treverk</h4>
        <p className="mt-1 text-[10px] tracking-[0.1em]" style={bodyStyle}>
          tegning 01 / bordkant
        </p>
      </div>
      {/* callouts in the accent */}
      <span className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[11px]" style={{ ...displayStyle, color: palette.accent }}>
        2400 mm
      </span>
      <span className="absolute left-[52px] top-[182px] text-[11px]" style={{ ...displayStyle, color: palette.accent }}>
        45
      </span>
    </div>
  );
}

/* ============================================================ */
/* 3. TIMBER — end-grain growth rings                           */
/* ============================================================ */
function TimberHero({ palette, displayStyle, bodyStyle }: HeroProps) {
  const rings = [10, 22, 36, 52, 70, 90];
  return (
    <div className="absolute inset-0 p-6">
      {/* a big end-grain round anchoring the corner */}
      <svg
        className="absolute -right-20 -top-20 h-64 w-64"
        viewBox="0 0 200 200"
        aria-hidden
      >
        {rings.map((r, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={i % 2 === 0 ? palette.text : palette.accent}
            strokeOpacity={i === rings.length - 1 ? 0.9 : 0.25}
            strokeWidth={i === rings.length - 1 ? 2 : 1}
          />
        ))}
        <circle cx="100" cy="100" r="3" fill={palette.accent} />
      </svg>
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={bodyStyle}>
          siden 2004
        </p>
        <h4 className="mt-2 text-3xl leading-[0.95]" style={displayStyle}>
          Strand
          <br />
          Treverk
        </h4>
        <p className="mt-3 max-w-[14rem] text-sm italic leading-relaxed" style={{ ...displayStyle, color: palette.textSoft }}>
          hver planke har en historie.
        </p>
      </div>
    </div>
  );
}

/* ============================================================ */
/* 4. BOATYARD — tarred dark base, rope rigging + brass eyes     */
/* ============================================================ */
function BoatyardHero({ palette, displayStyle, bodyStyle }: HeroProps) {
  return (
    <div className="absolute inset-0 p-6">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" aria-hidden>
        {/* vertical mast */}
        <line x1="200" y1="40" x2="200" y2="260" stroke={palette.textSoft} strokeOpacity="0.4" strokeWidth="1" />
        {/* rope rigging lines, fanned */}
        <line x1="200" y1="50" x2="90" y2="240" stroke={palette.accent} strokeOpacity="0.8" strokeWidth="1.5" />
        <line x1="200" y1="50" x2="310" y2="240" stroke={palette.accent} strokeOpacity="0.8" strokeWidth="1.5" />
        <line x1="200" y1="50" x2="140" y2="245" stroke={palette.accent} strokeOpacity="0.5" strokeWidth="1" />
        <line x1="200" y1="50" x2="260" y2="245" stroke={palette.accent} strokeOpacity="0.5" strokeWidth="1" />
        {/* brass eyes at the anchor points */}
        {([
          [90, 240],
          [310, 240],
          [140, 245],
          [260, 245],
        ] as const).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="none" stroke={palette.accent} strokeWidth="1.5" />
        ))}
        {/* a knot at the masthead */}
        <circle cx="200" cy="50" r="5" fill={palette.accent} />
      </svg>
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={bodyStyle}>
          båtplass
        </p>
        <h4 className="mt-2 text-3xl uppercase leading-[0.9] tracking-tight" style={displayStyle}>
          Strand
          <br />
          Treverk
        </h4>
      </div>
    </div>
  );
}

/* ============================================================ */
/* 5. JOINER — fine gallery dovetail diagram on dark             */
/* ============================================================ */
function JoinerHero({ palette, displayStyle, bodyStyle }: HeroProps) {
  return (
    <div className="absolute inset-0 p-6">
      <svg
        className="absolute inset-x-0 bottom-6 mx-auto w-[70%]"
        viewBox="0 0 260 80"
        aria-hidden
      >
        {/* dovetail tails row */}
        {[0, 1, 2, 3].map((i) => {
          const x = 20 + i * 60;
          return (
            <path
              key={i}
              d={`M${x},10 L${x + 15},10 L${x + 25},40 L${x - 10},40 Z`}
              fill="none"
              stroke={palette.accent}
              strokeWidth="1"
              opacity="0.85"
            />
          );
        })}
        {/* baseline */}
        <line x1="0" y1="40" x2="260" y2="40" stroke={palette.textSoft} strokeOpacity="0.4" />
      </svg>
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.3em]" style={bodyStyle}>
          snekker · joiné
        </p>
        <h4 className="mt-3 text-4xl leading-[0.9]" style={displayStyle}>
          Strand
        </h4>
        <h4 className="text-4xl italic leading-[0.9]" style={{ ...displayStyle, color: palette.accent }}>
          Treverk
        </h4>
      </div>
    </div>
  );
}

/* ============================================================ */
/* 6. FOREST & FJORD — topographic shoreline × grain             */
/* ============================================================ */
function ShorelineHero({ palette, displayStyle, bodyStyle }: HeroProps) {
  return (
    <div className="absolute inset-0 p-6">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden>
        {/* layered shoreline contours */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((o, i) => (
          <path
            key={i}
            d={`M-20,${120 + i * 28} Q100,${100 + i * 28} 220,${130 + i * 28} T420,${115 + i * 28}`}
            fill="none"
            stroke={i % 2 === 0 ? palette.accent : palette.text}
            strokeOpacity={o}
            strokeWidth="1.2"
          />
        ))}
        {/* grain arc — a wood-fiber curve through the contours */}
        <path
          d="M40,40 Q200,80 360,30"
          fill="none"
          stroke={palette.accentSoft}
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeDasharray="3 4"
        />
      </svg>
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={bodyStyle}>
          skog &amp; sjø
        </p>
        <h4 className="mt-2 text-3xl leading-[0.9]" style={displayStyle}>
          Strand <span style={{ color: palette.accent }}>&amp;</span> Treverk
        </h4>
      </div>
    </div>
  );
}
