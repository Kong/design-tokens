import StyleDictionary from 'style-dictionary'
import { TOKEN_DIRECTORY } from '../utilities/index.mjs'

/**
 * Tokens that belong in the themeable surface:
 *  - must be a source token (not an alias)
 */
const isThemeable = (token) => token.isSource === true

/**
 * A single themeable-token record.
 * @typedef {object} ThemeableTokenRecord
 * @property {string} name - CSS custom property name, including the leading `--` (e.g. `--kui-color-background`).
 * @property {string} description - Human-readable description sourced from the token's `$description`.
 * @property {string} category - Token family (e.g. `color`, `space`, `breakpoint`), or `component` for value-less component tokens.
 * @property {string | null} value - Default value as emitted to CSS, or `null` when the token has no value (component tokens).
 */

/**
 * Build the deduplicated, name-sorted list of themeable-token records from the dictionary.
 * Deduping is by CSS custom property name (first occurrence wins); the sort keeps the
 * generated output stable across builds.
 *
 * @param {{ allTokens: Array<object> }} dictionary - The Style Dictionary dictionary.
 * @returns {ThemeableTokenRecord[]}
 */
export function buildRecords(dictionary) {
  const byName = new Map()

  for (const token of dictionary.allTokens) {
    const name = `--${token.name}`
    if (byName.has(name)) {
      continue
    }

    // Component tokens are value-less by design; everything else carries a resolved value.
    const isComponent = token.$type === 'component'
    const rawValue = token.$value
    const value = isComponent ? null : (rawValue === '' || rawValue == null ? null : String(rawValue))
    byName.set(name, {
      name,
      description: String(token.$description ?? ''),
      category: isComponent ? 'component' : token.attributes.category,
      value,
    })
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** Render one record as a JS/TS object literal (double-quoted keys' values, trailing commas). */
export function renderJsObject(record) {
  return (
    '  {\n' +
    `    name: ${JSON.stringify(record.name)},\n` +
    `    description: ${JSON.stringify(record.description)},\n` +
    `    category: ${JSON.stringify(record.category)},\n` +
    `    value: ${record.value === null ? 'null' : JSON.stringify(record.value)},\n` +
    '  },'
  )
}

/** Render one record as a `readonly` type-literal member for the declaration files. */
function renderDtsMember(record) {
  return (
    '  {\n' +
    `    readonly name: ${JSON.stringify(record.name)};\n` +
    '    readonly description: string;\n' +
    `    readonly category: ${JSON.stringify(record.category)};\n` +
    '    readonly value: string | null;\n' +
    '  },'
  )
}

StyleDictionary.registerFormat({
  name: 'js/kui-themeable-tokens-esm',
  format: async function({ dictionary }) {
    const body = buildRecords(dictionary).map(renderJsObject).join('\n')
    return (
      '/**\n' +
      ' * @kong/design-tokens — themeable-tokens registry\n' +
      ' * GENERATED FILE — do not edit by hand. Run `pnpm build:tokens` to regenerate.\n' +
      ' *\n' +
      ' * Every --kui-* custom property a theme may override, as an array of\n' +
      ' * records: { name, description, category, value }. Includes both semantic/scale\n' +
      ' * tokens and value-less component tokens (category "component", value null).\n' +
      ' */\n' +
      `export const KUI_THEMEABLE_TOKENS = [\n${body}\n]\n`
    )
  },
})

StyleDictionary.registerFormat({
  name: 'js/kui-themeable-tokens-cjs',
  format: async function({ dictionary }) {
    const body = buildRecords(dictionary).map(renderJsObject).join('\n')
    return (
      '/**\n' +
      ' * @kong/design-tokens — themeable-tokens registry\n' +
      ' * GENERATED FILE — do not edit by hand. Run `pnpm build:tokens` to regenerate.\n' +
      ' */\n' +
      '\'use strict\'\n' +
      `const KUI_THEMEABLE_TOKENS = [\n${body}\n]\n` +
      'module.exports = { KUI_THEMEABLE_TOKENS }\n'
    )
  },
})

StyleDictionary.registerFormat({
  name: 'typescript/kui-themeable-tokens',
  format: async function({ dictionary }) {
    const members = buildRecords(dictionary).map(renderDtsMember).join('\n')
    return (
      '/**\n' +
      ' * @kong/design-tokens — themeable-tokens type declarations\n' +
      ' * GENERATED FILE — do not edit by hand.\n' +
      ' *\n' +
      ' * Every --kui-* custom property a theme may override, as a typed\n' +
      ' * readonly tuple of records. `name` and `category` are string literals so consumers\n' +
      ' * can derive precise union types:\n' +
      ' *\n' +
      ' *   import { KUI_THEMEABLE_TOKENS } from \'@kong/design-tokens/tokens/themeable-tokens\'\n' +
      ' *   type ThemeToken = typeof KUI_THEMEABLE_TOKENS[number][\'name\']\n' +
      ' *\n' +
      ' * CSS custom properties cannot be consumed inside @media feature queries,\n' +
      ' * so overriding them via a theme has no effect on responsive behavior.\n' +
      ' */\n' +
      `export declare const KUI_THEMEABLE_TOKENS: readonly [\n${members}\n]\n`
    )
  },
})

export default {
  buildPath: `${TOKEN_DIRECTORY}/themeable-tokens/`,
  // `color/css` matches the color serialization used by the CSS/JS platforms so each record's
  // `value` equals the default emitted to `:root`.
  transforms: ['attribute/cti', 'name/kebab', 'color/css'],
  files: [
    {
      destination: 'index.mjs',
      format: 'js/kui-themeable-tokens-esm',
      filter: isThemeable,
    },
    {
      destination: 'index.cjs',
      format: 'js/kui-themeable-tokens-cjs',
      filter: isThemeable,
    },
    {
      destination: 'index.d.ts',
      format: 'typescript/kui-themeable-tokens',
      filter: isThemeable,
    },
    {
      // CJS-flavored declaration for the `require` export condition. The package is `"type": "module"`,
      // so a bare `.d.ts` is ESM-typed; `.d.cts` pairs correctly with the CommonJS `index.cjs`.
      destination: 'index.d.cts',
      format: 'typescript/kui-themeable-tokens',
      filter: isThemeable,
    },
  ],
}
