# Gjøvik Fysioterapi — "Lindrig" Healing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Kraft (athletic/performance-lab) visual direction of the standalone `/demos/gjovik-fysioterapi` demo with "Lindrig" — a calm, spa-like healing aesthetic — across all 5 pages and 10 components, without changing routing, props, or content structure.

**Architecture:** A token-driven repaint plus two targeted rewrites. ~90% of the site repoints automatically by swapping the CSS custom properties (`--physio-*`) on `body[data-physio]` and the heading font variable. The two genuine rewrites are (a) the brand mark + favicon (bolt → leaf) and (b) `MetricsDashboard` (4 telemetry panels → 3 calm recovery arcs). Kraft-only motion primitives (`VelocityField`, `HUDGrid`, `StatusReadout`) are deleted.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, `next/font/google` (Fraunces + Inter), `motion` (framer-motion) for reveals, TypeScript 5. **No test runner exists in this repo** — verification is `npm run build` (type-check + compile), `npm run lint`, and visual review at `localhost:3000/demos/gjovik-fysioterapi?lang=no`. This plan adapts TDD to that reality: each task's test cycle is *lint + build + visual check*, not a unit-test framework.

**Spec:** `docs/superpowers/specs/2026-07-29-gjovik-fysioterapi-lindrig-redesign.md` (commit `8fa2d32`). Read it before starting.

## Global Constraints

Copied verbatim from the spec — every task implicitly includes these:

- **Palette tokens** (defined on `body[data-physio]` in `app/demos/gjovik-fysioterapi/layout.tsx`): `--physio-bg:#F6F1E9`, `--physio-paper:#FBF8F2`, `--physio-mist:#E7E0D5`, `--physio-surface:#FBF8F2`, `--physio-surface-deep:#EFE8DB`, `--physio-sage:#A9BEA0`, `--physio-sage-deep:#6E8468`, `--physio-accent:#6E8468`, `--physio-accent-soft:#A9BEA0`, `--physio-moss:#37443A`, `--physio-clay:#C28762`, `--physio-text:#3B3631`, `--physio-text-soft:#7A7066`, `--physio-rule:#E0D8CB`, `--physio-on-accent:#FBF8F2`, `--physio-glow:rgba(169,190,160,0.35)`.
- **Fonts:** Fraunces (display/headings, `--font-fraunces`, weights 300/400/500/600) + Inter (body/UI, `--font-inter`, 400/500/600). **Remove Archivo and JetBrains_Mono entirely.**
- **Type migration rule:** every `fontFamily:"var(--font-archivo), sans-serif"` → `fontFamily:"var(--font-fraunces), serif"`; every `fontFamily:"var(--font-jetbrains), monospace"` → remove the fontFamily prop (inherit Inter) and add `tabular-nums` to the className for numeric data.
- **Heading style rule:** replace `font-black uppercase tracking-tight` with `font-light`/`font-medium normal-case tracking-[-0.02em]` on display headings (gentle, not shouty).
- **Radius rule:** replace `rounded-[3px]` and `rounded-[4px]` with `rounded-[22px]` on cards/large surfaces, `rounded-[28px]` on hero image & biggest surfaces, `rounded-full` on buttons/tags/pills. Sharp `rounded-[3px]` disappears entirely.
- **Motion rule:** `PhysioReveal` duration `0.55`→`0.8`, travel offset `28`→`16`. No aggressive count-ups, no telemetry pulses, no velocity streaks.
- **Voice:** Norwegian primary, English plain translation. Soften aggressive copy (spec §4).
- **Out of scope:** no new pages/routes/components, no backend, no asset replacement, no changes to other demos or host site, no test-framework setup.
- **Deleted files:** `components/gjovik-fysioterapi/StatusReadout.tsx`, and the `HUDGrid`/`VelocityField` exports from `HudPrimitives.tsx`.

## File Structure

**Modified (10 component files + 5 pages + 1 content + favicon):**
- `app/demos/gjovik-fysioterapi/layout.tsx` — fonts + palette + themeColor (foundation; everything inherits)
- `components/gjovik-fysioterapi/PhysioMark.tsx` — leaf mark + Fraunces lockup
- `public/demos/gjovik-fysioterapi/favicon.svg` — bone ground + sage leaf
- `components/gjovik-fysioterapi/shared.tsx` — `PhysioSection` padding, `SectionEyebrow`, `PageTitle`
- `components/gjovik-fysioterapi/PhysioReveal.tsx` — timing + replace `PhysioMotionPanel`
- `components/gjovik-fysioterapi/HudPrimitives.tsx` — delete `HUDGrid`/`VelocityField`, keep/trim `CountUp`
- `components/gjovik-fysioterapi/PhysioHeader.tsx` — repaint + remove `StatusReadout`
- `components/gjovik-fysioterapi/PhysioFooter.tsx` — repaint, mist surface
- `components/gjovik-fysioterapi/MetricsDashboard.tsx` — **rewrite** to 3 arc cards
- `components/gjovik-fysioterapi/BookingFlow.tsx` — repaint
- `components/gjovik-fysioterapi/ContactForm.tsx` — repaint
- `app/demos/gjovik-fysioterapi/page.tsx` — hero restructure + section repaint
- `app/demos/gjovik-fysioterapi/{behandling,behandlere,kunnskap,kontakt}/page.tsx` — repaint via tokens + Fraunces
- `content/gjovik-fysioterapi.ts` — voice pass (string values only)

**Deleted:**
- `components/gjovik-fysioterapi/StatusReadout.tsx`

No new files. Each modified file keeps its public exports/props identical so call sites don't change.

---

## Task 1: Foundation — fonts, palette, themeColor

**Files:**
- Modify: `app/demos/gjovik-fysioterapi/layout.tsx`

**Interfaces:**
- Produces: `body[data-physio]` with the full Lindrig `--physio-*` token set (§Global Constraints) + `--font-fraunces`/`--font-inter` variables on `<html>`. Every later task consumes these by name; none define colors locally.

- [ ] **Step 1: Replace the three font loaders with Fraunces + Inter**

Open `app/demos/gjovik-fysioterapi/layout.tsx`. Replace the top imports and the three `const` font definitions (lines ~2 and ~21-40) with:

```tsx
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});
```

Delete the `Archivo` and `JetBrains_Mono` blocks entirely.

- [ ] **Step 2: Update metadata + viewport**

Replace `metadata.themeColor` (currently `#0e1116`) — find the `viewport` export and set:

```tsx
export const viewport: Viewport = {
  themeColor: "#F6F1E9",
};
```

Update `metadata.title` to `Gjøvik Fysioterapi — ro i kroppen` and `metadata.description` to `Gjøvik Fysioterapi. Manuell terapi, bevegelse og oppfølging — i et rom bygget for å roe ned.`

- [ ] **Step 3: Repaint the body style block**

In the `<body>` component, update the `html` className to `${fraunces.variable} ${inter.variable}` and replace the entire `style={{ ... }}` object (currently the Kraft dark palette) with the Lindrig tokens. The body element becomes:

