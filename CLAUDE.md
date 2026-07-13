# Kong Design Tokens — CLAUDE.md

## Monorepo structure

pnpm workspace with lerna-lite v5 in independent versioning mode.

```
packages/
  design-tokens/              @kong/design-tokens         — Konnect design tokens (published)
  eslint-plugin-design-tokens/ @kong/eslint-plugin-design-tokens (published)
  stylelint-plugin-design-tokens/ @kong/stylelint-plugin-design-tokens (published)
```

## Key commands

```sh
pnpm install               # install all workspace dependencies
pnpm build                 # build all packages
pnpm test                  # run all tests
pnpm lint                  # lint all packages
pnpm commit                # interactive conventional commit (required — use instead of git commit -m)

# Per-package
pnpm --filter @kong/design-tokens build
pnpm --filter @kong/design-tokens test

# Token-specific shortcuts (from packages/design-tokens/)
pnpm build:tokens          # build only the token outputs (faster than full build)

# Sandboxes
pnpm sandbox:design-tokens
```

## Token package

`@kong/design-tokens` uses **Style Dictionary v5** to build from JSON source tokens into CSS, SCSS, LESS, ESM, CJS, and JSON formats. Build config lives in `config.mjs` and `platforms/` inside the package.

Token naming prefix is `kui`. Output naming conventions:
- CSS custom properties: `--kui-color-background`
- SCSS/LESS variables: `$kui-color-background` / `@kui-color-background`
- JavaScript/TypeScript: `KUI_COLOR_BACKGROUND`
- JSON: `kui_color_background`

## Token architecture — three tiers

```
tokens/alias/color/<theme>.json   ← NOT in this repo; aliases are in themes/<name>/<name>.alias.color.json
tokens/source/**/*.json           ← semantic + scale tokens (exported, have real values)
tokens/components/**/*.json       ← component tokens (exported, value: null — names-only)
themes/<name>/<name>.theme.json   ← theme overrides for both semantic and component tokens
```

### Semantic / scale tokens (`tokens/source/`)

Real values (`#FF0000`, `4px`, etc.). These build into the default `:root` CSS, SCSS, JS exports.
Categories: `animation`, `border`, `breakpoint`, `color`, `font`, `icon`, `letter_spacing`, `line_height`, `method`, `navigation`, `shadow`, `space`, `status`.

### Component tokens (`tokens/components/`)

**Names-only — never emitted into CSS as declared properties.** Each file defines tokens for one component with `$value: null`. They appear in `dist/tokens/themeable-tokens/` (the `KUI_THEMEABLE_TOKENS` registry) so Kongponents can reference them and themes can override them. They are NOT in the default `:root` block.

**Why no CSS declaration:** an undeclared custom property is spec-guaranteed invalid — identical to `initial` — so `var(--kui-button-border-radius, var(--kui-border-radius-30, $fallback))` falls through to the semantic default. Emitting `: initial` buys nothing and risks colliding with `@property` registrations.

**Grammar:** `--kui-<component>-<property>[-<variant>][-<state>]`
- Size variants: `-small`, `-medium`, `-large` (used when sizes genuinely differ, e.g. button radius)
- State: `-hover` (coordinates hover + focus + focus-visible; see Focus token rule below)
- Focus ring: `-shadow-focus` (separate, always kept)

**Focus token rule:** never create separate `-focus` and `-focus-visible` color/border tokens alongside `-hover`. One `-hover` token coordinates all three states. The focus *ring* (`-shadow-focus`) stays separate as it's what visually distinguishes focus.

### KUI_THEMEABLE_TOKENS registry (`dist/tokens/themeable-tokens/`)

Array of `{ name, description, category, value }` records exported from the build. Currently **920 tokens total**: ~341 semantic (real `value`) + 579 component (`value: null`). Consumed by the design-token customizer sandbox and by Kongponents' typed theme contract.

## Theme architecture

Themes live in `themes/<name>/`. Each theme directory contains:
- `<name>.theme.json` — the token override map (Style Dictionary source)
- `<name>.alias.color.json` — the theme's color alias palette (non-classic themes only; classic themes share the canonical classic-day palette which is already in `tokens/alias/color/` or inlined)

`themes/_manifest.alias.color.json` — canonical alias key set (names-only). All palettes must match it exactly (enforced by `themes.spec.mjs`).

### Theme taxonomy

Declared in `platforms/themes.mjs` as `SEMANTIC_ONLY_THEMES`; everything else is exhaustive:

| Class | Themes | Contents |
|-------|--------|----------|
| **SEMANTIC_ONLY** | `classic-day`, `classic-night` | All ~341 semantic tokens, **zero** component tokens. Default family — components fall through to semantics via Kongponents' `var()` chain. Component-free *by omission* (provably), not by snapshot. |
| **EXHAUSTIVE** | `electric-lime-day`, `electric-lime-night`, `electric-lime-day-high-contrast`, `electric-lime-night-high-contrast` | Every `KUI_THEMEABLE_TOKENS` entry (semantic + component). Component tokens intentionally diverge from semantics (brand buttons, etc.). |

**Do not fill classic with component token snapshots.** This repo cannot verify that a component token value equals its semantic fallback (that mapping lives in Kongponents SCSS) — only emptiness is provable. Snapshots silently drift when semantics change.

