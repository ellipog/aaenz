# Research notes: ellipog.dev / Ellipog / "Stellar"

*Researched 2026-10-01. Every claim cites its source URL; anything not directly verified is marked **[secondhand]** or **[inference]**.*

## Summary

`ellipog.dev` is the personal site of **Ellipog**, a Norwegian Minecraft mod developer whose real name is **Elliot** (GitHub name field; LinkedIn slug `elliot-strand-aaen`, so full name is almost certainly **Elliot Strand Aaen** — [inference]). The site is a minimal, dark, typography-driven showcase of his Minecraft mods (Fabric + NeoForge, MC 1.21.1), with a live download counter (2,635,939 at time of fetch) pulled from the Modrinth and CurseForge APIs at build time.

"**Stellar**" is his gaming brand: it is the name of his Discord community server ("Home of Stellar, ellipog's mods, and whatever we're building next"), his released modpack (**Create Stellar**, 186,773 downloads), and his BisectHosting affiliate code (**mcstellar** / **MCSTELLAR**). The site footer states it is **"Engineered & maintained by Aaen Studios"** linking to **aaenz.no** — i.e. ellipog.dev is a client/product of the studio whose site lives in this repo. GitHub confirms the personal tie: user `ellipog` has `company: "Aaen Studios"`, `blog: aaenz.no`, and the GitHub org `aaen-studios` exists with pinned repos `loom` and `kern` shared across both identities.

Persona presentation is deliberately dry and low-key: bios on GitHub and Modrinth are literally just "hi", the Modrinth avatar is a placeholder, and all personality is expressed through the site's terse copy and the halo-mark logo (a chevron "A" under a floating ellipse — an angel-halo reading that rhymes with the 天使/"angel" kanji motif on aaenz.no — [inference]).

---

## 1. What Ellipog is

- **Identity on-site:** lowercase wordmark "ellipog"; site title `ellipog.dev`; subtitle/tagline **"fabric + neoforge · minecraft"**; headline **"Minecraft mods."** with the subhead *"Some released, some still being built. Everything published is on Modrinth and CurseForge."*
  Source: https://ellipog.dev/ (raw HTML + visible copy)
