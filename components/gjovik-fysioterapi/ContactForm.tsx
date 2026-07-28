"use client";

import { useState } from "react";
import type { Locale } from "@/content/gjovik-fysioterapi";

/**
 * Mock contact form for the Kontakt page. Client-side only — no real sending,
 * no backend. Shows a success state on submit.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const isNo = locale === "no";
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div
      className="rounded-[6px] border p-6 sm:p-8"
      style={{
        backgroundColor: "var(--physio-surface)",
        borderColor: "var(--physio-rule)",
      }}
    >
      {sent ? (
        <div className="py-10 text-center">
          <div className="mb-4 flex justify-center">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black"
              style={{
                backgroundColor: "var(--physio-accent)",
                color: "var(--physio-on-accent)",
              }}
            >
              ✓
            </span>
          </div>
          <h3
            className="text-xl font-black uppercase tracking-tight"
            style={{ fontFamily: "var(--font-archivo), sans-serif" }}
          >
            {isNo ? "Melding sendt." : "Message sent."}
          </h3>
          <p
            className="mx-auto mt-2 max-w-sm text-sm"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {isNo
              ? "Takk! Vi svarer så raskt vi kan — som regel innen et par timer."
              : "Thanks! We'll reply as soon as we can — usually within a couple of hours."}
          </p>
          <button
            onClick={() => {
              setSent(false);
              setName("");
              setEmail("");
              setMessage("");
            }}
            className="mt-6 w-full max-w-xs rounded-[3px] border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em]"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              borderColor: "var(--physio-rule)",
              color: "var(--physio-text-soft)",
            }}
          >
            {isNo ? "Send en til" : "Send another"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3
            className="mb-1 text-xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "var(--font-archivo), sans-serif" }}
          >
            {isNo ? "Skriv til oss" : "Write to us"}
          </h3>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--physio-text-soft)" }}
          >
            {isNo
              ? "Ingen ekte utsending — dette er en demo. Men vi hadde svart."
              : "No real sending — this is a demo. But we would have replied."}
          </p>
          <div className="space-y-4">
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
            <label className="block">
              <span
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  color: "var(--physio-text-soft)",
                }}
              >
                {isNo ? "Melding" : "Message"}
              </span>
              <textarea
                value={message}
                required
                rows={4}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isNo ? "Hva kan vi hjelpe med?" : "What can we help with?"
                }
                className="w-full resize-none rounded-[3px] border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--physio-accent)]"
                style={{
                  borderColor: "var(--physio-rule)",
                  color: "var(--physio-text)",
                }}
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-[3px] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              backgroundColor: "var(--physio-accent)",
              color: "var(--physio-on-accent)",
            }}
          >
            {isNo ? "Send melding" : "Send message"} →
          </button>
        </form>
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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          color: "var(--physio-text-soft)",
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[3px] border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--physio-accent)]"
        style={{
          borderColor: "var(--physio-rule)",
          color: "var(--physio-text)",
        }}
      />
    </label>
  );
}
