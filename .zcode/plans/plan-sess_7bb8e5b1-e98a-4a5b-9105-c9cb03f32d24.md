## Goal

Rebuild the **ContourField** (the procedural topographic map) as a WebGL2 render so it stops looking like flat line art and becomes a living relief map — hillshade, elevation bands, anti-aliased contours, paper grain, animated draw-in, and cursor-reactive light. Two small on-theme wizard touches round it out. Zero new dependencies (raw WebGL2; no three.js).

## What gets built

### 1. `components/ui/ContourFieldGL.tsx` — the GL renderer (new)

A `<canvas>` component with the **same props API** as today's `ContourField` (`seed, levels, resolution, opacity, showFootsteps, showPeaks, className`) so all three embeds (Hero, om-oss, /start backdrop) upgrade with no call-site changes beyond a one-word import swap.

**Pipeline:**
- Reuse `generateHeightmap()` from `lib/terrain.ts` (untouched) → upload the 96×96 Float32Array as an `R32F` texture, LINEAR filtered. The shader does everything else; marching squares is no longer used for this path (kept in the file — no dead-code removal to keep the diff focused).
- **Fragment shader** computes, per pixel:
  - *Elevation bands* ("steps"): `floor(h·N)/N` quantization tints each plateau a progressively deeper paper tone (`--color-paper-deep` → stone-ish), giving subtle topographic layering.
  - *Hillshade relief*: surface normal from heightmap gradient (central differences), Lambert dot against a light direction → soft multiply shading. This is the single biggest "looks real now" lever.
  - *Contour lines*: `fwidth`-based anti-aliased iso-lines at the same thresholds as today (0.08→0.92), moss, with inner rings darker than outer — matching current `0.55·0.78^n` falloff. Index contours (every 3rd) slightly heavier, like real topo maps.
  - *Paper grain*: hash-based dithering noise at ~2%, animated only if motion allowed.
  - *Vignette*: faint edge darkening for the framed-panel look.
- **Draw-in animation**: a `uReveal` uniform 0→1 over ~2.2s on mount — contours + shading fade up from low elevation first (reveal threshold compared against height), like the map is being surveyed.
- **Cursor-reactive light**: `pointermove` on the canvas lerps the light azimuth toward the cursor (smoothed). Enabled only where it reads well:
  - Hero panel: enable (remove `pointer-events-none` on its wrapper).
  - om-oss panel: enable.
  - /start backdrop: **off** (stays `pointer-events-none`, static light — it's behind a form).
- **Performance**: render loop runs only while animating (reveal, grain drift, light lerp not yet settled) then stops; resumes on pointer move. `powerPreference: "low-power"`, `alpha: false`.
- **Reduced motion**: render one static frame at `uReveal=1`, no pointer light, no grain drift.
- **Fallback**: if `getContext("webgl2")` returns null, render the existing SVG version — so `ContourField.tsx` stays as the SVG implementation and `ContourFieldGL` wraps: GL first, SVG fallback.

### 2. Footsteps trail (the "steps") — upgraded, still SVG overlay

The bootprints + waypoint are tiny shapes with text-quality edges — worse in GL. So they stay as a **second SVG layer composited over the canvas**, but upgraded:
- Trail path gets the same elevation-aware draw-in timing (starts as relief reveals the valley).
- Bootprints leave a faint "pressed" shadow (offset duplicate, blur via `filter`), so they read as pressed into the relief rather than floating stickers.
- Waypoint marker gets a subtle ping (one expanding ochre ring on arrival).

### 3. Summit markers

Stay SVG overlay (crisp mono labels). Crosshair + `▲ {elevation}m` labels repositioned to the GL-found peaks (same `findPeaks` data — no change), timed to appear as the reveal reaches their height.

### 4. Wizard touches (small, motion/react only — no GPU)

- `Wizard.tsx`: make step transitions **direction-aware** (forward slides in from +x, back from −x; today it's always +x in / −x out) with slightly longer 0.28s easeOut — feels like hiking the path in either direction.
- `ProgressBar.tsx`: replace flat bars with **five tiny concentric-ring segments** — each step is a mini contour ring that fills moss when done, pulses when active. On-theme ("surveyor-style") and cheap.

## Files

| File | Action |
|---|---|
| `components/ui/ContourFieldGL.tsx` | **new** — canvas + WebGL2 pipeline, shader sources inline as consts, SVG fallback + footsteps/peaks overlay |
| `components/ui/ContourField.tsx` | keep as-is (now serves as fallback + exports `toSmoothPathData`/footprint math reused by GL's overlay) |
| `components/sections/Hero.tsx` | swap import to `ContourFieldGL`; drop `pointer-events-none` on its wrapper so light tracks cursor |
| `app/[locale]/om-oss/page.tsx` | swap import to `ContourFieldGL` |
| `app/[locale]/start/page.tsx` | swap import to `ContourFieldGL` (keeps pointer-events-none; static light) |
| `components/wizard/Wizard.tsx` | direction-aware AnimatePresence transitions |
| `components/wizard/ProgressBar.tsx` | contour-ring segments |
| `lib/terrain.ts` | untouched |

## Build order

1. `ContourFieldGL` with shaders + reveal + hillshade + bands (the core).
2. Cursor light + animation-loop lifecycle + reduced motion + WebGL fallback.
3. Footsteps/peaks SVG overlay on top of the canvas.
4. Swap the three embeds; verify hero/om-oss/start visually.
5. Wizard direction-aware transitions + ProgressBar rings.

## Verification

- `pnpm build` (or the repo's build script) passes, no TS errors.
- Visual check via dev server: hero panel shows shaded relief with contour draw-in; cursor moves the light; om-oss footsteps press into terrain; /start backdrop is subtle and static; reduced-motion OS setting → static frame, no animation.
- WebGL context-loss: refresh-heavy use doesn't leak listeners (single component, cleaned up in effect teardown).