"use client";

import { useEffect, useState } from "react";

const EPISODES: [string, string, string][] = [
  ["top", "01", "AWAKENS"],
  ["statement", "02", "STATEMENT"],
  ["barrier", "03", "BARRIER"],
  ["works", "04", "WORKS"],
  ["light", "05", "LIGHT"],
  ["minecraft", "06", "MINECRAFT"],
  ["yomion", "07", "YOMION"],
  ["word", "08", "SEND WORD"],
];

/*
 * The episode index down the right edge: 01 to 08 on a hairline. The band crossing
 * the middle of the viewport is the current episode, marked in red.
 */
export default function EpisodeRail() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      for (const [id] of EPISODES) {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (r && r.top <= mid && r.bottom > mid) {
          setActive(id);
          return;
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav aria-label="Episodes" className="fixed right-4 top-1/2 z-[55] -translate-y-1/2 max-lg:hidden">
      <ol className="m-0 flex list-none flex-col items-end p-0">
        {EPISODES.map(([id, n, en], i) => {
          const on = id === active;
          return (
            <li className="flex flex-col items-end" key={id}>
              {i > 0 ? (
                <span aria-hidden="true" className="mr-[5px] block h-3 w-px bg-line" />
              ) : null}
              <a
                aria-current={on ? "true" : undefined}
                className="group flex items-center gap-2 py-0.5 no-underline"
                href={`#${id}`}
              >
                <span
                  className={`mono bg-void/80 px-1 text-[9px] transition-opacity ${on ? "text-red opacity-100" : "text-dim opacity-0 group-hover:opacity-100"}`}
                >
                  {on ? "〜 " : ""}
                  {en}
                </span>
                <span
                  className={`mono grid h-[18px] w-[16px] place-items-center text-[9px] leading-none tracking-normal transition-colors ${on ? "text-red" : "text-faint group-hover:text-bone"}`}
                >
                  {n}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
