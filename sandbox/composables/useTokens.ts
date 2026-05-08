import { computed, ref } from 'vue'
import * as rawTokens from '@tokens/js'

/** All possible token categories derived from the KUI_ key prefix patterns. */
export type TokenCategory =
  | 'color'
  | 'space'
  | 'font'
  | 'border'
  | 'shadow'
  | 'animation'
  | 'breakpoint'
  | 'letter-spacing'
  | 'line-height'
  | 'components'

/** A single resolved design token with its derived metadata. */
export interface TokenEntry {
  /** Screaming snake-case JS export name, e.g. `KUI_COLOR_BACKGROUND` */
  key: string
  /** Derived CSS custom property name, e.g. `--kui-color-background` */
  cssVar: string
  /** Resolved token value, e.g. `#ffffff` */
  value: string
  /** Broad category used for tab grouping and preview rendering */
  category: TokenCategory
  /** Set only for `'components'` category tokens: `icon | method | navigation | status` */
  subcategory?: string
}

/** A named group of tokens within a category tab. */
export interface TokenSection {
  /** Display label for the section header (capitalized) */
  section: string
  entries: TokenEntry[]
}

/** Component sub-categories that map to the `components` category bucket. */
const COMPONENT_SUBCATS = new Set(['ICON', 'METHOD', 'NAVIGATION', 'STATUS'])

/**
 * Categories that are subdivided into named sections within their tab.
 * The section name is derived from the second key segment after dropping `KUI`.
 */
const SECTIONED_CATEGORIES = new Set<TokenCategory>(['color', 'font', 'border', 'shadow'])

/**
 * Derives the category and optional subcategory from a screaming-snake-case token key.
 *
 * `KUI_LETTER_SPACING_*` and `KUI_LINE_HEIGHT_*` have two-word prefixes that must be
 * matched before the generic single-word fallback, otherwise they collapse to 'letter' / 'line'.
 */
function parseCategory(key: string): { category: TokenCategory, subcategory?: string } {
  const parts = key.split('_').slice(1) // drop 'KUI'
  if (parts[0] === 'LETTER' && parts[1] === 'SPACING') return { category: 'letter-spacing' }
  if (parts[0] === 'LINE' && parts[1] === 'HEIGHT') return { category: 'line-height' }
  if (COMPONENT_SUBCATS.has(parts[0])) {
    return { category: 'components', subcategory: parts[0].toLowerCase() }
  }
  return { category: parts[0].toLowerCase() as TokenCategory }
}

/** Converts a screaming-snake-case token key to its CSS custom property name. */
function toCssVar(key: string): string {
  return '--' + key.toLowerCase().replace(/_/g, '-')
}

/**
 * Converts a CSS custom property name to its Sass variable equivalent.
 * @example `--kui-color-background` → `$kui-color-background`
 */
export function toSassVar(cssVar: string): string {
  return '$' + cssVar.slice(2)
}

/**
 * Returns the human-readable display name for a token: lowercase kebab-case without the `--` prefix.
 * @example `--kui-color-background` → `kui-color-background`
 */
export function tokenDisplayName(cssVar: string): string {
  return cssVar.slice(2)
}

/**
 * All token entries derived from the flat `@tokens/js` export, sorted with natural numeric ordering
 * so `_10, _20 ... _100, _110` stays in numeric sequence rather than lexicographic.
 *
 * Exported so other composables (e.g. `useTokenCustomizer`) can iterate all tokens
 * without creating a separate reactive search state via `useTokens()`.
 */
export const ALL_ENTRIES: TokenEntry[] = Object.entries(rawTokens as Record<string, string>)
  .map(([key, value]) => {
    const { category, subcategory } = parseCategory(key)
    return { key, cssVar: toCssVar(key), value, category, subcategory }
  })
  .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))

/**
 * Known categories in the desired display order.
 * Any category not listed here is appended automatically, so new token sets
 * are always visible even before they're explicitly handled.
 */
export const CATEGORY_ORDER: TokenCategory[] = [
  'color',
  'space',
  'font',
  'border',
  'shadow',
  'animation',
  'breakpoint',
  'letter-spacing',
  'line-height',
  'components',
]

/** Human-readable labels for each token category, used in tabs and search section headers. */
export const CATEGORY_LABELS: Record<string, string> = {
  'color': 'Color',
  'space': 'Space',
  'font': 'Font',
  'border': 'Border',
  'shadow': 'Shadow',
  'animation': 'Animation',
  'breakpoint': 'Breakpoint',
  'letter-spacing': 'Letter Spacing',
  'line-height': 'Line Height',
  'components': 'Components',
}

