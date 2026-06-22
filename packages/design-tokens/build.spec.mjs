import { describe, it, expect, beforeAll } from 'vitest'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, 'dist/tokens')

/** @param {string} relativePath */
async function distFile(relativePath) {
  return readFile(join(DIST_DIR, relativePath), 'utf-8')
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
    it('exports a default tokens object', () => {
      expect(cjsDts).toContain('export default tokens;')
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
