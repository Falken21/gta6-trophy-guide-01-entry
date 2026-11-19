# GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Falken21/gta6-trophy-guide-01-entry-2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Falken21/gta6-trophy-guide-01-entry-2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze) — built for the make.fun bounty "Build the best GTA 6 trophy guide".

## What it does

- **Checklist tracker** — tick trophies off as you earn them; progress is saved in your browser (localStorage) and can be exported to a JSON file and imported back.
- **Guides in our own words** — every trophy has a guide, short steps and named sources (PSNProfiles, Exophase, PowerPyx). Official names, descriptions and grades are shown exactly as PlayStation publishes them.
- **Roadmap to the platinum** — six stages in order: story, missable moments, stranger strands, collectibles, activities, then the platinum.
- **Missable flags** — 8 trophies that can only be earned at one-time story moments are flagged in the list, the detail panel and the roadmap.
- **Filters and search** — by kind (story, missable, collectibles, activities, online), by grade, by earned status, plus free-text search.
- **Spoiler mode** — hides the names and descriptions of story trophies until you earn them.
- **Progress bar** — overall percentage plus earned counts per grade.

## How to use it

The app is plain static files under `app/` — no build step, no network at run time.

```sh
node serve.ts
```

Then open <http://localhost:8080> in desktop Chrome. Or serve `app/` with any static file server and open `index.html`.

## Screenshots

Four real renders of the app in desktop Chrome (1280×800):

1. `1-checklist-guide.jpg` — tracker with the Cunning Stunts guide open beside the checklist.
2. `2-roadmap.jpg` — the six-stage roadmap to the platinum with missable flags.
3. `3-spoiler-missable.jpg` — spoiler mode on with the missable filter active.
4. `4-missable-detail.jpg` — the missable trophy Actions Speak Louder with its guide, steps and sources.

## Files

- `app/index.html` — the guide page (tracker + roadmap tabs).
- `app/style.css` — the neon-night look.
- `app/trophy-tracker.js` — checklist, filters, spoiler mode, detail panel, export/import.
- `app/trophy-progress.js` — progress math and the progress bar.
- `app/trophy-roadmap.js` — roadmap stage rendering.
- `app/data/trophies.json` — the 55 trophies with official names, descriptions, grades, guides, steps and sources.
- `app/data/roadmap.json` — the six-stage platinum roadmap.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.
- `screenshots/` — four real renders of the app in a browser.

Unofficial fan guide. Not affiliated with Rockstar Games. No game artwork or logos are used.
