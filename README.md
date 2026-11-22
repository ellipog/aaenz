<p align="center">
  <a href="https://aaenz.no">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/assets/logo-mark-light.png">
      <img src="public/assets/logo-mark.png" alt="aaen studios" width="96">
    </picture>
  </a>
</p>

<h1 align="center">aaenz.no</h1>

<p align="center">
  The website of Aaen Studios. Every picture on it is drawn live in Japanese characters on a canvas.
</p>

<p align="center">
  <a href="https://calxlang.com">算 CALX</a> 〜
  <a href="https://calcitemc.com">晶 CALCITE</a> 〜
  <a href="https://loom.rip">織 LOOM</a> 〜
  <a href="https://aaenz.no/minecraft">星 STELLAR</a>
</p>

<p align="center">
  <a href="https://aaenz.no">
    <img src="https://aaenz.no/opengraph-image" alt="The share card: the site's footer caught still, two colossi drawn in kanji over a red sea, and the wordmark aaen written on white sand">
  </a>
</p>

## The plates

Each picture is a plate: a grid with one character in each cell, and each character means what it draws. Stone is 石, light is 光 and a word is 言. A red 人 is the figure in the scene. Lines are drawn with ー ｜ ノ ヽ, and anything that flows with 〜 and ︴.

[`engine.ts`](components/ascii/engine.ts) cuts the glyphs into an atlas once and draws each plate in a single WebGL2 call. Where WebGL2 isn't available, it stamps the glyphs onto a 2D canvas instead. Each plate is a small program in [`programs.ts`](components/ascii/programs.ts) that writes a glyph, an alpha and an ink into every cell on every frame. Plates pause when they're off screen, and with reduced motion each one shows a single still frame.

| Plate | Drawn with | Where | What it shows |
|---|---|---|---|
| `hero` | 光 翼 羽 天 | home | the word aaen cut out of wings of light |
| `octagon` | 壁 人 | home | ripple rings around one red figure |
| `spindle` | 式 算 解 | home, Calx | work dealt across the lanes of a `parallel for` and joined back, giving the same answer at every thread count |
| `frontier` | 砂 草 森 山 人 | home, Calcite | a world built chunk by chunk as players fly over it |
| `rays` | 目 田 口 光 | home | a cross of light over a city |
| `world` | 草 土 石 鉄 人 | home, /minecraft | a block world where a red 人 plans, mines, builds a house and sleeps |
| `weave` | 使 読 書 消 | home, loom | agents weaving a record of what they did, while a risky action waits in red |
| `vortex` | 核 機 | home, kern | a fleet of server instances orbiting one core |
| `river` | 音 映 詠 唱 | home, galdr | raw media passing through an incantation and running out as even waves |
| `orb` | 読 語 字 | home, yomion | a turning globe of kanji ringed with kana |
| `stream` | 言 語 人 | home | words streaming from a red figure on a current |
| `stars` | 星 | /minecraft | Stellar as a constellation |
| `strata` | 草 基 土 盤 | /minecraft | Armature as a layer between the mods and the loaders |
| `quests` | 章 任 条 報 | /minecraft | Tenet's quest graph |
| `clouds` | 雲 人 | /minecraft | causeways and processions over a sea of cloud |
| `shore` | 星 骨 身 肉 | every footer | the shore after everything, which the page ends on |
| `kanji` | 無 空 虚 | 404 | 無 drawn in 無, 空 and 虚 |
| `current` | 〜 ︴ | every page | faint wave strokes carried along by the scroll |

The cursor and the scrollbar are drawn in characters too. The cursor is a red ■ whose four corners lock onto the nearest link. The scrollbar is a column of ︴ down the right edge, with the part in view inked red.

## Pages

- [`/`](https://aaenz.no): the studio and its work. Calx, Calcite, loom and Stellar each get a band, and kern, galdr and yomion share one.
- [`/minecraft`](https://aaenz.no/minecraft): the Stellar suite, with a band for each mod listed in `lib/mods.ts`.
- A 404 page.

The share cards are drawn when the site builds, from the same characters as the plates.

<p align="center">
  <a href="https://aaenz.no/minecraft">
    <img src="https://aaenz.no/minecraft/opengraph-image" alt="The Minecraft share card: The load-bearing parts. over a block world drawn in kanji" width="600">
  </a>
</p>

## Running it

```sh
bun install
bun run dev
```

The site is then at http://localhost:3000. For a production build, run `bun run build` and then `bun run start`.

## Environment

These go in `.env.local`. The site runs without any of them.

| Variable | What it's for |
|---|---|
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | The contact form sends mail through Resend. Without these, the form tells visitors to email directly. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | The email address shown on the page. Defaults to elliot@aaenz.no. |
| `CURSEFORGE_API_KEY` | The live download count adds Modrinth and CurseForge. Without a key, the CurseForge number comes from a public mirror of its API. |

## Layout

| Folder | What's in it |
|---|---|
| [`app/`](app/) | The pages, share cards, sitemap and robots, plus two API routes: `api/contact` and `api/downloads` |
| [`components/ascii/`](components/ascii/) | The plate engine, the plates (with the block world in `world.ts`), and `<Plate>`, which pages use to place them |
| [`components/`](components/) | Everything else on screen: header, footer, cursor, scroll rail, contact form |
| [`lib/`](lib/) | The Stellar mods (`mods.ts`) and the parts the share cards share (`og.tsx`) |
| [`public/assets/`](public/assets/) | The logo, and the ink images the plates are based on. [`prompts.md`](prompts.md) has the prompts that made them |
| [`docs/`](docs/) | Design specs and research notes |

## Design

[STYLE.md](STYLE.md) describes how the site looks: the colours, the type, every plate in full, and the rules for adding to it. Read it before changing anything visual.

## Deploying

A push to `master` deploys aaenz.no.

<p align="center"><sub>AAEN STUDIOS ・ © MMXXVI</sub></p>
