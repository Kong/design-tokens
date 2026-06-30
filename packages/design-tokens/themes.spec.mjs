/**
 * Theme drift guards.
 *
 * Verifies every theme contains the right token set and resolves to the right values:
 *   - exhaustive themes (konnect-day, konnect-night) contain EXACTLY KUI_THEMEABLE_TOKENS;
 *   - semantic-only themes (classic-day, classic-night) contain every semantic token and ZERO
 *     component tokens;
 *   - every alias palette matches the names-only `_manifest.json` key set, with value-derived
 *     `$description`s, and every compiled theme color traces to that theme's own palette;
 *   - every theme file follows the `<theme-name>.theme.json` naming convention;
 *   - the per-theme alias build wiring throws (never silently falls back) for a misconfigured theme;
 *   - classic-day's and classic-night's resolved output is frozen by golden snapshots.
 *
 * All reads target the repo's own source/dist; nothing on disk is modified by the tests.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { readFile } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { manifestLeaves, paletteLeaves } from './scripts/alias-manifest.mjs'
import { aliasIncludesFor, THEME_BREAKPOINTS, injectThemeBreakpoints } from './platforms/themes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname

// ── Theme taxonomy ──────────────────────────────────────────────────────────
// Which themes must contain which token set. This is policy, NOT derivable from the filename
// (themes/ also holds the semantic-only `classic-day`/`classic-night`
// so it is declared explicitly and cross-checked against themes/ by the
// "classification" guard below.

/** Themes that MUST contain every themeable token (semantic + component). */
const EXHAUSTIVE_THEMES = ['konnect-day', 'konnect-night']

/**
 * Themes that MUST contain every SEMANTIC token and ZERO component tokens.
 *
 * `classic-day` is the default theme (the resolved `:root` exports) and `classic-night` is its dark
 * counterpart — identical alias palette, with a handful of semantic tokens (text/border/background)
 * re-pointed to darker steps. Both deliberately set no component tokens, so every component falls
 * through to its semantic default via the Kongponents `var()` chain. This repo owns the
 * component-token namespace (`tokens/components/`) but NOT the component→semantic fallback map
 * (that lives in Kongponents SCSS), so "contains no component token" is the only fallthrough
 * guarantee this repo can verify — hence component-free by omission.
 */
const SEMANTIC_ONLY_THEMES = ['classic-day', 'classic-night']

// Style Dictionary stamps a volatile `Generated on <date>` line into the main build's file header;
// neutralize it so the snapshot tracks resolved-value drift, not the clock.
const stripTimestamp = (css) => css.replace(/Generated on [^\n]*/g, 'Generated on <stripped>')

/**
 * The canonical themeable-token list (`--kui-*` names), read from the built dist.
 * The `pretest` hook (`pnpm build:tokens`) guarantees `dist/themeable-tokens.mjs` exists first.
 * @returns {Promise<readonly string[]>}
 */
async function getThemeableTokens() {
  const { KUI_THEMEABLE_TOKENS } = await import(join(ROOT, 'dist', 'themeable-tokens.mjs'))
  return KUI_THEMEABLE_TOKENS
}

/**
 * Every component-token name (without the leading `--`) declared in `tokens/components/*.json` —
 * the namespace a semantic-only theme must omit (its components fall through to their semantic default).
 * @returns {Promise<Set<string>>}
 */
async function getComponentTokenNames() {
  const dir = join(ROOT, 'tokens', 'components')
  const names = new Set()
  const walk = (node, path) => {
    if (node && node.$value !== undefined) {
      names.add('kui-' + path.filter(s => s !== '_').map(s => s.replace(/[\W_]+/g, '-')).join('-'))
      return
    }
    if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        if (!key.startsWith('$')) walk(value, [...path, key])
      }
    }
  }
  for (const file of readdirSync(dir).filter(f => f.endsWith('.json'))) {
    walk(JSON.parse(await readFile(join(dir, file), 'utf-8')), [])
  }
  return names
}

/** Lazily loaded shared inputs. */
let themeable

beforeAll(async () => {
  themeable = await getThemeableTokens()
})

/**
 * Read a theme file from the repo's own `themes/` directory. Self-contained:
 * the suite reads only design-tokens' own source, never external artifacts.
 *
 * @param {string} name - Theme name (no extension).
 * @returns {Promise<Record<string, object>>}
 */
async function loadTheme(name) {
  return JSON.parse(await readFile(join(ROOT, 'themes', `${name}.theme.json`), 'utf-8'))
}

