"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STEP = 12; // px a glyph, down the rail

/*
 * The scrollbar, drawn as type: a faint column of ︴ wave strokes down the right
 * edge, meandering a little, with the part of the page in view inked red. The
 * red is the same column cut out by a clip, so it slides smoothly along the
 * strokes rather than jumping a glyph at a time. It rises while the page moves
 * or the pointer nears the edge and sinks again when all is still. Drag the red
 * to scroll, or press the rail anywhere to jump there. The browser's own bar is
 * hidden in globals.css; the keyboard and wheel scroll as they always do.
 */
export default function ScrollRail() {
  const ref = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const rail = ref.current;
    const ink = inkRef.current;
    if (!rail || !ink) return;
    const doc = document.documentElement;
    let H = 0;
    let max = 0;
    let top = 0;
    let len = 0;
    let near = false;
    let drag: { offset: number; id: number } | null = null;
    let hide = 0;
    let raf = 0;

    const paint = () => {
      raf = 0;
      max = doc.scrollHeight - window.innerHeight;
      rail.style.visibility = max > 4 ? "" : "hidden";
      if (max <= 4 || !H) return;
      len = Math.max(36, (H * window.innerHeight) / doc.scrollHeight);
      top = (Math.min(max, Math.max(0, window.scrollY)) / max) * (H - len);
      ink.style.clipPath = `inset(${top.toFixed(1)}px 0 ${Math.max(0, H - top - len).toFixed(1)}px 0)`;
    };
    const measure = () => {
      H = rail.clientHeight;
      setN(Math.floor(H / STEP));
      paint();
    };
    const show = () => {
      rail.dataset.on = "";
      clearTimeout(hide);
      if (!near && !drag) hide = window.setTimeout(() => delete rail.dataset.on, 1200);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onScroll = () => {
      schedule();
      show();
    };
    const onNear = (e: PointerEvent) => {
      const now = e.pointerType !== "touch" && window.innerWidth - e.clientX < 32;
      if (now === near) return;
      near = now;
      if (near) rail.dataset.near = "";
      else delete rail.dataset.near;
      show();
    };
    const scrollTo = (y: number) => {
      const room = H - len;
      if (room <= 0) return;
      window.scrollTo({ top: (Math.min(room, Math.max(0, y)) / room) * max, behavior: "instant" });
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const y = e.clientY - rail.getBoundingClientRect().top;
      const onThumb = y >= top && y <= top + len;
      drag = { offset: onThumb ? y - top : len / 2, id: e.pointerId };
      rail.setPointerCapture(e.pointerId);
      rail.dataset.drag = "";
      if (!onThumb) scrollTo(y - drag.offset);
      show();
    };
    const onDrag = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      scrollTo(e.clientY - rail.getBoundingClientRect().top - drag.offset);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
      drag = null;
      delete rail.dataset.drag;
      show();
    };

    // the page grows as plates and images settle, and the rail with the window
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onNear, { passive: true });
    rail.addEventListener("pointerdown", onDown);
    rail.addEventListener("pointermove", onDrag);
    rail.addEventListener("pointerup", onUp);
    rail.addEventListener("pointercancel", onUp);
    measure();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(hide);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onNear);
      rail.removeEventListener("pointerdown", onDown);
      rail.removeEventListener("pointermove", onDrag);
      rail.removeEventListener("pointerup", onUp);
      rail.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // the strokes meander a pixel or two either side, so the rail runs like the rest of the water
  const column = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => (
        <span className="block h-[12px]" key={i} style={{ transform: `translateX(${(Math.sin(i * 0.55) * 1.6).toFixed(2)}px)` }}>
          ︴
        </span>
      )),
    [n],
  );

  return (
    <div
      aria-hidden="true"
      className="group fixed bottom-2 right-0 top-2 z-[80] w-4 touch-none select-none opacity-0 transition-opacity duration-500 data-[on]:opacity-100 data-[drag]:duration-100"
      data-rail
      ref={ref}
    >
      <div className="mincho absolute inset-0 overflow-hidden text-center text-[11px] leading-[12px] text-faint transition-colors group-data-[drag]:text-dim group-data-[near]:text-dim">
        {column}
      </div>
      <div
        className="mincho absolute inset-0 overflow-hidden text-center text-[11px] leading-[12px] text-red [text-shadow:0_0_1px_#e3271d,0_0_6px_rgba(227,39,29,.55)]"
        ref={inkRef}
      >
        {column}
      </div>
    </div>
  );
}
