// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import CustPreviewPanel from './CustPreviewPanel.vue'

const SAMPLE_CSS = `:root {
  --kui-color-background-primary: #3B82F6;
  --kui-space-10: 4px;
  --kui-space-20: 8px;
}`

/** Resets the hash-mode URL to a clean `/customize` route with no query params. */
function resetHash() {
  window.location.hash = '#/customize'
}

describe('CustPreviewPanel', () => {
  // Tracks every mounted wrapper so it can be unmounted (and detached from document.body)
  // after each test — required since some tests attach to the real DOM for iframe access.
  const mountedWrappers: VueWrapper[] = []

  beforeEach(() => {
    resetHash()
    // jsdom has no ResizeObserver; the component observes the frame container on mount.
    // @ts-expect-error test stub, no real observation semantics needed
    global.ResizeObserver = class {
      observe() {}
      disconnect() {}
    }
  })

  afterEach(() => {
    resetHash()
    for (const w of mountedWrappers.splice(0)) w.unmount()
  })

  function mountPanel(props: Partial<{ allTokensCss: string, customSelector: string }> = {}) {
    // Attached to document.body: jsdom only initializes an <iframe>'s contentDocument for
    // iframes actually connected to the document — several tests below need real access to it.
    const wrapper = mount(CustPreviewPanel, {
      props: { allTokensCss: SAMPLE_CSS, customSelector: '', ...props },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    return wrapper
  }

  describe('iframe-proxy mode (dev default)', () => {
    it('renders the URL bar and viewport breakpoint controls', () => {
      const wrapper = mountPanel()
      expect(wrapper.find('.preview-url-bar').exists()).toBe(true)
      expect(wrapper.find('.preview-controls').exists()).toBe(true)
      expect(wrapper.find('.bookmarklet-card').exists()).toBe(false)
      // "phone" preset is always prepended regardless of token-derived breakpoints.
      expect(wrapper.findAll('.bp-btn').some((b) => b.text() === 'phone')).toBe(true)
    })

    it('shows the empty state and no status bar before a URL is loaded', () => {
      const wrapper = mountPanel()
      expect(wrapper.find('.preview-empty').exists()).toBe(true)
      expect(wrapper.find('.preview-frame-chrome').exists()).toBe(false)
      expect(wrapper.find('.preview-status').exists()).toBe(false)
    })

    it('disables the Load button until a URL is entered', async () => {
      const wrapper = mountPanel()
      expect(wrapper.find('.url-btn').attributes('disabled')).toBeDefined()
      await wrapper.find('.url-input').setValue('https://example.com')
      expect(wrapper.find('.url-btn').attributes('disabled')).toBeUndefined()
    })

    it('loads the URL on Load click: shows loading status, chrome frame, and an iframe', async () => {
      const wrapper = mountPanel()
      await wrapper.find('.url-input').setValue('https://example.com')
      await wrapper.find('.url-btn').trigger('click')

      expect(wrapper.find('.preview-empty').exists()).toBe(false)
      expect(wrapper.find('.preview-frame-chrome').exists()).toBe(true)
      expect(wrapper.find('.preview-iframe').exists()).toBe(true)
      expect(wrapper.find('.status-dot').classes()).toContain('status-dot--loading')
      expect(wrapper.find('.status-label').text()).toBe('Loading…')
      expect(wrapper.find('.url-btn').text()).toContain('Loading…')
      expect(wrapper.find('.url-btn').attributes('disabled')).toBeDefined()
    })

    it('also loads on pressing Enter in the URL input', async () => {
      const wrapper = mountPanel()
      await wrapper.find('.url-input').setValue('https://example.com')
      await wrapper.find('.url-input').trigger('keydown.enter')
      expect(wrapper.find('.preview-frame-chrome').exists()).toBe(true)
    })

    it('does nothing on Load click when the URL is empty', async () => {
      const wrapper = mountPanel()
      await wrapper.find('.url-btn').trigger('click')
      expect(wrapper.find('.preview-frame-chrome').exists()).toBe(false)
    })

    it('transitions to connected status once the iframe reports a same-origin load', async () => {
      const wrapper = mountPanel()
      await wrapper.find('.url-input').setValue('https://example.com')
      await wrapper.find('.url-btn').trigger('click')

      // jsdom's iframe.contentDocument is a real, same-origin Document, but jsdom never
      // actually navigates/renders iframe content, so it starts with no documentElement.
      // Populate it the way a real proxied page load would, then fire `load` to exercise
      // the success path of onIframeLoad/injectIntoIframe.
      const iframeDoc = (wrapper.find('.preview-iframe').element as HTMLIFrameElement).contentDocument
      iframeDoc?.open()
      iframeDoc?.write('<html><head></head><body></body></html>')
      iframeDoc?.close()

      await wrapper.find('.preview-iframe').trigger('load')

      expect(wrapper.find('.status-dot').classes()).toContain('status-dot--connected')
      expect(wrapper.find('.status-label').text()).toBe('Loaded')
    })

    it('transitions to error status when the iframe document is inaccessible', async () => {
      const wrapper = mountPanel()
      await wrapper.find('.url-input').setValue('https://example.com')
      await wrapper.find('.url-btn').trigger('click')

      const iframeEl = wrapper.find('.preview-iframe').element as HTMLIFrameElement
      Object.defineProperty(iframeEl, 'contentDocument', { get: () => null, configurable: true })

      await wrapper.find('.preview-iframe').trigger('load')

      expect(wrapper.find('.status-dot').classes()).toContain('status-dot--error')
      expect(wrapper.find('.status-label').text()).toBe('Failed — page may require auth or block framing')
    })

    it('updates viewport width/height and aria-pressed when a breakpoint preset is clicked', async () => {
      const wrapper = mountPanel()
      await wrapper.find('.url-input').setValue('https://example.com')
      await wrapper.find('.url-btn').trigger('click')

      const phoneBtn = wrapper.findAll('.bp-btn').find((b) => b.text() === 'phone')!
      await phoneBtn.trigger('click')

      expect(phoneBtn.attributes('aria-pressed')).toBe('true')
      expect(phoneBtn.classes()).toContain('bp-btn--active')
      const chrome = wrapper.find('.preview-frame-chrome')
      expect(chrome.attributes('style')).toContain('width: 390px')
      expect(chrome.attributes('style')).toContain('height: 844px')
    })

    it('counts injected tokens from allTokensCss and updates the badge when the CSS changes', async () => {
      const wrapper = mountPanel()
      expect(wrapper.find('.inject-mode-note').text()).toBe('All 3 tokens injected')

      await wrapper.setProps({
        allTokensCss: ':root {\n  --kui-space-10: 4px;\n}',
      })
      expect(wrapper.find('.inject-mode-note').text()).toBe('All 1 tokens injected')
    })

    it('v-model syncs the selector input and emits update:customSelector', async () => {
      const wrapper = mountPanel({ customSelector: '' })
      expect(wrapper.find('.inject-selector-input').attributes('placeholder')).toBe(':root')

      await wrapper.find('.inject-selector-input').setValue('[data-theme="dark"]')
      expect(wrapper.emitted('update:customSelector')).toEqual([['[data-theme="dark"]']])
    })
  })

  describe('bookmarklet-popup mode (hosted)', () => {
    beforeEach(() => {
      // usePreviewBridge reads this hash param once, at composable-init time, to force
      // bookmarklet mode even under Vite dev (`import.meta.env.DEV`).
      window.location.hash = '#/customize?preview=bookmarklet'
    })

    it('renders the bookmarklet setup card instead of the URL bar / viewport controls', () => {
      const wrapper = mountPanel()
      expect(wrapper.find('.preview-url-bar').exists()).toBe(false)
      expect(wrapper.find('.preview-controls').exists()).toBe(false)
      expect(wrapper.find('.bookmarklet-card').exists()).toBe(true)
    })

    it('renders a single bookmarklet drag-link pointing at a javascript: href', () => {
      const wrapper = mountPanel()
      const links = wrapper.findAll('.bookmarklet-link')
      expect(links).toHaveLength(1)
      expect(links[0].attributes('href')).toMatch(/^javascript:/)
      expect(links[0].text()).toContain('Kong Design Tokens')
    })

    it('shows the localhost warning when served from a local origin', () => {
      const wrapper = mountPanel()
      // jsdom's default test origin is a localhost-class hostname.
      expect(wrapper.find('.bookmarklet-localhost-warning').exists()).toBe(true)
    })

    it('still renders the shared inject-settings row (selector input)', () => {
      const wrapper = mountPanel()
      expect(wrapper.find('.inject-selector-input').exists()).toBe(true)
    })
  })
})