describe('drift guard: exhaustive themes contain exactly KUI_THEMEABLE_TOKENS', () => {
  // Breakpoints are always injected at build time by platforms/themes.mjs and must NOT appear
  // in source theme files — exclude them from the drift guard comparison.
  const buildInjected = new Set(Object.keys(THEME_BREAKPOINTS))

  for (const themeName of EXHAUSTIVE_THEMES) {
    it(`${themeName} has no missing or extra tokens`, async () => {
      const theme = await loadTheme(themeName)
      const expected = new Set(themeable.map(t => t.slice(2)).filter(t => !buildInjected.has(t)))
      const actual = new Set(Object.keys(theme))

      const missing = [...expected].filter(k => !actual.has(k)).sort()
      const extra = [...actual].filter(k => !expected.has(k)).sort()

      // Surface specific names on failure.
      expect(missing, `MISSING tokens in ${themeName}: ${missing.join(', ')}`).toEqual([])
      expect(extra, `EXTRA tokens in ${themeName}: ${extra.join(', ')}`).toEqual([])
    })
  }
})

describe('drift guard: semantic-only themes are semantic-complete and component-free', () => {
  // Breakpoints are always injected at build time by platforms/themes.mjs and must NOT appear
  // in source theme files — exclude them from the drift guard comparison.
  const buildInjected = new Set(Object.keys(THEME_BREAKPOINTS))

  for (const themeName of SEMANTIC_ONLY_THEMES) {
    it(`${themeName} contains every semantic token and ZERO component tokens`, async () => {
      const theme = await loadTheme(themeName)
      const componentNames = await getComponentTokenNames()
      // Expected = every themeable token that is NOT a component token and NOT build-injected.
      const expected = new Set(themeable.map(t => t.slice(2)).filter(t => !componentNames.has(t) && !buildInjected.has(t)))
      const actual = new Set(Object.keys(theme))

      const missing = [...expected].filter(k => !actual.has(k)).sort()
      // Component-freeness is the verifiable fallthrough guarantee (the repo can't
      // verify a snapshot equals its semantic fallback — that map lives in Kongponents).
      const componentPresent = [...actual].filter(k => componentNames.has(k)).sort()
      const extra = [...actual].filter(k => !expected.has(k) && !componentNames.has(k)).sort()

      expect(missing, `MISSING semantic tokens in ${themeName}: ${missing.join(', ')}`).toEqual([])
      expect(componentPresent, `${themeName} must set NO component tokens (fallthrough by omission); found: ${componentPresent.join(', ')}`).toEqual([])
      expect(extra, `EXTRA non-themeable tokens in ${themeName}: ${extra.join(', ')}`).toEqual([])
    })
  }
})

describe('theme classification stays in sync with themes/', () => {
  // Guards the hard-coded taxonomy above against the actual directory: a newly added theme file
  // that nobody classified (or a classified theme whose file was removed) fails here instead of
  // silently going untested. "Exhaustive" itself can't be inferred from the filename — it's policy.
  it('every themes/*.json is classified exactly once (exhaustive | semantic-only | unchecked)', () => {
    const onDisk = readdirSync(join(ROOT, 'themes'))
      .filter(f => f.endsWith('.theme.json') && !f.startsWith('_'))
      .map(f => f.slice(0, -'.theme.json'.length))
      .sort()
    const classified = [...EXHAUSTIVE_THEMES, ...SEMANTIC_ONLY_THEMES].sort()

    const unclassified = onDisk.filter(t => !classified.includes(t))
    const missing = classified.filter(t => !onDisk.includes(t))
    const duplicated = classified.filter((t, i) => classified.indexOf(t) !== i)

    expect(unclassified, `Unclassified theme(s) in themes/ — add each to EXHAUSTIVE_THEMES or SEMANTIC_ONLY_THEMES: ${unclassified.join(', ')}`).toEqual([])
    expect(missing, `Classified theme(s) missing from themes/: ${missing.join(', ')}`).toEqual([])
    expect(duplicated, `Theme(s) classified in more than one bucket: ${duplicated.join(', ')}`).toEqual([])
  })
})

