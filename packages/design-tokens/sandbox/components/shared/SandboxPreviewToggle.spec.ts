// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SandboxPreviewToggle from './SandboxPreviewToggle.vue'

describe('SandboxPreviewToggle', () => {
  it('renders the original "Live preview on/off" text and long-form hint when toolLabel is omitted', () => {
    const wrapper = mount(SandboxPreviewToggle, { props: { modelValue: true } })
    expect(wrapper.find('.preview-toggle-text').text()).toBe('Live preview on')
    expect(wrapper.find('.preview-toggle-hint').exists()).toBe(true)
    expect(wrapper.find('.preview-toggle-info-wrap').exists()).toBe(false)
  })

  it('shows the off state and hint when modelValue is false', () => {
    const wrapper = mount(SandboxPreviewToggle, { props: { modelValue: false } })
    expect(wrapper.find('.preview-toggle-text').text()).toBe('Live preview off')
    expect(wrapper.find('.preview-toggle-hint').text()).toContain('original tokens')
  })

  it('emits update:modelValue with the flipped value when clicked', async () => {
    const wrapper = mount(SandboxPreviewToggle, { props: { modelValue: true } })
    await wrapper.find('.preview-toggle-switch').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('shows a compact "Live preview: On/Off" status and hides the long-form hint in compact mode', () => {
    const wrapper = mount(SandboxPreviewToggle, { props: { modelValue: true, compact: true } })
    expect(wrapper.find('.preview-toggle-text').text()).toBe('Live preview: On')
    expect(wrapper.find('.preview-toggle-hint').exists()).toBe(false)

    const off = mount(SandboxPreviewToggle, { props: { modelValue: false, compact: true } })
    expect(off.find('.preview-toggle-text').text()).toBe('Live preview: Off')
  })

  it('does not visually repeat the tool name (a tab bar above already names it) — toolLabel only enriches the aria-label', () => {
    const wrapper = mount(SandboxPreviewToggle, {
      props: { modelValue: true, compact: true, toolLabel: 'Customizer' },
    })
    expect(wrapper.find('.preview-toggle-text').text()).not.toContain('Customizer')
    expect(wrapper.find('.preview-toggle-switch').attributes('aria-label')).toBe('Toggle live preview for Customizer')
  })

  it('falls back to a generic aria-label when toolLabel is omitted', () => {
    const wrapper = mount(SandboxPreviewToggle, { props: { modelValue: true } })
    expect(wrapper.find('.preview-toggle-switch').attributes('aria-label')).toBe('Toggle live preview')
  })

  it('renders an info icon with the given tooltip text when infoTooltip is provided', () => {
    const wrapper = mount(SandboxPreviewToggle, {
      props: { modelValue: true, infoTooltip: 'Only the active tab is live.' },
    })
    expect(wrapper.find('.preview-toggle-info-icon').exists()).toBe(true)
    expect(wrapper.find('.preview-toggle-info-body').text()).toBe('Only the active tab is live.')
  })

  it('does not render the info icon when infoTooltip is omitted', () => {
    const wrapper = mount(SandboxPreviewToggle, { props: { modelValue: true } })
    expect(wrapper.find('.preview-toggle-info-wrap').exists()).toBe(false)
  })
})
