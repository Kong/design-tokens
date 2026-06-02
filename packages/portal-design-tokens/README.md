# @kong/portal-design-tokens

Kong Dev Portal Design Tokens, via [Style Dictionary](https://github.com/amzn/style-dictionary).

> **Note:** This package is a frozen snapshot of `@kong/design-tokens` tokens created at the time of the Dev Portal / Konnect split. Portal-specific tokens and component-level tokens will be added here over time on an independent versioning cadence.

- [Token Formats](#token-formats)
- [Usage](#usage)
- [Development](#development)

## Token Formats

The `@kong/portal-design-tokens` package exports tokens in multiple formats:

- [SCSS](#scss)
- [LESS](#less)
- [CSS Custom Properties](#css-custom-properties)
- [JavaScript](#javascript) (ESM, CJS, and JSON), along with corresponding TypeScript types

Exports are available from the package root meaning you do not need to include the `dist/` directory in your imports:

```ts
// Notice that for JavaScript/TypeScript, we can just import from the root
import { KUI_COLOR_BACKGROUND_PRIMARY_STRONG } from '@kong/portal-design-tokens'
```

### SCSS

#### SCSS Variables

SCSS variables can be utilized in your project's SCSS files or in-component style blocks (this assumes your app is already configured to compile Sass).

To use the SCSS variables, import them into your component or app stylesheet:

```scss
@import '@kong/portal-design-tokens/tokens/scss/variables';
```

##### Globally import with Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@kong/portal-design-tokens/tokens/scss/variables";',
      },
    },
  },
})
```

#### SCSS Map

The package also exports a SCSS map of the tokens from the `@kong/portal-design-tokens/tokens/scss/map` file

```scss
$tokens-map: (
  'kui-color-background': #ffffff,
  // ... etc.
);
```

### LESS

#### LESS Variables

LESS variables can be utilized in your project's LESS files or in-component style blocks (this assumes your app is already configured to compile LESS).

Import them via `@kong/portal-design-tokens/tokens/less/variables.less`.

### CSS Custom Properties

Two versions of the [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) are exported from the package.

#### `@kong/portal-design-tokens/tokens/css/custom-properties.css`

This file exports all available custom properties with the values set to their actual raw value.

#### `@kong/portal-design-tokens/tokens/css/custom-properties-list.css`

This file exports the custom properties with a value of `initial`; mainly used for IDE auto-completion where you do not actually need the token values.

> **IMPORTANT**: You should **never** import the `@kong/portal-design-tokens/tokens/css/custom-properties-list.css` file in your host project. Its purpose is to provide a list of all available CSS variables for use alongside auto-complete extensions in your IDE.

### JavaScript

#### JavaScript Variables

```ts
import { KUI_COLOR_BACKGROUND_PRIMARY_STRONG } from '@kong/portal-design-tokens'
```

#### JSON

The package also exports a JSON file of all tokens from `@kong/portal-design-tokens/tokens/js/tokens.json`

## Usage

### Installation

In your host project, install the package **only** as a `devDependency`:

```shell
pnpm add -D @kong/portal-design-tokens
```

### Linting

For linting, install [`@kong/stylelint-plugin-design-tokens`](../stylelint-plugin-design-tokens/README.md) and/or [`@kong/eslint-plugin-design-tokens`](../eslint-plugin-design-tokens/README.md). You do **not** need `@kong/design-tokens` installed.

## Development

To get started, install the package dependencies from the repo root:

```sh
pnpm install
```

### Development Sandbox

To start the sandbox, run from the **repo root**:

```sh
pnpm sandbox:portal-design-tokens
```

Or from within this package directory:

```sh
pnpm sandbox
```

### Build for production

From this package directory:

```sh
pnpm build
```

Or from the repo root:

```sh
pnpm --filter @kong/portal-design-tokens build
```

### Package Publishing

This package is published automatically via [lerna-lite](https://github.com/lerna-lite/lerna-lite) in independent mode. Releases are triggered by conventional commits on `main`, `alpha`, and `beta` branches.
