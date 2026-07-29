"use client";

import { useEffect, useState } from "react";

/**
 * Gjøvik Fysioterapi — the live status readout for the HUD header.
 *
 * A small telemetry strip: a pulsing dot, a fake session id, and a ticking
 * clock. It makes the nav feel alive without being distracting. Hidden on
 * small screens (it would crowd the mobile layout).
 */
export function StatusReadout({ onlineLabel }: { onlineLabel: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hidden items-center gap-2 rounded-[3px] border px-2.5 py-1 xl:flex"
      style={{ borderColor: "var(--physio-rule)", backgroundColor: "var(--physio-surface)" }}
      aria-hidden
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: "var(--physio-accent)" }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--physio-accent)" }}
        />
      </span>
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--physio-text-soft)" }}
      >
        {onlineLabel}
      </span>
      {time && (
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--physio-accent)" }}
        >
          {time}
        </span>
      )}
    </div>
  );
}
