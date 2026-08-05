import { computed, reactive, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import {
  deriveEffectiveCss,
  exportAliasJson,
  exportThemeJson,
  flattenAliases,
  isColorToken,
  isValidThemeJson,
  resolveValue,
} from '../utils/themeBuilderUtils'
import type { AliasFlatEntry, AliasJson, BuilderToken, ThemeJson } from '../utils/themeBuilderUtils'

export type { BuilderToken } from '../utils/themeBuilderUtils'

/** Module-scoped state so it survives route re-mounts within a session. */
const themeJson = ref<ThemeJson | null>(null)
const aliasJson = ref<AliasJson | null>(null)
const aliasOverrides = reactive<Record<string, string>>({})
const tokenOverrides = reactive<Record<string, string>>({})

/** The loaded theme file's name, used for the export download and persistence. */
const themeFileName = ref('theme.json')
/** The loaded alias file's name, used for the export download and persistence. */
const aliasFileName = ref('alias.color.json')

/** localStorage key prefix; the active key is this plus the target host (or 'standalone'). */
const STORAGE_PREFIX = 'kui-theme-builder-state:'
/** Active storage key; set by initPersistence(). Distinct from the customizer's keys. */
let storageKey = STORAGE_PREFIX + 'standalone'
/**
 * Set when the most recent write to localStorage failed (quota exceeded, private-browsing
 * storage disabled, etc.) — surfaced in `ThemeBuilder.vue` as a small warning, since silently
 * losing reload-persistence is the kind of failure a user only discovers after it's too late to
 * do anything about. Cleared on the next successful write. Module-scoped like the rest of this
 * composable's state, so it survives route re-mounts.
 */
const persistError = ref<string | null>(null)
/** Guard so the persistence watcher is only wired once per session. */
let persistWatchStarted = false
/** Debounce handle for persistence writes. */
let persistTimer: ReturnType<typeof setTimeout> | undefined

/**
 * Composable backing the Theme Builder. Holds the loaded file pair and the two
 * override layers, and derives the effective CSS plus export strings.
 */
export function useThemeBuilder() {
  const isLoaded = computed(() => themeJson.value !== null && aliasJson.value !== null)
  const hasOverrides = computed(() => Object.keys(aliasOverrides).length > 0 || Object.keys(tokenOverrides).length > 0)

  /**
   * Parses and validates the two uploaded file texts.
   * @returns `{ ok: true }` on success, or `{ ok: false, error }` on parse/shape failure.
   */
  function loadFiles(themeText: string, aliasText: string, themeName?: string, aliasName?: string): { ok: boolean, error?: string } {
    let theme: unknown
    let alias: unknown
    try {
      theme = JSON.parse(themeText)
    } catch {
      return { ok: false, error: 'Theme file is not valid JSON.' }
    }
    try {
      alias = JSON.parse(aliasText)
    } catch {
      return { ok: false, error: 'Alias file is not valid JSON.' }
    }
    if (typeof theme !== 'object' || theme === null) {
      return { ok: false, error: 'Theme file has an unexpected shape.' }
    }
    if (!isValidThemeJson(theme as Record<string, unknown>)) {
      return { ok: false, error: 'Theme file has one or more entries that are not `{ $value }` records.' }
    }
    if (
      typeof alias !== 'object' || alias === null ||
      typeof (alias as AliasJson).color?.alias !== 'object'
    ) {
      return { ok: false, error: 'Alias file must contain a color.alias tree.' }
    }
    // The names-only manifest (`themes/_manifest.alias.color.json`) also has a `color.alias`
    // object, but its family values are arrays of step-name strings rather than `{ $value }`
    // leaves — it would pass the check above and then render silently-empty swatches. Reject
    // it unless at least one family looks like a real palette (leniently, so any one valid
    // family lets a real palette through).
    const families = Object.values((alias as AliasJson).color.alias)
    const looksLikePalette = families.some((fam) => {
      if (fam && typeof fam === 'object' && !Array.isArray(fam)) {
        if (typeof (fam as { $value?: unknown }).$value === 'string') return true
        return Object.values(fam as Record<string, unknown>).some(
          (leaf) => leaf && typeof leaf === 'object' && !Array.isArray(leaf) && typeof (leaf as { $value?: unknown }).$value === 'string',
        )
      }
      return false
    })
    if (!looksLikePalette) {
      return { ok: false, error: 'Alias file has no color values — did you load the names-only manifest by mistake?' }
    }
    for (const k in aliasOverrides) delete aliasOverrides[k]
    for (const k in tokenOverrides) delete tokenOverrides[k]
    themeJson.value = theme as ThemeJson
    aliasJson.value = alias as AliasJson
    if (themeName) themeFileName.value = themeName
    if (aliasName) aliasFileName.value = aliasName
    return { ok: true }
  }

  const aliasFlat: ComputedRef<AliasFlatEntry[]> = computed(() =>
    aliasJson.value ? flattenAliases(aliasJson.value) : [],
  )

  const builderTokens: ComputedRef<BuilderToken[]> = computed(() => {
    if (!themeJson.value || !aliasJson.value) return []
    const aj = aliasJson.value
    return Object.entries(themeJson.value).map(([key, entry]) => {
      const overridden = key in tokenOverrides
      const rawValue = overridden ? tokenOverrides[key] : entry.$value
      const source: BuilderToken['source'] = overridden
        ? 'overridden'
        : (entry.$value ? 'inherited' : 'empty')
      return {
        key,
        cssVar: `--${key}`,
        rawValue,
        isColor: isColorToken(entry.$value) || isColorToken(rawValue),
        derivedValue: rawValue ? resolveValue(rawValue, aj, aliasOverrides) : '',
        source,
      }
    })
  })

  const effectiveCss = computed(() =>
    themeJson.value && aliasJson.value
      ? deriveEffectiveCss(themeJson.value, aliasJson.value, aliasOverrides, tokenOverrides)
      : '',
  )

  const themeJsonOut = computed(() =>
    themeJson.value ? exportThemeJson(themeJson.value, tokenOverrides) : '',
  )
  const aliasJsonOut = computed(() =>
    aliasJson.value ? exportAliasJson(aliasJson.value, aliasOverrides) : '',
  )

  /** Sets a Layer 1 alias override (hex). Empty value clears it. */
  function setAliasOverride(key: string, hex: string) {
    if (!hex.trim()) delete aliasOverrides[key]
    else aliasOverrides[key] = hex.trim()
  }

  /** Sets a Layer 2 token override. Empty value clears it. */
  function setTokenOverride(key: string, value: string) {
    if (!value.trim()) delete tokenOverrides[key]
    else tokenOverrides[key] = value.trim()
  }

  /** Clears a single Layer 2 token override. */
  function resetTokenOverride(key: string) {
    delete tokenOverrides[key]
  }

  /** Clears all overrides in both layers. */
  function resetAll() {
    for (const k in aliasOverrides) delete aliasOverrides[k]
    for (const k in tokenOverrides) delete tokenOverrides[k]
  }

  /** Clears the loaded theme/alias files and all overrides, returning to the file-loader state. */
  function unload() {
    resetAll()
    themeJson.value = null
    aliasJson.value = null
  }

  /**
   * Serializes the current builder state to localStorage under the active host key.
   * Removes the entry when no theme is loaded so a fresh reopen starts clean.
   */
  function persist() {
    try {
      if (!themeJson.value || !aliasJson.value) {
        localStorage.removeItem(storageKey)
      } else {
        localStorage.setItem(storageKey, JSON.stringify({
          themeJson: themeJson.value,
          aliasJson: aliasJson.value,
          aliasOverrides: { ...aliasOverrides },
          tokenOverrides: { ...tokenOverrides },
          themeFileName: themeFileName.value,
          aliasFileName: aliasFileName.value,
        }))
      }
      persistError.value = null
    } catch (err) {
      // Quota exceeded, private-browsing storage disabled, or similar — the app must keep
      // working from in-memory state; only reload-persistence is lost. Surfaced via
      // `persistError` so the UI can tell the user rather than silently dropping their work.
      console.warn('[useThemeBuilder] Failed to persist to localStorage — your changes will not survive a reload.', err)
      persistError.value = 'Changes aren\'t being saved for next time — your browser\'s storage is full or unavailable.'
    }
  }

  /**
   * Binds persistence to a key derived from `host` (the target page's hostname in the
   * embedded bookmarklet, or 'standalone'), restores any previously saved state, and
   * starts a debounced watcher that saves on every subsequent change. Idempotent: the
   * watcher is wired only once per session even if called again with a different host.
   * @param host - Target hostname, or undefined/empty for the standalone key.
   */
  function initPersistence(host?: string) {
    storageKey = STORAGE_PREFIX + (host && host.trim() ? host.trim() : 'standalone')
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const d = JSON.parse(raw)
        if (
          d && typeof d === 'object' && d.themeJson && d.aliasJson &&
          isValidThemeJson(d.themeJson as Record<string, unknown>)
        ) {
          themeJson.value = d.themeJson as ThemeJson
          aliasJson.value = d.aliasJson as AliasJson
          for (const k in aliasOverrides) delete aliasOverrides[k]
          for (const k in tokenOverrides) delete tokenOverrides[k]
          Object.assign(aliasOverrides, d.aliasOverrides ?? {})
          Object.assign(tokenOverrides, d.tokenOverrides ?? {})
          if (typeof d.themeFileName === 'string') themeFileName.value = d.themeFileName
          if (typeof d.aliasFileName === 'string') aliasFileName.value = d.aliasFileName
        }
      }
    } catch (err) {
      // Corrupt entry, or getItem itself throwing (storage disabled entirely) — either way,
      // start fresh rather than crash. A genuinely unavailable store will also surface via
      // `persistError` the next time `persist()` runs.
      console.warn('[useThemeBuilder] Failed to restore persisted state from localStorage — starting fresh.', err)
    }

    if (!persistWatchStarted) {
      persistWatchStarted = true
      watch(
        [themeJson, aliasJson, aliasOverrides, tokenOverrides, themeFileName, aliasFileName],
        () => {
          clearTimeout(persistTimer)
          persistTimer = setTimeout(persist, 250)
        },
        { deep: true },
      )
    }
  }

  return {
    themeJson: themeJson as Ref<ThemeJson | null>,
    aliasJson: aliasJson as Ref<AliasJson | null>,
    aliasOverrides,
    tokenOverrides,
    isLoaded,
    hasOverrides,
    loadFiles,
    aliasFlat,
    builderTokens,
    effectiveCss,
    themeJsonOut,
    aliasJsonOut,
    setAliasOverride,
    setTokenOverride,
    resetTokenOverride,
    resetAll,
    unload,
    themeFileName,
    aliasFileName,
    initPersistence,
    persistError,
  }
}
