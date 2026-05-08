import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ALL_ENTRIES, CATEGORY_LABELS, CATEGORY_ORDER } from './useTokens'
import type { TokenCategory, TokenEntry } from './useTokens'

/**
 * Module-level reactive map of CSS variable overrides.
 * Module scope (not composable scope) so overrides persist when navigating between pages.
 */
const overrides = reactive<Record<string, string>>({})

/**
 * Builds a complete `:root { ... }` CSS block from all token entries,
 * substituting any overridden values. Used for the "full export" feature.
 */
function buildCss(entries: typeof ALL_ENTRIES, overrideMap: Record<string, string>): string {
  const linesByCat: Record<string, string[]> = {}

  for (const entry of entries) {
    const value = overrideMap[entry.cssVar] ?? entry.value
    const label = CATEGORY_LABELS[entry.category] ?? entry.category
    if (!linesByCat[label]) linesByCat[label] = []
    linesByCat[label].push(`  ${entry.cssVar}: ${value};`)
  }

  const sections = [...CATEGORY_ORDER]
    .map((cat) => CATEGORY_LABELS[cat] ?? cat)
    .filter((label) => linesByCat[label])
    .map((label) => `  /* ${label} */\n${linesByCat[label].join('\n')}`)
    .join('\n\n')

  return `:root {\n${sections}\n}`
}

/** Shape returned by `visibleGroups` — one entry per category visible in the editor. */
export interface CustGroup {
  /** The category identifier */
  category: TokenCategory
  /** Filtered entries for this category */
  entries: TokenEntry[]
  /** How many entries in this group have active overrides */
  overrideCount: number
}

/** Known CSS variable names in the current token set, for filtering stale share-link overrides. */
const KNOWN_CSS_VARS = new Set(ALL_ENTRIES.map((e) => e.cssVar))

/**
 * Encodes the current overrides object into a URL-safe base64 string.
 * Returns an empty string when there are no overrides.
 */
function encodeOverrides(map: Record<string, string>): string {
  const entries = Object.entries(map)
  if (!entries.length) return ''
  return btoa(JSON.stringify(map))
}

/**
 * Decodes a base64 override string back into a plain object.
 * Returns an empty object on any parse failure so stale/corrupt links degrade gracefully.
 */
function decodeOverrides(encoded: string): Record<string, string> {
  try {
    const parsed = JSON.parse(atob(encoded))
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    // Filter to only CSS vars that exist in the current token set — survives token renames/removals
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([k, v]) => KNOWN_CSS_VARS.has(k) && typeof v === 'string')
        .map(([k, v]) => [k, v as string]),
    )
  } catch {
    return {}
  }
}

/**
 * Composable for the token customizer page.
 * Manages per-token value overrides, editor filter/collapse state, CSS export strings,
 * and injects live overrides into the document so preview elements update in real time.
 */
export function useTokenCustomizer() {
  const filterQuery = ref('')
  const collapsed = reactive<Record<string, boolean>>({})

  /** Toggles the collapsed state of a category accordion group. */
  function toggleGroup(cat: string) {
    collapsed[cat] = !collapsed[cat]
  }

  /**
   * All category groups filtered by the editor search query, with per-group override counts.
   * Categories with no matching entries are excluded from the list.
   */
  const visibleGroups = computed((): CustGroup[] => {
    const q = filterQuery.value.toLowerCase().trim()
    const order = [...CATEGORY_ORDER]
    const extra = ([...new Set(ALL_ENTRIES.map((e) => e.category))] as TokenCategory[]).filter(
      (c) => !order.includes(c),
    )

    return [...order, ...extra]
      .map((cat) => {
        let entries = ALL_ENTRIES.filter((e) => e.category === cat)
        if (q) entries = entries.filter((e) => e.cssVar.includes(q) || e.value.includes(q))
        const overrideCount = entries.filter((e) => overrides[e.cssVar]).length
        return { category: cat, entries, overrideCount }
      })
      .filter((g) => g.entries.length > 0)
  })

  /**
   * Sets or clears a single token override.
   * Clears when the new value is empty or matches the original default.
   *
   * @param cssVar - The CSS custom property name, e.g. `--kui-color-background`
   * @param value - The new value entered by the user
   * @param defaultValue - The original token value to compare against
   */
  function setOverride(cssVar: string, value: string, defaultValue: string) {
    const trimmed = value.trim()
    if (!trimmed || trimmed === defaultValue) {
      delete overrides[cssVar]
    } else {
      overrides[cssVar] = trimmed
    }
  }

  /** Clears all active overrides, restoring every token to its default value. */
  function resetAll() {
    for (const key in overrides) delete overrides[key]
  }

  /** Number of tokens currently overridden. */
  const overrideCount = computed(() => Object.keys(overrides).length)

  /** `true` when at least one token has been overridden. */
  const hasOverrides = computed(() => overrideCount.value > 0)

  /**
   * Minimal `:root { ... }` block containing only the changed tokens.
   * Suitable for dropping into a site's existing CSS without replacing defaults.
   */
  const overridesCss = computed(() => {
    if (!hasOverrides.value) return ''
    const lines = Object.entries(overrides).map(([k, v]) => `  ${k}: ${v};`)
    return `:root {\n${lines.join('\n')}\n}`
  })

  /**
   * Complete `:root { ... }` block with all tokens, overrides applied.
   * Suitable as a standalone stylesheet for sites that don't already load KUI tokens.
   */
  const fullExportCss = computed(() => buildCss(ALL_ENTRIES, overrides))

  /**
   * Returns the current page URL with active overrides encoded in the hash fragment.
   * Format: `<origin>/customize#o=<base64(JSON)>`
   * Returns the base URL (no hash) when there are no overrides.
   */
  function getShareUrl(): string {
    const base = `${window.location.origin}/customize`
    const encoded = encodeOverrides(overrides)
    return encoded ? `${base}#o=${encoded}` : base
  }

  /**
   * Reads the `#o=` hash fragment on mount and applies any valid overrides found there.
   * Stale/renamed token vars are silently ignored so share links survive token changes.
   */
  onMounted(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#o=')) return
    const encoded = hash.slice(3)
    const decoded = decodeOverrides(encoded)
    for (const [cssVar, value] of Object.entries(decoded)) {
      overrides[cssVar] = value
    }
  })

  /**
   * Injects live override values into a `<style id="tb-live-overrides">` tag
   * so any element that uses `--kui-*` vars updates immediately.
   */
  watch(
    overrides,
    () => {
      let el = document.getElementById('tb-live-overrides') as HTMLStyleElement | null
      if (!el) {
        el = document.createElement('style')
        el.id = 'tb-live-overrides'
        document.head.appendChild(el)
      }
      const rules = Object.entries(overrides)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')
      el.textContent = rules ? `:root {\n${rules}\n}` : ''
    },
    { deep: true },
  )

  return {
    overrides,
    overrideCount,
    hasOverrides,
    filterQuery,
    collapsed,
    visibleGroups,
    toggleGroup,
    setOverride,
    resetAll,
    overridesCss,
    fullExportCss,
    getShareUrl,
  }
}
