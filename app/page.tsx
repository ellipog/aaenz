"use client";

import { useCallback, useMemo, useState } from "react";
import localFont from "next/font/local";

import { motion } from "framer-motion";
import ScrambleText from "@/app/components/ScrambleText";

const nostrutaru = localFont({
  src: "../public/fonts/Nosutaru-dotMPlusH-10-Regular.ttf",
  display: "swap",
});

type Phase = "intro" | "scrambling" | "reveal";

type PortalLink = {
  label: string;
  href: string;
  description?: string;
  icon: "globe" | "code" | "pen" | "photo" | "music" | "mail" | "bolt" | "server" | "rune";
};

function LinkIcon({ kind }: { kind: PortalLink["icon"] }) {
  const common = "h-3.5 w-3.5 shrink-0 opacity-70";
  switch (kind) {
    case "globe":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21c4.971 0 9-4.029 9-9s-4.029-9-9-9-9 4.029-9 9 4.029 9 9 9Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M3 12h18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 3c2.8 2.6 4.5 5.9 4.5 9S14.8 18.4 12 21c-2.8-2.6-4.5-5.9-4.5-9S9.2 5.6 12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "code":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 18 3 12l6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pen":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 20h9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "photo":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 10.5h.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="m21 16-5.5-5.5L6 20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "music":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M19 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M11 16V6l10-2v10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "mail":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="m5 8 7 6 7-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bolt":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "server":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 8h2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 12h2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 16h2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="15" cy="8" r="1.5" fill="currentColor" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          <circle cx="15" cy="16" r="1.5" fill="currentColor" />
        </svg>
      );
    case "rune":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3v18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 3v18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 12c-1.1 0-2-1.1-2-2s.9-2 2-2 2 1.1 2 2-.9 2-2 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 12c1.1 0 2 1.1 2 2s-.9 2-2 2-2-1.1-2-2 .9-2 2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 21h8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [query, setQuery] = useState("");

  const engchars = useMemo(
    () => [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ],
    [],
  );
  const jpchars = useMemo(
    () => [
      "あ",
      "い",
      "う",
      "え",
      "お",
      "か",
      "き",
      "く",
      "け",
      "こ",
      "さ",
      "し",
      "す",
      "せ",
      "そ",
      "た",
      "ち",
      "つ",
      "て",
      "と",
      "な",
      "に",
      "ぬ",
      "ね",
      "の",
      "は",
      "ひ",
      "ふ",
      "へ",
      "ほ",
      "ま",
      "み",
      "む",
      "め",
      "も",
      "や",
      "ゆ",
      "よ",
      "ら",
      "り",
      "る",
      "れ",
      "ろ",
      "わ",
      "を",
      "ん",
      "ア",
      "イ",
      "ウ",
      "エ",
      "オ",
      "カ",
      "キ",
      "ク",
      "ケ",
      "コ",
      "サ",
      "シ",
      "ス",
      "セ",
      "ソ",
      "タ",
      "チ",
      "ツ",
      "テ",
      "ト",
      "ナ",
      "ニ",
      "ヌ",
      "ネ",
      "ノ",
      "ハ",
      "ヒ",
      "フ",
      "ヘ",
      "ホ",
      "マ",
      "ミ",
      "ム",
      "メ",
      "モ",
      "ヤ",
      "ユ",
      "ヨ",
      "ラ",
      "リ",
      "ル",
      "レ",
      "ロ",
      "ワ",
      "ヲ",
      "ン",
    ],
    [],
  );

  const handleDone = useCallback(() => {
    setPhase("reveal");
  }, []);

  const groups = useMemo(() => {
    return [
      {
        title: "sites",
        items: [
          {
            label: "portfolio",
            href: "https://portfolio.aaenz.no",
            description: "ポートフォリオ",
            icon: "globe",
          },
          {
            label: "runen",
            href: "https://runen.no",
            description: "ルネン",
            icon: "bolt",
          },
          {
            label: "kana",
            href: "https://kana.aaenz.no",
            description: "かな練習",
            icon: "pen",
          },
          {
            label: "galdr",
            href: "https://galdr.aaenz.no",
            description: "呪文歌",
            icon: "rune",
          },
          {
            label: "kern",
            href: "https://kern.aaenz.no",
            description: "カーネル",
            icon: "server",
          },
        ] satisfies PortalLink[],
      },
      {
        title: "github repos",
        items: [
          {
            label: "ccgpt",
            href: "https://github.com/Ellipog/ccGPT",
            description: "シシジーピーティー",
            icon: "bolt",
          },
          {
            label: "wordle",
            href: "https://github.com/Ellipog/wordle",
            description: "ワールドル",
            icon: "globe",
          },
          {
            label: "galdr",
            href: "https://github.com/aaen-studios/galdr",
            description: "呪文歌",
            icon: "rune",
          },
          {
            label: "kern",
            href: "https://github.com/aaen-studios/kern",
            description: "カーネル",
            icon: "server",
          },
        ] satisfies PortalLink[],
      },
      {
        title: "socials",
        items: [
          {
            label: "github",
            href: "https://github.com/Ellipog",
            description: "ギットハブ",
            icon: "code",
          },
          {
            label: "insta",
            href: "https://www.instagram.com/ellipog/",
            description: "インスタ",
            icon: "photo",
          },
          {
            label: "linkedin",
            href: "https://www.linkedin.com/in/elliot-strand-aaen/",
            description: "リンクトイン",
            icon: "mail",
          },
        ] satisfies PortalLink[],
      },
    ] as const;
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => {
          const hay =
            `${it.label} ${it.description ?? ""} ${it.href}`.toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  return (
    <div
      className={`relative min-h-screen bg-black overflow-hidden ${nostrutaru.className}`}
    >
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "intro" ? 1 : 0 }}
        transition={{ duration: 2.5 }}
        onAnimationComplete={() => {
          if (phase === "intro") setPhase("scrambling");
        }}
      />
      <div className="relative min-h-screen flex flex-col">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 items-center justify-center"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: 1,
            y: phase === "reveal" ? "calc(-50vh + 5rem)" : 0,
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrambleText
            text="aaenz"
            chars={engchars}
            timeOffset={130}
            autoPlay={phase !== "intro"}
            onDone={handleDone}
            className="text-4xl text-white"
          />
          <ScrambleText
            text="オエンズ"
            chars={jpchars}
            timeOffset={180}
            className="text-2xl text-[#646464]"
          />
        </motion.div>
        <motion.div
          className="w-screen h-screen pb-12 flex flex-col items-center justify-center gap-4"
          transition={{ duration: 0.8, delay: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "reveal" ? 1 : 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-full max-w-3xl px-6">
            <div className="flex items-center justify-between gap-6">
              <div className="text-sm text-white/60 tracking-wide">
                portal / directory
              </div>
              <label className="flex items-center gap-2 text-sm text-white/60">
                <span className="sr-only">Filter links</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  inputMode="search"
                  placeholder="search…"
                  className="w-44 sm:w-56 bg-transparent text-white/80 placeholder:text-white/30 outline-none"
                />
              </label>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10">
              {filteredGroups.map((group) => (
                <section key={group.title} aria-label={group.title}>
                  <div className="text-xs text-white/45 tracking-[0.22em] uppercase">
                    {group.title}
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="group inline-flex items-baseline gap-2 text-white/80 hover:text-white transition-colors"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="translate-y-px">
                            <LinkIcon kind={item.icon} />
                          </span>
                          <span className="text-base leading-none">
                            {item.label}
                          </span>
                          {item.description ? (
                            <ScrambleText
                              text={item.description}
                              chars={jpchars}
                              timeOffset={200}
                              autoPlay={phase === "reveal"}
                              className="text-sm text-white/35 group-hover:text-white/45 transition-colors"
                            />
                          ) : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {filteredGroups.length === 0 ? (
              <div className="mt-10 text-sm text-white/45">no matches</div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
