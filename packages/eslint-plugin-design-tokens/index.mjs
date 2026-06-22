import tokenConstantRequiresCssVar from './rules/token-constant-requires-css-var/index.mjs'

// TODO: remove

/**
 * ESLint plugin that enforces correct usage of Kong design tokens in Vue 3
 * template `v-bind` expressions. Tokens imported from `@kong/design-tokens`
 * must be wrapped in a CSS custom property fallback so DOM-level theme
 * overrides (light/dark mode) take effect.
 */
const plugin = {
  meta: {
    name: '@kong/eslint-plugin-design-tokens',
  },
  rules: {
    'token-constant-requires-css-var': tokenConstantRequiresCssVar,
  },
  /** Assigned below so the preset can self-reference `plugin`. */
  configs: /** @type {any} */ (undefined),
}

plugin.configs = {
  /**
   * Flat-config preset that registers the plugin and enables the rule as an error.
   * Spread into your eslint.config.mjs inside a files: ["**\/*.vue"] config entry.
   */
  recommended: {
    plugins: {
      '@kong/design-tokens': plugin,
    },
    rules: {
      '@kong/design-tokens/token-constant-requires-css-var': 'error',
    },
  },
}

export default plugin
