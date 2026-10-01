# Elsewhere band — ellipog on the aaen studios homepage

*Design spec, 2026-10-01. Follows the research in `docs/research/ellipog-dev-notes.md` and the visual rules in `STYLE.md`.*

## Summary

Add one new paper band, `id="elsewhere"`, to `app/page.tsx` between the works orbit (`#works`) and the ink footer (`#word`). It acknowledges the studio's gaming persona — **ellipog** / Stellar (Minecraft mods, ellipog.dev) — in the site's own language, with a live download counter that fetches at runtime from both Modrinth and CurseForge and displays as a bare number. Plus one link in the footer close bar and the matching STYLE.md updates.

Non-goals: no fourth work station (ellipog is a persona, not a product), no Minecraft imagery, no new generated plate, no metadata/SEO changes, no header-nav change.

## Band structure (top to bottom)

Single centered column, paper ground, quietest band on the page:

1. **Seam device** — the red thread continues from the works band: a 1px vertical red gradient line crossing the `#works` → `#elsewhere` seam (same device as the statement→mirror seam), terminating in a single 7px red dot above the label — the satellite that left the works dial. This dot + the headline's italic word is the band's entire red budget.
2. **Label** — mono micro-type: `ELSEWHERE`.
3. **Headline** — serif, sentence case, one italic red word: `One studio, <em>two names</em>.` — echoing the knock band's "One studio, three works."
4. **Body** — one paragraph, `text-dim`: "Under the names ellipog and stellar, the same hands build for Minecraft — technical core mods, multi-loader libraries, data-driven gameplay systems and modpack tools, on Fabric and NeoForge."
5. **The star** — `ellipog` as a lowercase serif name, image-filled with `public/assets/gen-sphere-ring.jpg` (the black orb with one thin ring — a star) through the same filter chain the works names use (`grayscale(1) contrast(1.6) brightness(.82)`), with `fill-drift` and `para-c` parallax. Links to `https://ellipog.dev`, hover-inverts like the works names. Sized a step below the works names: `clamp(64px, 12vw, 160px)`.
6. **Counter** — one mono micro-type line directly under the name: `N DOWNLOADS` — the live combined Modrinth + CurseForge total, formatted `en-US`. Renders nothing until data arrives and nothing on failure. No attribution, no fetch commentary anywhere.
7. **Links row** — mono micro-type: `MODRINTH ↗ · CURSEFORGE ↗ · DISCORD — STELLAR ↗` linking to `https://modrinth.com/user/Ellipog`, `https://www.curseforge.com/members/ellipog/projects`, and `https://discord.gg/uy9QFaQWR7`. Hover red like the footer links.

## Live counter

- `app/api/downloads/route.ts` — route handler, `force-dynamic`, in-memory 60s cache. Sums:
  - **Modrinth** (public, no key): `GET https://api.modrinth.com/v2/user/Ellipog/projects`, sum each project's `downloads`.
  - **CurseForge**: every project by author id `30254096` — `GET /mods/search?gameId=432&authorId=30254096&pageSize=50`, sum each `downloadCount`. Official API when `CURSEFORGE_API_KEY` is accepted; public curse.tools mirror otherwise.
  - Returns `{ downloads: number | null }`.
- `components/downloads.tsx` — client component under the name: fetches the route on mount, re-fetches every 60s (interval cleaned up on unmount), renders the formatted number; silent when loading or failing (no skeleton, no error text, no layout shift beyond the one 11px line).
- Degradation: if either source fails, the last good combined total is served; before any success, nothing is rendered. The homepage stays a static server component; only the route handler and the small client component touch the network.

## Chrome and docs

- **Footer close bar** (`#close`): add plain `ELLIPOG` link → `https://ellipog.dev`, between YOMION and GITHUB, styled like its siblings.
- **STYLE.md**: add the band to "The run" (sections renumbered — elsewhere becomes 10, word 11, close 12); note the second role of `gen-sphere-ring.jpg` in the plate inventory ("ellipog name fill, elsewhere band"); add the seam-thread + satellite to the red-marks list. No voice changes needed.
- **prompts.md**: untouched (no new plate).

## Motion and accessibility

Reused only: `reveal` (`data-reveal`), `fill-drift`, `para-c` — all cancel under `prefers-reduced-motion` via existing utilities. Grain overlay is global; nothing to do. The counter line is plain text (screen-reader readable by default). Mobile: centered stack via existing `max-[760px]` patterns; the seam dot hides on small screens if it crowds.

## Verification

- `npm run build` passes; `GET /api/downloads` returns a plausible sum with the key set and a Modrinth-only sum without it.
- Visual pass (delivery protocol's visual-judge) on the new band, desktop + 760px breakpoint: seam thread lands correctly, star fill legible, red budget respected (thread + dot + one italic word, no more).

## Open items

- Provided `CURSEFORGE_API_KEY` currently returns 403 from the official API; the counter runs on the curse.tools mirror of the same data, and the official path takes over automatically once the key is accepted.
- CurseForge query resolved: author-id search summing every project — matches ellipog.dev's own total (within live drift).

## Revisions (2026-10-01, user feedback after first build)

- Counter sums **both** platforms in full — Modrinth user projects + every CurseForge project by author id. Official CF API when the env key is accepted, curse.tools mirror otherwise; a failed refresh serves the last good total.
- Both names are displayed: `ellipog` (image-filled, → ellipog.dev) and `stellar` (ink outline, → the Stellar Discord). The DISCORD micro-link was removed from the links row; it is now MODRINTH ↗ · CURSEFORGE ↗.
- Body copy names no specific projects — it describes the technical work in broad strokes (technical core mods, multi-loader libraries, data-driven gameplay systems, modpack tools, on Fabric and NeoForge) in the studio voice.
- The counter still renders as a bare number with no attribution; fill-drift was dropped from the name (its 8%→66% background sweep would pull letters off the planet disc), and the background uses arbitrary-property syntax (`[background-size:…][background-position:…]`) after `bg-[size:…]` produced no CSS under Tailwind v4.
