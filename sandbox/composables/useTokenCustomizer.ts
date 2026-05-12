import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ALL_ENTRIES, categoryLabel, normalize } from './useTokens'
import type { TokenCategory, TokenEntry } from './useTokens'
import { getHashParam, setHashParams } from '../lib/hashRouteQuery'

/**
 * Module-level reactive map of CSS variable overrides.
 * Module scope (not composable scope) so overrides persist when navigating between pages.
 */
const overrides = reactive<Record<string, string>>({})

/**
 * Builds a complete `:root { ... }` CSS block from all token entries,
 * substituting any overridden values. Used for the "full export" feature.
 * @param entries - The full list of token entries to render.
 * @param overrideMap - Map of CSS var name to overridden value.
 */
function buildCss(entries: typeof ALL_ENTRIES, overrideMap: Record<string, string>): string {
  const linesByCat: Record<string, string[]> = {}
  const catOrder: string[] = []

  for (const entry of entries) {
    const value = overrideMap[entry.cssVar] ?? entry.value
    const label = categoryLabel(entry.category)
    if (!linesByCat[label]) {
      linesByCat[label] = []
      catOrder.push(label)
    }
    linesByCat[label].push(`  ${entry.cssVar}: ${value};`)
  }

  const sections = catOrder
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

// Share-link encoding/decoding

/**
 * Compresses a byte array using the browser-native DeflateRaw algorithm.
 * Falls back to the uncompressed input on browsers that lack CompressionStream.
 */
async function deflate(input: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === 'undefined') return input
  const cs = new CompressionStream('deflate-raw')
  const writer = cs.writable.getWriter()
  const reader = cs.readable.getReader()
  writer.write(new Uint8Array(input))
  writer.close()
  const chunks: Uint8Array[] = []
  let done = false
  while (!done) {
    const result = await reader.read()
    if (result.value) chunks.push(result.value)
    done = result.done
  }
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0))
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset); offset += c.length
  }
  return out
}

/**
 * Decompresses a DeflateRaw-compressed byte array.
 * Falls back to the uncompressed input on browsers that lack DecompressionStream.
 */
async function inflate(input: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') return input
  const ds = new DecompressionStream('deflate-raw')
  const writer = ds.writable.getWriter()
  const reader = ds.readable.getReader()
  writer.write(new Uint8Array(input))
  writer.close()
  const chunks: Uint8Array[] = []
  let done = false
  while (!done) {
    const result = await reader.read()
    if (result.value) chunks.push(result.value)
    done = result.done
  }
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0))
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset); offset += c.length
  }
  return out
}

/** Converts a byte array to URL-safe base64 (RFC 4648 §5, no padding). */
function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/** Converts URL-safe base64 back to a byte array. */
function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}

/**
 * Encodes the overrides map as a compressed, URL-safe base64 string.
 *
 * Format: `c1:<url-safe-base64-of-deflate-raw-compressed-json>`
 * The `c1:` prefix identifies the encoding version so future decoders can switch
 * strategies without silently corrupting existing share links.
 *
 * Falls back gracefully to uncompressed base64 (no prefix) when CompressionStream
 * is unavailable (e.g. older browsers, Node.js environments).
 *
 * Returns an empty string when there are no overrides.
 * @param map - The override map to encode.
 * @returns A URL-safe encoded string, or empty string if the map is empty.
 */
export async function encodeOverrides(map: Record<string, string>): Promise<string> {
  const entries = Object.entries(map)
  if (!entries.length) return ''
  // Strip the common '--kui-' prefix to reduce payload size
  const compact = entries.map(([cssVar, val]) => [cssVar.slice(6), val])
  const json = JSON.stringify(compact)
  const raw = new TextEncoder().encode(json)
  try {
    const compressed = await deflate(raw)
    // Only use compressed form if it's actually smaller
    if (compressed.length < raw.length) {
      return 'c1:' + toBase64Url(compressed)
    }
  } catch {
    // fall through to uncompressed
  }
  return toBase64Url(raw)
}

/**
 * Decodes a share-link string produced by `encodeOverrides`.
 * Handles both `c1:` (compressed) and legacy uncompressed formats.
 * Returns an empty object on any parse or decompression failure.
 * Entries whose CSS var is not in the current token set are silently ignored.
 */
async function decodeOverrides(encoded: string): Promise<Record<string, string>> {
  try {
    let json: string
    if (encoded.startsWith('c1:')) {
      const bytes = fromBase64Url(encoded.slice(3))
      const decompressed = await inflate(bytes)
      json = new TextDecoder().decode(decompressed)
    } else {
      json = new TextDecoder().decode(fromBase64Url(encoded))
    }
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return {}
    const result: Record<string, string> = {}
    for (const item of parsed) {
      if (!Array.isArray(item) || item.length !== 2) continue
      const [name, val] = item
      if (typeof name !== 'string' || typeof val !== 'string') continue
      const cssVar = `--kui-${name}`
      if (!KNOWN_CSS_VARS.has(cssVar)) continue
      result[cssVar] = val
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
  /** When true, the editor shows only tokens that have active overrides. */
  const showOnlyModified = ref(false)

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
   * All category groups filtered by the editor search query and/or "only modified" toggle,
   * with per-group override counts. Categories with no matching entries are excluded.
   */
  const visibleGroups = computed((): CustGroup[] => {
    const q = filterQuery.value.toLowerCase().trim()
    const onlyModified = showOnlyModified.value
    const catOrder = [...new Set(ALL_ENTRIES.map((e) => e.category))]

    return catOrder
      .map((cat) => {
        let entries = ALL_ENTRIES.filter((e) => e.category === cat)
        if (q) entries = entries.filter((e) => normalize(e.cssVar).includes(normalize(q)) || normalize(e.value).includes(normalize(q)))
        if (onlyModified) entries = entries.filter((e) => !!overrides[e.cssVar])
        const overrideCount = entries.filter((e) => overrides[e.cssVar]).length
        return { category: cat, entries, overrideCount }
      })
      .filter((g) => g.entries.length > 0)
  })

  /**
   * Sets or clears a single token override.
   * Clears when the new value is empty or matches the original default.
   */
  function setOverride(cssVar: string, value: string, defaultValue: string) {
    const normalizeVal = (v: string) => /^#[0-9a-f]{3,8}$/i.test(v.trim()) ? v.trim().toUpperCase() : v.trim()
    const normalized = normalizeVal(value)
    if (!normalized || normalized === normalizeVal(defaultValue)) {
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
   * Reactive share URL — updates asynchronously as overrides change.
   * Uses deflate-raw compression so the URL stays short even with many overrides.
   */
  const shareUrl = ref(typeof window !== 'undefined' ? window.location.href : '/#/customize')

  // deep: true required — reactive plain objects don't trigger on property add/delete otherwise.
  watch(
    overrides,
    async () => {
      const encoded = await encodeOverrides(overrides)
      // setHashParams preserves other hash query params (e.g. ?url=, ?selector=) managed by CustPreviewPanel.
      shareUrl.value = setHashParams({ o: encoded || null })
    },
    { deep: true },
  )

  /**
   * Reads the `?o=` query param on mount and applies any valid overrides found there.
   * Stale/renamed token vars are silently ignored so share links survive token changes.
   */
  onMounted(async () => {
    const encoded = getHashParam('o')
    if (!encoded) return
    const decoded = await decodeOverrides(encoded)
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
    showOnlyModified,
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