```tsx
<html
  lang="no"
  className={`${fraunces.variable} ${inter.variable}`}
>
  <body
    data-physio="lindrig"
    style={
      {
        "--physio-bg": "#F6F1E9",
        "--physio-paper": "#FBF8F2",
        "--physio-mist": "#E7E0D5",
        "--physio-surface": "#FBF8F2",
        "--physio-surface-deep": "#EFE8DB",
        "--physio-sage": "#A9BEA0",
        "--physio-sage-deep": "#6E8468",
        "--physio-accent": "#6E8468",
        "--physio-accent-soft": "#A9BEA0",
        "--physio-moss": "#37443A",
        "--physio-clay": "#C28762",
        "--physio-text": "#3B3631",
        "--physio-text-soft": "#7A7066",
        "--physio-rule": "#E0D8CB",
        "--physio-on-accent": "#FBF8F2",
        "--physio-glow": "rgba(169,190,160,0.35)",
        backgroundColor: "var(--physio-bg)",
        color: "var(--physio-text)",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      } as React.CSSProperties
    }
  >
    {children}
  </body>
</html>
```

- [ ] **Step 4: Update the file's header doc comment**

Replace the doc comment (lines ~3-19) so it no longer says "Kraft / performance lab / dark / electric-lime". New comment:

```tsx
/**
 * Gjøvik Fysioterapi — standalone physiotherapy clinic demo.
 *
 * Built in the "Lindrig" direction: a calm, spa-like healing aesthetic.
 * Warm bone ground, sage/moss greens, Fraunces display + Inter body. Reads
 * as reassurance and stillness — relief, not adrenaline.
 *
 * Lives OUTSIDE the [locale] segment (own header/footer) like the other
 * demos. Language via ?lang=no|en (default no). Palette exposed as CSS
 * variables under [data-physio="lindrig"].
 */
```

- [ ] **Step 5: Verify — lint + build + visual**

Run: `npm run lint`
Expected: no errors (Archivo/JetBrains imports gone, no dangling references).

Run: `npm run build`
Expected: build succeeds. The site is now warm-bone instead of dark — but headings still reference `var(--font-archivo)` which is **undefined** now, so they'll fall back to default sans. That's expected at this step; subsequent tasks fix the heading font references. Body background + text color should be warm.

Visual: `npm run dev`, open `http://localhost:3000/demos/gjovik-fysioterapi?lang=no`. Confirm the page background is now warm bone (`#F6F1E9`) and body text is warm charcoal — **not** dark. Headings may look temporarily wrong (wrong font); that's fine.

- [ ] **Step 6: Commit**

```bash
git add app/demos/gjovik-fysioterapi/layout.tsx
git commit -m "feat(gjovik-fysio): swap to Lindrig palette + Fraunces/Inter fonts"
```

---

## Task 2: Brand mark + favicon — bolt → leaf

**Files:**
- Modify: `components/gjovik-fysioterapi/PhysioMark.tsx`
- Modify: `public/demos/gjovik-fysioterapi/favicon.svg`

**Interfaces:**
- Produces: `PhysioMark({ onDark?, className?, size? })` rendering a sage leaf (same prop signature as today — `onDark` now means "on a deep/moss surface", leaf picks moss-on-bone vs bone-on-moss). `PhysioLockup({ onDark?, showTagline? })` unchanged signature, Fraunces wordmark. Consumed by `PhysioHeader`, `PhysioFooter`, `shared.tsx` (`SectionEyebrow`), `BookingFlow` (success state).

- [ ] **Step 1: Rewrite PhysioMark as a leaf**

Replace the entire contents of `components/gjovik-fysioterapi/PhysioMark.tsx` with:

```tsx
/**
 * The Lindrig mark for Gjøvik Fysioterapi.
 *
 * A rounded leaf — calm, organic, "healing/growth" rather than the old
 * lightning-bolt "power" mark. Reads as a body returning to ease. Picks its
 * colour from the palette tokens so it works on bone or moss surfaces.
 */
export function PhysioMark({
  onDark = false,
  className,
  size = 32,
}: {
  /** Whether the mark sits on a deep/moss surface (inverts leaf colour). */
  onDark?: boolean;
  className?: string;
  size?: number;
}) {
  // On bone: sage-deep leaf. On moss: soft sage leaf.
  const color = onDark ? "var(--physio-sage)" : "var(--physio-sage-deep)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* A teardrop leaf, vein down the middle. */}
      <path
        d="M16 3 C 7 9, 6 20, 16 29 C 26 20, 25 9, 16 3 Z"
        fill={color}
      />
      <path
        d="M16 8 L 16 26"
        stroke={onDark ? "var(--physio-moss)" : "var(--physio-paper)"}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Full lockup: leaf mark + Fraunces wordmark. Used in header and footer.
 */
export function PhysioLockup({
  onDark = false,
  showTagline = true,
}: {
  onDark?: boolean;
  showTagline?: boolean;
}) {
  const textColor = onDark ? "var(--physio-paper)" : "var(--physio-moss)";
  const softColor = onDark ? "var(--physio-paper)" : "var(--physio-text-soft)";
  return (
    <span className="flex items-center gap-2.5">
      <PhysioMark onDark={onDark} size={26} />
      <span className="flex flex-col leading-none">
        <span
          className="font-medium tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            color: textColor,
            fontSize: "1.1rem",
            letterSpacing: "-0.01em",
          }}
        >
          Gjøvik{" "}
          <span style={{ color: "var(--physio-sage-deep)" }}>Fysio</span>
        </span>
        {showTagline && (
          <span
            className="mt-1 text-[9px] uppercase tracking-[0.24em]"
            style={{ color: softColor }}
          >
            ro i kroppen
          </span>
        )}
      </span>
    </span>
  );
}
```

Note: `onDark` previously meant "dark surface → accent color". Now it means "moss surface → light leaf". Call sites pass `onDark` already; the semantics still hold (header over frosted bone = `onDark={false}`).

- [ ] **Step 2: Regenerate the favicon**

Replace the entire contents of `public/demos/gjovik-fysioterapi/favicon.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!--
    Gjøvik Fysioterapi favicon — "Lindrig" healing mark.
    A sage leaf on warm bone. The clinic's standalone identity reads as
    calm/recovery, not the old electric-lime ECG telemetry. Colors are
    hardcoded (favicons can't resolve CSS variables).
  -->
  <rect width="32" height="32" rx="7" fill="#F6F1E9"/>
  <path d="M16 5 C 8 10, 7 20, 16 27 C 25 20, 24 10, 16 5 Z" fill="#6E8468"/>
  <path d="M16 9 L 16 25" stroke="#FBF8F2" stroke-width="1.4" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 3: Verify — lint + build + visual**

Run: `npm run lint && npm run build`
Expected: both pass.

Visual: in the running dev server, the header and footer now show a sage leaf + Fraunces "Gjøvik Fysio" wordmark. Open the favicon URL directly (`http://localhost:3000/demos/gjovik-fysioterapi/favicon.svg`) — should be bone rounded-square + sage leaf.

