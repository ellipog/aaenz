"use client";

import { useState } from "react";
import type { Locale } from "@/content/strand-treverk";
import { tx, contact } from "@/content/strand-treverk";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The enquiry form — the second half of the brief ("take enquiries via a
 * contact form"). POSTs to the existing /api/contact route (same as the host
 * site's form). The "drawing" framing: field labels are mono caption-style, like
 * callouts on a plan.
 */
export function WorkshopContactForm({ locale }: { locale: Locale }) {
  const f = contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "strand-treverk demo",
          locale,
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputBase =
    "w-full rounded-[2px] border bg-[var(--ws-bg)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ws-accent)]";
  const labelBase =
    "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em]";
  const labelStyle = {
    fontFamily: "var(--font-plex-mono), monospace",
    color: "var(--ws-text-soft)",
  };
  const fieldStyle = {
    borderColor: "var(--ws-rule)",
    color: "var(--ws-text)",
    fontFamily: "var(--font-plex-sans), sans-serif",
  } as React.CSSProperties;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="st-name" className={labelBase} style={labelStyle}>
            {tx(f.nameLabel, locale)}
          </label>
          <input
            id="st-name"
            name="name"
            type="text"
            required
            placeholder={tx(f.namePlaceholder, locale)}
            className={inputBase}
            style={fieldStyle}
          />
        </div>
        <div>
          <label htmlFor="st-email" className={labelBase} style={labelStyle}>
            {tx(f.emailLabel, locale)}
          </label>
          <input
            id="st-email"
            name="email"
            type="email"
            required
            placeholder={tx(f.emailPlaceholder, locale)}
            className={inputBase}
            style={fieldStyle}
          />
        </div>
      </div>

      <div>
        <label htmlFor="st-type" className={labelBase} style={labelStyle}>
          {tx(f.projectTypeLabel, locale)}
        </label>
        <select
          id="st-type"
          name="projectType"
          className={inputBase}
          style={fieldStyle}
          defaultValue=""
        >
          <option value="" disabled>
            {locale === "no" ? "Velg…" : "Choose…"}
          </option>
          {f.projectTypes.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {tx(pt.label, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="st-message" className={labelBase} style={labelStyle}>
          {tx(f.messageLabel, locale)}
        </label>
        <textarea
          id="st-message"
          name="message"
          required
          rows={4}
          placeholder={tx(f.messagePlaceholder, locale)}
          className={`${inputBase} resize-none`}
          style={fieldStyle}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center rounded-[2px] px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{
            fontFamily: "var(--font-plex-mono), monospace",
            backgroundColor: "var(--ws-accent)",
            color: "var(--ws-on-dark)",
          }}
        >
          {status === "submitting" ? tx(f.submitting, locale) : tx(f.submit, locale)}
        </button>

        {status === "success" && (
          <p
            className="font-mono text-[12px]"
            style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-moss, var(--ws-accent))" }}
          >
            ✓ {tx(f.success, locale)}
          </p>
        )}
        {status === "error" && (
          <p
            className="font-mono text-[12px]"
            style={{ fontFamily: "var(--font-plex-mono), monospace", color: "var(--ws-accent)" }}
          >
            ✕ {tx(f.error, locale)}
          </p>
        )}
      </div>
    </form>
  );
}
