// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeBuilder from './ThemeBuilder.vue'
import FileLoader from './FileLoader.vue'
import InstructionsPanel from './InstructionsPanel.vue'
import PalettePanel from './PalettePanel.vue'
import TokenList from './TokenList.vue'
import OutputPanel from './OutputPanel.vue'
import SandboxTabs from '@/components/shared/SandboxTabs.vue'
import { useThemeBuilder } from '@/composables/useThemeBuilder'

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
  'kui-space-40': { $value: '16px' },
})

const LOAD_PAYLOAD = {
  themeText: VALID_THEME,
  aliasText: VALID_ALIAS,
  themeName: 'my.theme.json',
  aliasName: 'my.alias.color.json',
}

/**
 * `useThemeBuilder`'s state is module-scoped and persists across the whole app lifetime
 * (documented in the sandbox reference doc), so every test must reset it — mirroring the
 * reset pattern already used in useThemeBuilder.spec.ts — otherwise state from one test
 * leaks into the next.
 */
function resetBuilderState() {
  const builder = useThemeBuilder()
  builder.unload()
  return builder
}

// jsdom has no ResizeObserver; SandboxShell's useHeaderHeight observes the header element on
// mount, so every mount would otherwise throw "ResizeObserver is not defined".
class MockResizeObserver {
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)

/** Switches the active tab via the same emit contract used by SandboxTabs. */
async function switchTab(wrapper: ReturnType<typeof mount>, tabId: string) {
  await wrapper.findComponent(SandboxTabs).vm.$emit('update:modelValue', tabId)
}

