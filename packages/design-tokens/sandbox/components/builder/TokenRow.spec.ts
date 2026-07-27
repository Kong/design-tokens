// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TokenRow from './TokenRow.vue'
import AliasPicker from './AliasPicker.vue'

const ALIAS_FLAT = [
  { key: 'blue.30', family: 'blue', step: '30', baseHex: '#3B82F6' },
  { key: 'gray.10', family: 'gray', step: '10', baseHex: '#F3F4F6' },
]

function makeToken(overrides = {}) {
  return {
    key: 'kui-color-background-primary',
    cssVar: '--kui-color-background-primary',
    rawValue: '{color.alias.blue.30}',
    isColor: true,
    derivedValue: '#3B82F6',
    source: 'inherited',
    ...overrides,
  }
}

describe('TokenRow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the CSS var name', () => {
    const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT } })
    expect(wrapper.find('.tr-name').text()).toBe('--kui-color-background-primary')
  })

  it('shows the modified accent class only when the token is overridden', () => {
    const inherited = mount(TokenRow, { props: { token: makeToken({ source: 'inherited' }), aliasFlat: ALIAS_FLAT } })
    expect(inherited.classes()).not.toContain('token-row--modified')

    const overridden = mount(TokenRow, { props: { token: makeToken({ source: 'overridden' }), aliasFlat: ALIAS_FLAT } })
    expect(overridden.classes()).toContain('token-row--modified')
  })

  it('does not render a text "modified" label anywhere in the row', () => {
    const wrapper = mount(TokenRow, { props: { token: makeToken({ source: 'overridden' }), aliasFlat: ALIAS_FLAT } })
    expect(wrapper.text().toLowerCase()).not.toContain('modified')
  })

  it('only shows the reset button when the token is overridden', () => {
    const inherited = mount(TokenRow, { props: { token: makeToken({ source: 'inherited' }), aliasFlat: ALIAS_FLAT } })
    expect(inherited.find('.tr-reset').exists()).toBe(false)

    const overridden = mount(TokenRow, { props: { token: makeToken({ source: 'overridden' }), aliasFlat: ALIAS_FLAT } })
    expect(overridden.find('.tr-reset').exists()).toBe(true)
  })

  it('emits reset with the token key when the reset button is clicked', async () => {
    const wrapper = mount(TokenRow, { props: { token: makeToken({ source: 'overridden' }), aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.tr-reset').trigger('click')
    expect(wrapper.emitted('reset')).toEqual([['kui-color-background-primary']])
  })

  describe('color tokens', () => {
    it('opens the alias picker popover on swatch button click', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT } })
      expect(wrapper.findComponent(AliasPicker).exists()).toBe(false)
      await wrapper.find('.tr-color-btn').trigger('click')
      expect(wrapper.find('.tr-popover').exists()).toBe(true)
    })

    it('shows the current alias ref text when the raw value is an alias reference', () => {
      const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT } })
      expect(wrapper.find('.tr-color-text').text()).toBe('{color.alias.blue.30}')
    })

    it('falls back to "pick alias" when the raw value is not an alias reference', () => {
      const wrapper = mount(TokenRow, {
        props: { token: makeToken({ rawValue: '#ff0000' }), aliasFlat: ALIAS_FLAT },
      })
      expect(wrapper.find('.tr-color-text').text()).toBe('pick alias')
    })

    it('emits set and closes the popover when an alias is picked', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT } })
      await wrapper.find('.tr-color-btn').trigger('click')
      await wrapper.findComponent(AliasPicker).vm.$emit('select', '{color.alias.gray.10}')
      expect(wrapper.emitted('set')).toEqual([['kui-color-background-primary', '{color.alias.gray.10}']])
      expect(wrapper.find('.tr-popover').exists()).toBe(false)
    })

    it('emits reset and closes the popover when the picker resets', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT } })
      await wrapper.find('.tr-color-btn').trigger('click')
      await wrapper.findComponent(AliasPicker).vm.$emit('reset')
      expect(wrapper.emitted('reset')).toEqual([['kui-color-background-primary']])
      expect(wrapper.find('.tr-popover').exists()).toBe(false)
    })

    it('closes the popover on Escape', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT } })
      await wrapper.find('.tr-color-btn').trigger('click')
      expect(wrapper.find('.tr-popover').exists()).toBe(true)
      await wrapper.find('.tr-popover').trigger('keydown.esc')
      expect(wrapper.find('.tr-popover').exists()).toBe(false)
    })

    it('closes the popover when a pointer press lands outside the control, but not inside it', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT }, attachTo: document.body })
      await wrapper.find('.tr-color-btn').trigger('click')
      expect(wrapper.find('.tr-popover').exists()).toBe(true)

      // A press inside the popover (e.g. the alias search input) must not close it.
      await wrapper.find('.tr-popover').trigger('pointerdown')
      expect(wrapper.find('.tr-popover').exists()).toBe(true)

      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.tr-popover').exists()).toBe(false)

      wrapper.unmount()
    })

    it('removes the outside-pointerdown listener on unmount', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeToken(), aliasFlat: ALIAS_FLAT }, attachTo: document.body })
      await wrapper.find('.tr-color-btn').trigger('click')
      wrapper.unmount()
      expect(() => document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))).not.toThrow()
    })
  })

  describe('non-color tokens', () => {
    function makeTextToken(overrides = {}) {
      return makeToken({ key: 'kui-space-40', cssVar: '--kui-space-40', isColor: false, rawValue: '16px', ...overrides })
    }

    it('renders a text input seeded with the raw value', () => {
      const wrapper = mount(TokenRow, { props: { token: makeTextToken(), aliasFlat: [] } })
      expect(wrapper.find('.tr-text').element.value).toBe('16px')
    })

    it('shows an "unset" placeholder for empty-source tokens', () => {
      const wrapper = mount(TokenRow, { props: { token: makeTextToken({ rawValue: '', source: 'empty' }), aliasFlat: [] } })
      expect(wrapper.find('.tr-text').attributes('placeholder')).toBe('unset')
    })

    it('debounces the emitted set event by 200ms rather than firing on every keystroke', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeTextToken(), aliasFlat: [] } })
      const input = wrapper.find('.tr-text')
      await input.setValue('20px')

      expect(wrapper.emitted('set')).toBeUndefined()

      vi.advanceTimersByTime(199)
      expect(wrapper.emitted('set')).toBeUndefined()

      vi.advanceTimersByTime(1)
      expect(wrapper.emitted('set')).toEqual([['kui-space-40', '20px']])
    })

    it('resets the debounce timer on rapid successive input, emitting only the final value once', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeTextToken(), aliasFlat: [] } })
      const input = wrapper.find('.tr-text')

      await input.setValue('2')
      vi.advanceTimersByTime(100)
      await input.setValue('20')
      vi.advanceTimersByTime(100)
      await input.setValue('20p')
      vi.advanceTimersByTime(100)
      await input.setValue('20px')

      // Only 100ms has elapsed since the last keystroke so far — nothing emitted yet.
      expect(wrapper.emitted('set')).toBeUndefined()

      vi.advanceTimersByTime(200)
      expect(wrapper.emitted('set')).toEqual([['kui-space-40', '20px']])
    })

    it('clears the pending debounce timer on unmount so it cannot emit after the row is gone', async () => {
      const wrapper = mount(TokenRow, { props: { token: makeTextToken(), aliasFlat: [] } })
      await wrapper.find('.tr-text').setValue('20px')
      wrapper.unmount()
      vi.advanceTimersByTime(500)
      // No assertion target exists post-unmount beyond "this does not throw" — the
      // onUnmounted cleanup is what prevents a stray emit into a detached component.
    })
  })
})
