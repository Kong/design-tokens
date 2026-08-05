// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SandboxUnifiedEmbed from './SandboxUnifiedEmbed.vue'
import SandboxTabs from './SandboxTabs.vue'
import SandboxModeSwitch from './SandboxModeSwitch.vue'
import SandboxPreviewToggle from './SandboxPreviewToggle.vue'
import TokenCustomizer from '@/components/customizer/TokenCustomizer.vue'
import ThemeBuilder from '@/components/builder/ThemeBuilder.vue'
import { useTokenCustomizer, setStartingTheme } from '@/composables/useTokenCustomizer'
import { useThemeBuilder } from '@/composables/useThemeBuilder'
import { DEFAULT_THEME_ID } from '@/composables/useTokens'
import { getHashParam } from '@/utils/hashRouteQuery'

// jsdom has no ResizeObserver; SandboxShell's useHeaderHeight observes the header element.
class MockResizeObserver {
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)
vi.stubGlobal('CSS', { supports: () => true })
// Force the uncompressed share-code path so the Customizer's buildSrc resolves on a
// microtask flushPromises() can drain deterministically (see TokenCustomizer.spec.ts).
vi.stubGlobal('CompressionStream', undefined)

function resetSharedState() {
  useTokenCustomizer().resetAll()
  setStartingTheme(DEFAULT_THEME_ID)
  useThemeBuilder().unload()
}

function setHash(hash: string) {
  history.replaceState(null, '', window.location.pathname + hash)
}

/** css from the most recent `kui-token-override` postMessage call. */
function lastPostedCss(spy: ReturnType<typeof vi.spyOn>): string | undefined {
  const calls = spy.mock.calls.filter((c: unknown[]) => (c[0] as { type?: string })?.type === 'kui-token-override')
  return (calls.at(-1)?.[0] as { css?: string } | undefined)?.css
}

function postCount(spy: ReturnType<typeof vi.spyOn>): number {
  return spy.mock.calls.filter((c: unknown[]) => (c[0] as { type?: string })?.type === 'kui-token-override').length
}

