"use client";

import { useEffect, useRef } from "react";
import { FAMILY, KATA, loadFonts } from "./ascii/engine";
import { SHORE } from "./ascii/shore-shape";

/*
 * The cursor is drawn in characters too. A red ■ marks the point; round it a
 * ring of 〜 strokes trails on a spring, stretching with the speed it is
 * dragged at, and swells red over anything that can be pressed, leaning toward
 * it. Over a field you type in, the waves line up into an I-beam. A press
 * opens a barrier ring and throws off a few kana. On the white sand of the
 * shore the ink turns to void.
 *
 * The point keeps the display's own pace: it reads raw pointer updates as they
 * arrive, draws on every frame the screen shows, and leads the pointer by the
 * frame still to come, so it sits under the hand rather than a frame behind.
 *
 * And it costs the page almost nothing, so that pace holds at 240Hz: every glyph
 * is cut once into a sprite (per ink) and stamped with a turn and a scale, rather
 * than set as type every frame, and the canvas is only as big as what it draws,
 * carried across the screen by the compositor instead of repainting the screen.
 *
 * Fine pointers only: touch, and anyone who asks for reduced motion, keep the
 * system cursor.
 */

type Rgb = [number, number, number];
const BONE: Rgb = [236, 231, 219];
const RED: Rgb = [227, 39, 29];
const DIM: Rgb = [140, 135, 123];
const VOID: Rgb = [5, 5, 5];

const PRESSABLE =
  'a[href], button:not(:disabled), [role="button"], summary, label, select, input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"]';
const TYPABLE = 'input, textarea, [contenteditable="true"]';

type Mode = "idle" | "press" | "text" | "plate";

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  ch: string;
  kana: boolean;
  ink: Rgb;
  size: number;
  seed: number;
}

interface Ring {
  x: number;
  y: number;
  age: number;
  ink: Rgb;
}

interface Stamp {
  ch: string;
  x: number;
  y: number;
  size: number;
  rot: number;
  ink: Rgb;
  a: number;
}

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const kana = () => KATA[Math.floor(Math.random() * KATA.length)];
const TAU = Math.PI * 2;
// where each of the ring's eight waves goes in the I-beam: x, y and turn
const BEAM: [number, number, number][] = [
  [-5, -14, 0], [5, -14, 0],
  [0, -8, Math.PI / 2], [0, -3, Math.PI / 2], [0, 2, Math.PI / 2], [0, 7, Math.PI / 2],
  [-5, 14, 0], [5, 14, 0],
];

// sprites are cut at this size (css px), with room round the glyph; nothing the cursor draws is larger
const FONT = 16;
const BOX = 24;
// the canvas, at rest: room for the ring and the point; it grows for a press or a fast throw
const REST = 160;

