// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CustTokenGroup from './CustTokenGroup.vue'
import CustTokenRow from './CustTokenRow.vue'
import type { CustGroup } from '@/composables/useTokenCustomizer'
import type { TokenEntry } from '@/composables/useTokens'

// jsdom does not implement the global `CSS` object; CustTokenRow (rendered by this component)
// relies on CSS.supports for color validation. Polyfill it narrowly for the hex values used below.
if (typeof globalThis.CSS === 'undefined') {
  ;(globalThis as unknown as { CSS: { supports: (prop: string, value: string) => boolean } }).CSS = {
    supports: (prop: string, value: string) => prop === 'color' && /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim()),
  }
}

/** A flat (non-sectioned) category — 'space' has no second key segment to section by. */
function makeFlatGroup(overrides: Partial<CustGroup> = {}): CustGroup {
  const entries: TokenEntry[] = [
    { key: 'KUI_SPACE_10', cssVar: '--kui-space-10', value: '4px', category: 'space' },
    { key: 'KUI_SPACE_20', cssVar: '--kui-space-20', value: '8px', category: 'space' },
  ]
  return { category: 'space', entries, overrideCount: 0, ...overrides }
}

/** 'color' is a sectioned category — two distinct second-key-segments produce two sections. */
function makeSectionedGroup(overrides: Partial<CustGroup> = {}): CustGroup {
  const entries: TokenEntry[] = [
    { key: 'KUI_COLOR_BACKGROUND_PRIMARY', cssVar: '--kui-color-background-primary', value: '#3b82f6', category: 'color' },
    { key: 'KUI_COLOR_BACKGROUND_SECONDARY', cssVar: '--kui-color-background-secondary', value: '#6b7280', category: 'color' },
    { key: 'KUI_COLOR_BORDER_PRIMARY', cssVar: '--kui-color-border-primary', value: '#111111', category: 'color' },
  ]
  return { category: 'color', entries, overrideCount: 0, ...overrides }
}

