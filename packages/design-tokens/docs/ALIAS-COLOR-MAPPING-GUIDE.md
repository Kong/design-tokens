# Color Alias Mapping Guide

How per-theme color alias palettes work in `@kong/design-tokens`, and how to add or maintain a theme.

## 1. Architecture

Every theme shares **one standardized set of color-alias names** (`color.alias.gray.30`,
`color.alias.blue.60`, …) and differs only in the **values** behind those names. A designer references
`color.alias.gray.30` consistently; the build resolves it from the palette of the theme being compiled.

Each theme lives in its own directory, `themes/<theme-name>/`, holding two co-located files: the
theme's token map and its color palette (named `<theme-name>.alias.color.json` so it corresponds
1:1 with its companion `<theme-name>.theme.json` — enforced by the naming guard in
`themes.spec.mjs`).

```
themes/
  _manifest.alias.color.json         ← CANONICAL key set. Color groups + step NAMES ONLY (no values, no
                                        descriptions). Enforces that every alias exists in every palette.
                                        Excluded from all builds. Not a per-theme palette, so it lives
                                        at the themes/ root, not inside a theme directory.
  classic-day/
    classic-day.theme.json
    classic-day.alias.color.json     ← default palette. The main semantic build (SCSS/JS/TS/CSS)
                                        resolves against THIS file.
  classic-night/
    classic-night.theme.json
    classic-night.alias.color.json   ← `classic-night` theme's palette. IDENTICAL values to
                                        classic-day — dark mode is a semantic override (see §7),
                                        not a different palette.
  konnect-day/
    konnect-day.theme.json
    konnect-day.alias.color.json     ← konnect-day (light) palette: standardized steps, day values.
  konnect-night/
    konnect-night.theme.json
    konnect-night.alias.color.json   ← konnect-night (dark) palette: standardized steps, night values.
```

- **Three tiers:** primitive alias palette → semantic tokens (`tokens/source/**`) → component tokens
  (`tokens/components/**`, names-only). Alias tokens are **never exported** as `--kui-*` (they resolve to
  literal values at build).
- **Standardized step set:** each family carries `05, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`
  (`05` is the single sub-10 light tint). Singletons `black`, `white`, `transparent` are direct-value
  leaves (no steps). The full set is **13 groups / 113 keys**, defined by
  `themes/_manifest.alias.color.json`.

## 2. Build wiring

- **Main build** (`config.mjs`) includes **only** `themes/classic-day/classic-day.alias.color.json`.
  classic-day is the source of truth for the default exported output. The other themes' palette
  files and the manifest are **not** included here (they would collide on shared step names).
- **Theme build** (`platforms/themes.mjs` → `aliasIncludesForTheme(name)`): each theme resolves
  against `themes/<name>/<name>.alias.color.json` only.
  - Alias-referencing theme with **no** matching palette file → **hard error** (no fallback).
  - `_manifest.alias.color.json` is never an include.

## 3. Palette value schema

Whether you hand-edit a palette or generate one, every palette obeys these conventions:

| convention | rule |
|---|---|
| family / step | family `gray`, step `05` … `100`; `electric_lime` uses an underscore |
| `$value` | uppercase 6-digit hex (`#FFFFFF`), or `transparent` for that singleton |
| `$description` | **always** `"Alias for <VALUE>."` — derived from the value, never hand-written (enforced by the `$description` guard, §4) |
| singletons | `black` / `white` / `transparent` are direct-value leaves (`$type: color`), not stepped |

## 4. Enforcement (what the guards check)

Everything is enforced by `themes.spec.mjs` (run by `pnpm test`) — no separate script, and no
comparison against any other theme's *content*:

- **Manifest drift** — every palette contains **exactly** the `_manifest.alias.color.json` leaf set
  (no missing, no extra). The manifest is names-only: it asserts existence; values are per-theme.
- **`$description` value-derived** — every alias `$description` reads `"Alias for <value>."`.
- **No off-source colors** — every color a compiled theme renders (including colors embedded in
  composite `box-shadow`/`rgba()` values) traces to a step in **that theme's** palette. The guard
  only pattern-matches literal `#hex` and numeric `rgb()`/`rgba()` — it does **not** parse
  `hsl()`/`hsla()`, CSS color keywords, or `color-mix()`, so an off-palette color expressed that way
  would pass silently. Prefer `{color.alias.*}` refs or literal hex/`rgba()` built from a real
  palette value so the guard can actually verify what you wrote.
- **Theme token sets** — exhaustive themes contain exactly `KUI_THEMEABLE_TOKENS` (a *generated
  registry*, not another theme file); semantic-only themes (`classic-day`/`classic-night`) contain
  every semantic token and **zero** component tokens.
- **Classification** — exhaustive is the *default*: every theme directory in `themes/` is exhaustive
  unless its name is listed in `SEMANTIC_ONLY_THEMES`. A guard confirms every `SEMANTIC_ONLY_THEMES`
  entry still exists on disk; there is no third bucket and no per-theme opt-in step.
