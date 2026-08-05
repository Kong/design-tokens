// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SandboxTabs from './SandboxTabs.vue'

const TABS = [
  { id: 'aliases', label: 'Color aliases' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'export', label: 'Export' },
]

describe('SandboxTabs', () => {
  it('renders one button per tab with its label', () => {
    const wrapper = mount(SandboxTabs, { props: { tabs: TABS, modelValue: 'aliases' } })
    const buttons = wrapper.findAll('.st-tab')
    expect(buttons).toHaveLength(3)
    expect(buttons.map((b) => b.text())).toEqual(['Color aliases', 'Tokens', 'Export'])
  })

  it('marks only the tab matching modelValue as active', () => {
    const wrapper = mount(SandboxTabs, { props: { tabs: TABS, modelValue: 'tokens' } })
    const buttons = wrapper.findAll('.st-tab')
    expect(buttons[0].classes()).not.toContain('st-tab--active')
    expect(buttons[1].classes()).toContain('st-tab--active')
    expect(buttons[1].attributes('aria-selected')).toBe('true')
    expect(buttons[0].attributes('aria-selected')).toBe('false')
  })

  it('emits update:modelValue with the clicked tab id', async () => {
    const wrapper = mount(SandboxTabs, { props: { tabs: TABS, modelValue: 'aliases' } })
    await wrapper.findAll('.st-tab')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['export']])
  })

  it('re-renders the active tab reactively when modelValue prop changes', async () => {
    const wrapper = mount(SandboxTabs, { props: { tabs: TABS, modelValue: 'aliases' } })
    await wrapper.setProps({ modelValue: 'export' })
    expect(wrapper.findAll('.st-tab')[2].classes()).toContain('st-tab--active')
  })

  describe('modified dot', () => {
    it('does not render a dot for a tab with modified unset or false', () => {
      const wrapper = mount(SandboxTabs, { props: { tabs: TABS, modelValue: 'aliases' } })
      expect(wrapper.find('.st-tab-dot-wrap').exists()).toBe(false)
    })

    it('renders a dot with a tooltip for a tab flagged as modified', () => {
      const tabs = [
        { id: 'aliases', label: 'Color aliases', modified: true, modifiedTooltip: 'Custom tooltip text.' },
        { id: 'tokens', label: 'Tokens' },
      ]
      const wrapper = mount(SandboxTabs, { props: { tabs, modelValue: 'aliases' } })
      const buttons = wrapper.findAll('.st-tab')
      expect(buttons[0].find('.st-tab-dot').exists()).toBe(true)
      expect(buttons[0].find('.st-tab-dot-tooltip').text()).toBe('Custom tooltip text.')
      // The dot itself is decorative/non-focusable; the accessible name lives on the tab
      // button, so keyboard/screen-reader users get the "modified" status without an extra
      // focus stop per tab.
      expect(buttons[0].attributes('aria-label')).toBe('Color aliases — Custom tooltip text.')
      expect(buttons[1].find('.st-tab-dot').exists()).toBe(false)
      expect(buttons[1].attributes('aria-label')).toBeUndefined()
    })

    it('falls back to a generic "Modified" tooltip when modifiedTooltip is omitted', () => {
      const tabs = [{ id: 'aliases', label: 'Color aliases', modified: true }]
      const wrapper = mount(SandboxTabs, { props: { tabs, modelValue: 'aliases' } })
      expect(wrapper.find('.st-tab-dot-tooltip').text()).toBe('Modified')
    })
  })

  describe('disabled tab', () => {
    it('sets the native disabled attribute and a disabled class on a disabled tab, but not on others', () => {
      const tabs = [
        { id: 'aliases', label: 'Color aliases', disabled: true },
        { id: 'tokens', label: 'Tokens' },
      ]
      const wrapper = mount(SandboxTabs, { props: { tabs, modelValue: 'tokens' } })
      const buttons = wrapper.findAll('.st-tab')
      expect(buttons[0].attributes('disabled')).toBeDefined()
      expect(buttons[0].classes()).toContain('st-tab--disabled')
      expect(buttons[1].attributes('disabled')).toBeUndefined()
      expect(buttons[1].classes()).not.toContain('st-tab--disabled')
    })

    it('does not emit update:modelValue when a disabled tab is clicked', async () => {
      const tabs = [
        { id: 'aliases', label: 'Color aliases', disabled: true },
        { id: 'tokens', label: 'Tokens' },
      ]
      const wrapper = mount(SandboxTabs, { props: { tabs, modelValue: 'tokens' } })
      await wrapper.findAll('.st-tab')[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
