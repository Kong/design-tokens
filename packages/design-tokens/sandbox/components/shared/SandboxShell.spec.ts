// @vitest-environment jsdom
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SandboxShell from './SandboxShell.vue'

/** jsdom has no ResizeObserver; SandboxShell measures its header via useHeaderHeight(). */
class MockResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/customize', component: { template: '<div />' } },
    ],
  })
}

async function mountShell(props: { title: string, embedded: boolean, chromeless?: boolean }, slots: Record<string, string> = {}) {
  const router = makeRouter()
  router.push('/customize')
  await router.isReady()
  return mount(SandboxShell, {
    props,
    slots,
    global: { plugins: [router] },
  })
}

describe('SandboxShell', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the title prop', async () => {
    const wrapper = await mountShell({ title: 'Token Customizer', embedded: false })
    expect(wrapper.find('.ss-title').text()).toBe('Token Customizer')
  })

  it('re-renders the title reactively when the prop changes', async () => {
    const wrapper = await mountShell({ title: 'Token Customizer', embedded: false })
    await wrapper.setProps({ title: 'Theme Builder' })
    expect(wrapper.find('.ss-title').text()).toBe('Theme Builder')
  })

  describe('embedded = false', () => {
    it('shows the "← Browse" link back to the browser route', async () => {
      const wrapper = await mountShell({ title: 'Token Customizer', embedded: false })
      const back = wrapper.find('.ss-back')
      expect(back.exists()).toBe(true)
      expect(back.text()).toBe('← Browse')
      // `RouterLink` is globally stubbed with `RouterLinkStub` (vitest.setup.ts), which never
      // renders a real `href` — assert against the stub's `to` prop instead.
      expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/')
    })

    it('does not show the close button', async () => {
      const wrapper = await mountShell({ title: 'Token Customizer', embedded: false })
      expect(wrapper.find('.ss-close').exists()).toBe(false)
    })
  })

  describe('embedded = true', () => {
    it('hides the "← Browse" link', async () => {
      const wrapper = await mountShell({ title: 'Token Customizer', embedded: true })
      expect(wrapper.find('.ss-back').exists()).toBe(false)
    })

    it('shows the close button and emits "close" with no payload when clicked', async () => {
      const wrapper = await mountShell({ title: 'Token Customizer', embedded: true })
      const closeBtn = wrapper.find('.ss-close')
      expect(closeBtn.exists()).toBe(true)

      await closeBtn.trigger('click')
      expect(wrapper.emitted('close')).toEqual([[]])
    })
  })

  describe('chromeless = true', () => {
    it('renders no header (title or close button), even when embedded', async () => {
      const wrapper = await mountShell({ title: 'Token Customizer', embedded: true, chromeless: true })
      expect(wrapper.find('.ss-header').exists()).toBe(false)
      expect(wrapper.find('.ss-title').exists()).toBe(false)
      expect(wrapper.find('.ss-close').exists()).toBe(false)
    })

    it('still renders the tabs slot and the default slot content', async () => {
      const wrapper = await mountShell(
        { title: 'Token Customizer', embedded: true, chromeless: true },
        { tabs: '<nav class="probe-tabs">tabs</nav>', default: '<p class="probe-default">body</p>' },
      )
      expect(wrapper.find('.probe-tabs').exists()).toBe(true)
      expect(wrapper.find('.probe-default').exists()).toBe(true)
    })

    it('applies the chromeless root class (fills its container instead of the full viewport)', async () => {
      const wrapper = await mountShell({ title: 'Token Customizer', embedded: true, chromeless: true })
      expect(wrapper.find('.sandbox-shell').classes()).toContain('sandbox-shell--chromeless')
    })
  })

  describe('slots', () => {
    it('renders the default slot inside the scrollable body', async () => {
      const wrapper = await mountShell(
        { title: 'Token Customizer', embedded: false },
        { default: '<p class="probe-default">body content</p>' },
      )
      const body = wrapper.find('.ss-body')
      expect(body.find('.probe-default').exists()).toBe(true)
      expect(body.text()).toBe('body content')
    })

    it('renders the title-extra slot next to the title in the header', async () => {
      const wrapper = await mountShell(
        { title: 'Token Customizer', embedded: false },
        { 'title-extra': '<span class="probe-extra">beta</span>' },
      )
      const headerLeft = wrapper.find('.ss-header-left')
      expect(headerLeft.find('.probe-extra').exists()).toBe(true)
      expect(headerLeft.text()).toContain('beta')
    })

    it('renders the header-actions slot in the header, before the close button', async () => {
      const wrapper = await mountShell(
        { title: 'Token Customizer', embedded: true },
        { 'header-actions': '<button class="probe-action">Export</button>' },
      )
      const headerRight = wrapper.find('.ss-header-right')
      const children = headerRight.element.children
      expect(headerRight.find('.probe-action').exists()).toBe(true)
      // header-actions slot is rendered before the close button in DOM order
      expect(children[0].className).toContain('probe-action')
      expect(children[children.length - 1].className).toContain('ss-close')
    })

    it('renders the tabs slot between the header and the body', async () => {
      const wrapper = await mountShell(
        { title: 'Token Customizer', embedded: false },
        { tabs: '<nav class="probe-tabs">tabs</nav>' },
      )
      const root = wrapper.find('.sandbox-shell')
      const children = [...root.element.children]
      const tabsIndex = children.findIndex((c) => c.classList.contains('probe-tabs'))
      const headerIndex = children.findIndex((c) => c.classList.contains('ss-header'))
      const bodyIndex = children.findIndex((c) => c.classList.contains('ss-body'))
      expect(tabsIndex).toBeGreaterThan(headerIndex)
      expect(tabsIndex).toBeLessThan(bodyIndex)
    })

    it('does not render slot content when the corresponding slot is not provided', async () => {
      const wrapper = await mountShell({ title: 'Token Customizer', embedded: false })
      expect(wrapper.find('.probe-default').exists()).toBe(false)
      expect(wrapper.find('.probe-extra').exists()).toBe(false)
      expect(wrapper.find('.probe-action').exists()).toBe(false)
      expect(wrapper.find('.probe-tabs').exists()).toBe(false)
    })
  })
})
