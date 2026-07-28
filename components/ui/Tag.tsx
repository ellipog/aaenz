type Tone = "neutral" | "moss" | "clay" | "ochre" | "stone";

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
};

const tones: Record<Tone, string> = {
  // Eyebrow-style moss outline
  neutral: "border-stone-soft text-ink-soft",
  moss: "border-moss text-moss",
  // Accents — use sparingly (brand rule: <5% of view, never on text info)
  clay: "border-clay text-clay",
  ochre: "border-ochre text-ochre",
  stone: "border-stone text-stone",
};

/** Small monospace label — the surveyor's notebook tag. */
export function Tag({ children, tone = "neutral", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-xs border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
