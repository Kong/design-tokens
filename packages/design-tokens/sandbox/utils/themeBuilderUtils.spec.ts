import { describe, it, expect } from 'vitest'
import { resolveValue, parseAliasRef, resolveEmbeddedRefs } from './themeBuilderUtils'
import { deriveEffectiveCss } from './themeBuilderUtils'
import { exportThemeJson, exportAliasJson, flattenAliases, isColorToken, isValidThemeJson } from './themeBuilderUtils'
import type { ThemeJson, AliasJson } from './themeBuilderUtils'

const aliasJson = {
  color: {
    alias: {
      blue: { '50': { $value: '#3094FF' } },
      black: { $value: '#000000' },
    },
  },
}

describe('parseAliasRef', () => {
  it('parses a stepped ref', () => {
    expect(parseAliasRef('{color.alias.blue.50}')).toEqual({ family: 'blue', step: '50' })
  })
  it('parses a singleton ref', () => {
    expect(parseAliasRef('{color.alias.black}')).toEqual({ family: 'black', step: null })
  })
  it('returns null for a non-ref', () => {
    expect(parseAliasRef('6px')).toBeNull()
  })
  it('returns null for non-string input without throwing', () => {
    expect(parseAliasRef(undefined)).toBeNull()
    expect(parseAliasRef(null)).toBeNull()
  })
})

describe('resolveEmbeddedRefs', () => {
  it('resolves a pure alias ref (same as resolveValue)', () => {
    expect(resolveEmbeddedRefs('{color.alias.blue.50}', aliasJson, {})).toBe('#3094FF')
  })
  it('resolves a singleton alias ref', () => {
    expect(resolveEmbeddedRefs('{color.alias.black}', aliasJson, {})).toBe('#000000')
  })
  it('resolves an alias ref embedded in a shadow value', () => {
    expect(resolveEmbeddedRefs('0px 1px 1px {color.alias.blue.50} inset', aliasJson, {}))
      .toBe('0px 1px 1px #3094FF inset')
  })
  it('resolves multiple embedded refs in one value', () => {
    const aj = { color: { alias: { blue: { '50': { $value: '#3094FF' } }, black: { $value: '#000000' } } } }
    expect(resolveEmbeddedRefs('{color.alias.blue.50} 0px 0px {color.alias.black}', aj, {}))
      .toBe('#3094FF 0px 0px #000000')
  })
  it('returns a literal with no refs unchanged', () => {
    expect(resolveEmbeddedRefs('0px 4px 8px rgba(0,0,0,0.2)', aliasJson, {})).toBe('0px 4px 8px rgba(0,0,0,0.2)')
  })
  it('leaves an unresolvable ref as-is (unknown family)', () => {
    expect(resolveEmbeddedRefs('0px 1px {color.alias.unknown.10}', aliasJson, {}))
      .toBe('0px 1px {color.alias.unknown.10}')
  })
  it('honors alias overrides over base palette', () => {
    expect(resolveEmbeddedRefs('0px 1px 1px {color.alias.blue.50} inset', aliasJson, { 'blue.50': '#00BFFF' }))
      .toBe('0px 1px 1px #00BFFF inset')
  })
})

describe('resolveValue', () => {
  it('resolves a stepped ref from base', () => {
    expect(resolveValue('{color.alias.blue.50}', aliasJson, {})).toBe('#3094FF')
  })
  it('resolves a singleton ref from base', () => {
    expect(resolveValue('{color.alias.black}', aliasJson, {})).toBe('#000000')
  })
  it('prefers an alias override over base', () => {
    expect(resolveValue('{color.alias.blue.50}', aliasJson, { 'blue.50': '#00BFFF' })).toBe('#00BFFF')
  })
  it('returns literals as-is', () => {
    expect(resolveValue('6px', aliasJson, {})).toBe('6px')
  })
})

