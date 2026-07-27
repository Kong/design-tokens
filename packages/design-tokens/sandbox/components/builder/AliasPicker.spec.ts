// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AliasPicker from './AliasPicker.vue'

const ALIAS_FLAT = [
  { key: 'blue.30', family: 'blue', step: '30', baseHex: '#3B82F6' },
  { key: 'blue.50', family: 'blue', step: '50', baseHex: '#1D4ED8' },
  { key: 'gray.10', family: 'gray', step: '10', baseHex: '#F3F4F6' },
  { key: 'black', family: 'black', step: null, baseHex: '#000000' },
]

describe('AliasPicker', () => {
  it('renders one swatch per flattened alias entry', () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    expect(wrapper.findAll('.ap-item')).toHaveLength(ALIAS_FLAT.length)
  })

  it('filters entries by key as the user types', async () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.ap-search').setValue('blue')
    const labels = wrapper.findAll('.ap-label').map((l) => l.text())
    expect(labels).toEqual(['blue.30', 'blue.50'])
  })

  it('filters entries by hex value as well as by key', async () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.ap-search').setValue('f3f4f6')
    const labels = wrapper.findAll('.ap-label').map((l) => l.text())
    expect(labels).toEqual(['gray.10'])
  })

  it('search is case-insensitive', async () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.ap-search').setValue('BLUE')
    expect(wrapper.findAll('.ap-item')).toHaveLength(2)
  })

  it('shows every entry again once the search is cleared', async () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.ap-search').setValue('blue')
    await wrapper.find('.ap-search').setValue('')
    expect(wrapper.findAll('.ap-item')).toHaveLength(ALIAS_FLAT.length)
  })

  it('highlights the entry matching selectedKey', () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT, selectedKey: 'blue.50' } })
    const items = wrapper.findAll('.ap-item')
    const selected = items.filter((i) => i.classes().includes('ap-item--selected'))
    expect(selected).toHaveLength(1)
    expect(selected[0].find('.ap-label').text()).toBe('blue.50')
  })

  it('emits select with a family.step alias ref when a stepped entry is clicked', async () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    await wrapper.findAll('.ap-item')[0].trigger('click')
    expect(wrapper.emitted('select')).toEqual([['{color.alias.blue.30}']])
  })

  it('emits select with a family-only alias ref for a stepless (singleton) entry', async () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    const blackItem = wrapper.findAll('.ap-item').find((i) => i.find('.ap-label').text() === 'black')
    await blackItem.trigger('click')
    expect(wrapper.emitted('select')).toEqual([['{color.alias.black}']])
  })

  it('emits reset when the reset button is clicked', async () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.ap-reset').trigger('click')
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('renders no swatches, without error, for an empty alias list', () => {
    const wrapper = mount(AliasPicker, { props: { aliasFlat: [] } })
    expect(wrapper.findAll('.ap-item')).toHaveLength(0)
  })
})
