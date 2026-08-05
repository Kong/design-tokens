// @vitest-environment jsdom
import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  useTokenCustomizer,
  encodeOverrides,
  importFromCode,
  importFromCss,
  setStartingTheme,
} from './useTokenCustomizer'
import { ALL_ENTRIES, DEFAULT_THEME_ID } from './useTokens'
import type { TokenEntry } from './useTokens'
import { getHashParam } from '../utils/hashRouteQuery'

type Customizer = ReturnType<typeof useTokenCustomizer>

// `useTokenCustomizer` registers a module-scoped watch + onMounted hook inside the mounted
// component's effect scope. Left mounted, that watcher keeps firing (and racing) against
// later tests' mutations of the shared module state. Track every wrapper and unmount it
// after each test to stop those watchers.
let liveWrappers: VueWrapper[] = []

afterEach(() => {
  for (const wrapper of liveWrappers) wrapper.unmount()
  liveWrappers = []
})

/**
 * `useTokenCustomizer` calls `onMounted`, so tests that depend on mount-time behavior
 * (reading `?theme=`/`?o=` from the hash) must run it inside a real component's setup.
 */
function mountCustomizer(): { composable: Customizer } {
  let composable!: Customizer
  const wrapper = mount(defineComponent({
    setup() {
      composable = useTokenCustomizer()
      return () => h('div')
    },
  }))
  liveWrappers.push(wrapper)
  return { composable }
}

function resetHash() {
  history.replaceState(null, '', window.location.pathname + '#/customize')
}

/** Flattens visibleGroups into its entries, in group order. */
function flatEntries(composable: Customizer): TokenEntry[] {
  return composable.visibleGroups.value.flatMap((g) => g.entries)
}

describe('useTokenCustomizer — starting theme', () => {
  beforeEach(() => {
    resetHash()
    const { composable } = mountCustomizer()
    composable.resetAll()
    setStartingTheme(DEFAULT_THEME_ID)
  })

  it('defaults startingThemeId to classic-day, matching ALL_ENTRIES with no overrides', () => {
    const { composable } = mountCustomizer()
    expect(composable.startingThemeId.value).toBe(DEFAULT_THEME_ID)
    const entries = flatEntries(composable)
    expect(entries).toHaveLength(ALL_ENTRIES.length)
    for (const entry of entries) {
      const base = ALL_ENTRIES.find((e) => e.cssVar === entry.cssVar)
      expect(entry.value).toBe(base?.value)
    }
    expect(composable.fullExportCss.value).toContain(':root {')
  })

  it('setStartingTheme changes surfaced values without touching overrides/customProps', () => {
    const { composable } = mountCustomizer()
    const before = flatEntries(composable).map((e) => e.value)
    setStartingTheme('classic-night')
    const after = flatEntries(composable).map((e) => e.value)
    expect(after).not.toEqual(before)
    expect(Object.keys(composable.overrides)).toHaveLength(0)
    expect(Object.keys(composable.customProps)).toHaveLength(0)
  })

  it('is a no-op for an unrecognized theme id', () => {
    setStartingTheme('classic-night')
    const { composable } = mountCustomizer()
    const before = composable.startingThemeId.value
    setStartingTheme('not-a-real-theme')
    expect(composable.startingThemeId.value).toBe(before)
  })

  it('leaves overrides unchanged when switching starting theme (non-destructive)', () => {
    const { composable } = mountCustomizer()
    const target = ALL_ENTRIES[0]
    composable.setOverride(target.cssVar, '#123456', target.value)
    expect(composable.overrides[target.cssVar]).toBe('#123456')
    setStartingTheme('electric-lime-day')
    expect(composable.overrides[target.cssVar]).toBe('#123456')
  })

  it('fullExportCss differs between two starting themes with no overrides set', () => {
    const { composable } = mountCustomizer()
    const dayCss = composable.fullExportCss.value
    setStartingTheme('electric-lime-night')
    const nightCss = composable.fullExportCss.value
    expect(nightCss).not.toBe(dayCss)
  })
})

