"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/* The viewer's own clock, ticking in the header like a mission timer. */
export function Clock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{now ?? "--:--:--"}</span>;
}

/* A sync readout that never quite settles. */
export function Sync() {
  const [v, setV] = useState(99.7);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setV(99.2 + Math.random() * 0.8), 900);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{v.toFixed(1)}%</span>;
}