- [ ] **Step 4: Commit**

```bash
git add components/gjovik-fysioterapi/PhysioMark.tsx public/demos/gjovik-fysioterapi/favicon.svg
git commit -m "feat(gjovik-fysio): replace bolt mark with sage leaf + bone favicon"
```

---

## Task 3: Shared primitives — section, eyebrow, page title

**Files:**
- Modify: `components/gjovik-fysioterapi/shared.tsx`

**Interfaces:**
- Produces: `PhysioSection` (more padding, warm surface), `SectionEyebrow` (Fraunces, sage-deep, leaf prefix — no longer uppercase Archivo), `PageTitle` (Fraunces light), `LocalizedEyebrow`, `physioHref`, `tx` re-export. All consumed by every page.

- [ ] **Step 1: Soften PhysioSection + rewrite SectionEyebrow + PageTitle**

Replace the `PhysioSection`, `SectionEyebrow`, and `PageTitle` functions in `components/gjovik-fysioterapi/shared.tsx` (keep the `LocalizedEyebrow`, `physioHref`, and `tx` re-export as-is). New versions:

```tsx
/** Standard section wrapper — warm surface + generous breathing room. */
export function PhysioSection({
  id,
  surface = false,
  children,
}: {
  id?: string;
  surface?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-b"
      style={{
        backgroundColor: surface ? "var(--physio-paper)" : undefined,
        borderColor: "var(--physio-rule)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        {children}
      </div>
    </section>
  );
}

/** Section eyebrow — a small leaf + Fraunces label. */
export function SectionEyebrow({
  locale,
  no,
  en,
}: {
  locale: Locale;
  no: string;
  en: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <PhysioMark onDark={false} size={14} />
      <span
        className="text-xs font-medium uppercase tracking-[0.22em]"
        style={{
          fontFamily: "var(--font-fraunces), serif",
          color: "var(--physio-sage-deep)",
        }}
      >
        {locale === "no" ? no : en}
      </span>
    </div>
  );
}
```

And `PageTitle`:

```tsx
/** Page title block — leaf eyebrow + Fraunces light display heading. */
export function PageTitle({
  locale,
  eyebrow,
  title,
}: {
  locale: Locale;
  eyebrow: Localized;
  title: Localized;
}) {
  return (
    <div className="mb-12">
      <LocalizedEyebrow locale={locale} value={eyebrow} />
      <h1
        className="mt-5 font-light normal-case tracking-[-0.02em]"
        style={{
          fontFamily: "var(--font-fraunces), serif",
          color: "var(--physio-moss)",
          fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
          lineHeight: 1.02,
        }}
      >
        {tx(title, locale)}
      </h1>
    </div>
  );
}
```

Keep the existing import line `import { PhysioMark } from "./PhysioMark";` at the top (already present).

- [ ] **Step 2: Verify — lint + build + visual**

Run: `npm run lint && npm run build`
Expected: pass.

Visual: open a sub-page, e.g. `http://localhost:3000/demos/gjovik-fysioterapi/behandling?lang=no`. The page title should now render in Fraunces light, moss color, with a leaf eyebrow. (Body sections may still show old Archivo headings inside — those are fixed when their pages are updated.)

- [ ] **Step 3: Commit**

```bash
git add components/gjovik-fysioterapi/shared.tsx
git commit -m "feat(gjovik-fysio): soften shared section/eyebrow/page-title to Lindrig"
```

---

## Task 4: Motion primitives — reveal timing, replace motion panel, delete HUD

**Files:**
- Modify: `components/gjovik-fysioterapi/PhysioReveal.tsx`
- Modify: `components/gjovik-fysioterapi/HudPrimitives.tsx`

**Interfaces:**
- Produces: `PhysioReveal` (slower/gentler), `PhysioEnergyBar` (kept, sage), `PhysioMotionPanel` (now a calm rounded photo with optional play button — same prop `{ caption? }`). From `HudPrimitives`: `CountUp` kept (used by softened dashboard if retained). **`HUDGrid` and `VelocityField` are deleted** — so any import of them elsewhere will break until Task 6 (MetricsDashboard) and Task 7 (homepage) remove those imports.

> **Ordering note:** this task deletes exports that `MetricsDashboard.tsx` and `page.tsx` currently import. After Step 2, `npm run build` will FAIL with "HUDGrid/VelocityField not exported" until Tasks 6 and 7 land. That's intentional and expected — commit anyway, then proceed; the build goes green again after Task 7. If you want a green build at every commit, reorder to do Task 6 + 7's import-removal first, but the tasks are written assuming sequential execution.

- [ ] **Step 1: Soften PhysioReveal + replace PhysioMotionPanel**

In `components/gjovik-fysioterapi/PhysioReveal.tsx`, change two values in `PhysioReveal`: the `offset` const from `28` to `16`, and the transition `duration` from `0.55` to `0.8`. The body of `PhysioReveal` becomes (only the two numbers change; structure unchanged):

```tsx
  const offset = 16;
  const travel = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    none: {},
  }[from];
  // ...
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...travel }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
```

Then replace the entire `PhysioMotionPanel` function (the one with velocity streaks + pulsing bolt) with a calm media panel. Keep the same export name and `{ caption? }` prop:

```tsx
/**
 * A calm media panel — a rounded photo treatment with an optional soft play
 * affordance. Replaces the old velocity-streak "video" panel. Used where a
 * real photo/video would go; no moving streaks, no pulsing bolt.
 */
export function PhysioMotionPanel({
  caption,
}: {
  caption?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px]"
      style={{ backgroundColor: "var(--physio-mist)" }}
    >
      {/* soft sage radial wash instead of streaks */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 90% at 30% 30%, rgba(169,190,160,0.45), transparent 60%), linear-gradient(160deg, var(--physio-sage) 0%, var(--physio-mist) 100%)",
        }}
      />
      {/* central soft play affordance */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(251,248,242,0.9)",
            color: "var(--physio-moss)",
          }}
          animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
          transition={
            reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor" aria-hidden>
            <path d="M2 2 L16 10 L2 18 Z" />
          </svg>
        </motion.div>
        {caption && (
          <p
            className="mt-4 text-xs tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              color: "var(--physio-moss)",
            }}
          >
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
```

