# aaen studios — visual language

The reference for how aaen studios looks and how to extend it without breaking it. Rewritten 23 Oct 2026 for the character-plate site: the pictures are drawn in Japanese characters, the words are English, the page is broadcast like an old anime episode, and it flows.

## First principle

Every image on the page is drawn in characters. Kanji carry meaning and mass, katakana strokes (ー ｜ ノ ヽ) carry line, and the wave strokes (〜 ︴) carry flow. The art is *semantic*: a wall of stone is 石, a cloud is 雲, a word is 言, light is 光. The characters fill the picture and also say what it shows.

**Japanese lives in the plates, not the type.** Everything you read is English. Japanese appears in the type only as a few accents:

- the episode numbers (第壱話 to 第八話)
- the small red product glyphs (核 kern, 詠 galdr, 基 Armature, 律 Tenet, 読 yomion)
- the legend that keys the quest graph's glyphs
- the cold open's kanji flashes
- the kana that flicker while a headline decodes
- one line for yomion, because it is the Japanese-learning app

The interface around the plates is a broadcast: an episode run, title cards in heavy Mincho, micro-type readouts, and a red signal. Nothing sits in a box. Plates feather into the void, lists drift on a wave, and rules ripple.

## Colour

Tokens live in `app/globals.css`. These are the only colours:

- void `#050505` (ground) · coal `#0c0b0a` (rare inset) · line `#262420` (rare hairline)
- bone `#ece7db` (ink) · dim `#a39d90` (secondary copy) · faint `#67625a` (micro-type)
- red `#e3271d` (signal)

Red is the signal, never a coat of paint. Use it for one word in a headline, a product glyph, the travelling current in a wave rule, the red 人 in a plate, a live cursor ■, a verdict. A plate keeps red to a few cells. **No orange or amber anywhere**, and no other hues.

## Type

- **Noto Serif JP**: the voice. `mincho` (weight 900) for English title cards and product names, and for the few kanji accents. Weight 400 for a quieter line set under a headline.
- **JetBrains Mono**: the micro-type system (`mono`): 11px, `.16em` tracking, uppercase. Labels, readouts, nav, captions. Body copy is mono 13px in `dim`.
- English display type is set in the same Mincho and is sometimes squeezed horizontally (`scale-x-[.82]`, uppercase), as on a title card.

No other fonts. The share card fetches a Noto Serif JP subset at build time and falls back to Latin-only.

## The engine

`components/ascii/` draws every plate on a canvas.

- `engine.ts` draws a square cell grid, where a full-width kanji fills one cell. It keeps a glyph atlas per ink and stamps glyphs with drawImage. One shared RAF loop drives every plate, and plates pause off-screen and re-lay-out on resize. It also provides the scan or centre reveal decode, the pointer lens (bright cells near the cursor turn red), the click ripple (a program can opt out), tap events for programs, and a still frame under reduced motion.
- `programs.ts` holds the plates. A program lists its glyphs and returns a frame function `(t) => void` that writes glyph, alpha and ink per cell through `api.put`.
- `plate.tsx` is the client wrapper that server components use: `<Plate kind="world" … />`.

Glyph specs look like `"900:光"` (weight prefix, default 400). Two stroke sets are always available, both taking a direction with y pointing down. `lineGlyph(api, θ)` draws with ー ｜ ノ ヽ, for light, letters and architecture. `flowGlyph(api, θ)` draws with 〜 ︴ ノ ヽ, for anything that runs like water: ripples, currents, streams, curves.

Under every page runs `current`, a fixed, faint field of wave strokes behind the content (mounted in `app/layout.tsx`). Its wakes travel with the scroll, so the spaces between bands flow too. This is why `<body>` has no background: the void is set on `<html>`.

### Plate inventory

| program | draws | used on |
| --- | --- | --- |
| `hero` | `aaen` cut out of wings of light, sampled from `gen-winged-beams.jpg`; dissolves on scroll | home 第壱話 |
| `current` | the faint sitewide stream of wave strokes, carried by the scroll | behind every page |
| `octagon` | wavering ripple rings round a red 人, thinning out at the rim, warped by the pointer | home 第参話 |
| `vortex` | kern: a fleet of 機 orbiting one 核 on winding spiral currents | home 第四話 |
| `river` | galdr: churning raw media (音 映 像 声) through a column of 詠唱, out as clean even waves | home 第四話 |
| `kanji` | one big kanji drawn in smaller semantic kanji (無 in 無空虚) | 404 |
| `rays` | a cross of light over a city of 目田口日 | home 第伍話 |
| `world` | a block world in cross-section (草 土 石 炭 鉄 金 玉 紅 盤 水 木 葉); still ground, flowing water, marbled rock, wisps of cloud, a walking red 人; click to mine | home 第六話, /minecraft hero |
| `strata` | four flowing bands: 草 mods, red 基 Armature, 土 loaders, 盤 bedrock | /minecraft Armature |
| `quests` | a breathing quest graph of 【章】【任】【条】【報】【墓】 on S-curves, with a completion front | /minecraft Tenet |
| `clouds` | a sea of cloud crossed by causeways and processions of 人 | /minecraft, between the two |
| `orb` | a turning globe of 読語字言文書音声, ringed in kana | home 第七話 |
| `stream` | words streaming from a red 人 on a curling current, each leaving a wake of strokes | home 第八話 |

