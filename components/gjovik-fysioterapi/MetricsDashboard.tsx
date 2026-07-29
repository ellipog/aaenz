"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Locale, Localized } from "@/content/gjovik-fysioterapi";
import { tx, dashboard } from "@/content/gjovik-fysioterapi";
import { HUDGrid } from "./HudPrimitives";

/**
 * Gjøvik Fysioterapi — the MetricsDashboard.
 *
 * The performance-lab centerpiece: live-feeling telemetry across four panels
 * (recovery, operations, outcomes, personal assessment). The numbers are static
 * mock data; the *motion* of them is what sells the instrumented feel — bars
 * tween up, counters tick, the ops panel "pulses". All gated behind
 * prefers-reduced-motion (static fallback).
 */
export function MetricsDashboard({ locale }: { locale: Locale }) {
  return (
    <div className="relative overflow-hidden rounded-[6px] border" style={{ borderColor: "var(--physio-rule)" }}>
      <HUDGrid />
      <div className="relative grid gap-px md:grid-cols-2" style={{ backgroundColor: "var(--physio-rule)" }}>
        <Panel locale={locale}>
          <RecoveryPanel locale={locale} />
        </Panel>
        <Panel locale={locale}>
          <OpsPanel locale={locale} />
        </Panel>
        <Panel locale={locale}>
          <OutcomesPanel locale={locale} />
        </Panel>
        <Panel locale={locale}>
          <AssessmentPanel locale={locale} />
        </Panel>
      </div>
    </div>
  );
}

/** A single dashboard cell with its label header. */
function Panel({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <div className="p-6 sm:p-7" style={{ backgroundColor: "var(--physio-bg)" }}>
      <div className="mb-5 flex items-center gap-2">
        <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--physio-accent)" }} />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--physio-text-soft)" }}
        >
          {locale === "no" ? "DATASTRØM" : "FEED"}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── Recovery: mobility bars per body area + median weeks ─────────────────── */

