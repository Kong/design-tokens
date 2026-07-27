// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { useThemeBuilder } from './useThemeBuilder'

const VALID_ALIAS = JSON.stringify({
  color: {
    alias: {
      blue: {
        30: { $value: '#3B82F6' },
        50: { $value: '#1D4ED8' },
      },
      gray: {
        10: { $value: '#F3F4F6' },
      },
    },
  },
})

const VALID_THEME = JSON.stringify({
  'kui-color-background-primary': { $value: '{color.alias.blue.30}' },
  'kui-color-border': { $value: '{color.alias.gray.10}' },
  'kui-space-40': { $value: '16px' },
  'kui-button-border-radius': { $value: '' },
})

// The names-only manifest shape — every family value is an array, not `{ $value }` leaves.
const MANIFEST_LIKE_ALIAS = JSON.stringify({
  color: { alias: { blue: ['30', '50'], gray: ['10'] } },
})

/**
 * `useThemeBuilder` holds module-scoped singleton state (documented as intentional, so it
 * survives route re-mounts). Tests must therefore reset it before each case rather than relying
 * on fresh module instances.
 */
function reset() {
  const builder = useThemeBuilder()
  builder.unload()
  return builder
}

describe('useThemeBuilder', () => {
  beforeEach(() => {
    reset()
    localStorage.clear()
  })

  describe('loadFiles validation', () => {
    it('rejects invalid theme JSON', () => {
      const { loadFiles, isLoaded } = useThemeBuilder()
      const result = loadFiles('not json', VALID_ALIAS)
      expect(result).toEqual({ ok: false, error: 'Theme file is not valid JSON.' })
      expect(isLoaded.value).toBe(false)
    })

    it('rejects invalid alias JSON', () => {
      const { loadFiles } = useThemeBuilder()
      const result = loadFiles(VALID_THEME, '{not json')
      expect(result.ok).toBe(false)
      expect(result.error).toBe('Alias file is not valid JSON.')
    })

    it('rejects a theme file that is not an object', () => {
      const { loadFiles } = useThemeBuilder()
      const result = loadFiles('null', VALID_ALIAS)
      expect(result.ok).toBe(false)
      expect(result.error).toBe('Theme file has an unexpected shape.')
    })

    it('rejects an alias file missing color.alias', () => {
      const { loadFiles } = useThemeBuilder()
      const result = loadFiles(VALID_THEME, JSON.stringify({ color: {} }))
      expect(result.ok).toBe(false)
      expect(result.error).toBe('Alias file must contain a color.alias tree.')
    })

    it('rejects a theme file with a bare-string entry instead of a { $value } record', () => {
      // Regression: this used to load successfully and only crash later, on export,
      // when exportThemeJson tried to assign `.$value` onto the string primitive.
      const { loadFiles, isLoaded } = useThemeBuilder()
      const badTheme = JSON.stringify({ 'kui-space-40': '16px' })
      const result = loadFiles(badTheme, VALID_ALIAS)
      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/\$value/)
      expect(isLoaded.value).toBe(false)
    })

    it('rejects the names-only manifest shape even though it has a color.alias object', () => {
      const { loadFiles } = useThemeBuilder()
      const result = loadFiles(VALID_THEME, MANIFEST_LIKE_ALIAS)
      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/names-only manifest/)
    })

    it('accepts a valid theme + alias pair and marks the builder as loaded', () => {
      const { loadFiles, isLoaded } = useThemeBuilder()
      const result = loadFiles(VALID_THEME, VALID_ALIAS, 'my.theme.json', 'my.alias.color.json')
      expect(result).toEqual({ ok: true })
      expect(isLoaded.value).toBe(true)
    })

    it('clears any prior overrides on a fresh load', () => {
      const builder = useThemeBuilder()
      builder.loadFiles(VALID_THEME, VALID_ALIAS)
      builder.setTokenOverride('kui-space-40', '24px')
      expect(builder.hasOverrides.value).toBe(true)

      builder.loadFiles(VALID_THEME, VALID_ALIAS)
      expect(builder.hasOverrides.value).toBe(false)
    })
  })

  describe('two-layer override cascade', () => {
    beforeEach(() => {
      const { loadFiles } = useThemeBuilder()
      loadFiles(VALID_THEME, VALID_ALIAS)
    })

    it('resolves an alias-ref token to the alias palette default', () => {
      const { builderTokens } = useThemeBuilder()
      const token = builderTokens.value.find((t) => t.key === 'kui-color-background-primary')
      expect(token.source).toBe('inherited')
      expect(token.derivedValue).toBe('#3B82F6')
    })

    it('an alias override (Layer 1) cascades into every token referencing that alias', () => {
      const builder = useThemeBuilder()
      builder.setAliasOverride('blue.30', '#00FF00')
      const token = builder.builderTokens.value.find((t) => t.key === 'kui-color-background-primary')
      expect(token.derivedValue).toBe('#00FF00')
      // The token itself is not "overridden" — only the alias it points to changed.
      expect(token.source).toBe('inherited')
    })

    it('a token override (Layer 2) wins over the alias cascade for that token only', () => {
      const builder = useThemeBuilder()
      builder.setAliasOverride('blue.30', '#00FF00')
      builder.setTokenOverride('kui-color-background-primary', '{color.alias.gray.10}')
      const token = builder.builderTokens.value.find((t) => t.key === 'kui-color-background-primary')
      expect(token.source).toBe('overridden')
      expect(token.derivedValue).toBe('#F3F4F6')

      // The alias override still cascades to any OTHER token still referencing blue.30 — none here,
      // but the alias-level state itself remains independent of the token override.
      expect(builder.aliasOverrides['blue.30']).toBe('#00FF00')
    })

    it('resetTokenOverride removes only that token override, restoring the alias cascade', () => {
      const builder = useThemeBuilder()
      builder.setAliasOverride('blue.30', '#00FF00')
      builder.setTokenOverride('kui-color-background-primary', '{color.alias.gray.10}')
      builder.resetTokenOverride('kui-color-background-primary')
      const token = builder.builderTokens.value.find((t) => t.key === 'kui-color-background-primary')
      expect(token.source).toBe('inherited')
      expect(token.derivedValue).toBe('#00FF00')
    })

    it('setTokenOverride with an empty value clears the override rather than setting a blank one', () => {
      const builder = useThemeBuilder()
      builder.setTokenOverride('kui-space-40', '24px')
      expect(builder.tokenOverrides['kui-space-40']).toBe('24px')
      builder.setTokenOverride('kui-space-40', '   ')
      expect('kui-space-40' in builder.tokenOverrides).toBe(false)
    })

    it('a token with no default value is reported as "empty" until overridden', () => {
      const { builderTokens } = useThemeBuilder()
      const token = builderTokens.value.find((t) => t.key === 'kui-button-border-radius')
      expect(token.source).toBe('empty')
      expect(token.derivedValue).toBe('')
    })

    it('resetAll clears both override layers', () => {
      const builder = useThemeBuilder()
      builder.setAliasOverride('blue.30', '#00FF00')
      builder.setTokenOverride('kui-space-40', '24px')
      builder.resetAll()
      expect(builder.hasOverrides.value).toBe(false)
      expect(Object.keys(builder.aliasOverrides).length).toBe(0)
      expect(Object.keys(builder.tokenOverrides).length).toBe(0)
    })
  })

  describe('effectiveCss and export strings', () => {
    it('effectiveCss includes overridden token values as CSS custom properties', () => {
      const builder = useThemeBuilder()
      builder.loadFiles(VALID_THEME, VALID_ALIAS)
      builder.setTokenOverride('kui-space-40', '24px')
      expect(builder.effectiveCss.value).toContain('--kui-space-40: 24px')
    })

    it('themeJsonOut reflects a token override in the exported theme JSON', () => {
      const builder = useThemeBuilder()
      builder.loadFiles(VALID_THEME, VALID_ALIAS)
      builder.setTokenOverride('kui-space-40', '24px')
      const parsed = JSON.parse(builder.themeJsonOut.value)
      expect(parsed['kui-space-40'].$value).toBe('24px')
    })

    it('aliasJsonOut reflects an alias override in the exported alias JSON', () => {
      const builder = useThemeBuilder()
      builder.loadFiles(VALID_THEME, VALID_ALIAS)
      builder.setAliasOverride('blue.30', '#00FF00')
      const parsed = JSON.parse(builder.aliasJsonOut.value)
      expect(parsed.color.alias.blue['30'].$value).toBe('#00FF00')
    })

    it('returns empty strings for derived output before any file is loaded', () => {
      const { effectiveCss, themeJsonOut, aliasJsonOut } = useThemeBuilder()
      expect(effectiveCss.value).toBe('')
      expect(themeJsonOut.value).toBe('')
      expect(aliasJsonOut.value).toBe('')
    })
  })

  describe('unload', () => {
    it('returns the builder to the unloaded state and clears overrides', () => {
      const builder = useThemeBuilder()
      builder.loadFiles(VALID_THEME, VALID_ALIAS)
      builder.setTokenOverride('kui-space-40', '24px')
      builder.unload()
      expect(builder.isLoaded.value).toBe(false)
      expect(builder.hasOverrides.value).toBe(false)
      expect(builder.builderTokens.value).toEqual([])
    })
  })

  describe('initPersistence', () => {
    it('restores a previously persisted state for the given host key', async () => {
      const first = useThemeBuilder()
      // initPersistence must be wired before state changes — like the real app, which calls it
      // synchronously in setup — since the debounced watcher only reacts to changes made after
      // it starts.
      first.initPersistence('example.com')
      first.loadFiles(VALID_THEME, VALID_ALIAS, 'my.theme.json', 'my.alias.color.json')
      first.setTokenOverride('kui-space-40', '24px')

      // Persistence writes are debounced 250ms.
      await new Promise((resolve) => setTimeout(resolve, 300))
      expect(localStorage.getItem('kui-theme-builder-state:example.com')).toBeTruthy()

      first.unload()
      expect(first.isLoaded.value).toBe(false)

      // A distinct call site restores from the same module-scoped state; simulate a fresh
      // mount by re-invoking initPersistence with the same host key.
      first.initPersistence('example.com')
      expect(first.isLoaded.value).toBe(true)
      expect(first.tokenOverrides['kui-space-40']).toBe('24px')
      expect(first.themeFileName.value).toBe('my.theme.json')
    })

    it('keys persistence separately per host so unrelated hosts do not leak state', async () => {
      const builder = useThemeBuilder()
      builder.loadFiles(VALID_THEME, VALID_ALIAS)
      builder.initPersistence('host-a.com')
      await new Promise((resolve) => setTimeout(resolve, 300))

      builder.unload()
      builder.initPersistence('host-b.com')
      expect(builder.isLoaded.value).toBe(false)
    })

    it('falls back to the standalone key when no host is given', () => {
      const builder = useThemeBuilder()
      builder.initPersistence()
      expect(localStorage.getItem('kui-theme-builder-state:standalone')).toBeFalsy()
    })

    it('ignores a corrupt localStorage entry and starts fresh rather than throwing', () => {
      localStorage.setItem('kui-theme-builder-state:broken-host', '{not valid json')
      const builder = useThemeBuilder()
      expect(() => builder.initPersistence('broken-host')).not.toThrow()
      expect(builder.isLoaded.value).toBe(false)
    })

    it('refuses to restore a persisted theme with a malformed (bare-string) entry', () => {
      // Regression: a previous version accepted any `d.themeJson` unchecked, so a
      // hand-edited localStorage entry could reach exportThemeJson and crash on export.
      localStorage.setItem('kui-theme-builder-state:malformed-host', JSON.stringify({
        themeJson: { 'kui-space-40': '16px' },
        aliasJson: JSON.parse(VALID_ALIAS),
        aliasOverrides: {},
        tokenOverrides: {},
      }))
      const builder = useThemeBuilder()
      expect(() => builder.initPersistence('malformed-host')).not.toThrow()
      expect(builder.isLoaded.value).toBe(false)
    })
  })
})
