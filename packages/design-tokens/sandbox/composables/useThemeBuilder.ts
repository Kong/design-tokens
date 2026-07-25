import { computed, reactive, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import {
  deriveEffectiveCss,
  exportAliasJson,
  exportThemeJson,
  flattenAliases,
  isColorToken,
  resolveValue,
} from '../lib/themeBuilderUtils'
import type { AliasFlatEntry, AliasJson, BuilderToken, ThemeJson } from '../lib/themeBuilderUtils'

export type { BuilderToken } from '../lib/themeBuilderUtils'

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
    if (
      typeof alias !== 'object' || alias === null ||
      typeof (alias as AliasJson).color?.alias !== 'object'
    ) {
      return { ok: false, error: 'Alias file must contain a color.alias tree.' }
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
        return
      }
      localStorage.setItem(storageKey, JSON.stringify({
        themeJson: themeJson.value,
        aliasJson: aliasJson.value,
        aliasOverrides: { ...aliasOverrides },
        tokenOverrides: { ...tokenOverrides },
        themeFileName: themeFileName.value,
        aliasFileName: aliasFileName.value,
      }))
    } catch { /* quota exceeded or storage unavailable — ignore */ }
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
        if (d && typeof d === 'object' && d.themeJson && d.aliasJson) {
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
    } catch { /* corrupt entry — ignore and start fresh */ }

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
  }
}
