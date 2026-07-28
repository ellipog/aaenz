"use client";

import type { StepProps } from "../types";
import { TileButton } from "../TileButton";
import { timelineOptions } from "@/lib/wizard-options";

/** Single-select timeline. */
export function StepTimeline({ data, update, locale }: StepProps) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {timelineOptions.map((opt) => (
        <TileButton
          key={opt.value}
          option={opt}
          locale={locale}
          selected={data.timeline === opt.value}
          onClick={() =>
            update({
              timeline: data.timeline === opt.value ? "" : opt.value,
            })
          }
        />
      ))}
    </div>
  );
}