describe('SandboxUnifiedEmbed', () => {
  let wrapper: ReturnType<typeof mount> | undefined

  beforeEach(() => {
    resetSharedState()
    localStorage.clear()
    setHash('#/embedded?embedded=1')
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.restoreAllMocks()
  })

  it('renders exactly two tool options via SandboxModeSwitch — no third "Off" option', () => {
    wrapper = mount(SandboxUnifiedEmbed)
    const options = wrapper.findComponent(SandboxModeSwitch).props('options')
    expect(options.map((o: { id: string, label: string }) => ({ id: o.id, label: o.label }))).toEqual([
      { id: 'customizer', label: 'Customizer' },
      { id: 'theme-builder', label: 'Theme Builder' },
    ])
  })

  it('marks the Theme Builder option as modified once it has unsaved overrides, even while inactive', async () => {
    wrapper = mount(SandboxUnifiedEmbed)
    expect(wrapper.findComponent(SandboxModeSwitch).props('options')[1].modified).toBe(false)

    useThemeBuilder().setTokenOverride('kui-space-40', '24px')
    await wrapper.vm.$nextTick()

    // Still on Customizer — the dot must be visible without switching.
    expect(wrapper.findComponent(SandboxModeSwitch).props('modelValue')).toBe('customizer')
    expect(wrapper.findComponent(SandboxModeSwitch).props('options')[1].modified).toBe(true)
    expect(wrapper.find('.sms-dot-wrap').exists()).toBe(true)
  })

  it('defaults to customizer when ?tool= is absent from the hash', () => {
    wrapper = mount(SandboxUnifiedEmbed)
    expect(wrapper.findComponent(SandboxModeSwitch).props('modelValue')).toBe('customizer')
    expect(wrapper.findComponent(TokenCustomizer).isVisible()).toBe(true)
  })

  it('restores the selected tool from ?tool=theme-builder in the hash on mount', () => {
    setHash('#/embedded?embedded=1&tool=theme-builder')
    wrapper = mount(SandboxUnifiedEmbed)
    expect(wrapper.findComponent(SandboxModeSwitch).props('modelValue')).toBe('theme-builder')
  })

  it('switching options updates ?tool= in the hash', async () => {
    wrapper = mount(SandboxUnifiedEmbed)
    await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'theme-builder')
    await wrapper.vm.$nextTick()
    expect(getHashParam('tool')).toBe('theme-builder')

    await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'customizer')
    await wrapper.vm.$nextTick()
    // customizer is the implicit default — omitted from the hash, matching the existing
    // convention of not writing default values (e.g. `theme=`) into the URL.
    expect(getHashParam('tool')).toBeNull()
  })

  it('switching away from customizer does not unmount TokenCustomizer (v-show, not v-if)', async () => {
    wrapper = mount(SandboxUnifiedEmbed)
    expect(wrapper.findComponent(TokenCustomizer).exists()).toBe(true)

    await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'theme-builder')
    await wrapper.vm.$nextTick()

    // Still mounted, just hidden — proves the instance (and its state) is preserved.
    expect(wrapper.findComponent(TokenCustomizer).exists()).toBe(true)
    expect(wrapper.findComponent(TokenCustomizer).isVisible()).toBe(false)
    expect(wrapper.findComponent(ThemeBuilder).isVisible()).toBe(true)
  })

  it('switching options never touches the global preview toggle (selecting a tool never implies enabling/disabling)', async () => {
    wrapper = mount(SandboxUnifiedEmbed)
    const toggle = wrapper.findComponent(SandboxPreviewToggle)

    await toggle.vm.$emit('update:modelValue', false)
    expect(toggle.props('modelValue')).toBe(false)

    await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'theme-builder')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SandboxPreviewToggle).props('modelValue')).toBe(false)
  })

  describe('global preview toggle (replaces the old per-mode "Off" tab)', () => {
    it('renders exactly one global toggle, top-level in the header (not nested under a tab)', () => {
      wrapper = mount(SandboxUnifiedEmbed)
      const toggles = wrapper.findAllComponents(SandboxPreviewToggle)
      expect(toggles).toHaveLength(1)
      expect(wrapper.find('.ss-header').findComponent(SandboxPreviewToggle).exists()).toBe(true)
    })

    it('renders in compact mode, bold-labeled with the selected tool, with an info tooltip', () => {
      wrapper = mount(SandboxUnifiedEmbed)
      const toggle = wrapper.findComponent(SandboxPreviewToggle)
      expect(toggle.props('compact')).toBe(true)
      expect(toggle.props('toolLabel')).toBe('Customizer')
      expect(toggle.props('infoTooltip')).toContain('Customizer')
    })

    it('relabels the toggle and its tooltip when switching tools', async () => {
      wrapper = mount(SandboxUnifiedEmbed)
      await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'theme-builder')
      await wrapper.vm.$nextTick()
      const toggle = wrapper.findComponent(SandboxPreviewToggle)
      expect(toggle.props('toolLabel')).toBe('Theme Builder')
      expect(toggle.props('infoTooltip')).toContain('Theme Builder')
    })

    it('does not suppress either tool\'s own editor UI when toggled off — only the page injection stops', async () => {
      wrapper = mount(SandboxUnifiedEmbed)
      await wrapper.findComponent(SandboxPreviewToggle).vm.$emit('update:modelValue', false)
      await wrapper.vm.$nextTick()

      // The Customizer's editor content is still there and visible — turning preview off is
      // not the same as hiding the tool, unlike the old "Off" tab design.
      expect(wrapper.findComponent(TokenCustomizer).find('.cust-embedded-body').exists()).toBe(true)
      expect(wrapper.findComponent(TokenCustomizer).isVisible()).toBe(true)
    })

    it('toggling off posts an empty-CSS kui-token-override message', async () => {
      const postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
      wrapper = mount(SandboxUnifiedEmbed)
      await flushPromises()

      await wrapper.findComponent(SandboxPreviewToggle).vm.$emit('update:modelValue', false)
      await wrapper.vm.$nextTick()
      await flushPromises()

      expect(lastPostedCss(postMessageSpy)).toBe('')
    })

    it('toggling back on immediately re-posts the selected tool\'s current CSS', async () => {
      const postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
      useTokenCustomizer().setOverride('--kui-space-10', '99px', '2px')
      wrapper = mount(SandboxUnifiedEmbed)
      await flushPromises()

      const toggle = wrapper.findComponent(SandboxPreviewToggle)
      await toggle.vm.$emit('update:modelValue', false)
      await wrapper.vm.$nextTick()
      await flushPromises()
      expect(lastPostedCss(postMessageSpy)).toBe('')

      await toggle.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
      await flushPromises()
      // Re-posted without any further edit — proves the toggle itself triggers a post.
      expect(lastPostedCss(postMessageSpy)).toContain('--kui-space-10: 99px !important;')
    })
  })

  it('posts exactly one kui-token-override message per toggle flip (single bridge, no duplicate/racing posts)', async () => {
    const postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
    wrapper = mount(SandboxUnifiedEmbed)
    await flushPromises()
    const afterMount = postCount(postMessageSpy)
    expect(afterMount).toBeGreaterThan(0)

    postMessageSpy.mockClear()
    await wrapper.findComponent(SandboxPreviewToggle).vm.$emit('update:modelValue', false)
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(postCount(postMessageSpy)).toBe(1)
  })

  it('renders exactly one SandboxShell header/close button for the whole sidebar (no doubled-up chrome)', () => {
    wrapper = mount(SandboxUnifiedEmbed)
    expect(wrapper.findAll('.ss-header')).toHaveLength(1)
    expect(wrapper.findAll('.ss-close')).toHaveLength(1)
    // Each hosted child suppresses its own header entirely.
    expect(wrapper.findComponent(TokenCustomizer).find('.ss-header').exists()).toBe(false)
    expect(wrapper.findComponent(ThemeBuilder).find('.ss-header').exists()).toBe(false)
  })

  it('each hosted child suppresses its own preview toggle (the shell owns the one global toggle)', () => {
    wrapper = mount(SandboxUnifiedEmbed)
    expect(wrapper.findComponent(TokenCustomizer).findComponent(SandboxPreviewToggle).exists()).toBe(false)
    expect(wrapper.findComponent(ThemeBuilder).findComponent(SandboxPreviewToggle).exists()).toBe(false)
  })

  it('provides a short Instructions sub-tab for each tool, independent of the top-level mode switch', async () => {
    wrapper = mount(SandboxUnifiedEmbed)

    // Customizer's own Instructions sub-tab (its default sub-tab is 'tokens'; switch explicitly).
    // Scoped to the child — SandboxTabs is still used for each tool's own internal sub-tabs,
    // just not for the top-level Customizer/Theme Builder switch (that's SandboxModeSwitch).
    await wrapper.findComponent(TokenCustomizer).findComponent(SandboxTabs).vm.$emit('update:modelValue', 'instructions')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(TokenCustomizer).text()).toContain('Token Customizer overrides')

    // Theme Builder's own sub-tabs already default to Instructions.
    await wrapper.findComponent(SandboxModeSwitch).vm.$emit('update:modelValue', 'theme-builder')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(ThemeBuilder).text()).toContain('What this is')
  })

  it('close() posts kui-close exactly once, regardless of the selected tool', async () => {
    const postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
    wrapper = mount(SandboxUnifiedEmbed)
    await flushPromises()

    await wrapper.find('.ss-close').trigger('click')
    // handleClose now awaits a flushing post() before calling close() (see next test) — let it settle.
    await flushPromises()
    const closeCalls = postMessageSpy.mock.calls.filter((c) => (c[0] as { type?: string })?.type === 'kui-close')
    expect(closeCalls).toHaveLength(1)
  })

  it('flushes a still-in-flight edit before posting kui-close, so it is not dropped by the bookmarklet listener', async () => {
    const postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
    wrapper = mount(SandboxUnifiedEmbed)
    await flushPromises()

    useTokenCustomizer().setOverride('--kui-space-10', '99px', '2px')
    await wrapper.vm.$nextTick()
    // Click close immediately — before the async post() triggered by the override change (which
    // awaits Customizer's buildSrc()/encodeOverrides) has had a chance to resolve.
    await wrapper.find('.ss-close').trigger('click')
    await flushPromises()

    const calls = postMessageSpy.mock.calls.map((c) => c[0] as { type?: string, css?: string })
    const overrideIndex = calls.findIndex((c) => c.type === 'kui-token-override' && c.css?.includes('--kui-space-10: 99px !important;'))
    const closeIndex = calls.findIndex((c) => c.type === 'kui-close')
    expect(overrideIndex).toBeGreaterThanOrEqual(0)
    expect(closeIndex).toBeGreaterThanOrEqual(0)
    // The flushed edit must land before kui-close removes the sidebar iframe — otherwise the
    // bookmarklet's listener finds no frame to apply it to and silently drops it.
    expect(overrideIndex).toBeLessThan(closeIndex)
  })
})