describe('CustTokenGroup', () => {
  it('renders the category label and entry count in the header', () => {
    const wrapper = mount(CustTokenGroup, { props: { group: makeFlatGroup(), isCollapsed: false, overrides: {} } })
    expect(wrapper.find('.group-label').text()).toBe('Space')
    expect(wrapper.find('.group-count').text()).toBe('2')
  })

  it('does not show the modified badge when overrideCount is 0', () => {
    const wrapper = mount(CustTokenGroup, { props: { group: makeFlatGroup({ overrideCount: 0 }), isCollapsed: false, overrides: {} } })
    expect(wrapper.find('.group-modified-badge').exists()).toBe(false)
  })

  it('shows the modified badge with the override count when overrideCount > 0', () => {
    const wrapper = mount(CustTokenGroup, { props: { group: makeFlatGroup({ overrideCount: 1 }), isCollapsed: false, overrides: {} } })
    expect(wrapper.find('.group-modified-badge').text()).toBe('1 modified')
  })

  it('reflects isCollapsed in aria-expanded and body visibility', async () => {
    const wrapper = mount(CustTokenGroup, { props: { group: makeFlatGroup(), isCollapsed: false, overrides: {} } })
    expect(wrapper.find('.cust-group-header').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.cust-group-body').attributes('style')).toBeUndefined()

    await wrapper.setProps({ isCollapsed: true })
    expect(wrapper.find('.cust-group-header').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.cust-group-body').attributes('style')).toContain('display: none')
  })

  it('applies the open chevron class only when expanded', async () => {
    const wrapper = mount(CustTokenGroup, { props: { group: makeFlatGroup(), isCollapsed: true, overrides: {} } })
    expect(wrapper.find('.group-chevron').classes()).not.toContain('group-chevron--open')
    await wrapper.setProps({ isCollapsed: false })
    expect(wrapper.find('.group-chevron').classes()).toContain('group-chevron--open')
  })

  it('emits toggle with the category key when the header is clicked', async () => {
    const wrapper = mount(CustTokenGroup, { props: { group: makeFlatGroup(), isCollapsed: false, overrides: {} } })
    await wrapper.find('.cust-group-header').trigger('click')
    expect(wrapper.emitted('toggle')).toEqual([['space']])
  })

  describe('flat (non-sectioned) categories', () => {
    it('renders one CustTokenRow per entry, with no subsection headers', () => {
      const group = makeFlatGroup()
      const wrapper = mount(CustTokenGroup, { props: { group, isCollapsed: false, overrides: {} } })
      expect(wrapper.find('.cust-subsection-header').exists()).toBe(false)
      expect(wrapper.findAllComponents(CustTokenRow)).toHaveLength(2)
    })

    it('passes each entry and its resolved override value down to the matching row', () => {
      const group = makeFlatGroup()
      const overrides = { '--kui-space-10': '6px' }
      const wrapper = mount(CustTokenGroup, { props: { group, isCollapsed: false, overrides } })
      const rows = wrapper.findAllComponents(CustTokenRow)

      expect(rows[0].props('entry')).toEqual(group.entries[0])
      expect(rows[0].props('overriddenValue')).toBe('6px')
      expect(rows[1].props('entry')).toEqual(group.entries[1])
      expect(rows[1].props('overriddenValue')).toBeUndefined()
    })

    it('forwards a row change event as a group change event, unchanged', () => {
      const group = makeFlatGroup()
      const wrapper = mount(CustTokenGroup, { props: { group, isCollapsed: false, overrides: {} } })
      wrapper.findAllComponents(CustTokenRow)[0].vm.$emit('change', '--kui-space-10', '6px', '4px')
      expect(wrapper.emitted('change')).toEqual([['--kui-space-10', '6px', '4px']])
    })

    it('forwards a row reset event as a group reset event, unchanged', () => {
      const group = makeFlatGroup()
      const wrapper = mount(CustTokenGroup, { props: { group, isCollapsed: false, overrides: {} } })
      wrapper.findAllComponents(CustTokenRow)[1].vm.$emit('reset', '--kui-space-20', '8px')
      expect(wrapper.emitted('reset')).toEqual([['--kui-space-20', '8px']])
    })
  })

  describe('sectioned categories', () => {
    it('renders a subsection header per distinct section and groups rows underneath it', () => {
      const group = makeSectionedGroup()
      const wrapper = mount(CustTokenGroup, { props: { group, isCollapsed: false, overrides: {} } })

      const headers = wrapper.findAll('.cust-subsection-header').map((h) => h.text())
      expect(headers).toEqual(['background', 'border'])
      expect(wrapper.findAllComponents(CustTokenRow)).toHaveLength(3)

      const subsections = wrapper.findAll('.cust-subsection')
      expect(subsections).toHaveLength(2)
      expect(subsections[0].findAllComponents(CustTokenRow)).toHaveLength(2)
      expect(subsections[1].findAllComponents(CustTokenRow)).toHaveLength(1)
    })

    it('still forwards change/reset events from rows nested inside a subsection', () => {
      const group = makeSectionedGroup()
      const wrapper = mount(CustTokenGroup, { props: { group, isCollapsed: false, overrides: {} } })
      const borderRow = wrapper.findAllComponents(CustTokenRow)[2]
      borderRow.vm.$emit('change', '--kui-color-border-primary', '#222222', '#111111')
      expect(wrapper.emitted('change')).toEqual([['--kui-color-border-primary', '#222222', '#111111']])
    })

    it('passes overrides through to rows inside subsections', () => {
      const group = makeSectionedGroup()
      const overrides = { '--kui-color-border-primary': '#999999' }
      const wrapper = mount(CustTokenGroup, { props: { group, isCollapsed: false, overrides } })
      const borderRow = wrapper.findAllComponents(CustTokenRow)[2]
      expect(borderRow.props('overriddenValue')).toBe('#999999')
    })
  })
})
