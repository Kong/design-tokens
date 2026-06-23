/**
 * Drift guard + fill-themes safety tests.
 *
 * Two concerns:
 *   1. DRIFT GUARD — the exhaustive themes (konnect-day, konnect-night) must
 *      contain exactly the KUI_THEMEABLE_TOKENS set: no missing, no extra.
 *      (classic / brand-a / brand-b are intentionally partial → excluded.)
 *   2. FILL CORE SAFETY — `fillThemeObject` is additive-only and re-adds exactly
 *      the deleted tokens at correct resolved values; a second run is a no-op;
 *      and a result that would alter an existing value is rejected before write.
 *
 * All theme-file reads target the EXHAUSTIVE_THEMES files; mutation tests build
 * in-memory fixtures so nothing on disk is ever modified by the tests.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { readFile } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { manifestLeaves, paletteLeaves } from './scripts/alias-manifest.mjs'
import { aliasIncludesFor } from './platforms/themes.mjs'

import { getThemeableTokens, buildDescriptionMap } from './scripts/create-theme.mjs'
import {
  EXHAUSTIVE_THEMES,
  SEMANTIC_ONLY_THEMES,
  getComponentTokenNames,
  fillThemeObject,
  assertAdditiveOnly,
  findExtraKeys,
  computeFillValue,
  buildColorReverseMap,
  serializeTheme,
} from './scripts/fill-themes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname

/** Lazily loaded shared inputs. */
let themeable
let descriptions
let resolvedValues

beforeAll(async () => {
  const tokensRaw = await readFile(join(ROOT, 'dist', 'tokens', 'js', 'tokens.json'), 'utf-8')
  // classic.json is the canonical default palette (index.json was removed in the per-theme alias refactor).
  const aliasRaw = await readFile(join(ROOT, 'tokens', 'alias', 'color', 'classic.json'), 'utf-8')

  themeable = await getThemeableTokens()
  descriptions = await buildDescriptionMap()
  resolvedValues = JSON.parse(tokensRaw)
  Object.defineProperty(resolvedValues, '__aliasIndex', {
    value: JSON.parse(aliasRaw),
    enumerable: false,
  })
})

/**
 * Read a theme file from the repo's own `themes/` directory. Self-contained:
 * the suite reads only design-tokens' own source, never external artifacts.
 *
 * @param {string} name - Theme name (no extension).
 * @returns {Promise<Record<string, object>>}
 */
async function loadTheme(name) {
  return JSON.parse(await readFile(join(ROOT, 'themes', `${name}.json`), 'utf-8'))
}

