// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PalettePanel from './PalettePanel.vue'
import ColorEditor from './ColorEditor.vue'

const ALIAS_FLAT = [
  { family: 'blue', step: '30', key: 'blue.30', baseHex: '#3B82F6' },
  { family: 'blue', step: '50', key: 'blue.50', baseHex: '#1D4ED8' },
  { family: 'gray', step: '10', key: 'gray.10', baseHex: '#F3F4F6' },
  { family: 'black', step: null, key: 'black', baseHex: '#000000' },
]

function makeProps(overrides = {}) {
  return {
    aliasFlat: ALIAS_FLAT,
    aliasOverrides: {},
    ...overrides,
  }
}

describe('PalettePanel', () => {
  it('groups chips into one family section per distinct family, in encounter order', () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    const names = wrapper.findAll('.pp-family-name').map((n) => n.text())
    expect(names).toEqual(['blue', 'gray', 'black'])
  })

  it('renders one chip per alias entry', () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    expect(wrapper.findAll('.pp-chip')).toHaveLength(ALIAS_FLAT.length)
  })

  it('renders no family sections, without error, for an empty alias list', () => {
    const wrapper = mount(PalettePanel, { props: makeProps({ aliasFlat: [] }) })
    expect(wrapper.findAll('.pp-family')).toHaveLength(0)
    expect(wrapper.findAll('.pp-chip')).toHaveLength(0)
  })

  it('shows the step label for stepped entries and the family name for singletons', () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    const steps = wrapper.findAll('.pp-step').map((s) => s.text())
    expect(steps).toEqual(['30', '50', '10', 'black'])
  })

  it('uses the override hex for the swatch background when overridden, else the base hex', () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }),
    })
    const swatches = wrapper.findAll('.pp-swatch')
    expect(swatches[0].attributes('style')).toContain('background: rgb(255, 0, 0)')
    expect(swatches[1].attributes('style')).toContain('background: rgb(29, 78, 216)')
  })

  it('marks only overridden swatches with the modified class', () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }),
    })
    const swatches = wrapper.findAll('.pp-swatch')
    expect(swatches[0].classes()).toContain('pp-swatch--modified')
    expect(swatches[1].classes()).not.toContain('pp-swatch--modified')
  })

  it('only shows the per-chip reset button for overridden entries', () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }),
    })
    const wraps = wrapper.findAll('.pp-chip-wrap')
    expect(wraps[0].find('.pp-reset-btn').exists()).toBe(true)
    expect(wraps[1].find('.pp-reset-btn').exists()).toBe(false)
  })

  it('emits change with an empty string when the per-chip reset button is clicked', async () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }),
    })
    await wrapper.findAll('.pp-chip-wrap')[0].find('.pp-reset-btn').trigger('click')
    expect(wrapper.emitted('change')).toEqual([['blue.30', '']])
  })

  it('opens the ColorEditor for a chip on click, and only for that chip', async () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    expect(wrapper.findComponent(ColorEditor).exists()).toBe(false)

    await wrapper.findAll('.pp-chip')[0].trigger('click')
    expect(wrapper.findAllComponents(ColorEditor)).toHaveLength(1)
  })

  it('toggles the editor closed when clicking the same chip again', async () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    await wrapper.findAll('.pp-chip')[0].trigger('click')
    expect(wrapper.findComponent(ColorEditor).exists()).toBe(true)
    await wrapper.findAll('.pp-chip')[0].trigger('click')
    expect(wrapper.findComponent(ColorEditor).exists()).toBe(false)
  })

  it('closes the editor when it emits close', async () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    await wrapper.findAll('.pp-chip')[0].trigger('click')
    await wrapper.findComponent(ColorEditor).vm.$emit('close')
    expect(wrapper.findComponent(ColorEditor).exists()).toBe(false)
  })

  it('emits change with the key and new hex when the editor emits update:modelValue', async () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    await wrapper.findAll('.pp-chip')[0].trigger('click')
    await wrapper.findComponent(ColorEditor).vm.$emit('update:modelValue', '#00FF00')
    expect(wrapper.emitted('change')).toEqual([['blue.30', '#00FF00']])
  })

  it('filters entries by search text across family/step/key', async () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    await wrapper.find('.pp-search').setValue('blue')
    const names = wrapper.findAll('.pp-family-name').map((n) => n.text())
    expect(names).toEqual(['blue'])
    expect(wrapper.findAll('.pp-chip')).toHaveLength(2)
  })

  it('shows no family sections when the search matches nothing', async () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    await wrapper.find('.pp-search').setValue('nonexistent-color')
    expect(wrapper.findAll('.pp-family')).toHaveLength(0)
  })

  it('the modified-only toggle is disabled when there are no overrides', () => {
    const wrapper = mount(PalettePanel, { props: makeProps() })
    expect(wrapper.find('.pp-modified-btn').attributes('disabled')).toBeDefined()
  })

  it('the modified-only toggle is enabled once there is at least one override', () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }),
    })
    expect(wrapper.find('.pp-modified-btn').attributes('disabled')).toBeUndefined()
  })

  it('shows the override count in the modified-only toggle label', () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000', 'gray.10': '#111111' } }),
    })
    expect(wrapper.find('.pp-modified-btn').text()).toBe('Show modified (2)')
  })

  it('restricts the visible entries to overridden ones when modified-only is active', async () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }),
    })
    await wrapper.find('.pp-modified-btn').trigger('click')
    expect(wrapper.findAll('.pp-chip')).toHaveLength(1)
    expect(wrapper.find('.pp-modified-btn').text()).toBe('✕ Modified only (1)')
    expect(wrapper.find('.pp-modified-btn').attributes('aria-pressed')).toBe('true')
  })

  it('shows all entries again when modified-only is toggled back off', async () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }),
    })
    await wrapper.find('.pp-modified-btn').trigger('click')
    await wrapper.find('.pp-modified-btn').trigger('click')
    expect(wrapper.findAll('.pp-chip')).toHaveLength(ALIAS_FLAT.length)
  })

  it('combines search and modified-only filters (both must match)', async () => {
    const wrapper = mount(PalettePanel, {
      props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000', 'gray.10': '#111111' } }),
    })
    await wrapper.find('.pp-modified-btn').trigger('click')
    await wrapper.find('.pp-search').setValue('gray')
    const labels = wrapper.findAll('.pp-step').map((s) => s.text())
    expect(labels).toEqual(['10'])
  })

  describe('clear-filter button', () => {
    it('is hidden when the filter is empty, and clears the filter when clicked', async () => {
      const wrapper = mount(PalettePanel, { props: makeProps() })
      expect(wrapper.find('.pp-search-clear').exists()).toBe(false)

      const input = wrapper.find<HTMLInputElement>('.pp-search')
      await input.setValue('blue')
      expect(wrapper.find('.pp-search-clear').exists()).toBe(true)

      await wrapper.find('.pp-search-clear').trigger('click')
      expect(input.element.value).toBe('')
      expect(wrapper.find('.pp-search-clear').exists()).toBe(false)
    })
  })

  describe('reset-all button', () => {
    let confirmSpy: ReturnType<typeof vi.spyOn>

    afterEach(() => {
      confirmSpy?.mockRestore()
    })

    it('is not shown when there are no overrides', () => {
      const wrapper = mount(PalettePanel, { props: makeProps() })
      expect(wrapper.find('.pp-reset-all-btn').exists()).toBe(false)
    })

    it('asks for confirmation and emits resetAll when confirmed', async () => {
      confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      const wrapper = mount(PalettePanel, { props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }) })

      await wrapper.find('.pp-reset-all-btn').trigger('click')

      expect(confirmSpy).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('resetAll')).toEqual([[]])
    })

    it('does not emit resetAll when the confirmation is declined', async () => {
      confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      const wrapper = mount(PalettePanel, { props: makeProps({ aliasOverrides: { 'blue.30': '#FF0000' } }) })

      await wrapper.find('.pp-reset-all-btn').trigger('click')

      expect(wrapper.emitted('resetAll')).toBeUndefined()
    })
  })
})
