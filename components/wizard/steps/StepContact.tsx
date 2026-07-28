"use client";

import { useTranslations } from "next-intl";
import type { StepProps } from "../types";
import { TileButton } from "../TileButton";
import { tierOptions } from "@/lib/wizard-options";

const inputCls =
  "w-full rounded-sm border border-stone-soft bg-paper px-4 py-3 text-ink placeholder:text-stone focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
const labelCls =
  "block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft";

type Errors = Partial<Record<"name" | "email", string>>;

/** Final step — contact details + tier selection (pre-filled, editable) + message. */
export function StepContact({
  data,
  update,
  locale,
  errors = {},
}: StepProps & { errors?: Errors }) {
  const t = useTranslations("Wizard.steps.contact");
  return (
    <div className="space-y-5">
      <div>
        <span className={`${labelCls} mb-2 block`}>{t("tierLabel")}</span>
        <div className="grid grid-cols-2 gap-2.5">
          {tierOptions.map((opt) => (
            <TileButton
              key={opt.value}
              option={opt}
              locale={locale}
              selected={data.tier === opt.value}
              onClick={() => update({ tier: opt.value })}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="w-name" className={labelCls}>
            {t("nameLabel")} *
          </label>
          <input
            id="w-name"
            type="text"
            required
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder={t("namePlaceholder")}
            className={inputCls}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p role="alert" className="mt-1 text-sm text-ochre">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="w-email" className={labelCls}>
            {t("emailLabel")} *
          </label>
          <input
            id="w-email"
            type="email"
            required
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder={t("emailPlaceholder")}
            className={inputCls}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p role="alert" className="mt-1 text-sm text-ochre">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="w-message" className={labelCls}>
          {t("messageLabel")}
        </label>
        <textarea
          id="w-message"
          rows={3}
          value={data.message}
          onChange={(e) => update({ message: e.target.value })}
          placeholder={t("messagePlaceholder")}
          className={`${inputCls} resize-none`}
        />
      </div>
    </div>
  );
}
