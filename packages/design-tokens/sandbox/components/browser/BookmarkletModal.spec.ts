// @vitest-environment jsdom
import { mount, RouterLinkStub } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import BookmarkletModal from './BookmarkletModal.vue'

const BOOKMARKLET_HREF = 'javascript:(function(){/* customizer */})()'
const THEME_BUILDER_HREF = 'javascript:(function(){/* theme-builder */})()'

function mountModal(props: Partial<InstanceType<typeof BookmarkletModal>['$props']> = {}) {
  return mount(BookmarkletModal, {
    props: {
      modelValue: true,
      bookmarkletHref: BOOKMARKLET_HREF,
      themeBuilderHref: THEME_BUILDER_HREF,
      ...props,
    },
  })
}

describe('BookmarkletModal', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders nothing when modelValue is false', () => {
    const wrapper = mountModal({ modelValue: false })
    expect(document.querySelector('.bm-backdrop')).toBeNull()
    expect(wrapper.find('.bm-backdrop').exists()).toBe(false)
  })

  it('renders the modal (teleported to body) when modelValue is true', () => {
    mountModal({ modelValue: true })
    expect(document.querySelector('.bm-backdrop')).not.toBeNull()
    expect(document.querySelector('.bm-modal')).not.toBeNull()
    expect(document.querySelector('#bm-title')?.textContent?.trim()).toBe('Use tokens on any page')
  })

  it('sets the drag-link hrefs from props', () => {
    mountModal()
    const links = document.querySelectorAll('.bm-drag-link')
    expect(links).toHaveLength(2)
    expect(links[0].getAttribute('href')).toBe(BOOKMARKLET_HREF)
    expect(links[1].getAttribute('href')).toBe(THEME_BUILDER_HREF)
  })

  it('emits update:modelValue false when the close button is clicked', async () => {
    const wrapper = mountModal()
    const closeBtn = document.querySelector('.bm-close') as HTMLElement
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('emits update:modelValue false when clicking the backdrop itself', async () => {
    const wrapper = mountModal()
    const backdrop = document.querySelector('.bm-backdrop') as HTMLElement
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('does not emit update:modelValue when clicking inside the modal body (not the backdrop)', async () => {
    const wrapper = mountModal()
    const modal = document.querySelector('.bm-modal') as HTMLElement
    modal.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits update:modelValue false when the standalone "Open Token Customizer" link is clicked', async () => {
    const wrapper = mountModal()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/customize')
    await link.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('does not emit click.prevent navigation side effects for the drag links (click is prevented)', async () => {
    mountModal()
    const link = document.querySelector('.bm-drag-link') as HTMLAnchorElement
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })
})
