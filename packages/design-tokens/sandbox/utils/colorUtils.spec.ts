import { describe, it, expect } from 'vitest'
import { normalizeColor, toRgbString, isValidColor, toPickerHex } from './colorUtils'

describe('normalizeColor', () => {
  it('expands a 3-digit hex', () => {
    expect(normalizeColor('#abc')).toBe('#AABBCC')
  })
  it('accepts a 6-digit hex without a leading #', () => {
    expect(normalizeColor('aabbcc')).toBe('#AABBCC')
  })
  it('uppercases mixed-case hex', () => {
    expect(normalizeColor('#AaBbCc')).toBe('#AABBCC')
  })
  it('preserves 8-digit hex with non-opaque alpha', () => {
    expect(normalizeColor('#11223344')).toBe('#11223344')
  })
  it('drops alpha when 8-digit hex is opaque', () => {
    expect(normalizeColor('#112233ff')).toBe('#112233')
  })
  it('parses rgb() without spaces', () => {
    expect(normalizeColor('rgb(204,255,0)')).toBe('#CCFF00')
  })
  it('parses rgb() with spaces', () => {
    expect(normalizeColor('rgb(204, 255, 0)')).toBe('#CCFF00')
  })
  it('parses rgba() with alpha', () => {
    expect(normalizeColor('rgba(0,0,0,0.5)')).toBe('#00000080')
  })
  it('parses bare r,g,b', () => {
    expect(normalizeColor('204,255,0')).toBe('#CCFF00')
  })
  it('passes through transparent', () => {
    expect(normalizeColor('transparent')).toBe('transparent')
  })
  it('passes through TRANSPARENT case-insensitively', () => {
    expect(normalizeColor('TRANSPARENT')).toBe('transparent')
  })
  it('clamps out-of-range rgb components', () => {
    expect(normalizeColor('rgb(300,-5,0)')).toBe('#FF0000')
  })
  it('returns null for empty string', () => {
    expect(normalizeColor('')).toBeNull()
  })
  it('returns null for an unparseable string', () => {
    expect(normalizeColor('nope')).toBeNull()
  })
  it('returns null for a truncated hex', () => {
    expect(normalizeColor('#12')).toBeNull()
  })
  it('returns null for an incomplete rgb', () => {
    expect(normalizeColor('rgb(1,2)')).toBeNull()
  })
  it('returns null for non-string input', () => {
    expect(normalizeColor(undefined)).toBeNull()
    expect(normalizeColor(null)).toBeNull()
  })
})

describe('toRgbString', () => {
  it('formats a 6-digit hex as rgb()', () => {
    expect(toRgbString('#CCFF00')).toBe('rgb(204, 255, 0)')
  })
  it('formats an 8-digit hex as rgba()', () => {
    expect(toRgbString('#00000080')).toBe('rgba(0, 0, 0, 0.5)')
  })
  it('passes through transparent', () => {
    expect(toRgbString('transparent')).toBe('transparent')
  })
  it('returns non-color input unchanged', () => {
    expect(toRgbString('6px')).toBe('6px')
  })
})

describe('isValidColor', () => {
  it('accepts hex, rgb, and transparent', () => {
    expect(isValidColor('#fff')).toBe(true)
    expect(isValidColor('rgb(1,2,3)')).toBe(true)
    expect(isValidColor('transparent')).toBe(true)
  })
  it('rejects non-colors', () => {
    expect(isValidColor('6px')).toBe(false)
    expect(isValidColor('')).toBe(false)
  })
})

describe('toPickerHex', () => {
  it('returns the 6-digit hex unchanged', () => {
    expect(toPickerHex('#CCFF00')).toBe('#CCFF00')
  })
  it('falls back for transparent', () => {
    expect(toPickerHex('transparent')).toBe('#000000')
  })
  it('falls back for a color with alpha', () => {
    expect(toPickerHex('rgba(0,0,0,0.5)')).toBe('#000000')
  })
  it('falls back for an invalid color', () => {
    expect(toPickerHex('nope')).toBe('#000000')
  })
  it('respects a custom fallback', () => {
    expect(toPickerHex('nope', '#123456')).toBe('#123456')
  })
})
