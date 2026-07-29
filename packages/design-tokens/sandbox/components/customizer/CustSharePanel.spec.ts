// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CustSharePanel from './CustSharePanel.vue'

interface SharePanelProps {
  overrideCount: number
  copied: boolean
  stateCode: string
  copiedCode: boolean
}

function baseProps(overrides: Partial<SharePanelProps> = {}): SharePanelProps {
  return {
    overrideCount: 0,
    copied: false,
    stateCode: '',
    copiedCode: false,
    ...overrides,
  }
}

describe('CustSharePanel', () => {
  it('hides the override-count badge when overrideCount is 0', () => {
    const wrapper = mount(CustSharePanel, { props: baseProps({ overrideCount: 0 }) })
    expect(wrapper.find('.share-badge').exists()).toBe(false)
  })

  it('shows a singular label for exactly 1 override', () => {
    const wrapper = mount(CustSharePanel, { props: baseProps({ overrideCount: 1 }) })
    expect(wrapper.find('.share-badge').text()).toBe('1 token')
  })

  it('shows a plural label for more than 1 override', () => {
    const wrapper = mount(CustSharePanel, { props: baseProps({ overrideCount: 4 }) })
    expect(wrapper.find('.share-badge').text()).toBe('4 tokens')
  })

  it('shows "Copy share link" and the copied state toggles text/title/class', () => {
    const notCopied = mount(CustSharePanel, { props: baseProps({ copied: false }) })
    const btn = notCopied.find('.cust-share-copy-btn')
    expect(btn.text()).toBe('Copy share link')
    expect(btn.attributes('title')).toBe('Copy share link')
    expect(btn.classes()).not.toContain('cust-share-copy-btn--copied')

    const copied = mount(CustSharePanel, { props: baseProps({ copied: true }) })
    const copiedBtn = copied.find('.cust-share-copy-btn')
    expect(copiedBtn.text()).toBe('✓ Link copied!')
    expect(copiedBtn.attributes('title')).toBe('Copied!')
    expect(copiedBtn.classes()).toContain('cust-share-copy-btn--copied')
  })

  it('emits copy when the share-link button is clicked', async () => {
    const wrapper = mount(CustSharePanel, { props: baseProps() })
    await wrapper.find('.cust-share-copy-btn').trigger('click')
    expect(wrapper.emitted('copy')).toHaveLength(1)
  })

  it('hides the state-code button when stateCode is empty', () => {
    const wrapper = mount(CustSharePanel, { props: baseProps({ stateCode: '' }) })
    expect(wrapper.find('.cust-share-code-btn').exists()).toBe(false)
  })

  it('shows the state-code button when stateCode is non-empty, toggling copied state', () => {
    const notCopied = mount(CustSharePanel, { props: baseProps({ stateCode: 'c1:abc123', copiedCode: false }) })
    const btn = notCopied.find('.cust-share-code-btn')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('⎘ Copy state code')
    expect(btn.classes()).not.toContain('cust-share-code-btn--copied')

    const copied = mount(CustSharePanel, { props: baseProps({ stateCode: 'c1:abc123', copiedCode: true }) })
    const copiedBtn = copied.find('.cust-share-code-btn')
    expect(copiedBtn.text()).toBe('✓ Code copied!')
    expect(copiedBtn.classes()).toContain('cust-share-code-btn--copied')
  })

  it('emits copyCode when the state-code button is clicked', async () => {
    const wrapper = mount(CustSharePanel, { props: baseProps({ stateCode: 'c1:abc123' }) })
    await wrapper.find('.cust-share-code-btn').trigger('click')
    expect(wrapper.emitted('copyCode')).toHaveLength(1)
  })

  it('does not emit copyCode when the button is absent (no stateCode)', () => {
    const wrapper = mount(CustSharePanel, { props: baseProps({ stateCode: '' }) })
    expect(wrapper.find('.cust-share-code-btn').exists()).toBe(false)
    expect(wrapper.emitted('copyCode')).toBeUndefined()
  })

  it('renders the static hint text', () => {
    const wrapper = mount(CustSharePanel, { props: baseProps() })
    expect(wrapper.find('.cust-share-hint').text()).toContain('encoded directly in the URL')
  })
})
