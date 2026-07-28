"use client";

import { WizardIcon, type WizardOption } from "@/lib/wizard-options";
import type { Locale } from "@/i18n/routing";

type Props = {
  option: WizardOption;
  selected: boolean;
  locale: Locale;
  onClick: () => void;
};

/**
 * A large clickable tile — the brand's answer to checkboxes/radios.
 * Shows an icon + label, gains a moss border + tint when selected.
 */
export function TileButton({ option, selected, locale, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex items-center gap-3 rounded-sm border p-4 text-left transition-all ${
        selected
          ? "border-moss bg-moss/8 shadow-[0_0_0_1px_var(--color-moss)]"
          : "border-stone-soft/60 bg-paper hover:border-moss/50 hover:bg-paper-deep/40"
      }`}
    >
      <span
        className={`shrink-0 transition-colors ${
          selected ? "text-moss" : "text-ink-soft group-hover:text-moss"
        }`}
      >
        <WizardIcon kind={option.icon} />
      </span>
      <span
        className={`text-sm font-medium ${
          selected ? "text-ink" : "text-ink-soft"
        }`}
      >
        {option.label[locale]}
      </span>
      {selected && (
        <svg
          className="ml-auto h-4 w-4 shrink-0 text-moss"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 8.5l3 3 7-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
