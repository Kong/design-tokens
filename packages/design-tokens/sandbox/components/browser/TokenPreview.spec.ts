// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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

describe('TokenPreview', () => {
  it('applies the category-specific root class', () => {
    const wrapper = mount(TokenPreview, { props: { token: makeToken({ category: 'space' }) } })
    expect(wrapper.classes()).toContain('token-preview--space')
  })

  describe('color category', () => {
    it('renders a swatch with the token value as background and no other category markup', () => {
      const wrapper = mount(TokenPreview, { props: { token: makeToken() } })
      expect(wrapper.find('.preview-color-swatch').attributes('style')).toContain('rgb(59, 130, 246)')
      expect(wrapper.find('.preview-bar-wrap').exists()).toBe(false)
    })
  })

  describe('space category', () => {
    it('renders a proportional bar width scaled to the 96px reference', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'space', value: '48px', key: 'KUI_SPACE_80', cssVar: '--kui-space-80' }) },
      })
      const bar = wrapper.find('.space-bar')
      expect(bar.attributes('style')).toContain('width: 50%')
      expect(wrapper.find('.bar-value').text()).toBe('48px')
    })

    it('clamps bar width to 100% when the value exceeds the 96px reference', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'space', value: '200px' }) },
      })
      expect(wrapper.find('.space-bar').attributes('style')).toContain('width: 100%')
    })

    it('renders the auto variant (striped, full width) when the value is "auto"', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'space', value: 'auto' }) },
      })
      const bar = wrapper.find('.space-bar')
      expect(bar.classes()).toContain('space-bar--auto')
      // The auto variant has no inline width style bound (CSS handles it via !important).
      expect(bar.attributes('style')).toBeUndefined()
    })

    it('falls back to 0% width for a non-numeric value', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'space', value: 'not-a-number' }) },
      })
      expect(wrapper.find('.space-bar').attributes('style')).toContain('width: 0%')
    })
  })

  describe('shadow category', () => {
    it('renders a demo box with the token value applied as box-shadow', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'shadow', value: '0 1px 2px rgba(0,0,0,0.5)' }) },
      })
      expect(wrapper.find('.shadow-demo-box').attributes('style')).toContain('box-shadow')
    })
  })

  describe('border category', () => {
    it('renders the radius demo when the key third segment is RADIUS', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'border', key: 'KUI_BORDER_RADIUS_30', cssVar: '--kui-border-radius-30', value: '8px' }) },
      })
      expect(wrapper.find('.border-radius-demo').exists()).toBe(true)
      expect(wrapper.find('.border-radius-demo').attributes('style')).toContain('border-radius: 8px')
      expect(wrapper.find('.border-width-demo').exists()).toBe(false)
    })

    it('renders the width demo when the key third segment is not RADIUS', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'border', key: 'KUI_BORDER_WIDTH_10', cssVar: '--kui-border-width-10', value: '2px' }) },
      })
      expect(wrapper.find('.border-width-demo').exists()).toBe(true)
      expect(wrapper.find('.border-width-demo').attributes('style')).toContain('height: 2px')
      expect(wrapper.find('.border-radius-demo').exists()).toBe(false)
    })
  })

  describe('font category', () => {
    it('renders the family sample with fontFamily applied when third segment is FAMILY', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'font', key: 'KUI_FONT_FAMILY_TEXT', cssVar: '--kui-font-family-text', value: 'Arial' }) },
      })
      const sample = wrapper.find('.font-sample')
      expect(sample.text()).toBe('Ag')
      expect(sample.attributes('style')).toContain('font-family: Arial')
    })

    it('renders the size sample capped at 44px when third segment is SIZE', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'font', key: 'KUI_FONT_SIZE_60', cssVar: '--kui-font-size-60', value: '80px' }) },
      })
      const sample = wrapper.find('.font-sample')
      expect(sample.text()).toBe('Ag')
      expect(sample.attributes('style')).toContain('font-size: 44px')
    })

    it('renders the weight sample with fontWeight applied when third segment is WEIGHT', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'font', key: 'KUI_FONT_WEIGHT_BOLD', cssVar: '--kui-font-weight-bold', value: '700' }) },
      })
      const sample = wrapper.find('.font-sample')
      expect(sample.text()).toBe('Kong')
      expect(sample.attributes('style')).toContain('font-weight: 700')
    })

    it('renders no sample for an unrecognized font sub-type', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'font', key: 'KUI_FONT_LETTER_X', cssVar: '--kui-font-letter-x', value: 'x' }) },
      })
      expect(wrapper.find('.font-sample').exists()).toBe(false)
    })
  })

  describe('letter-spacing category', () => {
    it('applies the value as letterSpacing style', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'letter-spacing', value: '0.5px' }) },
      })
      expect(wrapper.find('.preview-letter-spacing span').attributes('style')).toContain('letter-spacing: 0.5px')
      expect(wrapper.find('.preview-letter-spacing span').text()).toBe('Letters')
    })
  })

  describe('line-height category', () => {
    it('applies the value as lineHeight style on the wrapping element', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'line-height', value: '1.5' }) },
      })
      expect(wrapper.find('.preview-line-height').attributes('style')).toContain('line-height: 1.5')
    })
  })

  describe('breakpoint category', () => {
    it('renders a proportional bar width scaled to the 1920px reference', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'breakpoint', value: '960px' }) },
      })
      expect(wrapper.find('.breakpoint-bar').attributes('style')).toContain('width: 50%')
      expect(wrapper.find('.bar-value').text()).toBe('960px')
    })

    it('falls back to 100% width for a non-numeric value', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'breakpoint', value: 'unset' }) },
      })
      expect(wrapper.find('.breakpoint-bar').attributes('style')).toContain('width: 100%')
    })
  })

  describe('components category', () => {
    it('renders the border-width demo when the key indicates BORDER WIDTH', () => {
      const wrapper = mount(TokenPreview, {
        props: {
          token: makeToken({
            category: 'components',
            key: 'KUI_BUTTON_BORDER_WIDTH_10',
            cssVar: '--kui-button-border-width-10',
            value: '1px',
            subcategory: 'button',
          }),
        },
      })
      expect(wrapper.find('.border-width-demo').exists()).toBe(true)
      expect(wrapper.find('.border-width-demo').attributes('style')).toContain('height: 1px')
    })

    it('renders a small color swatch when the value looks like a color', () => {
      const wrapper = mount(TokenPreview, {
        props: {
          token: makeToken({
            category: 'components',
            key: 'KUI_BUTTON_COLOR_BACKGROUND_PRIMARY',
            cssVar: '--kui-button-color-background-primary',
            value: '#ff0000',
            subcategory: 'button',
          }),
        },
      })
      expect(wrapper.find('.preview-swatch-sm').exists()).toBe(true)
      expect(wrapper.find('.preview-swatch-sm').attributes('style')).toContain('rgb(255, 0, 0)')
      expect(wrapper.find('.value-badge').exists()).toBe(false)
    })

    it('recognizes rgb/rgba/hsl color values in addition to hex', () => {
      const wrapper = mount(TokenPreview, {
        props: {
          token: makeToken({
            category: 'components',
            key: 'KUI_BUTTON_COLOR_BACKGROUND_PRIMARY',
            cssVar: '--kui-button-color-background-primary',
            value: 'rgba(0, 0, 0, 0.5)',
            subcategory: 'button',
          }),
        },
      })
      expect(wrapper.find('.preview-swatch-sm').exists()).toBe(true)
    })

    it('renders a value badge for a non-color, non-border-width component token', () => {
      const wrapper = mount(TokenPreview, {
        props: {
          token: makeToken({
            category: 'components',
            key: 'KUI_BUTTON_BORDER_RADIUS_10',
            cssVar: '--kui-button-border-radius-10',
            value: '4px',
            subcategory: 'button',
          }),
        },
      })
      expect(wrapper.find('.value-badge').exists()).toBe(true)
      expect(wrapper.find('.value-badge').text()).toBe('4px')
      expect(wrapper.find('.preview-swatch-sm').exists()).toBe(false)
      expect(wrapper.find('.border-width-demo').exists()).toBe(false)
    })
  })

  describe('unrecognized category fallback', () => {
    it('renders a value badge for a category with no dedicated branch', () => {
      const wrapper = mount(TokenPreview, {
        props: { token: makeToken({ category: 'animation', value: '200ms' }) },
      })
      expect(wrapper.find('.value-badge').exists()).toBe(true)
      expect(wrapper.find('.value-badge').text()).toBe('200ms')
    })
  })
})