Leave `PhysioEnergyBar` in place but repoint its colour — it already uses `var(--physio-accent)` which is now sage, so no change needed (it'll render sage automatically).

- [ ] **Step 2: Delete HUDGrid + VelocityField from HudPrimitives**

Open `components/gjovik-fysioterapi/HudPrimitives.tsx`. **Delete the `HUDGrid` function and the `VelocityField` function entirely.** Keep `CountUp` (still imported by nothing yet, but Task 6 may use it). Update the file's header comment to drop "HUD / instrumented" language. The file should now export only `CountUp`.

After this, run `npm run build` — it will **fail** because `MetricsDashboard.tsx` imports `HUDGrid` and `page.tsx` imports `VelocityField` + `HUDGrid`. This is expected (see ordering note). Do not fix those here.

- [ ] **Step 3: Verify — lint only (build expected to fail)**

Run: `npm run lint`
Expected: lint passes (no unused-import errors yet because the importing files still reference them).

Run: `npm run build`
Expected: FAIL with errors like `HUDGrid is not exported from "./HudPrimitives"` and `VelocityField is not exported`. **This is expected** — Tasks 6 and 7 remove those imports.

- [ ] **Step 4: Commit**

```bash
git add components/gjovik-fysioterapi/PhysioReveal.tsx components/gjovik-fysioterapi/HudPrimitives.tsx
git commit -m "feat(gjovik-fysio): gentle reveal timing, calm motion panel, drop HUD primitives

Build will fail until MetricsDashboard + homepage drop HUDGrid/VelocityField
imports in following tasks."
```

---

## Task 5: Header + Footer chrome

**Files:**
- Modify: `components/gjovik-fysioterapi/PhysioHeader.tsx`
- Modify: `components/gjovik-fysioterapi/PhysioFooter.tsx`
- Delete: `components/gjovik-fysioterapi/StatusReadout.tsx`

**Interfaces:**
- Produces: `PhysioHeader({ locale })` without `StatusReadout` (frosted bone nav, Fraunces links, moss pill CTA). `PhysioFooter({ locale })` on mist surface, Inter tabular-nums (no mono). `StatusReadout.tsx` deleted — ensure no remaining import anywhere.

- [ ] **Step 1: Remove StatusReadout from header + repaint nav**

In `components/gjovik-fysioterapi/PhysioHeader.tsx`:

(a) Delete the import line `import { StatusReadout } from "./StatusReadout";`

(b) Delete the `<StatusReadout onlineLabel={...} />` usage inside the header's right-side `<div className="flex items-center gap-3">`.

(c) Repaint the header container: the `backgroundColor` on scroll becomes frosted bone. Change the header `style` to:

```tsx
      style={{
        backgroundColor: scrolled ? "rgba(246,241,233,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--physio-rule)"
          : "1px solid transparent",
      }}
```

(d) Nav links: change `fontFamily` to `var(--font-fraunces), serif`, remove `uppercase`, set `tracking-[0.08em]`, `text-sm`, active color `var(--physio-sage-deep)`, inactive `var(--physio-text-soft)`. The link className becomes:

```tsx
                className="text-sm font-medium tracking-[0.08em] transition-colors"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: active
                    ? "var(--physio-sage-deep)"
                    : "var(--physio-text-soft)",
                }}
```

(e) The booking CTA link: change `rounded-[3px]` → `rounded-full`, `uppercase tracking-[0.1em]` → `tracking-[0.02em]`, `text-xs` → `text-sm`, backgroundColor `var(--physio-moss)`, color `var(--physio-on-accent)`, add `font-medium`:

```tsx
            className="hidden rounded-full px-5 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 sm:inline-flex"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              backgroundColor: "var(--physio-moss)",
              color: "var(--physio-on-accent)",
            }}
```

(f) Lang switch button: `rounded-full` instead of `rounded-[3px]`, Fraunces, `text-xs`. Mobile menu links: same Fraunces/`rounded-full`/sage-deep active treatment; the mobile booking CTA `rounded-full` + moss.

(g) The `<PhysioLockup onDark />` call: the header sits over bone (not dark), so change to `<PhysioLockup onDark={false} />`.

- [ ] **Step 2: Repaint footer**

In `components/gjovik-fysioterapi/PhysioFooter.tsx`:

(a) The footer `backgroundColor` is already `var(--physio-surface-deep)` which is now `#EFE8DB` (mist) — correct, no change to the style object needed.

(b) Change `<PhysioLockup onDark showTagline={false} />` → `<PhysioLockup onDark={false} showTagline={false} />` (footer is mist, not dark).

(c) Every `font-mono` className on hours/colophon/bottom-strip: remove `font-mono` and add `tabular-nums`. Specifically the hours `<span>` (`className="font-mono tabular-nums"` → `className="tabular-nums"`), the colophon `est.` line (`font-mono text-[10px] uppercase tracking-[0.14em]` → `text-[10px] tracking-[0.14em]`), and the bottom-strip copyright/back link (same `font-mono` removal). Keep `tabular-nums` on the hours time values for alignment.

(d) Heading `font-bold uppercase tracking-[0.14em]` + Archivo fontFamily on the four `<h4>` column headers → `font-medium tracking-[0.14em]` + Fraunces. Remove `uppercase`.

- [ ] **Step 3: Delete StatusReadout.tsx**

```bash
git rm components/gjovik-fysioterapi/StatusReadout.tsx
```

Then grep to confirm no other file imports it:

```bash
grep -rn "StatusReadout" components/ app/ || echo "no remaining references"
```
Expected output: `no remaining references`.

- [ ] **Step 4: Verify — lint + build (build still fails on HUD imports from Tasks 6/7, that's fine)**

Run: `npm run lint`
Expected: pass (no unused StatusReadout import).

Visual: dev server header shows leaf lockup + Fraunces nav + moss pill "Bestill time"; no telemetry dot/clock. Footer is mist with Fraunces headers.

- [ ] **Step 5: Commit**

```bash
git add components/gjovik-fysioterapi/PhysioHeader.tsx components/gjovik-fysioterapi/PhysioFooter.tsx
git commit -m "feat(gjovik-fysio): repaint header/footer to Lindrig, drop StatusReadout"
```

---

## Task 6: Rewrite MetricsDashboard — 4 telemetry panels → 3 calm recovery arcs

**Files:**
- Modify: `components/gjovik-fysioterapi/MetricsDashboard.tsx`
- Modify: `content/gjovik-fysioterapi.ts` (the `dashboard` export — data shape only)

**Interfaces:**
- Produces: `MetricsDashboard({ locale })` rendering 3 sage arc cards (92% fewer pain days, 1–2 days to appointment, 85% follow-through) + optionally the interactive assessment as a calm 4th card. Same call site `<MetricsDashboard locale={locale} />` in `page.tsx`. **Removes the `HUDGrid` import** (fixes part of the Task 4 build break).
- Consumes: a new `dashboard.arcs` array from content (replaces the granular `recovery`/`ops`/`outcomes` fields used only by this component).

**Decision (spec §2.5 default):** arcs + assessment. If the assessment card crowds the layout, drop it — but default to including it.

- [ ] **Step 1: Add the arcs data to content**

In `content/gjovik-fysioterapi.ts`, find the `export const dashboard = {` block (around line 758). Add a new `arcs` array alongside the existing fields (keep existing fields for now — other code doesn't use them, but removing is a separate cleanup; leaving them is harmless). Add:

```ts
  /** The three calm recovery arcs (replaces the old telemetry panels). */
  arcs: [
    {
      pct: 92,
      headline: { no: "Færre smertedager", en: "Fewer pain days" },
      body: {
        no: "etter åtte uker med oppfølging, rapportert av pasientene våre.",
        en: "after eight weeks of follow-up, reported by our patients.",
      },
    },
    {
      // Non-numeric headline shown inside the ring instead of a %.
      pct: 0,
      ringText: "1–2",
      headline: { no: "Dager til time", en: "Days to appointment" },
      body: {
        no: "vi holder ventetiden kort, slik at du slipper å leve med smerten.",
        en: "we keep wait times short, so you don't live with the pain.",
      },
    },
    {
      pct: 85,
      headline: { no: "Følger opp hele veien", en: "Followed all the way" },
      body: {
        no: "av pasientene fullfører programmet — ingen står alene i rehaben.",
        en: "of patients finish the programme — no one rehabs alone.",
      },
    },
  ] as const,
```

- [ ] **Step 2: Rewrite MetricsDashboard.tsx**

Replace the **entire contents** of `components/gjovik-fysioterapi/MetricsDashboard.tsx` with:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/content/gjovik-fysioterapi";
import { tx, dashboard } from "@/content/gjovik-fysioterapi";

/**
 * Gjøvik Fysioterapi — the calm recovery dashboard (Lindrig).
 *
 * Three quiet arc cards: how recovery feels in numbers, without the old
 * telemetry aesthetic. Each card is a sage conic-gradient ring with a short
 * caption. The interactive self-assessment stays as a gentle 4th card.
 * Respects prefers-reduced-motion (static fallback).
 */
export function MetricsDashboard({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {dashboard.arcs.map((arc, i) => {
        const ringText = arc.pct > 0 ? `${arc.pct}%` : (arc.ringText ?? "");
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 rounded-[22px] border p-7"
            style={{
              borderColor: "var(--physio-rule)",
              backgroundColor: "var(--physio-paper)",
            }}
          >
            <Arc pct={arc.pct} text={ringText} reduce={reduce} />
            <div>
              <h3
                className="font-medium"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-text)",
                  fontSize: "1.1rem",
                }}
              >
                {tx(arc.headline, locale)}
              </h3>
              <p
                className="mt-1.5 text-sm leading-relaxed"
                style={{ color: "var(--physio-text-soft)" }}
              >
                {tx(arc.body, locale)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/** A sage conic-gradient arc ring with text in the centre. */
function Arc({
  pct,
  text,
  reduce,
}: {
  pct: number;
  text: string;
  reduce: boolean | null;
}) {
  // For the "1–2" non-numeric card, render a full ring (no proportional fill).
  const fill = pct > 0 ? pct : 100;
  return (
    <div
      className="relative h-20 w-20"
      style={{
        borderRadius: "9999px",
        background: `conic-gradient(var(--physio-sage) ${fill}%, var(--physio-mist) ${fill}%)`,
        WebkitMask: "radial-gradient(circle, transparent 58%, #000 59%)",
        mask: "radial-gradient(circle, transparent 58%, #000 59%)",
      }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span
          className="font-medium"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            color: "var(--physio-moss)",
            fontSize: "1.05rem",
          }}
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
}
```

This **removes the `import { HUDGrid } from "./HudPrimitives"`** line (the new file doesn't import it) — fixing that part of the Task 4 build break. The interactive assessment is dropped here for a clean 3-arc layout; the spec's "include assessment" default is a judgement call — given 3 columns, adding a 4th would break the grid. Document this choice in the commit message.

- [ ] **Step 3: Verify — lint + build**

Run: `npm run lint && npm run build`
Expected: build still fails, but **only** on `page.tsx` importing `VelocityField`/`HUDGrid` (Task 7) — no longer on MetricsDashboard. Confirm the error list no longer mentions MetricsDashboard or HUDGrid-from-dashboard.

- [ ] **Step 4: Commit**

```bash
git add components/gjovik-fysioterapi/MetricsDashboard.tsx content/gjovik-fysioterapi.ts
git commit -m "feat(gjovik-fysio): rewrite dashboard as 3 calm recovery arc cards

Drops the ops telemetry panel and HUDGrid backdrop. Assessment card omitted
to keep the 3-column grid clean; revisit if the section feels thin."
```

---

## Task 7: Homepage — hero restructure + section repaint

**Files:**
- Modify: `app/demos/gjovik-fysioterapi/page.tsx`

**Interfaces:**
- Consumes: all Lindrig tokens + the rewritten components from Tasks 1-6. **Removes the `VelocityField`/`HUDGrid` imports** (fixes the last build break) and the `CountUp` import.

- [ ] **Step 1: Fix imports**

In `app/demos/gjovik-fysioterapi/page.tsx`, change the import from HudPrimitives. The line:

```tsx
import { VelocityField, CountUp, HUDGrid } from "@/components/gjovik-fysioterapi/HudPrimitives";
```

**Delete it entirely** (none of these are used after the hero restructure below).

- [ ] **Step 2: Rewrite the hero section**

Replace the entire first `<section id="top" ...>` (the hero — currently lines ~65-212 with VelocityField, HUDGrid, the dark gradient overlays, and the count-up stats) with the calm hero:

```tsx
      <section id="top" className="relative overflow-hidden">
        {/* Soft sage + clay radial glows instead of HUD grid / velocity streaks */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute"
            style={{
              width: "620px",
              height: "620px",
              top: "-180px",
              right: "-160px",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(169,190,160,0.38), transparent 62%)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: "420px",
              height: "420px",
              bottom: "-160px",
              left: "-120px",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(194,135,98,0.20), transparent 62%)",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-36 sm:px-8 md:grid-cols-[1.15fr_0.85fr]">
          {/* Copy */}
          <div>
            <PhysioReveal from="up">
              <p
                className="mb-5 text-xs font-medium uppercase tracking-[0.22em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-sage-deep)",
                }}
              >
                {tx(hero.eyebrow, locale)}
              </p>
            </PhysioReveal>

            <PhysioReveal delay={0.1}>
              <h1
                className="font-light leading-[1.02] tracking-[-0.025em]"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: "var(--physio-moss)",
                  fontSize: "clamp(2.6rem, 6vw, 4.6rem)",
                }}
              >
                {isNo ? "Ro i kroppen." : "Calm in the body."}
                <br />
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--physio-sage-deep)",
                  }}
                >
                  {isNo ? "Veien hjem til bevegelse." : "The way home to movement."}
                </em>
              </h1>
            </PhysioReveal>

            <PhysioReveal delay={0.2}>
              <p
                className="mt-7 max-w-xl text-lg leading-relaxed"
                style={{ color: "var(--physio-text-soft)" }}
              >
                {tx(hero.subtitle, locale)}
              </p>
            </PhysioReveal>

            <PhysioReveal delay={0.3}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    backgroundColor: "var(--physio-moss)",
                    color: "var(--physio-on-accent)",
                  }}
                >
                  {tx(hero.primaryCta, locale)} →
                </a>
                <a
                  href="#dashboard"
                  className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    borderColor: "var(--physio-rule)",
                    color: "var(--physio-text)",
                  }}
                >
                  {tx(hero.secondaryCta, locale)}
                </a>
              </div>
            </PhysioReveal>
          </div>

          {/* Photo panel */}
          <PhysioReveal delay={0.2}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
              <Image
                src={hero.photo}
                alt={tx(story.title, locale)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
              <div
                className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm"
                style={{ backgroundColor: "rgba(251,248,242,0.92)" }}
              >
                <span
                  className="block h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--physio-sage-deep)" }}
                />
                {isNo ? "Ledig time i morgen, kl. 10:30" : "Open slot tomorrow, 10:30"}
              </div>
            </div>
          </PhysioReveal>
        </div>
      </section>
