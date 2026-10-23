"use client";

import { useState } from "react";
import ContactForm from "@/components/contact-form";

/*
 * `send word` is a toggle, not a link: pressing it unfolds the fields under the
 * title. Height animates through grid rows. The
 * address line below remains a plain mailto, so no-JS readers still have a way.
 */
export default function WordPanel() {
  const [open, setOpen] = useState(false);
  const panelId = "word-form-panel";

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="mincho cursor-pointer text-left text-[clamp(60px,10vw,150px)] leading-[.95] tracking-[-.01em] transition-colors hover:text-red"
      >
        send word<span className="animate-blink text-red">_</span>
      </button>
      <div
        id={panelId}
        className={`relative grid transition-all duration-700 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-6 w-[min(88vw,520px)] bg-[radial-gradient(ellipse_at_30%_40%,rgba(5,5,5,.96)_60%,rgba(5,5,5,.7))]">
            <p className="mono m-0 px-1 pt-3 text-faint">
              TRANSMISSION <span className="text-dim">〜 CH.08</span>
            </p>
            <div className="px-1 py-5">
              <ContactForm embedded focusSignal={open} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
