/**
 * Theme drift guards.
 *
 * Verifies every theme contains the right token set and resolves to the right values:
 *   - exhaustive themes (electric-lime-day, electric-lime-night) contain EXACTLY KUI_THEMEABLE_TOKENS;
 *   - semantic-only themes (classic-day, classic-night) contain every semantic token and ZERO
 *     component tokens;
 *   - every alias palette matches the names-only `_manifest.alias.color.json` key set, with
 *     value-derived `$description`s, and every compiled theme color traces to that theme's own palette;
 *   - every theme file follows the `<theme-name>/<theme-name>.theme.json` naming convention, and every
 *     alias palette its companion `<theme-name>/<theme-name>.alias.color.json` convention;
 *   - the per-theme alias build wiring throws (never silently falls back) for a misconfigured theme;
 *   - classic-day's and classic-night's resolved output is frozen by golden snapshots.
 *
 * All reads target the repo's own source/dist; nothing on disk is modified by the tests.
 */

import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest'
import StyleDictionary from 'style-dictionary'
import { logVerbosityLevels } from 'style-dictionary/enums'
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

import { manifestLeaves, paletteLeaves } from './scripts/alias-manifest.mjs'
import { aliasIncludesFor, THEME_BREAKPOINTS, SEMANTIC_ONLY_THEMES, injectThemeBreakpoints, discoverThemes, createThemePlatforms } from './platforms/themes.mjs'
import { flattenTokenTree } from './utilities/token-tree.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname

// ── Theme taxonomy ──────────────────────────────────────────────────────────
// Exhaustive is the DEFAULT: every theme in themes/ must contain the full themeable-token set,
// UNLESS it is explicitly opted out as semantic-only below. A newly added theme is therefore
// covered by the exhaustive drift guard automatically, with no edit to this file — which is what
// lets the theme-creation skill's scaffold add a theme without touching themes.spec.mjs.

/**
 * Every theme file on disk (`themes/*.theme.json`, excluding `_`-prefixed partials), minus the
 * semantic-only opt-outs above, is exhaustive — derived from the directory so classification needs
 * no manual bookkeeping. "Exhaustive" can't be inferred from a filename, but "everything that
 * isn't one of the two known semantic-only themes" can, and that is the actual policy.
 */