```

This removes the entire live-stats count-up overlay block (the `<div className="mt-12 inline-flex flex-wrap gap-6 ...">` with `CountUp`) and the scroll cue `<div className="absolute bottom-6 ...">`.

- [ ] **Step 3: Repaint the remaining inline section headings + treatments + pricing + CTA**

The hero, dashboard, and booking sections mostly inherit tokens now. The remaining inline `style={{ fontFamily: "var(--font-archivo)..." }}` + `font-black uppercase` headings throughout the file need the standard migration. For **each** `<h2>` (and the `<h3>` treatment titles) in this file, apply the Global Constraints heading rule:

- `fontFamily: "var(--font-archivo), sans-serif"` → `fontFamily: "var(--font-fraunces), serif"`
- className: replace `font-black uppercase leading-[...] tracking-[-0.02em]` with `font-light leading-[1.02] tracking-[-0.02em]`
- add `style color: "var(--physio-moss)"` (if not already inheriting) — most headings should be moss.

Specific headings to update (by their nearby text so you can locate them): the dashboard `<h2>` ({tx(dashboard.title...)}), booking `<h2>` ("Tre minutter, ferdig"), behandling `<h2>` ("Hva vi gjør"), staff `<h2>` ("De som fikser deg"), video `<h2>` ("En runde i styrkerommet"), pricing `<h2>` ("Tydelig pris"), story `<h2>`, knowledge `<h2>` ("Lær av oss"), contact `<h2>`.

Also: the treatment cards `rounded-[4px]` → `rounded-[22px]`; the flagship badge `rounded-full` (already), color `var(--physio-clay)` instead of accent (warm pop). The "Bestill denne" link color stays `var(--physio-sage-deep)` (accent is now sage anyway). The pricing card `rounded-[4px]` → `rounded-[22px]`. The contact CTA circle behind `<PhysioMark>` → `backgroundColor: "var(--physio-moss)"`, `rounded-full` (already), and `<PhysioMark onDark={false} />` (it's on moss now, so leaf should be sage — actually use `onDark` so the leaf inverts; set `onDark`).

Because these are many small inline edits, do them with targeted Edits per heading; do **not** rewrite the whole file (too much surface for error).

- [ ] **Step 4: Verify — lint + build (should now be GREEN)**

Run: `npm run lint && npm run build`
Expected: **BUILD PASSES** — all HUD/Velocity imports are gone, all headings reference `--font-fraunces` (defined in Task 1). This is the first green build since Task 4.

Visual: `npm run dev`, open `http://localhost:3000/demos/gjovik-fysioterapi?lang=no`. Scroll the whole page: warm hero with glows + photo, 3 calm arc cards, soft booking, treatment cards, pricing, story, knowledge, moss CTA band at the contact section. Confirm **nothing** is dark, nothing has velocity streaks, no mono text, no telemetry dot.

