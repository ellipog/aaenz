import Reveal from "@/components/reveal";

const works = [
  {
    glyph: "核",
    name: "kern",
    desc: "A desktop server manager for Windows, macOS and Linux. Register any project as a server instance, extend it with plugins, and command the whole fleet from one clean room.",
    meta: "OPEN SOURCE · TAURI · DESKTOP",
    href: "https://kern.aaenz.no",
    fill: "bg-[url('/assets/gen-cable-descent.jpg')] bg-[size:100%_auto] bg-[position:50%_30%]",
  },
  {
    glyph: "詠",
    name: "galdr",
    desc: "A rune-encrusted GUI around FFmpeg. Raw media in, enchanted media out — convert, compress, transcribe and cut without memorising a single command-line incantation.",
    meta: "OPEN SOURCE · TAURI · DESKTOP",
    href: "https://github.com/aaen-studios/galdr",
    fill: "bg-[url('/assets/gen-clouds-engraving.jpg'),linear-gradient(#999,#999)] bg-[size:220%_auto,100%_100%] bg-[position:24%_42%,0_0] [background-blend-mode:multiply]",
  },
  {
    glyph: "読",
    name: "yomion",
    desc: "A Japanese-learning app — typing trainer, FSRS flashcard engine, kanji path, and an AI conversation partner. Local-first, with cloud sync when you want it.",
    meta: "PRODUCT · WEB · LOCAL-FIRST",
    href: "https://yomion.com",
    fill: "bg-[url('/assets/gen-flock-diagonal.jpg')] bg-[size:100%_auto] bg-[position:50%_46%]",
  },
];

const stationLayout = [
  "md:absolute md:right-full md:top-1/2 md:-mr-[22px] md:w-[min(22vw,320px)] md:-translate-y-1/2 md:text-right",
  "md:absolute md:left-full md:top-1/2 md:-ml-[22px] md:w-[min(22vw,320px)] md:-translate-y-1/2",
  "md:absolute md:left-1/2 md:top-full md:mt-10 md:w-[min(52vw,480px)] md:-translate-x-1/2 md:text-center",
];

const reveal =
  "opacity-0 translate-y-7 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(.22,.61,.36,1)] [&.in]:opacity-100 [&.in]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none";

const parallax =
  "supports-[animation-timeline:view()]:[animation-timeline:view()] supports-[animation-timeline:view()]:motion-reduce:[animation:none]";