function RecoveryPanel({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <PanelLabel>{tx(dashboard.recovery.label, locale)}</PanelLabel>
      <div
        className="mt-1 font-black leading-none tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
      >
        {dashboard.recovery.medianWeeks}
        <span className="ml-1.5 text-sm font-bold" style={{ color: "var(--physio-text-soft)" }}>
          {locale === "no" ? "uker i snitt" : "wks median"}
        </span>
      </div>
      <p className="mt-1 text-xs" style={{ color: "var(--physio-text-soft)" }}>
        {locale === "no" ? "første besøk → tilbake i aktivitet" : "first visit → back to activity"}
      </p>

      <div className="mt-6 space-y-3">
        {dashboard.recovery.areas.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-wide"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--physio-text-soft)" }}
            >
              {tx(a.area, locale)}
            </span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "var(--physio-surface)" }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: "var(--physio-accent)", boxShadow: "0 0 8px var(--physio-glow)" }}
                initial={{ width: reduce ? `${a.pct}%` : 0 }}
                whileInView={{ width: `${a.pct}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
            <span
              className="w-9 text-right text-xs font-bold tabular-nums"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--physio-text)" }}
            >
              {a.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Operations: live-feeling capacity readouts ──────────────────────────── */

function OpsPanel({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const o = dashboard.ops;
  const cells: { value: string | number; label: Localized }[] = [
    { value: o.onShift, label: { no: "på vakt nå", en: "on shift" } },
    { value: o.slotsLeft, label: { no: "timer i dag", en: "slots today" } },
    { value: `${o.avgWaitMins}m`, label: { no: "ventetid", en: "avg wait" } },
    { value: o.treatmentsThisWeek, label: { no: "denne uka", en: "this week" } },
  ];
  return (
    <div>
      <PanelLabel>{tx(dashboard.ops.label, locale)}</PanelLabel>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {cells.map((c, i) => (
          <div
            key={i}
            className="rounded-[4px] border p-3"
            style={{ borderColor: "var(--physio-rule)", backgroundColor: "var(--physio-surface)" }}
          >
            <div
              className="font-black leading-none tabular-nums tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "1.6rem", color: i === 0 ? "var(--physio-accent)" : "var(--physio-text)" }}
            >
              {c.value}
            </div>
            <div
              className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {tx(c.label, locale)}
            </div>
          </div>
        ))}
      </div>
      {/* a live "session" pulse line */}
      <div className="mt-4 flex items-center gap-2">
        <motion.span
          className="block h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--physio-accent)" }}
          animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
          transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--physio-text-soft)" }}
        >
          {locale === "no" ? "SYSTEM: PÅLINJE" : "SYSTEM: ONLINE"}
        </span>
      </div>
    </div>
  );
}

/* ── Outcomes: big satisfaction % + supporting stats ─────────────────────── */

function OutcomesPanel({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const o = dashboard.outcomes;
  return (
    <div>
      <PanelLabel>{tx(dashboard.outcomes.label, locale)}</PanelLabel>
      <div className="mt-2 flex items-end gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--physio-surface)" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15.5" fill="none" stroke="var(--physio-accent)" strokeWidth="3"
              strokeLinecap="round" transform="rotate(-90 18 18)"
              strokeDasharray="97.4"
              initial={{ strokeDashoffset: reduce ? 97.4 - (97.4 * o.satisfaction) / 100 : 97.4 }}
              whileInView={{ strokeDashoffset: 97.4 - (97.4 * o.satisfaction) / 100 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 4px var(--physio-glow))" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-black tabular-nums"
              style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "1.05rem", color: "var(--physio-text)" }}
            >
              {o.satisfaction}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Stat label={locale === "no" ? "ville anbefale" : "would recommend"} value={`${o.satisfaction}%`} />
          <Stat label={locale === "no" ? "gjenopptok aktivitet" : "resumed activity"} value={`${o.successRate}%`} />
          <Stat label={locale === "no" ? "timer i snitt" : "avg sessions"} value={`${o.avgSessions}`} />
        </div>
      </div>
    </div>
  );
}

/* ── Assessment: interactive 3-question flow → animated result ───────────── */

function AssessmentPanel({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const a = dashboard.assessment;
  const [answers, setAnswers] = useState<(number | null)[]>(() => a.questions.map(() => null));

  const total = useMemo(
    () => answers.reduce<number>((sum, ans, i) => sum + (ans != null ? a.questions[i].options[ans].score : 0), 0),
    [answers, a.questions]
  );
  const answeredCount = answers.filter((x) => x != null).length;
  const done = answeredCount === a.questions.length;
  const result = useMemo(
    () => a.results.find((r) => total >= r.min) ?? a.results[a.results.length - 1],
    [total, a.results]
  );
  const progressPct = (total / (a.questions.length * 3)) * 100;

  return (
    <div>
      <PanelLabel>{tx(a.label, locale)}</PanelLabel>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--physio-text-soft)" }}>
        {tx(a.intro, locale)}
      </p>

      <div className="mt-4 space-y-4">
        {a.questions.map((q, qi) => (
          <div key={q.id}>
            <p className="text-xs font-semibold" style={{ color: "var(--physio-text)" }}>
              {tx(q.q, locale)}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {q.options.map((opt, oi) => {
                const active = answers[qi] === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => setAnswers((prev) => prev.map((v, i) => (i === qi ? oi : v)))}
                    className="rounded-[3px] border px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors"
                    style={{
                      borderColor: active ? "var(--physio-accent)" : "var(--physio-rule)",
                      backgroundColor: active ? "var(--physio-accent)" : "transparent",
                      color: active ? "var(--physio-on-accent)" : "var(--physio-text-soft)",
                    }}
                  >
                    {tx(opt.label, locale)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Result — only revealed once all three are answered */}
      <div
        className="mt-5 overflow-hidden rounded-[4px] border p-4"
        style={{
          borderColor: done ? "var(--physio-accent)" : "var(--physio-rule)",
          backgroundColor: done ? "rgba(214,255,58,0.06)" : "var(--physio-surface)",
        }}
      >
        {/* progress bar */}
        <div className="mb-3 h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--physio-bg)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--physio-accent)" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
          />
        </div>
        {done ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="font-black tabular-nums leading-none"
                style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "1.75rem", color: "var(--physio-accent)" }}
              >
                {result.weeksEstimate}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--physio-text-soft)" }}>
                {locale === "no" ? "uker estimat" : "weeks estimate"}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--physio-text)" }}>
              {tx(result.verdict, locale)}
            </p>
          </motion.div>
        ) : (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--physio-text-soft)" }}>
            {locale === "no"
              ? `Svar på alle tre — ${answeredCount}/${a.questions.length} klart`
              : `Answer all three — ${answeredCount}/${a.questions.length} done`}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Small shared bits ────────────────────────────────────────────────────── */

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-sm font-bold uppercase tracking-[0.06em]"
      style={{ fontFamily: "var(--font-archivo), sans-serif", color: "var(--physio-text)" }}
    >
      {children}
    </h3>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="font-bold tabular-nums"
        style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "0.95rem", color: "var(--physio-accent)" }}
      >
        {value}
      </span>
      <span className="text-[11px]" style={{ color: "var(--physio-text-soft)" }}>
        {label}
      </span>
    </div>
  );
}
