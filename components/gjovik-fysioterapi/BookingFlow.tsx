"use client";

import { useState } from "react";
import type {
  Locale,
  Treatment,
  BookingDay,
} from "@/content/gjovik-fysioterapi";
import { tx } from "@/content/gjovik-fysioterapi";
import { PhysioMark } from "./PhysioMark";

type Step = "treatment" | "slot" | "pay" | "done";
type PayMethod = "card" | "vipps";

/**
 * The mock booking + payment flow (Lindrig styling).
 *
 * Step 1 — pick a treatment (cards).
 * Step 2 — pick a day + slot (grid).
 * Step 3 — enter name + "pay" (card or Vipps, both mocked, no real charge).
 * Step 4 — confirmation, with the booking summary.
 *
 * Everything is client-side and pretend. The "payment" is a 1.2s fake delay
 * that resolves to a success state — there's no backend, no card processing,
 * no real Vipps call. Vipps is shown because it's near-standard for Norwegian
 * payments.
 */
export function BookingFlow({
  locale,
  treatments,
  days,
}: {
  locale: Locale;
  treatments: Treatment[];
  days: BookingDay[];
}) {
  const isNo = locale === "no";
  const [step, setStep] = useState<Step>("treatment");
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("vipps");
  const [paying, setPaying] = useState(false);

  function reset() {
    setStep("treatment");
    setTreatment(null);
    setDayIndex(null);
    setSlot(null);
    setName("");
    setEmail("");
    setPayMethod("vipps");
    setPaying(false);
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    // Fake processing delay — pretend card network round-trip.
    setTimeout(() => {
      setPaying(false);
      setStep("done");
    }, 1200);
  }

  const selectedDay = dayIndex !== null ? days[dayIndex] : null;
  const bookingRef = `GF-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  // ─── Step indicators ───────────────────────────────────────────────────────
  const stepLabels: Record<Step, string> = isNo
    ? {
        treatment: "Behandling",
        slot: "Tid",
        pay: "Betaling",
        done: "Bekreftet",
      }
    : {
        treatment: "Treatment",
        slot: "Time",
        pay: "Payment",
        done: "Confirmed",
      };
  const stepOrder: Step[] = ["treatment", "slot", "pay", "done"];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div
      className="rounded-[22px] border p-7 sm:p-8"
      style={{
        backgroundColor: "var(--physio-paper)",
        borderColor: "var(--physio-rule)",
      }}
    >
      {/* Step progress */}
      <div className="mb-8 flex items-center gap-2">
        {stepOrder.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium tabular-nums"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  backgroundColor:
                    i <= currentIdx
                      ? "var(--physio-moss)"
                      : "var(--physio-mist)",
                  color:
                    i <= currentIdx
                      ? "var(--physio-on-accent)"
                      : "var(--physio-text-soft)",
                  border:
                    i <= currentIdx
                      ? "none"
                      : "1px solid var(--physio-rule)",
                }}
              >
                {i < currentIdx ? "✓" : i + 1}
              </span>
              <span
                className="hidden text-[11px] font-medium tracking-[0.08em] sm:inline"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color:
                    i <= currentIdx
                      ? "var(--physio-text)"
                      : "var(--physio-text-soft)",
                }}
              >
                {stepLabels[s]}
              </span>
            </div>
            {i < stepOrder.length - 1 && (
              <div
                className="h-px flex-1"
                style={{
                  backgroundColor:
                    i < currentIdx
                      ? "var(--physio-sage)"
                      : "var(--physio-rule)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ─── STEP 1: treatment ─────────────────────────────────────────────── */}
      {step === "treatment" && (
        <div>
          <h3
            className="mb-1 text-xl font-medium normal-case tracking-tight"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
          >
            {isNo ? "Hva trenger du?" : "What do you need?"}
          </h3>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {isNo
              ? "Velg en behandling — du kan alltid endre."
              : "Pick a treatment — you can always change it."}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {treatments.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTreatment(t);
                  setStep("slot");
                }}
                className="group rounded-[22px] border p-5 text-left transition-all hover:-translate-y-0.5"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="font-medium normal-case tracking-tight"
                    style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
                  >
                    {tx(t.name, locale)}
                  </span>
                  {t.flagship && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-medium tracking-[0.1em]"
                      style={{
                        backgroundColor: "var(--physio-clay)",
                        color: "var(--physio-on-accent)",
                      }}
                    >
                      ★
                    </span>
                  )}
                </div>
                <p
                  className="mt-1 text-xs tabular-nums"
                  style={{ color: "var(--physio-text-soft)" }}
                >
                  {t.duration} min · {t.price} kr
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── STEP 2: slot ──────────────────────────────────────────────────── */}
      {step === "slot" && treatment && (
        <div>
          <h3
            className="mb-1 text-xl font-medium normal-case tracking-tight"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
          >
            {isNo ? "Når passer det?" : "When suits?"}
          </h3>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {isNo
              ? `Ledige tider for ${tx(treatment.name, locale).toLowerCase()}.`
              : `Available slots for ${tx(treatment.name, locale).toLowerCase()}.`}
          </p>
          <div className="space-y-4">
            {days.map((d, di) => (
              <div key={d.date}>
                <div className="mb-2 flex items-baseline gap-3">
                  <span
                    className="text-sm font-medium normal-case tracking-wide"
                    style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
                  >
                    {tx(d.day, locale)}
                  </span>
                  <span
                    className="text-xs tabular-nums"
                    style={{ color: "var(--physio-text-soft)" }}
                  >
                    {d.date}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {d.slots.map((s) => {
                    const selected = dayIndex === di && slot === s;
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          setDayIndex(di);
                          setSlot(s);
                        }}
                        className="rounded-full border px-4 py-2 text-sm tabular-nums transition-all"
                        style={{
                          borderColor: selected
                            ? "var(--physio-moss)"
                            : "var(--physio-rule)",
                          backgroundColor: selected
                            ? "var(--physio-moss)"
                            : "transparent",
                          color: selected
                            ? "var(--physio-on-accent)"
                            : "var(--physio-text)",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("treatment")}
              className="rounded-full border px-4 py-2 text-xs font-medium tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                borderColor: "var(--physio-rule)",
                color: "var(--physio-text-soft)",
              }}
            >
              ← {isNo ? "Tilbake" : "Back"}
            </button>
            <button
              disabled={!slot}
              onClick={() => setStep("pay")}
              className="rounded-full px-5 py-2 text-xs font-medium tracking-[0.08em] transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                backgroundColor: "var(--physio-moss)",
                color: "var(--physio-on-accent)",
              }}
            >
              {isNo ? "Videre til betaling" : "Continue to pay"} →
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3: pay ───────────────────────────────────────────────────── */}
      {step === "pay" && treatment && selectedDay && slot && (
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <form onSubmit={handlePay}>
            <h3
              className="mb-1 text-xl font-medium normal-case tracking-tight"
              style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
            >
              {isNo ? "Dine opplysninger" : "Your details"}
            </h3>
            <p
              className="mb-5 text-sm"
              style={{ color: "var(--physio-text-soft)" }}
            >
              {isNo
                ? "Vi sender bekreftelsen på e-post. Ingen ekte betaling — dette er en demo."
                : "We'll send the confirmation by email. No real charge — this is a demo."}
            </p>
            <div className="space-y-3">
              <Field
                label={isNo ? "Navn" : "Name"}
                value={name}
                onChange={setName}
                required
                placeholder={isNo ? "Ola Nordmann" : "Jane Doe"}
              />
              <Field
                label="E-post"
                type="email"
                value={email}
                onChange={setEmail}
                required
                placeholder="ola@eksempel.no"
              />
            </div>

            {/* Payment method picker */}
            <div className="mt-5">
              <span
                className="mb-1.5 block text-[11px] font-medium tracking-[0.08em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-text-soft)",
                }}
              >
                {isNo ? "Betalingsmåte" : "Payment method"}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <PayOption
                  active={payMethod === "vipps"}
                  onClick={() => setPayMethod("vipps")}
                >
                  <VippsMark />
                  <span>Vipps</span>
                </PayOption>
                <PayOption
                  active={payMethod === "card"}
                  onClick={() => setPayMethod("card")}
                >
                  <CardMark />
                  <span>{isNo ? "Kort" : "Card"}</span>
                </PayOption>
              </div>
            </div>

            {/* Conditional: card fields OR Vipps confirmation note */}
            {payMethod === "card" ? (
              <div className="mt-3 space-y-3">
                <Field
                  label={isNo ? "Kortnummer" : "Card number"}
                  value="4242 4242 4242 4242"
                  onChange={() => {}}
                  disabled
                  placeholder=""
                />
              </div>
            ) : (
              <div
                className="mt-3 flex items-start gap-3 rounded-[14px] border p-4"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <span style={{ color: "#ff5b2e" }}>
                  <VippsMark />
                </span>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--physio-text-soft)" }}
                >
                  {isNo
                    ? "Du blir sendt til Vipps for å godkjenne betalingen. (Demo — ingen ekte Vipps-forespørsel sendes.)"
                    : "You'll be sent to Vipps to approve the payment. (Demo — no real Vipps request is made.)"}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("slot")}
                className="rounded-full border px-4 py-2 text-xs font-medium tracking-[0.08em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  borderColor: "var(--physio-rule)",
                  color: "var(--physio-text-soft)",
                }}
              >
                ← {isNo ? "Tilbake" : "Back"}
              </button>
              <button
                type="submit"
                disabled={paying || !name || !email}
                className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-medium tracking-[0.08em] transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  backgroundColor:
                    payMethod === "vipps" ? "#ff5b2e" : "var(--physio-moss)",
                  color: payMethod === "vipps" ? "#fff" : "var(--physio-on-accent)",
                }}
              >
                {payMethod === "vipps" && !paying && <VippsMark light />}
                {paying
                  ? isNo
                    ? "Behandler…"
                    : "Processing…"
                  : `${isNo ? "Betal" : "Pay"} ${treatment.price} kr`}
              </button>
            </div>
          </form>

          {/* Summary */}
          <aside
            className="rounded-[22px] border p-5"
            style={{
              borderColor: "var(--physio-rule)",
              backgroundColor: "var(--physio-bg)",
            }}
          >
            <h4
              className="mb-4 text-[11px] font-medium tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                color: "var(--physio-text-soft)",
              }}
            >
              {isNo ? "Oppsummering" : "Summary"}
            </h4>
            <dl className="space-y-3 text-sm">
              <Row
                label={isNo ? "Behandling" : "Treatment"}
                value={tx(treatment.name, locale)}
              />
              <Row
                label={isNo ? "Dag" : "Day"}
                value={`${tx(selectedDay.day, locale)} ${selectedDay.date}`}
              />
              <Row label={isNo ? "Tid" : "Time"} value={slot} />
              <Row
                label={isNo ? "Varighet" : "Duration"}
                value={`${treatment.duration} min`}
              />
              <div
                className="flex items-baseline justify-between border-t pt-3"
                style={{ borderColor: "var(--physio-rule)" }}
              >
                <dt
                  className="text-xs font-medium tracking-wide"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                  }}
                >
                  {isNo ? "Total" : "Total"}
                </dt>
                <dd
                  className="text-xl font-semibold tabular-nums"
                  style={{ color: "var(--physio-moss)" }}
                >
                  {treatment.price} kr
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      )}

      {/* ─── STEP 4: done ──────────────────────────────────────────────────── */}
      {step === "done" && treatment && selectedDay && slot && (
        <div className="py-8 text-center">
          <div className="mb-5 flex justify-center">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--physio-moss)",
                color: "var(--physio-on-accent)",
              }}
            >
              <PhysioMark onDark size={26} />
            </span>
          </div>
          <h3
            className="text-2xl font-medium normal-case tracking-tight"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--physio-text)" }}
          >
            {isNo ? "Du er booket." : "You're booked."}
          </h3>
          <p
            className="mx-auto mt-2 max-w-sm text-sm"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {isNo
              ? `Vi sees ${tx(selectedDay.day, locale).toLowerCase()} ${selectedDay.date} kl. ${slot}. Bekreftelse sendt til ${email || "din e-post"}.`
              : `See you ${tx(selectedDay.day, locale).toLowerCase()} ${selectedDay.date} at ${slot}. Confirmation sent to ${email || "your email"}.`}
          </p>
          <div className="mx-auto mt-6 flex max-w-xs flex-col items-center gap-4">
            <div
              className="flex w-full flex-col gap-1 rounded-[22px] border px-6 py-3 text-center"
              style={{ borderColor: "var(--physio-rule)" }}
            >
              <span
                className="text-[11px] tracking-[0.14em]"
                style={{ color: "var(--physio-text-soft)" }}
              >
                {isNo ? "referanse" : "reference"}
              </span>
              <span
                className="text-lg font-semibold tabular-nums"
                style={{ color: "var(--physio-moss)" }}
              >
                {bookingRef}
              </span>
            </div>
            <button
              onClick={reset}
              className="w-full rounded-full border px-5 py-2.5 text-xs font-medium tracking-[0.08em] transition-colors hover:border-[var(--physio-sage-deep)]"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                borderColor: "var(--physio-rule)",
                color: "var(--physio-text-soft)",
              }}
            >
              {isNo ? "Book en til" : "Book another"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-[11px] font-medium tracking-[0.08em]"
        style={{
          fontFamily: "var(--font-fraunces), serif",
          color: "var(--physio-text-soft)",
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[14px] border bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--physio-sage-deep)]"
        style={{
          borderColor: "var(--physio-rule)",
          color: "var(--physio-text)",
        }}
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt style={{ color: "var(--physio-text-soft)" }}>{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

/** A selectable payment-method tile. */
function PayOption({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2.5 text-sm font-medium transition-all"
      style={{
        borderColor: active ? "var(--physio-moss)" : "var(--physio-rule)",
        backgroundColor: active
          ? "rgba(110,132,104,0.08)"
          : "transparent",
        color: active ? "var(--physio-text)" : "var(--physio-text-soft)",
      }}
    >
      {children}
    </button>
  );
}

/**
 * Vipps wordmark as inline SVG text, in the official Vipps orange (#ff5b2e).
 * Kept as a wordmark rather than the exact logo to stay clearly a demo.
 * `light` renders white text for use on the orange pay button.
 */
function VippsMark({ light = false }: { light?: boolean }) {
  return (
    <svg
      width="34"
      height="14"
      viewBox="0 0 34 14"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <text
        x="0"
        y="11"
        fontFamily="'Inter', system-ui, sans-serif"
        fontSize="12"
        fontWeight="800"
        letterSpacing="-0.3"
        fill={light ? "#ffffff" : "#ff5b2e"}
      >
        Vipps
      </text>
    </svg>
  );
}

/** A simple card icon for the card payment option. */
function CardMark() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="13"
        rx="2"
        stroke="currentColor"
      />
      <path d="M0 4.5 H20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9 H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
