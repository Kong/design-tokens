import { describe, it, expect, beforeAll } from 'vitest'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, 'dist/tokens')
const DIST_ROOT = join(__dirname, 'dist')

/** @param {string} relativePath */
async function distFile(relativePath) {
  return readFile(join(DIST_DIR, relativePath), 'utf-8')
}

/** @param {string} relativePath */
async function distRootFile(relativePath) {
  return readFile(join(DIST_ROOT, relativePath), 'utf-8')
}

const EXPECTED_DIST_FILES = [
  'css/custom-properties.css',
  'css/custom-properties-list.css',
  'scss/_variables.scss',
  'scss/_map.scss',
  'scss/_mixins.scss',
  'less/variables.less',
  'js/index.mjs',
  'js/index.d.ts',
  'js/tokens.json',
  'js/cjs/index.js',
  'js/cjs/index.d.ts',
  'js/cjs/package.json',
  'README.md',
]


describe('@kong/design-tokens build artifacts', () => {
  /** @type {string} */
  let cssVars
  /** @type {string} */
  let cssVarsList
  /** @type {string} */
  let scssVars
  /** @type {string} */
  let scssMap
  /** @type {string} */
  let scssMixins
  /** @type {string} */
  let lessVars
  /** @type {string} */
  let jsEsm
  /** @type {string} */
  let jsDts
  /** @type {string} */
  let jsonTokens
  /** @type {string} */
  let cjsJs
  /** @type {string} */
  let cjsDts

  beforeAll(async () => {
    [cssVars, cssVarsList, scssVars, scssMap, scssMixins, lessVars, jsEsm, jsDts, jsonTokens, cjsJs, cjsDts] = await Promise.all([
      distFile('css/custom-properties.css'),
      distFile('css/custom-properties-list.css'),
      distFile('scss/_variables.scss'),
      distFile('scss/_map.scss'),
      distFile('scss/_mixins.scss'),
      distFile('less/variables.less'),
      distFile('js/index.mjs'),
      distFile('js/index.d.ts'),
      distFile('js/tokens.json'),
      distFile('js/cjs/index.js'),
      distFile('js/cjs/index.d.ts'),
    ]).catch((err) => {
      if (err.code === 'ENOENT') {
        throw new Error(`Build artifacts not found. Run 'pnpm build' before running tests.\n\nMissing: ${err.path}`)
      }
      throw err
    })
  })

  // ---------------------------------------------------------------------------
  // Output files
  // ---------------------------------------------------------------------------

  describe('output files', () => {
    it.each(EXPECTED_DIST_FILES)('generates dist/tokens/%s', async (file) => {
      await expect(distFile(file)).resolves.toBeTruthy()
    })
  })

  // ---------------------------------------------------------------------------
  // Source-driven coverage
  // Uses tokens.json (fully resolved, flat) as ground truth and derives the
  // expected name/value for every token in CSS, SCSS, LESS, and ESM.
  // Zero maintenance: adding or changing a token automatically updates these
  // assertions on the next build.
  // ---------------------------------------------------------------------------

  describe('every source token appears in all output formats', () => {
    /** @type {Array<[string, string]>} */
    let tokenEntries

    beforeAll(() => {
      tokenEntries = Object.entries(JSON.parse(jsonTokens))
    })

    it('every token has a CSS custom property with the correct resolved value', () => {
      for (const [key, value] of tokenEntries) {
        const name = `--${key.replaceAll('_', '-')}`
        expect(cssVars, `${name} missing or has wrong value`).toContain(`${name}: ${value};`)
      }
    })

    it('every token has a SCSS variable with the correct resolved value', () => {
      for (const [key, value] of tokenEntries) {
        const name = `$${key.replaceAll('_', '-')}`
        expect(scssVars, `${name} missing or has wrong value`).toContain(`${name}: ${value} !default;`)
      }
    })

    it('every token has a LESS variable with the correct resolved value', () => {
      for (const [key, value] of tokenEntries) {
        const name = `@${key.replaceAll('_', '-')}`
        expect(lessVars, `${name} missing or has wrong value`).toContain(`${name}: ${value};`)
      }
    })

    it('every token has an ESM named export', () => {
      // Value presence is covered by the CSS assertion above; checking names here
      // avoids brittleness from style-dictionary wrapping long export lines.
      for (const [key] of tokenEntries) {
        expect(jsEsm, `export const ${key.toUpperCase()} is missing`).toContain(`export const ${key.toUpperCase()}`)
      }
    })
  })

  // ---------------------------------------------------------------------------
  // css/custom-properties.css
  // ---------------------------------------------------------------------------

  describe('css/custom-properties.css', () => {
    it('includes product name in file header', () => {
      expect(cssVars).toContain('Kong Konnect Design Tokens')
    })

    it('includes GitHub URL in file header', () => {
      expect(cssVars).toContain('GitHub: https://github.com/Kong/design-tokens/tree/main/packages/design-tokens')
    })

    it('includes license in file header', () => {
      expect(cssVars).toContain('License: Apache-2.0')
    })

    it('wraps all tokens inside a :root selector', () => {
      expect(cssVars).toContain(':root {')
    })

    it('uses --kui- prefixed kebab-case custom properties', () => {
      expect(cssVars).toMatch(/--kui-[a-z][a-z0-9-]+:/)
    })

    it('exports at least 330 custom properties', () => {
      const count = (cssVars.match(/^\s+--kui-[a-z]/gm) || []).length
      expect(count).toBeGreaterThanOrEqual(330)
    })

    it('sets variables to their resolved values, not initial', () => {
      // initial belongs only in custom-properties-list.css
      expect(cssVars).not.toMatch(/:\s*initial;/)
    })

    it('has no empty string values (emptyToInitialTransform regression)', () => {
      // If a source token has $value: "" and emptyToInitialTransform is not applied,
      // the output would contain ": ;" — this catches that regression.
      expect(cssVars).not.toMatch(/:\s*;/)
    })

    it('does not expose alias tokens', () => {
      expect(cssVars).not.toMatch(/--kui-color-alias/)
    })
  })

  // ---------------------------------------------------------------------------
  // css/custom-properties-list.css
  // ---------------------------------------------------------------------------

  describe('css/custom-properties-list.css', () => {
    it('includes the IMPORTANT "do not import" warning', () => {
      expect(cssVarsList).toContain('IMPORTANT: You should **not** import this file')
    })

    it('includes default value comments on each variable', () => {
      expect(cssVarsList).toContain('Default value:')
    })

    it('wraps all tokens inside a :root selector', () => {
      expect(cssVarsList).toContain(':root {')
    })

    it('uses --kui- prefixed custom properties', () => {
      expect(cssVarsList).toMatch(/--kui-[a-z][a-z0-9-]+:/)
    })

    it('sets every custom property value to initial', () => {
      const declarations = [...cssVarsList.matchAll(/^\s+--kui-[^:]+:\s*([^;]+);/gm)]
      expect(declarations.length).toBeGreaterThanOrEqual(330)
      for (const [, value] of declarations) {
        expect(value.trim(), `expected "initial" but found "${value.trim()}"`)
          .toBe('initial')
      }
    })

    it('includes the original resolved value in a comment (e.g. Default value: `#ffffff`)', () => {
      expect(cssVarsList).toContain('Default value: `#ffffff`')
    })

    it('does not expose alias tokens', () => {
      expect(cssVarsList).not.toMatch(/--kui-color-alias/)
    })
  })

  // ---------------------------------------------------------------------------
  // scss/_variables.scss
  // ---------------------------------------------------------------------------

  describe('scss/_variables.scss', () => {
    it('uses line-comment style file header (// not /* */)', () => {
      expect(scssVars).toMatch(/^\/\/ Do not edit directly/m)
    })

    it('includes product name in file header', () => {
      expect(scssVars).toContain('Kong Konnect Design Tokens')
    })

    it('includes GitHub URL in file header', () => {
      expect(scssVars).toContain('GitHub: https://github.com/Kong/design-tokens/tree/main/packages/design-tokens')
    })

    it('uses $kui- prefixed kebab-case variables', () => {
      expect(scssVars).toMatch(/^\$kui-[a-z][a-z0-9-]+:/m)
    })

    it('exports at least 330 variables', () => {
      const count = (scssVars.match(/^\$kui-[a-z]/gm) || []).length
      expect(count).toBeGreaterThanOrEqual(330)
    })

    it('marks every variable declaration with !default', () => {
      const declarations = [...scssVars.matchAll(/^\$kui-[^;]+;/gm)]
      expect(declarations.length).toBeGreaterThanOrEqual(330)
      for (const [decl] of declarations) {
        expect(decl, `variable declaration missing !default: "${decl}"`).toContain('!default')
      }
    })

    it('does not expose alias tokens', () => {
      expect(scssVars).not.toMatch(/\$kui-color-alias/)
    })

    it('resolves font-family with embedded single quotes correctly', () => {
      expect(scssVars).toContain("$kui-font-family-text: 'Inter', Roboto, Helvetica, sans-serif !default;")
    })

    it('resolves shadow with multi-value and rgba correctly', () => {
      expect(scssVars).toContain('$kui-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08) !default;')
    })
  })

  // ---------------------------------------------------------------------------
  // scss/_map.scss
  // ---------------------------------------------------------------------------

  describe('scss/_map.scss', () => {
    it('defines the $kui-tokens-map variable', () => {
      expect(scssMap).toContain('$kui-tokens-map: (')
    })

    it('uses single-quoted kebab-case key names', () => {
      expect(scssMap).toMatch(/'kui-[a-z][a-z0-9-]+':/)
    })

    it('closes the map with ); and no trailing comma on the last entry', () => {
      // The last entry before ); must not end with a comma
      expect(scssMap).toMatch(/[^,]\n\);/)
    })

    it('contains resolved color token values', () => {
      expect(scssMap).toContain("'kui-color-background': #ffffff,")
    })

    it('contains resolved space token values', () => {
      expect(scssMap).toContain("'kui-space-10': 2px,")
    })

    it('contains resolved animation token values', () => {
      expect(scssMap).toContain("'kui-animation-duration-20': 0.2s,")
    })

    it('does not expose alias tokens', () => {
      expect(scssMap).not.toMatch(/'kui-color-alias/)
    })
  })

  // ---------------------------------------------------------------------------
  // scss/_mixins.scss
  // ---------------------------------------------------------------------------

  describe('scss/_mixins.scss', () => {
    it('includes product name in file header', () => {
      expect(scssMixins).toContain('Kong Konnect Design Tokens')
    })

    it('defines the kui-css-variables mixin', () => {
      expect(scssMixins).toContain('@mixin kui-css-variables {')
    })

    it('contains --kui- custom property declarations for every token', () => {
      const declarations = (scssMixins.match(/--kui-[a-z][a-z0-9-]+:/g) || []).length
      expect(declarations).toBeGreaterThanOrEqual(330)
    })

    it('does not expose alias tokens', () => {
      expect(scssMixins).not.toMatch(/--kui-color-alias/)
    })
  })

  // ---------------------------------------------------------------------------
  // less/variables.less
  // ---------------------------------------------------------------------------

  describe('less/variables.less', () => {
    it('uses line-comment style file header (// not /* */)', () => {
      expect(lessVars).toMatch(/^\/\/ Do not edit directly/m)
    })

    it('includes product name in file header', () => {
      expect(lessVars).toContain('Kong Konnect Design Tokens')
    })

    it('includes GitHub URL in file header', () => {
      expect(lessVars).toContain('GitHub: https://github.com/Kong/design-tokens/tree/main/packages/design-tokens')
    })

    it('uses @kui- prefixed kebab-case variables', () => {
      expect(lessVars).toMatch(/^@kui-[a-z][a-z0-9-]+:/m)
    })

    it('exports at least 330 variables', () => {
      const count = (lessVars.match(/^@kui-[a-z]/gm) || []).length
      expect(count).toBeGreaterThanOrEqual(330)
    })

    it('does not expose alias tokens', () => {
      expect(lessVars).not.toMatch(/@kui-color-alias/)
    })

    it('resolves font-family with embedded single quotes correctly', () => {
      expect(lessVars).toContain("@kui-font-family-text: 'Inter', Roboto, Helvetica, sans-serif;")
    })

    it('resolves negative letter-spacing correctly', () => {
      expect(lessVars).toContain('@kui-letter-spacing-minus-10: -0.12px;')
    })
  })

  // ---------------------------------------------------------------------------
  // js/index.mjs  (ESM)
  // ---------------------------------------------------------------------------

  describe('js/index.mjs', () => {
    it('includes product name in file header', () => {
      expect(jsEsm).toContain('Kong Konnect Design Tokens')
    })

    it('uses named ES module exports', () => {
      expect(jsEsm).toMatch(/^export const KUI_/m)
    })

    it('names every export in CONSTANT_CASE with a KUI_ prefix', () => {
      const exports = [...jsEsm.matchAll(/^export const ([A-Z0-9_]+) = /gm)]
      expect(exports.length).toBeGreaterThanOrEqual(330)
      for (const [, name] of exports) {
        expect(name, `unexpected export name: "${name}"`).toMatch(/^KUI_[A-Z0-9_]+$/)
      }
    })

    it('assigns a non-empty string value to every export', () => {
      // Single-line:  export const KUI_FOO = "value";
      // Multi-line:   export const KUI_VERY_LONG_NAME =
      //                 "value";   (style-dictionary wraps when the name is long)
      const valueMatches = [...jsEsm.matchAll(/^export const [A-Z0-9_]+ = ?(?:\n\s*)?"[^"]+";/gm)]
      const exportCount = (jsEsm.match(/^export const KUI_/gm) || []).length
      // Every export must have a non-empty string value — empty strings signal a
      // missing emptyToInitialTransform or a broken source token value.
      expect(valueMatches.length).toBe(exportCount)
    })

    it('does not export alias tokens', () => {
      expect(jsEsm).not.toContain('KUI_COLOR_ALIAS')
    })

    it('resolves font-family tokens with embedded single quotes', () => {
      expect(jsEsm).toContain("export const KUI_FONT_FAMILY_TEXT = \"'Inter', Roboto, Helvetica, sans-serif\";")
    })

    it('resolves shadow with multi-value box-shadow syntax', () => {
      expect(jsEsm).toContain('export const KUI_SHADOW = "0px 4px 20px 0px rgba(0, 0, 0, 0.08)";')
    })

    it('resolves negative letter-spacing correctly', () => {
      expect(jsEsm).toContain('export const KUI_LETTER_SPACING_MINUS_10 = "-0.12px";')
    })
  })

  // ---------------------------------------------------------------------------
  // js/index.d.ts  (ESM TypeScript declarations)
  // ---------------------------------------------------------------------------

  describe('js/index.d.ts', () => {
    it('exports TypeScript string literal type declarations', () => {
      expect(jsDts).toMatch(/^export const KUI_[A-Z0-9_]+: "[^"]+";/m)
    })

    it('contains known stable string literal declarations', () => {
      expect(jsDts).toContain('export const KUI_COLOR_BACKGROUND: "#ffffff";')
      expect(jsDts).toContain('export const KUI_SPACE_10: "2px";')
      expect(jsDts).toContain('export const KUI_SPACE_AUTO: "auto";')
      expect(jsDts).toContain('export const KUI_ANIMATION_DURATION_20: "0.2s";')
    })

    it('has a declaration count matching the ESM export count', () => {
      const esmExportCount = (jsEsm.match(/^export const KUI_/gm) || []).length
      const dtsExportCount = (jsDts.match(/^export const KUI_/gm) || []).length
      expect(dtsExportCount).toBe(esmExportCount)
    })
  })

  // ---------------------------------------------------------------------------
  // js/cjs/index.js  (CommonJS)
  // ---------------------------------------------------------------------------

  describe('js/cjs/index.js', () => {
    it('uses module.exports assignment', () => {
      expect(cjsJs).toContain('module.exports = {')
    })

    it('uses CONSTANT_CASE KUI_ property names', () => {
      expect(cjsJs).toMatch(/KUI_[A-Z0-9_]+:\s*"[^"]+"/)
    })

    it('contains known stable token values', () => {
      expect(cjsJs).toContain('KUI_COLOR_BACKGROUND: "#ffffff"')
      expect(cjsJs).toContain('KUI_SPACE_10: "2px"')
      expect(cjsJs).toContain('KUI_ANIMATION_DURATION_20: "0.2s"')
      expect(cjsJs).toContain('KUI_BORDER_RADIUS_CIRCLE: "50%"')
    })

    it('has the same token count as the ESM build', () => {
      const esmCount = (jsEsm.match(/^export const KUI_/gm) || []).length
      const cjsCount = (cjsJs.match(/\bKUI_[A-Z0-9_]+:/g) || []).length
      expect(cjsCount).toBe(esmCount)
    })

    it('does not export alias tokens', () => {
      expect(cjsJs).not.toContain('KUI_COLOR_ALIAS')
    })
  })

  // ---------------------------------------------------------------------------
  // js/cjs/index.d.ts  (CommonJS TypeScript declarations)
  // ---------------------------------------------------------------------------

  describe('js/cjs/index.d.ts', () => {
    it('exports the tokens object via `export =` (CommonJS interop, not `export default`)', () => {
      expect(cjsDts).toContain('export = tokens;')
      expect(cjsDts).not.toContain('export default tokens;')
    })

    it('declares a DesignToken interface', () => {
      expect(cjsDts).toContain('declare interface DesignToken')
    })

    it('declares tokens as a nested const with DesignToken leaves', () => {
      expect(cjsDts).toContain('declare const tokens: {')
      expect(cjsDts).toContain('DesignToken')
    })

    it('contains known top-level token category shapes', () => {
      expect(cjsDts).toContain('color:')
      expect(cjsDts).toContain('space:')
      expect(cjsDts).toContain('font:')
      expect(cjsDts).toContain('animation:')
      expect(cjsDts).toContain('shadow:')
    })
  })

  // ---------------------------------------------------------------------------
  // js/tokens.json
  // ---------------------------------------------------------------------------

  describe('js/tokens.json', () => {
    /** @type {Record<string, string>} */
    let tokens

    beforeAll(() => {
      tokens = JSON.parse(jsonTokens)
    })

    it('is valid JSON with a plain object at the root', () => {
      expect(typeof tokens).toBe('object')
      expect(tokens).not.toBeNull()
      expect(Array.isArray(tokens)).toBe(false)
    })

    it('uses snake_case kui_ prefixed keys', () => {
      const keys = Object.keys(tokens)
      expect(keys.length).toBeGreaterThanOrEqual(330)
      for (const key of keys) {
        expect(key, `unexpected key: "${key}"`).toMatch(/^kui_[a-z0-9_]+$/)
      }
    })

    it('assigns a non-empty string value to every token', () => {
      for (const [key, value] of Object.entries(tokens)) {
        expect(typeof value, `token "${key}" should be a string`).toBe('string')
        expect(value.length, `token "${key}" should not be empty`).toBeGreaterThan(0)
      }
    })

    it('does not contain alias tokens', () => {
      const aliasKeys = Object.keys(tokens).filter(k => k.includes('alias'))
      expect(aliasKeys).toHaveLength(0)
    })

    it('resolves tokens with complex values correctly', () => {
      expect(tokens.kui_shadow).toBe('0px 4px 20px 0px rgba(0, 0, 0, 0.08)')
      expect(tokens.kui_font_family_text).toBe("'Inter', Roboto, Helvetica, sans-serif")
      expect(tokens.kui_border_radius_circle).toBe('50%')
      expect(tokens.kui_letter_spacing_minus_10).toBe('-0.12px')
      expect(tokens.kui_animation_duration_20).toBe('0.2s')
      expect(tokens.kui_breakpoint_mobile).toBe('640px')
    })
  })

  // ---------------------------------------------------------------------------
  // Cross-format consistency
  // ---------------------------------------------------------------------------

  describe('component tokens are excluded from semantic outputs', () => {
    it('component tokens do not appear in custom-properties.css', () => {
      expect(cssVars).not.toMatch(/--kui-button-/)
      expect(cssVars).not.toMatch(/--kui-card-/)
      expect(cssVars).not.toMatch(/--kui-input-/)
      expect(cssVars).not.toMatch(/--kui-badge-/)
    })

    it('component tokens do not appear in js/index.mjs', () => {
      expect(jsEsm).not.toMatch(/KUI_BUTTON_/)
      expect(jsEsm).not.toMatch(/KUI_CARD_/)
      expect(jsEsm).not.toMatch(/KUI_INPUT_/)
      expect(jsEsm).not.toMatch(/KUI_BADGE_/)
    })
  })

  describe('cross-format consistency', () => {
    it('all formats export the same number of tokens', () => {
      const cssCount = (cssVars.match(/^\s+--kui-[a-z]/gm) || []).length
      const scssVarCount = (scssVars.match(/^\$kui-[a-z]/gm) || []).length
      const lessCount = (lessVars.match(/^@kui-[a-z]/gm) || []).length
      const esmCount = (jsEsm.match(/^export const KUI_/gm) || []).length
      const jsonCount = Object.keys(JSON.parse(jsonTokens)).length

      expect(scssVarCount).toBe(cssCount)
      expect(lessCount).toBe(cssCount)
      expect(esmCount).toBe(cssCount)
      expect(jsonCount).toBe(cssCount)
    })

    it('kui-color-background resolves to #ffffff in every format', () => {
      expect(cssVars).toContain('--kui-color-background: #ffffff;')
      expect(scssVars).toContain('$kui-color-background: #ffffff !default;')
      expect(lessVars).toContain('@kui-color-background: #ffffff;')
      expect(jsEsm).toContain('export const KUI_COLOR_BACKGROUND = "#ffffff";')
      expect(JSON.parse(jsonTokens).kui_color_background).toBe('#ffffff')
    })

    it('kui-space-10 resolves to 2px in every format', () => {
      expect(cssVars).toContain('--kui-space-10: 2px;')
      expect(scssVars).toContain('$kui-space-10: 2px !default;')
      expect(lessVars).toContain('@kui-space-10: 2px;')
      expect(jsEsm).toContain('export const KUI_SPACE_10 = "2px";')
      expect(JSON.parse(jsonTokens).kui_space_10).toBe('2px')
    })

    it('kui-shadow resolves to its full multi-value string in every format', () => {
      const shadowValue = '0px 4px 20px 0px rgba(0, 0, 0, 0.08)'
      expect(cssVars).toContain(`--kui-shadow: ${shadowValue};`)
      expect(scssVars).toContain(`$kui-shadow: ${shadowValue} !default;`)
      expect(lessVars).toContain(`@kui-shadow: ${shadowValue};`)
      expect(jsEsm).toContain(`export const KUI_SHADOW = "${shadowValue}";`)
      expect(JSON.parse(jsonTokens).kui_shadow).toBe(shadowValue)
    })

    it('custom-properties-list.css has the same token count as custom-properties.css', () => {
      const regularCount = (cssVars.match(/^\s+--kui-[a-z]/gm) || []).length
      const listCount = (cssVarsList.match(/^\s+--kui-[a-z]/gm) || []).length
      expect(listCount).toBe(regularCount)
    })

    it('TypeScript declaration count matches ESM export count', () => {
      const esmCount = (jsEsm.match(/^export const KUI_/gm) || []).length
      const dtsCount = (jsDts.match(/^export const KUI_/gm) || []).length
      expect(dtsCount).toBe(esmCount)
    })
  })
})

// ---------------------------------------------------------------------------
// dist/themeable-tokens.mjs / .cjs / .d.ts
// ---------------------------------------------------------------------------

describe('dist/themeable-tokens (full themed surface)', () => {
  /** @type {string} */
  let themeableTokensMjs
  /** @type {string} */
  let themeableTokensCjs
  /** @type {string} */
  let themeableTokensDts
  /** @type {string} */
  let themeableTokensDcts

  beforeAll(async () => {
    ;[themeableTokensMjs, themeableTokensCjs, themeableTokensDts, themeableTokensDcts] = await Promise.all([
      distRootFile('themeable-tokens.mjs'),
      distRootFile('themeable-tokens.cjs'),
      distRootFile('themeable-tokens.d.ts'),
      distRootFile('themeable-tokens.d.cts'),
    ]).catch((err) => {
      if (err.code === 'ENOENT') {
        throw new Error(`dist/themeable-tokens.* not found. Run 'pnpm build:tokens' first.\n\nMissing: ${err.path}`)
      }
      throw err
    })
  })

  it('ESM exports KUI_THEMEABLE_TOKENS as a named const', () => {
    expect(themeableTokensMjs).toContain('export const KUI_THEMEABLE_TOKENS = [')
  })

  it('CJS exports KUI_THEMEABLE_TOKENS via module.exports', () => {
    expect(themeableTokensCjs).toContain('module.exports = { KUI_THEMEABLE_TOKENS }')
  })

  it('d.ts declares KUI_THEMEABLE_TOKENS as a typed readonly tuple (not string[])', () => {
    expect(themeableTokensDts).toContain('export declare const KUI_THEMEABLE_TOKENS: readonly [')
    expect(themeableTokensDts).not.toContain('readonly string[]')
  })

  it('emits a CJS-flavored d.cts (for the require condition) matching the d.ts', () => {
    expect(themeableTokensDcts).toContain('export declare const KUI_THEMEABLE_TOKENS: readonly [')
    expect(themeableTokensDcts).toEqual(themeableTokensDts)
  })

  it('contains semantic tokens', () => {
    expect(themeableTokensMjs).toContain('--kui-color-text-primary')
    expect(themeableTokensMjs).toContain('--kui-border-radius-30')
    expect(themeableTokensMjs).toContain('--kui-shadow-focus')
  })

  it('contains component tokens', () => {
    expect(themeableTokensMjs).toContain('--kui-button-')
    expect(themeableTokensMjs).toContain('--kui-card-')
    expect(themeableTokensMjs).toContain('--kui-input-')
    expect(themeableTokensMjs).toContain('--kui-badge-')
  })

  it('each entry is an object exposing name, description, category, and value', () => {
    // Field lines are 4-space indented under a 2-space-indented object literal.
    const nameCount = (themeableTokensMjs.match(/\n {4}name: "--kui-/g) || []).length
    const descCount = (themeableTokensMjs.match(/\n {4}description: /g) || []).length
    const catCount = (themeableTokensMjs.match(/\n {4}category: "/g) || []).length
    const valCount = (themeableTokensMjs.match(/\n {4}value: /g) || []).length

    expect(nameCount).toBeGreaterThan(0)
    expect(descCount).toBe(nameCount)
    expect(catCount).toBe(nameCount)
    expect(valCount).toBe(nameCount)
  })

  it('value-less component tokens carry category "component" and a null value', () => {
    expect(themeableTokensMjs).toMatch(
      /name: "--kui-badge-border-radius",\n {4}description: ".*",\n {4}category: "component",\n {4}value: null,/,
    )
  })

  it('semantic tokens carry their token family as the category and a non-null value', () => {
    expect(themeableTokensMjs).toMatch(
      /name: "--kui-breakpoint-mobile",\n {4}description: ".*",\n {4}category: "breakpoint",\n {4}value: "[^"]+",/,
    )
    expect(themeableTokensMjs).toMatch(
      /name: "--kui-color-text-primary",\n {4}description: ".*",\n {4}category: "color",\n {4}value: "[^"]+",/,
    )
  })

  it('contains no duplicate token names', () => {
    const names = [...themeableTokensMjs.matchAll(/name: "(--kui-[^"]+)"/g)].map(([, n]) => n)
    expect(new Set(names).size).toBe(names.length)
  })

  it('includes the 5 breakpoint tokens', () => {
    const names = [...themeableTokensMjs.matchAll(/name: "(--kui-breakpoint-[^"]+)"/g)].map(([, n]) => n)

    expect(names).toHaveLength(5)
    expect(names).toEqual(expect.arrayContaining([
      '--kui-breakpoint-mobile',
      '--kui-breakpoint-phablet',
      '--kui-breakpoint-tablet',
      '--kui-breakpoint-laptop',
      '--kui-breakpoint-desktop',
    ]))
  })

  it('all entries follow the --kui-* naming convention', () => {
    const names = [...themeableTokensMjs.matchAll(/name: "(--kui-[^"]+)"/g)].map(([, n]) => n)
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) {
      expect(name, `"${name}" does not start with --kui-`).toMatch(/^--kui-[a-z]/)
    }
  })

  it('list is alphabetically sorted by name', () => {
    const names = [...themeableTokensMjs.matchAll(/name: "(--kui-[^"]+)"/g)].map(([, n]) => n)
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(sorted)
  })

  it('d.ts types name and category as literals with a string|null value', () => {
    expect(themeableTokensDts).toContain('readonly name: "--kui-')
    expect(themeableTokensDts).toContain('readonly category: "')
    expect(themeableTokensDts).toContain('readonly description: string')
    expect(themeableTokensDts).toContain('readonly value: string | null')
  })

  it('d.ts documents the breakpoint exclusion reason', () => {
    expect(themeableTokensDts).toContain('@media feature queries')
  })
})

// ---------------------------------------------------------------------------
// tokens/components/ — source-level enforcement
// ---------------------------------------------------------------------------

describe('tokens/components/ (source enforcement)', () => {
  const COMPONENT_DIR = join(__dirname, 'tokens/components')

  /**
   * Recursively collect every token leaf (object with a `$value` key) from a
   * parsed DTCG token tree, returning `{ path, value }` pairs.
   * @param {object} obj
   * @param {string} filePath - Used in assertion messages.
   * @param {string[]} path
   * @param {Array<{ tokenPath: string, value: unknown }>} acc
   */
  function collectTokenValues(obj, filePath, path = [], acc = []) {
    if (typeof obj !== 'object' || obj === null) return acc
    if ('$value' in obj) {
      acc.push({ tokenPath: `${filePath}:${path.join('.')}`, value: obj.$value })
      return acc
    }
    for (const [key, child] of Object.entries(obj)) {
      if (!key.startsWith('$')) collectTokenValues(child, filePath, [...path, key], acc)
    }
    return acc
  }

  it('every component token has an empty string $value (value-less by design)', async () => {
    const { readdir } = await import('node:fs/promises')
    const files = await readdir(COMPONENT_DIR)
    const jsonFiles = files.filter(f => f.endsWith('.json'))
    expect(jsonFiles.length, 'no component token files found').toBeGreaterThan(0)

    const violations = []
    await Promise.all(
      jsonFiles.map(async file => {
        const parsed = JSON.parse(await readFile(join(COMPONENT_DIR, file), 'utf-8'))
        const tokens = collectTokenValues(parsed, file)
        for (const { tokenPath, value } of tokens) {
          if (value !== '') {
            violations.push(`${tokenPath} → ${JSON.stringify(value)} (must be "")`)
          }
        }
      }),
    )

    expect(
      violations,
      `Component tokens must be value-less (empty string $value). Violations:\n${violations.join('\n')}`,
    ).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// dist/themes/
// ---------------------------------------------------------------------------

const THEME_NAMES = ['classic-day', 'classic-night', 'konnect-day', 'konnect-night']

describe('dist/themes/', () => {
  /** @type {Record<string, { css: string, mjs: string, dts: string }>} */
  const themes = {}

  beforeAll(async () => {
    await Promise.all(
      THEME_NAMES.map(async (name) => {
        const [css, mjs, dts] = await Promise.all([
          distRootFile(`themes/${name}.css`),
          distRootFile(`themes/${name}.mjs`),
          distRootFile(`themes/${name}.d.ts`),
        ]).catch((err) => {
          if (err.code === 'ENOENT') {
            throw new Error(`dist/themes/${name}.* not found. Run 'pnpm build:tokens' first.\n\nMissing: ${err.path}`)
          }
          throw err
        })
        themes[name] = { css, mjs, dts }
      }),
    )
  })

  it('generates CSS, MJS, and d.ts for each theme', () => {
    for (const name of THEME_NAMES) {
      expect(themes[name].css.length, `${name}.css is empty`).toBeGreaterThan(0)
      expect(themes[name].mjs.length, `${name}.mjs is empty`).toBeGreaterThan(0)
      expect(themes[name].dts.length, `${name}.d.ts is empty`).toBeGreaterThan(0)
    }
  })

  it('CSS files use @layer kui.theme with [data-kui-theme] selector', () => {
    for (const name of THEME_NAMES) {
      expect(themes[name].css, `${name}.css missing @layer`).toContain('@layer kui.theme {')
      expect(themes[name].css, `${name}.css missing data-kui-theme selector`).toContain(`[data-kui-theme="${name}"]`)
    }
  })

  it('CSS files contain only resolved values (no DTCG references or var() calls)', () => {
    for (const name of THEME_NAMES) {
      expect(themes[name].css, `${name}.css has unresolved {…} DTCG reference`).not.toMatch(/\{[a-z]/)
      expect(themes[name].css, `${name}.css has residual var(--kui-color-alias`).not.toContain('var(--kui-color-alias')
      expect(themes[name].css, `${name}.css has undefined values (token.$value not token.value)`).not.toContain(': undefined;')
    }
  })

  it('CSS files contain concrete token values (spot-check)', () => {
    const css = themes['konnect-day'].css
    // At least some color values should be hex
    expect(css).toMatch(/#[0-9a-fA-F]{3,8}/)
    // At least some size values should be px or rem
    expect(css).toMatch(/\d+px|\d+rem/)
  })

  it('MJS files export the named theme object (no "Theme" suffix)', () => {
    const expectedExportNames = {
      'classic-day': 'classicDay',
      'classic-night': 'classicNight',
      'konnect-day': 'konnectDay',
      'konnect-night': 'konnectNight',
    }
    for (const name of THEME_NAMES) {
      expect(themes[name].mjs, `${name}.mjs missing named export`).toContain(
        `export const ${expectedExportNames[name]}`,
      )
      expect(themes[name].mjs, `${name}.mjs should not use "Theme" suffix`).not.toContain(
        `export const ${expectedExportNames[name]}Theme`,
      )
    }
  })

  it('d.ts files declare the theme as Readonly<Record<string, string>>', () => {
    for (const name of THEME_NAMES) {
      expect(themes[name].dts, `${name}.d.ts missing type declaration`).toContain(
        'Readonly<Record<string, string>>',
      )
    }
  })

  it('index.mjs re-exports all four themes without "Theme" suffix', async () => {
    const indexMjs = await distRootFile('themes/index.mjs')
    expect(indexMjs).toContain('classicDay')
    expect(indexMjs).toContain('classicNight')
    expect(indexMjs).not.toContain('classicDayTheme')
    expect(indexMjs).not.toContain('classicNightTheme')
    expect(indexMjs).toContain('konnectDay')
    expect(indexMjs).toContain('konnectNight')
    expect(indexMjs).not.toContain('konnectDayTheme')
    expect(indexMjs).not.toContain('konnectNightTheme')
  })

  it('all themes include the five fixed breakpoint tokens', () => {
    const BREAKPOINTS = [
      '--kui-breakpoint-mobile',
      '--kui-breakpoint-phablet',
      '--kui-breakpoint-tablet',
      '--kui-breakpoint-laptop',
      '--kui-breakpoint-desktop',
    ]
    for (const name of THEME_NAMES) {
      for (const bp of BREAKPOINTS) {
        expect(themes[name].css, `${name}.css missing ${bp}`).toContain(bp)
        expect(themes[name].mjs, `${name}.mjs missing ${bp}`).toContain(bp)
      }
    }
  })
})