- [ ] **Step 5: Commit**

```bash
git add app/demos/gjovik-fysioterapi/page.tsx
git commit -m "feat(gjovik-fysio): rebuild homepage hero + repaint sections to Lindrig

First green build: removes all VelocityField/HUDGrid usage, Fraunces headings."
```

---

## Task 8: Booking + Contact forms

**Files:**
- Modify: `components/gjovik-fysioterapi/BookingFlow.tsx`
- Modify: `components/gjovik-fysioterapi/ContactForm.tsx`

**Interfaces:**
- Produces: same component APIs (`BookingFlow({ locale, treatments, days })`, `ContactForm({ locale })`), fully Lindrig-styled. No prop or logic changes — all step state, fake payment, Vipps handling stays identical.

- [ ] **Step 1: Repaint BookingFlow**

In `components/gjovik-fysioterapi/BookingFlow.tsx`, apply the migration rules globally. The component is large; do targeted edits:

(a) Outer container `rounded-[6px] border p-6` → `rounded-[22px] border p-7`, `backgroundColor: var(--physio-paper)`.

(b) Step indicator circles: keep `rounded-full`; active/`i <= currentIdx` background `var(--physio-moss)` (was accent — now sage anyway, but moss is the intended button colour), text `var(--physio-on-accent)`. The connector line active colour → `var(--physio-sage)`.

(c) All `fontFamily: "var(--font-archivo), sans-serif"` on `<h3>`/buttons → `var(--font-fraunces), serif`. All `uppercase tracking-[0.1em]`/`tracking-[0.12em]` on buttons → drop `uppercase`, `tracking-[0.02em]`, `text-sm font-medium`.

(d) Treatment pick buttons `rounded-[4px] border p-4` → `rounded-[22px] border p-5`, hover `hover:-translate-y-0.5` (keep). The flagship `★` badge background → `var(--physio-clay)`.

(e) Slot buttons `rounded-[3px] border px-3 py-1.5 font-mono text-sm` → `rounded-full border px-4 py-2 text-sm tabular-nums` (drop `font-mono`). Selected background → `var(--physio-moss)`, text `var(--physio-on-accent)`.

(f) Field inputs: `rounded-[3px]` → `rounded-[14px]`, focus border `var(--physio-sage-deep)`. The `Field` subcomponent label: drop `font-mono`/`font-archivo` → Fraunces, drop `uppercase`.

(g) Pay button: keep Vipps orange (`#ff5b2e`) for the Vipps-selected state (brand requirement), moss (`var(--physio-moss)`) for card. `rounded-[3px]` → `rounded-full`.

(h) Summary aside + success card: `rounded-[4px]` → `rounded-[22px]`. The success `<PhysioMark onDark={false}>` circle background → `var(--physio-moss)`, and pass `onDark` to PhysioMark so the leaf renders light. Summary price `font-mono` → `tabular-nums`. The booking-ref display `font-mono` → `tabular-nums`.

(i) `Row` subcomponent and all `font-mono` in the file → replace with `tabular-nums` (Inter inherits). Grep to find them: `grep -n "font-mono" components/gjovik-fysioterapi/BookingFlow.tsx`.

- [ ] **Step 2: Repaint ContactForm**

In `components/gjovik-fysioterapi/ContactForm.tsx`, apply the same rules:

(a) Outer `rounded-[6px]` → `rounded-[22px]`, `backgroundColor: var(--physio-paper)`.

(b) Success circle → `backgroundColor: var(--physio-moss)`, leaf via `onDark`.

(c) All `font-mono` → remove (Inter inherits); `font-archivo` → Fraunces; `uppercase` on labels/buttons → drop; `rounded-[3px]` inputs → `rounded-[14px]`; submit button `rounded-[3px]` → `rounded-full`, background `var(--physio-moss)`.

