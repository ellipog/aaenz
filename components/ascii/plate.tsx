"use client";

import { useEffect, useRef } from "react";
import { Engine, type Program } from "./engine";
import { programs, type ProgramName } from "./programs";

/*
 * A character plate. Server components pass the program by name (functions do not
 * cross the boundary) and the engine takes over the canvas on mount. Plates are
 * decorative unless given a `label`, in which case they read as one image.
 */
export default function Plate({
  kind,
  options,
  cell = 14,
  cellSm = 10,
  fps = 30,
  reveal = "scan",
  interactive = true,
  ripple = true,
  label,
  className = "",
}: {
  kind: ProgramName;
  options?: Record<string, unknown>;
  cell?: number;
  cellSm?: number;
  fps?: number;
  reveal?: "scan" | "center" | "none";
  interactive?: boolean;
  ripple?: boolean;
  label?: string;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const key = JSON.stringify(options ?? {});
  // The canvas is absolutely placed, so the host needs a position — unless one is passed in.
  const position = /\b(absolute|fixed)\b/.test(className) ? "" : "relative";

  useEffect(() => {
    if (!host.current || !canvas.current) return;
    const engine = new Engine(
      host.current,
      canvas.current,
      programs[kind] as Program<Record<string, unknown>>,
      JSON.parse(key),
      { cell, cellSm, fps, reveal, interactive, ripple },
    );
    return () => engine.destroy();
  }, [kind, key, cell, cellSm, fps, reveal, interactive, ripple]);

  return (
    <div
      ref={host}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={`${position} overflow-hidden ${className}`}
      data-cursor={interactive ? "plate" : undefined}
      role={label ? "img" : undefined}
    >
      <canvas ref={canvas} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