`public/assets/gen-*.jpg` are the source plates the subjects come from (see `prompts.md`). Only `gen-winged-beams.jpg` is sampled live. The rest are reference for subjects and mood.

## Flow

These are the rules from the redesign:

- **No stamps.** No rotated, bordered seals of red kanji. A product glyph is plain red Mincho type.
- **No boxed grids.** No `gap-px` tile grids, ruled tables, bordered cards, unit-file frames, hazard tape, hex fields or scanlines.
- **Plates have no frames.** Feather their edges with `fade-y` (full-bleed bands) or `fade-soft` (a plate set among text). Text over a plate sits on a radial void glow, `bg-[radial-gradient(ellipse_closest-side,…)]`, not a box.
- **Rules are waves.** The episode rule is a run of 〜 with a red signal travelling along it. Separators in micro-type are `〜`, and the footer ticker rides a wave. Flowing plates draw with the wave strokes, not ー and ｜.
- **Bands run into each other.** Full-bleed plates overlap (the kern vortex runs into the galdr river) and feather out, so no band starts or stops on a hard line.
- **Say it once.** Don't add a caption or label a plate already says: no file headers, status lines or corner tags.
- **Lists drift.** Rows step in (`Leaders`) or sit on a sine wave (`drift(i)` on the Minecraft page). Paired blocks stagger (the second work drops lower, party modes fall in a diagonal).
- **Motion is current, not jitter.** Things swell, ripple, drift and stream. Don't scroll a character grid sideways in jumps.

## Broadcast devices

- **Episodes**: every band is numbered 第壱話 to 第八話, with `EPISODE:0n` at the far end of its wave rule. The episode rail on the right tracks them.
- **Cold open**: on the home page's first visit each session, a broadcast line, 第壱話, the L-shaped title card *The studio, / awakens.*, then full-screen kanji flashes 核 詠 基 律 読, before handing over to the hero. Any key, click, wheel or touch skips it.
- **Title cards**: heavy Mincho English set big and split across the page, with one red turn, such as *Built to be / stood on.*
- **Decode**: headlines resolve out of scrambling kana (`Decode`). Latin text scrambles through half-width kana, so the line keeps its width.
- **Readouts**: clock, sync percentage, live download count with rolling digits.
- **The council**: the contact form's three seats (I II III) deliberate, then vote APPROVED or REJECTED.
- **Next episode**: the footer's *Whatever ships next.*

## Voice

English, lowercase studio, factual and unhurried. Headlines are short and quotable, such as *The load-bearing parts.* or *One layer everything stands on.* Micro-lines are in caps, joined by 〜 or ・. The call to action is "send word". No exclamation marks, no marketing voice, no geography, and no Japanese copy in the type beyond the accents above.

Eva's *language* only: episodes, title cards, warnings, councils, faceless figures and monumental scale. Never its characters, faces, names or unit designs.

## The run

- **/**: 第壱話 hero (aaen in wings of light) · 第弐話 *Built to be stood on.* · 第参話 the barrier, open source and offline · 第四話 two tools: the kern vortex running into the galdr river · 第伍話 the cross of light, *One studio, two crafts.* · 第六話 *The load-bearing parts.*: Armature and Tenet floating over the block world, plus downloads · 第七話 yomion · 第八話 send word, the stream · footer.
- **/minecraft**: block-world hero *The load-bearing parts.* · released as ellipog 〜 stellar, plus downloads · Armature: strata plate, the contracts in seven articles, specs · causeway band · Tenet: quest graph, *18 tasks ask, 10 rewards pay, 6 conditions gate.*, the laws, the three party modes, specs · back links.
- **404**: 無 drawn in 無空虚, *Nothing here.*, the council's verdicts.

## Extending

- **New plate**: add a program to `programs.ts` and register it in `programs`. Pick glyphs that *mean* the thing they draw. Use bone for mass, dim for dust, and red for one figure or a front. Make something flow. Pre-warm any simulation so the reduced-motion still frame isn't empty.
- **New band**: give it an episode number and a wave rule. Use one title card, a plate that feathers out, micro-type that drifts, and one red signal.
- **Never**: orange, stamps, boxed grids, hazard tape, scanlines, rounded cards, drop shadows, new fonts, labels that repeat the plate, Japanese copy in the type, or characters picked for texture alone.
