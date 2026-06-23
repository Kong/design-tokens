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
  classic-day.json    ← default palette. The main semantic build (SCSS/JS/TS/CSS/LESS) resolves against
                        THIS file. Also the `classic-day` theme's palette.
  classic-night.json  ← `classic-night` theme's palette. IDENTICAL values to classic-day — dark mode is
                        a semantic override (see §10), not a different palette.
  konnect-day.json    ← konnect-day (light) palette: standardized steps, day values.
  konnect-night.json  ← konnect-night (dark) palette: standardized steps, night values.
```

- **Three tiers stay as before:** primitive alias palette → semantic tokens (`tokens/source/**`) →
  component tokens (`tokens/components/**`, names-only). Alias tokens are **never exported** as
  `--kui-*` (resolved to literal values at build).
- **Standardized step set:** each family carries `05, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`
  (`05` is the single sub-10 light tint). Singletons `black`, `white`, `transparent` are direct-value
  leaves (no steps). The full set is **13 groups / 113 keys**, defined by `_manifest.json`.
- **`index.json` is gone.** It was a superset palette with chaotic intermediate steps
  (`gray.73`, `gray.103`, `blue.13`, …) shared by all themes — replaced by per-theme palettes on a
  clean 10-based scale.

## 2. Build wiring

- **Main build** (`config.mjs`) includes **only** `tokens/alias/color/classic-day.json`. classic-day is
  the source of truth for the default exported output. The other palette files and `_manifest.json` live
  in the same directory but are **not** included here (they would collide on shared step names).
- **Theme build** (`platforms/themes.mjs` → `aliasIncludesForTheme(name)`): each theme resolves
  against `tokens/alias/color/<name>.json` only.
  - Alias-referencing theme with **no** matching palette file → **hard error** (no fallback).
  - Alias-free theme (raw-hex `brand-a`/`brand-b`) → empty include, never errors.
  - `_manifest.json` is never an include.

## 3. Authoring values from figma (`_temp_source` → palette)

Designers hand off a figma variables export under `_temp_source/aliases-<theme>.json`. The importer
[`scripts/import-figma-aliases.mjs`](./scripts/import-figma-aliases.mjs) transforms it to our schema:

| figma | palette |
|---|---|
| top-level `Aliases` wrapper | `color.alias` |
| group `Gray`, leaf `gray-05` | family `gray`, step `05` |
| group `Electric lime`, leaf `electric-lime-60` | family `electric_lime` (underscore), step `60` |
| `$value.hex` (uppercase) | `$value` verbatim |
| `$description` (often stale/wrong) | **regenerated** as `"Alias for <VALUE>."` — never copied |
| standalone `black` / `white` | direct-value leaf (`$type: color`) |
| (figma has none) | `transparent` added as a net-new leaf (`"$value": "transparent"`) |

> ⚠️ figma `$description` is unreliable (e.g. `gray-05` hex `#F9FBF9` but description `#F9FAFB`).
> Descriptions are always generated from the value.

## 4. Re-pointing a theme to standardized steps

Existing themes referenced `index.json` intermediate steps (whole-value refs **and** refs embedded in
composite values such as `box-shadow: 0px 0px 0px 1px {color.alias.gray.17} inset`). The importer
re-points **every** ref — whole and embedded — by **value**:

1. Resolve the ref's pre-refactor value (from the recovered `index.json`).
2. If the theme's palette has a step with that exact value → rewrite the ref to it (value-preserving).
3. Otherwise the value is **off this theme's standardized palette** (a leftover from the old shared
   index), so it is **snapped to the nearest COLOR in the same family** (by RGB distance, not step
   number — minimizes how many distinct shades collapse). The token adopts that step's value.
4. **Composite tokens authored with a literal color** (not a `{color.alias.*}` ref) are re-pointed too,
   mirroring how `classic-day.json` composes them: `kui-shadow-border-disabled`/`kui-navigation-shadow-border-child`
   get the embedded hex replaced with the nearest gray/green alias; `kui-color-background-overlay` keeps
   its raw `rgba()` form (like classic-day) but its base is rewritten to the nearest source value.

Non-color values (px/font) are untouched. **Result: every color in `dist/themes/*` traces to its
theme's alias palette — 0 off-source colors in both themes.** (Verify with the off-source audit in §6.)

konnect-day re-pointed with **0 snaps** (its intermediate names were redundant aliases of standardized
values, e.g. `gray.17`→`gray.20`). konnect-night needed **124 snaps** (e.g. `gray.83`→`gray.80`,
`red.23`→`red.20`) because its design used ~12–15 distinct values in 5 families (blue/green/gray/red/
yellow) — more than the 11-step palette holds — so ~20 distinct shades necessarily collapse onto shared
steps (a deliberate trade to keep the scale at 11 steps; see §7). The designer then tunes the surviving
step values in `konnect-night.json` (e.g. the green/gray he flagged), which propagates to every
referencing token — but tokens that collapsed onto one step can only be re-separated by re-pointing one
to a different existing step.

## 5. Enforcement

Enforced entirely by the drift-guard tests in `themes.spec.mjs` (run by `pnpm test`):

- **Drift guard** (`themes.spec.mjs` → "alias palettes contain exactly the `_manifest.json` key set"):
  every palette must contain **exactly** the manifest's leaf set — no missing, no extra. Singletons
  (`[]` in the manifest) are required as direct-value leaves; non-empty arrays require each `family.step`.
- The manifest is **names-only** on purpose: it asserts existence, not values (values are per-theme).

## 6. Verification (the acceptance gate)

The compiled `dist/themes/<theme>.{css,mjs,d.ts}` values must be unchanged — we only change the
*source* of each value, never the resolved result.

```sh
pnpm build:tokens                 # ensure dist is fresh
cp -r dist dist-original          # snapshot BEFORE editing (gitignored)
# … make changes …
pnpm build:tokens                 # rebuild
diff -rq dist dist-original       # inspect
```
- **Main exports + `classic-day` theme + konnect-day** → values unchanged vs the pre-refactor build
  (`classic-day` is byte-identical to the former `classic` bar the theme name/selector + timestamp;
  konnect-day normalized color-equivalent, only `#FFF→#FFFFFF`).
- **`classic-night`** → **intentionally re-valued** for the ~20 dark-mode semantic overrides (see §10);
  all other tokens resolve to the same classic-day palette values.
- **konnect-night** → **intentionally re-valued** for the 124 snapped tokens (they now use the
  standardized night palette values instead of off-scale leftovers). Verified instead by: every night
  color resolves to a real night-palette step (build would fail otherwise), and the un-snapped 786
  tokens stay value-preserving.
- `pnpm test` green (incl. the drift guard). `pnpm lint` clean.

## 7. konnect-night standardization (done) + designer value tuning

konnect-night's design used **27 distinct values** (124 tokens) that are **off the standardized
figma-night palette** (leftovers from the old shared `index`, e.g. `#292B26` ×67 borders/disabled,
plus the vivid method/status/icon accents like `#00FABE`). Per the rule that every theme color must
resolve to that theme's alias file, these were **snapped to the nearest standardized step** (e.g.
`gray.83`→`gray.80`, `red.23`→`red.20`, `green.30` accents → the muted night `green.30`). Night is now
fully alias-referenced.

The figma-night **example output** (`_temp_source/output-konnect-night.css`) is approximate and still
carries some of the off-scale values, so snapped night diverges from it on ~60 props — expected. The
designer refines the actual colors by editing **step values in `konnect-night.json`** (e.g. the green
on badges/alerts and the dark gray he flagged), and the change propagates to every token referencing
that step. That is the steady-state value-tuning workflow — no token-by-token edits, no raw literals.

## 8. Adding a future theme

1. Drop the figma export at `_temp_source/aliases-<theme>.json`.
2. Recover the legacy palette if re-pointing an existing theme:
   `git show HEAD:packages/design-tokens/tokens/alias/color/index.json > /tmp/old-index.json`
   (only needed for the original index-based re-point; new themes authored fresh don't need it).
3. Generate the palette (transform §3). It must contain the full `_manifest.json` key set — copy an
   existing palette and override the values (the drift guard fails the build on any missing/extra key).
4. Author `themes/<theme>.json` referencing only standardized steps.
5. `pnpm build:tokens` (the theme auto-discovers; missing palette → hard error) and run the drift
   guard + verification (§5–6).

## 9. Script lifecycle (what's permanent vs throwaway)

| Script | Status | Notes |
|---|---|---|
| `scripts/import-figma-aliases.mjs` | **one-time migration — deletable after merge** | Re-points FROM the original index-based theme refs (recovered to `/tmp/old-index.json`), so it is NOT reproducibly re-runnable once `index.json` is gone. Only its `parseFigma`/`buildPalette`/`buildManifest` core is reusable; extract a small `figma-to-palette` helper if recurring figma imports are ever needed. |
| `scripts/alias-manifest.mjs` | **permanent** | Tolerant `manifestLeaves`/`paletteLeaves` used by the drift guard in `themes.spec.mjs`. |

> **`scripts/fill-themes.mjs` was deleted.** Theme completeness is enforced by the drift-guard test
> (§5), which names exactly which tokens are missing/extra and fails CI — no separate script needed.
> To add a token, add its entry to `themes/konnect-day.json` + `themes/konnect-night.json` by hand
> (and per `COMPONENT-TOKENS-GUIDE.md` Phase E for the per-theme value); run `pnpm test` until the
> drift guard is green.

**Steady-state for the three common tasks** (no migration script needed):
- *Change one alias value in a theme* → edit that `$value` in `tokens/alias/color/<theme>.json`, update its `$description` to match, `pnpm build:tokens`.
- *Add a step/group* → add the leaf to `_manifest.json` AND every palette (with each theme's value), `pnpm build:tokens` (drift guard + `$description` test enforce completeness).
- *Re-import figma for a theme* → regenerate just that palette from the figma export (the reusable transform), `pnpm build:tokens`, verify (§6).

## 10. `classic-day` + `classic-night` (light/dark of the default theme)

The Kongponents default look ships as **two** semantic-only themes that **share one palette** (identical
alias values — dark mode is a *semantic re-point*, not a different set of colors):

- **`classic-day`** — the default. The main build (`config.mjs`) resolves the exported `:root`
  custom-properties against `tokens/alias/color/classic-day.json`, and `themes/classic-day.json` is the
  light theme. This is the former `classic` theme, renamed 1:1 (byte-identical resolved values).
- **`classic-night`** — the dark counterpart. `tokens/alias/color/classic-night.json` is an **exact copy**
  of classic-day's palette; `themes/classic-night.json` is a copy of classic-day's theme with ~20
  `color-text` / `color-border` / `shadow-border` / `color-background` tokens **re-pointed to darker
  alias steps** (e.g. `color-text` → `{color.alias.white}`, `color-background` → `{color.alias.black}`,
  `color-border` → `{color.alias.gray.80}`). `color-background-overlay` stays raw `rgba()` like
  classic-day, with a darker base. Every override resolves to a step that already exists in the shared
  palette, so the **0-off-source-colors** invariant holds with no new palette values.

Both are `SEMANTIC_ONLY_THEMES` in `themes.spec.mjs` (every semantic token, **zero** component tokens —
components fall through to their semantic default), both are frozen by golden snapshots
(`__snapshots__/themes/classic-{day,night}.css`), and both are cross-checked by the classification guard.

**Maintaining the dark overrides:** edit `themes/classic-night.json` only — change the `$value` of the
relevant token to the desired `{color.alias.*}` step (keep the token's `$description`, which documents its
*purpose*, not its value). `pnpm test -u` re-freezes the snapshot. To change a value for **both** day and
night, edit the shared palette step in `classic-day.json` **and** `classic-night.json` (they must stay
identical) — or, more often, edit the semantic token in `tokens/source/**`, which flows to both.
