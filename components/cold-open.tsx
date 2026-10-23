"use client";

import { useEffect, useState } from "react";

/*
 * The cold open: before the first plate, a run of title cards in the old
 * broadcast manner — the L-shaped title, then each work's glyph, one per beat —
 * and the hand-over to the hero, which only then decodes.
 *
 * Shown once per session, on the home page, from the top. The decision is made
 * before first paint by the head script in the root layout (`html.go` = skip),
 * so returning readers and deep links never see a black frame. Any key, click,
 * wheel or touch cuts straight to the page.
 */

const SEALS: [string, string, boolean][] = [
  ["核", "KERN", false],
  ["詠", "GALDR", false],
  ["基", "ARMATURE", true],
  ["律", "TENET", false],
  ["読", "YOMION", false],
];

// phase start times, ms: 0 broadcast · 1 title · 2–6 the works · 7 hand-over
const BEATS = [0, 600, 1900, 2220, 2540, 2860, 3180, 3500];
const END = BEATS.length - 1;
const OUT = 520;

export default function ColdOpen() {
  const [phase, setPhase] = useState(0);
  const [gone, setGone] = useState(false);
  // Once running, the overlay owns its own visibility so `html.go` cannot cut the fade.
  const [live, setLive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("go")) {
      setGone(true);
      return;
    }
    root.style.overflow = "hidden";
    setLive(true);
    const timers: number[] = [];
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      try {
        sessionStorage.setItem("aaen-intro", "1");
      } catch {}
      root.classList.add("go");
      root.style.overflow = "";
      window.dispatchEvent(new Event("aaen:go"));
      setPhase(END);
      timers.push(window.setTimeout(() => setGone(true), OUT));
    };

    BEATS.forEach((at, p) => {
      if (p > 0 && p < END) timers.push(window.setTimeout(() => setPhase(p), at));
    });
    timers.push(window.setTimeout(finish, BEATS[END]));

    const skip = () => finish();
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, skip));
      timers.forEach(clearTimeout);
      root.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  const seal = phase >= 2 && phase < END ? SEALS[phase - 2] : null;

  return (
    <div
      aria-hidden="true"
      className={`coldopen fixed inset-0 z-[100] bg-void transition-opacity ease-out ${phase === END ? "pointer-events-none opacity-0" : "opacity-100"}`}
      style={{ transitionDuration: `${OUT}ms`, display: live ? "block" : undefined }}
    >
      {phase === 0 ? (
        <div className="absolute inset-0 grid place-items-center">
          <span className="block h-px w-[min(60vw,640px)] origin-center animate-[grow_.45s_ease-out_both] bg-bone/70" />
          <p className="mono absolute bottom-8 left-7 m-0 text-dim">
            AAEN STUDIOS 〜 ON AIR <span className="animate-blink">■</span>
          </p>
        </div>
      ) : null}

      {phase === 1 ? (
        <div className="absolute inset-[8vh_7vw]">
          <p className="mincho m-0 text-[clamp(72px,15vw,240px)] leading-[.9]">The studio,</p>
          <p className="mincho absolute bottom-0 right-0 m-0 text-[clamp(72px,15vw,240px)] leading-[.9] text-red">
            awakens.
          </p>
        </div>
      ) : null}

      {seal ? (
        <div className="absolute inset-0 grid place-items-center text-center" key={seal[0]}>
          <div>
            <p className={`mincho m-0 text-[min(62vh,56vw)] leading-none ${seal[2] ? "text-red" : "text-bone"}`}>
              {seal[0]}
            </p>
            <p className="mono m-0 mt-2 text-faint">{seal[1]}</p>
          </div>
        </div>
      ) : null}

      {phase < END ? (
        <p className="mono absolute bottom-8 right-7 m-0 text-faint">SKIP ▸▸</p>
      ) : null}
    </div>
  );
}
