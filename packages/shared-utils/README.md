# @kong/design-tokens-shared-utils

> **Private package — never published to npm.**

Build-time utilities shared by `@kong/design-tokens` and `@kong/portal-design-tokens`. This package is `"private": true` and is only ever a `devDependency` of the token packages — nothing in any published `dist/` imports it.

## Scope guardrail

This package holds **design-token build utilities** shared across the Kong token packages only:

- Utilities that apply to both `@kong/design-tokens` and `@kong/portal-design-tokens` belong here.
- **Package-specific utilities** belong in that package's own `utilities/` directory, not here.
- Generic/unrelated helpers do not belong here — keep it focused.

## Exported members

| Export | Description |
|---|---|
| `KONG_TOKEN_PREFIX` | The static token prefix (`'kui'`) |
| `TOKEN_DIRECTORY` | The built tokens directory path (`'dist/tokens'`) |
| `emptyToInitialTransform` | Style Dictionary transform name; registers `value/empty-to-initial` (replaces empty string values with `initial`) |
| `unquoteString` | String helper — strips surrounding quotes from a string |
| `createFileHeader` | Factory that returns a Style Dictionary `fileHeader` function for a given package (accepts `{ product, packageDirectory }`) |

## Usage

This package is consumed via the local `utilities/` barrel in each token package:

```js
// packages/design-tokens/utilities/index.mjs
export { KONG_TOKEN_PREFIX, TOKEN_DIRECTORY, emptyToInitialTransform, unquoteString } from '@kong/design-tokens-shared-utils'
export { customFileHeader } from './file-header.mjs'
// Future package-specific utilities for this package go here.
```

The local barrel is the **only** import surface for `platforms/*.mjs` in each token package — nothing imports `@kong/design-tokens-shared-utils` directly from outside its own `utilities/` barrel.

## `style-dictionary` peer dependency

`transforms.mjs` calls `StyleDictionary.registerTransform(...)` on the imported singleton. This must resolve to the **same hoisted instance** that the consuming token package builds with, which is why `style-dictionary` is declared as a `peerDependency` here (not a regular `dependency`). In the pnpm workspace it resolves to the root-hoisted copy automatically.

## Release behavior

Because this package is `"private": true`, lerna-lite skips it during versioning and publishing. However, lerna's `allDependencies` graph includes `devDependencies`, so any commit that touches `packages/shared-utils/**` will **automatically trigger version bumps and republishes of the token packages** that depend on it — no extra CI configuration needed.
