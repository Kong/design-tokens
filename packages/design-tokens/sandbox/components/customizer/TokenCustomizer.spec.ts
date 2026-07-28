// @vitest-environment jsdom
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TokenCustomizer from './TokenCustomizer.vue'
import CustTokenRow from './CustTokenRow.vue'
import CustOutputPanel from './CustOutputPanel.vue'
import SandboxTabs from '@/components/shared/SandboxTabs.vue'
import {
  encodeOverrides,
  importFromCode,
  setStartingTheme,
  useTokenCustomizer,
} from '@/composables/useTokenCustomizer'
import { ALL_ENTRIES, DEFAULT_THEME_ID, resolveThemedEntries } from '@/composables/useTokens'

// jsdom has no ResizeObserver; SandboxShell's useHeaderHeight observes the header element on
// mount, so every mount would otherwise throw "ResizeObserver is not defined".
class MockResizeObserver {
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)

// jsdom has no CSS.supports; CustTokenRow's color validation calls it on every render.
// A permissive stub is fine here — this spec doesn't exercise invalid-color states,
// that belongs to CustTokenRow's own spec.
vi.stubGlobal('CSS', { supports: () => true })

/**
 * A token whose default value actually differs between classic-day and classic-night —
 * used to prove the starting-theme select's change propagates all the way to a rendered
 * `CustTokenRow`'s displayed value, not just to the composable's internal state.
 */
const DAY_ENTRIES = resolveThemedEntries(ALL_ENTRIES, 'classic-day')
const NIGHT_ENTRIES = resolveThemedEntries(ALL_ENTRIES, 'classic-night')
const DIVERGENT_ENTRY = (() => {
  const entry = DAY_ENTRIES.find((e, i) => e.value !== NIGHT_ENTRIES[i].value)
  if (!entry) throw new Error('Expected at least one token to differ between classic-day and classic-night')
  return entry
})()

/** `useTokenCustomizer`'s state is module-scoped and persists across the app's lifetime. */
function resetCustomizerState() {
  // `useTokenCustomizer()` has an `onMounted` hook that requires an active component instance.
  // Mount a temporary component wrapper to safely call the composable and reset state.
  let composable: ReturnType<typeof useTokenCustomizer>
  const wrapper = mount(defineComponent({
    setup() {
      composable = useTokenCustomizer()
      return () => h('div')
    },
  }))
  liveWrappers.push(wrapper)
  composable!.resetAll()
  setStartingTheme(DEFAULT_THEME_ID)
}

function resetHash() {
  history.replaceState(null, '', window.location.pathname + '#/customize')
}

let liveWrappers: VueWrapper[] = []

/** Mounts TokenCustomizer, stubbing the network/ResizeObserver-heavy preview panel (covered by its own spec) and RouterLink (no router installed in this test). */
function mountCustomizer() {
  const wrapper = mount(TokenCustomizer, {
    global: {
      stubs: {
        CustPreviewPanel: true,
        RouterLink: true,
      },
    },
  })
  liveWrappers.push(wrapper)
  return wrapper
}

/** Finds the rendered `CustTokenRow` for a given CSS var, across all category groups. */
function findRow(wrapper: VueWrapper, cssVar: string) {
  return wrapper.findAllComponents(CustTokenRow).find((c) => c.props('entry').cssVar === cssVar)
}

/** Reads the text currently shown in the "All tokens CSS" output panel. */
function outputText(wrapper: VueWrapper): string {
  return wrapper.findComponent(CustOutputPanel).find('.cust-output-code').text()
}