describe('ThemeBuilder', () => {
  let wrapper: ReturnType<typeof mount> | undefined

  beforeEach(() => {
    resetBuilderState()
    localStorage.clear()
    window.location.hash = '#/theme-builder'
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.restoreAllMocks()
  })

  describe('initial (unloaded) state', () => {
    it('shows the Instructions panel by default and hides the file loader', () => {
      wrapper = mount(ThemeBuilder)
      expect(wrapper.findComponent(InstructionsPanel).exists()).toBe(true)
      // FileLoader only mounts once the user navigates off the Instructions tab.
      expect(wrapper.findComponent(FileLoader).exists()).toBe(false)
    })

    it('shows the file loader once the active tab moves off Instructions, before any file is loaded', async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      expect(wrapper.findComponent(FileLoader).exists()).toBe(true)
      expect(wrapper.findComponent(TokenList).exists()).toBe(false)
    })

    it('does not show the "Load different theme" button before a file is loaded', () => {
      wrapper = mount(ThemeBuilder)
      expect(wrapper.find('.tb-load-different').exists()).toBe(false)
    })

    it('passes no error to FileLoader until a load attempt has failed', async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      expect(wrapper.findComponent(FileLoader).props('error')).toBe('')
    })
  })

  describe('loading a theme', () => {
    it('rejects an invalid file pair and surfaces the composable error on FileLoader instead of switching views', async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      await wrapper.findComponent(FileLoader).vm.$emit('load', {
        themeText: 'not json',
        aliasText: VALID_ALIAS,
        themeName: 'bad.theme.json',
        aliasName: 'my.alias.color.json',
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent(FileLoader).exists()).toBe(true)
      expect(wrapper.findComponent(FileLoader).props('error')).toBe('Theme file is not valid JSON.')
      expect(wrapper.findComponent(TokenList).exists()).toBe(false)
    })

    it('transitions to the editing UI and populates the token list on a valid load', async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      await wrapper.findComponent(FileLoader).vm.$emit('load', LOAD_PAYLOAD)
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent(FileLoader).exists()).toBe(false)
      const tokenList = wrapper.findComponent(TokenList)
      expect(tokenList.exists()).toBe(true)
      expect(tokenList.props('tokens')).toHaveLength(2)
      expect(tokenList.props('tokens').map((t: { key: string }) => t.key)).toEqual([
        'kui-color-background-primary',
        'kui-space-40',
      ])
    })

    it('clears a prior load error once a subsequent load succeeds', async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      await wrapper.findComponent(FileLoader).vm.$emit('load', {
        themeText: 'not json',
        aliasText: VALID_ALIAS,
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(FileLoader).props('error')).not.toBe('')

      await wrapper.findComponent(FileLoader).vm.$emit('load', LOAD_PAYLOAD)
      await wrapper.vm.$nextTick()
      // FileLoader itself is gone now (isLoaded), but no stale error should linger in state.
      expect(wrapper.findComponent(FileLoader).exists()).toBe(false)
    })

    it('shows the "Load different theme" button once loaded', async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      await wrapper.findComponent(FileLoader).vm.$emit('load', LOAD_PAYLOAD)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.tb-load-different').exists()).toBe(true)
    })
  })

  describe('editing wiring after a theme is loaded', () => {
    beforeEach(async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      await wrapper.findComponent(FileLoader).vm.$emit('load', LOAD_PAYLOAD)
      await wrapper.vm.$nextTick()
    })

    it('reflects a token override (emitted from TokenList) in the OutputPanel export text', async () => {
      await wrapper!.findComponent(TokenList).vm.$emit('set', 'kui-space-40', '24px')
      await wrapper!.vm.$nextTick()

      const outputPanel = wrapper!.findComponent(OutputPanel)
      const themeJsonOut = JSON.parse(outputPanel.props('themeJsonOut'))
      expect(themeJsonOut['kui-space-40'].$value).toBe('24px')

      // The override should also show up in the token list's own derived state.
      const overriddenToken = wrapper!.findComponent(TokenList).props('tokens')
        .find((t: { key: string }) => t.key === 'kui-space-40')!
      expect(overriddenToken.source).toBe('overridden')
      expect(overriddenToken.derivedValue).toBe('24px')
    })

    it('reflects a reset (emitted from TokenList) by clearing the override', async () => {
      await wrapper!.findComponent(TokenList).vm.$emit('set', 'kui-space-40', '24px')
      await wrapper!.vm.$nextTick()
      await wrapper!.findComponent(TokenList).vm.$emit('reset', 'kui-space-40')
      await wrapper!.vm.$nextTick()

      const overriddenToken = wrapper!.findComponent(TokenList).props('tokens')
        .find((t: { key: string }) => t.key === 'kui-space-40')!
      expect(overriddenToken.source).toBe('inherited')
      expect(overriddenToken.derivedValue).toBe('16px')
    })

    it('cascades an alias override (emitted from PalettePanel) into referencing tokens and the alias export', async () => {
      await wrapper!.findComponent(PalettePanel).vm.$emit('change', 'blue.30', '#00FF00')
      await wrapper!.vm.$nextTick()

      const colorToken = wrapper!.findComponent(TokenList).props('tokens')
        .find((t: { key: string }) => t.key === 'kui-color-background-primary')!
      expect(colorToken.derivedValue).toBe('#00FF00')
      // Only the alias changed, not the token itself.
      expect(colorToken.source).toBe('inherited')

      const outputPanel = wrapper!.findComponent(OutputPanel)
      const aliasJsonOut = JSON.parse(outputPanel.props('aliasJsonOut'))
      expect(aliasJsonOut.color.alias.blue['30'].$value).toBe('#00FF00')
    })

    it('reflects overrides in the effective CSS passed to OutputPanel', async () => {
      await wrapper!.findComponent(TokenList).vm.$emit('set', 'kui-space-40', '24px')
      await wrapper!.vm.$nextTick()
      expect(wrapper!.findComponent(OutputPanel).props('css')).toContain('--kui-space-40: 24px')
    })

    it('passes the loaded file names through to OutputPanel for the download filenames', () => {
      const outputPanel = wrapper!.findComponent(OutputPanel)
      expect(outputPanel.props('themeFileName')).toBe('my.theme.json')
      expect(outputPanel.props('aliasFileName')).toBe('my.alias.color.json')
    })

    it('keeps PalettePanel, TokenList, and OutputPanel all mounted regardless of active tab (visibility is v-show)', async () => {
      // The default active tab after load is whatever it was before loading ('tokens' here),
      // but all three editing panels should already be in the DOM tree (toggled via v-show),
      // not conditionally mounted per tab.
      expect(wrapper!.findComponent(PalettePanel).exists()).toBe(true)
      expect(wrapper!.findComponent(TokenList).exists()).toBe(true)
      expect(wrapper!.findComponent(OutputPanel).exists()).toBe(true)
    })
  })

  describe('loading a different theme', () => {
    beforeEach(async () => {
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      await wrapper.findComponent(FileLoader).vm.$emit('load', LOAD_PAYLOAD)
      await wrapper.vm.$nextTick()
    })

    it('unloads immediately, without confirmation, when there are no unsaved overrides', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm')
      await wrapper!.find('.tb-load-different').trigger('click')
      await wrapper!.vm.$nextTick()

      expect(confirmSpy).not.toHaveBeenCalled()
      expect(wrapper!.findComponent(TokenList).exists()).toBe(false)
      expect(wrapper!.findComponent(FileLoader).exists()).toBe(true)
    })

    it('asks for confirmation when there are unsaved overrides, and keeps the theme loaded if declined', async () => {
      await wrapper!.findComponent(TokenList).vm.$emit('set', 'kui-space-40', '24px')
      await wrapper!.vm.$nextTick()

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      await wrapper!.find('.tb-load-different').trigger('click')
      await wrapper!.vm.$nextTick()

      expect(confirmSpy).toHaveBeenCalledTimes(1)
      expect(wrapper!.findComponent(TokenList).exists()).toBe(true)
    })

    it('unloads and clears overrides when the user confirms discarding unsaved changes', async () => {
      await wrapper!.findComponent(TokenList).vm.$emit('set', 'kui-space-40', '24px')
      await wrapper!.vm.$nextTick()

      vi.spyOn(window, 'confirm').mockReturnValue(true)
      await wrapper!.find('.tb-load-different').trigger('click')
      await wrapper!.vm.$nextTick()

      expect(wrapper!.findComponent(TokenList).exists()).toBe(false)
      expect(wrapper!.findComponent(FileLoader).exists()).toBe(true)
      // A fresh load afterward must not see the discarded override.
      await wrapper!.findComponent(FileLoader).vm.$emit('load', LOAD_PAYLOAD)
      await wrapper!.vm.$nextTick()
      const token = wrapper!.findComponent(TokenList).props('tokens')
        .find((t: { key: string }) => t.key === 'kui-space-40')!
      expect(token.source).toBe('inherited')
    })
  })

  describe('embedded mode', () => {
    beforeEach(() => {
      window.location.hash = '#/theme-builder?embedded=1'
    })

    it('renders the close control and posts kui-close to the parent window on click', async () => {
      const postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
      wrapper = mount(ThemeBuilder)
      await flushPromises()

      const closeButton = wrapper.find('.ss-close')
      expect(closeButton.exists()).toBe(true)
      await closeButton.trigger('click')

      expect(postMessageSpy).toHaveBeenCalledWith({ type: 'kui-close' }, '*')
    })

    it('does not render the close control when not embedded', () => {
      window.location.hash = '#/theme-builder'
      wrapper = mount(ThemeBuilder)
      expect(wrapper.find('.ss-close').exists()).toBe(false)
    })

    it('preview toggle defaults on, posts empty CSS when off, and hardened CSS when back on', async () => {
      /** css from the most recent `kui-token-override` postMessage call. */
      const lastPostedCss = (spy: ReturnType<typeof vi.spyOn>): string | undefined => {
        const calls = spy.mock.calls.filter((c: unknown[]) => (c[0] as { type?: string })?.type === 'kui-token-override')
        return (calls.at(-1)?.[0] as { css?: string } | undefined)?.css
      }

      const postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
      wrapper = mount(ThemeBuilder)
      await switchTab(wrapper, 'tokens')
      await wrapper.findComponent(FileLoader).vm.$emit('load', LOAD_PAYLOAD)
      await flushPromises()

      const toggle = wrapper.find('.preview-toggle-switch')
      expect(toggle.exists()).toBe(true)
      expect(toggle.attributes('aria-checked')).toBe('true')
      expect(lastPostedCss(postMessageSpy)).toContain('--kui-space-40: 16px !important;')

      await toggle.trigger('click')
      await flushPromises()
      expect(toggle.attributes('aria-checked')).toBe('false')
      expect(lastPostedCss(postMessageSpy)).toBe('')

      await toggle.trigger('click')
      await flushPromises()
      expect(lastPostedCss(postMessageSpy)).toContain(':root:root {')
    })
  })
})
