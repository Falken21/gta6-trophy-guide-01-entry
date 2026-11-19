# GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Falken21/gta6-trophy-guide-01-entry-2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Falken21/gta6-trophy-guide-01-entry-2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade as PlayStation publishes them, a guide in our own words with named sources beside each one, a five-stage roadmap to the platinum with every missable trophy flagged, and a checklist that saves progress in the browser.

## What it does

- **Checklist of all 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze — with official names, descriptions and grades.
- **Guides with sources** — each trophy has a guide in our own words, short steps, and the names of the guides it draws on (PSNProfiles, Exophase, PowerPyx, TrueTrophies).
- **Roadmap to the platinum** — five stages in play order: story first with the five missable moments banked, then stranger strands, then the collectibles sweep, then the activity grinds, then cleanup and the platinum.
- **Missable flags** — five trophies are flagged missable (Baited My Tackle, Catch Me If You Can, Personal Best, Actions Speak Louder, The Truth Is Out There) and called out in the roadmap.
- **Tracker** — tick trophies off; progress is saved in localStorage, exportable to a JSON file and importable back.
- **Filters and search** — filter by kind (story, missable, collectibles, activities, online), by grade, or search by name or guide text.
- **Spoiler mode** — hides the names and descriptions of story trophies until you earn them.
- **Fully offline** — plain static files under `app/`; no build step, no network requests at run time.

## How to use it

Serve `app/` with any static file server and open `index.html`:

```sh
node serve.ts
# then open http://localhost:8080
```

Tick a trophy's checkbox when it pops. Use **Export progress** to download a JSON copy of your progress and **Import progress** to restore it in another browser. Turn on **Spoiler mode** before you start the story to hide story trophy names and descriptions until you earn them.

## Files

- `app/index.html` — the page
- `app/style.css` — the neon-night look
- `app/trophy-app.js` — entry point: loads data and wires the controls
- `app/trophy-data.js` — loads `app/data/trophies.json` and `app/data/roadmap.json`
- `app/trophy-store.js` — localStorage progress, export and import
- `app/trophy-filters.js` — kind/grade/search filtering and spoiler masking
- `app/trophy-render.js` — checklist, detail panel, roadmap and progress bar
- `app/data/trophies.json` — the 55 trophies with guides, steps and sources
- `app/data/roadmap.json` — the five-stage platinum roadmap
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` and writes `dossier.json`
