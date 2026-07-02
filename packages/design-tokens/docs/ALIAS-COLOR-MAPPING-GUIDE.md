# Color Alias Mapping Guide

How per-theme color alias palettes work in `@kong/design-tokens`, and how to add or maintain a theme.
Companion to [`COMPONENT-TOKENS-GUIDE.md`](./COMPONENT-TOKENS-GUIDE.md).

## 1. Architecture

Every theme shares **one standardized set of color-alias names** (`color.alias.gray.30`,
`color.alias.blue.60`, …) and differs only in the **values** behind those names. A designer references
`color.alias.gray.30` consistently; the build resolves it from the palette of the theme being compiled.

```
tokens/alias/color/
  _manifest.json      ← CANONICAL key set. Color groups + step NAMES ONLY (no values, no descriptions).
                        Enforces that every alias exists in every palette. Excluded from all builds.
  classic-day.json    ← default palette. The main semantic build (SCSS/JS/TS/CSS) resolves against
                        THIS file. Also the `classic-day` theme's palette.
  classic-night.json  ← `classic-night` theme's palette. IDENTICAL values to classic-day — dark mode is
                        a semantic override (see §7), not a different palette.
  konnect-day.json    ← konnect-day (light) palette: standardized steps, day values.
  konnect-night.json  ← konnect-night (dark) palette: standardized steps, night values.
```

- **Three tiers:** primitive alias palette → semantic tokens (`tokens/source/**`) → component tokens
  (`tokens/components/**`, names-only). Alias tokens are **never exported** as `--kui-*` (they resolve to
  literal values at build).
- **Standardized step set:** each family carries `05, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`
  (`05` is the single sub-10 light tint). Singletons `black`, `white`, `transparent` are direct-value
  leaves (no steps). The full set is **13 groups / 113 keys**, defined by `_manifest.json`.

## 2. Build wiring

- **Main build** (`config.mjs`) includes **only** `tokens/alias/color/classic-day.json`. classic-day is
  the source of truth for the default exported output. The other palette files and `_manifest.json` live
  in the same directory but are **not** included here (they would collide on shared step names).
- **Theme build** (`platforms/themes.mjs` → `aliasIncludesForTheme(name)`): each theme resolves
  against `tokens/alias/color/<name>.json` only.
  - Alias-referencing theme with **no** matching palette file → **hard error** (no fallback).
  - `_manifest.json` is never an include.

## 3. Palette value schema

Whether you hand-edit a palette or generate one, every palette obeys these conventions:

| convention | rule |
|---|---|
| family / step | family `gray`, step `05` … `100`; `electric_lime` uses an underscore |
| `$value` | uppercase 6-digit hex (`#FFFFFF`), or `transparent` for that singleton |
| `$description` | **always** `"Alias for <VALUE>."` — derived from the value, never hand-written (enforced by the `$description` guard, §4) |
| singletons | `black` / `white` / `transparent` are direct-value leaves (`$type: color`), not stepped |

## 4. Enforcement (what the guards check)

Everything is enforced by `themes.spec.mjs` (run by `pnpm test`) — no separate script:

- **Manifest drift** — every palette contains **exactly** the `_manifest.json` leaf set (no missing, no
  extra). The manifest is names-only: it asserts existence; values are per-theme.
- **`$description` value-derived** — every alias `$description` reads `"Alias for <value>."`.
- **No off-source colors** — every color a compiled theme renders (including colors embedded in composite
  `box-shadow` / `rgba()` / `color-mix()` values) traces to a step in **that theme's** palette.
- **Theme token sets** — exhaustive themes (`konnect-day`/`konnect-night`) contain exactly
  `KUI_THEMEABLE_TOKENS`; semantic-only themes (`classic-day`/`classic-night`) contain every semantic
  token and **zero** component tokens.
- **Classification** — every `themes/*.theme.json` is classified exactly once (`EXHAUSTIVE_THEMES` /
  `SEMANTIC_ONLY_THEMES` / `UNCHECKED_THEMES`).
