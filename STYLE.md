# aaen studios — visual language

The permanent reference for how aaen studios looks, what holds it together, and how to keep it intact when extending. Calibrated 14 Sep 2026 from seven live captures of aaenz.no (top → close) and the plates in `public/assets/`.

The sheet that generates the plates is `prompts.md`. This file explains what that system is doing and the rules around it. Read both before making anything.

## First principle

The images are the single most important thing pulling the style together. They carry all of the contrast, scale and mood; the interface is a gallery wall — paper, hairlines, micro-type and one red thread — that frames the plates and then gets out of the way. When in doubt: protect the image, do not decorate over it.

## The plates

One rendering language across every image: black ink on warm paper `#f3f1ec` — screentone halftone, engraving crosshatch, fine vertical hatching, dense grain, extreme black-and-white contrast. No colour anywhere except the one sanctioned red plate.

The subjects form a fixed mythology of scale:

- **Wings and winged figures** — wings made of light beams (`gen-winged-beams`), mirrored wing crops (`gen-winged-right-a`), feather close-ups (`gen-wings-close`), formations of winged silhouettes (`gen-flock-diagonal`).
- **Light as architecture** — beams, ladders, causeways and cables: diagonal light bands with processions walking them (`gen-clouds-engraving`), a cross of light above a hairline city (`gen-beam-city`), a lone descent on a cable in near-total darkness (`gen-cable-descent`).
- **Tiny humans against monumental geometry** — processions on the diagonal bands, silhouettes on the cable, a city drawn as hairlines. The scale gap is the drama.
- **Celestial geometry** — orbs, rings, halos, orbits: a black orb with one thin ring (`gen-sphere-ring`), concentric octagonal "barrier" rings (`gen-octagon-ring`), a pale faceless giant above engraved seas of cloud (`gen-colossus-clouds`).
- **Faceless figures** — backs turned, blank heads, no eyes, no expression. Never a recognisable character.
- **Messenger marks** — the kanji 天使, 光, 使者, 核, 詠, 読 used as stamps and monuments, never as decoration to be translated.

Hard rules for any new plate:

- Monochrome. Grayscale + contrast only; red is a separate exception, drawn in stamp ink, not added to plates.
- Evangelion's *language* only — scale, fog, geometry, wings, crosses, monoliths. Never its characters, faces, names or unit designs.
- No text, letters, signature, logo, watermark or frame inside the artwork. Plates bleed to their edges.
- One style spine per batch, word for word from `prompts.md`. Never paraphrase it — the set drifts.

### Plate inventory and where each one lives

| plate | subject | used for |
| --- | --- | --- |
| `gen-winged-beams.jpg` | figure whose wings are beams, pin-stripe night | hero backdrop |
| `gen-clouds-engraving.jpg` | engraved cloud sea, light causeways, tiny processions | statement capsule, "your machine" fill, galdr name fill, 使者 fill |
| `gen-cable-descent.jpg` | descent on a cable, almost all black | close backdrop, kern name fill |
| `gen-beam-city.jpg` | cross of light over hairline city | slats band (masked into slats) |
| `gen-octagon-ring.jpg` | black disc of concentric octagonal rings | hero lens rim, shapes disc |
| `gen-sphere-ring.jpg` | black orb, one thin ring | shapes circle |
| `gen-colossus-clouds.jpg` | pale faceless giant above clouds | FEATURED WORK circle |
| `gen-winged-right-a.jpg` | winged figure, ink | mirror band, doubled and reflected |
| `gen-wings-close.jpg` | feather close-up | AAEN fill in the knock |
| `gen-flock-diagonal.jpg` | winged formation | yomion name fill |
| `gen-void-figure`, `gen-screentone-sky`, `gen-ink-water`, `gen-winged-right-b`, `gen-cube-city-a/b`, `gen-field-fall`, `gen-monolith-city` | same family | reserve |
| `gen-red-ring.jpg` | the one-red-ring plate | the single sanctioned colour exception |
| `gen-winged-water.jpg` | retired | do not put it back on the page |

## Colour

Exact tokens (from `app/globals.css`):

- paper `#f3f1ec` · paper2 `#e9e6df` · ink `#101010` · dim `#55534d` · faint `#8b8880` · line `#d4d0c7`
- red `#b31212`

Red is a thread, a stamp and a signal — never a coat of paint. Where it is allowed:

- one italic word or clause per headline ("*studio*", "*shipped and kept*")
- 1px hairlines and gradients — the thread that runs between bands and along the knock seam
- small marks: the satellite on an orbit, station dots, the octagon disc's hairline ring, the slats tick, the seal 使者
- `::selection`

Never: red body copy, red backgrounds, red logos at scale, more than a few red marks per viewport.

## Type

- **Cormorant Garamond** — display. Lowercase wordmark `aaen` with wide tracking; headlines in sentence case; giant display type may be image-filled (window onto a plate) or reduced to a 1px outline.
- **Inter** — body and UI. 15px / 1.65, `dim` for secondary paragraphs.
- **JetBrains Mono** — the micro-type system: 11px, `.16em` tracking, uppercase. Captions, labels, nav, metadata, always anchored at edges and corners, separators `·` and `—`.
- **Zen Old Mincho** — kanji only, generously tracked, set vertically at plate edges (天使, 光).

