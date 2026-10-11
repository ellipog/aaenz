"use client";

import { useState } from "react";
import ContactForm from "@/components/contact-form";

/*
 * The lens opens. `send word` is a toggle, not a link: pressing it grows the
 * pill and the fields sit inside it. Height animates through grid rows so the
 * ring draws itself around the form; red stays rationed to one satellite dot
 * that only lands while the panel is open. The address line below remains a
 * plain mailto, so no-JS readers still have a way through.
 */
export default function WordPanel() {
  const [open, setOpen] = useState(false);
  const panelId = "word-form-panel";

  return (
    <span className="relative inline-block px-6 py-8 sm:px-12">
      <span
        aria-hidden="true"
        // Fixed 107px caps = the pill's own end-curve at rest height. Never
        // rounded-full: on a tall panel that turns the lens into a circle.
        className={`pointer-events-none absolute -inset-x-10 inset-y-0 rounded-[107px] border transition-colors duration-500 motion-reduce:transition-none ${open ? "border-white/40" : "border-white/25"}`}
      />
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red transition-opacity duration-500 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* Ink wash — fades in with the panel so the fields sit on calm ground. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-x-10 inset-y-0 rounded-[107px] bg-ink/55 backdrop-blur-[3px] transition-opacity duration-700 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
      />
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="relative cursor-pointer font-serif text-[clamp(56px,10vw,150px)] font-light italic leading-none transition-colors hover:text-red"
      >
        send word
      </button>
      <div
        id={panelId}
        className={`relative grid transition-all duration-700 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mx-auto w-[min(76vw,460px)] pb-2 pt-8">
            <ContactForm embedded focusSignal={open} />
          </div>
        </div>
      </div>
    </span>
  );
}
