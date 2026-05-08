import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ALL_ENTRIES, CATEGORY_LABELS, CATEGORY_ORDER, normalize } from './useTokens'
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
 * Encodes the overrides map as URL-safe base64 (RFC 4648 §5).
 *
 * Uses index-based keys instead of full CSS var names to keep the URL short —
 * a full 337-token override encodes to ~8 KB instead of ~24 KB with named keys.
 * The index maps to the position in the stable `ALL_ENTRIES` array.
 *
 * Returns an empty string when there are no overrides.
 */
function encodeOverrides(map: Record<string, string>): string {
  const entries = Object.entries(map)
  if (!entries.length) return ''
  const compact = entries
    .map(([cssVar, val]) => [ALL_ENTRIES.findIndex((e) => e.cssVar === cssVar), val])
    .filter(([idx]) => (idx as number) !== -1)
  const json = JSON.stringify(compact)
  // URL-safe base64: replace + → -, / → _, strip padding = so the hash stays clean
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Decodes a URL-safe base64 override string produced by `encodeOverrides`.
 * Returns an empty object on any parse failure so stale/corrupt share links degrade gracefully.
 * Entries whose index no longer exists in ALL_ENTRIES are silently ignored.
 */
function decodeOverrides(encoded: string): Record<string, string> {
  try {
    // Re-pad and convert back from URL-safe base64 before atob
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
      + '='.repeat((4 - (encoded.length % 4)) % 4)
    const parsed = JSON.parse(atob(padded))
    if (!Array.isArray(parsed)) return {}
    const result: Record<string, string> = {}
    for (const item of parsed) {
      if (!Array.isArray(item) || item.length !== 2) continue
      const [idx, val] = item
      if (typeof idx !== 'number' || typeof val !== 'string') continue
      const entry = ALL_ENTRIES[idx]
      if (!entry || !KNOWN_CSS_VARS.has(entry.cssVar)) continue
      result[entry.cssVar] = val
    }
    return result
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

  /** Toggles the collapsed state of a single category accordion group. */
  function toggleGroup(cat: string) {
    collapsed[cat] = !collapsed[cat]
  }

  /** Collapses every visible group at once. */
  function collapseAll() {
    for (const g of visibleGroups.value) collapsed[g.category] = true
  }

  /** Expands every visible group at once. */
  function expandAll() {
    for (const g of visibleGroups.value) collapsed[g.category] = false
  }

  /** `true` when every visible group is currently collapsed. */
  const allCollapsed = computed(() => visibleGroups.value.every((g) => !!collapsed[g.category]))

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
        if (q) entries = entries.filter((e) => normalize(e.cssVar).includes(normalize(q)) || normalize(e.value).includes(normalize(q)))
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
    // Normalize hex to uppercase so overrides are stored consistently (#FF5733 not #ff5733)
    const normalized = /^#[0-9a-f]{3,8}$/i.test(trimmed) ? trimmed.toUpperCase() : trimmed
    if (!normalized || normalized === defaultValue) {
      delete overrides[cssVar]
    } else {
      overrides[cssVar] = normalized
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
   * Format: `<origin>/customize#o=<url-safe-base64>`
   * Returns the plain `/customize` URL when there are no overrides so the link is always shareable.
   */
  function getShareUrl(): string {
    const base = `${window.location.origin}/customize`
    const encoded = encodeOverrides(overrides)
    return encoded ? `${base}#o=${encoded}` : base
  }

  /** Reactive share URL — updates automatically as overrides change. */
  const shareUrl = computed(() => getShareUrl())

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
    allCollapsed,
    visibleGroups,
    toggleGroup,
    collapseAll,
    expandAll,
    setOverride,
    resetAll,
    overridesCss,
    fullExportCss,
    shareUrl,
  }
}