/** Glyphs cut once in white, then once per ink they are asked for. */
function cutter(dpr: number) {
  const D = Math.ceil(BOX * dpr);
  const white = new Map<string, HTMLCanvasElement>();
  const inked = new Map<string, HTMLCanvasElement>();
  const blank = () => {
    const c = document.createElement("canvas");
    c.width = c.height = D;
    return c;
  };
  const cut = (ch: string) => {
    let c = white.get(ch);
    if (!c) {
      c = blank();
      const g = c.getContext("2d")!;
      g.font = `400 ${FONT * dpr}px ${FAMILY}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#fff";
      g.fillText(ch, D / 2, D / 2);
      white.set(ch, c);
    }
    return c;
  };
  return {
    D,
    get(ch: string, ink: Rgb) {
      // inks in between (the ring easing to red, or to void on the sand) share a sprite per step of 4
      const r = Math.min(255, (ink[0] + 2) & ~3);
      const g = Math.min(255, (ink[1] + 2) & ~3);
      const b = Math.min(255, (ink[2] + 2) & ~3);
      const key = `${ch}${r},${g},${b}`;
      let c = inked.get(key);
      if (!c) {
        if (inked.size > 320) inked.clear();
        c = blank();
        const x = c.getContext("2d")!;
        x.drawImage(cut(ch), 0, 0);
        x.globalCompositeOperation = "source-in";
        x.fillStyle = `rgb(${r},${g},${b})`;
        x.fillRect(0, 0, D, D);
        inked.set(key, c);
      }
      return c;
    },
  };
}

export default function Cursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d")!;
    const root = document.documentElement;
    root.classList.add("cursor");

    let dpr = 1;
    let sprites = cutter(1);
    // the canvas's size and where its corner sits on the screen, in css px
    let cw = 0;
    let ch = 0;
    let ox = 0;
    let oy = 0;
    let roomy = 0; // since when the canvas has been far bigger than it needs
    const fit = (w: number, h: number) => {
      cw = w;
      ch = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 3);
      if (d !== dpr || !cw) {
        dpr = d;
        sprites = cutter(dpr);
        fit(REST, REST);
      }
    };
    size();
    // until the fonts are in, the sprites are cut from a fallback face; cut them again once they are
    loadFonts(["〜", ...KATA]).then(() => {
      sprites = cutter(dpr);
    });

    // where the pointer is, the last few places it was (to lead it by a frame), and the ring chasing it
    const p = { x: window.innerWidth / 2, y: window.innerHeight / 2, seen: false, in: false, down: false };
    const recent: { t: number; x: number; y: number }[] = [];
    let frameGap = 1000 / 60;
    const ring = { x: p.x, y: p.y, vx: 0, vy: 0, r: 15, spin: 0 };
    let shown = 0; // the whole cursor fades in and out with the pointer
    let hover = 0; // 0 → 1 over something pressable
    let ground = 0; // 0 on the void, 1 on the white sand
    let groundTarget = 0;
    let plate = 0; // over a plate that answers the pointer
    let typing = 0;
    let mode: Mode = "idle";
    let target: Element | null = null;
    let rescan = false; // the page moved under a still pointer: look again at what it is over
    const motes: Mote[] = [];
    const rings: Ring[] = [];

    const inkHere = (): Rgb => (ground > 0.5 ? VOID : BONE);

    const classify = (el: Element | null) => {
      target = null;
      let onSand = false;
      if (el) {
        const shore = el.closest("[data-shore]");
        if (shore) {
          const r = shore.getBoundingClientRect();
          onSand = (p.y - r.top) / r.height > SHORE + 0.015;
        }
        if (el.closest('[data-ground="light"]')) onSand = true;
      }
      groundTarget = onSand ? 1 : 0;
      if (!el) mode = "idle";
      else if (el.closest(TYPABLE) && !el.closest(PRESSABLE)) mode = "text";
      else if ((target = el.closest(PRESSABLE))) mode = "press";
      else if (el.closest('[data-cursor="plate"]')) mode = "plate";
      else mode = "idle";
    };

    const burst = () => {
      rings.push({ x: p.x, y: p.y, age: 0, ink: mode === "press" ? RED : inkHere() });
      if (rings.length > 4) rings.shift();
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2 + Math.random() * 0.5;
        const v = 70 + Math.random() * 90;
        motes.push({
          x: p.x,
          y: p.y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          age: 0,
          life: 0.45 + Math.random() * 0.3,
          ch: kana(),
          kana: true,
          ink: k % 3 === 0 ? RED : inkHere(),
          size: 10 + Math.random() * 3,
          seed: Math.random() * 100,
        });
      }
    };

    /* -- drawing -------------------------------------------------------------- */

    // this frame's glyphs, gathered first so the canvas can be fitted round them before
    // anything is drawn; the objects are kept and reused, frame to frame
    const stamps: Stamp[] = [];
    let count = 0;
    let x0 = 0;
    let y0 = 0;
    let x1 = 0;
    let y1 = 0;
    const reach = (x: number, y: number, e: number) => {
      if (x - e < x0) x0 = x - e;
      if (y - e < y0) y0 = y - e;
      if (x + e > x1) x1 = x + e;
      if (y + e > y1) y1 = y + e;
    };
    const stamp = (glyph: string, x: number, y: number, px: number, rot: number, ink: Rgb, a: number) => {
      if (a < 0.004) return;
      const s = stamps[count] ?? (stamps[count] = { ch: "", x: 0, y: 0, size: 0, rot: 0, ink: BONE, a: 0 });
      s.ch = glyph;
      s.x = x;
      s.y = y;
      s.size = px;
      s.rot = rot;
      s.ink = ink;
      s.a = a;
      count++;
      // the sprite's box, turned any way
      reach(x, y, px * 1.1);
    };

    // the pointer a frame from now: its velocity over the last few samples, carried
    // forward by the frame still to be shown, and never further than a short reach
    const lead = (now: number) => {
      while (recent.length > 2 && now - recent[0].t > 48) recent.shift();
      const a = recent[0];
      const b = recent[recent.length - 1];
      if (!a || a === b || now - b.t > 40) return [p.x, p.y];
      const span = Math.max(4, b.t - a.t);
      const ahead = now - b.t + frameGap;
      let lx = ((b.x - a.x) / span) * ahead;
      let ly = ((b.y - a.y) / span) * ahead;
      const d = Math.hypot(lx, ly);
      if (d > 28) {
        lx *= 28 / d;
        ly *= 28 / d;
      }
      return [p.x + lx, p.y + ly];
    };

    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      // the screen's own pace, learned from the gaps between frames
      if (last && now - last < 60) frameGap += (now - last - frameGap) * 0.1;
      last = now;
      if (rescan) {
        rescan = false;
        classify(document.elementFromPoint(p.x, p.y));
      }
      const [hx, hy] = lead(performance.now());

      shown += ((p.in ? 1 : 0) - shown) * (1 - Math.exp(-dt * 10));
      hover += ((mode === "press" ? 1 : 0) - hover) * (1 - Math.exp(-dt * 14));
      plate += ((mode === "plate" ? 1 : 0) - plate) * (1 - Math.exp(-dt * 8));
      typing += ((mode === "text" ? 1 : 0) - typing) * (1 - Math.exp(-dt * 14));
      ground += (groundTarget - ground) * (1 - Math.exp(-dt * 10));

      // the ring leans toward whatever it is over, if that is small enough to aim at
      let tx = hx;
      let ty = hy;
      let R = 15 + plate * 7;
      if (target && mode === "press") {
        const r = target.getBoundingClientRect();
        if (r.width < 320 && r.height < 140) {
          tx += (r.left + r.width / 2 - hx) * 0.28;
          ty += (r.top + r.height / 2 - hy) * 0.28;
        }
        R = 27;
      }
      if (p.down) R *= 0.62;

      // a spring, a little loose, stepped finely so a slow frame can't throw it
      const k = 520;
      const damp = 2 * Math.sqrt(k) * 0.72;
      for (let s = 0, n = Math.ceil(dt / (1 / 240)); s < n; s++) {
        const h = dt / n;
        ring.vx += ((tx - ring.x) * k - ring.vx * damp) * h;
        ring.vy += ((ty - ring.y) * k - ring.vy * damp) * h;
        ring.x += ring.vx * h;
        ring.y += ring.vy * h;
      }
      ring.r += (R - ring.r) * (1 - Math.exp(-dt * 12));
      const speed = Math.hypot(ring.vx, ring.vy);
      ring.spin += dt * (0.5 + hover * 1.9 + Math.min(4, speed / 400));

      count = 0;
      x0 = y0 = Infinity;
      x1 = y1 = -Infinity;

      // kana thrown off by a press
      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.age += dt;
        if (m.age >= m.life) {
          motes.splice(i, 1);
          continue;
        }
        const f = m.age / m.life;
        const curl = Math.sin(m.seed + m.age * 5) * 14;
        m.x += (m.vx + curl * 0.6) * dt;
        m.y += (m.vy + curl * 0.3) * dt;
        m.vx *= Math.exp(-dt * 2.4);
        m.vy *= Math.exp(-dt * 2.4);
        // kana flicker through the syllabary before they settle on one
        if (m.kana && f < 0.45 && Math.random() < 0.5) m.ch = kana();
        const a = Math.pow(1 - f, 1.4) * (m.ink === RED ? 1 : 0.85);
        stamp(m.ch, m.x, m.y, m.size * (1 - f * 0.25), 0, m.ink, a * Math.max(shown, 0.4));
      }

      // barrier rings opening from a press
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.age += dt;
        const life = 0.7;
        if (rg.age >= life) {
          rings.splice(i, 1);
          continue;
        }
        const f = rg.age / life;
        const ease = 1 - Math.pow(1 - f, 3);
        for (const [rad, ink, alpha] of [
          [8 + ease * 64, rg.ink, 1],
          [4 + ease * 46, DIM, 0.6],
        ] as const) {
          const n = 16;
          for (let k = 0; k < n; k++) {
            const a = (k / n) * Math.PI * 2;
            // an octagon, not a circle: the radius bulges to meet its corners
            const oct = Math.cos(Math.PI / 8) / Math.cos(((a % (Math.PI / 4)) - Math.PI / 8));
            stamp("〜", rg.x + Math.cos(a) * rad * oct, rg.y + Math.sin(a) * rad * oct, 12, a + Math.PI / 2, ink, (1 - f) * alpha);
          }
        }
      }

      const vis = shown;
      // the point: a red ■, drawing in over something to press so it doesn't sit on the
      // words, and standing up into a caret over a field
      const s = 5 - hover * 2 - (p.down ? 1 : 0);
      const pw = s + (2 - s) * typing;
      const ph = s + (15 - s) * typing;
      if (vis > 0.01) {
        const base = mix(BONE, VOID, ground);
        const ink = mix(base, RED, hover);
        // the ring: eight waves on an octagon, stretched along the way it is moving; over
        // a field to type in they line up into an I-beam, two serifs and a wavering stem
        const ux = speed > 1 ? ring.vx / speed : 1;
        const uy = speed > 1 ? ring.vy / speed : 0;
        const stretch = 1 + Math.min(0.7, speed / 1400) * (1 - typing);
        const squash = 1 / Math.sqrt(stretch);
        const ringA = (0.68 + 0.32 * hover - 0.18 * plate + 0.2 * typing) * vis;
        for (let k = 0; k < 8; k++) {
          const a = ring.spin + (k / 8) * Math.PI * 2;
          const cx = Math.cos(a) * ring.r;
          const cy = Math.sin(a) * ring.r;
          const along = cx * ux + cy * uy;
          const across = -cx * uy + cy * ux;
          let x = ring.x + ux * along * stretch - uy * across * squash;
          let y = ring.y + uy * along * stretch + ux * across * squash;
          let rot = a + Math.PI / 2;
          if (typing > 0.001) {
            const [bx, by, br] = BEAM[k];
            const t = typing * typing * (3 - 2 * typing);
            x += (hx + bx - x) * t;
            y += (hy + by - y) * t;
            // turn the short way round to the beam's angle
            const turn = ((((br - rot) % TAU) + TAU * 1.5) % TAU) - Math.PI;
            rot += turn * t;
          }
          stamp("〜", x, y, 12 + hover * 3 - typing * 2, rot, ink, ringA);
        }
        reach(hx, hy, Math.max(pw, ph) / 2 + 1);
      }

      // fit the canvas round this frame's glyphs: grow it when they need more room, give the
      // room back once they've stayed small a while, and set its corner on a whole device pixel
      if (count || vis > 0.01) {
        const w = x1 - x0;
        const h = y1 - y0;
        if (w > cw || h > ch) {
          fit(Math.max(cw, Math.ceil((w + 32) / 64) * 64), Math.max(ch, Math.ceil((h + 32) / 64) * 64));
          roomy = 0;
        } else if (cw > REST && w < REST - 16 && h < REST - 16) {
          if (!roomy) roomy = now;
          else if (now - roomy > 1500) {
            fit(REST, REST);
            roomy = 0;
          }
        } else roomy = 0;
        ox = Math.floor(((x0 + x1) / 2 - cw / 2) * dpr) / dpr;
        oy = Math.floor(((y0 + y1) / 2 - ch / 2) * dpr) / dpr;
        canvas.style.transform = `translate3d(${ox}px,${oy}px,0)`;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { D } = sprites;
      for (let i = 0; i < count; i++) {
        const st = stamps[i];
        const k = st.size / FONT;
        const c = Math.cos(st.rot) * k;
        const sn = Math.sin(st.rot) * k;
        ctx.globalAlpha = st.a > 1 ? 1 : st.a;
        ctx.setTransform(c, sn, -sn, c, (st.x - ox) * dpr, (st.y - oy) * dpr);
        ctx.drawImage(sprites.get(st.ch, st.ink), -D / 2, -D / 2);
      }
      if (vis > 0.01) {
        ctx.globalAlpha = vis;
        ctx.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr);
        ctx.fillStyle = "rgb(227,39,29)";
        ctx.fillRect(hx - pw / 2, hy - ph / 2, pw, ph);
      }
      ctx.globalAlpha = 1;

      const settling = Math.abs(ring.x - tx) + Math.abs(ring.y - ty) > 0.3 || speed > 1;
      if (shown > 0.01 || motes.length || rings.length || settling) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        last = 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    /* -- input ---------------------------------------------------------------- */

    const at = (x: number, y: number, t: number) => {
      if (!p.seen) {
        // first sight: the ring starts where the pointer is, not flying in from the middle
        ring.x = x;
        ring.y = y;
        p.seen = true;
      }
      p.x = x;
      p.y = y;
      p.in = true;
      recent.push({ t, x, y });
      if (recent.length > 24) recent.shift();
      kick();
    };
    // raw updates arrive as fast as the hardware reports, ahead of the frame-aligned move
    const raw = "onpointerrawupdate" in window;
    const onRaw = (e: PointerEvent) => {
      if (e.pointerType !== "touch") at(e.clientX, e.clientY, e.timeStamp);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!raw) {
        const all = e.getCoalescedEvents?.() ?? [];
        for (const c of all.length ? all : [e]) at(c.clientX, c.clientY, c.timeStamp);
      }
      classify(e.target as Element | null);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      p.down = true;
      burst();
      kick();
    };
    const onUp = () => {
      p.down = false;
      kick();
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        p.in = false;
        kick();
      }
    };
    const onBlur = () => {
      p.in = false;
      p.down = false;
      kick();
    };
    // scrolling moves the page under a still pointer; what it is over is looked at again on the next frame
    const onScroll = () => {
      if (!p.seen) return;
      rescan = true;
      kick();
    };
    const onResize = () => {
      size();
      kick();
    };

    if (raw) window.addEventListener("pointerrawupdate" as "pointermove", onRaw, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerout", onOut);
    window.addEventListener("blur", onBlur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("cursor");
      window.removeEventListener("pointerrawupdate" as "pointermove", onRaw);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] will-change-transform [contain:strict]"
      ref={ref}
      style={{ width: REST, height: REST }}
    />
  );
}
