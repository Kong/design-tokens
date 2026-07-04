# @kong/design-tokens

Kong Design Tokens for Konnect, via [Style Dictionary](https://github.com/amzn/style-dictionary).

- [Token Tiers](#token-tiers)
  - [Semantic tokens](#semantic-tokens)
  - [Component tokens — names only, value-less](#component-tokens--names-only-value-less)
  - [Themeable token list](#themeable-token-list)
- [Themes](#themes)
- [Tokens](#tokens)
  - [Token Formats](#token-formats)
  - [SCSS](#scss)
  - [CSS Custom Properties](#css-custom-properties)
  - [JavaScript](#javascript)
- [Usage](#usage)
  - [Installation](#installation)
  - [Standalone components](#standalone-components)
  - [Host applications](#host-applications)
  - [Kongponents](#kongponents)
- [Updating Tokens & Local Development](#updating-tokens--local-development)
  - [Directory structure](#directory-structure)
  - [Token Requirements](#token-requirements)
  - [Creating a new theme](#creating-a-new-theme)
  - [Theme `$description` authoring rules](#theme-description-authoring-rules)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Build for production](#build-for-production)
  - [Token Update Workflow](#token-update-workflow)
  - [Committing Changes](#committing-changes)
  - [Approvals](#approvals)
  - [Package Publishing](#package-publishing)

## Token Tiers

The `@kong/design-tokens` package uses a two-tier exported token taxonomy.

| Tier | Source directory | Examples | Exported as |
|------|-----------------|----------|-------------|
| **Semantic** | `tokens/source/**` | `--kui-color-background-primary`, `--kui-space-40`, `--kui-border-radius-30`, `--kui-method-color-background-get` | CSS custom properties, SCSS variables, JS constants |
| **Component** | `tokens/components/**` | `--kui-button-border-radius-medium`, `--kui-button-color-background-primary`, `--kui-button-shadow-focus` | Included in `KUI_THEMEABLE_TOKENS` — **no CSS value** |

> **Alias tokens** (`tokens/alias/**`) form a third internal directory. They hold the raw palette values (hex colors, base sizes) that semantic tokens reference. They are **never exported** — they exist only so Style Dictionary can resolve `{color.alias.blue.100}` references at build time.

### Semantic tokens

Everything in `tokens/source/` is a semantic token — it has a concrete value and is exported to all formats (CSS, SCSS, JS). This includes:

- **Scale tokens** — `--kui-color-*`, `--kui-space-*`, `--kui-border-radius-*`, `--kui-shadow-*`, `--kui-font-*`, etc. Named after the design dimension they represent.
- **Concept tokens** — `--kui-method-*`, `--kui-status-*`, `--kui-navigation-*`, `--kui-icon-*`. Named after a cross-cutting UI concept (HTTP methods, status codes, navigation chrome, icons) rather than a design dimension. Each family lives in its own folder under `tokens/source/` (`method/`, `status/`, `navigation/`, `icon/`), following the same pattern as the scale folders. They are plain semantic tokens, valued and exported exactly like scale tokens. **These are not component tokens** even though they're used inside components.

> **IMPORTANT — `primary` and `accent` colors must be overridden in the Dev Portal**
>
> The `primary` tokens (`--kui-color-background-primary`, `--kui-color-text-primary`, `--kui-color-border-primary`) and the `accent` tokens (`--kui-color-background-accent`, `--kui-color-text-accent`, `--kui-color-border-accent`) — plus any future brand-derived color used the same way — ship a **Kong-branded default value**. The Kong Konnect **Dev Portal** (`kong-konnect/portal`) renders **customer-branded** UIs, where each customer configures their own brand/theme color.
>
> Because these tokens carry a default, that default will **leak Kong's brand color into the customer's portal** unless the portal overrides it. Therefore, whenever a `primary`- or `accent`-like brand color token is **added, renamed, or its default value changes**, the `kong-konnect/portal` customization plugin **must** be updated to override the token with the portal's configured theme color variants so the design-tokens default never reaches the rendered Dev Portal.

### Component tokens — names only, value-less

Component tokens (`--kui-button-*`, `--kui-card-*`, `--kui-input-*`, `--kui-badge-*`, …) live in `tokens/components/` and are **declared without any CSS value** — they are purely override slots. Every Kongponents component uses them in a `var()` fallback chain:

```scss
border-radius: var(--kui-button-border-radius-medium, var(--kui-border-radius-30, $kui-border-radius-30));
//                 ↑ component token (empty by default)   ↑ semantic fallback        ↑ SCSS literal
```

When a theme writes `--kui-button-border-radius-medium: 999px`, only buttons go pill-shaped. Inputs and other components keep their semantic default. When no theme writes the token, `var()` falls through to the semantic default — **byte-identical to the un-themed render**.

### Themeable token list

The `./tokens/themeable-tokens` subpath exports `KUI_THEMEABLE_TOKENS` — a typed `readonly` tuple of every `--kui-*` custom property name that a theme may meaningfully override. It combines both semantic tokens and value-less component tokens.

```ts
import { KUI_THEMEABLE_TOKENS } from '@kong/design-tokens/tokens/themeable-tokens'

// Each entry is a `{ name, description, category, value }` record.
// Derive a union type of all valid theme keys from their `name`s:
type ThemeToken = typeof KUI_THEMEABLE_TOKENS[number]['name']
```

## Themes

Pre-built theme CSS files activate a complete set of token overrides via a `data-kui-theme` attribute on any element. Load a theme CSS file and then set the attribute on the root element (or any subtree element):

```html
<!-- In your HTML template or equivalent -->
<html data-kui-theme="konnect-day">
```

```ts
// Load the theme CSS — webpack/Vite will bundle it
import '@kong/design-tokens/themes/konnect-day.css'

// Switch the active theme at runtime
document.documentElement.setAttribute('data-kui-theme', 'konnect-night')
```

Available themes: `classic-day`, `classic-night`, `konnect-day`, `konnect-night`.
`classic-day` is the default look (identical to the unthemed `:root` exports); `classic-night` is its dark counterpart.

Each theme CSS file uses `@layer kui.theme { [data-kui-theme="name"] { ... } }`. This means customer `:root {}` overrides (which are **unlayered**) beat the theme automatically — no `!important` or special selectors needed.

To respond to the system dark-mode preference, listen to the `prefers-color-scheme` media query in JS:

```ts
const mq = window.matchMedia('(prefers-color-scheme: dark)')
const applyColorScheme = (dark: boolean) =>
  document.documentElement.setAttribute('data-kui-theme', dark ? 'konnect-night' : 'konnect-day')

applyColorScheme(mq.matches)
mq.addEventListener('change', e => applyColorScheme(e.matches))
```

You can also import the theme objects as JavaScript for runtime composition or for use with Kongponents' `applyTheme` / `defineKongponentsTheme`:

```ts
import { konnectDay, konnectNight, classicDay, classicNight } from '@kong/design-tokens/themes'
```

## Tokens

[View the lists of available tokens here](TOKENS.md), or keep reading for more information.

### Token Formats

The `@kong/design-tokens` package exports tokens in multiple formats:

- [SCSS](#scss)
- [CSS Custom Properties](#css-custom-properties)
- [JavaScript](#javascript) (ESM, CJS, and JSON), along with corresponding TypeScript types

Exports are available from the package root meaning you do not need to include the `dist/` directory in your imports:

```ts
// Notice that for JavaScript/TypeScript, we can just import from the root
import { KUI_COLOR_BACKGROUND_PRIMARY_STRONG } from '@kong/design-tokens'
```

### SCSS

#### SCSS Variables

SCSS variables can be utilized in your project's SCSS files or in-component style blocks (this assumes your app is already configured to compile Sass).

To use the SCSS variables, you need to import them into your component or app stylesheet so they are available throughout your project utilizing one of the methods below:

##### Import into your app or component's stylesheet or style block

```scss
@import '@kong/design-tokens/tokens/scss/variables';
```

##### Globally import with Vite

If your component or application utilizes [Vite](https://vitejs.dev/) to build and compile, you may add the following configuration to your `vite.config.ts` to import the SCSS variables into all components within your project

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Inject the @kong/design-tokens SCSS variables to make them available for all components.
        additionalData: '@import "@kong/design-tokens/tokens/scss/variables";',
      },
    },
  },
})
```

#### SCSS Map

The package also exports a SCSS map of the tokens from the `@kong/design-tokens/tokens/scss/map` file

```scss
$tokens-map: (
  'kui-color-background': #ffffff,
  // ... etc.
);
```

### CSS Custom Properties

You may scope your CSS variable overrides inside the `:root` selector as shown here, or inside any other valid CSS selector.

Two versions of the [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) are exported from the package.

#### `@kong/design-tokens/tokens/css/custom-properties.css`

This file exports all available custom properties with the values set to their actual raw value.

#### `@kong/design-tokens/tokens/css/custom-properties-list.css`

This file exports the custom properties with a value of `initial`; mainly used for IDE auto-completion where you do not actually need the token values.

> **IMPORTANT**: You should **never** import the `@kong/design-tokens/tokens/css/custom-properties-list.css` file in your host project.
>
> While CSS variables are _utilized_ in Kong's repositories to allow for CSS customization, the variables themselves are never actually provided values or imported from this package.
>
> The purpose of the `@kong/design-tokens/tokens/css/custom-properties-list.css` file is to provide a list of all available CSS variables, to utilize alongside auto-complete extensions in your IDE, etc.
>
> If you want to customize default token values, provided the element(s) in question utilize CSS variable fallbacks, simply set the variables from this list to your desired value within your host application, scoped inside your desired CSS selector, and it will override the default value.

```html
<style>
// You may scope the variable to `root:` to impact the whole application...
:root {
  --kui-color-text-primary: green;
}

// ...or scope the variable to a specific container to keep the changes isolated
table .my-table-row {
  --kui-color-text-primary: purple;
}
</style>
```

### JavaScript

#### JavaScript Variables

JavaScript variables can be utilized in your project's component files, or other JavaScript/TypeScript files.

To use the JavaScript variables, simply import the variables you need into your component/file:

```ts
// Notice that for JavaScript/TypeScript, we can just import from the root
import { KUI_COLOR_BACKGROUND_PRIMARY_STRONG } from '@kong/design-tokens'
```

#### JSON

The package also exports a JSON file of all tokens from `@kong/design-tokens/tokens/js/tokens.json`

## Usage

### Installation

In your host project, install the package **only** as a `devDependency`:

```shell
pnpm add -D @kong/design-tokens
```

#### Why a `devDependency`?

This package is intended to be consumed by a host component or application that will be compiled before publishing. This means when the component or app is compiled, any tokens it consumes (e.g. SCSS tokens, JavaScript variables, etc.) will be replaced during the build with the static token value.

This strategy alleviates the need for a consuming application to need to install the `@kong/design-tokens` package when using a component that utilizes the tokens under-the-hood.

### Stylelint Plugin

This package used to bundle a Stylelint plugin. It is now a standalone package. See [`@kong/stylelint-plugin-design-tokens`](../stylelint-plugin-design-tokens/README.md).

### Standalone components

The primary consideration when using Kong's design tokens in **components** is to determine if the component needs to allow for downstream customization.

**If your component does not need to offer any customization, only utilize the SCSS and JavaScript design tokens in your component.**

If your component _does_ want to offer customization, you will want to reference the corresponding token CSS variable with a fallback SCSS variable.

#### Component Example

As an example, in Kong's [Kongponents](https://kongponents.konghq.com) Vue component library, we want to offer deep levels of customization to allow for an _external_ host application to override component styles. Enabling customization is easy by using the Kong Design Token's CSS variables with SCSS variable values as the fallback.

```html
<style lang="scss">
// Import SCSS variables
@import "@kong/design-tokens/tokens/scss/variables";

.my-component-class {
  /**
   * When setting a CSS variable value to a SCSS variable, you need to
   * interpolate the SCSS variable. Interpolation can be used
   * almost anywhere in a Sass stylesheet to embed the result of a
   * SassScript expression into a chunk of CSS.
   * Just wrap the expression in `#{}`
  */
  --my-custom-scoped-css-variable: var(--kui-space-20, #{$kui-space-20});

  margin: var(--my-custom-scoped-css-variable, #{$kui-space-10});
  color: var(--kui-color-text-primary, $kui-color-text-primary);
  font-weight: var(--kui-font-weight-semibold, $kui-font-weight-semibold);
  padding: var(--kui-space-20, $kui-space-20) var(--kui-space-40, $kui-space-40);
}
</style>
```

Inspecting the example above, you will notice that we fist import the SCSS variables. We then set each style property to the CSS variable, using the SCSS static variable as the fallback.

**Important**: notice we do **not** import CSS variables.

When Kongponents are imported and used in a host application, the components will utilize the SCSS fallback values by default since the CSS variables are undefined. This is the normal usage and works great for most applications.

**Note:** notice how you have to use [interpolation](https://sass-lang.com/documentation/interpolation/) when using SCSS variable tokens in custom property values (such as defining CSS variable).

If your application wants to customize some of the properties, it's easy by simply defining the CSS variables you want to override inside of your host application, as shown here:

```html
<style>
// You may scope the variable to `root:` to impact the whole application...
:root {
  --kui-color-text-primary: green;
}

// ...or scope the variable to a specific container to keep the changes isolated
table .my-table-row {
  --kui-color-text-primary: purple;
}
</style>
```

Now that we have set a value for the CSS variable `--kui-color-text-primary` in our host application, any instance of this CSS variable in the components will utilize our custom value instead of the default value.

### Host applications

Typically, a host application should only utilize the SCSS and/or JavaScript variables to define its styles. Host applications typically **do not need to be customized** after compile time, meaning there is no reason to use the CSS variables with SCSS variable fallbacks. Here's an example:

```html
<style lang="scss">
// Import SCSS variables
@import "@kong/design-tokens/tokens/scss/variables";

// We directly reference the SCSS variables here which will be replaced with static values during the build
.my-app-custom-class {
  color: $kui-color-text-primary;
  font-weight: $kui-font-weight-semibold;
  padding: $kui-space-20 $kui-space-40;
}
</style>
```

#### Kongponents

[Kongponents](https://kongponents.konghq.com) ships its own `defineKongponentsTheme` helper that validates a theme object against the full typed token surface at authoring time. To use a pre-built design-tokens theme in Kongponents, wrap it with `defineKongponentsTheme`:

```ts
// my-app-theme.ts
import { konnectDay } from '@kong/design-tokens/themes'
import { defineKongponentsTheme } from '@kong/kongponents'

export const myTheme = defineKongponentsTheme({
  ...konnectDay,           // spread the base theme
  '--kui-button-border-radius-medium': '999px',  // then override specific tokens
})
```

Register the theme at app startup via the Kongponents plugin:

```ts
// main.ts
import { createApp } from 'vue'
import Kongponents from '@kong/kongponents'
import { myTheme } from './my-app-theme'
import App from './App.vue'

createApp(App)
  .use(Kongponents, { theme: myTheme })
  .mount('#app')
```

Or apply a theme to a specific subtree at runtime using `KThemeProvider`:

```vue
<template>
  <KThemeProvider :theme="myTheme">
    <!-- everything here renders with myTheme active -->
  </KThemeProvider>
</template>
```

For per-tenant runtime composition (e.g. theme values fetched from an API), use `applyTheme` from `@kong/kongponents`:

```ts
import { applyTheme } from '@kong/kongponents'
import { konnectDay } from '@kong/design-tokens/themes'

// Merge the base theme with tenant-specific overrides, then apply to :root
applyTheme({ ...konnectDay, ...tenantOverrides })
```

#### Server-Side Rendering (SSR)

If your host application utilizes SSR, you may need to resolve aliases to the package exports.

For example, in a [VitePress](https://vitepress.vuejs.org/) site, add the following to your `vite.config.ts`

```ts
export default defineConfig({
  resolve: {
    alias: {
      // Explicitly alias the SCSS file since we are overriding the default import below
      '@kong/design-tokens/tokens/scss/variables': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/scss/variables.scss'),
      // Alias `@kong/design-tokens` imports to specifically utilize the esm build
      '@kong/design-tokens': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/js/index.mjs'),
    },
  },
})
```

## Updating Tokens & Local Development

To get started, install the package dependencies from the repo root:

```sh
pnpm install
```

### Directory structure

The package is organized around four top-level source directories:

| Directory | Purpose |
|-----------|---------|
| `tokens/alias/` | **Internal alias palette** — raw CSS values (hex colors, base sizes) that semantic tokens reference via `{color.alias.*}`. Never exported in any build output; only used so Style Dictionary can resolve references at build time. |
| `tokens/source/` | **Semantic tokens** exported to `custom-properties.css`, SCSS, and JS. Each token family is its own subdirectory: `color/`, `space/`, `shadow/`, `font/`, `border/`, `animation/`, `breakpoint/`, `letter-spacing/`, `line-height/`, plus the concept-named families `method/`, `status/`, `navigation/`, and `icon/` (HTTP methods, status codes, navigation chrome, icons). |
| `tokens/components/` | **Component tokens** — name-only override slots for Kongponents components (`button/`, `card/`, `input/`, `badge/`, …). All `$value` fields must be `""`. Included in `KUI_THEMEABLE_TOKENS` — no CSS, no SCSS/JS values emitted. |
| `themes/` | **Named theme override sets** — each `{name}.theme.json` lists the token values that activate for `[data-kui-theme="{name}"]`. The `.theme.json` suffix is required and enforced by the build and tests. Values may be raw hex or `{color.alias.*}` references resolved at build time. |

### Token Requirements

- Token keys **must** be lowercase, snake_case, and defined in normal alphabetical order (rules enforced by the eslint config)
- The `category` of each token should be its own directory (e.g. `tokens/source/color/`)
- Each `type` of token should be a file in the `category` directory, named `{type}.json` (e.g. `tokens/source/color/background.json`)
- If there is only a single `type` of token within a `category`, you **should** name the file `index.json` (e.g. `tokens/source/line-height/index.json`)
- Alias tokens (`tokens/alias/`) **must not** be exposed/exported from the package exports
- Tokens at the "root" of their structure **must** be defined with a key of `"_"` to allow for nested child tokens.
- Component tokens in `tokens/components/` **must always have `$value: ""`** — they are name-only slots with no CSS value. A non-empty `$value` is a build violation caught by the test suite.

    <details>

    <summary>Click to view an example of root-level tokens</summary>

    ```json
    {
      "color": {
        "text": {
          "_": {
            "$description": "Default text color.",
            "$value": "{color.alias.blue.100}"
          },
          "neutral": {
            "_": {
              "$description": "Neutral text color.",
              "$value": "{color.alias.gray.60}"
            },
            "strong": {
              "$description": "Strong neutral text color.",
              "$value": "{color.alias.gray.70}"
            }
          }
        }
      }
    }
    ```

    ```css
    /* Output */
    --kui-color-text: #000933;
    --kui-color-text-neutral: #6c7489;
    --kui-color-text-neutral-strong: #52596e;
    ```

    </details>

### Creating a new theme

A new theme is made by **copying an existing one** of the same class — it already carries the full token
set, descriptions, and a valid, building starting point. Pick the closest existing theme:

- **Exhaustive** (every themeable token, incl. component tokens — like `konnect-day`/`konnect-night`).
- **Semantic-only** (every semantic token, **zero** component tokens — like `classic-day`/`classic-night`;
  components fall through to their semantic defaults).

```sh
NEW=my-brand
FROM=konnect-day   # or classic-day for a semantic-only theme

# 1. Copy the theme definition and (for alias-based themes) its companion color palette.
#    Theme files MUST be named <theme-name>.theme.json (enforced by the build + tests).
cp themes/$FROM.theme.json themes/$NEW.theme.json
cp tokens/alias/color/$FROM.alias.json tokens/alias/color/$NEW.alias.json   # every alias-using theme MUST have one

# 2. Edit themes/$NEW.theme.json (token $values) and tokens/alias/color/$NEW.alias.json (palette values) to taste.
# 3. Build + verify — the drift and off-source guards confirm completeness.
#    Classification is automatic: themes.spec.mjs treats every theme as EXHAUSTIVE by default.
#    Only a *semantic-only* theme needs a one-line edit — add its name to SEMANTIC_ONLY_THEMES.
pnpm build:tokens && pnpm test
```

The build auto-discovers any `themes/*.theme.json` — no code change needed. A theme file that does not
follow the `<theme-name>.theme.json` naming convention is a hard build error (and fails `pnpm test`), as is
an alias-referencing theme with no matching `tokens/alias/color/<name>.alias.json` palette (no silent fallback),
which is why step 1 copies the palette too. See [`ALIAS-COLOR-MAPPING-GUIDE.md`](./docs/ALIAS-COLOR-MAPPING-GUIDE.md) §6, "Adding a future theme".

> **Note — theme-creation skill dependency.** The `theme-creation` skill in
> `packages/skills/theme-creation/` automates this flow (scaffolding, matching a source's look,
> previewing against Kongponents). Its `scripts/scaffold.mjs` reads structural details of this
> package: the `SEMANTIC_ONLY_THEMES` name and the exhaustive-by-default rule in `themes.spec.mjs`,
> the `tokens/alias/color/_manifest.json` shape, and the `konnect-day`/`konnect-night` template
> names. If you rename or restructure those, update that script too (it will error loudly rather
> than fail silently, but it will break).

### Theme `$description` authoring rules

Every token entry in a theme JSON file may carry an optional `$description` field. When present, it must follow these rules:

- **Match the semantic token's description** — copy the text from the corresponding token in `tokens/source/`. Do not invent a different description for the same concept.
- **Never reference a CSS value** — descriptions must be value-agnostic. The description explains *what* the token controls, not *what value* it currently holds.

| ❌ Avoid | ✅ Use instead |
|---|---|
| `"2px border radius."` | _(omit — scale tokens are self-documenting by name)_ |
| `"Background color for containers (white)."` | `"Default background color for containers."` |
| `"Border color for danger actions or messages (red.60)."` | `"Border color for danger actions or messages."` |
| `"0px 0px 0px 1px blue.60 inset"` | `"Primary state inset border shadow."` |

**When to omit `$description` entirely:** pure scale tokens (`--kui-space-*`, `--kui-border-radius-0` through `-50`, `--kui-border-width-*`, `--kui-icon-size-*`, `--kui-line-height-*`, `--kui-letter-spacing-*`) are self-documenting — their token names carry all the meaning. Leave `$description` off these entries.

**Component tokens may appear in theme files with `$description`.** A theme may set any component token (`--kui-button-*`, `--kui-card-*`, etc.) to provide per-component customization that diverges from the semantic fallback. Use the same description as the component token's source definition in `tokens/components/`.

```json
// ✅ Correct — description matches source definition
"kui-button-border-radius-medium": {
  "$description": "Medium button border radius.",
  "$value": "999px"
}
```

**A theme only needs to define tokens it overrides.** Omit any token whose value should remain at its semantic default (from `custom-properties.css`) or at whatever value a base theme already sets. The `[data-kui-theme]` CSS cascade handles the rest — unset tokens fall back through `var()` to the semantic layer automatically.

### Development Sandbox

This package includes a Vue sandbox (see the `sandbox/` directory) to allow you to experiment with consuming tokens.

To start the sandbox, run from the **repo root**:

```sh
pnpm sandbox:design-tokens
```

Or from within this package directory:

```sh
pnpm sandbox
```

This command simultaneously starts the Vite dev server and watches both the `tokens/` and `themes/` directories. Changes to either trigger a rebuild and restart the Vite dev server.

Updating any files within the sandbox itself will also trigger hot module reload as expected.

### Lint and fix

Lint package files, and optionally auto-fix detected issues.

```sh
# Lint only
pnpm lint

# Lint and fix
pnpm lint:fix
```

### Shared build utilities

Build-time utilities — Style Dictionary transforms, string helpers, and the file-header factory — live in this package's own `utilities/` directory and are exported from `utilities/index.mjs`.

**Package-specific** build utilities (e.g. transforms or formatters that only apply to `@kong/design-tokens`) should be added to `utilities/` and exported from `utilities/index.mjs`.

### Build for production

Utilize the `style-dictionary` CLI to build the token assets for production based on the configuration in `config.mjs`.

From this package directory:

```sh
pnpm build
```

Or from the repo root:

```sh
pnpm --filter @kong/design-tokens build
```

If additional sub-directories (other than `dist/tokens`) are added to the `dist/` directory in `config.mjs`, you will also need to create a new corresponding entry in the `package.json > exports` section to allow for importing into the host project without `dist/` in the path.

For example, if I want to add a new `my-feature` folder, I'd update the `exports` entry as shown here:

```jsonc
"exports": {
  // ... more entries
  "./tokens/*": "./dist/tokens/*",
  "./my-feature/*": "./dist/my-feature/*" // New directory
}
```

### Token Update Workflow

1. Ensure you are on the `main` branch, then pull down the latest code by running `git checkout main && git pull origin main`
2. Checkout a new branch for your changes with `git checkout -b {type}/{jira-ticket}-{description}` — as an example, `git checkout feat/khcp-1234-add-color-tokens`
3. Add/edit the tokens in the `tokens/` or `themes/` directory as needed, ensuring to adhere to the [Token Requirements](#token-requirements)
4. Before committing your changes, locally run `pnpm lint` to ensure you do not have any linting errors. If you have errors, you can try running `pnpm lint:fix` to resolve
5. Commit your changes, adhering to [Conventional Commits](#committing-changes). To make this easier, you're encouraged to run `pnpm commit` from the repo root to help build your commit message
6. Push your branch up to the remote with `git push origin {branch-name}`
7. Open a pull request and request a review

### Committing Changes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

[Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is **highly recommended** to use the following command from the repo root in order to create your commits:

```sh
pnpm commit
```

This will trigger the Commitizen interactive prompt for building your commit message.

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo.

- A `commit-msg` hook is automatically setup that enforces commit message standards with `commitlint`
- A `pre-push` hook is used that runs `eslint` before allowing you to push your changes to the repository

Additionally, CI will use `commitlint` to validate the commits associated with a PR in the `Lint and Validate` job.

### Approvals

- All pull requests require review and approval from authorized team members.
- Automated approvals through workflows are strictly prohibited.
  - There is an exception for automated pull request approvals originating from generated dependency updates that satisfy status checks and other requirements.
- Protected branches require at least one approval from code owners.
- All status checks must pass before a pull request may be merged.

### Package Publishing

This package is published automatically via [lerna-lite](https://github.com/lerna-lite/lerna-lite) in independent mode. Releases are triggered by conventional commits on `main`, `alpha`, and `beta` branches.