- **Meta description (raw HTML):** "Minecraft mods for Fabric and NeoForge — a UI library and a questing engine in development, plus earlier work." Source: https://ellipog.dev/ `<meta name="description">`
- **Positioning:** a mod *developer* first — two serious tooling projects in development (a questing engine and the UI library under it), a back-catalog of Origins addons, and one modpack. The site is strictly Minecraft; no other games mentioned.
- **Footer bio:** "I build Minecraft mods. A couple are in development now; the rest are already out." Source: https://ellipog.dev/
- **Download counter:** "2,635,939 downloads · modrinth + curseforge", with the candid note: *"Download counts are fetched from both platform APIs when this site builds, so they are whatever those APIs said that day rather than a number typed into a file."* Source: https://ellipog.dev/
- **Name origin:** not stated anywhere on the site. Modrinth collections are named "Elliot's Origins" and "Elliot's Compat Mods", tying the handle to the first name Elliot. Source: https://modrinth.com/user/Ellipog
- **Person:** GitHub profile: name **"Elliot"**, bio "hi", location **Norway**, company **"Aaen Studios"**, blog **aaenz.no**, account created 2018-12-11, 35 public repos. Sources: https://github.com/ellipog , https://api.github.com/users/ellipog
- **Timeline note:** GitHub account dates to 2018; Modrinth account created **2023-10-09** (source: https://api.modrinth.com/v2/user/Ellipog ). Create Stellar launched ~April 2023 per Reddit posts **[secondhand]** (https://www.reddit.com/r/feedthebeast/comments/12yfm4a/my_modpack_create_stellar_just_officially/ , seen only via search snippets — Reddit blocked direct fetch).

## 2. Who/what "Stellar" is

Stellar is the community/brand name. Three first-party confirmations:

1. **Discord server named "Stellar"** — invite `https://discord.gg/uy9QFaQWR7` resolves to guild name **"Stellar"** with description **"Home of Stellar, ellipog's mods, and whatever we're building next."**
   Sources: invite link appears in Modrinth project pages (e.g. Animal Origins body, https://modrinth.com/mod/animal-origins ); guild name/description from `https://discord.com/api/v9/invites/uy9QFaQWR7` (queried 2026-10-01).
2. **Modpack name "Create Stellar"** — released modpack, 186,773 downloads (CurseForge), described on ellipog.dev as *"Create, with a progression line through it rather than an inventory of machines and no direction."* Source: https://ellipog.dev/
3. **Affiliate/hosting code "mcstellar"** — ellipog.dev footer advertises BisectHosting ("Hosting partner", "25% off with code mcstellar", labeled "Affiliate link"); the same code appears uppercase as **MCSTELLAR** in older Modrinth project bodies. Sources: https://ellipog.dev/ ; https://modrinth.com/user/Ellipog (embedded project JSON).

**Persona presentation:** no avatar/mascot character is used anywhere first-party — Modrinth shows a placeholder avatar, bios are "hi" (https://modrinth.com/user/Ellipog , https://github.com/ellipog ). The only brand art is the ellipog.dev mark (see Design language). Presentation is understated: the person is "Elliot", the brand is "ellipog", the community is "Stellar".

- A web-search result claimed Ellipog "runs an organization called **Stellar**" on Modrinth (https://modrinth.com/user/Ellipog as indexed). **[secondhand, unverified]** — `https://modrinth.com/organization/stellar` and `https://api.modrinth.com/v2/organization/stellar` both returned not-found at fetch time; no `/organization/` link exists in the cached user-page HTML.
- CurseForge lists a community spin-off pack "Create Stellar & Horror" (~273 downloads) — **not** first-party. **[secondhand]** Source: https://www.curseforge.com/minecraft/modpacks/create-stellar-horror via search snippet.

## 3. Games / projects

### In development (MC 1.21.1, Fabric + NeoForge) — https://ellipog.dev/

| Project | What it is | Status | Links |
|---|---|---|---|
| **Tasked** | "A questing engine. JSON files in, a pannable canvas out, and the server decides what counts as done." | v0.1.0, "in development" — docs admit *"There is no questing code yet"*; "it builds on both loaders, loads into the game, and logs a few lines on startup" | github.com/ellipog/tasked · /docs/tasked/ |
| **Armature** | "The library under it. Layout, themes, shapes, a graph canvas, and one seam between the code and the game's renderer." Standalone mod ("does not require Tasked"); "a UI toolkit that knows nothing about quests" | v0.1.0, "does nothing yet" | github.com/ellipog/armature · /docs/armature/ |

### Planned — "after the 26.x port" (MC 26.3) — https://ellipog.dev/

- **Kindred** — "Kin and lineages."
- **Kith** — "Traits and abilities."
- **Stature** — "Scale and hitboxes."
- **Folio** — "Documentation, in game."

(The one-word Name + one-line fragment pattern — Kindred/Kith/Stature/Folio — is the site's house style for naming.)

### Released — https://ellipog.dev/

| Project | Type | Description (site copy) | Downloads |
|---|---|---|---|
| **Create Stellar** | Modpack | "Create, with a progression line through it rather than an inventory of machines and no direction." | 186,773 (CurseForge) |
| **Mythic Origins** | Origins addon | "Mythical powers as playable origins." | 470,788 (98,881 Modrinth · 371,907 CurseForge) |
| **Fairytale Origins** | Origins addon | "Eight storybook origins, each with a weakness that bites." | 390,413 (48,299 Modrinth · 342,114 CurseForge) |

Full Modrinth back catalog (11 projects, ~297.9K Modrinth downloads) — https://modrinth.com/user/Ellipog and https://api.modrinth.com/v2/user/Ellipog/projects :

- Mythic Origins (99.2K) — "A carefully crafted Origins mod addon that brings mythical powers to Minecraft"
- Animal Origins (51.4K) — 9 animal origins (Duck, Gecko, Giraffe, Grasshopper, Lizard, Shark, Sheep, Red Panda, Cat)
- Fairytale Origins (48.4K)
- Create Origins Compat (44.1K) — Create × Origins compatibility
- Mystical Garden Cloches (26K) — automate Mystical Agriculture via Immersive Engineering
- Godling Origin (9.6K), Galacticborn Origin (8.4K), Deviling Origin (7.3K) — single-origin addons
- Extra Origins SMP (modpack, 1.9K), Christmas Dimension RP (resource pack, 959), Christmas Dimension (datapack, 577)

Create Stellar on CurseForge **[secondhand, page returned 403]**: "A Create focused modpack all about automation, including tons of adventure, both on land and in space"; "One of the main features of this pack is it's progression system", latest file v0.5.1. Sources: https://www.curseforge.com/minecraft/modpacks/create-stellar via search snippets; launch-post quote from Ellipog: "you will 100% know how to use create after the pack" (https://www.reddit.com/r/feedthebeast/comments/12yfm4a/my_modpack_create_stellar_just_officially/ via search snippet).

## 4. Design language

**Logo/mark:** a stark chevron shaped like a capital **A** with a floating **ellipse "halo"** above it, off-white on black (`site/mark-on-dark.png`, 879×879; light variant `mark-on-light.png`; both also serve as favicons per `prefers-color-scheme`). In the OG card it sits left of the lowercase wordmark "ellipog". The halo reads as an angel halo — which rhymes with the 天使 ("angel") kanji motif on the studio site aaenz.no — **[inference, not stated anywhere]**.
Sources: https://ellipog.dev/site/mark-on-dark.png ; https://ellipog.dev/og.png (1200×630, headline "Minecraft mods." set large in a geometric sans)

**Colors** (CSS custom properties from `/_next/static/chunks/04hiry8841t-s.css`, light/dark pairs):
- bg: `#fff` / `#09090b`; sunken: `#fafafa` / `#0e0e11`; fg: `#09090b` / `#fafafa`; muted/faint: `#52525b`/`#52525b` vs `#a1a1aa`; line: `#e4e4e7` / `#26262a`; danger: `#b91c1c` / `#ef4444`. I.e. a zinc-gray scale with red reserved for danger only. Subtle grid-line background (`--grid-line: #09090b0f` / `#fafafa0d`).
**Layout/shape:** `--radius: 0` (everything sharp-cornered), `--page: 1200px`, `--measure: 68ch`, 56px masthead, left docs rail (232px) + right TOC rail (200px).
**Type:** `--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; `--font-mono: ui-monospace, "Cascadia Mono", "SF Mono", "JetBrains Mono", Consolas, "Liberation Mono", monospace` — no webfont download; system stack + heavy mono usage (labels, separators, the `mcstellar` code block).
**Theme:** dark/light via `data-theme` attribute set from `localStorage('theme')` with `prefers-color-scheme` fallback; toggle in masthead labeled just "dark".

**Tone of voice** — terse, lowercase-flavored, engineer-honest. Representative lines (all https://ellipog.dev/ unless noted):
- "A questing engine. JSON files in, a pannable canvas out, and the server decides what counts as done."
- "Eight storybook origins, each with a weakness that bites."
- "Kin and lineages." / "Traits and abilities." / "Scale and hitboxes." / "Documentation, in game."
- "Download counts are fetched from both platform APIs when this site builds, so they are whatever those APIs said that day rather than a number typed into a file."
- "Nothing is authored on this site, which is the whole reason it cannot drift from the code it describes." (https://ellipog.dev/docs/)
- "a page describing a class that does not exist is worse than a page that admits there is nothing there." (https://ellipog.dev/docs/armature/)
- "There is no questing code yet." (https://ellipog.dev/docs/tasked/)

The docs themselves are a designed system: glossary terms with hover definitions (`[[quest]]`), four callout weights (Note/Tip/Warning/Caution), cross-mod links resolved at build time, "a link to a page that does not exist fails the build" (https://ellipog.dev/docs/tasked/design-preview/ , https://ellipog.dev/docs/glossary/).

## 5. Tech fingerprints

- **Next.js (App Router, Turbopack)**: `/_next/static/chunks/*.js` with `turbopack-2pf-vcjbldwoe.js`, `data-precedence="next"` stylesheet links, React Server Component markers (`<!--$--><!--/$-->`), `noModule` legacy script fallback. Source: https://ellipog.dev/ raw HTML.
- **Lightning CSS** minification: `--lightningcss-dark` variables in the stylesheet.
- **Build-time data**: download counts fetched from Modrinth + CurseForge APIs "when this site builds"; docs pages "written in the repository that owns the mod and copied in when this site builds" (https://ellipog.dev/ , https://ellipog.dev/docs/) — a static/SSG pipeline, no client data fetching visible.
- **Theming**: inline no-flash script setting `data-theme` from localStorage/matchMedia.
- **SEO**: canonical, OpenGraph (og:image `/og.png` 1200×630), Twitter `summary_large_image`; `robots.txt` (allow all) + `sitemap.xml` with exactly 6 URLs (`/`, `/docs/`, `/docs/armature/`, `/docs/glossary/`, `/docs/tasked/`, `/docs/tasked/design-preview/`).
- **404**: stock Next.js "404: This page could not be found." with `noindex` (https://ellipog.dev/404-page).
- Repo tooling hints from GitHub pins: **Rust** (`loom`), **TypeScript** (`kern`), **Java** (armature, tasked — "multi-loader runtime library and rendering engine for Fabric and NeoForge"). Source: https://github.com/ellipog

## 6. All social/profile links found

First-party:
- Modrinth: https://modrinth.com/user/Ellipog (site nav + footer; bio "hi", joined 2023-10-09)
- CurseForge: https://www.curseforge.com/members/ellipog/projects (site nav + footer)
- GitHub: https://github.com/ellipog (site footer; name "Elliot", location Norway, company "Aaen Studios", blog aaenz.no; links Instagram **https://www.instagram.com/ellipog** and LinkedIn **https://www.linkedin.com/in/elliot-strand-aaen**)
- GitHub org: https://github.com/aaen-studios (Norway, 5 public repos; via https://api.github.com/orgs/aaen-studios)
- Discord community "Stellar": https://discord.gg/uy9QFaQWR7 (found in Modrinth project bodies; guild name/description verified via Discord invite API)
- Affiliate: https://www.bisecthosting.com (code **mcstellar** / **MCSTELLAR**) — ellipog.dev footer + Modrinth project pages
- Studio site: https://aaenz.no ("Engineered & maintained by Aaen Studios" — ellipog.dev footer)

**[secondhand]** Reddit presence: r/feedthebeast + r/CreateMod launch posts (https://www.reddit.com/r/feedthebeast/comments/12yfm4a/my_modpack_create_stellar_just_officially/ , https://www.reddit.com/r/CreateMod/comments/12yfmhz/my_modpack_create_stellar_has_finally_officially/ — Reddit blocked direct fetching). **[secondhand]** YouTube/TikTok playthroughs and mentions exist but none verified as first-party channels. No Bluesky, X/Twitter, YouTube, or Ko-fi links found anywhere first-party.

## 7. Relationship to aaen studio

- ellipog.dev footer (every page): **"Engineered & maintained by Aaen Studios"** → https://aaenz.no . Source: https://ellipog.dev/ raw HTML.
- GitHub ties: user `ellipog` → `company: "Aaen Studios"`, blog `aaenz.no`; org `aaen-studios` owns `loom` and `kern`, two of ellipog's four pinned repos; ellipog's Modrinth-era identity and the studio share the same GitHub org. Sources: https://api.github.com/users/ellipog , https://github.com/ellipog , https://api.github.com/orgs/aaen-studios
- aaenz.no itself (fetched 2026-10-01) does **not** mention Ellipog, Stellar, Minecraft, or games. It presents "aaen studios" as "A software studio. Tools that live on your machine." — local-first open-source desktop tools (kern, galdr, yomion), dark minimal design with Japanese kanji motif (incl. 天使 "angel"), "© MMXXVI". So the studio site claims the engineering credit for ellipog.dev while keeping the gaming brand off its own page — consistent with Ellipog/Stellar being the personal gaming persona under the studio umbrella. Sources: https://aaenz.no ; relationship split is **[inference]** from the footer credit + GitHub ties.
- Observed design kinship (both minimal/dark/lowercase/mono, halo-over-A mark vs 天使 "angel" motif): **[inference]**.

## Appendix: fetch log

Fetched directly (2026-10-01): `https://ellipog.dev/` (WebFetch + raw HTML), `/robots.txt`, `/sitemap.xml`, `/404-page`, `/docs/`, `/docs/tasked/`, `/docs/armature/`, `/docs/glossary/`, `/docs/tasked/design-preview/`, `/_next/static/chunks/04hiry8841t-s.css`, `/site/mark-on-dark.png`, `/og.png`, `https://api.modrinth.com/v2/user/Ellipog` (+ `/projects`), `https://api.github.com/users/ellipog`, `https://api.github.com/orgs/aaen-studios`, `https://discord.com/api/v9/invites/uy9QFaQWR7`, `https://modrinth.com/user/Ellipog` (raw HTML), `https://github.com/ellipog`, `https://aaenz.no`.

Blocked/failed: `https://www.curseforge.com/minecraft/modpacks/create-stellar` (HTTP 403 — Cloudflare), Reddit post pages (login wall; content known only via search snippets), `https://modrinth.com/organization/stellar` (not found — org claim unverified), Modrinth org API route (404).