describe('theme files follow the <theme-name>.theme.json naming convention', () => {
  // Enforces the same rule the build enforces (platforms/themes.mjs discoverThemes): a stray theme JSON
  // that does not end in `.theme.json` fails here with its name, instead of being silently skipped by
  // the build's discovery filter.
  it('every non-internal .json in themes/ is named <theme-name>.theme.json', () => {
    const offenders = readdirSync(join(ROOT, 'themes'))
      .filter(f => f.endsWith('.json') && !f.startsWith('_') && !f.endsWith('.theme.json'))
      .sort()
    expect(offenders, `Theme file(s) must be named <theme-name>.theme.json; rename: ${offenders.join(', ')}`).toEqual([])
  })
})

const ALIAS_DIR = join(ROOT, 'tokens', 'alias', 'color')
// Auto-discover every palette file (exclude `_manifest.json` and any other `_`-prefixed internal
// file) so a newly added palette is enrolled in these guards without editing this test.
const PALETTE_FILES = readdirSync(ALIAS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'))

describe('drift guard: alias palettes contain exactly the _manifest.json key set', () => {
  for (const file of PALETTE_FILES) {
    it(`${file} contains exactly the manifest aliases (no missing, no extra)`, async () => {
      const manifest = JSON.parse(await readFile(join(ALIAS_DIR, '_manifest.json'), 'utf-8'))
      const palette = JSON.parse(await readFile(join(ALIAS_DIR, file), 'utf-8'))
      const expected = manifestLeaves(manifest)
      const actual = paletteLeaves(palette)
      const missing = [...expected].filter(k => !actual.has(k)).sort()
      const extra = [...actual].filter(k => !expected.has(k)).sort()
      expect(missing, `${file} MISSING aliases: ${missing.join(', ')}`).toEqual([])
      expect(extra, `${file} EXTRA aliases: ${extra.join(', ')}`).toEqual([])
    })
  }
})

describe('alias palette $description is value-derived', () => {
  // Guards the invariant that every color leaf reads `Alias for <value>.` — so a hand-edit of a
  // value that forgets to update the description (or a stale figma description) fails CI.
  for (const file of PALETTE_FILES) {
    it(`${file} color entries match "Alias for <value>."`, async () => {
      const palette = JSON.parse(await readFile(join(ALIAS_DIR, file), 'utf-8'))
      const stale = []
      const walk = (node) => {
        if (node && typeof node === 'object' && node.$value !== undefined) {
          const expected = `Alias for ${node.$value}.`
          if (node.$description !== expected) stale.push(`${node.$value}: got "${node.$description}"`)
          return
        }
        if (node && typeof node === 'object') for (const child of Object.values(node)) walk(child)
      }
      walk(palette.color.alias)
      expect(stale, `${file} non-value-derived $descriptions: ${stale.join('; ')}`).toEqual([])
    })
  }
})

describe('every theme color resolves to a value in its own alias palette (no off-source colors)', () => {
  // The core guarantee of the per-theme refactor: nothing in a compiled theme renders a color that
  // isn't in that theme's alias palette — including colors embedded in composite box-shadow / rgba /
  // color-mix values. Codifies the previously-manual off-source audit so it can't silently regress.
  // Normalize colors so equal values compare equal: `#abc` → `#aabbcc`, lowercased.
  const normalizeColor = (h) => {
    const s = h.trim().toLowerCase()
    const m = s.match(/^#([0-9a-f]{3})$/)
    return m ? `#${m[1][0]}${m[1][0]}${m[1][1]}${m[1][1]}${m[1][2]}${m[1][2]}` : s
  }
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => Number(x).toString(16).padStart(2, '0')).join('')

  for (const file of PALETTE_FILES) {
    const name = file.slice(0, -5)
    it(`${name}.css renders only colors present in ${file}`, async () => {
      const palette = JSON.parse(await readFile(join(ALIAS_DIR, file), 'utf-8'))
      const palVals = new Set()
      const collect = (node) => {
        if (node && typeof node === 'object' && node.$value !== undefined) {
          if (typeof node.$value === 'string' && node.$value.startsWith('#')) palVals.add(normalizeColor(node.$value))
          return
        }
        if (node && typeof node === 'object') for (const child of Object.values(node)) collect(child)
      }
      collect(palette.color.alias)

      const css = await readFile(join(ROOT, 'dist', 'themes', `${name}.css`), 'utf-8')
      const off = new Set()
      for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        const h = normalizeColor(m[0])
        if (!palVals.has(h)) off.add(h)
      }
      for (const m of css.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)) {
        const h = normalizeColor(rgbToHex(m[1], m[2], m[3]))
        if (!palVals.has(h)) off.add(h)
      }
      expect([...off], `${name}.css renders colors absent from ${file}: ${[...off].join(', ')}`).toEqual([])
    })
  }
})