Type never competes with the image. A headline either sits in empty paper or melts into the plate (image-filled text: "your machine", AAEN, 使者, the product names). No other fonts, no bold display, no sans headings.

## Geometry and devices

1. **The lens** — a thin outlined ellipse/eye shapes the two big wordmarks (`aaen`, `send word`); reused as the double ellipse in the knock and the outlined ellipse in the close.
2. **Circles as apertures** — plates seen through circles: the colossus, the orb, the octagon disc.
3. **The red thread** — 1px red hairlines that physically run between bands and continue across seams (statement → mirror, the knock seam, the slats tick) as if one thread is passed through the whole page.
4. **Seam games** — paper and ink bands alternate, and forms cut across the seams: the knock's AAEN split by the boundary, the colossus circle crossing onto paper, the hero lens rim floating on the plate.
5. **Image-filled type** — text as a window cut into a plate, drifting slowly inside its letters.
6. **Scale play** — 11px labels against 300px letterforms; processions no larger than grains of rice against gods.
7. **Micro-marks** — seals, satellites, outline glyphs (核 / 詠 / 読), the halo-A mark.

## Motion

Entry: `rise` (1.1s) and `fade` (1.8s). Ambient: hero drift, view-timeline parallax (`paraA–D`), orbit (26s), lens pulse (20s), the cue line, fill drift inside image-filled type, and the ±14° dial. Everything is slow and continuous — paper drifting, never bouncing UI. All of it cancels under `prefers-reduced-motion`.

The whole page is printed: a fixed `grain.svg` overlay in multiply sits on top of everything, and blend modes (`difference`, `multiply`) keep marks legible over plates.

## Voice

English, lowercase studio, factual, unhurried. Sentence-case headlines with one italic turn; micro-lines in caps with `·`; the call to action is "send word", not "get in touch". No exclamation, no marketing voice. No geography — the site names no city or country.

## The run, top to close

1. **top** — winged-beams night; 天使 and the halo-A; `aaen` inside the octagon lens; SOFTWARE STUDIO; cue line; © MMXXVI.
2. **statement** — paper; "A software *studio*. / Tools that live on *your machine*."; clouds capsule floating top right; strap line; the red thread starts.
3. **mirror** — one wing, doubled and reflected; red hairline down the fold; vertical 天使; caption KERN · GALDR — OPEN SOURCE DESKTOP TOOLS.
4. **shapes** — text flows around two circles (orb with ink ring; octagon disc with red ring); "Open source, and offline by default."
5. **knock** — seam at the middle; AAEN image-filled above, outline below; double ellipse; "One studio, three works — designed, built and shipped in-house."
6. **slats** — the cross of light seen through a slat mask; 光; a short red tick at the base.
7. **lens** — FEATURED WORK; the colossus circle with its red hairline, orbiting satellite and askew sash KERN — OPEN SOURCE SERVER MANAGER.
8. **glyph** — 使者 filled with the procession plate; caption KERN · GALDR · YOMION.
9. **works** — "Three works, *shipped and kept*."; the orbit registry: ticks, satellite, red spokes, outline glyphs, image-filled names kern / galdr / yomion, ink disc at the centre.
10. **word** — cable-descent darkness; "send word" and ELLIOT@AAENZ.NO; the red seal 使者.
11. **close** — the bar: AAEN STUDIOS · © MMXXVI + nav.

## Do / Don't

Do:

- Keep every plate monochrome; let it bleed; let it be the loudest thing on screen.
- Frame plates with hairlines, circles, lenses; anchor one micro-caption at an edge.
- Ration red to stamps, threads and single words.
- Keep figures faceless, scale play extreme, type quiet.
- Keep the grain, the paper, the slow motion.

Don't:

- No colour imagery, no saturated fills, no other reds.
- No Evangelion characters, faces, or copied designs — language only.
- No borders or frames around plates, no rounded cards, no drop shadows, no gloss.
- No new display fonts, no bold display, no red body text.
- No paraphrase of the style spine when generating plates — it lives in `prompts.md`.
- No new motifs outside the family (wings, light, orbits, seals, processions, clouds, monoliths, cables).

## Extending

- **New plate** — add a block to `prompts.md`, reuse the spine word for word, keep the aspect discipline, generate a whole batch in one sitting.
- **New section** — alternate paper/ink, give the plate a frame device (lens, circle, full bleed), one micro-caption, one red mark; if red must increase somewhere, take it from somewhere else.
- **Anything else (product UI, docs, decks)** — same four fonts, same palette, plates as imagery, micro-type as chrome. The language is the company; the site is its first proof.

## Provenance

- Captures: seven, 14 Sep 2026, `Pictures\Screenshots\Screenshot 2026-09-14 1627*.png`.
- Plates: `public/assets/`. Tokens and motion: `app/globals.css`. Composition: `app/page.tsx`. Generation: `prompts.md`.
