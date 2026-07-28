// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CustTokenRow from './CustTokenRow.vue'
import type { TokenEntry } from '@/composables/useTokens'

// jsdom does not implement the global `CSS` object (CSS.supports), which CustTokenRow relies
// on for color validation. Polyfill it with a narrow, deterministic check covering exactly the
// value shapes exercised in these tests (hex/rgb/rgba/hsl + a couple of named colors).
if (typeof globalThis.CSS === 'undefined') {
  ;(globalThis as unknown as { CSS: { supports: (prop: string, value: string) => boolean } }).CSS = {
    supports: (prop: string, value: string) => {
      if (prop !== 'color') return false
      const v = value.trim()
      if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return true
      if (/^rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+\s*(,\s*[\d.]+\s*)?\)$/i.test(v)) return true
      if (/^hsla?\(/i.test(v)) return true
      return ['transparent', 'currentcolor', 'red', 'blue', 'green'].includes(v.toLowerCase())
    },
  }
}

function makeEntry(overrides: Partial<TokenEntry> = {}): TokenEntry {
  return {
    key: 'KUI_COLOR_BACKGROUND_PRIMARY',
    cssVar: '--kui-color-background-primary',
    value: '#3b82f6',
    category: 'color',
    ...overrides,
  }
}

function makeTextEntry(overrides: Partial<TokenEntry> = {}): TokenEntry {
  return {
    key: 'KUI_SPACE_40',
    cssVar: '--kui-space-40',
    value: '16px',
    category: 'space',
    ...overrides,
  }
}

