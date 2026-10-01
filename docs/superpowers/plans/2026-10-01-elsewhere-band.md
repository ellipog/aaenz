# Elsewhere Band Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "elsewhere" band to the aaen studios homepage acknowledging the ellipog/Stellar gaming persona, with a live Modrinth + CurseForge download counter.

**Architecture:** One static paper section in `app/page.tsx` (between `#works` and the `#word` footer), a `/api/downloads` route handler (60s in-memory cache, Modrinth public API + optional CurseForge key), and one small client component that polls it. Spec: `docs/superpowers/specs/2026-10-01-elsewhere-band-design.md`.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4. No test framework in the repo — verification is `npm run build`, `curl` against the route/page, and a rendered screenshot via `playwright-core` with system Chrome (already a devDependency).

**Note on commits:** the repo owner commits; this plan intentionally has no commit steps.

## Global Constraints

- Palette/type tokens only (from `app/globals.css`): paper `#f3f1ec`, ink `#101010`, dim `#55534d`, faint `#8b8880`, red `#b31212`; fonts Cormorant Garamond (`font-serif`), Inter (body), JetBrains Mono (`mono` utility).
- Red budget for the band: seam thread (1px gradient) + one 7px satellite dot + the one italic red word in the headline. Nothing else red.
- Counter shows BOTH platforms, fetched at runtime; renders as bare `N DOWNLOADS`; nothing rendered while loading or on failure; no attribution or fetch commentary anywhere.
- Copy is verbatim from the spec; lowercase studio voice; no exclamation marks; no geography.
- No new plates, no new fonts, no metadata changes, no header-nav changes.
- Reuse motion only: `reveal`, `fill-drift`, `para-c` (all reduced-motion safe via existing utilities).

---

### Task 1: `/api/downloads` route handler

**Files:**
- Create: `app/api/downloads/route.ts`

**Interfaces:**
- Produces: `GET /api/downloads` → `{ downloads: number | null }` JSON. `null` only when both sources fail. Later tasks rely on the exact shape `{ downloads: number | null }`.

- [ ] **Step 1: Write the route handler**

Create `app/api/downloads/route.ts` with exactly:

```ts
export const dynamic = "force-dynamic";

const MODRINTH_USER = "Ellipog";
const CURSEFORGE_GAME_ID = 432;
// CurseForge-side slugs. A slug that misses (renamed, Modrinth-only) contributes 0;
// an auth or network failure degrades the whole CF side to nothing — never the count itself.
const CURSEFORGE_SLUGS = [
  "create-stellar",
  "mythic-origins",
  "fairytale-origins",
  "create-origins-compat",
  "mystical-garden-cloches",
  "godling-origin",
  "galacticborn-origin",
  "deviling-origin",
  "extra-origins-smp",
  "christmas-dimension-rp",
  "christmas-dimension",
];
const CACHE_TTL_MS = 60_000;

type Counts = { downloads: number | null };

let cache: { at: number; counts: Counts } | null = null;

async function modrinthDownloads(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.modrinth.com/v2/user/${MODRINTH_USER}/projects`, {
      headers: { "User-Agent": "aaenz.no (elliot@aaenz.no)" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const projects = (await res.json()) as { downloads?: number }[];
    return projects.reduce((sum, p) => sum + (p.downloads ?? 0), 0);
  } catch {
    return null;
  }
}

async function curseforgeDownloads(): Promise<number | null> {
  const key = process.env.CURSEFORGE_API_KEY;
  if (!key) return null;
  try {
    let total = 0;
    for (const slug of CURSEFORGE_SLUGS) {
      const res = await fetch(
        `https://api.curseforge.com/v1/mods/search?gameId=${CURSEFORGE_GAME_ID}&slug=${slug}`,
        { headers: { "x-api-key": key, Accept: "application/json" }, cache: "no-store" },
      );
      if (!res.ok) return null;
      const body = (await res.json()) as {
        data?: { slug: string; downloadCount?: number; authors?: { name?: string }[] }[];
      };
      for (const mod of body.data ?? []) {
        if (mod.slug !== slug) continue;
        if (!mod.authors?.some((a) => (a.name ?? "").toLowerCase() === "ellipog")) continue;
        total += mod.downloadCount ?? 0;
      }
    }
    return total;
  } catch {
    return null;
  }
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return Response.json(cache.counts);
  }
  const [modrinth, curseforge] = await Promise.all([
    modrinthDownloads(),
    curseforgeDownloads(),
  ]);
  const counts: Counts =
    modrinth === null && curseforge === null
      ? { downloads: null }
      : { downloads: (modrinth ?? 0) + (curseforge ?? 0) };
  cache = { at: Date.now(), counts };
  return Response.json(counts);
}
```

- [ ] **Step 2: Verify it compiles and answers**

Run: `npm run build` (expected: success) — then during the dev-server task, `curl http://localhost:3000/api/downloads` (expected: `{"downloads":29xxxx}` — Modrinth-only, ~290–300K, because no `CURSEFORGE_API_KEY` is set locally).

### Task 2: Downloads client component

**Files:**
- Create: `components/downloads.tsx`

**Interfaces:**
- Consumes: `GET /api/downloads` → `{ downloads: number | null }`.
- Produces: default export `Downloads` — renders `<span class="mono text-faint">N DOWNLOADS</span>` or `null`.

- [ ] **Step 1: Write the component**

