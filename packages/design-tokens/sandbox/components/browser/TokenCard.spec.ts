// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TokenCard from './TokenCard.vue'
import TokenPreview from './TokenPreview.vue'
import type { TokenEntry } from '@/composables/useTokens'

function makeToken(overrides: Partial<TokenEntry> = {}): TokenEntry {
  return {
    key: 'KUI_COLOR_BACKGROUND_PRIMARY',
    cssVar: '--kui-color-background-primary',
    value: '#3B82F6',
    category: 'color',
    ...overrides,
  }
}

describe('TokenCard', () => {
  it('renders the display name and value', () => {
    const wrapper = mount(TokenCard, {
      props: { token: makeToken(), copyFormat: 'css', isCopied: false },
    })
    expect(wrapper.find('.card-token-name').text()).toBe('kui-color-background-primary')
    expect(wrapper.find('.card-token-value').text()).toBe('#3B82F6')
  })

  it('applies the category class', () => {
    const wrapper = mount(TokenCard, {
      props: { token: makeToken({ category: 'space' }), copyFormat: 'css', isCopied: false },
    })
    expect(wrapper.classes()).toContain('token-card--space')
  })

  it('renders the color aura only for color-category tokens', () => {
    const color = mount(TokenCard, {
      props: { token: makeToken({ category: 'color' }), copyFormat: 'css', isCopied: false },
    })
    expect(color.find('.card-color-aura').exists()).toBe(true)
    expect(color.find('.card-color-aura').attributes('style')).toContain('background: rgb(59, 130, 246)')

    const nonColor = mount(TokenCard, {
      props: { token: makeToken({ category: 'space', value: '16px' }), copyFormat: 'css', isCopied: false },
    })
    expect(nonColor.find('.card-color-aura').exists()).toBe(false)
  })

  it('renders a TokenPreview with the token prop forwarded', () => {
    const token = makeToken()
    const wrapper = mount(TokenCard, {
      props: { token, copyFormat: 'css', isCopied: false },
    })
    const preview = wrapper.findComponent(TokenPreview)
    expect(preview.exists()).toBe(true)
    expect(preview.props('token')).toEqual(token)
  })

  describe('copied state', () => {
    it('does not show the copied class or checkmark when isCopied is false', () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'css', isCopied: false },
      })
      expect(wrapper.classes()).not.toContain('token-card--copied')
      expect(wrapper.find('.card-copy-indicator svg').exists()).toBe(true)
      expect(wrapper.find('.card-copy-indicator').text()).not.toContain('✓')
    })

    it('shows the copied class and checkmark, hiding the svg icon, when isCopied is true', () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'css', isCopied: true },
      })
      expect(wrapper.classes()).toContain('token-card--copied')
      expect(wrapper.find('.card-copy-indicator').text()).toContain('✓')
      expect(wrapper.find('.card-copy-indicator svg').exists()).toBe(false)
    })
  })

  describe('copy format text and tooltip', () => {
    it('formats css copy text as a var() reference', () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'css', isCopied: false },
      })
      expect(wrapper.attributes('title')).toBe('Click to copy: var(--kui-color-background-primary)')
    })

    it('formats sass copy text as a $ variable', () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'sass', isCopied: false },
      })
      expect(wrapper.attributes('title')).toBe('Click to copy: $kui-color-background-primary')
    })

    it('formats js copy text as the screaming-snake-case key', () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'js', isCopied: false },
      })
      expect(wrapper.attributes('title')).toBe('Click to copy: KUI_COLOR_BACKGROUND_PRIMARY')
    })
  })

  describe('copy emit', () => {
    it('emits copy with the key and css-formatted text on click', async () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'css', isCopied: false },
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('copy')).toEqual([
        ['KUI_COLOR_BACKGROUND_PRIMARY', 'var(--kui-color-background-primary)'],
      ])
    })

    it('emits copy with the sass-formatted text when copyFormat is sass', async () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'sass', isCopied: false },
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('copy')).toEqual([
        ['KUI_COLOR_BACKGROUND_PRIMARY', '$kui-color-background-primary'],
      ])
    })

    it('emits copy with the js-formatted text (raw key) when copyFormat is js', async () => {
      const wrapper = mount(TokenCard, {
        props: { token: makeToken(), copyFormat: 'js', isCopied: false },
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('copy')).toEqual([
        ['KUI_COLOR_BACKGROUND_PRIMARY', 'KUI_COLOR_BACKGROUND_PRIMARY'],
      ])
    })
  })
})
