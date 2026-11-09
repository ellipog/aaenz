"use client";

import { useEffect, useRef } from "react";
import { SHORE } from "./ascii/shore-shape";

/*
 * The cursor: a red ■ at the point, and four hairline corners standing round it
 * as a small reticle. Over a link or a control the corners leave the point and
 * lock onto what it will press, framing the words themselves (not the padding
 * round them) in red; along a row of links they glide from one to the next, and
 * a press snaps them in. A link too big to frame, like a whole card, locks onto
 * the part of it nearest the pointer instead. The corners reach a little: with
 * the pointer over empty ground or a plate, a link whose words are within a few
 * pixels is locked onto all the same, and a press there goes to it (and not to
 * the plate), so nobody has to land on the letters. Over a plate the reticle opens a
 * little; over a field it folds away and the point stands up into a caret. On
 * the white sand the ink turns to void.
 *
 * The point never moves on its own: it sits exactly where the pointer is, read
 * from raw updates and set on whole device pixels, so it doesn't swim or shimmer.
 * The corners ride along with whatever they hang on (the point, or the element
 * they're locked to, through any scrolling) and springs only change their shape,
 * so they never trail behind either.
 *
 * All DOM: five small elements moved by transform on the compositor. Fine
 * pointers only: touch, and anyone who asks for reduced motion, keep the system
 * cursor.
 */

const PRESSABLE =
  'a[href], button:not(:disabled), [role="button"], summary, label, select, input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], [data-rail]';
const TYPABLE = 'input, textarea, [contenteditable="true"]';
const BONE = "#ece7db";
const RED = "#e3271d";
const VOID = "#050505";

const ARM = 7; // each corner's arms, px
const PAD = 6; // between the corners and what they frame
const LOCK_W = 460; // the largest box the corners will frame
const LOCK_H = 200;
const REACH = 18; // how far from a link's words the corners still reach for it, px
const LET_GO = 28; // and how far they follow it out before letting go
const CORNERS = ["tl", "tr", "bl", "br"] as const;

type Mode = "idle" | "press" | "text" | "plate";
type Box = { l: number; t: number; r: number; b: number };
type Spring = { x: number; y: number; vx: number; vy: number };

/* What a reader sees of an element: its text, set tight, or its own box when it has none or is a control. */
function inkBox(el: Element): Box | null {
  const r = el.getBoundingClientRect();
  if (r.width < 1 && r.height < 1) return null;
  if (el.matches("button, input, select, textarea, label, [data-rail]")) return { l: r.left, t: r.top, r: r.right, b: r.bottom };
  let box: Box | null = null;
  const range = document.createRange();
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    if (!n.textContent?.trim()) continue;
    range.selectNodeContents(n);
    for (const q of range.getClientRects()) {
      if (q.width < 1 || q.height < 1) continue;
      if (!box) box = { l: q.left, t: q.top, r: q.right, b: q.bottom };
      else {
        box.l = Math.min(box.l, q.left);
        box.t = Math.min(box.t, q.top);
        box.r = Math.max(box.r, q.right);
        box.b = Math.max(box.b, q.bottom);
      }
    }
  }
  return box ?? { l: r.left, t: r.top, r: r.right, b: r.bottom };
}

const fits = (b: Box | null): b is Box => !!b && b.r - b.l <= LOCK_W && b.b - b.t <= LOCK_H;

// how far a point is from a box, 0 inside it
const gap = (x: number, y: number, b: Box) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));

const ease = (v: number, to: number, rate: number, dt: number) => v + (to - v) * (1 - Math.exp(-dt * rate));

