# Gjøvik Fysioterapi — "Lindrig" Healing Redesign

**Date:** 2026-07-29
**Scope:** Visual & content redesign of the standalone `/demos/gjovik-fysioterapi` demo site. Replaces the current "Kraft" (concept 03) athletic/performance-lab direction with a calm, spa-like "healing" aesthetic.
**Status:** Design — approved direction, pending spec review.

---

## 1. Why

The current Gjøvik Fysioterapi demo is built in the **Kraft** direction: dark `#0e1116` ground, electric-lime accent, condensed black Archivo display, a HUD grid, velocity streaks, telemetry count-ups, and copy like *"We fix the injury, not the excuse."* It reads as a **performance lab / training center**, not a healing clinic.

The client wants it to read as **calm, spa-like, healing** — reassurance and stillness over performance. The approved mockup explored the "Lindrig" (Relief) direction: warm bone ground, sage/moss greens, a gentle serif, generous whitespace, and slow breathing motion. This spec defines the full in-place rebuild.

The information architecture, bilingual `no`/`en` content, routing (`?lang=`), and component boundaries are **unchanged** — only the visual language, motion, and voice change. This keeps it a focused redesign rather than a rewrite.

---

## 2. Design direction — "Lindrig"

One sentence: *a warm, calm spa that happens to be a credible physiotherapy clinic — relief, not adrenaline.*

### 2.1 Palette (replaces all Kraft `--physio-*` vars)

Defined as CSS custom properties on `body[data-physio]` (same hook the Kraft layout already uses, so this is a drop-in swap). Values from the approved mockup:

| Token | Value | Role |
|---|---|---|
| `--physio-bg` | `#F6F1E9` | ground — warm bone off-white |
| `--physio-paper` | `#FBF8F2` | raised surface (cards, forms, sections) |
| `--physio-mist` | `#E7E0D5` | soft neutral band / alt surface |
| `--physio-surface` | `#FBF8F2` | alias of paper, kept for back-compat with existing component code |
| `--physio-surface-deep` | `#EFE8DB` | footer / deep band |
| `--physio-sage` | `#A9BEA0` | primary soft accent |
| `--physio-sage-deep` | `#6E8468` | deeper sage for text/contrast accents |
| `--physio-accent` | `#6E8468` | **repointed** from lime to sage-deep — every existing `var(--physio-accent)` reference now renders sage |
| `--physio-accent-soft` | `#A9BEA0` | soft sage |
| `--physio-moss` | `#37443A` | deep warm green for dark blocks (CTA band, footer) + dark display text |
| `--physio-clay` | `#C28762` | warm secondary pop, used sparingly (flagship tag, one photo tint) |
| `--physio-text` | `#3B3631` | warm charcoal body text (replaces near-white) |
| `--physio-text-soft` | `#7A7066` | muted body / secondary text (replaces cool grey) |
| `--physio-rule` | `#E0D8CB` | hairline borders (replaces the faint white-on-dark rule) |
| `--physio-on-accent` | `#FBF8F2` | text on sage/moss buttons |
| `--physio-glow` | `rgba(169,190,160,0.35)` | soft sage glow (replaces lime glow) |
| `--physio-grid` | `rgba(59,54,49,0.04)` | retained token; only used if we keep any faint texture |

**Key implication:** because the existing code references `--physio-accent`, `--physio-text`, `--physio-surface`, etc. by name everywhere, **repainting the whole site is mostly a token swap in `layout.tsx`**. The body `backgroundColor`/`color`/`fontFamily` also flip to the warm palette.

### 2.2 Typography

Replace the three-font Kraft system (Archivo display / Inter body / JetBrains Mono telemetry) with a two-font **warm serif + humanist sans** system. Loaded via `next/font/google`, same `--font-*` variable pattern as today.

| Role | Font | Variable | Weights |
|---|---|---|---|
| Display + headings | **Fraunces** (soft, optical, warm serif) | `--font-fraunces` | 300, 400, 500, 600 |
| Body + UI | **Inter** (kept — already loaded, humanist sans) | `--font-inter` | 400, 500, 600 |
| Data/numbers | Inter with `tabular-nums` (no mono) | — | — |

