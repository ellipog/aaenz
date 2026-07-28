"use client";

import type { StepProps } from "../types";
import { TileButton } from "../TileButton";
import { pageOptions } from "@/lib/wizard-options";

/** Multi-select — toggle page/feature tiles on and off. */
export function StepPages({ data, update, locale }: StepProps) {
  function toggle(value: string) {
    const next = data.pages.includes(value)
      ? data.pages.filter((v) => v !== value)
      : [...data.pages, value];
    update({ pages: next });
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {pageOptions.map((opt) => (
        <TileButton
          key={opt.value}
          option={opt}
          locale={locale}
          selected={data.pages.includes(opt.value)}
          onClick={() => toggle(opt.value)}
        />
      ))}
    </div>
  );
}
