"use client";

import { useEffect, useState } from "react";

/*
 * The live download count across Modrinth and CurseForge, set as a readout. On
 * first arrival the digits roll before they lock; if the count cannot be had the
 * whole block stays absent.
 */
export default function Downloads() {
  const [downloads, setDownloads] = useState<number | null>(null);
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/downloads");
        if (!res.ok) return;
        const data = (await res.json()) as { downloads?: number | null };
        if (alive && typeof data.downloads === "number") {
          setDownloads(data.downloads);
        }
      } catch {
        // silent by design — the readout simply stays absent
      }
    }

    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (downloads === null) return;
    const final = downloads.toLocaleString("en-US");
    if (shown !== null || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(final);
      return;
    }
    const start = performance.now();
    const id = setInterval(() => {
      const e = performance.now() - start;
      const locked = Math.floor(e / 90);
      setShown(
        Array.from(final)
          .map((c, i) => (i < locked || c === "," ? c : String(Math.floor(Math.random() * 10))))
          .join(""),
      );
      if (locked >= final.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
    // `shown` is read only to tell a first arrival from a refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloads]);

  if (downloads === null || shown === null) return null;

  return (
    <div>
      <span className="mono block text-faint">TOTAL DOWNLOADS</span>
      <span className="mt-2 block font-mono text-[clamp(40px,6vw,76px)] font-bold leading-none tracking-[.02em] text-bone tabular-nums">
        {shown}
      </span>
      <span className="mono mt-3 block text-faint">MODRINTH ＋ CURSEFORGE ・ LIVE</span>
    </div>
  );
}
