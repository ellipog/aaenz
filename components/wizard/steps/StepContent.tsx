"use client";

import type { StepProps } from "../types";
import { TileButton } from "../TileButton";
import { contentOptions } from "@/lib/wizard-options";

/** Single-select — picking one clears the others. */
export function StepContent({ data, update, locale }: StepProps) {
  return (
    <div className="grid gap-2.5">
      {contentOptions.map((opt) => (
        <TileButton
          key={opt.value}
          option={opt}
          locale={locale}
          selected={data.contentStatus === opt.value}
          onClick={() =>
            update({
              contentStatus:
                data.contentStatus === opt.value ? "" : opt.value,
            })
          }
        />
      ))}
    </div>
  );
}