const ALL_THEMES = readdirSync(join(ROOT, 'themes'), { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('_'))
  .map(e => e.name)
  .sort()

/** Themes that MUST contain every themeable token (semantic + component). */
const EXHAUSTIVE_THEMES = ALL_THEMES.filter(t => !SEMANTIC_ONLY_THEMES.includes(t))

// Style Dictionary stamps a volatile `Generated on <date>` line into the main build's file header;
// neutralize it so the snapshot tracks resolved-value drift, not the clock.
const stripTimestamp = (css) => css.replace(/Generated on [^\n]*/g, 'Generated on <stripped>')

/**
 * The canonical themeable-token list (`--kui-*` names), read from the built dist.
 * `KUI_THEMEABLE_TOKENS` is an array of `{ name, description, category, value }` records;
 * this guard only needs the names, so we project them out.
 * The `pretest` hook (`pnpm build:tokens`) guarantees `dist/tokens/themeable-tokens/index.mjs` exists first.
 * @returns {Promise<readonly string[]>}
 */
async function getThemeableTokens() {
  const { KUI_THEMEABLE_TOKENS } = await import(join(ROOT, 'dist', 'tokens', 'themeable-tokens', 'index.mjs'))
  return KUI_THEMEABLE_TOKENS.map(token => token.name)
}

/**
 * Every component-token name (without the leading `--`) declared in `tokens/components/*.json` —
 * the namespace a semantic-only theme must omit (its components fall through to their semantic default).
 * @returns {Promise<Set<string>>}
 */
async function getComponentTokenNames() {
  const dir = join(ROOT, 'tokens', 'components')
  const names = new Set()
  for (const file of readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const tree = JSON.parse(await readFile(join(dir, file), 'utf-8'))
    for (const { name } of flattenTokenTree(tree)) names.add(name)
  }
  return names
}

/** Lazily loaded shared inputs. */
let themeable

beforeAll(async () => {
  themeable = await getThemeableTokens()
})

/**
 * Read a theme file from the repo's own `themes/<name>/` directory. Self-contained:
 * the suite reads only design-tokens' own source, never external artifacts.
 *
 * @param {string} name - Theme name (no extension).
 * @returns {Promise<Record<string, object>>}
 */
async function loadTheme(name) {
  return JSON.parse(await readFile(join(ROOT, 'themes', name, `${name}.theme.json`), 'utf-8'))
}

/**
 * Set-membership diff, sorted for stable/readable assertion failure messages: names `expected`
 * but absent from `actual` ("missing"), and names in `actual` not in `expected` ("extra").
 * @param {Set<string>} expected
 * @param {Set<string>} actual
 * @returns {{ missing: string[], extra: string[] }}
 */
function diffSets(expected, actual) {
  return {
    missing: [...expected].filter(k => !actual.has(k)).sort(),
    extra: [...actual].filter(k => !expected.has(k)).sort(),
  }
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

      const { missing, extra } = diffSets(expected, actual)

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

      const { missing, extra: rawExtra } = diffSets(expected, actual)
      // Component-freeness is the verifiable fallthrough guarantee (the repo can't
      // verify a snapshot equals its semantic fallback
      const componentPresent = [...actual].filter(k => componentNames.has(k)).sort()
      const extra = rawExtra.filter(k => !componentNames.has(k))

      expect(missing, `MISSING semantic tokens in ${themeName}: ${missing.join(', ')}`).toEqual([])
      expect(componentPresent, `${themeName} must set NO component tokens (fallthrough by omission); found: ${componentPresent.join(', ')}`).toEqual([])
      expect(extra, `EXTRA non-themeable tokens in ${themeName}: ${extra.join(', ')}`).toEqual([])
    })
  }
})

describe('theme classification stays in sync with themes/', () => {
  // With exhaustive as the derived default, a newly added theme can't silently go untested — it's
  // picked up by the exhaustive drift guard automatically. The only thing that CAN drift is the
  // semantic-only opt-out list naming a theme that no longer exists on disk (which would then
  // silently test nothing), so guard exactly that.
  it('every SEMANTIC_ONLY_THEMES entry exists in themes/', () => {
    const onDisk = new Set(ALL_THEMES)
    const missing = SEMANTIC_ONLY_THEMES.filter(t => !onDisk.has(t))
    expect(missing, `SEMANTIC_ONLY_THEMES names theme(s) not present in themes/: ${missing.join(', ')}`).toEqual([])
  })
})

describe('theme files follow the <theme-name>/<theme-name>.theme.json naming convention', () => {
  // Enforces the same rule the build enforces (platforms/themes.mjs discoverThemes): a theme
  // directory whose matching `<name>.theme.json` is missing fails here with its name, instead of
  // being silently skipped by the build's discovery filter.
  it('every non-internal directory in themes/ contains <theme-name>.theme.json', () => {
    const offenders = ALL_THEMES.filter(name => !existsSync(join(ROOT, 'themes', name, `${name}.theme.json`))).sort()
    expect(offenders, `Theme directory must contain <theme-name>.theme.json; missing for: ${offenders.join(', ')}`).toEqual([])
  })
})