**Migration rule:** everywhere the code currently sets `fontFamily: "var(--font-archivo), sans-serif"` on a heading, change to `fontFamily: "var(--font-fraunces), serif"`. Everywhere it sets `fontFamily: "var(--font-jetbrains), monospace"` (prices, slots, stats, refs), change to Inter + `tabular-nums` (drop the monospace look entirely — it reads "instrumented", which we're removing).

Headings shift from `font-black uppercase tracking-tight` (shouty) to `font-light/500 normal-case tracking-[-0.02em]` (gentle). The big display headings use Fraunces light with optional italic emphasis on a key word (as in the mockup: *"Ro i kroppen. Veien hjem til bevegelse."*).

### 2.3 Shape, spacing, motion

- **Radii:** Kraft used `rounded-[3px]`/`[4px]` (sharp, technical). Lindrig uses **soft rounded** everywhere: `rounded-[22px]` on cards, `rounded-[28px]` on hero image / large surfaces, `rounded-full` (pill) on buttons and tags. A find-and-replace of the small radii → soft radii across components.
- **Borders:** keep hairline `1px solid var(--physio-rule)` but it now reads as warm sand, not cold. Cards gain a soft hover lift (`hover:-translate-y-1` + gentle box-shadow `0 22px 44px -26px rgba(55,67,58,0.3)`) — already prototyped on treatment cards.
- **Spacing:** sections get **more breathing room**. `PhysioSection` padding increases from `py-20 sm:py-28` to `py-24 sm:py-32`. Hero top padding grows.
- **Motion philosophy:** slow and breathing. The `PhysioReveal` easing stays `[0.22,1,0.36,1]` but **duration increases from 0.55s → 0.8s**, and the travel offset shrinks from 28px → 16px (gentler). Count-ups and aggressive telemetry animations are removed or softened.

### 2.4 What gets removed (Kraft-only motifs)

These exist solely to sell the "performance lab" feel and have no place in a healing design:

- **`VelocityField`** (kinetic streaks in hero) — **removed**. Hero background becomes soft radial sage/clay glows (as in mockup).
- **`HUDGrid`** background grid — **removed** from hero and dashboard. Replaced with nothing (clean warm surface) or a very faint paper grain if desired.
- **`PhysioMotionPanel`** (animated velocity streaks "video") — **replaced**. The homepage + kunnskap "see how we work" video slot becomes a calm static photo (treatment room / hands) with an optional soft play affordance, no moving streaks.
- **`StatusReadout`** in the header (pulsing telemetry dot + ticking clock + "PÅLINJE") — **removed**. A healing clinic doesn't flash a live clock in the nav. Replaced with nothing, or an optional subtle "Ledig time i morgen" hint.
- **Aggressive count-up** in hero stats — **removed**. Numbers become quiet facts.

### 2.5 The "calm metrics" replacement

The homepage currently has a dense 4-panel `MetricsDashboard` (recovery bars, ops telemetry, outcomes ring, interactive assessment). This is the most "training center" part of the site. **The dashboard is restructured** (not just restyled) into 3 quiet **recovery arc** cards matching the approved mockup: 92% fewer pain days, 1–2 days to appointment, 85% follow-through. Each card shows a sage conic-gradient arc ring + a short caption.

- **What's kept (restyled):** the recovery-bar data and the outcomes % become the 3 arc values; the interactive assessment stays as a calm 4th element below the arcs if it reads well, otherwise it's dropped.
- **What's removed:** the ops telemetry panel ("on shift / slots today / SYSTEM: ONLINE" pulse), the `HUDGrid` backdrop, the lime glow, and the mono telemetry type. These are the purely "instrumented" motifs with no healing analogue.
- **Decision point:** if 3 arcs alone feels too thin, add the assessment back as a quiet card. Default: arcs + assessment, drop ops panel.

This is a genuine component rewrite of `MetricsDashboard.tsx`, not a repaint — flag it as the largest single piece of build work.

---

## 3. Component-by-component changes

All components live in `components/gjovik-fysioterapi/`. Each is restyled to the Lindrig system. None change their props or public API (so pages don't need prop edits).

### 3.1 `layout.tsx`
- Swap the three `next/font` loaders: drop Archivo + JetBrains_Mono, add **Fraunces** (`--font-fraunces`, weights 300–600), keep Inter.
- Repaint `body[data-physio]` style block to the Lindrig palette (§2.1). `backgroundColor` → `#F6F1E9`, `color` → `#3B3631`, `fontFamily` → `--font-inter`.
- Update `metadata.themeColor` from `#0e1116` → `#F6F1E9`.
- Update the header doc comment (no longer "Kraft / performance lab").

### 3.2 `PhysioMark.tsx` + `favicon.svg` + brand mark
- The bolt-spine mark reads "power". **Replace with a calmer mark**: a simple leaf/sprout or a soft breathing arc. The mockup uses a **rounded leaf** (a `border-radius: 50% 0 50% 50%` rotated teardrop in a sage→moss gradient). Implement `PhysioMark` as that leaf in SVG.
- Regenerate `public/demos/gjovik-fysioterapi/favicon.svg`: warm bone rounded-square ground (`#F6F1E9`, `rx=7`) with the sage leaf, no ECG trace, no dark background.
- `PhysioLockup`: wordmark moves to Fraunces, normal-case, moss color; "Fysio" in sage. Tagline changes from *"tilbake i aksjon"* → the new tagline (§4).

### 3.3 `PhysioHeader.tsx`
- Nav bar: transparent → frosted warm bone on scroll (already the pattern; just repoint colors). Links in Fraunces/Inter, sage-deep active state.
- **Remove `StatusReadout`** import and usage.
- Booking CTA pill: moss bg, bone text, `rounded-full`.
- Lang switch + mobile menu: repoint colors; mobile items lose uppercase mono look.

### 3.4 `PhysioFooter.tsx`
- Footer sits on `--physio-surface-deep` (`#EFE8DB`, soft warm mist) — **not** moss. Moss deep-green is reserved for the CTA band + brand mark so it stays a deliberate accent rather than a global dark surface. Repoint all `--physio-text-soft` etc. Remove mono (`font-mono`) on hours/colophon → Inter `tabular-nums`.

### 3.5 `PhysioShell.tsx` — unchanged structurally.

### 3.6 `shared.tsx`
- `PhysioSection`: increase padding (`py-24 sm:py-32`), `surface` background flips to paper/mist. Border stays warm rule.
- `SectionEyebrow`: lose the bolt mark + uppercase Archivo; becomes a small sage-deep Fraunces/Inter label, `tracking-[0.22em]`, optionally prefixed with a small leaf.
- `PageTitle`: Fraunces light, normal-case, moss, larger.

### 3.7 `PhysioReveal.tsx`
- Keep `PhysioReveal`: increase duration 0.55s → 0.8s, shrink travel 28px → 16px.
- **Remove `PhysioEnergyBar`** (draws an accent line — fine to keep but soften) — keep but repoint color.
- **Replace `PhysioMotionPanel`**: rename behavior to a calm media panel — a rounded photo with an optional soft circular play button (no velocity streaks, no pulsing bolt). Used by homepage + kunnskap.

### 3.8 `HudPrimitives.tsx`
- **Remove `HUDGrid`** and **`VelocityField`** (delete, or leave unused). **Keep `CountUp`** but it's only used if we keep softened metrics; otherwise remove from hero. File likely shrinks to just `CountUp` or is deleted; decide in build.

### 3.9 `MetricsDashboard.tsx`
- **Rewrite** per §2.5: replace the 4-panel grid with 3 recovery arc cards (sage conic-gradient rings + captions), drop the ops telemetry panel and `HUDGrid` backdrop entirely. Optionally retain the interactive assessment as a calm card below the arcs. This is a rewrite of the component body, not a restyle — the `locale` prop and the `<MetricsDashboard locale={locale} />` call site stay the same. Arcs tween in slowly (sage fill, no glow); all `font-mono` → Inter `tabular-nums`.

### 3.10 `BookingFlow.tsx`
- Repaint to warm palette (the biggest interactive piece). Step pills → sage filled circles. Cards → `rounded-[22px]` paper cards with soft hover. Slot buttons → rounded pills. Pay button: moss (card) — keep Vipps orange for the Vipps option (brand requirement). Summary card → paper. Success mark → leaf in a moss circle. All mono → Inter `tabular-nums`. Keep all step logic unchanged.

### 3.11 `ContactForm.tsx`
- Repaint: paper card, warm inputs (`focus` border → sage), moss submit pill, leaf success mark. Remove mono labels.

### 3.12 `StatusReadout.tsx` — **delete** (no longer referenced after header change).

---

## 4. Voice & copy changes

The Kraft copy is athletic/aggressive. The healing direction needs softer, reassuring copy. Updates to `content/gjovik-fysioterapi.ts`:

- `clinic.tagline`: `no: "Tilbake i aksjon."` → `no: "Ro i kroppen."` (en: `"Back in action."` → `"Calm in the body."`).
- `hero` cut word + headline: from *"Tilbake / i aksjon"* → *"Ro i kroppen. Veien hjem til bevegelse."* (mockup). Update `hero.cutWord` and the inline headline in `page.tsx`.
- `hero.subtitle`: from *"Vi fikser skaden, ikke unnskyldningen…"* → the warmer mockup line: *"Manuell terapi, bevegelse og tett oppfølging — i et rom bygget for å roe ned…"*
- `dashboard` intro + labels: soften "performance" language to "recovery/progress" language.
- Treatments `punch` lines: review and soften any that read as aggressive (e.g. flagship framing).
- Story/contact intros: minor warming where they sound clinical.
- Section headings on homepage: *"Hva vi gjør"* stays; staff heading *"De som fikser deg"* → *"De som følger deg"* (or similar); booking *"Tre minutter, ferdig"* → keep but soften surrounding copy.

Norwegian is the primary voice; English mirrors as a plainer translation (as today). Keep all existing `Localized` structure — only edit string values.

**Out of scope:** no new content sections, no new pages, no new routes.

---

## 5. Pages touched

All five pages restyle via the shared components + their own inline styles. Per-page inline edits:

- `app/demos/gjovik-fysioterapi/page.tsx` — hero (remove VelocityField/HUDGrid, add glows, restructure headline), calm metrics, treatments, video→photo, pricing, story, knowledge teaser, contact CTA. Most inline `style={{...}}` color refs auto-flip via tokens; the headline structure + accent-span wording change.
- `behandling/page.tsx`, `behandlere/page.tsx`, `kunnskap/page.tsx`, `kontakt/page.tsx` — repoint via tokens + Fraunces heading swap + radius softening; structure unchanged. The kunnskap + homepage `PhysioMotionPanel` becomes the calm media panel.

`app/[locale]/gjovik-fysioterapi/page.tsx` (the redirect stub) — unchanged.

---

## 6. Out of scope

- No backend, no real booking/payment, no real contact sending (all stay mocked, as today).
- No new images shot — reuse existing `public/demos/gjovik-fysioterapi/*.jpg`. (Photo treatment is warm enough already; if a hero photo looks too clinical, apply a subtle warm overlay, but no asset replacement required.)
- No changes to other demos (`fjell-brekkestue`, `strand-treverk`) or the host aaen site.
- No i18n infra changes (`?lang=` stays).
- No SEO/route changes.

---

## 7. Build sequence (for the implementation plan)

1. **Foundation:** `layout.tsx` fonts + palette swap + themeColor; `PhysioMark` + `favicon.svg` new leaf mark.
2. **Primitives:** `shared.tsx` (section/eyebrow/page-title), `PhysioReveal` (timing) + replace `PhysioMotionPanel`, delete `HUDGrid`/`VelocityField`, delete `StatusReadout`.
3. **Chrome:** `PhysioHeader`, `PhysioFooter` repainted.
4. **Interactive blocks:** `MetricsDashboard` (soften), `BookingFlow`, `ContactForm`.
5. **Pages:** homepage first (validate the whole system end-to-end), then the four sub-pages.
6. **Copy:** `content/gjovik-fysioterapi.ts` voice pass.
7. **QA:** both locales, mobile + desktop, `prefers-reduced-motion`, Lighthouse pass.

---

## 8. Open questions (to confirm before/during build)

- **Q1 — Assessment card:** the dashboard is decided (3 recovery arcs, ops panel dropped). Remaining choice: include the interactive assessment as a calm 4th card, or leave it out? *Default: include, drop if it crowds.*
- **Q2 — Hero photo:** keep `hero.jpg` as-is, or add a subtle warm overlay? *Default: keep, overlay only if it reads cold.*
- **Q3 — Brand mark:** the rounded-leaf from the mockup, or a breathing-arc / sprout alternative? *Default: rounded-leaf.*

These have sensible defaults, so the build can proceed; they're flagged for the user to override.
