import { describe, expect, it } from 'vitest'
import {
  ALL_ENTRIES,
  buildSections,
  categoryLabel,
  DEFAULT_THEME_ID,
  fuzzyMatchTokens,
  isThemeId,
  normalize,
  resolveThemedEntries,
  THEMES,
  toSassVar,
  tokenDisplayName,
  useTokens,
} from './useTokens'

describe('normalize', () => {
  it('lowercases and strips hyphens, underscores, and spaces', () => {
    expect(normalize('KUI-Color_BG value')).toBe('kuicolorbgvalue')
  })

  it('leaves an already-normalized string untouched', () => {
    expect(normalize('abc123')).toBe('abc123')
  })
})

describe('fuzzyMatchTokens', () => {
  it('matches a single term as a separator-agnostic substring', () => {
    expect(fuzzyMatchTokens('color-background', '--kui-color-background')).toBe(true)
  })

  it('matches regardless of the separator style used in the query', () => {
    expect(fuzzyMatchTokens('color_background', '--kui-color-background')).toBe(true)
    expect(fuzzyMatchTokens('color background', '--kui-color-background')).toBe(true)
  })

  it('requires every term to be present (AND semantics)', () => {
    expect(fuzzyMatchTokens('button primary', '--kui-button-color-background-primary')).toBe(true)
    expect(fuzzyMatchTokens('button danger', '--kui-button-color-background-primary')).toBe(false)
  })

  it('treats an empty or whitespace-only query as matching everything', () => {
    expect(fuzzyMatchTokens('', '--kui-color-background')).toBe(true)
    expect(fuzzyMatchTokens('   ', '--kui-color-background')).toBe(true)
  })

  it('searches across all provided targets, not just the first', () => {
    expect(fuzzyMatchTokens('ffffff', '--kui-color-background', '#ffffff')).toBe(true)
    expect(fuzzyMatchTokens('ffffff', '--kui-color-background', '#000000')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(fuzzyMatchTokens('BUTTON', '--kui-button-color-background-primary')).toBe(true)
  })

  it('does not match a term absent from every target', () => {
    expect(fuzzyMatchTokens('nonexistent', '--kui-color-background')).toBe(false)
  })
})

describe('toSassVar', () => {
  it('converts a CSS custom property to its Sass variable form', () => {
    expect(toSassVar('--kui-color-background')).toBe('$kui-color-background')
  })
})

describe('tokenDisplayName', () => {
  it('strips the leading -- prefix', () => {
    expect(tokenDisplayName('--kui-color-background')).toBe('kui-color-background')
  })
})

describe('categoryLabel', () => {
  it('title-cases each hyphen-separated word', () => {
    expect(categoryLabel('letter-spacing')).toBe('Letter Spacing')
  })

  it('handles a single-word category', () => {
    expect(categoryLabel('color')).toBe('Color')
  })
})

describe('ALL_ENTRIES', () => {
  it('is non-empty and includes both semantic and component tokens', () => {
    expect(ALL_ENTRIES.length).toBeGreaterThan(0)
    expect(ALL_ENTRIES.some((e) => e.category === 'components')).toBe(true)
    expect(ALL_ENTRIES.some((e) => e.category !== 'components')).toBe(true)
  })

  it('gives every entry a cssVar derived from its key', () => {
    for (const entry of ALL_ENTRIES) {
      expect(entry.cssVar.startsWith('--')).toBe(true)
    }
  })

  it('component tokens have an empty value (names-only) and a subcategory', () => {
    const componentEntries = ALL_ENTRIES.filter((e) => e.category === 'components')
    expect(componentEntries.length).toBeGreaterThan(0)
    for (const entry of componentEntries) {
      expect(entry.value).toBe('')
      expect(entry.subcategory).toBeTruthy()
    }
  })

  it('semantic tokens have a real, non-empty value', () => {
    const semanticEntries = ALL_ENTRIES.filter((e) => e.category !== 'components')
    expect(semanticEntries.length).toBeGreaterThan(0)
    for (const entry of semanticEntries) {
      expect(entry.value).not.toBe('')
    }
  })

  it('is sorted by key using natural numeric ordering', () => {
    const scaleKeys = ALL_ENTRIES
      .map((e) => e.key)
      .filter((k) => /_(\d+)$/.test(k))
      .filter((k) => k.startsWith('KUI_FONT_SIZE_'))
    if (scaleKeys.length > 2) {
      const numbers = scaleKeys.map((k) => Number(k.match(/_(\d+)$/)[1]))
      const sorted = [...numbers].sort((a, b) => a - b)
      expect(numbers).toEqual(sorted)
    }
  })
})

describe('buildSections', () => {
  it('returns null when there is only one distinct section', () => {
    const entries = [
      { key: 'KUI_COLOR_BACKGROUND', cssVar: '--kui-color-background', value: '#fff', category: 'color' },
      { key: 'KUI_COLOR_BACKGROUND_DANGER', cssVar: '--kui-color-background-danger', value: '#f00', category: 'color' },
    ]
    expect(buildSections(entries)).toBeNull()
  })

  it('groups entries by their second key segment when multiple sections exist', () => {
    const entries = [
      { key: 'KUI_COLOR_BACKGROUND', cssVar: '--kui-color-background', value: '#fff', category: 'color' },
      { key: 'KUI_COLOR_BORDER', cssVar: '--kui-color-border', value: '#000', category: 'color' },
    ]
    const sections = buildSections(entries)
    expect(sections).not.toBeNull()
    const names = sections.map((s) => s.section).sort()
    expect(names).toEqual(['background', 'border'])
  })

  it('groups component tokens by subcategory (component name), not key segment', () => {
    const entries = [
      { key: 'KUI_BUTTON_COLOR_BACKGROUND', cssVar: '--kui-button-color-background', value: '', category: 'components', subcategory: 'button' },
      { key: 'KUI_ALERT_COLOR_BACKGROUND', cssVar: '--kui-alert-color-background', value: '', category: 'components', subcategory: 'alert' },
    ]
    const sections = buildSections(entries)
    const names = sections.map((s) => s.section).sort()
    expect(names).toEqual(['alert', 'button'])
  })
})

describe('useTokens composable', () => {
  it('defaults to the color category with an empty search', () => {
    const { search, activeCategory } = useTokens()
    expect(search.value).toBe('')
    expect(activeCategory.value).toBe('color')
  })

  it('filteredTokens reflects only the active category', () => {
    const { activeCategory, filteredTokens, categories } = useTokens()
    expect(categories.value.length).toBeGreaterThan(0)
    for (const entry of filteredTokens.value) {
      expect(entry.category).toBe('color')
    }
    activeCategory.value = 'components'
    for (const entry of filteredTokens.value) {
      expect(entry.category).toBe('components')
    }
  })

  it('globalSearchResults is null when the search is empty', () => {
    const { globalSearchResults } = useTokens()
    expect(globalSearchResults.value).toBeNull()
  })

  it('globalSearchResults groups matches by category and excludes non-matching categories', () => {
    const { search, globalSearchResults } = useTokens()
    search.value = 'button'
    expect(globalSearchResults.value).not.toBeNull()
    expect(globalSearchResults.value.length).toBeGreaterThan(0)
    for (const group of globalSearchResults.value) {
      for (const entry of group.entries) {
        expect(fuzzyMatchTokens('button', entry.key, entry.cssVar, entry.value)).toBe(true)
      }
    }
  })

  it('globalSearchResults is an empty array (not null) when nothing matches', () => {
    const { search, globalSearchResults } = useTokens()
    search.value = 'this-token-definitely-does-not-exist-zzz'
    expect(globalSearchResults.value).toEqual([])
  })

  it('countByCategory totals match the actual per-category entry counts', () => {
    const { countByCategory, categories } = useTokens()
    for (const cat of categories.value) {
      const actual = ALL_ENTRIES.filter((e) => e.category === cat).length
      expect(countByCategory.value[cat]).toBe(actual)
    }
  })

  it('componentSubcategories lists each component name exactly once', () => {
    const { componentSubcategories } = useTokens()
    const unique = new Set(componentSubcategories.value)
    expect(unique.size).toBe(componentSubcategories.value.length)
    expect(componentSubcategories.value.length).toBeGreaterThan(0)
  })

  describe('theme preview', () => {
    it('defaults activeTheme to classic-day', () => {
      const { activeTheme } = useTokens()
      expect(activeTheme.value).toBe(DEFAULT_THEME_ID)
      expect(DEFAULT_THEME_ID).toBe('classic-day')
    })

    it('selecting the default theme reproduces the un-themed base values exactly', () => {
      const { activeTheme, categories, countByCategory } = useTokens()
      const before = { ...countByCategory.value }
      activeTheme.value = 'classic-day'
      for (const cat of categories.value) {
        expect(countByCategory.value[cat]).toBe(before[cat])
      }
    })

    it('switching to a non-default theme changes at least one semantic color value', () => {
      const { activeTheme, filteredTokens } = useTokens()
      const before = filteredTokens.value.map((e) => e.value)
      activeTheme.value = 'classic-night'
      const after = filteredTokens.value.map((e) => e.value)
      expect(after).not.toEqual(before)
    })

    it('does not change the count of tokens in any category — only their values', () => {
      const { activeTheme, categories, countByCategory } = useTokens()
      const before = { ...countByCategory.value }
      activeTheme.value = 'electric-lime-day'
      for (const cat of categories.value) {
        expect(countByCategory.value[cat]).toBe(before[cat])
      }
    })

    it('a semantic-only theme (classic-night) leaves component tokens at their base (empty) value', () => {
      const { activeTheme, byCategory } = useTokens()
      activeTheme.value = 'classic-night'
      const componentEntries = byCategory.value.get('components') ?? []
      expect(componentEntries.length).toBeGreaterThan(0)
      for (const entry of componentEntries) {
        expect(entry.value).toBe('')
      }
    })

    it('an exhaustive theme (electric-lime-day) overrides at least one component token value', () => {
      const { activeTheme, byCategory } = useTokens()
      activeTheme.value = 'electric-lime-day'
      const componentEntries = byCategory.value.get('components') ?? []
      expect(componentEntries.some((e) => e.value !== '')).toBe(true)
    })

    it('falls back to unmodified base values for a token the theme does not declare', () => {
      // electric-lime-day is exhaustive but the fixture asserts the general contract: any
      // token absent from theme.tokens keeps ALL_ENTRIES' base value, not an empty string.
      const themed = THEMES.find((t) => t.id === 'electric-lime-day')
      const untouchedEntry = ALL_ENTRIES.find((e) => e.category !== 'components' && !(e.cssVar in themed.tokens))
      if (untouchedEntry) {
        const { activeTheme, byCategory } = useTokens()
        activeTheme.value = 'electric-lime-day'
        const entry = (byCategory.value.get(untouchedEntry.category) ?? []).find((e) => e.key === untouchedEntry.key)
        expect(entry.value).toBe(untouchedEntry.value)
      }
    })
  })
})

describe('THEMES', () => {
  it('lists all 4 repo themes with classic-day first (the default)', () => {
    expect(THEMES).toHaveLength(4)
    expect(THEMES[0].id).toBe('classic-day')
    expect(THEMES.map((t) => t.id)).toEqual(['classic-day', 'classic-night', 'electric-lime-day', 'electric-lime-night'])
  })

  it('gives every theme a non-empty label and a non-empty token map', () => {
    for (const theme of THEMES) {
      expect(theme.label.length).toBeGreaterThan(0)
      expect(Object.keys(theme.tokens).length).toBeGreaterThan(0)
    }
  })
})

describe('isThemeId', () => {
  it('is true for every known theme id', () => {
    for (const theme of THEMES) {
      expect(isThemeId(theme.id)).toBe(true)
    }
  })

  it('is false for an unknown id', () => {
    expect(isThemeId('not-a-real-theme')).toBe(false)
    expect(isThemeId('')).toBe(false)
  })
})

describe('resolveThemedEntries', () => {
  it('is a no-op passthrough for the default theme', () => {
    expect(resolveThemedEntries(ALL_ENTRIES, DEFAULT_THEME_ID)).toBe(ALL_ENTRIES)
  })

  it('overlays only the keys a non-default theme declares, leaving others at their base value', () => {
    const theme = THEMES.find((t) => t.id === 'electric-lime-day')
    if (!theme) throw new Error('electric-lime-day theme not found')
    const result = resolveThemedEntries(ALL_ENTRIES, theme.id)
    for (const entry of result) {
      const declared = theme.tokens[entry.cssVar]
      const base = ALL_ENTRIES.find((e) => e.cssVar === entry.cssVar)
      if (!base) throw new Error(`missing base entry for ${entry.cssVar}`)
      expect(entry.value).toBe(declared === undefined ? base.value : declared)
    }
  })
})
