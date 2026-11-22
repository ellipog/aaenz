# aaenz.no

The website of Aaen Studios, at [aaenz.no](https://aaenz.no). It's a Next.js site, and every picture on it is drawn in Japanese characters on a canvas.

## Pages

- `/`: the studio and its work. Calx, Calcite, loom and Stellar each get a band, and kern, galdr and yomion share one.
- `/minecraft`: the Stellar suite, with a band for each mod listed in `lib/mods.ts`.
- A 404 page.

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
| [`app/`](app/) | The pages, share images, sitemap and robots, plus two API routes: `api/contact` and `api/downloads` |
| [`components/ascii/`](components/ascii/) | The plate engine (`engine.ts`), the plates (`programs.ts`, and `world.ts` for the block world), and `<Plate>`, which pages use to place them |
| [`components/`](components/) | Everything else on screen: header, footer, cursor, scroll rail, contact form |
| [`lib/`](lib/) | The Stellar mods (`mods.ts`) and what the share cards share (`og.tsx`) |
| [`public/assets/`](public/assets/) | The source images the plates are based on. [`prompts.md`](prompts.md) has the prompts that made them |
| [`docs/`](docs/) | Design specs and research notes |

## Design

[STYLE.md](STYLE.md) describes how the site looks: the colours, the type, every plate, and the rules for adding to it. Read it before changing anything visual.

## Deploying

A push to `master` deploys aaenz.no.
