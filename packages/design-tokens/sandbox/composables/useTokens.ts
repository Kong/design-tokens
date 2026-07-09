import { computed, ref } from 'vue'
import * as rawTokens from '@tokens/js'
import { KUI_THEMEABLE_TOKENS } from '@tokens/themeable-tokens'

/**
 * Token category string. Known values: color, space, font, border, shadow,
 * animation, breakpoint, letter-spacing, line-height, components.
 * Kept as `string` so new token categories surface automatically without requiring
 * code changes — see `CATEGORY_ORDER` and `categoryLabel` for display handling.
 */
export type TokenCategory = string

/** A single resolved design token with its derived metadata. */
export interface TokenEntry {
  /** Screaming snake-case JS export name, e.g. `KUI_COLOR_BACKGROUND` */
  key: string
  /** Derived CSS custom property name, e.g. `--kui-color-background` */
  cssVar: string
  /**
   * Resolved token value, e.g. `#ffffff`.
   * Empty string for component tokens that have no default value — they inherit
   * from the semantic fallback chain at runtime and are omitted from CSS export
   * until overridden.
   */
  value: string
  /** Broad category used for tab grouping and preview rendering */
  category: TokenCategory
  /** Set only for `'components'` category tokens; value is the component name, e.g. `button` */
  subcategory?: string
}

/** A named group of tokens within a category tab. */
export interface TokenSection {
  /** Display label for the section header (capitalized) */
  section: string
  /** Token entries belonging to this section. */
  entries: TokenEntry[]
}

/**
 * Categories that are subdivided into named sections within their tab.
 * `'components'` sections by component name (button, alert, …) rather than by
 * token property type, so each component's tokens form their own collapsed group.
 */
export const SECTIONED_CATEGORIES = new Set<TokenCategory>(['color', 'font', 'border', 'shadow', 'components'])

/**
 * Normalizes a search string for separator-agnostic matching.
 * Strips hyphens, underscores, and spaces so `kui-color-bg`, `kui_color_bg`,
 * and `kui color bg` all resolve to the same normalized form.
 */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/[-_\s]+/g, '')
}

/**
 * Derives the category and optional subcategory from a screaming-snake-case token key
 * for tokens sourced from the `@tokens/js` scalar export (semantic and scale tokens only).
 *
 * `KUI_LETTER_SPACING_*` and `KUI_LINE_HEIGHT_*` have two-word prefixes that must be
 * matched before the generic single-word fallback, otherwise they collapse to 'letter' / 'line'.
 * Component tokens are sourced separately from `KUI_THEMEABLE_TOKENS` and bypass this function.
 */
function parseCategory(key: string): { category: TokenCategory } {
  const parts = key.split('_').slice(1) // drop 'KUI'
  if (parts[0] === 'LETTER' && parts[1] === 'SPACING') return { category: 'letter-spacing' }
  if (parts[0] === 'LINE' && parts[1] === 'HEIGHT') return { category: 'line-height' }
  return { category: parts[0].toLowerCase() }
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
 * All token entries: semantic/scale tokens from the flat `@tokens/js` export, plus
 * component tokens from `KUI_THEMEABLE_TOKENS` (empty value = unset by default;
 * the semantic fallback chain resolves the actual rendered value at CSS runtime).
 *
 * Sorted with natural numeric ordering so `_10, _20 ... _100, _110` stays in
 * numeric sequence rather than lexicographic.
 *
 * Exported so other composables (e.g. `useTokenCustomizer`) can iterate all tokens
 * without creating a separate reactive search state via `useTokens()`.
 */
export const ALL_ENTRIES: TokenEntry[] = [
  // Semantic and scale tokens — sourced from the resolved SCSS/JS export
  ...Object.entries(rawTokens as Record<string, string>)
    .map(([key, value]) => {
      const { category } = parseCategory(key)
      return { key, cssVar: toCssVar(key), value, category } satisfies TokenEntry
    }),

  // Component tokens — sourced from the themeable-token registry (value: null → empty string).
  // Empty value = no default emitted in CSS; the component relies on its semantic fallback chain.
  // Grouped under the 'components' category and sub-sectioned by component name.
  ...KUI_THEMEABLE_TOKENS
    .filter((t) => t.category === 'component')
    .map((t) => ({
      // Convert --kui-button-color-background → KUI_BUTTON_COLOR_BACKGROUND (for sorting parity)
      key: t.name.slice(2).toUpperCase().replace(/-/g, '_'),
      cssVar: t.name,
      value: t.value ?? '',
      category: 'components' as TokenCategory,
      // First path segment after `--kui-` is the component name, e.g. 'button' from '--kui-button-color-*'
      subcategory: t.name.slice(6).split('-')[0],
    }) satisfies TokenEntry),
].sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))


/**
 * Returns a human-readable label for any category, derived directly from its key.
 * @example `"letter-spacing"` → `"Letter Spacing"`
 */
export function categoryLabel(cat: string): string {
  return cat.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

/**
 * Derives the within-category section name for a token.
 * Only sectionable categories return a value; others return null.
 *
 * - `'components'` sections by component name (subcategory), e.g. `'button'`, `'alert'`.
 * - Other sectionable categories section by the second key segment, e.g. `'background'`, `'size'`.
 *
 * @example `KUI_COLOR_BACKGROUND_DANGER` → `'background'`
 * @example `KUI_FONT_SIZE_30` → `'size'`
 * @example `--kui-button-color-background-primary` (category 'components') → `'button'`
 */
function getTokenSection(entry: TokenEntry): string | null {
  if (!SECTIONED_CATEGORIES.has(entry.category)) return null
  if (entry.category === 'components') return entry.subcategory ?? null
  const parts = entry.key.split('_').slice(1) // drop 'KUI'
  return parts[1]?.toLowerCase() ?? null
}

/**
 * Groups an array of entries into named sections.
 * Returns null when the category has only one section (flat display preferred).
 */
export function buildSections(entries: TokenEntry[]): TokenSection[] | null {
  const map = new Map<string, TokenEntry[]>()
  for (const entry of entries) {
    const s = getTokenSection(entry) ?? '__flat__'
    if (!map.has(s)) map.set(s, [])
    map.get(s)!.push(entry)
  }
  if (map.size <= 1) return null
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

  /** Categories in the order they first appear in the sorted token set. */
  const categories = computed((): TokenCategory[] => [...byCategory.value.keys()])

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
   *
   * Matching is separator-agnostic: `kui-color-bg`, `kui_color_bg`, and `kui color bg`
   * all match the same tokens (hyphens, underscores, and spaces are stripped before comparison).
   */
  const globalSearchResults = computed(() => {
    const q = normalize(search.value.trim())
    if (!q) return null

    const results: Array<{ category: TokenCategory, entries: TokenEntry[] }> = []
    for (const cat of categories.value) {
      const matches = (byCategory.value.get(cat) ?? []).filter(
        (e) =>
          normalize(e.key).includes(q) ||
          normalize(e.cssVar).includes(q) ||
          normalize(e.value).includes(q),
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