describe('discoverThemes (build-time discovery — direct unit test, isolated temp dir)', () => {
  // The check above only re-derives ALL_THEMES from directories it already found on disk; it can't
  // catch discoverThemes() itself failing to reject something that was never a directory in the
  // first place. A stray file directly in themes/ (e.g. the pre-refactor flat `<name>.theme.json`
  // convention, authored by habit or an out-of-date doc) must still be a hard build error, not
  // silently invisible to the build.
  let themesRoot

  beforeEach(async () => {
    themesRoot = await mkdtemp(join(tmpdir(), 'discover-themes-test-'))
  })

  afterEach(async () => {
    await rm(themesRoot, { recursive: true, force: true })
  })

  it('discovers conforming theme directories, sorted by name', async () => {
    for (const name of ['zebra', 'acme']) {
      await mkdir(join(themesRoot, name), { recursive: true })
      await writeFile(join(themesRoot, name, `${name}.theme.json`), '{}', 'utf-8')
    }
    const themes = await discoverThemes(themesRoot)
    expect(themes.map(t => t.name)).toEqual(['acme', 'zebra'])
  })

  it('skips `_`-prefixed files and directories without treating them as themes or errors', async () => {
    await mkdir(join(themesRoot, 'real-theme'), { recursive: true })
    await writeFile(join(themesRoot, 'real-theme', 'real-theme.theme.json'), '{}', 'utf-8')
    await writeFile(join(themesRoot, '_manifest.alias.color.json'), '{}', 'utf-8')
    const themes = await discoverThemes(themesRoot)
    expect(themes.map(t => t.name)).toEqual(['real-theme'])
  })

  it('hard-errors on a stray FILE directly in themes/ (e.g. the pre-refactor flat theme.json convention) instead of silently ignoring it', async () => {
    await writeFile(join(themesRoot, 'stray.theme.json'), '{}', 'utf-8')
    await expect(discoverThemes(themesRoot)).rejects.toThrow(/stray\.theme\.json/)
  })

  it('hard-errors on a theme directory missing its <name>.theme.json', async () => {
    await mkdir(join(themesRoot, 'incomplete'), { recursive: true })
    await expect(discoverThemes(themesRoot)).rejects.toThrow(/incomplete/)
  })
})

// Auto-discover every palette file, co-located with its theme at `themes/<name>/<name>.alias.color.json`.
// A newly added palette is enrolled in these guards without editing this test.
const PALETTE_FILES = ALL_THEMES
  .filter(name => existsSync(join(ROOT, 'themes', name, `${name}.alias.color.json`)))
  .map(name => join(name, `${name}.alias.color.json`))
const ALIAS_DIR = join(ROOT, 'themes')
const MANIFEST_PATH = join(ROOT, 'themes', '_manifest.alias.color.json')

describe('alias palettes follow the <theme-name>/<theme-name>.alias.color.json naming convention', () => {
  // Palettes correspond 1:1 with themes/<theme-name>/<theme-name>.theme.json. Enforce the co-located
  // `<theme-name>.alias.color.json` name so a stray/mis-named palette fails here with its name instead
  // of being silently skipped by the discovery filter above (which would drop it out of the drift,
  // $description, and off-source guards).
  it('every theme directory that references color aliases has a matching <theme-name>.alias.color.json', () => {
    const offenders = ALL_THEMES.filter(name => {
      const files = readdirSync(join(ROOT, 'themes', name))
      const hasAliasFile = files.includes(`${name}.alias.color.json`)
      const strayAliasFiles = files.filter(f => f.endsWith('.alias.color.json') && f !== `${name}.alias.color.json`)
      return strayAliasFiles.length > 0 && !hasAliasFile
    }).sort()
    expect(offenders, `Alias palette(s) must be named <theme-name>.alias.color.json; check: ${offenders.join(', ')}`).toEqual([])
  })
})

