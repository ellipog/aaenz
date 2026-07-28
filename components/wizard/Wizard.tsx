"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "@/i18n/routing";
import { ProgressBar } from "./ProgressBar";
import { StepBusiness } from "./steps/StepBusiness";
import { StepPages } from "./steps/StepPages";
import { StepContent } from "./steps/StepContent";
import { StepTimeline } from "./steps/StepTimeline";
import { StepContact } from "./steps/StepContact";
import { emptyWizardData, type WizardData } from "./types";
import { CONTACT_EMAIL } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const TOTAL_STEPS = 5;

const stepKeys = ["business", "pages", "content", "timeline", "contact"] as const;

type Props = {
  /** Pre-selected tier from the pricing button that opened the wizard. */
  initialTier?: string;
  /** Pre-selected one-time service (logo/profilmanual). */
  initialService?: string;
  /** Called when the user finishes or cancels (used by modal to close). */
  onComplete?: () => void;
  onCancel?: () => void;
};

export function Wizard({ initialTier, initialService, onComplete, onCancel }: Props) {
  const t = useTranslations("Wizard");
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    ...emptyWizardData,
    tier: initialTier ?? "unsure",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});

  function update(patch: Partial<WizardData>) {
    setData((d) => ({ ...d, ...patch }));
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function submit() {
    setStatus("submitting");
    setErrors({});

    // Basic client validation for the required contact fields.
    const newErrors: typeof errors = {};
    if (data.name.trim().length < 2) {
      newErrors.name = t("steps.contact.errors.name");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t("steps.contact.errors.email");
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          tier: data.tier,
          service: initialService,
          businessName: data.businessName,
          businessDesc: data.businessDesc,
          pages: data.pages,
          contentStatus: data.contentStatus,
          timeline: data.timeline,
          message: data.message.trim().length >= 10 ? data.message : undefined,
          source: "wizard",
          locale,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) setErrors(body.errors);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // ─── Success screen ──────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-moss"
        >
          <svg className="h-8 w-8 text-moss" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <h3 className="mt-6 font-display text-2xl font-medium text-ink">
          {t("success.title")}
        </h3>
        <p className="mt-2 max-w-sm text-ink-soft">{t("success.body")}</p>
        {onComplete && (
          <button
            type="button"
            onClick={onComplete}
            className="mt-8 inline-flex items-center rounded-sm bg-moss px-6 py-3 font-medium text-paper transition-colors hover:bg-moss-deep"
          >
            {t("success.close")}
          </button>
        )}
      </div>
    );
  }

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <div className="flex h-full flex-col">
      {/* Header — progress + cancel */}
      <div className="flex items-center gap-4 pb-5">
        <div className="flex-1">
          <ProgressBar total={TOTAL_STEPS} current={step} />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
          {step + 1}/{TOTAL_STEPS}
        </span>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label={t("cancel")}
            className="text-stone transition-colors hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Step content — animated transitions.
          overflow-x-hidden so the slide-in/out animation never triggers a
          horizontal scrollbar while the panel is offset. */}
      <div className="custom-scroll flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12"
          >
            {/* Left — heading (sticks on desktop, flows on mobile) */}
            <div className="lg:sticky lg:top-0 lg:self-start">
              <h2 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
                {t(`steps.${stepKeys[step]}.title`)}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">
                {t(`steps.${stepKeys[step]}.subtitle`)}
              </p>
            </div>

            {/* Right — the step's input area */}
            <div>
              {step === 0 && <StepBusiness data={data} update={update} locale={locale} />}
              {step === 1 && <StepPages data={data} update={update} locale={locale} />}
              {step === 2 && <StepContent data={data} update={update} locale={locale} />}
              {step === 3 && <StepTimeline data={data} update={update} locale={locale} />}
              {step === 4 && (
                <StepContact
                  data={data}
                  update={update}
                  locale={locale}
                  errors={errors}
                />
              )}

              {status === "error" && (
                <p className="mt-4 rounded-sm border border-ochre bg-ochre/5 p-3 text-sm text-ink">
                  {t("error", { email: CONTACT_EMAIL })}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer — navigation */}
      <div className="flex items-center gap-3 pt-5">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-1.5 rounded-sm border border-stone-soft bg-paper px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-moss hover:text-moss"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("back")}
          </button>
        )}

        <div className="flex-1" />

        {!isLast && (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-sm bg-moss px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-moss-deep"
          >
            {t("next")}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {!isLast && (
          <button
            type="button"
            onClick={next}
            className="rounded-sm px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-stone transition-colors hover:text-moss"
          >
            {t("skip")}
          </button>
        )}

        {isLast && (
          <button
            type="button"
            onClick={submit}
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 rounded-sm bg-moss px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-moss-deep disabled:opacity-60"
          >
            {status === "submitting" ? t("submitting") : t("submit")}
            {status !== "submitting" && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