describe('deriveEffectiveCss', () => {
  const aliasJson = { color: { alias: { blue: { '50': { $value: '#3094FF' } } } } }
  const themeJson = {
    'kui-button-color-background-primary': { $value: '{color.alias.blue.50}' },
    'kui-alert-border-radius': { $value: '6px' },
    'kui-empty-slot': { $value: '' },
  }

  it('emits a :root block with resolved values', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {})
    expect(css).toContain('--kui-button-color-background-primary: #3094FF;')
    expect(css).toContain('--kui-alert-border-radius: 6px;')
  })
  it('skips empty-value tokens', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {})
    expect(css).not.toContain('--kui-empty-slot')
  })
  it('applies token overrides over the base value', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {
      'kui-button-color-background-primary': '{color.alias.blue.50}',
    })
    expect(css).toContain('--kui-button-color-background-primary: #3094FF;')
  })
  it('applies alias overrides through the cascade', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, { 'blue.50': '#00BFFF' }, {})
    expect(css).toContain('--kui-button-color-background-primary: #00BFFF;')
  })
  it('returns empty string when nothing resolves', () => {
    expect(deriveEffectiveCss({ 'kui-empty-slot': { $value: '' } }, aliasJson, {}, {})).toBe('')
  })
  it('does not throw and omits a token whose $value is undefined', () => {
    // Deliberately malformed: a corrupted theme file can have an entry missing `$value`
    // entirely, bypassing the `isValidThemeJson` guard upstream (e.g. via a corrupted
    // localStorage restore) — cast to the declared type to exercise that defensive path.
    const malformed = { ...themeJson, 'kui-malformed': {} } as unknown as ThemeJson
    let css
    expect(() => {
      css = deriveEffectiveCss(malformed, aliasJson, {}, {})
    }).not.toThrow()
    expect(css).not.toContain('kui-malformed')
  })
  it('omits a token override value containing CSS-structural characters', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {
      'kui-alert-border-radius': '0}body{color:red',
    })
    expect(css).not.toContain('kui-alert-border-radius')
    expect(css).not.toContain('body{color:red')
  })
  it('resolves an alias ref embedded in a shadow token value', () => {
    const theme = {
      ...themeJson,
      'kui-shadow-border-disabled': { $value: '0px 1px 1px {color.alias.blue.50} inset' },
    }
    const css = deriveEffectiveCss(theme, aliasJson, {}, {})
    expect(css).toContain('--kui-shadow-border-disabled: 0px 1px 1px #3094FF inset;')
  })
  it('resolves an embedded alias ref that is a token override', () => {
    const css = deriveEffectiveCss(themeJson, aliasJson, {}, {
      'kui-alert-border-radius': '0px 0px 0px 1px {color.alias.blue.50}',
    })
    expect(css).toContain('--kui-alert-border-radius: 0px 0px 0px 1px #3094FF;')
  })
  it('omits a shadow token whose embedded ref cannot be resolved', () => {
    const theme = {
      ...themeJson,
      'kui-shadow-border-disabled': { $value: '0px 1px 1px {color.alias.unknown.10} inset' },
    }
    const css = deriveEffectiveCss(theme, aliasJson, {}, {})
    expect(css).not.toContain('--kui-shadow-border-disabled')
  })
})

describe('flattenAliases', () => {
  const aliasJson = {
    color: { alias: {
      blue: { '50': { $value: '#3094FF' }, '60': { $value: '#0076F4' } },
      black: { $value: '#000000' },
    } },
  }
  it('flattens stepped and singleton families', () => {
    const flat = flattenAliases(aliasJson)
    expect(flat).toContainEqual({ family: 'blue', step: '50', key: 'blue.50', baseHex: '#3094FF' })
    expect(flat).toContainEqual({ family: 'black', step: null, key: 'black', baseHex: '#000000' })
  })
})

describe('isColorToken', () => {
  it('is true for alias refs', () => {
    expect(isColorToken('{color.alias.blue.50}')).toBe(true)
  })
  it('is false for literals and empties', () => {
    expect(isColorToken('6px')).toBe(false)
    expect(isColorToken('')).toBe(false)
  })
})