**Exhaustive themes:** changing a *semantic* value does NOT auto-propagate to component tokens that should track it; the repo cannot detect this drift. Re-run per-component reconciliation when design changes.

### Alias color palettes

Each exhaustive theme owns `themes/<name>/<name>.alias.color.json` with its brand color palette.

- **Standardized 10-based step names only:** `05, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100` plus singletons `black`, `white`, `transparent`. No intermediate steps (e.g. no `gray.77`).
- All step names are a shared vocabulary across themes; each theme assigns its own `$value` per step.
- `themes/_manifest.alias.color.json` defines the canonical key set (names only, no values). Every palette must match it exactly — drift guard in `themes.spec.mjs` enforces this.
- Build wiring: `platforms/themes.mjs` `aliasIncludesFor()` includes only the per-theme palette and **throws** if a theme needing aliases has none (no silent fallback).

### App-level theming requirement

Themes must write `--kui-*` overrides to **`:root` / `document.documentElement`**, not to a subtree wrapper. `KModal`, `KToaster`, `KPop`, `KDropdown`, and `KSlideout` teleport to `<body>` — they only inherit custom properties set on `:root`. A `KThemeProvider` wrapping a subtree is the secondary (regional override) path, not the primary one.

## Build utilities

Build-time Style Dictionary utilities live in `packages/design-tokens/utilities/`. Package-specific utilities belong there and are never published.

## Scripts (`packages/design-tokens/scripts/`)

| Script | Purpose |
|--------|---------|
| `theme-scaffold.mjs` | Scaffold a new exhaustive theme. Seeds semantic tokens with their source defaults; component tokens as empty slots (`$value: ''`) for the author to fill deliberately. |
| `themes-sync.mjs` | Reconcile an existing theme against the canonical token tree after tokens are added/removed. Adds missing tokens (semantic → default, component → empty slot); skips component tokens for `SEMANTIC_ONLY_THEMES`. |
| `themes-unfilled.mjs` | Report which component tokens in a theme are still empty slots, and which palette families are unchanged from the classic-day seed. Non-blocking — a checklist, not a gate. |
| `alias-manifest.mjs` | Shared helpers for reading the manifest key set and palette leaves. Used by `themes.spec.mjs`. |

**Creating a new theme:** copy an existing theme of the same class + its palette file, edit values, classify in `platforms/themes.mjs`, then `pnpm build:tokens && pnpm test`. Or run `node scripts/theme-scaffold.mjs <name>` to generate the scaffolding.

**Updating themes after token changes:** run `node scripts/themes-sync.mjs` to add missing tokens to all exhaustive themes. Then fill any new component slots deliberately.

## Tests

`pnpm test` runs **after `pnpm build:tokens`** (the `pretest` hook does this automatically).

| Test file | What it guards |
|-----------|---------------|
| `build.spec.mjs` | All dist files exist, correct content, cross-format consistency, token values |
| `themes.spec.mjs` | Drift guards (exhaustive + semantic-only completeness), classification guard (taxonomy ≡ themes/ dir), palette≡manifest drift guard, `$description` value-derived, off-source color guard (every compiled color traces to its theme palette), build-wiring throws for misconfigured themes, golden snapshots for classic-day/classic-night |

**Tests must be self-contained.** No test may read `/tmp` files, Kongponents paths, or any external artifact. Use inline fixtures for any Kongponents-derived data (e.g. fallback-pairs fixture in `themes.spec.mjs`). This ensures CI passes without the Kongponents repo checked out.

## Sandbox (`packages/design-tokens/sandbox/`)

Vue dev app — the **Design Token Customizer**. Runs at `localhost:5173` via `pnpm sandbox:design-tokens`.

Key composables:
- `useTokens.ts` — `ALL_ENTRIES`: all 920 customizable tokens (semantic from `@tokens/js` + component from `KUI_THEMEABLE_TOKENS`); source of truth for the UI, export, and import routing
- `useTokenCustomizer.ts` — override map, `buildCss` (skips empty values to avoid emitting invalid `--kui-…: ;`), `importFromCss`, share-code encoding
- `usePreviewBridge.ts` — bridges token overrides to an iframe via postMessage (`kui-inject-css`) or a bookmarklet popup; DEV mode uses the Vite proxy

`vite-preview-proxy.ts` — Vite dev-only middleware that proxies arbitrary target URLs through `/preview-proxy?url=<encoded>`:
- Strips CSP/X-Frame-Options headers so the page renders in an iframe
- Injects a `networkOverrideScript` that intercepts `fetch`, `XHR`, `history.*`, `location.*`, `<script src>`, `<link href>` to route all sub-resources through the proxy and prevent SPA routers from escaping the proxy origin
- Injects a `headScript` that posts `kui-frame-ready` to the parent and listens for `kui-inject-css` to update the `<style id="kong-design-token-overrides">` tag
- Preserves hash fragments from the original URL param (Node.js `fetch()` strips them before forwarding)

## Publishing

- Published via **lerna-lite** triggered by conventional commits on `main`, `alpha`, and `beta` branches
- Uses **OIDC trusted publishing** — no `NPM_TOKEN` required

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). Always run `pnpm commit` from the repo root to use the interactive Commitizen prompt. Commit messages drive semver bump magnitude for all packages.