describe('CustTokenRow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the CSS var name', () => {
    const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
    expect(wrapper.find('.cust-var-name').text()).toBe('--kui-color-background-primary')
  })

  it('seeds the value input from the token default when there is no override', () => {
    const wrapper = mount(CustTokenRow, { props: { entry: makeEntry({ value: '#3b82f6' }), overriddenValue: undefined } })
    expect(wrapper.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#3B82F6')
  })

  it('seeds the value input from the active override, not the default, when overridden', () => {
    const wrapper = mount(CustTokenRow, {
      props: { entry: makeEntry({ value: '#111111' }), overriddenValue: '#3a4b5c' },
    })
    expect(wrapper.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#3A4B5C')
    expect(wrapper.classes()).toContain('cust-row--modified')
  })

  it('does not show the modified class when there is no active override', () => {
    const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
    expect(wrapper.classes()).not.toContain('cust-row--modified')
  })

  // Regression test for the starting-theme staleness bug documented in
  // .claude/references/design-tokens-sandbox-and-theme-builder.md: the row is keyed by
  // entry.cssVar in CustTokenGroup, so the component instance persists across a starting-theme
  // switch. If the localValue watch only tracked overriddenValue, an un-overridden row would
  // keep showing the previous theme's value after entry.value changed underneath it.
  it('updates the displayed value when entry.value changes while overriddenValue stays unset (starting-theme switch)', async () => {
    const wrapper = mount(CustTokenRow, {
      props: { entry: makeEntry({ value: '#3b82f6' }), overriddenValue: undefined },
    })
    expect(wrapper.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#3B82F6')

    // Simulate a starting-theme switch: the token's default value changes, but this row was
    // never overridden, so overriddenValue is undefined both before and after.
    await wrapper.setProps({ entry: makeEntry({ value: '#f43f5e' }), overriddenValue: undefined })

    expect(wrapper.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#F43F5E')
  })

  it('updates the displayed value live when overriddenValue itself changes', async () => {
    const wrapper = mount(CustTokenRow, {
      props: { entry: makeEntry({ value: '#111111' }), overriddenValue: '#3a4b5c' },
    })
    expect(wrapper.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#3A4B5C')

    await wrapper.setProps({ overriddenValue: '#aabbcc' })

    expect(wrapper.find<HTMLInputElement>('.cust-value-input').element.value).toBe('#AABBCC')
  })

  describe('color swatch', () => {
    it('renders a swatch for color-named tokens', () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
      expect(wrapper.find('.cust-swatch-wrap').exists()).toBe(true)
      expect(wrapper.classes()).not.toContain('cust-row--no-swatch')
    })

    it('does not render a swatch for non-color tokens', () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry(), overriddenValue: undefined } })
      expect(wrapper.find('.cust-swatch-wrap').exists()).toBe(false)
      expect(wrapper.classes()).toContain('cust-row--no-swatch')
    })

    it('renders a native color <input> for hex values, seeded with the current value', () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry({ value: '#3b82f6' }), overriddenValue: undefined } })
      const colorInput = wrapper.find('.cust-color-input')
      expect(colorInput.exists()).toBe(true)
      expect(colorInput.attributes('value')).toBe('#3B82F6')
    })

    it('shows a checkerboard swatch and seeds the picker at #000000 for empty-default component color tokens', () => {
      const wrapper = mount(CustTokenRow, {
        props: { entry: makeEntry({ cssVar: '--kui-button-color-background', value: '' }), overriddenValue: undefined },
      })
      expect(wrapper.find('.cust-swatch').classes()).toContain('cust-swatch--transparent')
      expect(wrapper.find('.cust-color-input').attributes('value')).toBe('#000000')
    })

    it('shows a checkerboard swatch and seeds the picker at #000000 for the literal "transparent"', () => {
      const wrapper = mount(CustTokenRow, {
        props: { entry: makeEntry({ value: 'transparent' }), overriddenValue: undefined },
      })
      expect(wrapper.find('.cust-swatch').classes()).toContain('cust-swatch--transparent')
      expect(wrapper.find('.cust-color-input').attributes('value')).toBe('#000000')
    })

    it('does not render a native color input for non-hex color values (e.g. rgba/hsl), just a read-only swatch', () => {
      const wrapper = mount(CustTokenRow, {
        props: { entry: makeEntry({ value: 'rgba(59, 130, 246, 0.5)' }), overriddenValue: undefined },
      })
      expect(wrapper.find('.cust-color-input').exists()).toBe(false)
      expect(wrapper.find('.cust-swatch').classes()).toContain('cust-swatch--no-pick')
    })
  })

  describe('text input debounce (300ms)', () => {
    it('does not emit change until 300ms after the last keystroke', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('20px')

      expect(wrapper.emitted('change')).toBeUndefined()
      vi.advanceTimersByTime(299)
      expect(wrapper.emitted('change')).toBeUndefined()

      vi.advanceTimersByTime(1)
      expect(wrapper.emitted('change')).toEqual([['--kui-space-40', '20px', '16px']])
    })

    it('resets the debounce timer on rapid successive input, emitting only the final value once', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry(), overriddenValue: undefined } })
      const input = wrapper.find('.cust-value-input')

      await input.setValue('2')
      vi.advanceTimersByTime(100)
      await input.setValue('20')
      vi.advanceTimersByTime(100)
      await input.setValue('20px')

      expect(wrapper.emitted('change')).toBeUndefined()
      vi.advanceTimersByTime(300)
      expect(wrapper.emitted('change')).toEqual([['--kui-space-40', '20px', '16px']])
    })

    it('clears the pending debounce timer on unmount so it cannot emit after the row is gone', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('20px')
      wrapper.unmount()
      expect(() => vi.advanceTimersByTime(500)).not.toThrow()
    })
  })

  describe('color input normalization and validation', () => {
    it('normalizes a typed hex to canonical uppercase hex and emits it', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('#00ff00')
      vi.advanceTimersByTime(300)
      expect(wrapper.emitted('change')).toEqual([['--kui-color-background-primary', '#00FF00', '#3b82f6']])
    })

    it('normalizes rgb() input to canonical hex', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('rgb(0, 255, 0)')
      vi.advanceTimersByTime(300)
      expect(wrapper.emitted('change')).toEqual([['--kui-color-background-primary', '#00FF00', '#3b82f6']])
    })

    it('emits an empty string and shows the invalid state for an unparseable color value', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('not-a-color')
      vi.advanceTimersByTime(300)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('change')).toEqual([['--kui-color-background-primary', '', '#3b82f6']])
      expect(wrapper.classes()).toContain('cust-row--invalid')
      expect(wrapper.find('.cust-error-icon').exists()).toBe(true)
    })

    it('does not flag the invalid state while the debounce is still pending (no flicker mid-type)', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('not-a-color')
      expect(wrapper.classes()).not.toContain('cust-row--invalid')
    })

    it('shows the invalid state immediately when clearing an overridden value to empty', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry(), overriddenValue: '20px' } })
      await wrapper.find('.cust-value-input').setValue('')
      vi.advanceTimersByTime(300)
      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('cust-row--invalid')
    })

    it('keeps a valid non-hex color (e.g. a named color) as-typed rather than converting it', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('red')
      vi.advanceTimersByTime(300)
      expect(wrapper.emitted('change')).toEqual([['--kui-color-background-primary', 'red', '#3b82f6']])
    })
  })

  describe('native color picker input (80ms debounce)', () => {
    it('emits the uppercased picker value after 80ms', () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry(), overriddenValue: undefined } })
      const picker = wrapper.find<HTMLInputElement>('.cust-color-input')
      picker.element.value = '#00ff00'
      picker.trigger('input')

      expect(wrapper.emitted('change')).toBeUndefined()
      vi.advanceTimersByTime(79)
      expect(wrapper.emitted('change')).toBeUndefined()
      vi.advanceTimersByTime(1)
      expect(wrapper.emitted('change')).toEqual([['--kui-color-background-primary', '#00FF00', '#3b82f6']])
    })
  })

  describe('reset', () => {
    it('hides the reset button when not overridden and the value matches the default', () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry({ value: '#3b82f6' }), overriddenValue: undefined } })
      expect(wrapper.find('.cust-reset-btn').attributes('style')).toContain('visibility: hidden')
    })

    it('shows the reset button when overridden', () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeEntry({ value: '#3b82f6' }), overriddenValue: '#000000' } })
      expect(wrapper.find('.cust-reset-btn').attributes('style')).toContain('visibility: visible')
    })

    it('shows the reset button once the local (unsaved) value diverges from the default, even before it is overridden', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry(), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('20px')
      expect(wrapper.find('.cust-reset-btn').attributes('style')).toContain('visibility: visible')
    })

    it('emits reset with the cssVar and default value, and immediately restores the default (no debounce wait)', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry({ value: '16px' }), overriddenValue: '20px' } })
      await wrapper.find('.cust-reset-btn').trigger('click')

      expect(wrapper.emitted('reset')).toEqual([['--kui-space-40', '16px']])
      expect(wrapper.find<HTMLInputElement>('.cust-value-input').element.value).toBe('16px')
    })

    it('clears any pending debounced change on reset so a stale emit cannot follow', async () => {
      const wrapper = mount(CustTokenRow, { props: { entry: makeTextEntry({ value: '16px' }), overriddenValue: undefined } })
      await wrapper.find('.cust-value-input').setValue('999px')
      await wrapper.find('.cust-reset-btn').trigger('click')
      vi.advanceTimersByTime(500)

      expect(wrapper.emitted('change')).toBeUndefined()
      expect(wrapper.emitted('reset')).toEqual([['--kui-space-40', '16px']])
    })
  })
})
