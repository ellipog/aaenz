# aaen studios — visual language

The reference for how aaen studios looks and how to extend it without breaking it. Rewritten 23 Oct 2026 for the character-plate site, revised 24 Oct: the pictures are drawn in Japanese characters, the words are English, and the page flows from top to bottom with no chapters.

## First principle

Every image on the page is drawn in characters. Kanji carry meaning and mass, katakana strokes (ー ｜ ノ ヽ) carry line, and the wave strokes (〜 ︴) carry flow. The art is *semantic*: a wall of stone is 石, a cloud is 雲, a word is 言, light is 光. The characters fill the picture and also say what it shows.

**Japanese lives in the plates, not the type.** Everything you read is English. Japanese appears in the type only as a few accents:

- the small red product glyphs (核 kern, 詠 galdr, 星 Stellar, 基 Armature, 律 Tenet, 読 yomion)
- the legend that keys the quest graph's glyphs, and the strata's layer kanji
- the sphere kanji beside the footer's links on a phone
- the kana that flicker while a headline decodes
- one line for yomion, because it is the Japanese-learning app

The interface around the plates is quiet: title cards in heavy Mincho, micro-type readouts, and a red signal. There are no chapters, episode numbers or section dividers. One band runs into the next. Nothing sits in a box. Plates feather into the void and lists drift on a wave.

## Colour

Tokens live in `app/globals.css`. These are the only colours:

- void `#050505` (ground) · coal `#0c0b0a` (rare inset) · line `#262420` (rare hairline)
- bone `#ece7db` (ink) · dim `#a39d90` (secondary copy) · faint `#67625a` (micro-type)
- red `#e3271d` (signal)

Red is the signal, never a coat of paint. Use it for one word in a headline, a product glyph, a 〜 separator, the red 人 in a plate, a live cursor ■, a verdict. A plate keeps red to a few cells. **No orange or amber anywhere**, and no other hues.

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
| `hero` | `aaen` cut out of wings of light, sampled from `gen-winged-beams.jpg`; dissolves on scroll | home hero |
| `current` | the faint sitewide stream of wave strokes, carried by the scroll | behind every page |
| `octagon` | wavering ripple rings round a red 人, thinning out at the rim, warped by the pointer | home barrier |
| `vortex` | kern: a fleet of 機 orbiting one 核 on winding spiral currents | home works |
| `river` | galdr: churning raw media (音 映 像 声) through a column of 詠唱, out as clean even waves | home works |
| `kanji` | one big kanji drawn in smaller semantic kanji (無 in 無空虚) | 404 |
| `rays` | a cross of light over a city of 目田口日 | home light |
| `world` | a block world in cross-section (草 土 石 炭 鉄 金 玉 紅 雪 砂 盤 水 木 葉 花). A new world grows on each page load and keeps through re-layouts. A red 人 lives in it: it wanders, rests, hops, swims, fells trees, digs shafts and climbs out on 梯 ladders, plants 苗 that grow, bridges with 板 and 礫, builds lookouts. Water flows, day turns to night, a click mines | home Minecraft, /minecraft hero |
| `stars` | Stellar: a constellation of 星 on flowing lines, light running star to star, a river of dust behind, one red star | /minecraft Stellar |
| `strata` | four flowing bands: 草 mods, red 基 Armature, 土 loaders, 盤 bedrock | /minecraft Armature |
| `quests` | a breathing quest graph of 【章】【任】【条】【報】【墓】 on S-curves, with a completion front | /minecraft Tenet |
| `clouds` | a sea of cloud crossed by causeways and processions of 人 | /minecraft, between two parts |
| `tree` | the Tree of Life: ten sphere kanji (冠 知 理 慈 厳 美 勝 栄 基 国) and twenty-two paths over a dark sea; red lightning runs down it and a cross of light erupts up the middle pillar | the footer, every page |
| `orb` | a turning globe of 読語字言文書音声, ringed in kana | home yomion |
| `stream` | words streaming from a red 人 on a curling current, each leaving a wake of strokes | home send word |

`public/assets/gen-*.jpg` are the source plates the subjects come from (see `prompts.md`). Only `gen-winged-beams.jpg` is sampled live. The rest are reference for subjects and mood.

