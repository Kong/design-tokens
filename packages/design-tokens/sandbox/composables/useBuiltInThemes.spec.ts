import { describe, expect, it } from 'vitest'
import { BUILT_IN_THEMES } from './useBuiltInThemes'
import { THEMES } from './useTokens'
import { isValidThemeJson } from '../utils/themeBuilderUtils'

describe('useBuiltInThemes', () => {
  it('exposes exactly the repo themes, in the same order and labels as THEMES', () => {
    expect(BUILT_IN_THEMES.map((t) => ({ id: t.id, label: t.label }))).toEqual(
      THEMES.map((t) => ({ id: t.id, label: t.label })),
    )
  })

  it('derives file names from each theme id', () => {
    for (const theme of BUILT_IN_THEMES) {
      expect(theme.themeFileName).toBe(`${theme.id}.theme.json`)
      expect(theme.aliasFileName).toBe(`${theme.id}.alias.color.json`)
    }
  })

  it('each entry\'s themeText parses to a valid theme.json shape', () => {
    for (const theme of BUILT_IN_THEMES) {
      const parsed = JSON.parse(theme.themeText)
      expect(isValidThemeJson(parsed)).toBe(true)
      // Sanity check it's non-trivial, not an accidentally-empty file.
      expect(Object.keys(parsed).length).toBeGreaterThan(0)
    }
  })

  it('each entry\'s aliasText parses to a color.alias palette', () => {
    for (const theme of BUILT_IN_THEMES) {
      const parsed = JSON.parse(theme.aliasText)
      expect(typeof parsed.color?.alias).toBe('object')
      expect(Object.keys(parsed.color.alias).length).toBeGreaterThan(0)
    }
  })
})
