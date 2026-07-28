// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CustOutputPanel from './CustOutputPanel.vue'

describe('CustOutputPanel', () => {
  it('renders the label', () => {
    const wrapper = mount(CustOutputPanel, {
      props: { label: 'Override patch CSS', css: '', copied: false, placeholder: 'Nothing yet' },
    })
    expect(wrapper.find('.cust-output-label').text()).toBe('Override patch CSS')
  })

  it('shows the placeholder text and hides action buttons/hint when css is empty', () => {
    const wrapper = mount(CustOutputPanel, {
      props: { label: 'CSS', css: '', copied: false, placeholder: 'No overrides yet' },
    })
    expect(wrapper.find('.cust-output-code').text()).toBe('No overrides yet')
    expect(wrapper.find('.cust-output-actions').exists()).toBe(false)
    expect(wrapper.find('.cust-output-hint').exists()).toBe(false)
  })

  it('shows the css content, action buttons, and hint when css is non-empty', () => {
    const wrapper = mount(CustOutputPanel, {
      props: { label: 'CSS', css: ':root {\n  --kui-color-background: #fff;\n}', copied: false, placeholder: 'unused' },
    })
    expect(wrapper.find('.cust-output-code').text()).toContain('--kui-color-background: #fff;')
    expect(wrapper.find('.cust-output-actions').exists()).toBe(true)
    expect(wrapper.find('.cust-output-hint').exists()).toBe(true)
  })

  it('shows "Copy" label and title when not copied, "Copied" when copied', () => {
    const notCopied = mount(CustOutputPanel, {
      props: { label: 'CSS', css: ':root {}', copied: false, placeholder: '' },
    })
    const copyBtn = notCopied.findAll('.cust-output-btn')[1]
    expect(copyBtn.text()).toBe('⎘ Copy')
    expect(copyBtn.attributes('title')).toBe('Copy CSS')

    const copied = mount(CustOutputPanel, {
      props: { label: 'CSS', css: ':root {}', copied: true, placeholder: '' },
    })
    const copiedBtn = copied.findAll('.cust-output-btn')[1]
    expect(copiedBtn.text()).toBe('✓ Copied')
    expect(copiedBtn.attributes('title')).toBe('Copied!')
  })

  it('emits copy when the Copy button is clicked', async () => {
    const wrapper = mount(CustOutputPanel, {
      props: { label: 'CSS', css: ':root {}', copied: false, placeholder: '' },
    })
    await wrapper.findAll('.cust-output-btn')[1].trigger('click')
    expect(wrapper.emitted('copy')).toHaveLength(1)
  })

  it('emits download when the Download button is clicked', async () => {
    const wrapper = mount(CustOutputPanel, {
      props: { label: 'CSS', css: ':root {}', copied: false, placeholder: '' },
    })
    await wrapper.findAll('.cust-output-btn')[0].trigger('click')
    expect(wrapper.emitted('download')).toHaveLength(1)
  })

  it('does not emit copy/download from clicking non-button elements', () => {
    const wrapper = mount(CustOutputPanel, {
      props: { label: 'CSS', css: ':root {}', copied: false, placeholder: '' },
    })
    expect(wrapper.emitted('copy')).toBeUndefined()
    expect(wrapper.emitted('download')).toBeUndefined()
  })
})