describe('useTokenCustomizer — hash round-trip', () => {
  beforeEach(() => {
    resetHash()
    const { composable } = mountCustomizer()
    composable.resetAll()
    setStartingTheme(DEFAULT_THEME_ID)
  })

  it('writes startTheme=<id> for a non-default theme and omits it for the default', async () => {
    mountCustomizer()
    setStartingTheme('classic-night')
    await flushPromises()
    expect(getHashParam('startTheme')).toBe('classic-night')
    // The old key name is not also written — this is a clean rename, not an alias.
    expect(getHashParam('theme')).toBeNull()

    setStartingTheme(DEFAULT_THEME_ID)
    await flushPromises()
    expect(getHashParam('startTheme')).toBeNull()
  })

  it('applies an existing ?startTheme=<id> param on mount', () => {
    history.replaceState(null, '', window.location.pathname + '#/customize?startTheme=electric-lime-day')
    const { composable } = mountCustomizer()
    expect(composable.startingThemeId.value).toBe('electric-lime-day')
  })

  it('ignores an invalid ?startTheme= value on mount', () => {
    history.replaceState(null, '', window.location.pathname + '#/customize?startTheme=not-a-real-theme')
    const { composable } = mountCustomizer()
    expect(composable.startingThemeId.value).toBe(DEFAULT_THEME_ID)
  })

  it('still restores from the legacy ?theme=<id> param on mount (renamed to startTheme, but old links must keep working)', () => {
    history.replaceState(null, '', window.location.pathname + '#/customize?theme=electric-lime-day')
    const { composable } = mountCustomizer()
    expect(composable.startingThemeId.value).toBe('electric-lime-day')
  })

  it('prefers ?startTheme= over a legacy ?theme= when both are somehow present', () => {
    history.replaceState(null, '', window.location.pathname + '#/customize?startTheme=electric-lime-night&theme=electric-lime-day')
    const { composable } = mountCustomizer()
    expect(composable.startingThemeId.value).toBe('electric-lime-night')
  })

  it('clears a leftover legacy ?theme= param once the write side takes over, so resetting to the default does not later resurrect it', async () => {
    // Simulates opening an old ?theme=<id> link, which the on-mount restore honors — the
    // watcher then fires and, before the fix, only ever wrote/cleared `startTheme`, leaving the
    // stale `theme=` param sitting in the hash forever.
    history.replaceState(null, '', window.location.pathname + '#/customize?theme=electric-lime-day')
    mountCustomizer()
    await flushPromises()
    expect(getHashParam('theme')).toBeNull()
    expect(getHashParam('startTheme')).toBe('electric-lime-day')

    // Now explicitly reset to the default theme — startTheme is cleared (omitted as the
    // implicit default). The legacy key must already be gone, or a later read of
    // `startTheme ?? theme` would silently fall back to the stale electric-lime-day value.
    setStartingTheme(DEFAULT_THEME_ID)
    await flushPromises()
    expect(getHashParam('startTheme')).toBeNull()
    expect(getHashParam('theme')).toBeNull()
  })
})

describe('importFromCode', () => {
  beforeEach(() => {
    resetHash()
    const { composable } = mountCustomizer()
    composable.resetAll()
    setStartingTheme(DEFAULT_THEME_ID)
  })

  it('applies both theme and overrides from a ?startTheme=...&o=... link', async () => {
    const target = ALL_ENTRIES[0]
    const encoded = await encodeOverrides({ [target.cssVar]: '#112233' })
    const link = `http://localhost/#/customize?o=${encoded}&startTheme=electric-lime-day`

    const { composable } = mountCustomizer()
    const applied = await importFromCode(link)
    expect(applied).toBe(true)
    expect(composable.startingThemeId.value).toBe('electric-lime-day')
    expect(composable.overrides[target.cssVar]).toBe('#112233')
  })

  it('applies a theme-only link (no o=) and returns true', async () => {
    const { composable } = mountCustomizer()
    const applied = await importFromCode('http://localhost/#/customize?startTheme=classic-night')
    expect(applied).toBe(true)
    expect(composable.startingThemeId.value).toBe('classic-night')
  })

  it('still applies a legacy ?theme=...&o=... link (pre-rename share links/state codes)', async () => {
    const target = ALL_ENTRIES[0]
    const encoded = await encodeOverrides({ [target.cssVar]: '#112233' })
    const link = `http://localhost/#/customize?o=${encoded}&theme=electric-lime-day`

    const { composable } = mountCustomizer()
    const applied = await importFromCode(link)
    expect(applied).toBe(true)
    expect(composable.startingThemeId.value).toBe('electric-lime-day')
    expect(composable.overrides[target.cssVar]).toBe('#112233')
  })
})

describe('importFromCss', () => {
  beforeEach(() => {
    resetHash()
    const { composable } = mountCustomizer()
    composable.resetAll()
    setStartingTheme(DEFAULT_THEME_ID)
  })

  it('does not touch startingThemeId, only overrides/customProps', () => {
    setStartingTheme('classic-night')
    const { composable } = mountCustomizer()
    const applied = importFromCss(':root {\n  --kui-color-background: #000000;\n  --my-custom-var: red;\n}')
    expect(applied).toBe(true)
    expect(composable.startingThemeId.value).toBe('classic-night')
    expect(composable.overrides['--kui-color-background']).toBe('#000000')
    expect(composable.customProps['--my-custom-var']).toBe('red')
  })
})
