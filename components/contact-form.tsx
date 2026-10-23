"use client";

import { useEffect, useRef, useState } from "react";

type Fields = { name?: string; email?: string; message?: string };

const replyFrom = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "elliot@aaenz.no").toUpperCase();

const input =
  "w-full rounded-none border-b border-line bg-transparent px-1 py-2.5 font-mono text-[14px] leading-relaxed text-bone placeholder:text-faint outline-none transition-colors focus:border-red";

const label = "mono flex items-center gap-2 text-faint";

const DEFAULT_FAIL = "The word didn’t go through — write directly instead.";

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/*
 * The council: three seats deliberate over every word sent. They sit for as long
 * as the request takes (never less than a beat), then vote together — 承認 when
 * the mail went out, 否決 when it did not.
 */
function Council({ verdict }: { verdict: "ok" | "ng" | null }) {
  const word = verdict === null ? "…" : verdict === "ok" ? "YES" : "NO";
  return (
    <div className="mt-7" role="status">
      <p className="mono m-0 flex justify-between gap-4 text-dim">
        <span>DELIBERATION</span>
        <span className={verdict === "ng" ? "text-red" : verdict === "ok" ? "text-bone" : "text-faint"}>
          {verdict === null ? "THREE SEATS" : verdict === "ok" ? "UNANIMOUS ・ APPROVED" : "REJECTED"}
        </span>
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["I", "II", "III"].map((seat, i) => (
          <div
            className={`grid h-[68px] place-items-center text-center transition-colors duration-300 ${
              verdict === null ? "bg-bone/10 text-bone" : verdict === "ok" ? "bg-bone text-void" : "bg-red text-bone"
            }`}
            key={seat}
            style={{
              clipPath: "polygon(22% 0, 78% 0, 100% 50%, 78% 100%, 22% 100%, 0 50%)",
              transitionDelay: verdict ? `${i * 220}ms` : "0ms",
            }}
          >
            <span>
              <span className="mincho block text-[15px] leading-none">{seat}</span>
              <span
                className={`mincho mt-1.5 block text-[11px] leading-none ${verdict === null ? "animate-blink" : ""}`}
                style={{ animationDelay: `${i * 0.27}s` }}
              >
                {word}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContactForm({
  embedded = false,
  focusSignal = false,
}: {
  embedded?: boolean;
  focusSignal?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Fields>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [verdict, setVerdict] = useState<"ok" | "ng" | null>(null);
  const [notice, setNotice] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // The word box grows with what you write — no drag handle.
  function growMessage() {
    const el = messageRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    growMessage();
  }, [message]);

  // When the lens opens around us, put the cursor in the first field.
  useEffect(() => {
    if (focusSignal && status === "idle") {
      const t = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 350);
      return () => clearTimeout(t);
    }
  }, [focusSignal, status]);

  if (status === "sent") {
    return (
      <div className={embedded ? "py-4 text-center" : "mx-auto mt-12 max-w-[520px] text-center"}>
        <p aria-hidden="true" className="mincho m-0 text-[clamp(44px,6vw,64px)] leading-none text-red">
          Received.
        </p>
        <p className="mt-5 text-dim">Word received — I reply from the address below.</p>
        <span className="mono mt-3 block text-dim">TALK SOON</span>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setVerdict(null);
    setFieldErrors({});
    setNotice("");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function send(): Promise<{ ok: boolean; error?: string; fields?: Fields }> {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message, company }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string; fields?: Fields };
        return { ok: res.ok && Boolean(data.ok), error: data.error, fields: data.fields };
      } catch {
        return { ok: false };
      }
    }

    const [result] = await Promise.all([send(), pause(still ? 0 : 1400)]);
    setVerdict(result.ok ? "ok" : "ng");
    await pause(still ? 0 : 1300);
    if (result.ok) {
      setStatus("sent");
      return;
    }
    setStatus("error");
    setVerdict(null);
    setFieldErrors(result.fields ?? {});
    setNotice(result.error ?? DEFAULT_FAIL);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={embedded ? "w-full text-left" : "mx-auto mt-12 w-full max-w-[520px] text-left"}
      noValidate={false}
    >
      <div>
        <label className={label} htmlFor="word-name">
          <span className="text-red">＞</span> NAME
        </label>
        <input
          id="word-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          value={name}
          ref={nameRef}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-invalid={Boolean(fieldErrors.name)}
          className={`${input} mt-1 ${fieldErrors.name ? "border-red" : ""}`}
        />
        {fieldErrors.name ? (
          <span className="mono mt-2 block text-red">{fieldErrors.name}</span>
        ) : null}
      </div>

      <div className="mt-6">
        <label className={label} htmlFor="word-email">
          <span className="text-red">＞</span> EMAIL
        </label>
        <input
          id="word-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={Boolean(fieldErrors.email)}
          className={`${input} mt-1 ${fieldErrors.email ? "border-red" : ""}`}
        />
        {fieldErrors.email ? (
          <span className="mono mt-2 block text-red">{fieldErrors.email}</span>
        ) : null}
      </div>

      <div className="mt-6">
        <label className={label} htmlFor="word-message">
          <span className="text-red">＞</span> WORD
        </label>
        <textarea
          id="word-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={3}
          value={message}
          ref={messageRef}
          onChange={(e) => {
            setMessage(e.target.value);
            growMessage();
          }}
          placeholder="A project, a collaboration, or just a good word…"
          aria-invalid={Boolean(fieldErrors.message)}
          className={`${input} mt-1 resize-none overflow-hidden ${fieldErrors.message ? "border-red" : ""}`}
        />
        {fieldErrors.message ? (
          <span className="mono mt-2 block text-red">{fieldErrors.message}</span>
        ) : null}
      </div>

      {/* Honeypot — humans never see this; bots fill it and get a fake success. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="word-company">Company</label>
        <input
          id="word-company"
          name="company"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {notice && status === "error" ? (
        <p className="mono mt-6 text-red" role="alert">
          {notice}
        </p>
      ) : null}

      {status === "sending" ? <Council verdict={verdict} /> : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <span className="mono text-faint">REPLIES FROM {replyFrom}</span>
        <button
          type="submit"
          disabled={status === "sending"}
          className="mono inline-block cursor-pointer rounded-none bg-[radial-gradient(ellipse_closest-side,rgba(227,39,29,.22),transparent)] px-7 py-3 text-bone transition-colors hover:text-red disabled:cursor-wait disabled:opacity-50"
        >
          {status === "sending" ? "SENDING…" : "SEND →"}
        </button>
      </div>
    </form>
  );
}
