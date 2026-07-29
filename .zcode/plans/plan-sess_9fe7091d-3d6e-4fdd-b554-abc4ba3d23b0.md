## Fiks: Gjør melding valgfri i wizarden

Rotårsaken er en inkonsistens mellom klient og server: wizarden behandler `message` som valgfritt (ingen `*`, ingen klientvalidering), men schemaet krever det. Når brukeren ikke skriver ≥10 tegn, sendes `undefined` og serveren avviser med `"Required"`.

### Endringer (2 filer, 2 linjer)

**1. `lib/schemas.ts:31` — gjør `message` valgfri**
```ts
// Før:
message: z.string().min(10).max(2000),
// Etter:
message: z.string().max(2000).optional().or(z.literal("")),
```
Fjerner min-kravet og gjør feltet valgfritt (aksepterer `undefined`, `""`, eller tekst opp til 2000 tegn). 
- Kontaktskjemaet fungerer uendret — det har fortsatt `required`+`minLength={10}` i HTML (`ContactForm.tsx:154-157`), så det håndheves klientside.
- E-posten er aldri tom selv uten melding: route.ts:71 legger alltid til navn + e-post som header, pluss all kontekst fra wizard-stegene (bedrift, sider, tidslinje, pakke).

**2. `components/wizard/Wizard.tsx:86` — alltid send en streng, aldri `undefined`**
```ts
// Før:
message: data.message.trim().length >= 10 ? data.message : undefined,
// Etter:
message: data.message.trim(),
```
Fjerner den skjulte fellen som droppet feltet. Nå sendes alltid en (kanskje tom) streng — ingen overraskelser i payloaden.

### Hvorfor dette gjør at "alt alltid virker"
- Wizard-innsending lykkes uansett hva brukeren fyller i meldingsfeltet (tom, kort, eller lang).
- Kontaktskjemaet upåvirket (klientvalidering bevart, server mer tillatende = ingen regresjon).
- E-postene forblir meningsfulle — Resend får alltid `from`/`to`/`subject`/`text`/`html`, og teksten har alltid navn + e-post + eventuell wizard-kontekst.
- Ingen nye avhengigheter, ingen refactor — ren rotårsaksfiks.

### Verifisering etter implementering
- `npm run lint` / `npm run build` (eller `tsc --noEmit`) for å bekrefte at schema-typene fortsatt kompilerer.
- Manuelt: send wizard med tom melding → forvent suksess; send med kort melding ("Hei") → forvent suksess; send kontaktskjema med tom melding → forvent klient-side blokk (uendret).