(d) Input focus border → `var(--physio-sage-deep)`.

- [ ] **Step 3: Verify — lint + build + visual**

Run: `npm run lint && npm run build`
Expected: pass.

Visual: homepage `#booking` section — walk the full booking flow (pick treatment → pick slot → pay form → confirm). Confirm soft rounded cards, moss pills, Fraunces labels, Inter tabular numbers, Vipps stays orange. Then `/kontakt?lang=no` — contact form is soft paper card, moss submit pill.

- [ ] **Step 4: Commit**

```bash
git add components/gjovik-fysioterapi/BookingFlow.tsx components/gjovik-fysioterapi/ContactForm.tsx
git commit -m "feat(gjovik-fysio): repaint booking + contact forms to Lindrig"
```

---

## Task 9: The four sub-pages

**Files:**
- Modify: `app/demos/gjovik-fysioterapi/behandling/page.tsx`
- Modify: `app/demos/gjovik-fysioterapi/behandlere/page.tsx`
- Modify: `app/demos/gjovik-fysioterapi/kunnskap/page.tsx`
- Modify: `app/demos/gjovik-fysioterapi/kontakt/page.tsx`

**Interfaces:**
- Consumes: all Lindrig tokens + Task 3's `PageTitle`/`SectionEyebrow` (already Fraunces) + Task 4's calm `PhysioMotionPanel`. These pages are mostly token-inherited now; the remaining inline `font-archivo`/`font-black uppercase`/`rounded-[4px]`/`font-mono` references get migrated.

- [ ] **Step 1: behandling page**

In `app/demos/gjovik-fysioterapi/behandling/page.tsx`, apply heading + radius migration to every inline heading and card:
- Treatment catalog cards `rounded-[4px] border p-6` → `rounded-[22px] border p-7`.
- Approach step cards `rounded-[4px] border p-6` → `rounded-[22px] border p-7`; the step number `font-mono text-2xl` → `text-2xl tabular-nums` + Fraunces, colour `var(--physio-sage-deep)`.
- Injury area cards `rounded-[4px] border p-6` → `rounded-[22px] border p-7`.
- Pricing recap block `rounded-[4px]` → `rounded-[22px]`; row prices `font-mono` → `tabular-nums`.
- All `<h2>`/`<h3>`: `font-archivo` → Fraunces, `font-black uppercase` → `font-light`/`font-medium normal-case`, colour moss/sage-deep. The flagship `★` badge → `var(--physio-clay)`.

- [ ] **Step 2: behandlere page**

In `app/demos/gjovik-fysioterapi/behandlere/page.tsx`:
- Bio photo `rounded-[6px]` → `rounded-[28px]`.
- The role label `font-mono text-xs uppercase` → Fraunces `text-xs`, drop `uppercase`, colour `var(--physio-sage-deep)`.
- Name `<h3>` `font-black uppercase` → Fraunces `font-medium normal-case`, moss.
- Specialty line `font-medium uppercase tracking-[0.1em]` → drop `uppercase`.
- Blockquote left border → `var(--physio-sage)` (accent is sage anyway).
- Credentials `▸` marker colour stays accent (sage); the `font-mono` on it → drop.
- Story recap `<h2>` heading migration; the three story stats `font-black` → Fraunces `font-medium`, colour `var(--physio-moss)` (first) / `var(--physio-text)` (others), and the stat label `font-bold uppercase` → drop `uppercase`, Fraunces.
- Story photo `rounded-[6px]` → `rounded-[28px]`.

- [ ] **Step 3: kunnskap page**

In `app/demos/gjovik-fysioterapi/kunnskap/page.tsx`:
- Article cards `rounded-[4px]` → `rounded-[22px]`, hover border `var(--physio-sage-deep)`.
- Category + read-time labels `font-mono` → drop, Fraunces `text-[11px]`, category colour `var(--physio-sage-deep)`.
- Title `<h3>` `font-bold` → Fraunces `font-medium`, colour `var(--physio-text)`.
- "Les →" link colour stays sage-deep.
- The `<PhysioMotionPanel>` (calm version from Task 4) — no change needed, just confirm it renders as a soft panel not streaks.
- FAQ `<h2>` heading migration. FAQ `<details>` `rounded-[4px]` → `rounded-[22px]`; the `+` toggle `font-mono text-xl` → Fraunces `text-xl`, colour `var(--physio-sage-deep)`; the summary `font-semibold` → Fraunces.

- [ ] **Step 4: kontakt page**

In `app/demos/gjovik-fysioterapi/kontakt/page.tsx`:
- The map iframe `filter: "invert(0.92) hue-rotate(180deg)"` was for dark mode — **remove the filter** (light map on light site). Keep the iframe.
- Hours card `rounded-[4px]` → `rounded-[22px]`; hours time `font-mono tabular-nums` → `tabular-nums`.
- Map wrapper `rounded-[4px]` → `rounded-[22px]`.
- All label `font-bold uppercase tracking-[0.14em]` + `font-archivo` → Fraunces, drop `uppercase`.
- The "← Bestill time" link colour stays sage-deep.
- The contact detail `<h3>` "Ring eller kom innom" heading migration (Fraunces, moss, `font-medium normal-case`).

- [ ] **Step 5: Verify — lint + build + visual (all pages)**

Run: `npm run lint && npm run build`
Expected: pass.

Visual: visit all four:
- `http://localhost:3000/demos/gjovik-fysioterapi/behandling?lang=no`
- `http://localhost:3000/demos/gjovik-fysioterapi/behandlere?lang=no`
- `http://localhost:3000/demos/gjovik-fysioterapi/kunnskap?lang=no`
- `http://localhost:3000/demos/gjovik-fysioterapi/kontakt?lang=no`

Confirm: warm palette throughout, Fraunces headings, no dark surfaces, no mono text, no velocity streaks, soft rounded cards, light map (not inverted). Check `?lang=en` on at least the homepage to confirm English renders.

- [ ] **Step 6: Commit**

```bash
git add app/demos/gjovik-fysioterapi/behandling/page.tsx app/demos/gjovik-fysioterapi/behandlere/page.tsx app/demos/gjovik-fysioterapi/kunnskap/page.tsx app/demos/gjovik-fysioterapi/kontakt/page.tsx
git commit -m "feat(gjovik-fysio): repaint all four sub-pages to Lindrig (light map, Fraunces)"
```

---

## Task 10: Voice pass — soften the copy

**Files:**
- Modify: `content/gjovik-fysioterapi.ts`

**Interfaces:**
- Produces: edited `Localized` string values only (no type/shape changes). Pages consume these via `tx()` — no page edits needed.

- [ ] **Step 1: Update clinic tagline + hero strings**

In `content/gjovik-fysioterapi.ts`, find the `clinic` export and change `tagline`:

```ts
  tagline: {
    no: "Ro i kroppen.",
    en: "Calm in the body.",
  } as Localized,
```

Find the `hero` export and change `cutWord` and `subtitle`:

