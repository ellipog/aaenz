"use client";

import { useEffect, useRef, useState } from "react";

const JP = Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン光翼雲道核詠基律読使者天界");
// Latin text decodes through half-width kana: about a letter's width, so the line holds still.
const HALF = Array.from("ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ");

function scramble(text: string, settled: number, seed: number) {
  return Array.from(text)
    .map((ch, i) => {
      if (i < settled || /[\s、。・,.\-—!?]/.test(ch)) return ch;
      const pool = ch.charCodeAt(0) > 0x2e80 ? JP : HALF;
      return pool[(i * 7 + seed) % pool.length];
    })
    .join("");
}

/*
 * Text that decodes itself when it first comes into view: each character cycles
 * through kana before it settles, left to right. The real string is rendered on
 * the server and kept for assistive tech; only the visible copy is scrambled.
 */
export default function Decode({
  text,
  delay = 0,
  speed = 55,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const length = Array.from(text).length;
    setShown(scramble(text, 0, 0));
    let timer = 0;
    let start = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        start = performance.now() + delay;
        timer = window.setInterval(() => {
          const e = performance.now() - start;
          if (e < 0) return;
          const settled = Math.floor(e / speed);
          setShown(scramble(text, settled, Math.floor(e / 40)));
          if (settled >= length) window.clearInterval(timer);
        }, 40);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [text, delay, speed]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" ref={ref}>
        {shown}
      </span>
    </span>
  );
}