## Flow

These are the rules from the redesign:

- **No stamps.** No rotated, bordered seals of red kanji. A product glyph is plain red Mincho type.
- **No boxed grids.** No `gap-px` tile grids, ruled tables, bordered cards, unit-file frames, hazard tape, hex fields or scanlines.
- **Plates have no frames.** Feather their edges with `fade-y` (full-bleed bands) or `fade-soft` (a plate set among text). Text over a plate sits on a radial void glow, `bg-[radial-gradient(ellipse_closest-side,…)]`, not a box.
- **No chapters.** No episode numbers, section rules, index rails or "next episode" cards. The page is one continuous run.
- **Waves, not lines.** Separators in micro-type are `〜`. Flowing plates draw with the wave strokes, not ー and ｜.
- **Bands run into each other.** Full-bleed plates overlap (the kern vortex runs into the galdr river) and feather out, so no band starts or stops on a hard line.
- **Say it once.** Don't add a caption or label a plate already says: no file headers, status lines or corner tags.
- **Lists drift.** Rows step in (`Leaders`). Paired blocks stagger (the second work drops lower, Tenet answers Armature from the other side).
- **Words sit on the picture.** Where a plate has a shape, the type is laid onto it from the same numbers: the footer's links hang beside the Tree's spheres (`components/ascii/tree-shape.ts` is shared by the plate and the footer).
- **Motion is current, not jitter.** Things swell, ripple, drift and stream. Don't scroll a character grid sideways in jumps.

## Devices

- **Title cards**: heavy Mincho English set big and split across the page, with one red turn, such as *Built to be / stood on.*
- **Decode**: headlines resolve out of scrambling kana (`Decode`). Latin text scrambles through half-width kana, so the line keeps its width.
- **Readouts**: clock, sync percentage, live download count with rolling digits.
- **The council**: the contact form's three seats (I II III) deliberate, then vote APPROVED or REJECTED.
- **The close**: the footer's *Whatever ships next.* set against the Tree of Life, each link on the sphere whose meaning fits it: foundation → Minecraft, wisdom → yomion, mercy → contact, the crown → back to the top. There is no intro animation: the page opens straight on the hero.

## Voice

English, lowercase studio, factual and unhurried. Headlines are short and quotable, such as *The load-bearing parts.* or *One layer everything stands on.* Micro-lines are in caps, joined by 〜 or ・. The call to action is "send word". No exclamation marks, no marketing voice, no geography, and no Japanese copy in the type beyond the accents above.

Eva's *language* only: title cards, warnings, councils, the Tree of Life, crosses of light, faceless figures and monumental scale. Never its characters, faces, names, logos or unit designs.

## The run

- **/**: hero, aaen in wings of light · *Built to be stood on.* · the barrier, open source and offline · two tools: the kern vortex running into the galdr river · the cross of light, *One studio, two crafts.* · *The load-bearing parts.*: one card for the Stellar suite floating over the block world, plus downloads · yomion · send word, the stream · footer.
- **/minecraft**: block-world hero *The load-bearing parts.* · released as ellipog, plus downloads · the Stellar constellation · one band per part of the suite (Armature with its strata, a causeway band, Tenet with its quest graph): name, the line that decodes, a general description, specs and links · footer.
- **The Minecraft work grows.** Parts of the suite live in `lib/mods.ts`; add one there and /minecraft gives it a band. The home page only ever points at the suite. Keep the copy general and leave out counts (tasks, rewards, articles), which change with every release.
- **404**: 無 drawn in 無空虚, *Nothing here.*, the council's verdicts.

## Extending

- **New plate**: add a program to `programs.ts` and register it in `programs`. Pick glyphs that *mean* the thing they draw. Use bone for mass, dim for dust, and red for one figure or a front. Make something flow. Pre-warm any simulation so the reduced-motion still frame isn't empty.
- **New band**: no number, no divider. Use one title card, a plate that feathers out into its neighbours, micro-type that drifts, and one red signal.
- **Never**: orange, stamps, chapters or episode numbers, intro animations, boxed grids, hazard tape, scanlines, rounded cards, drop shadows, new fonts, labels that repeat the plate, Japanese copy in the type, counts that go stale, or characters picked for texture alone.