describe('drift guard: alias palettes contain exactly the manifest key set', () => {
  for (const file of PALETTE_FILES) {
    it(`${file} contains exactly the manifest aliases (no missing, no extra)`, async () => {
      const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf-8'))
      const palette = JSON.parse(await readFile(join(ALIAS_DIR, file), 'utf-8'))
      const expected = manifestLeaves(manifest)
      const actual = paletteLeaves(palette)
      const { missing, extra } = diffSets(expected, actual)
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
      for (const { value, description } of flattenTokenTree(palette.color.alias)) {
        const expected = `Alias for ${value}.`
        if (description !== expected) stale.push(`${value}: got "${description}"`)
      }
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
    const name = file.split('/')[0]
    it(`${name}.css renders only colors present in ${file}`, async () => {
      const palette = JSON.parse(await readFile(join(ALIAS_DIR, file), 'utf-8'))
      const palVals = new Set()
      for (const { value } of flattenTokenTree(palette.color.alias)) {
        if (typeof value === 'string' && value.startsWith('#')) palVals.add(normalizeColor(value))
      }

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
    expect(aliasIncludesFor('electric-lime-day', true, null)).toEqual(['./themes/electric-lime-day/electric-lime-day.alias.color.json'])
  })

  it('throws when an alias-using theme has no palette (no silent fallback)', () => {
    const theme = { 'kui-color-text': { $value: '{color.alias.gray.10}' } }
    expect(() => aliasIncludesFor('missing-palette', false, theme)).toThrow(/references \{color\.alias/)
  })
})

describe('build wiring: an unfilled component token ($value === \'\') is OMITTED from compiled output, never emitted as `--x: ;` or `--x: initial;`', () => {
  // Per the CSS Custom Properties spec, var(--x, fallback) only uses `fallback` when --x is
  // "guaranteed-invalid" (never declared at all). An explicitly empty declaration does NOT reach
  // that state, so the component→semantic fallback chain would silently break; explicitly setting
  // `initial` DOES reach it, but as an active reset that could override a value legitimately set by
  // a host app, a nested theme, or a spread-in base object. True omission has neither problem — see
  // createThemePlatforms's docstring in platforms/themes.mjs for the full reasoning.
  let themesRoot, distDir

  beforeEach(async () => {
    themesRoot = await mkdtemp(join(tmpdir(), 'omit-empty-test-'))
    distDir = await mkdtemp(join(tmpdir(), 'omit-empty-dist-'))
  })

  afterEach(async () => {
    await rm(themesRoot, { recursive: true, force: true })
    await rm(distDir, { recursive: true, force: true })
  })

  it('compiles a filled token but completely omits an unfilled ($value: "") one, in both CSS and JS output', async () => {
    const name = 'omit-empty-test-theme'
    await mkdir(join(themesRoot, name), { recursive: true })
    await writeFile(
      join(themesRoot, name, `${name}.theme.json`),
      JSON.stringify({
        'kui-button-border-radius-medium': { $value: '' },
        'kui-space-40': { $value: '16px' },
      }, null, 2),
      'utf-8',
    )

    const sd = new StyleDictionary({
      log: { verbosity: logVerbosityLevels.silent }, // don't spam volatile temp-dir paths to test output
      source: [join(themesRoot, name, `${name}.theme.json`)],
      preprocessors: ['inject-theme-breakpoints'],
      platforms: createThemePlatforms(name, 'omitEmptyTestTheme', distDir),
    })
    await sd.buildAllPlatforms()

    const css = await readFile(join(distDir, `${name}.css`), 'utf-8')
    expect(css).toContain('--kui-space-40: 16px;')
    expect(css).not.toContain('kui-button-border-radius-medium')

    const js = await readFile(join(distDir, `${name}.mjs`), 'utf-8')
    expect(js).toContain("'--kui-space-40': \"16px\"")
    expect(js).not.toContain('kui-button-border-radius-medium')
  })
})

describe('classic-day / classic-night themes are unchanged (golden snapshot)', () => {
  // classic-day is the default palette + theme; classic-night is its fixed dark counterpart. Both are
  // deterministic (no designer tuning), so their resolved output is frozen — any change fails here and
  // must be accepted explicitly (`vitest -u`). electric-lime-day/night are intentionally NOT snapshotted —
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

  it('dist/tokens/themeable-tokens/index.mjs resolved output remains unchanged', async () => {
    const css = await readFile(join(ROOT, 'dist', 'tokens', 'themeable-tokens', 'index.mjs'), 'utf-8')
    await expect(stripTimestamp(css)).toMatchFileSnapshot(join(ROOT, '__snapshots__', 'tokens', 'themeable-tokens', 'index.mjs'))
  })
})
