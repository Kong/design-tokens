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
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getThemeableTokens, buildDescriptionMap } from './scripts/create-theme.mjs'
import {
  EXHAUSTIVE_THEMES,
  SEMANTIC_ONLY_THEMES,
  getComponentTokenNames,
  fillThemeObject,
  assertAdditiveOnly,
  findExtraKeys,
  parseFallbackPairs,
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
let fallbackMap

/**
 * Self-contained component→semantic fallback fixture for the fillThemeObject tests.
 *
 * The real fallback chains live in the Kongponents repo (grepped into
 * /tmp/fallback-pairs.txt for the actual fill). That file is NOT present in
 * design-tokens CI, so the suite must not depend on it — depending on it made
 * this test pass locally but fail in CI (the map was silently empty, so the
 * component token couldn't resolve). This fixture provides exactly the pairs
 * these unit tests exercise; the real chains are validated where the fill runs
 * with Kongponents checked out.
 */
const FALLBACK_FIXTURE = [
  'kui-alert-color-background-success => kui-color-background-success-weakest',
  'kui-badge-border-radius => kui-border-radius-20',
  'kui-button-color-background-danger-hover => kui-color-background-danger-strong',
  'kui-button-color-background-danger-hover => kui-color-background-danger-stronger',
].join('\n')

beforeAll(async () => {
  const tokensRaw = await readFile(join(ROOT, 'dist', 'tokens', 'js', 'tokens.json'), 'utf-8')
  const aliasRaw = await readFile(join(ROOT, 'tokens', 'alias', 'color', 'index.json'), 'utf-8')

  themeable = await getThemeableTokens()
  descriptions = await buildDescriptionMap()
  resolvedValues = JSON.parse(tokensRaw)
  Object.defineProperty(resolvedValues, '__aliasIndex', {
    value: JSON.parse(aliasRaw),
    enumerable: false,
  })
  fallbackMap = parseFallbackPairs(FALLBACK_FIXTURE)
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
    const { result, added, needsManual } = fillThemeObject(original, themeable, fallbackMap, resolvedValues, descriptions)
    expect(added).toEqual([])
    expect(needsManual).toEqual([])
    // byte-identical serialization
    const before = serializeTheme(original)
    const after = serializeTheme(result)
    expect(after).toBe(before)
  })

  it('re-adds exactly 3 deleted tokens (color, scale/px, component) at correct values; otherwise byte-identical', async () => {
    const original = await loadTheme('konnect-day')

    // Three tokens whose authored entry is a clean round-trip of the fill logic
    // (canonical $description-first order, description == buildDescriptionMap,
    // and color alias == the exact-value reverse map), so re-adding them
    // reproduces the original file byte-for-byte:
    //   - base color token    → {color.alias.*}
    //   - base scale/px token → literal "6px"
    //   - component token (color) → {color.alias.*} via fallback resolution
    const colorToken = 'kui-color-background' // base color → {color.alias.white}
    const scaleToken = 'kui-border-radius-30' // base scale → "6px"
    const componentToken = 'kui-alert-color-background-success' // component color → {color.alias.green.10}

    // Sanity: all three currently exist in the snapshot.
    expect(original[colorToken]).toBeDefined()
    expect(original[scaleToken]).toBeDefined()
    expect(original[componentToken]).toBeDefined()

    const fixture = { ...original }
    delete fixture[colorToken]
    delete fixture[scaleToken]
    delete fixture[componentToken]

    const { result, added, needsManual } = fillThemeObject(fixture, themeable, fallbackMap, resolvedValues, descriptions)

    // Exactly the three we removed were added.
    expect(added.map(a => a.name).sort()).toEqual([colorToken, componentToken, scaleToken].sort())
    expect(needsManual).toEqual([])

    // Correct resolved values: colors → {color.alias.*}, scale → literal px.
    const byName = Object.fromEntries(added.map(a => [a.name, a.value]))
    expect(byName[colorToken]).toBe('{color.alias.white}')
    expect(byName[scaleToken]).toBe('6px')
    expect(byName[componentToken]).toBe('{color.alias.green.10}')

    // Result is byte-identical to the ORIGINAL — additive fill restored it exactly.
    expect(serializeTheme(result)).toBe(serializeTheme(original))

    // Idempotence: a second run adds nothing and changes nothing.
    const second = fillThemeObject(result, themeable, fallbackMap, resolvedValues, descriptions)
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
    const { result } = fillThemeObject(original, themeable, fallbackMap, resolvedValues, descriptions)
    expect(JSON.stringify(result[name])).toBe(handEdited)
  })

  it('flags ambiguous-fallback tokens as NEEDS MANUAL with empty $value', async () => {
    const original = await loadTheme('konnect-day')
    const ambiguousToken = 'kui-button-color-background-danger-hover'
    expect(original[ambiguousToken]).toBeDefined()
    const fixture = { ...original }
    delete fixture[ambiguousToken]
    const { result, added, needsManual } = fillThemeObject(fixture, themeable, fallbackMap, resolvedValues, descriptions)
    expect(added.map(a => a.name)).toEqual([ambiguousToken])
    expect(result[ambiguousToken].$value).toBe('')
    expect(needsManual.map(m => m.name)).toContain(ambiguousToken)
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
    const { result, added } = fillThemeObject(fixture, themeable, fallbackMap, resolvedValues, descriptions)
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
      fallbackMap,
      colorReverseMap: buildColorReverseMap(resolvedValues.__aliasIndex),
    })
    expect(r.manual).toBe(false)
    expect(r.value).toBe('16px')
    expect(r.value).not.toMatch(/^\{/)
  })

  it('colors with no alias match are flagged NEEDS MANUAL (never guessed)', () => {
    const r = computeFillValue('kui-color-background-overlay', {
      resolvedValues,
      fallbackMap,
      colorReverseMap: buildColorReverseMap(resolvedValues.__aliasIndex),
    })
    // rgba(...) overlay has no {color.alias.*} match.
    expect(r.manual).toBe(true)
    expect(r.value).toBe('')
  })
})
