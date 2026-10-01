"use client";

import { useEffect, useState } from "react";

export default function Downloads() {
  const [downloads, setDownloads] = useState<number | null>(null);

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
        // silent by design — the line simply stays absent
      }
    }

    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (downloads === null) return null;

  return <span className="mono text-faint">{downloads.toLocaleString("en-US")} DOWNLOADS</span>;
}