describe('build wiring: injectThemeBreakpoints preprocessor', () => {
  it('all THEME_BREAKPOINTS values are non-undefined strings', () => {
    for (const [name, value] of Object.entries(THEME_BREAKPOINTS)) {
      expect(typeof value, `${name} has non-string value`).toBe('string')
    }
  })

  it('injects all 5 breakpoints into a dictionary that has none', () => {
    const result = injectThemeBreakpoints({ 'kui-color-text': { $value: '#000', isSource: true } })
    for (const [name, value] of Object.entries(THEME_BREAKPOINTS)) {
      expect(result[name]).toEqual({ $value: value, isSource: true })
    }
  })

  it('overrides a theme-defined breakpoint value with the canonical value', () => {
    const overrideValue = '9999px'
    const dict = { 'kui-breakpoint-mobile': { $value: overrideValue, isSource: true } }
    const result = injectThemeBreakpoints(dict)
    expect(result['kui-breakpoint-mobile'].$value).toBe(THEME_BREAKPOINTS['kui-breakpoint-mobile'])
    expect(result['kui-breakpoint-mobile'].$value).not.toBe(overrideValue)
  })

  it('preserves non-breakpoint tokens unchanged', () => {
    const token = { $value: '#fff', isSource: true }
    const result = injectThemeBreakpoints({ 'kui-color-background': token })
    expect(result['kui-color-background']).toBe(token)
  })

  it('marks all injected tokens isSource: true', () => {
    const result = injectThemeBreakpoints({})
    for (const name of Object.keys(THEME_BREAKPOINTS)) {
      expect(result[name].isSource).toBe(true)
    }
  })
})

describe('build wiring: aliasIncludesFor (per-theme palette resolution)', () => {
  it('includes the per-theme palette when it exists', () => {
    expect(aliasIncludesFor('konnect-day', true, null)).toEqual(['./tokens/alias/color/konnect-day.json'])
  })

  it('throws when an alias-using theme has no palette (no silent fallback)', () => {
    const theme = { 'kui-color-text': { $value: '{color.alias.gray.10}' } }
    expect(() => aliasIncludesFor('konnect-contrast', false, theme)).toThrow(/references \{color\.alias/)
  })
})

describe('classic-day / classic-night themes are unchanged (golden snapshot)', () => {
  // classic-day is the default palette + theme; classic-night is its fixed dark counterpart. Both are
  // deterministic (no designer tuning), so their resolved output is frozen — any change fails here and
  // must be accepted explicitly (`vitest -u`). konnect day/night are intentionally NOT snapshotted —
  // they evolve with tuning; their guarantees are structural (drift guard + off-source + $description).

  for (const themeName of SEMANTIC_ONLY_THEMES) {
    it(`dist/themes/${themeName}.css resolved output remains unchanged`, async () => {
      const css = await readFile(join(ROOT, 'dist', 'themes', `${themeName}.css`), 'utf-8')
      await expect(stripTimestamp(css)).toMatchFileSnapshot(join(ROOT, '__snapshots__', 'themes', `${themeName}.css`))
    })
  }
})

describe('semantic token exports are unchanged (golden snapshot)', () => {
  it('dist/tokens/css/custom-properties.css resolved output remains unchanged', async () => {
    const css = await readFile(join(ROOT, 'dist', 'tokens', 'css', 'custom-properties.css'), 'utf-8')
    await expect(stripTimestamp(css)).toMatchFileSnapshot(join(ROOT, '__snapshots__', 'tokens', 'css', 'custom-properties.css'))
  })

  it('dist/tokens/js/index.mjs resolved output remains unchanged', async () => {
    const css = await readFile(join(ROOT, 'dist', 'tokens', 'js', 'index.mjs'), 'utf-8')
    await expect(stripTimestamp(css)).toMatchFileSnapshot(join(ROOT, '__snapshots__', 'tokens', 'js', 'index.mjs'))
  })

  it('dist/tokens/scss/_variables.scss resolved output remains unchanged', async () => {
    const css = await readFile(join(ROOT, 'dist', 'tokens', 'scss', '_variables.scss'), 'utf-8')
    await expect(stripTimestamp(css)).toMatchFileSnapshot(join(ROOT, '__snapshots__', 'tokens', 'scss', '_variables.scss'))
  })
})
