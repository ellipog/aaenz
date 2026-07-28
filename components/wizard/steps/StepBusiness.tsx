"use client";

import { useTranslations } from "next-intl";
import type { StepProps } from "../types";

const inputCls =
  "w-full rounded-sm border border-stone-soft bg-paper px-4 py-3 text-ink placeholder:text-stone focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
const labelCls =
  "block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft";

export function StepBusiness({ data, update }: StepProps) {
  const t = useTranslations("Wizard.steps.business");
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="w-business-name" className={labelCls}>
          {t("nameLabel")}
        </label>
        <input
          id="w-business-name"
          type="text"
          value={data.businessName}
          onChange={(e) => update({ businessName: e.target.value })}
          placeholder={t("namePlaceholder")}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="w-business-desc" className={labelCls}>
          {t("descLabel")}
        </label>
        <textarea
          id="w-business-desc"
          rows={3}
          value={data.businessDesc}
          onChange={(e) => update({ businessDesc: e.target.value })}
          placeholder={t("descPlaceholder")}
          className={`${inputCls} resize-none`}
        />
      </div>
    </div>
  );
}