export default function Home() {
  return (
    <>
      <Reveal />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -inset-[10%] z-[80] bg-[url('/grain.svg')] bg-[size:240px_240px] mix-blend-multiply opacity-55"
      />

      <header className="fixed inset-x-0 top-0 z-[60] p-[20px_28px] text-paper mix-blend-difference">
        <div className="flex items-baseline justify-between gap-4">
          <a
            className="font-serif text-[28px] leading-none tracking-[.16em] no-underline"
            href="#top"
          >
            aaen
          </a>
          <nav className="mono flex gap-x-5">
            <a className="no-underline transition-opacity hover:opacity-50" href="#works">
              WORKS
            </a>
            <a
              className="no-underline transition-opacity hover:opacity-50"
              href="https://github.com/aaen-studios"
              rel="noreferrer"
              target="_blank"
            >
              GITHUB
            </a>
            <a className="no-underline transition-opacity hover:opacity-50" href="mailto:elliot@aaenz.no">
              CONTACT
            </a>
          </nav>
        </div>
      </header>

      <section
        className="relative grid min-h-screen place-items-center overflow-hidden bg-ink"
        id="top"
      >
        <img
          alt="A figure with wings of light beams"
          className={`absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_contrast(1.12)] supports-[animation-timeline:view()]:animate-hero-drift ${parallax}`}
          src="/assets/gen-winged-beams.jpg"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_42%,transparent_38%,rgba(16,16,16,.5)_100%),linear-gradient(180deg,rgba(16,16,16,.42),rgba(16,16,16,.26)_45%,rgba(16,16,16,.58))]"
        />
        <div className="relative z-[1] px-5 text-center">
          <div className="relative pb-[54px] pt-[58px] max-[760px]:pb-16 max-[760px]:pt-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-[12%] -right-[12%] z-0 animate-fade rounded-[50%] bg-[url('/assets/gen-octagon-ring.jpg')] bg-cover bg-center opacity-80 outline outline-1 outline-paper/20 [-webkit-mask-image:radial-gradient(closest-side,transparent_89.5%,#000_91%_94%,transparent_95%)] [animation-delay:.45s] [filter:grayscale(1)_contrast(1.2)_brightness(.8)] [mask-image:radial-gradient(closest-side,transparent_89.5%,#000_91%_94%,transparent_95%)] motion-reduce:animate-none"
            />
            <p className="jp relative z-[1] mb-2.5 animate-rise text-[20px] tracking-[.6em] text-paper [animation-delay:.2s] motion-reduce:animate-none">
              天使
            </p>
            <img
              alt=""
              className="relative z-[1] mx-auto my-4 block h-auto w-[124px] animate-rise opacity-90 [animation-delay:.26s] max-[760px]:my-[10px] max-[760px]:w-[38px] motion-reduce:animate-none"
              src="/assets/logo-mark-light.png"
            />
            <h1 className="relative z-[1] -mt-28 animate-rise font-serif text-[clamp(96px,22vw,300px)] font-light leading-[.9] tracking-[.06em] text-paper [animation-delay:.32s] motion-reduce:animate-none">
              aaen
            </h1>
            <p className="mono relative z-[1] mt-[20px] animate-rise text-paper [animation-delay:.5s] motion-reduce:animate-none">
              SOFTWARE STUDIO
            </p>
          </div>
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-[66px] left-1/2 z-[1] h-[46px] w-px animate-cue bg-gradient-to-b from-paper/90 to-transparent motion-reduce:animate-none"
        />
        <p className="mono absolute inset-x-0 bottom-5 z-[1] m-0 animate-fade text-center text-paper [animation-delay:1s] motion-reduce:animate-none">
          © MMXXVI AAEN STUDIOS
        </p>
      </section>

      <section
        className={`relative overflow-hidden px-6 pb-[190px] pt-[150px] ${reveal}`}
        data-reveal
        id="statement"
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-[170px] top-[46px] aspect-[2.4] w-[min(560px,52vw)] rounded-full border border-ink bg-[url('/assets/gen-clouds-engraving.jpg')] bg-cover opacity-90 [background-position:50%_38%] [filter:grayscale(1)_contrast(1.08)] supports-[animation-timeline:view()]:animate-para-d ${parallax}`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 h-[170px] w-px bg-[linear-gradient(transparent,var(--color-red))]"
        />
        <div className="relative mx-auto max-w-[1240px]">
          <h2 className="m-0 font-serif text-[clamp(40px,6.6vw,98px)] font-normal leading-[1.05] tracking-[.005em]">
            A software <em className="italic text-red">studio</em>.
            <br />
            Tools that live on{" "}
            <span className="bg-[url('/assets/gen-clouds-engraving.jpg')] bg-cover bg-clip-text text-transparent [background-position:50%_62%] [filter:grayscale(1)_contrast(1.3)]">
              your machine
            </span>
            .
          </h2>
          <span className="mono mt-[34px] block text-faint">
            OPEN SOURCE DESKTOP TOOLS · LOCAL-FIRST SOFTWARE
          </span>
        </div>
      </section>

      <section
        className={`relative -mt-[44px] flex border-y border-line ${reveal}`}
        data-reveal
        id="mirror"
      >
        <img
          alt="A winged figure drawn in ink"
          className={`h-[82vh] w-1/2 object-cover [filter:grayscale(1)_invert(1)_contrast(1.04)] [object-position:100%_50%] max-[760px]:h-[52vh] supports-[animation-timeline:view()]:animate-para-a ${parallax}`}
          src="/assets/gen-winged-right-a.jpg"
        />
        <img
          alt="Its reflection"
          className={`h-[82vh] w-1/2 -scale-x-100 object-cover [filter:grayscale(1)_invert(1)_contrast(1.04)] [object-position:100%_50%] max-[760px]:h-[52vh] supports-[animation-timeline:view()]:animate-para-b ${parallax}`}
          src="/assets/gen-winged-right-a.jpg"
        />
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-red opacity-65" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-full h-[170px] w-px bg-[linear-gradient(var(--color-red),transparent)]"
        />
        <p className="jp absolute right-[26px] top-[26px] m-0 text-[34px] tracking-[.34em] text-paper mix-blend-difference [writing-mode:vertical-rl]">
          天使
        </p>
        <p className="mono absolute bottom-6 left-[26px] m-0 text-paper mix-blend-difference max-[760px]:bottom-auto max-[760px]:left-5 max-[760px]:top-[88px]">
          KERN · GALDR — OPEN SOURCE DESKTOP TOOLS
        </p>
      </section>

      <section
        className={`mx-auto max-w-[1240px] px-6 pb-[110px] pt-[130px] [display:flow-root] ${reveal}`}
        data-reveal
        id="shapes"
      >
        <div className="float-right ml-[52px] mt-[-204px] mb-7 aspect-square w-[min(420px,42vw)] overflow-hidden rounded-full bg-paper2 shadow-[0_0_0_1px_var(--color-red)] [shape-outside:circle(50%)] max-[760px]:ml-[30px] max-[760px]:w-[min(300px,56vw)]">
          <img
            alt="Octagonal rings cropped to a circle"
            className="h-full w-full object-cover [filter:grayscale(1)_contrast(1.12)]"
            src="/assets/gen-octagon-ring.jpg"
          />
        </div>
        <div className="float-left mr-[46px] mt-3.5 mb-[26px] aspect-square w-[min(200px,22vw)] overflow-hidden rounded-full shadow-[0_0_0_1px_var(--color-ink)] [shape-outside:circle(50%)] max-[760px]:mr-7 max-[760px]:w-[min(130px,26vw)]">
          <img
            alt="A black sphere with a thin ring"
            className="h-full w-full object-cover [filter:grayscale(1)_contrast(1.08)]"
            src="/assets/gen-sphere-ring.jpg"
          />
        </div>
        <h3 className="m-0 mb-5 max-w-[20ch] font-serif text-[clamp(32px,4.6vw,58px)] font-normal leading-[1.04]">
          Open source, and offline by default.
        </h3>
        <p className="m-0 mb-4 max-w-[56ch] text-dim">
          kern and galdr are open source — read the code, open issues, fork them. Both are native
          desktop apps for Windows, macOS and Linux.
        </p>
        <p className="m-0 mb-4 max-w-[56ch] text-dim">
          yomion runs in the browser and keeps your progress on your device. Syncing is optional.
        </p>
        <span className="mono mt-[30px] block text-faint">OPEN SOURCE · LOCAL-FIRST</span>
      </section>

      <section
        className={`relative min-h-[56vh] bg-paper px-6 text-center max-[760px]:min-h-[40vh] ${reveal}`}
        data-reveal
        id="knock"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-[2] h-px bg-[linear-gradient(90deg,transparent,rgba(179,18,18,.9)_12%_88%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 block -translate-y-1/2 font-serif text-[clamp(110px,24vw,320px)] font-light leading-none tracking-[.05em] bg-[url('/assets/gen-wings-close.jpg')] bg-cover bg-clip-text text-transparent [background-position:50%_34%] [clip-path:inset(0_0_50%_0)] [filter:invert(1)_grayscale(1)_contrast(1.5)_brightness(1.08)] max-[760px]:[filter:invert(1)_grayscale(1)_contrast(1.35)_brightness(1.5)]"
        >
          AAEN
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 block -translate-y-1/2 font-serif text-[clamp(110px,24vw,320px)] font-light leading-none tracking-[.05em] text-transparent [-webkit-text-stroke:1px_var(--color-ink)] [clip-path:inset(50%_0_0_0)]"
        >
          AAEN
        </span>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(880px,92vw)] -translate-x-1/2 -translate-y-1/2 text-white mix-blend-difference"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 900 300"
        >
          <ellipse cx="450" cy="150" rx="436" ry="132" strokeWidth="1" />
          <ellipse cx="450" cy="150" rx="420" ry="118" strokeWidth="1" opacity=".5" />
        </svg>
        <p className="absolute bottom-[54px] left-1/2 m-0 w-[min(560px,86vw)] -translate-x-1/2 font-light text-dim">
          One studio, three works — designed, built and shipped in-house.
        </p>
        <p className="mono absolute bottom-[18px] right-[26px] m-0 text-faint">
          OPEN SOURCE DESKTOP TOOLS · ONE PRODUCT
        </p>
      </section>

      <figure
        className={`relative m-0 overflow-hidden border-t border-line bg-paper ${reveal}`}
        data-reveal
        id="slats"
      >
        <img
          alt="A beam of light printed through slats"
          className="block h-[78vh] w-full object-cover [-webkit-mask-image:repeating-linear-gradient(90deg,#000_0_26px,transparent_26px_30px,#000_30px_46px,transparent_46px_49px,#000_49px_84px,transparent_84px_88px)] [filter:grayscale(1)_contrast(1.12)] [mask-image:repeating-linear-gradient(90deg,#000_0_26px,transparent_26px_30px,#000_30px_46px,transparent_46px_49px,#000_49px_84px,transparent_84px_88px)] max-[760px]:h-[54vh] supports-[animation-timeline:view()]:animate-para-c ${parallax}"
          src="/assets/gen-beam-city.jpg"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-paper to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 z-[1] -ml-[65px] h-px w-[130px] bg-red"
        />
        <p className="jp absolute left-6 top-6 m-0 text-[46px] text-paper mix-blend-difference [writing-mode:vertical-rl]">
          光
        </p>
      </figure>

      <section
        className={`relative z-[2] overflow-clip bg-ink px-6 pb-[52px] pt-[92px] text-center [overflow-clip-margin:140px] ${reveal}`}
        data-reveal
        id="lens"
      >
        <img
          alt="A pale giant above the clouds"
          className="mx-auto -mb-[90px] block aspect-square w-[min(720px,82vw)] animate-lens rounded-full object-cover shadow-[0_0_0_1px_var(--color-red),0_0_0_6px_rgba(16,16,16,.06)] [filter:grayscale(1)_contrast(1.12)] motion-reduce:animate-none"
          src="/assets/gen-colossus-clouds.jpg"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[56px] aspect-square w-[calc(min(720px,82vw)+72px)] -translate-x-1/2 animate-orbit rounded-full border border-white/10 before:absolute before:-top-[3px] before:left-1/2 before:-ml-[3.5px] before:h-[7px] before:w-[7px] before:rounded-full before:bg-red before:content-[''] motion-reduce:animate-none"
        />
        <p className="mono pointer-events-none absolute left-1/2 top-[calc(92px+min(720px,82vw)/2)] z-[2] m-0 -translate-x-1/2 -translate-y-1/2 -rotate-[13deg] whitespace-nowrap border-y border-white/45 px-[30px] py-[10px] text-[12px] tracking-[.42em] text-paper mix-blend-difference max-[760px]:px-[18px] max-[760px]:py-2 max-[760px]:text-[10px] max-[760px]:tracking-[.28em]">
          KERN — OPEN SOURCE SERVER MANAGER
        </p>
        <p className="mono absolute inset-x-0 top-[30px] z-[1] m-0 text-[#948f84]">
          FEATURED WORK
        </p>
      </section>

      <section
        className={`relative -mt-[150px] overflow-hidden bg-paper px-6 pb-7 pt-[130px] text-center ${reveal}`}
        data-reveal
        id="glyph"
      >
        <span
          aria-hidden="true"
          className={`inline-block bg-[url('/assets/gen-clouds-engraving.jpg')] bg-cover bg-clip-text font-jp text-[clamp(150px,32vw,440px)] leading-[.92] tracking-[.04em] text-transparent [background-position:50%_42%] [filter:grayscale(1)_contrast(1.25)] supports-[animation-timeline:view()]:animate-para-c ${parallax}`}
        >
          使者
        </span>
        <span className="mono mt-[30px] block text-faint">KERN · GALDR · YOMION</span>
      </section>

      <section
        className={`relative overflow-x-clip bg-paper px-6 pb-[120px] pt-[110px] md:pb-[280px] ${reveal}`}
        data-reveal
        id="works"
      >
        <div className="mx-auto max-w-[1240px] text-center">
          <span className="mono block text-faint">THE WORKS</span>
          <h2 className="mx-auto m-0 mt-5 max-w-[14ch] font-serif text-[clamp(36px,5vw,72px)] font-normal leading-[1.06]">
            Three works, <em className="italic text-red">shipped and kept</em>.
          </h2>
        </div>

        <div className="relative mx-auto mt-10 flex aspect-square w-[min(48vw,680px)] flex-col items-center justify-center gap-16 max-md:w-[92vw] md:block">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute inset-0 rounded-full border border-ink/15" />
            <span className="absolute inset-[12px] rounded-full border border-red/25" />
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 max-md:hidden ${parallax} supports-[animation-timeline:view()]:animate-dial`}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const t = (i * 15 * Math.PI) / 180;
              return (
                <span
                  key={i}
                  className={`absolute h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full ${i % 3 === 0 ? "bg-ink/40" : "bg-ink/20"}`}
                  style={{ left: `${50 + 50 * Math.cos(t)}%`, top: `${50 + 50 * Math.sin(t)}%` }}
                />
              );
            })}
            <span className="absolute left-1/2 top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 max-md:hidden">
            <span className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left rotate-0 bg-red/30" />
            <span className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left rotate-90 bg-red/30" />
            <span className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left rotate-180 bg-red/30" />
            {works.map((w, i) => (
              <span
                key={w.name}
                className={`jp absolute -translate-x-1/2 -translate-y-1/2 select-none text-[72px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(16,16,16,.28)] ${["left-[25%] top-1/2", "left-[75%] top-1/2", "left-1/2 top-[75%]"][i]}`}
              >
                {w.glyph}
              </span>
            ))}
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute left-0 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red max-md:hidden" />
            <span className="absolute right-0 top-1/2 h-[7px] w-[7px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red max-md:hidden" />
            <span className="absolute bottom-0 left-1/2 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 rounded-full bg-red max-md:hidden" />
          </div>

          <div className="relative z-[1] grid h-[72px] w-[72px] place-items-center rounded-full bg-ink shadow-[0_0_0_1px_var(--color-red),0_0_0_8px_rgba(16,16,16,.05)] max-md:order-first md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <img alt="" className="w-12" src="/assets/logo-mark-light.png" />
          </div>

          {works.map((w, i) => (
            <a
              key={w.name}
              className={`group relative z-[1] block max-md:max-w-[min(78vw,460px)] max-md:text-center ${stationLayout[i]}`}
              href={w.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="mono block text-faint">0{i + 1}</span>
              <h3
                className={`mt-2 bg-clip-text font-serif text-[clamp(44px,6vw,96px)] font-light leading-[.95] tracking-[.01em] text-transparent [filter:grayscale(1)_contrast(1.6)_brightness(.82)] transition-[filter] duration-500 group-hover:[filter:grayscale(1)_contrast(1.6)_brightness(.82)_invert(1)] supports-[animation-timeline:view()]:animate-fill-drift ${parallax} ${w.fill}`}
              >
                {w.name}
              </h3>
              <p className="mt-3 text-[13px] leading-snug text-dim">{w.desc}</p>
              <span className="mono mt-3 block text-faint">{w.meta} ↗</span>
            </a>
          ))}

          <a
            className="mono max-md:mx-auto max-md:mt-6 max-md:block max-md:text-center md:absolute md:bottom-[7%] md:left-[7%] inline-block text-faint transition-colors hover:text-red"
            href="https://github.com/aaen-studios"
            rel="noreferrer"
            target="_blank"
          >
            GITHUB.COM/AAEN-STUDIOS ↗
          </a>
        </div>
      </section>

      <footer
        className={`relative grid min-h-[82vh] place-items-center overflow-hidden bg-ink text-paper ${reveal}`}
        data-reveal
        id="word"
      >
        <img
          alt=""
          className={`absolute inset-0 h-full w-full object-cover opacity-85 [filter:grayscale(1)_contrast(1.1)] [object-position:50%_20%] max-[760px]:[object-position:50%_50%] supports-[animation-timeline:view()]:animate-para-c ${parallax}`}
          src="/assets/gen-cable-descent.jpg"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,16,.05)_12%,rgba(16,16,16,.62)_40%,rgba(16,16,16,.62)_64%,rgba(16,16,16,.28)_84%)]"
        />
        <span className="jp absolute right-9 top-9 z-[2] grid h-[76px] w-[76px] -rotate-3 place-items-center border border-red text-[27px] tracking-[.1em] text-red max-[760px]:right-[22px] max-[760px]:top-[22px] max-[760px]:h-[60px] max-[760px]:w-[60px] max-[760px]:text-[21px]">
          使者
        </span>
        <div className={`relative z-[1] px-6 py-20 text-center ${reveal}`} data-reveal>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-[2.3] w-[min(560px,84vw)] -translate-x-1/2 -translate-y-[58%] rounded-full border border-white/25"
          />
          <img
            alt=""
            className="mx-auto mb-9 w-16 opacity-95 mix-blend-difference"
            src="/assets/logo-mark-light.png"
          />
          <a
            className="font-serif text-[clamp(56px,10vw,150px)] font-light italic leading-none no-underline hover:text-red hover:underline hover:decoration-1 hover:underline-offset-[.14em]"
            href="mailto:elliot@aaenz.no"
          >
            send word
          </a>
          <span className="mono mt-[30px] block text-[#cfcbc2]">
            ELLIOT@AAENZ.NO
          </span>
        </div>
      </footer>

      <footer className="relative border-t border-white/10 bg-ink px-6 py-8 text-paper">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <span className="mono text-[#8f8b82]">AAEN STUDIOS · © MMXXVI</span>
          <nav className="mono flex flex-wrap gap-x-6 gap-y-2">
            <a className="text-[#cfcbc2] no-underline transition-colors hover:text-red" href="#works">
              WORKS
            </a>
            <a
              className="text-[#cfcbc2] no-underline transition-colors hover:text-red"
              href="https://kern.aaenz.no"
              rel="noreferrer"
              target="_blank"
            >
              KERN
            </a>
            <a
              className="text-[#cfcbc2] no-underline transition-colors hover:text-red"
              href="https://github.com/aaen-studios/galdr"
              rel="noreferrer"
              target="_blank"
            >
              GALDR
            </a>
            <a
              className="text-[#cfcbc2] no-underline transition-colors hover:text-red"
              href="https://yomion.com"
              rel="noreferrer"
              target="_blank"
            >
              YOMION
            </a>
            <a
              className="text-[#cfcbc2] no-underline transition-colors hover:text-red"
              href="https://github.com/aaen-studios"
              rel="noreferrer"
              target="_blank"
            >
              GITHUB
            </a>
            <a
              className="text-[#cfcbc2] no-underline transition-colors hover:text-red"
              href="mailto:elliot@aaenz.no"
            >
              CONTACT
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