// firm and just under critical damping, stepped finely so a slow frame can't throw it
function spring(s: Spring, gx: number, gy: number, dt: number) {
  const k = 900;
  const d = 2 * Math.sqrt(k) * 0.86;
  for (let i = 0, n = Math.ceil(dt / (1 / 240)); i < n; i++) {
    const h = dt / n;
    s.vx += ((gx - s.x) * k - s.vx * d) * h;
    s.vy += ((gy - s.y) * k - s.vy * d) * h;
    s.x += s.vx * h;
    s.y += s.vy * h;
  }
  return Math.abs(gx - s.x) + Math.abs(gy - s.y) > 0.1 || Math.abs(s.vx) + Math.abs(s.vy) > 1;
}

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [point, ...corners] = Array.from(host.children) as HTMLElement[];
    const root = document.documentElement;
    root.classList.add("cursor");

    // the pointer, and what it is over
    const p = { x: window.innerWidth / 2, y: window.innerHeight / 2, in: false, seen: false };
    let mode: Mode = "idle";
    let target: Element | null = null; // the pressable element under the pointer
    let under: Element | null = null; // the element under the pointer
    let sand = false;
    let rescan = false;

    // a pressable within reach when the pointer is over nothing of its own, and the one in play either way
    let near: Element | null = null;
    let active: Element | null = null;
    // what the corners hang on: an element (with its framed box, relative to its own) or, when null, the point
    let lock: Element | null = null;
    let rel: Box = { l: 0, t: 0, r: 0, b: 0 };
    const picked = { x: Number.NaN, y: Number.NaN, under: null as Element | null };
    let downAt: { x: number; y: number } | null = null;
    let held: Element | null | undefined; // what they hung on last frame
    const was = { x: 0, y: 0 }; // where that was

    const c: Spring[] = CORNERS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    let placed = false;
    let shown = 0;
    let typing = 0;
    let plate = 0;
    let press = 0;
    let ink = "";
    let raf = 0;
    let last = 0;
    let dpr = 0;

    const classify = (el: Element | null) => {
      under = el;
      target = null;
      sand = false;
      if (el) {
        const shore = el.closest("[data-shore]");
        if (shore) {
          const r = shore.getBoundingClientRect();
          sand = (p.y - r.top) / r.height > SHORE + 0.015;
        }
        if (el.closest('[data-ground="light"]')) sand = true;
      }
      if (!el) mode = "idle";
      else if (el.closest(TYPABLE) && !el.closest(PRESSABLE)) mode = "text";
      else if ((target = el.closest(PRESSABLE))) mode = "press";
      else if (el.closest('[data-cursor="plate"]')) mode = "plate";
      else mode = "idle";
    };

    // a link or button whose words are within reach of the pointer: hit tests on two rings round it, so
    // anything covering a link hides it from these just as it would from a click
    const reach = () => {
      let best: Element | null = null;
      let bestD = Infinity;
      const seen = new Set<Element>();
      const consider = (t: Element | null | undefined, limit: number) => {
        if (!t || seen.has(t) || t.matches("[data-rail]")) return;
        seen.add(t);
        const box = inkBox(t);
        if (!fits(box)) return;
        const d = gap(p.x, p.y, box);
        if (d <= limit && d < bestD) {
          best = t;
          bestD = d;
        }
      };
      // the one already held is let go a little further out than it was reached for
      if (near?.isConnected) consider(near, LET_GO);
      for (const r of [REACH / 2, REACH]) {
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2;
          consider(document.elementFromPoint(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r)?.closest(PRESSABLE), REACH);
        }
      }
      return best as Element | null;
    };

    // what the corners lock onto: the outermost part, from the pressable down to the pointer, small
    // enough to frame; or, with the pointer out in a big card's margin, the part of the card nearest it
    const pick = () => {
      picked.x = p.x;
      picked.y = p.y;
      picked.under = under;
      near = mode === "idle" || mode === "plate" ? reach() : null;
      active = mode === "press" ? target : near;
      lock = null;
      if (!active || active.matches("[data-rail]")) return;
      let box: Box | null = null;
      const chain: Element[] = [];
      for (let el: Element | null = mode === "press" ? under : active; el; el = el.parentElement) {
        chain.push(el);
        if (el === active) break;
      }
      for (let i = chain.length - 1; i >= 0 && !lock; i--) {
        const b = inkBox(chain[i]);
        if (fits(b)) {
          lock = chain[i];
          box = b;
        }
      }
      if (!lock) {
        let bestD = Infinity;
        for (const el of active.querySelectorAll("*")) {
          if (getComputedStyle(el).display !== "block") continue;
          const b = inkBox(el);
          if (!fits(b)) continue;
          const d = gap(p.x, p.y, b);
          if (d < bestD) {
            lock = el;
            box = b;
            bestD = d;
          }
        }
      }
      if (lock && box) {
        const r = lock.getBoundingClientRect();
        rel = { l: box.l - r.left, t: box.t - r.top, r: box.r - r.left, b: box.b - r.top };
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const d = Math.min(window.devicePixelRatio || 1, 4);
      if (d !== dpr) {
        dpr = d;
        // hairlines on whole device pixels: crisp at any scale
        const bw = `${Math.max(1, Math.round(1.5 * dpr)) / dpr}px`;
        for (const el of corners) el.style.borderWidth = bw;
      }
      const snap = (v: number) => Math.round(v * dpr) / dpr;
      let looked = false;
      if (rescan) {
        rescan = false;
        looked = true;
        classify(document.elementFromPoint(p.x, p.y));
      }
      // look again for what to lock onto once the pointer has moved a pixel, or the page under it
      if (looked || under !== picked.under || Math.abs(p.x - picked.x) + Math.abs(p.y - picked.y) >= 1) pick();
      const pressing = !!active;

      shown = ease(shown, p.in ? 1 : 0, 12, dt);
      typing = ease(typing, mode === "text" ? 1 : 0, 16, dt);
      plate = ease(plate, mode === "plate" ? 1 : 0, 10, dt);
      press *= Math.exp(-dt * 7);

      // the frame the corners hang in this frame
      let box: Box | null = null;
      if (lock && pressing) {
        const r = lock.getBoundingClientRect();
        box = { l: r.left + rel.l, t: r.top + rel.t, r: r.left + rel.r, b: r.top + rel.b };
      }
      const hang = box ? lock : null;
      const ax = box ? box.l : p.x;
      const ay = box ? box.t : p.y;
      // carry the corners with what they hang on, so they never trail it; a change of hold glides on the springs
      if (placed && hang === held) {
        const dx = ax - was.x;
        const dy = ay - was.y;
        if (dx || dy) for (const k of c) (k.x += dx), (k.y += dy);
      }
      held = hang;
      was.x = ax;
      was.y = ay;

      let goals: [number, number][];
      if (box) {
        const pad = PAD - press * 3;
        goals = [
          [box.l - pad, box.t - pad],
          [box.r + pad, box.t - pad],
          [box.l - pad, box.b + pad],
          [box.r + pad, box.b + pad],
        ];
      } else {
        const s = (pressing ? 14 : 9 + plate * 5) * (1 - press * 0.35) * (1 - 0.8 * typing);
        goals = [
          [p.x - s, p.y - s],
          [p.x + s, p.y - s],
          [p.x - s, p.y + s],
          [p.x + s, p.y + s],
        ];
      }
      if (!placed && p.seen) {
        c.forEach((k, i) => {
          k.x = goals[i][0];
          k.y = goals[i][1];
        });
        placed = true;
      }

      let moving = false;
      for (let i = 0; i < 4; i++) {
        if (spring(c[i], goals[i][0], goals[i][1], dt)) moving = true;
        const ox = i % 2 ? -ARM : 0;
        const oy = i > 1 ? -ARM : 0;
        corners[i].style.transform = `translate3d(${snap(c[i].x + ox)}px,${snap(c[i].y + oy)}px,0)`;
      }

      const want = pressing ? RED : sand ? VOID : BONE;
      if (want !== ink) host.style.color = ink = want;
      const cornerA = (shown * (1 - typing) * (pressing ? 1 : 0.7)).toFixed(3);
      for (const el of corners) el.style.opacity = cornerA;

      // the point, on whole device pixels: a red square, drawn in to a dot while the corners frame
      // something (so it doesn't sit on the words), a caret over a field, a flash of ink on a press
      const size = snap(box ? 3 : pressing ? 4 : 5);
      const w = snap(size + (2 - size) * typing);
      const h = snap(size + (16 - size) * typing);
      point.style.width = `${w}px`;
      point.style.height = `${h}px`;
      point.style.transform = `translate3d(${snap(p.x - w / 2)}px,${snap(p.y - h / 2)}px,0)`;
      point.style.opacity = shown.toFixed(3);
      point.style.background = press > 0.55 ? (sand ? VOID : BONE) : RED;

      const settling =
        Math.abs(shown - (p.in ? 1 : 0)) > 0.004 ||
        Math.abs(typing - (mode === "text" ? 1 : 0)) > 0.004 ||
        Math.abs(plate - (mode === "plate" ? 1 : 0)) > 0.004;
      if (moving || settling || press > 0.01) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    /* -- input ---------------------------------------------------------------- */

    const at = (x: number, y: number) => {
      p.x = x;
      p.y = y;
      p.in = true;
      p.seen = true;
      kick();
    };
    // raw updates arrive as fast as the hardware reports, ahead of the frame-aligned move
    const raw = "onpointerrawupdate" in window;
    const onRaw = (e: PointerEvent) => {
      if (e.pointerType !== "touch") at(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!raw) at(e.clientX, e.clientY);
      classify(e.target as Element | null);
      kick();
    };
    // a link within reach is what the press is for: a plate under the pointer doesn't also take it
    // (no ripple, no mining), so the click can go to the link alone
    const reaching = (e: { target: EventTarget | null }) => {
      const t = near;
      if (!t?.isConnected || mode === "press" || mode === "text") return null;
      const hit = e.target as Element | null;
      if (hit && (t.contains(hit) || hit.closest(`${PRESSABLE}, ${TYPABLE}`))) return null;
      return t;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      downAt = { x: e.clientX, y: e.clientY };
      press = 1;
      if (reaching(e)) e.stopPropagation();
      kick();
    };
    // a click that lands near a link rather than on it goes to the link the corners are holding, so
    // what the cursor shows is what a click does; a drag (selecting text) is left alone
    const onClick = (e: MouseEvent) => {
      const t = reaching(e);
      if (!t || e.button !== 0) return;
      if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return;
      e.preventDefault();
      e.stopPropagation();
      t.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: e.clientX,
          clientY: e.clientY,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
        }),
      );
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        p.in = false;
        kick();
      }
    };
    const onBlur = () => {
      p.in = false;
      kick();
    };
    // scrolling moves the page under a still pointer: look again at what it's over on the next frame
    const onScroll = () => {
      if (!p.seen) return;
      rescan = true;
      kick();
    };

    if (raw) window.addEventListener("pointerrawupdate" as "pointermove", onRaw, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    // capture, so a press near a link is seen (and kept from a plate) before anything under it
    window.addEventListener("pointerdown", onDown, { capture: true, passive: true });
    window.addEventListener("click", onClick, true);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("blur", onBlur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", kick);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("cursor");
      window.removeEventListener("pointerrawupdate" as "pointermove", onRaw);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", kick);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] text-bone [contain:strict] [transition:color_.15s]" ref={ref}>
      <span className="absolute left-0 top-0 opacity-0 will-change-transform" />
      {CORNERS.map((k) => (
        <span
          className="absolute left-0 top-0 h-[7px] w-[7px] border-[1.5px] border-solid opacity-0 will-change-transform"
          key={k}
          style={{
            borderLeftColor: k[1] === "l" ? "currentColor" : "transparent",
            borderRightColor: k[1] === "r" ? "currentColor" : "transparent",
            borderTopColor: k[0] === "t" ? "currentColor" : "transparent",
            borderBottomColor: k[0] === "b" ? "currentColor" : "transparent",
          }}
        />
      ))}
    </div>
  );
}