- **Golden snapshots** — `classic-day` / `classic-night` resolved CSS plus the main build are frozen.

## 5. Maintaining themes & palettes

- **Recolor a theme** → edit the `$value` of the relevant step in `tokens/alias/color/<theme>.json` (and
  its `$description` to match); the change propagates to every token referencing that step.
  `pnpm build:tokens`. Note: several semantic tokens can share one step — to give two of them different
  colors you must re-point one token to a *different* step; editing the step's value moves them together.
- **Add a step or group** → add the leaf to `_manifest.json` **and** every palette (with each theme's
  value); `pnpm build:tokens` (the drift + `$description` guards enforce completeness).
- **Composite tokens** (shadow / overlay) → compose with alias refs where possible
  (`0px 0px 0px 1px {color.alias.gray.20} inset`). A token that must stay raw `rgba()` (e.g.
  `kui-color-background-overlay`) keeps a base whose RGB equals a real palette value, so the off-source
  guard still passes.

Verify any change with `pnpm test` (the §4 guards + golden snapshots) and `pnpm lint`.

## 6. Adding a future theme

1. Create `tokens/alias/color/<theme>.json` with the full `_manifest.json` key set — copy an existing
   palette and override the values (the drift guard fails the build on any missing/extra key; the
   `$description` guard requires each to read `"Alias for <value>."`).
2. Author `themes/<theme>.theme.json` referencing only standardized steps — copy an existing theme of the same
   class (exhaustive vs semantic-only) and re-point what differs. The `.theme.json` suffix is **required**
   (the build and the naming guard in `themes.spec.mjs` fail on any other name).
3. Classify the theme in `themes.spec.mjs` (`EXHAUSTIVE_THEMES` / `SEMANTIC_ONLY_THEMES` /
   `UNCHECKED_THEMES`), or the classification guard fails.
4. `pnpm build:tokens` (the theme auto-discovers; an alias-using theme with no palette → hard error) and
   run the §4 guards + verification (§5).

## 7. `classic-day` + `classic-night` (light/dark of the default theme)

The Kongponents default look ships as **two** semantic-only themes that **share one palette** (identical
alias values — dark mode is a *semantic re-point*, not a different set of colors):

- **`classic-day`** — the default. The main build (`config.mjs`) resolves the exported `:root`
  custom-properties against `tokens/alias/color/classic-day.json`, and `themes/classic-day.theme.json` is the
  light theme.
- **`classic-night`** — the dark counterpart. `tokens/alias/color/classic-night.json` is an **exact copy**
  of classic-day's palette; `themes/classic-night.theme.json` is a copy of classic-day's theme with ~20
  `color-text` / `color-border` / `shadow-border` / `color-background` tokens **re-pointed to darker
  alias steps** (e.g. `color-text` → `{color.alias.white}`, `color-background` → `{color.alias.black}`,
  `color-border` → `{color.alias.gray.80}`). `color-background-overlay` stays raw `rgba()` like
  classic-day, with a darker base. Every override resolves to a step that already exists in the shared
  palette, so the **0-off-source-colors** invariant holds with no new palette values.

Both are `SEMANTIC_ONLY_THEMES` in `themes.spec.mjs` (every semantic token, **zero** component tokens —
components fall through to their semantic default), both are frozen by golden snapshots
(`__snapshots__/themes/classic-{day,night}.css`), and both are cross-checked by the classification guard.

**Maintaining the dark overrides:** edit `themes/classic-night.theme.json` only — change the `$value` of the
relevant token to the desired `{color.alias.*}` step (keep the token's `$description`, which documents its
*purpose*, not its value). `pnpm test -u` re-freezes the snapshot. To change a value for **both** day and
night, edit the shared palette step in `classic-day.json` **and** `classic-night.json` (they must stay
identical) — or, more often, edit the semantic token in `tokens/source/**`, which flows to both.
