import { useTranslations } from "next-intl";

type Item = {
  key: "norsk" | "raskt" | "nolockin" | "altinkludert";
  icon: React.ReactNode;
};

/** Small contour-line icons — drawn from the brand icon-set vocabulary. */
const icons = {
  compass: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 10l-4 4 1-5 4-1z" fill="currentColor" />
    </svg>
  ),
  bolt: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M13 3L5 13h6l-2 8 8-10h-6l2-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  key: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12h9M18 12v3M21 12v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  package: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 7.5L12 12l8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
} as const;

const items: Item[] = [
  { key: "norsk", icon: icons.compass },
  { key: "raskt", icon: icons.bolt },
  { key: "nolockin", icon: icons.key },
  { key: "altinkludert", icon: icons.package },
];

export function TrustStrip() {
  const t = useTranslations("TrustStrip");

  return (
    <section className="border-y border-stone-soft/50 bg-paper-deep/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
        {items.map(({ key, icon }) => (
          <div
            key={key}
            className="flex flex-col gap-2 py-8 lg:items-start lg:py-10"
          >
            <span className="text-moss">{icon}</span>
            <p className="font-display text-lg font-medium text-ink">
              {t(`${key}.title`)}
            </p>
            <p className="text-sm text-ink-soft">{t(`${key}.body`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
