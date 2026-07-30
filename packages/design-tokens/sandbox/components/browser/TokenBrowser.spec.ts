// @vitest-environment jsdom
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TokenBrowser from './TokenBrowser.vue'
import { ALL_ENTRIES, resolveThemedEntries } from '@/composables/useTokens'

/**
 * jsdom does not implement ResizeObserver; TokenBrowser's header measures itself
 * with one via useHeaderHeight(). A minimal no-op stub is enough for mounting.
 */
class MockResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

/** Minimal router matching the app's real routes, without mounting the actual views. */
function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/customize', component: { template: '<div />' } },
      { path: '/theme-builder', component: { template: '<div />' } },
    ],
  })
}

describe('TokenBrowser', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
    vi.useFakeTimers()
    // jsdom implements neither the async Clipboard API nor document.execCommand;
    // stub the former so useClipboard's happy path resolves instead of falling
    // back to the (also-unimplemented) execCommand path.
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  async function mountBrowser() {
    const router = makeRouter()
    router.push('/')
    await router.isReady()
    const wrapper = mount(TokenBrowser, { global: { plugins: [router] } })
    return { wrapper, router }
  }

  it('renders the theme select with every repo theme as an option', async () => {
    const { wrapper } = await mountBrowser()
    const options = wrapper.find('.theme-select').findAll('option')
    expect(options.map((o) => o.attributes('value'))).toEqual([
      'classic-day',
      'classic-night',
      'electric-lime-day',
      'electric-lime-day-high-contrast',
      'electric-lime-night',
      'electric-lime-night-high-contrast',
    ])
  })

  it('defaults to the color category tab, active and rendering token cards', async () => {
    const { wrapper } = await mountBrowser()
    const activeTab = wrapper.find('.tab-btn--active')
    expect(activeTab.exists()).toBe(true)
    expect(activeTab.text()).toContain('Color')
    expect(wrapper.findAll('.token-card').length).toBeGreaterThan(0)
  })

  it('switches category tabs on click, changing the rendered token set', async () => {
    const { wrapper } = await mountBrowser()
    const tabs = wrapper.findAll('.tab-btn')
    const spaceTab = tabs.find((t) => t.text().includes('Space'))
    expect(spaceTab).toBeTruthy()

    const before = wrapper.findAll('.card-token-name').map((n) => n.text())
    await spaceTab!.trigger('click')

    expect(spaceTab!.classes()).toContain('tab-btn--active')
    const after = wrapper.findAll('.card-token-name').map((n) => n.text())
    expect(after).not.toEqual(before)
    expect(after.every((name) => name.startsWith('kui-space'))).toBe(true)
  })

  it('shows the "components" tab as grouped subcategory sections instead of a flat grid', async () => {
    const { wrapper } = await mountBrowser()
    const tabs = wrapper.findAll('.tab-btn')
    const componentsTab = tabs.find((t) => t.text().includes('Components'))
    await componentsTab!.trigger('click')

    const sectionHeaders = wrapper.findAll('.token-section-header')
    expect(sectionHeaders.length).toBeGreaterThan(1)
    // Component tab sections are not collapsible (no collapse button)
    expect(wrapper.find('.section-collapse-btn').exists()).toBe(false)
  })

  it('narrows the visible list when a search query matches known tokens', async () => {
    const { wrapper } = await mountBrowser()
    await wrapper.find('.search-input').setValue('kui-space-40')
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Search mode replaces the tab UI with grouped search results
    expect(wrapper.find('.category-tabs').exists()).toBe(false)
    expect(wrapper.find('.search-results').exists()).toBe(true)
    const names = wrapper.findAll('.card-token-name').map((n) => n.text())
    expect(names.length).toBeGreaterThan(0)
    expect(names).toContain('kui-space-40')
  })

  it('shows an explicit empty state for a query that matches nothing', async () => {
    const { wrapper } = await mountBrowser()
    await wrapper.find('.search-input').setValue('zzz-not-a-real-token-zzz')
    vi.advanceTimersByTime(300)
    await flushPromises()

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state').text()).toContain('No tokens match')
    expect(wrapper.findAll('.token-card').length).toBe(0)
  })

  it('clears the search and returns to tab-browse mode via the clear button', async () => {
    const { wrapper } = await mountBrowser()
    await wrapper.find('.search-input').setValue('space')
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(wrapper.find('.search-results').exists()).toBe(true)

    await wrapper.find('.search-clear').trigger('click')
    vi.advanceTimersByTime(300)
    await flushPromises()

    expect((wrapper.find('.search-input').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('.search-results').exists()).toBe(false)
    expect(wrapper.find('.category-tabs').exists()).toBe(true)
  })

  it('debounces search input, only filtering 300ms after the last keystroke', async () => {
    const { wrapper } = await mountBrowser()
    await wrapper.find('.search-input').setValue('spa')
    vi.advanceTimersByTime(299)
    await flushPromises()
    expect(wrapper.find('.search-results').exists()).toBe(false)

    vi.advanceTimersByTime(1)
    await flushPromises()
    expect(wrapper.find('.search-results').exists()).toBe(true)
  })

  it('resets search and returns to the color tab when the logo is clicked', async () => {
    const { wrapper } = await mountBrowser()
    const tabs = wrapper.findAll('.tab-btn')
    const spaceTab = tabs.find((t) => t.text().includes('Space'))
    await spaceTab!.trigger('click')
    await wrapper.find('.search-input').setValue('space')
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(wrapper.find('.search-results').exists()).toBe(true)

    await wrapper.find('.brand-btn').trigger('click')
    await flushPromises()

    expect((wrapper.find('.search-input').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('.search-results').exists()).toBe(false)
    const activeTab = wrapper.find('.tab-btn--active')
    expect(activeTab.text()).toContain('Color')
  })

  it('switches the copy format between CSS, Sass, and JS and reflects it in the emitted copy text', async () => {
    const { wrapper } = await mountBrowser()
    const [cssBtn, sassBtn, jsBtn] = wrapper.findAll('.format-btn')
    expect(cssBtn.attributes('aria-pressed')).toBe('true')

    await sassBtn.trigger('click')
    expect(sassBtn.attributes('aria-pressed')).toBe('true')
    expect(cssBtn.attributes('aria-pressed')).toBe('false')

    const firstCard = wrapper.findAll('.token-card')[0]
    const cssVar = ALL_ENTRIES.find((e) => e.category === 'color')!.cssVar
    expect(firstCard.attributes('title')).toBe(`Click to copy: $${cssVar.slice(2)}`)

    await jsBtn.trigger('click')
    expect(firstCard.attributes('title')).toMatch(/^Click to copy: KUI_/)
  })

  it('marks a token card as copied after it is clicked, forwarding the copy event through TokenCard', async () => {
    const { wrapper } = await mountBrowser()
    const firstCard = wrapper.findAll('.token-card')[0]
    expect(firstCard.classes()).not.toContain('token-card--copied')

    await firstCard.trigger('click')
    await flushPromises()

    expect(firstCard.classes()).toContain('token-card--copied')
  })

  it('changes rendered token values when the preview theme is switched, without touching the selector value alone', async () => {
    const { wrapper } = await mountBrowser()

    // Pick a color token that is known to differ between classic-day (default) and electric-lime-day.
    const themedEntries = resolveThemedEntries(ALL_ENTRIES, 'electric-lime-day')
    const idx = ALL_ENTRIES.findIndex(
      (e, i) => e.category === 'color' && e.value.toLowerCase() !== themedEntries[i].value.toLowerCase(),
    )
    expect(idx).toBeGreaterThanOrEqual(0)
    const target = ALL_ENTRIES[idx]
    const themedTarget = themedEntries[idx]

    const valuesBefore = wrapper.findAll('.card-token-value').map((n) => n.text())
    expect(valuesBefore).toContain(target.value)

    await wrapper.find('.theme-select').setValue('electric-lime-day')
    await flushPromises()

    expect((wrapper.find('.theme-select').element as HTMLSelectElement).value).toBe('electric-lime-day')
    const valuesAfter = wrapper.findAll('.card-token-value').map((n) => n.text())
    expect(valuesAfter).not.toContain(target.value)
    expect(valuesAfter).toContain(themedTarget.value)
  })

  it('renders "Customize" and "Theme Builder" as router-links in dev mode (default test env)', async () => {
    const { wrapper } = await mountBrowser()
    const links = wrapper.findAll('a.nav-link')
    expect(links.map((l) => l.text())).toEqual(['Customize →', 'Theme Builder →'])
    expect(wrapper.find('button.nav-link--btn').exists()).toBe(false)
  })

  describe('production mode (bookmarklet buttons instead of router-links)', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('shows bookmarklet trigger buttons and opens the setup modal on click', async () => {
      vi.resetModules()
      vi.stubEnv('DEV', false)
      const { default: TokenBrowserProd } = await import('./TokenBrowser.vue')

      const router = makeRouter()
      router.push('/')
      await router.isReady()
      const wrapper = mount(TokenBrowserProd, { global: { plugins: [router] } })

      const navButtons = wrapper.findAll('button.nav-link--btn')
      expect(navButtons.map((b) => b.text())).toEqual(['Customize →', 'Theme Builder →'])
      expect(wrapper.find('a.nav-link').exists()).toBe(false)

      // BookmarkletModal teleports to <body>; because this module graph was
      // reloaded via resetModules(), the statically-imported BookmarkletModal
      // symbol no longer identifies the freshly re-evaluated component, so
      // assert on the teleported DOM rather than findComponent().
      expect(document.querySelector('.bm-modal')).toBeNull()
      await navButtons[0].trigger('click')
      expect(document.querySelector('.bm-modal')).not.toBeNull()

      wrapper.unmount()
    })
  })
})
