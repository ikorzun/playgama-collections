# Playgama Collections

**Live: https://ikorzun.github.io/playgama-collections/**

A responsive React + TypeScript implementation of the two supplied Playgama Figma frames, styled with plain CSS.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Resize to **1200 px** for the desktop design or **390 px** for the mobile design.

```sh
npm run build       # Type-check and build into dist/
npm run preview     # Preview the production build
```

## Designs

- [Desktop — Collection-1200](https://www.figma.com/design/kVtopvWnkIPIrgIOaFE3WE/Portal?node-id=9093-42974)
- [Mobile — Collection-390](https://www.figma.com/design/kVtopvWnkIPIrgIOaFE3WE/Portal?node-id=9080-32879)

Both frames are the same collection page, so one responsive page implements them:

| | 1200 frame | 390 frame |
| --- | --- | --- |
| Ranking | two columns, ranks 1–10 and 11–20 running down each; 72 px covers, badge above the title | one column, 64 px covers, 28 px badge to the left, category under the title |
| Game card | cover first with the rank overlaid on it, then the 56 px icon beside the title | the rank sits on the icon's corner and a likes pill closes the row, then the cover |
| Card facts | `PC, Android, iOS / September 2026` on one line, series below | `Platform:` / `Last Update:` / `Series:` on labelled rows |

Cover art is masked with a **superellipse**, the shape Playgama uses throughout — `|2x-1|^5 + |2y-1|^5 = 1`, the same curve as the frames' `Superellipse (n=5)` layers. `src/squircle.ts` samples it into an SVG clip path in `objectBoundingBox` units, so one path stretches to any cover box; `border-radius` cannot draw this shape. Square catalogue icons are a different shape — a smoothed rounded corner, not a full superellipse — so they keep a radius and add `corner-shape: squircle` where the browser supports it.

Hairline dividers bracket the ranking, as in the 1200 frame, and one more sits above the categories block — the frames do not draw that third one, it was added for consistency between sections. The 390 frame has no dividers, so neither does the mobile layout.

Two more deliberate departures from the frames: the desktop introduction is set at 18 px where node `9094:45174` still reads 16 px, and each ranking row centres its badge and title against the cover rather than hanging them from its top edge.

Every rank in the list carries the same outlined badge; the gold is reserved for first place on the game card. The mobile reference's iOS status bar and Safari controls are browser chrome and are intentionally excluded from the webpage.

The ranking is capped at 800 px and runs two columns down to 768 px, then one column below that. Its rows are exactly as tall as the 80 px cover: the badge and the title are centred against it and never extend past its top or bottom edge, which is what caps the title at two 20 px lines. The frames' placeholder "Game name" never needed a second line; real catalogue titles occasionally do, and a browser check asserts nothing overflows the cover.

The 1200 frame draws three cards and then a second, empty `GAMES` placeholder frame; the placeholder stands for the rest of the list, so every game in the collection is rendered as a card.

## Previews and the in-view state

Each card shows the game's catalogue preview clip instead of a still. A card observes its own
visibility: the clip's `src` is only set once the card has been reached, it plays while the card is on
screen and pauses when it leaves, and `prefers-reduced-motion` suppresses playback altogether. Nothing
is requested until you scroll — loading the page fetches no clips at all. The cover artwork is the
`poster`, so a card that has not been reached, or whose clip fails, still shows the artwork.

The rank badge lights up over the same signal: `#f3eaff` on `#0d0d0f` while its card is on screen.
First place is the exception and keeps its gold in every state. That badge only exists on the cover, so
the highlight is a 1200 behaviour — the 390 heading carries the rank on the icon's corner, which
`9088:41714` keeps plain white. Hovering a ranking row turns that row's
badge white on black — that one does apply to first place too.

## Content

Page content comes from the Playgama catalogue in `src/games.json` — 20 real games retrieved on 8 September 2026, with their titles, categories, platforms, update dates, related series, tag counts, and descriptions. Their artwork is committed under `public/games`, so rendering does not depend on expiring URLs.

Each card credits its developer and shows the catalogue's rating. Playgama has no developer pages — the
game page prints the name as plain text — so the credit links to a Playgama search for that developer,
which does return their games. The stars are `ratingValue` out of 5 and the count beside them is
`ratingCount`, the same number the likes pill abbreviates.

All 20 games appear both in the ranking and as full cards below it. Each has a 256 px square icon and a 1200 px wide 16:9 cover in `public/games`, downscaled from the catalogue originals and saved as JPEG — the sources are 1920×1080 PNGs and would otherwise weigh 55 MB. Each also has its preview clip in `public/games/video` (14 MB for the twenty). The `sourceImage`, `sourceCover`, and `sourceVideo` fields in `games.json` keep the original URLs, so the media can be re-fetched. To swap in a different collection, replace `src/games.json` and the matching files in `public/games`.

The page heading, introduction, and the collection and "Free Online Games at Playgama" copy are the frames' own text and live in `src/data.ts`.

## Components

- `src/App.tsx` composes the collection page.
- `src/components.tsx` contains navigation, ranking, game cards, categories, footer, and search.
- `src/data.ts` types the catalogue and holds the page copy and link tables.
- `src/styles.css` defines design tokens and responsive styles.
- `src/assets.json` and `src/category-icons.json` map the Figma asset exports in `public/assets`.

Search filters the collection locally by title, with an empty state, keyboard focus handling, and Escape dismissal. Play, account, and category actions link to Playgama; authentication and game hosting are handled there.

## Browser checks

```sh
npx playwright install chromium
npm run test:e2e
```

The checks cover widths of 320, 390, 768, 1200, and 1600 px; ranking column order; the three cards; horizontal overflow; image loading; search and empty states; focus restoration; and link destinations. Full-page screenshots are written to `test-results/` for the two Figma widths.

An existing Chromium installation can be used by setting `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path.

## Deployment

Pushing to `main` builds the site and publishes it to GitHub Pages via `.github/workflows/pages.yml`.

Pages serves a project repo from a sub-path, so the build sets `base` to `/playgama-collections/`.
Vite rewrites the asset URLs it processes itself, but the ones that live in `assets.json`,
`category-icons.json`, and `games.json` are plain strings it never sees — `withBase` in `src/data.ts`
prefixes those at runtime. `npm run preview` uses the same base as the build, so it matches what Pages
serves; the dev server and the browser checks stay at the root.
