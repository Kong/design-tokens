import StyleDictionary from 'style-dictionary'

/**
 * Tokens that belong in the themeable surface:
 *  - must be a source token (not an alias)
 *  - must not be a breakpoint token
 *
 * Breakpoints are excluded because CSS custom properties cannot be consumed
 * inside @media feature queries — overriding --kui-breakpoint-* via a theme
 * has no effect on Kongponents' responsive behavior.
 */
const isThemeable = (token) =>
  token.isSource === true && token.path[0] !== 'breakpoint'

/** Deduplicated, sorted CSS custom property names from a token list. */
function uniqueNames(tokens) {
  return [...new Set(tokens.map(t => `--${t.name}`))].sort()
}

StyleDictionary.registerFormat({
  name: 'js/kui-themeable-tokens-esm',
  format: async function({ dictionary }) {
    const names = uniqueNames(dictionary.allTokens).map(n => `  '${n}',`).join('\n')
    return (
      '/**\n' +
      ' * @kong/design-tokens — themeable-tokens registry\n' +
      ' * GENERATED FILE — do not edit by hand. Run `pnpm build:tokens` to regenerate.\n' +
      ' *\n' +
      ' * All --kui-* custom properties that a Kongponents theme may override.\n' +
      ' * Includes both semantic/scale tokens and value-less component tokens.\n' +
      ' * Breakpoint tokens (--kui-breakpoint-*) are excluded — CSS custom properties\n' +
      ' * cannot be consumed inside @media feature queries.\n' +
      ' */\n' +
      `export const KUI_THEMEABLE_TOKENS = [\n${names}\n]\n`
    )
  },
})

StyleDictionary.registerFormat({
  name: 'js/kui-themeable-tokens-cjs',
  format: async function({ dictionary }) {
    const names = uniqueNames(dictionary.allTokens).map(n => `  '${n}',`).join('\n')
    return (
      '/**\n' +
      ' * @kong/design-tokens — themeable-tokens registry\n' +
      ' * GENERATED FILE — do not edit by hand. Run `pnpm build:tokens` to regenerate.\n' +
      ' */\n' +
      '\'use strict\'\n' +
      `const KUI_THEMEABLE_TOKENS = [\n${names}\n]\n` +
      'module.exports = { KUI_THEMEABLE_TOKENS }\n'
    )
  },
})

StyleDictionary.registerFormat({
  name: 'typescript/kui-themeable-tokens',
  format: async function({ dictionary }) {
    const names = uniqueNames(dictionary.allTokens).map(n => `  '${n}',`).join('\n')
    return (
      '/**\n' +
      ' * @kong/design-tokens — themeable-tokens type declarations\n' +
      ' * GENERATED FILE — do not edit by hand.\n' +
      ' *\n' +
      ' * All --kui-* custom properties that a Kongponents theme may override,\n' +
      ' * as a typed readonly tuple so consumers can derive a union type:\n' +
      ' *\n' +
      ' *   import { KUI_THEMEABLE_TOKENS } from \'@kong/design-tokens/themeable-tokens\'\n' +
      ' *   type ThemeToken = typeof KUI_THEMEABLE_TOKENS[number]\n' +
      ' *\n' +
      ' * Breakpoint tokens (--kui-breakpoint-*) are intentionally excluded.\n' +
      ' * CSS custom properties cannot be consumed inside @media feature queries,\n' +
      ' * so overriding them via a theme has no effect on responsive behavior.\n' +
      ' */\n' +
      `export declare const KUI_THEMEABLE_TOKENS: readonly [\n${names}\n]\n`
    )
  },
})

export default {
  buildPath: 'dist/',
  transforms: ['attribute/cti', 'name/kebab'],
  files: [
    {
      destination: 'themeable-tokens.mjs',
      format: 'js/kui-themeable-tokens-esm',
      filter: isThemeable,
    },
    {
      destination: 'themeable-tokens.cjs',
      format: 'js/kui-themeable-tokens-cjs',
      filter: isThemeable,
    },
    {
      destination: 'themeable-tokens.d.ts',
      format: 'typescript/kui-themeable-tokens',
      filter: isThemeable,
    },
    {
      // CJS-flavored declaration for the `require` export condition. The package is `"type": "module"`,
      // so a bare `.d.ts` is ESM-typed; `.d.cts` pairs correctly with the CommonJS `themeable-tokens.cjs`.
      destination: 'themeable-tokens.d.cts',
      format: 'typescript/kui-themeable-tokens',
      filter: isThemeable,
    },
  ],
}