describe('TokenCustomizer', () => {
  beforeEach(() => {
    resetHash()
    resetCustomizerState()
  })

  afterEach(() => {
    for (const wrapper of liveWrappers) wrapper.unmount()
    liveWrappers = []
    vi.restoreAllMocks()
  })

  describe('starting theme picker', () => {
    it('changing the select updates the composable state and the rendered row default value', async () => {
      const wrapper = mountCustomizer()

      const before = findRow(wrapper, DIVERGENT_ENTRY.cssVar)
      const dayValue = DAY_ENTRIES.find((e) => e.cssVar === DIVERGENT_ENTRY.cssVar)!.value
      expect(before?.find<HTMLInputElement>('.cust-value-input').element.value.toLowerCase()).toBe(dayValue.toLowerCase())

      const select = wrapper.find<HTMLSelectElement>('.cust-theme-select')
      expect(select.exists()).toBe(true)
      expect(select.element.value).toBe(DEFAULT_THEME_ID)

      await select.setValue('classic-night')

      // Composable state updated
      const composable = useTokenCustomizer()
      expect(composable.startingThemeId.value).toBe('classic-night')

      // Child row re-rendered with the new theme's default value (the CustTokenRow reactivity
      // regression this repo hit before: an un-overridden row going stale on theme switch).
      await wrapper.vm.$nextTick()
      const after = findRow(wrapper, DIVERGENT_ENTRY.cssVar)
      const nightValue = NIGHT_ENTRIES.find((e) => e.cssVar === DIVERGENT_ENTRY.cssVar)!.value
      expect(after?.find<HTMLInputElement>('.cust-value-input').element.value.toLowerCase()).toBe(nightValue.toLowerCase())
    })

    it('switching the starting theme does not clear an existing override', async () => {
      const wrapper = mountCustomizer()
      const target = ALL_ENTRIES[0]
      const row = findRow(wrapper, target.cssVar)
      expect(row).toBeTruthy()
      row!.vm.$emit('change', target.cssVar, '#123456', target.value)
      await wrapper.vm.$nextTick()

      const composable = useTokenCustomizer()
      expect(composable.overrides[target.cssVar]).toBe('#123456')

      await wrapper.find('.cust-theme-select').setValue('electric-lime-day')
      expect(composable.overrides[target.cssVar]).toBe('#123456')
    })
  })

  describe('override wiring: child emit -> composable -> output panel', () => {
    it('setting an override via a row emit updates overrides and the exported CSS text', async () => {
      const wrapper = mountCustomizer()
      const target = ALL_ENTRIES.find((e) => e.value && /^#[0-9a-f]{3,8}$/i.test(e.value)) ?? ALL_ENTRIES[0]

      expect(outputText(wrapper)).not.toContain('#ABCDEF')

      const row = findRow(wrapper, target.cssVar)
      expect(row).toBeTruthy()
      row!.vm.$emit('change', target.cssVar, '#ABCDEF', target.value)
      await wrapper.vm.$nextTick()

      const composable = useTokenCustomizer()
      expect(composable.overrides[target.cssVar]).toBe('#ABCDEF')
      expect(outputText(wrapper)).toContain(`${target.cssVar}: #ABCDEF;`)
    })

    it('resetting a row via its emit clears the override and restores the default in the output', async () => {
      const wrapper = mountCustomizer()
      const target = ALL_ENTRIES[0]
      const row = findRow(wrapper, target.cssVar)!
      row.vm.$emit('change', target.cssVar, '#ABCDEF', target.value)
      await wrapper.vm.$nextTick()
      expect(outputText(wrapper)).toContain('#ABCDEF')

      row.vm.$emit('reset', target.cssVar, target.value)
      await wrapper.vm.$nextTick()

      const composable = useTokenCustomizer()
      expect(composable.overrides[target.cssVar]).toBeUndefined()
      expect(outputText(wrapper)).not.toContain('#ABCDEF')
    })
  })

  describe('embedded vs standalone rendering', () => {
    it('standalone mode renders the 3-column layout with no tabs', () => {
      const wrapper = mountCustomizer()
      expect(wrapper.find('.cust-layout').exists()).toBe(true)
      expect(wrapper.find('.cust-embedded-body').exists()).toBe(false)
      expect(wrapper.findComponent(SandboxTabs).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'CustPreviewPanel' }).exists() || wrapper.find('cust-preview-panel-stub').exists()).toBe(true)
    })

    it('embedded mode renders the tabbed single-pane body with no standalone layout or preview panel', () => {
      history.replaceState(null, '', window.location.pathname + '#/customize?embedded=1')
      const wrapper = mountCustomizer()

      expect(wrapper.find('.cust-embedded-body').exists()).toBe(true)
      expect(wrapper.find('.cust-layout').exists()).toBe(false)

      const tabs = wrapper.findComponent(SandboxTabs)
      expect(tabs.exists()).toBe(true)
      expect(tabs.props('tabs')).toEqual([
        { id: 'tokens', label: 'Tokens' },
        { id: 'export', label: 'Export' },
      ])

      // The standalone-only live preview panel must not be part of the embedded tree at all.
      expect(wrapper.find('cust-preview-panel-stub').exists()).toBe(false)
    })

    it('embedded mode starts on the Tokens tab and switches to Export via the tabs emit', async () => {
      history.replaceState(null, '', window.location.pathname + '#/customize?embedded=1')
      const wrapper = mountCustomizer()

      const exportPane = wrapper.findComponent(CustOutputPanel).element.closest('aside')!

      // v-show toggles inline `display`; check that directly rather than VueWrapper#isVisible(),
      // which (at least on this VTU/jsdom combo) doesn't reliably reflect post-nextTick style
      // mutations on an already-queried element.
      expect((wrapper.find('.cust-editor-content--embedded').element as HTMLElement).style.display).not.toBe('none')
      expect((exportPane as HTMLElement).style.display).toBe('none')

      await wrapper.findComponent(SandboxTabs).vm.$emit('update:modelValue', 'export')
      await wrapper.vm.$nextTick()

      expect((wrapper.find('.cust-editor-content--embedded').element as HTMLElement).style.display).toBe('none')
      expect((exportPane as HTMLElement).style.display).not.toBe('none')
    })
  })

  describe('hash-param integration on mount', () => {
    it('applies a ?theme=<id> hash param on load, reflected in the select and the composable', async () => {
      history.replaceState(null, '', window.location.pathname + '#/customize?theme=electric-lime-day')
      const wrapper = mountCustomizer()

      // The composable's onMounted hook applies the theme synchronously, but the <select>'s
      // `:value` binding only reflects it once Vue flushes the resulting DOM patch.
      await wrapper.vm.$nextTick()

      const composable = useTokenCustomizer()
      expect(composable.startingThemeId.value).toBe('electric-lime-day')
      expect(wrapper.find<HTMLSelectElement>('.cust-theme-select').element.value).toBe('electric-lime-day')
    })

    it('applies a ?o=<code> hash param on load, reflected in a row value and the output panel', async () => {
      const target = ALL_ENTRIES.find((e) => /^#[0-9a-f]{3,8}$/i.test(e.value)) ?? ALL_ENTRIES[0]
      const encoded = await encodeOverrides({ [target.cssVar]: '#654321' })
      history.replaceState(null, '', window.location.pathname + `#/customize?o=${encoded}`)

      const wrapper = mountCustomizer()
      const composable = useTokenCustomizer()
      await composable.getInitialLoadPromise()
      await wrapper.vm.$nextTick()

      expect(composable.overrides[target.cssVar]).toBe('#654321')

      const row = findRow(wrapper, target.cssVar)
      expect(row?.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#654321')
      expect(outputText(wrapper)).toContain(`${target.cssVar}: #654321;`)
    })

    it('applies both ?theme= and ?o= together via a full share link on load', async () => {
      const target = ALL_ENTRIES[0]
      const encoded = await encodeOverrides({ [target.cssVar]: '#111111' })
      history.replaceState(
        null,
        '',
        window.location.pathname + `#/customize?theme=electric-lime-night&o=${encoded}`,
      )

      const wrapper = mountCustomizer()
      const composable = useTokenCustomizer()
      await composable.getInitialLoadPromise()
      await wrapper.vm.$nextTick()

      expect(composable.startingThemeId.value).toBe('electric-lime-night')
      expect(composable.overrides[target.cssVar]).toBe('#111111')
      expect(wrapper.find<HTMLSelectElement>('.cust-theme-select').element.value).toBe('electric-lime-night')
    })
  })

  describe('importFromCode via the Import panel, wired end to end', () => {
    it('applying a share link through importFromCode updates the rendered UI', async () => {
      const wrapper = mountCustomizer()
      const target = ALL_ENTRIES.find((e) => /^#[0-9a-f]{3,8}$/i.test(e.value)) ?? ALL_ENTRIES[0]
      const encoded = await encodeOverrides({ [target.cssVar]: '#0F0F0F' })
      const link = `http://localhost/#/customize?o=${encoded}&theme=electric-lime-day`

      const applied = await importFromCode(link)
      expect(applied).toBe(true)
      await wrapper.vm.$nextTick()

      expect(wrapper.find<HTMLSelectElement>('.cust-theme-select').element.value).toBe('electric-lime-day')
      const row = findRow(wrapper, target.cssVar)
      expect(row?.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#0F0F0F')
    })
  })
})
