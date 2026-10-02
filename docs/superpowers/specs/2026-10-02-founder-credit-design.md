# Founder credit in the close bar

*Design note, 2026-10-02. Follows the voice and micro-type rules in `STYLE.md`.*

## Summary

The site never names its founder on-page. Add one credit line to the close bar (`app/page.tsx`): `ELLIOT STRAND AAEN — FOUNDER & LEAD ENGINEER` in mono micro-type, in the nav-link tone `#cfcbc2`, stacked under `AAEN STUDIOS · © MMXXVI` (`#8f8b82`) in the footer's left column.

## Why the colophon

The close bar is the site's credits slot (STYLE.md band 12) — factual micro-type at the edge, which is exactly what a founder credit is. A dedicated band was rejected: one line of information cannot fill a band, and the new-section rules (plate, frame device, one red mark) would outweigh the content. The send-word band was rejected to keep its "send word" composition to a single caption.

## Non-goals

No new band, no bio, no plate, no header-nav change, no structured data, no link on the name (a link can be added later).

## Verification

`npm run build`; visual check of the close bar at desktop and mobile widths — two-line left column, nav alignment, wrap behaviour.