- **Golden snapshots** — `classic-day` / `classic-night` resolved CSS plus the main build are frozen.

## 5. Maintaining themes & palettes

- **Recolor a theme** → edit the `$value` of the relevant step in
  `themes/<theme>/<theme>.alias.color.json` (and its `$description` to match); the change
  propagates to every token referencing that step. `pnpm build:tokens`. Note: several semantic
  tokens can share one step — to give two of them different colors you must re-point one token to
  a *different* step; editing the step's value moves them together.
- **Add a step or group** → add the leaf to `themes/_manifest.alias.color.json` **and** every
  palette (with each theme's value), or run `pnpm themes:sync` afterward to propagate a
  newly-added *token* (not a new alias step/group — sync doesn't invent palette colors);
  `pnpm build:tokens` (the drift + `$description` guards enforce completeness).
- **Composite tokens** (shadow / overlay) → compose with alias refs where possible
  (`0px 0px 0px 1px {color.alias.gray.20} inset`). A token that must stay raw `rgba()` (e.g.
  `kui-color-background-overlay`) keeps a base whose RGB equals a real palette value, so the off-source
  guard still passes.

Verify any change with `pnpm test` (the §4 guards + golden snapshots) and `pnpm lint`.

## 6. Adding a future theme

A new theme is **generated directly from the canonical token tree**, not copied from an existing
theme:

```sh
pnpm theme:scaffold <name>
```

This creates `themes/<name>/<name>.theme.json` (every semantic token seeded with its real default
`{color.alias.*}` mapping, every component token an empty slot) and
`themes/<name>/<name>.alias.color.json` (seeded from `classic-day`'s palette — the full
`_manifest.alias.color.json` key set, real neutral values, guard-correct `$description`s). The
result is exhaustive by construction; no classification step is needed unless the new theme should
be semantic-only instead, in which case remove its component-token entries and add its name to
`SEMANTIC_ONLY_THEMES` in `platforms/themes.mjs`.

1. Edit the palette (`<name>.alias.color.json`) to the theme's real brand colors — run
   `pnpm themes:unfilled <name>` to see which families are still unchanged from the seed.
2. Edit the theme file (`<name>.theme.json`) to fill in every empty component slot with a
   deliberate value (a component token's value is a real design decision — see
   `packages/skills/theme-creation/references/component-tokens.md` — it can't be defaulted from
   its semantic namesake).
3. `pnpm build:tokens` (the theme auto-discovers; an alias-using theme with no palette → hard
   error) and run the §4 guards + verification (§5).

See `packages/skills/theme-creation/SKILL.md` for the full guided flow, including matching a
specific visual reference.

## 7. `classic-day` + `classic-night` (light/dark of the default theme)

The Kongponents default look ships as **two** semantic-only themes that **share one palette** (identical
alias values — dark mode is a *semantic re-point*, not a different set of colors). This day/night
sharing is a convention this pair follows, not a structural requirement — nothing couples a "day"
and "night" theme name together; see §6.

- **`classic-day`** — the default. The main build (`config.mjs`) resolves the exported `:root`
  custom-properties against `themes/classic-day/classic-day.alias.color.json`, and
  `themes/classic-day/classic-day.theme.json` is the light theme.
- **`classic-night`** — the dark counterpart. `themes/classic-night/classic-night.alias.color.json`
  is an **exact copy** of classic-day's palette; `themes/classic-night/classic-night.theme.json` is
  a copy of classic-day's theme with ~20 `color-text` / `color-border` / `shadow-border` /
  `color-background` tokens **re-pointed to darker alias steps** (e.g. `color-text` →
  `{color.alias.white}`, `color-background` → `{color.alias.black}`, `color-border` →
  `{color.alias.gray.80}`). `color-background-overlay` stays raw `rgba()` like classic-day, with a
  darker base. Every override resolves to a step that already exists in the shared palette, so the
  **0-off-source-colors** invariant holds with no new palette values.

Both are listed in `SEMANTIC_ONLY_THEMES` in `platforms/themes.mjs` (every semantic token, **zero**
component tokens — components fall through to their semantic default), and both are frozen by
golden snapshots (`__snapshots__/themes/classic-{day,night}.css`).

**Maintaining the dark overrides:** edit `themes/classic-night/classic-night.theme.json` only —
change the `$value` of the relevant token to the desired `{color.alias.*}` step (keep the token's
`$description`, which documents its *purpose*, not its value). `pnpm test -u` re-freezes the
snapshot. To change a value for **both** day and night, edit the shared palette step in
`classic-day/classic-day.alias.color.json` **and** `classic-night/classic-night.alias.color.json`
(they must stay identical) — or, more often, edit the semantic token in `tokens/source/**`, which
flows to both (then `pnpm themes:sync` if the edit added a wholly new token rather than changing
an existing one's value).
