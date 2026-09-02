# MCOC Tier List

Build **Marvel Contest of Champions tier lists** in the browser: drag champions
into tiers, tag them with per-champion attributes, export the result as JSON or
a PNG.

Single-page React app, no backend, no account — every board lives in your
browser's localStorage. Deployed to GitHub Pages.

**→ https://sneaxiii.github.io/mcoc-tierlist/**

Champion artwork and star frames are loaded from `https://www.mawster.app/static/…`.

## Features

- 5 tiers by default, tier-maker style: rename, recolour, reorder, add and remove rows.
- Move champions by drag & drop (mouse, touch, keyboard) or by tapping one and picking a tier.
- Portraits use the in-game star frame — 6★ or 7★ per champion — and the ascension badge.
- Per-champion attributes that double as pool filters; `awk` carries a signature value shown as `x200`.
- Filters: search (name + alias, accent-insensitive), class, ascendable, 7★ availability, prefight.
- JSON import/export, and a 2–4× PNG capture of the board.
- Dark UI, responsive down to phone widths, English / French.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/mcoc-tierlist/
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build
```

## Champion data

`src/data/champions.json` is generated from a roster export and committed — the app never fetches a champion list at runtime, and champions
cannot be added from the UI.

```bash
node scripts/build-champions.mjs ~/roster-export/champions.json
```

Each entry needs `name`, `champion_class` and `image_url`; `alias`,
`is_ascendable`, `has_prefight` and `is_7_star` are used when present.

Everything the export does not carry lives in **`src/data/overrides.ts`**, the one
file to edit by hand:

| Constant             | Purpose                                                                             |
| -------------------- | ----------------------------------------------------------------------------------- |
| `HARD_BANNED_IDS`    | Non-playable champions (bosses, minions). Dropped from the app entirely.            |
| `NOT_SEVEN_STAR_IDS` | Champions with no 7★ version, i.e. the exceptions behind the `7★ available` filter. |

Both are keyed by champion id — the slug of the name (`Abomination (Immortal)` →
`abomination-immortal`). Ids are stable across regenerations, so a saved board
survives a data refresh.

> `NOT_SEVEN_STAR_IDS` ships empty: the current export has no 7-star column, so
> every champion is treated as 7★-available. Fill it in to make that filter
> meaningful.

## Attributes

Six tags the user sets, in `ATTRIBUTE_KEYS`:

| Key   | Badge  | Notes                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------- |
| `six` | none   | champion has no 7-star version — **decides which star frame the portrait uses** |
| `atk` | sword  |                                                                                 |
| `def` | shield | |
| `ga`  | flame  | alliance war                                                                    |
| `bg`  | helmet | battlegrounds                                                                   |
| `awk` | gem    | carries a number, rendered as `x200` on the badge                               |

Two of those never show up on a card the way they are stored:

- **`dual`** is derived, not tagged. A champion carrying both `atk` and `def`
  *is* a dual threat, so the two collapse into one sword + shield badge instead
  of printing both. It has no toggle and no filter — selecting ATK and DEF
  together already filters to exactly those champions. Boards saved while `dual`
  was still a tag have it folded back into `atk` + `def` on load.
- **`six`** draws no badge at all. The portrait is already in the 6★ frame,
  which is what tells a 6-star champion from a 7-star one; a badge saying the
  same thing again was noise. It stays a toggle and a filter.

Ascension is **not** a tag either: it comes from `isAscendable` in the roster
data and draws the in-game badge on the portrait by itself.

Badge, filter and icon-picker entry are all driven from `ATTRIBUTES` in
`src/lib/icons.tsx` — adding an attribute or swapping an icon is a change to that
one table.

### Icon mockup

The **Icons** button opens a picker showing every candidate icon per badge —
the five tags that draw one, plus `dual`. Each defaults to the in-game artwork
in `src/assets/icons/` (PNGs with their own colours, drawn on a dark disc ringed
in the attribute's colour); behind it sit the vector fallbacks — Heroicons plus
the hand-drawn ones Heroicons has no equivalent for, in
`src/components/custom-icons.tsx`. `six` is not listed: it draws no badge, so
there is nothing for a choice to change. The choice applies immediately and is
saved with the board, and another asset is one more entry in
`ATTRIBUTES[key].variants`, nothing else.

## Storage

| Key                    | Contents                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| `mcoc-tierlist:board`  | tiers, attributes, icon choices, title — this is what Export JSON writes    |
| `mcoc-tierlist:prefs`  | card size, name/badge visibility — per-browser, deliberately _not_ exported |
| `mcoc-tierlist:locale` | `en` / `fr`                                                                 |

Values saved under the pre-rename `mawster-tierlist:` prefix are migrated across
on first read, so an existing board survives the rename.

An imported file is normalised before it is applied: unknown champion ids
(renamed, or newly hard-banned) are dropped rather than left as cards that cannot
be moved.

## PNG export

The board is captured with [snapdom](https://github.com/zumerlab/snapdom) at 2–4×
so it stays readable when zoomed. The portraits are cross-origin, so this only
works if `www.mawster.app` answers with `Access-Control-Allow-Origin`. The app
probes for that header once at startup: if it is missing, portraits are loaded
without CORS so the artwork still shows, and the PNG export reports why it cannot
run.

## Deployment

`.github/workflows/pages.yaml` builds and publishes to GitHub Pages on every push
to `main`. `VITE_BASE` is set from the repository name, so the site is served at
`https://<owner>.github.io/<repo>/`. For a custom domain, set `VITE_BASE=/` and
add a `public/CNAME`.

Pages must be enabled once, in **Settings → Pages → Source: GitHub Actions**.

## Licence

AGPL-3.0-or-later.