Create `components/downloads.tsx` with exactly:

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Downloads() {
  const [downloads, setDownloads] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/downloads");
        if (!res.ok) return;
        const data = (await res.json()) as { downloads?: number | null };
        if (alive && typeof data.downloads === "number") {
          setDownloads(data.downloads);
        }
      } catch {
        // silent by design — the line simply stays absent
      }
    }

    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (downloads === null) return null;

  return <span className="mono text-faint">{downloads.toLocaleString("en-US")} DOWNLOADS</span>;
}
```

### Task 3: The elsewhere band + close-bar link

**Files:**
- Modify: `app/page.tsx` (add import; insert section between the `#works` section and the `<footer id="word">`; add ELLIPOG link to the close-bar footer nav)

**Interfaces:**
- Consumes: `Downloads` from Task 2; existing `reveal`/`parallax` string constants in `page.tsx`; `data-reveal` observed by `components/reveal.tsx` (no wiring needed).
- Produces: `<section id="elsewhere">`; close-bar nav gains `ELLIPOG` → `https://ellipog.dev`.

- [ ] **Step 1: Add the import**

At the top of `app/page.tsx`, after the existing `Reveal` import:

```tsx
import Downloads from "@/components/downloads";
```

- [ ] **Step 2: Insert the band**

Immediately after the closing `</section>` of the `#works` section and before `<footer ... id="word">`, insert exactly:

```tsx
      <section
        className={`relative bg-paper px-6 pb-[120px] pt-[110px] text-center ${reveal}`}
        data-reveal
        id="elsewhere"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[170px] left-1/2 h-[170px] w-px bg-[linear-gradient(transparent,var(--color-red))]"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[6px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-red"
        />
        <span className="mono block text-faint">ELSEWHERE</span>
        <h2 className="mx-auto m-0 mt-5 max-w-[16ch] font-serif text-[clamp(36px,5vw,72px)] font-normal leading-[1.06]">
          One studio, <em className="italic text-red">two names</em>.
        </h2>
        <p className="mx-auto m-0 mt-6 max-w-[56ch] text-dim">
          Under the name ellipog, the same hands build Minecraft mods — a questing engine in
          development, and a shelf of released origins and one modpack.
        </p>
        <a
          className="group relative z-[1] mt-10 inline-block"
          href="https://ellipog.dev"
          rel="noreferrer"
          target="_blank"
        >
          <span
            className={`block bg-clip-text bg-[url('/assets/gen-sphere-ring.jpg')] bg-cover bg-[position:50%_42%] font-serif text-[clamp(64px,12vw,160px)] font-light leading-none tracking-[.01em] text-transparent [filter:grayscale(1)_contrast(1.6)_brightness(.82)] transition-[filter] duration-500 group-hover:[filter:grayscale(1)_contrast(1.6)_brightness(.82)_invert(1)] supports-[animation-timeline:view()]:animate-fill-drift ${parallax}`}
          >
            ellipog
          </span>
        </a>
        <div className="mt-6 flex min-h-[17px] items-center justify-center">
          <Downloads />
        </div>
        <p className="mono mt-6 text-faint">
          <a
            className="transition-colors hover:text-red"
            href="https://modrinth.com/user/Ellipog"
            rel="noreferrer"
            target="_blank"
          >
            MODRINTH ↗
          </a>{" "}
          ·{" "}
          <a
            className="transition-colors hover:text-red"
            href="https://www.curseforge.com/members/ellipog/projects"
            rel="noreferrer"
            target="_blank"
          >
            CURSEFORGE ↗
          </a>{" "}
          ·{" "}
          <a
            className="transition-colors hover:text-red"
            href="https://discord.gg/uy9QFaQWR7"
            rel="noreferrer"
            target="_blank"
          >
            DISCORD — STELLAR ↗
          </a>
        </p>
      </section>
```

- [ ] **Step 3: Add the close-bar link**

In the bottom close-bar footer nav, between the YOMION and GITHUB anchors, insert exactly:

```tsx
            <a
              className="text-[#cfcbc2] no-underline transition-colors hover:text-red"
              href="https://ellipog.dev"
              rel="noreferrer"
              target="_blank"
            >
              ELLIPOG
            </a>
```

### Task 4: STYLE.md documentation

**Files:**
- Modify: `STYLE.md` (the run list; plate inventory)

- [ ] **Step 1: Update "The run, top to close"**

Insert a new item 10 between the works item (9) and the word item; renumber the old 10→11 and 11→12:

```markdown
10. **elsewhere** — paper; the red satellite comes down the thread from the works dial; "One studio, *two names*."; ellipog image-filled with the orb-and-ring; live download count; MODRINTH · CURSEFORGE · DISCORD micro-links.
11. **word** — cable-descent darkness; "send word" and ELLIOT@AAENZ.NO; the red seal 使者.
12. **close** — the bar: AAEN STUDIOS · © MMXXVI + nav.
```

- [ ] **Step 2: Update the plate inventory**

In the plate table, change the `gen-sphere-ring.jpg` row's "used for" cell from `shapes circle` to:

```markdown
| `gen-sphere-ring.jpg` | black orb, one thin ring | shapes circle · ellipog name fill (elsewhere) |
```

### Task 5: Verify and serve

- [ ] **Step 1: Production build passes**

Run: `npm run build`
Expected: success, `/` prerendered statically, `/api/downloads` listed as dynamic.

- [ ] **Step 2: Serve and curl**

Run (background): `npm run dev`
Then: `curl -s http://localhost:3000/api/downloads` → `{"downloads":29xxxx}` (Modrinth-only without the key).
Then: `curl -s http://localhost:3000/ | grep -c "elsewhere"` → `1` (band present).

- [ ] **Step 3: Screenshot the band**

Using `playwright-core` with system Chrome (`channel: "chrome"`), load `http://localhost:3000/#elsewhere`, wait for the counter line, and save a full-page screenshot; confirm the band renders: label, headline with the red italic word, dark star-filled `ellipog`, the number, the links row, and the seam thread + satellite dot.