describe('drift guard: exhaustive themes contain exactly KUI_THEMEABLE_TOKENS', () => {
  for (const themeName of EXHAUSTIVE_THEMES) {
    it(`${themeName} has no missing or extra tokens`, async () => {
      const theme = await loadTheme(themeName)
      const expected = new Set(themeable.map(t => t.slice(2)))
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
  for (const themeName of SEMANTIC_ONLY_THEMES) {
    it(`${themeName} contains every semantic token and ZERO component tokens`, async () => {
      const theme = await loadTheme(themeName)
      const componentNames = await getComponentTokenNames()
      // Expected = every themeable token that is NOT a component token.
      const expected = new Set(themeable.map(t => t.slice(2)).filter(t => !componentNames.has(t)))
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

describe('drift guard logic on synthetic fixtures', () => {
  it('PASSES when the key set matches exactly', async () => {
    const complete = Object.fromEntries(themeable.map(t => [t.slice(2), { $value: 'x' }]))
    const expected = new Set(themeable.map(t => t.slice(2)))
    const missing = [...expected].filter(k => !(k in complete))
    const extra = Object.keys(complete).filter(k => !expected.has(k))
    expect(missing).toEqual([])
    expect(extra).toEqual([])
  })

  it('FAILS (names a MISSING token) when a token is removed', async () => {
    const obj = Object.fromEntries(themeable.map(t => [t.slice(2), { $value: 'x' }]))
    const removedName = themeable[0].slice(2)
    delete obj[removedName]
    const expected = new Set(themeable.map(t => t.slice(2)))
    const missing = [...expected].filter(k => !(k in obj)).sort()
    expect(missing).toContain(removedName)
    expect(missing).toEqual([removedName])
  })

  it('FAILS (names an EXTRA token) when a stray key is added', async () => {
    const obj = Object.fromEntries(themeable.map(t => [t.slice(2), { $value: 'x' }]))
    obj['kui-not-a-real-token'] = { $value: 'x' }
    const extra = findExtraKeys(obj, themeable)
    expect(extra).toContain('kui-not-a-real-token')
    expect(extra).toEqual(['kui-not-a-real-token'])
  })
})

describe('fillThemeObject — additive-only core', () => {
  it('is a no-op on an already-complete theme (0 added)', async () => {
    const original = await loadTheme('konnect-day')
    const { result, added, needsManual } = fillThemeObject(original, themeable, resolvedValues, descriptions)
    expect(added).toEqual([])
    expect(needsManual).toEqual([])
    // byte-identical serialization
    const before = serializeTheme(original)
    const after = serializeTheme(result)
    expect(after).toBe(before)
  })

  it('re-adds deleted SEMANTIC tokens (color + scale) at their default values; otherwise byte-identical', async () => {
    const original = await loadTheme('konnect-day')

    // A base color token → {color.alias.*} (via the reverse map) and a base scale token → its literal,
    // both resolved from the default build values; re-adding reproduces the file byte-for-byte.
    // (Value-less component tokens can't be auto-resolved — see the NEEDS MANUAL test below.)
    const colorToken = 'kui-color-background' // → {color.alias.white}
    const scaleToken = 'kui-border-radius-30' // → "6px"

    expect(original[colorToken]).toBeDefined()
    expect(original[scaleToken]).toBeDefined()

    const fixture = { ...original }
    delete fixture[colorToken]
    delete fixture[scaleToken]

    const { result, added, needsManual } = fillThemeObject(fixture, themeable, resolvedValues, descriptions)

    expect(added.map(a => a.name).sort()).toEqual([colorToken, scaleToken].sort())
    expect(needsManual).toEqual([])

    const byName = Object.fromEntries(added.map(a => [a.name, a.value]))
    expect(byName[colorToken]).toBe('{color.alias.white}')
    expect(byName[scaleToken]).toBe('6px')

    // Byte-identical to the ORIGINAL — additive fill restored it exactly.
    expect(serializeTheme(result)).toBe(serializeTheme(original))

    // Idempotence: a second run adds nothing and changes nothing.
    const second = fillThemeObject(result, themeable, resolvedValues, descriptions)
    expect(second.added).toEqual([])
    expect(serializeTheme(second.result)).toBe(serializeTheme(result))
  })

  it('preserves a hand-edited existing entry verbatim (never regenerates $description)', async () => {
    const original = await loadTheme('konnect-day')
    // Pick an entry whose stored description differs from buildDescriptionMap.
    const name = 'kui-color-background-transparent'
    expect(original[name]).toBeDefined()
    // Establish that the snapshot's description is the hand-edited one.
    const handEdited = JSON.stringify(original[name])
    const { result } = fillThemeObject(original, themeable, resolvedValues, descriptions)
    expect(JSON.stringify(result[name])).toBe(handEdited)
  })

  it('flags value-less component tokens as NEEDS MANUAL with empty $value', async () => {
    const original = await loadTheme('konnect-day')
    // A component token has no default build value (it is itself a {color.alias.*}/semantic
    // reference), so fill cannot auto-resolve it — it is added empty and flagged for manual entry.
    const componentToken = 'kui-button-color-background-danger-hover'
    expect(original[componentToken]).toBeDefined()
    const fixture = { ...original }
    delete fixture[componentToken]
    const { result, added, needsManual } = fillThemeObject(fixture, themeable, resolvedValues, descriptions)
    expect(added.map(a => a.name)).toEqual([componentToken])
    expect(result[componentToken].$value).toBe('')
    expect(needsManual.map(m => m.name)).toContain(componentToken)
  })
})

describe('abort path — construction that would alter an existing value is rejected', () => {
  it('assertAdditiveOnly throws when an existing $value is changed', () => {
    const original = { 'kui-a': { $value: '1px' }, 'kui-b': { $value: 'red' } }
    const tampered = { 'kui-a': { $value: 'CHANGED' }, 'kui-b': { $value: 'red' } }
    expect(() => assertAdditiveOnly(original, tampered, [])).toThrow(/changed/)
  })

  it('assertAdditiveOnly throws when an original key is dropped', () => {
    const original = { 'kui-a': { $value: '1px' }, 'kui-b': { $value: 'red' } }
    const dropped = { 'kui-a': { $value: '1px' } }
    expect(() => assertAdditiveOnly(original, dropped, [])).toThrow(/missing from result/)
  })

  it('assertAdditiveOnly throws when an unexpected key is added', () => {
    const original = { 'kui-a': { $value: '1px' } }
    const withExtra = { 'kui-a': { $value: '1px' }, 'kui-surprise': { $value: 'x' } }
    expect(() => assertAdditiveOnly(original, withExtra, [])).toThrow(/added set mismatch/)
  })

  it('fillThemeObject output always passes assertAdditiveOnly (cannot corrupt)', async () => {
    const original = await loadTheme('konnect-night')
    const fixture = { ...original }
    // Remove several tokens of mixed kinds.
    for (const k of ['kui-color-text', 'kui-space-40', 'kui-badge-border-radius']) delete fixture[k]
    const { result, added } = fillThemeObject(fixture, themeable, resolvedValues, descriptions)
    // The pure core's output is, by construction, additive-only vs its input.
    expect(() => assertAdditiveOnly(fixture, result, added.map(a => a.name))).not.toThrow()
  })
})

describe('color reverse map + computeFillValue', () => {
  it('maps known concrete colors to {color.alias.*} refs', () => {
    const map = buildColorReverseMap(resolvedValues.__aliasIndex)
    expect(map.get('#ffffff')).toBe('{color.alias.white}')
    expect(map.get('transparent')).toBe('{color.alias.transparent}')
    // green.60 = #007d60 (resolved value of kui-color-background-success)
    expect(map.get('#007d60')).toBe('{color.alias.green.60}')
  })

  it('non-color tokens resolve to a literal value, never a {…} ref', () => {
    const r = computeFillValue('kui-font-size-40', {
      resolvedValues,
      colorReverseMap: buildColorReverseMap(resolvedValues.__aliasIndex),
    })
    expect(r.manual).toBe(false)
    expect(r.value).toBe('16px')
    expect(r.value).not.toMatch(/^\{/)
  })

  it('colors with no alias match are flagged NEEDS MANUAL (never guessed)', () => {
    const r = computeFillValue('kui-color-background-overlay', {
      resolvedValues,
      colorReverseMap: buildColorReverseMap(resolvedValues.__aliasIndex),
    })
    // rgba(...) overlay has no {color.alias.*} match.
    expect(r.manual).toBe(true)
    expect(r.value).toBe('')
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
  const norm = (h) => {
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
          if (typeof node.$value === 'string' && node.$value.startsWith('#')) palVals.add(norm(node.$value))
          return
        }
        if (node && typeof node === 'object') for (const child of Object.values(node)) collect(child)
      }
      collect(palette.color.alias)

      const css = await readFile(join(ROOT, 'dist', 'themes', `${name}.css`), 'utf-8')
      const off = new Set()
      for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        const h = norm(m[0])
        if (!palVals.has(h)) off.add(h)
      }
      for (const m of css.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)) {
        const h = norm(rgbToHex(m[1], m[2], m[3]))
        if (!palVals.has(h)) off.add(h)
      }
      expect([...off], `${name}.css renders colors absent from ${file}: ${[...off].join(', ')}`).toEqual([])
    })
  }
})

describe('build wiring: aliasIncludesFor (per-theme palette resolution)', () => {
  it('includes the per-theme palette when it exists', () => {
    expect(aliasIncludesFor('konnect-day', true, null)).toEqual(['./tokens/alias/color/konnect-day.json'])
  })

  it('throws when an alias-using theme has no palette (no silent fallback)', () => {
    const theme = { 'kui-color-text': { $value: '{color.alias.gray.10}' } }
    expect(() => aliasIncludesFor('konnect-contrast', false, theme)).toThrow(/references \{color\.alias/)
  })

  it('returns [] for a raw-hex theme with no alias refs and no palette', () => {
    const theme = { 'kui-color-text': { $value: '#ffffff' } }
    expect(aliasIncludesFor('brand-a', false, theme)).toEqual([])
  })

  it('detects alias usage from $value only — a {color.alias.*} mention in $description is not a ref', () => {
    const theme = { 'kui-x': { $description: 'maps to {color.alias.gray.10}', $value: '#ffffff' } }
    expect(aliasIncludesFor('brand-x', false, theme)).toEqual([])
  })
})

describe('classic theme is frozen (golden snapshot)', () => {
  // classic is the default palette + theme; its resolved output must not drift. Any change fails here
  // and must be accepted explicitly (`vitest -u`). day/night are intentionally NOT snapshotted — they
  // evolve with designer tuning; their guarantees are structural (drift guard + off-source + $description).
  it('classic.css resolved output matches the committed golden', async () => {
    const css = await readFile(join(ROOT, 'dist', 'themes', 'classic.css'), 'utf-8')
    await expect(css).toMatchFileSnapshot(join(ROOT, '__snapshots__', 'classic.theme.css'))
  })
})