/**
 * Derives the within-category section name for a token.
 * Only sectionable categories return a value; others return null.
 *
 * @example `KUI_COLOR_BACKGROUND_DANGER` → `'background'`
 * @example `KUI_FONT_SIZE_30` → `'size'`
 */
function getTokenSection(entry: TokenEntry): string | null {
  if (!SECTIONED_CATEGORIES.has(entry.category)) return null
  const parts = entry.key.split('_').slice(1) // drop 'KUI'
  return parts[1]?.toLowerCase() ?? null
}

/**
 * Groups an array of entries into named sections.
 * Returns null when the category has only one section (flat display preferred).
 */
function buildSections(entries: TokenEntry[]): TokenSection[] | null {
  const map = new Map<string, TokenEntry[]>()
  for (const entry of entries) {
    const s = getTokenSection(entry) ?? '__flat__'
    if (!map.has(s)) map.set(s, [])
    map.get(s)!.push(entry)
  }
  if (map.size <= 1) return null // single group = no headers needed
  return [...map.entries()].map(([section, sectionEntries]) => ({
    section,
    entries: sectionEntries,
  }))
}

/**
 * Composable that provides reactive token browsing state: active category,
 * search query, filtered results, cross-tab search, per-category sections, and counts.
 */
export function useTokens() {
  const search = ref('')
  const activeCategory = ref<TokenCategory>('color')

  /** All token entries grouped by category. */
  const byCategory = computed(() => {
    const map = new Map<TokenCategory, TokenEntry[]>()
    for (const entry of ALL_ENTRIES) {
      if (!map.has(entry.category)) map.set(entry.category, [])
      map.get(entry.category)!.push(entry)
    }
    return map
  })

  /**
   * Ordered known categories first, then any new/unknown categories appended automatically.
   * This ensures newly added token sets surface in the browser without code changes.
   */
  const categories = computed((): TokenCategory[] => {
    const known = CATEGORY_ORDER.filter((cat) => byCategory.value.has(cat))
    const unknown = ([...byCategory.value.keys()] as TokenCategory[]).filter(
      (cat) => !(CATEGORY_ORDER as string[]).includes(cat),
    )
    return [...known, ...unknown]
  })

  /** Unique component sub-category names, in the order they appear in ALL_ENTRIES. */
  const componentSubcategories = computed(() => {
    const entries = byCategory.value.get('components') ?? []
    return [...new Set(entries.map((e) => e.subcategory).filter(Boolean))] as string[]
  })

  /** Component entries keyed by subcategory, for grouped rendering in the Components tab. */
  const componentsBySubcat = computed(() => {
    const entries = byCategory.value.get('components') ?? []
    const map: Record<string, TokenEntry[]> = {}
    for (const e of entries) {
      const sub = e.subcategory ?? 'other'
      if (!map[sub]) map[sub] = []
      map[sub].push(e)
    }
    return map
  })

  /**
   * Per-category section groups for categories that support in-tab sectioning
   * (color, font, border, shadow). Returns null for flat categories.
   */
  const categorySections = computed(() => {
    const result = new Map<TokenCategory, TokenSection[] | null>()
    for (const [cat, entries] of byCategory.value) {
      result.set(cat, buildSections(entries))
    }
    return result
  })

  /**
   * Cross-category search results, grouped by category.
   * Returns `null` when the search query is empty (normal tab-browse mode).
   * Returns an empty array when the query is non-empty but nothing matches.
   */
  const globalSearchResults = computed(() => {
    const q = search.value.toLowerCase().trim()
    if (!q) return null

    const results: Array<{ category: TokenCategory, entries: TokenEntry[] }> = []
    for (const cat of categories.value) {
      const matches = (byCategory.value.get(cat) ?? []).filter(
        (e) => e.key.toLowerCase().includes(q) || e.value.toLowerCase().includes(q),
      )
      if (matches.length > 0) results.push({ category: cat, entries: matches })
    }
    return results
  })

  /** Tokens for the active tab. */
  const filteredTokens = computed(() => byCategory.value.get(activeCategory.value) ?? [])

  /** Total token count per category, used for the count badges on tabs. */
  const countByCategory = computed(() => {
    const result: Record<string, number> = {}
    for (const [cat, entries] of byCategory.value) {
      result[cat] = entries.length
    }
    return result
  })

  return {
    search,
    activeCategory,
    categories,
    componentSubcategories,
    componentsBySubcat,
    categorySections,
    filteredTokens,
    globalSearchResults,
    countByCategory,
  }
}
