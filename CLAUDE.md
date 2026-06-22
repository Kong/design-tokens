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

# Sandboxes
pnpm sandbox:design-tokens
```

## Token package

`@kong/design-tokens` uses **Style Dictionary v5** to build from JSON source tokens into CSS, SCSS, LESS, ESM, CJS, and JSON formats. Build config lives in `config.mjs` and `platforms/` inside the package.

Token source files live in `tokens/source/` (exported) and `tokens/alias/` (not exported — alias-only).

Token naming prefix is `kui`. Output naming conventions:
- CSS custom properties: `--kui-color-background`
- SCSS/LESS variables: `$kui-color-background` / `@kui-color-background`
- JavaScript/TypeScript: `KUI_COLOR_BACKGROUND`
- JSON: `kui_color_background`

## Build utilities

Build-time Style Dictionary utilities live in `packages/design-tokens/utilities/`. Package-specific utilities belong there and are never published (they are only used during the build).

## Publishing

- Published via **lerna-lite** triggered by conventional commits on `main`, `alpha`, and `beta` branches
- Uses **OIDC trusted publishing** — no `NPM_TOKEN` required

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). Always run `pnpm commit` from the repo root to use the interactive Commitizen prompt. Commit messages drive semver bump magnitude for all packages.

## Tests

`pnpm test` runs:
- `@kong/design-tokens` — vitest build artifact tests (`build.spec.mjs`): asserts all dist files exist with correct content, token values, and cross-format consistency
- `@kong/eslint-plugin-design-tokens` — vitest unit tests for ESLint rule logic (`rules/**/index.spec.mjs`)

Tests for the token packages read from `dist/` and must be run **after** `pnpm build`.