```ts
  cutWord: {
    no: "ro",
    en: "calm",
  } as Localized,
  subtitle: {
    no: "Manuell terapi, bevegelse og tett oppfølging — i et rom bygget for å roe ned. Vi hjelper deg hele veien, fra den første vondte morgenen til du er tilbake i deg selv.",
    en: "Manual therapy, movement, and close follow-up — in a room built to calm. We're with you the whole way, from the first sore morning until you're back in yourself.",
  } as Localized,
```

(The hero headline itself is inlined in `page.tsx` and was already updated in Task 7.)

- [ ] **Step 2: Soften dashboard intro + treatment/staff copy**

In the `dashboard` export, soften `intro` from any "performance" language to recovery language. Find `dashboard.intro` and set:

```ts
  intro: {
    no: "Helbredelse er ikke et tall — men her er likevel noen vi er stolte av.",
    en: "Healing isn't a number — but here are a few we're proud of nonetheless.",
  } as Localized,
```

Review `treatments[].punch` lines: soften any that read aggressively. For each treatment with a punch like a hard "fix"-style line, reword toward relief/recovery (keep it short). Specific edits depend on current values — read them first (`grep -n "punch:" content/gjovik-fysioterapi.ts`) and soften in place; keep the array length and structure identical.

- [ ] **Step 3: Soften the staff section heading + story/contact intros**

In `app/demos/gjovik-fysioterapi/page.tsx`, the staff `<h2>` is inlined as `{isNo ? "De som fikser deg" : "Who'll fix you"}`. Change to `{isNo ? "De som følger deg" : "Who'll guide you"}`.

In `content/gjovik-fysioterapi.ts`, lightly warm `story.body`, `contact.intro`, and the booking section copy only where it sounds clinical — these are judgement edits; do not rewrite wholesale. If a string already reads warm, leave it.

- [ ] **Step 4: Verify — lint + build + visual**

Run: `npm run lint && npm run build`
Expected: pass (string-only changes).

Visual: `?lang=no` — confirm new tagline, hero subtitle, dashboard intro render. No layout shift from text length changes (the layouts are flexible).

- [ ] **Step 5: Commit**

```bash
git add content/gjovik-fysioterapi.ts app/demos/gjovik-fysioterapi/page.tsx
git commit -m "feat(gjovik-fysio): soften voice from athletic to healing/recovery"
```

---

## Task 11: Final QA pass

**Files:** None modified — verification only (fix any stragglers inline).

- [ ] **Step 1: Grep for any remaining Kraft references**

```bash
cd "C:/Users/Ellio/Documents/GitHub/aaenz"
echo "=== Archivo refs (should be NONE) ==="
grep -rn "font-archivo\|var(--font-archivo)" components/gjovik-fysioterapi/ app/demos/gjovik-fysioterapi/ || echo "none"
echo "=== JetBrains/mono fontFamily refs (should be NONE) ==="
grep -rn "font-jetbrains" components/gjovik-fysioterapi/ app/demos/gjovik-fysioterapi/ || echo "none"
echo "=== VelocityField/HUDGrid/StatusReadout refs (should be NONE) ==="
grep -rn "VelocityField\|HUDGrid\|StatusReadout" components/gjovik-fysioterapi/ app/demos/gjovik-fysioterapi/ || echo "none"
echo "=== font-black uppercase headings (spot-check; some may be intentional) ==="
grep -rn "font-black uppercase" components/gjovik-fysioterapi/ app/demos/gjovik-fysioterapi/ || echo "none"
echo "=== rounded-[3px] or rounded-[4px] (should be NONE) ==="
grep -rn "rounded-\[3px\]\|rounded-\[4px\]" components/gjovik-fysioterapi/ app/demos/gjovik-fysioterapi/ || echo "none"
```

Expected: every block prints `none` (the `font-black uppercase` one ideally none too). If any match, fix them per the Global Constraints rules and re-commit.

- [ ] **Step 2: Full build + lint**

Run: `npm run lint && npm run build`
Expected: clean pass, no warnings about unused vars or missing fonts.

- [ ] **Step 3: Visual sweep — both locales, both viewports, reduced motion**

Open `http://localhost:3000/demos/gjovik-fysioterapi?lang=no` and walk every section + all 4 sub-pages. Repeat key pages with `?lang=en`. Check:
- Mobile width (DevTools ~390px): nav collapses to hamburger, hero stacks, grids collapse, no horizontal overflow.
- Desktop: grids are 3-col where expected, hero is 2-col.
- `prefers-reduced-motion` (DevTools → Rendering → emulate): reveals render immediately, no animation, arcs show final state.
- Favicon in the browser tab is the bone+sage leaf.
- Theme color (mobile browser chrome) is warm bone.

Fix any stragglers inline; commit.

- [ ] **Step 4: Final commit (if any fixes) + summary**

If Step 1-3 needed fixes:
```bash
git add -A
git commit -m "fix(gjovik-fysio): final Lindrig QA cleanup"
```

Confirm the full diff is the Lindrig redesign: `git diff master~11 --stat` (or against the pre-redesign commit `87630cc`). The site at `/demos/gjovik-fysioterapi` is now calm/healing across all locales and pages.

---

## Self-Review (run after writing — results)

**1. Spec coverage:** Every spec section maps to a task.
- §2.1 palette → Task 1. §2.2 fonts/type rule → Task 1 + applied per-task. §2.3 shape/spacing/motion → Tasks 3 (spacing), 4 (motion). §2.4 removed motifs → Tasks 4, 5, 7. §2.5 dashboard → Task 6. §3.1-3.12 components → Tasks 1-9 (each component named). §4 voice → Task 10. §5 pages → Tasks 7, 9. §6 out-of-scope respected (no new files/routes/backend). §8 open questions: Q1 decided in Task 6 (3 arcs, assessment dropped — documented), Q2/Q3 have defaults in Tasks 2/7. ✅ No gaps.

**2. Placeholder scan:** No "TBD/TODO/implement later". Every step has concrete code or exact edits. The two "review and soften" steps (Task 10 Step 2/3) are bounded judgement edits with explicit "read first, keep structure identical" instructions — acceptable for copy work where exact source strings aren't reproduced. ✅

**3. Type consistency:** `PhysioMark({ onDark, className, size })`, `PhysioLockup({ onDark, showTagline })`, `MetricsDashboard({ locale })`, `BookingFlow({ locale, treatments, days })`, `ContactForm({ locale })`, `PhysioSection({ id, surface, children })`, `SectionEyebrow({ locale, no, en })`, `PageTitle({ locale, eyebrow, title })` — signatures unchanged from current code, so call sites compile. The new `dashboard.arcs` array (Task 6 Step 1) matches the shape consumed in Task 6 Step 2 (`arc.pct`, `arc.ringText`, `arc.headline`, `arc.body` as `Localized`). ✅

**4. Build-break ordering:** Tasks 4-6 deliberately break then restore the build (documented in Task 4). Task 7 restores green. Verified the chain is coherent. ✅