describe('exportThemeJson', () => {
  const themeJson = { 'kui-a': { $value: '{color.alias.blue.50}', $description: 'A' } }
  it('applies token overrides as refs and preserves structure', () => {
    const out = JSON.parse(exportThemeJson(themeJson, { 'kui-a': '{color.alias.blue.60}' }))
    expect(out['kui-a'].$value).toBe('{color.alias.blue.60}')
    expect(out['kui-a'].$description).toBe('A')
  })

  it('does not throw when an entry is a bare string instead of a { $value } record', () => {
    // Regression: a hand-edited or corrupted theme file can have `"kui-space-40": "16px"`
    // instead of `{ "$value": "16px" }`. Assigning `.$value` onto a string primitive throws
    // in strict-mode ESM — exportThemeJson must coerce rather than crash.
    const malformed = { 'kui-space-40': '16px' } as unknown as ThemeJson
    let out: Record<string, { $value: string }> | undefined
    expect(() => {
      out = JSON.parse(exportThemeJson(malformed, { 'kui-space-40': '24px' }))
    }).not.toThrow()
    if (!out) throw new Error('Expected exportThemeJson output to parse successfully')
    expect(out['kui-space-40'].$value).toBe('24px')
  })
})

describe('exportAliasJson', () => {
  const aliasJson = { color: { alias: { blue: { '50': { $value: '#3094FF' } }, black: { $value: '#000000' } } } }
  it('patches overridden step values', () => {
    const out = JSON.parse(exportAliasJson(aliasJson, { 'blue.50': '#00BFFF', black: '#111111' }))
    expect(out.color.alias.blue['50'].$value).toBe('#00BFFF')
    expect(out.color.alias.black.$value).toBe('#111111')
  })

  it('emits stepped family keys in canonical ascending numeric order (raw text) even when input is out of order', () => {
    // NB: JS engines always enumerate integer-like keys ('10','50','100') ascending
    // ahead of non-canonical string keys ('05'), regardless of insertion order or
    // source JSON text order — so Object.keys() after JSON.parse can never reflect
    // '05' before '10'. What the lint (and humans reading the file) actually care
    // about is the ORDER OF KEYS IN THE SERIALIZED TEXT, so assert on that directly.
    const unordered = {
      color: {
        alias: {
          gray: {
            '100': { $value: '#111111' },
            '10': { $value: '#eeeeee' },
            '05': { $value: '#ffffff' },
            '50': { $value: '#888888' },
          },
          black: { $value: '#000000' },
        },
      },
    }
    const text = exportAliasJson(unordered, {})
    const parsed = JSON.parse(text)
    expect(parsed.color.alias.gray['05'].$value).toBe('#ffffff')
    expect(parsed.color.alias.black.$value).toBe('#000000')

    const keyOrder = ['"05"', '"10"', '"50"', '"100"'].map((k) => text.indexOf(k))
    expect(keyOrder).toEqual([...keyOrder].sort((a, b) => a - b))
    expect(keyOrder.every((i) => i !== -1)).toBe(true)
  })

  it('does not throw when a family or step entry is malformed (not a { $value } record)', () => {
    const malformed = {
      color: { alias: { blue: '#3094FF', gray: { '10': 'not-an-object' } } },
    } as unknown as AliasJson
    expect(() => exportAliasJson(malformed, { blue: '#00BFFF', 'gray.10': '#eee' })).not.toThrow()
  })
})

describe('isValidThemeJson', () => {
  it('accepts a theme where every entry is a { $value } record', () => {
    expect(isValidThemeJson({ 'kui-a': { $value: '4px' }, 'kui-b': { $value: '', $description: 'x' } })).toBe(true)
  })

  it('rejects a theme with a bare-string entry', () => {
    expect(isValidThemeJson({ 'kui-a': { $value: '4px' }, 'kui-b': '16px' })).toBe(false)
  })

  it('rejects a theme with a null entry', () => {
    expect(isValidThemeJson({ 'kui-a': null })).toBe(false)
  })

  it('rejects an entry missing $value entirely', () => {
    expect(isValidThemeJson({ 'kui-a': { $description: 'no value here' } })).toBe(false)
  })

  it('accepts an empty theme object', () => {
    expect(isValidThemeJson({})).toBe(true)
  })
})
