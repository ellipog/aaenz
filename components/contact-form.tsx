"use client";

import { useEffect, useRef, useState } from "react";

type Fields = { name?: string; email?: string; message?: string };

const replyFrom = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "elliot@aaenz.no").toUpperCase();

const input =
  "w-full rounded-none border-b bg-transparent px-1 py-3 text-center font-body text-[15px] leading-relaxed text-paper placeholder:text-[#8f8b82]/70 outline-none transition-colors";

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
        <span aria-hidden="true" className="mx-auto block h-[7px] w-[7px] rounded-full bg-red" />
        <p className="mt-5 font-light text-[#cfcbc2]">
          Word received — I reply from the address below.
        </p>
        <span className="mono mt-3 block text-[#8f8b82]">SENT · TALK SOON</span>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setFieldErrors({});
    setNotice("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; fields?: Fields };
      if (res.ok && data.ok) {
        setStatus("sent");
        return;
      }
      setStatus("error");
      setFieldErrors(data.fields ?? {});
      setNotice(data.error ?? "The word didn’t go through — write directly instead.");
    } catch {
      setStatus("error");
      setNotice("The word didn’t go through — write directly instead.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={embedded ? "w-full text-center" : "mx-auto mt-12 w-full max-w-[520px] text-left"}
      noValidate={false}
    >
      <div>
        <label className="mono block text-center text-[#8f8b82]" htmlFor="word-name">
          NAME
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
          className={`${input} mt-3 border-white/25 placeholder:text-[#8f8b82]/70 focus:border-white/70 ${fieldErrors.name ? "border-red" : ""}`}
        />
        {fieldErrors.name ? (
          <span className="mono mt-2 block text-center text-[#cfcbc2]">{fieldErrors.name}</span>
        ) : null}
      </div>

      <div className="mt-7">
        <label className="mono block text-center text-[#8f8b82]" htmlFor="word-email">
          EMAIL
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
          className={`${input} mt-3 border-white/25 placeholder:text-[#8f8b82]/70 focus:border-white/70 ${fieldErrors.email ? "border-red" : ""}`}
        />
        {fieldErrors.email ? (
          <span className="mono mt-2 block text-center text-[#cfcbc2]">{fieldErrors.email}</span>
        ) : null}
      </div>

      <div className="mt-7">
        <label className="mono block text-center text-[#8f8b82]" htmlFor="word-message">
          WORD
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
          className={`${input} mt-3 resize-none overflow-hidden border-white/25 placeholder:text-[#8f8b82]/70 focus:border-white/70 ${fieldErrors.message ? "border-red" : ""}`}
        />
        {fieldErrors.message ? (
          <span className="mono mt-2 block text-center text-[#cfcbc2]">{fieldErrors.message}</span>
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
        <p className="mono mt-6 text-center text-[#cfcbc2]" role="alert">
          {notice}
        </p>
      ) : null}

      <div className="mt-8 text-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="mono inline-block cursor-pointer rounded-none border border-white/25 bg-transparent px-10 py-4 text-paper transition-colors hover:border-red hover:text-red disabled:cursor-wait disabled:opacity-50"
        >
          {status === "sending" ? "SENDING…" : "SEND →"}
        </button>
        <span className="mono mt-4 block text-[#8f8b82]">REPLIES FROM {replyFrom}</span>
      </div>
    </form>
  );
}
