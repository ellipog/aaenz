"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { CONTACT_EMAIL } from "@/lib/site";
import { Select } from "@/components/ui/Select";
import { SummitFlag } from "./SummitFlag";

type Status = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const projectTypes = ["start", "vekst", "custom", "unsure"] as const;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations("ContactForm");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      business: String(data.get("business") ?? ""),
      projectType: String(data.get("projectType") ?? "unsure"),
      message: String(data.get("message") ?? ""),
      // honeypot
      company: String(data.get("company") ?? ""),
      locale,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) setErrors(body.errors);
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="overflow-hidden rounded-sm border border-moss bg-moss/5 text-center">
        <div className="relative h-44 w-full">
          <SummitFlag className="absolute inset-0 h-full w-full" />
        </div>
        <p className="px-6 py-6 font-display text-xl text-moss">{t("success")}</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-sm border border-stone-soft bg-paper px-4 py-3 text-ink placeholder:text-stone focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
  const labelCls =
    "block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot — hidden from humans */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={t("namePlaceholder")}
            className={inputCls}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p role="alert" className="mt-1.5 text-sm text-ochre">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className={inputCls}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p role="alert" className="mt-1.5 text-sm text-ochre">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="business" className={labelCls}>
            {t("business")}
          </label>
          <input
            id="business"
            name="business"
            type="text"
            placeholder={t("businessPlaceholder")}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="projectType" className={labelCls}>
            {t("projectType")}
          </label>
          <Select
            id="projectType"
            name="projectType"
            defaultValue="unsure"
            triggerClassName={inputCls}
            label={t("projectType")}
            options={projectTypes.map((pt) => ({
              value: pt,
              label: t(`projectTypes.${pt}`),
            }))}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={`${inputCls} resize-none`}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p role="alert" className="mt-1.5 text-sm text-ochre">{errors.message}</p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-sm border border-ochre bg-ochre/5 p-3 text-sm text-ink">
          {t("error", { email: CONTACT_EMAIL })}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-sm bg-moss px-6 py-3.5 font-medium text-paper transition-colors hover:bg-moss-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
