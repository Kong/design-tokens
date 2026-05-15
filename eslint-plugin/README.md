# @kong/design-tokens/eslint-plugin

[ESLint](https://eslint.org/) plugin for enforcing correct usage of KUI design tokens in Vue 3 (and Nuxt 4) templates.

- [Usage](#usage)
- [Rules](#rules)
  - [`token-constant-requires-css-var`](#token-constant-requires-css-var)

## Usage

Install `@kong/design-tokens`, `eslint`, and `vue-eslint-parser` (typically provided by `eslint-plugin-vue`) as `devDependencies`.

```sh
pnpm add -D @kong/design-tokens eslint eslint-plugin-vue
```

In your `eslint.config.mjs` (ESLint 9 flat config):

```js
import vue from 'eslint-plugin-vue'
import designTokens from '@kong/design-tokens/eslint-plugin'

export default [
  // your existing vue config...
  ...vue.configs['flat/recommended'],

  // apply the design tokens plugin
  {
    files: ['**/*.vue'],
    plugins: {
      '@kong/design-tokens': designTokens,
    },
    rules: {
      '@kong/design-tokens/token-constant-requires-css-var': 'error',
    },
  },
]
```

Or use the shipped `configs.recommended` shorthand:

```js
import vue from 'eslint-plugin-vue'
import designTokens from '@kong/design-tokens/eslint-plugin'

export default [
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    ...designTokens.configs.recommended,
  },
]
```

Auto-fix with:

```sh
eslint --fix src/
```

## Rules

### `token-constant-requires-css-var`

Enforces that KUI design token constants (imported from `@kong/design-tokens`) are wrapped in a CSS custom property fallback whenever they are used in a Vue `<template>` v-bind expression.

The CSS custom property **must come first** so that DOM-level overrides (light/dark mode, theming) take effect. The JS constant serves as the static fallback.

#### :red_circle: Incorrect usage

```vue
<template>
  <!-- ❌ bare token constant — DOM overrides cannot work -->
  <MyComponent :color="KUI_COLOR_TEXT_INVERSE" />

  <!-- ❌ ternary branches -->
  <MyComponent :color="isDark ? KUI_COLOR_TEXT_INVERSE : KUI_COLOR_TEXT_PRIMARY" />

  <!-- ❌ object shorthand in :style -->
  <MyComponent :style="{ color: KUI_COLOR_TEXT_INVERSE }" />
</template>

<script setup>
import { KUI_COLOR_TEXT_INVERSE, KUI_COLOR_TEXT_PRIMARY } from '@kong/design-tokens'
</script>
```

#### :green_circle: Correct usage (auto-fixed)

```vue
<template>
  <!-- ✅ CSS custom property first, JS constant as fallback -->
  <MyComponent :color="`var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`" />

  <!-- ✅ both ternary branches wrapped -->
  <MyComponent :color="isDark
    ? `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})`
    : `var(--kui-color-text-primary, ${KUI_COLOR_TEXT_PRIMARY})`" />

  <!-- ✅ object property value wrapped -->
  <MyComponent :style="{ color: `var(--kui-color-text-inverse, ${KUI_COLOR_TEXT_INVERSE})` }" />
</template>

<script setup>
import { KUI_COLOR_TEXT_INVERSE, KUI_COLOR_TEXT_PRIMARY } from '@kong/design-tokens'
</script>
```

#### Report-only cases (no autofix)

The following cases are flagged but not auto-fixed because rewriting them would change semantics or be unsafe:

- **Template literals (single token)**: `:color="\`${KUI_X}\`"` — nesting backtick strings requires manual rewrite.
- **Template literals (multi-token)**: `:padding="\`${KUI_SPACE_0} ${KUI_SPACE_70}\`"` — adjacent expression slots share quasi boundaries, so per-token fix ranges overlap and ESLint rejects them. Rewrite manually, for example:
  ```vue
  :padding="`var(--kui-space-0, ${KUI_SPACE_0}) var(--kui-space-70, ${KUI_SPACE_70})`"
  ```
- **Binary expressions**: `:color="KUI_X + '!important'"` — string concatenation.
- **Function arguments**: `:color="darken(KUI_X)"` — the function may not accept a CSS `var()` string.
- **Script-setup variables**: `` const c = KUI_X; `` then `:color="c"` — fixing the declaration would affect all consumers of the variable. Wrap at the template binding site instead.

#### Token naming

The CSS custom property name is derived from the JS constant by lowercasing and replacing underscores with hyphens:

```
KUI_COLOR_TEXT_INVERSE  →  --kui-color-text-inverse
KUI_SPACE_40            →  --kui-space-40
KUI_FONT_SIZE_30        →  --kui-font-size-30
```

#### Excluded token families

`KUI_BREAKPOINT_*` tokens (e.g. `KUI_BREAKPOINT_PHABLET`) are **excluded** from this rule. Breakpoint constants represent viewport pixel widths used in JavaScript media-query logic. CSS custom properties cannot be utilized inside CSS `@media` queries, so there is no point in enforcing a fallback value.

```vue
<!-- ✅ allowed — breakpoint tokens are not CSS custom properties -->
<MyComponent :max-width="KUI_BREAKPOINT_PHABLET" />
```

#### Limitations

- **Namespace imports** (`import * as tokens from '@kong/design-tokens'`) are not tracked.
- **Re-exports through barrel files** in consumer code — only direct `@kong/design-tokens` imports are detected.
- **Multi-hop script-setup flow** (`const a = KUI_X; const b = a`) — only one level of indirection is detected.
- **Render functions / JSX** (`.tsx` SFC blocks) — template-only.
- **`<style>` blocks** — use [`@kong/design-tokens/stylelint-plugin`](../stylelint-plugin/README.md) instead.

> **Note**: KUI design token JS constants resolve to primitive strings (e.g. `'#1456cb'`). When wrapped in `` `var(--kui-x, ${KUI_X})` ``, the fallback is that primitive string. In production Kong apps the CSS custom properties are always loaded, so the fallback fires only if the stylesheet fails to load.
