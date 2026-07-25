import { describe, it, expect } from 'vitest'
import { resolveValue, parseAliasRef } from './themeBuilderUtils.ts'
import { deriveEffectiveCss } from './themeBuilderUtils.ts'
import { exportThemeJson, exportAliasJson, flattenAliases, isColorToken } from './themeBuilderUtils.ts'

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
})

describe('exportAliasJson', () => {
  const aliasJson = { color: { alias: { blue: { '50': { $value: '#3094FF' } }, black: { $value: '#000000' } } } }
  it('patches overridden step values', () => {
    const out = JSON.parse(exportAliasJson(aliasJson, { 'blue.50': '#00BFFF', black: '#111111' }))
    expect(out.color.alias.blue['50'].$value).toBe('#00BFFF')
    expect(out.color.alias.black.$value).toBe('#111111')
  })
})
