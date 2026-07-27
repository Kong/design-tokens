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
})
