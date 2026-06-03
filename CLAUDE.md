# Kong Design Tokens — CLAUDE.md

## Monorepo structure

pnpm workspace with lerna-lite v5 in independent versioning mode.

```
packages/
  design-tokens/              @kong/design-tokens         — Konnect design tokens (published)
  portal-design-tokens/       @kong/portal-design-tokens  — Konnect Dev Portal tokens (published)
  eslint-plugin-design-tokens/ @kong/eslint-plugin-design-tokens (published)
  stylelint-plugin-design-tokens/ @kong/stylelint-plugin-design-tokens (published)
  shared-utils/               @kong/design-tokens-shared-utils — build-time utilities (private, never published)
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
pnpm sandbox:portal-design-tokens
```

## Token packages

Both `@kong/design-tokens` and `@kong/portal-design-tokens` use **Style Dictionary v5** to build from JSON source tokens into CSS, SCSS, LESS, ESM, CJS, and JSON formats. Build config lives in `config.mjs` and `platforms/` inside each package.

Token source files live in `tokens/source/` (exported) and `tokens/alias/` (not exported — alias-only).

Token naming prefix is `kui`. Output naming conventions:
- CSS custom properties: `--kui-color-background`
- SCSS/LESS variables: `$kui-color-background` / `@kui-color-background`
- JavaScript/TypeScript: `KUI_COLOR_BACKGROUND`
- JSON: `kui_color_background`

## Shared build utilities

`packages/shared-utils/` (`@kong/design-tokens-shared-utils`) is a **private** workspace package holding build-time Style Dictionary utilities shared between both token packages. It is never published. Token packages reference it as a `devDependency` with `workspace:*`.

Package-specific utilities belong in each token package's own `utilities/` directory.

## Publishing

- Published via **lerna-lite** triggered by conventional commits on `main`, `alpha`, and `beta` branches
- Uses **OIDC trusted publishing** — no `NPM_TOKEN` required
- `@kong/design-tokens-shared-utils` is `"private": true` and is excluded from versioning and publishing automatically

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). Always run `pnpm commit` from the repo root to use the interactive Commitizen prompt. Commit messages drive semver bump magnitude for all packages.

## Tests

`pnpm test` runs:
- `@kong/design-tokens` — vitest build artifact tests (`__tests__/build.test.mjs`): asserts all dist files exist with correct content, token values, and cross-format consistency
- `@kong/portal-design-tokens` — same artifact tests with portal-specific header assertions
- `@kong/eslint-plugin-design-tokens` — vitest unit tests for ESLint rule logic

Tests for the token packages read from `dist/` and must be run **after** `pnpm build`.
