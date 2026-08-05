// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SandboxModeSwitch from './SandboxModeSwitch.vue'

const OPTIONS = [
  { id: 'customizer', label: 'Customizer' },
  { id: 'theme-builder', label: 'Theme Builder' },
]

describe('SandboxModeSwitch', () => {
  it('renders one button per option with its label, inside a radiogroup', () => {
    const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'customizer' } })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const buttons = wrapper.findAll('.sms-option')
    expect(buttons).toHaveLength(2)
    expect(buttons.map((b) => b.text())).toEqual(['Customizer', 'Theme Builder'])
    expect(buttons.map((b) => b.attributes('role'))).toEqual(['radio', 'radio'])
  })

  it('marks only the active option as checked, and gives it the only tabbable stop (roving tabindex)', () => {
    const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'theme-builder' } })
    const buttons = wrapper.findAll('.sms-option')
    expect(buttons[0].attributes('aria-checked')).toBe('false')
    expect(buttons[1].attributes('aria-checked')).toBe('true')
    expect(buttons[0].attributes('tabindex')).toBe('-1')
    expect(buttons[1].attributes('tabindex')).toBe('0')
    expect(buttons[1].classes()).toContain('sms-option--active')
  })

  it('emits update:modelValue with the clicked option id', async () => {
    const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'customizer' } })
    await wrapper.findAll('.sms-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['theme-builder']])
  })

  describe('keyboard navigation (real radiogroup behavior: arrow keys both move focus and change selection)', () => {
    it('ArrowRight/ArrowDown move to the next option', async () => {
      const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'customizer' } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['theme-builder'])
    })

    it('wraps from the last option back to the first', async () => {
      const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'theme-builder' } })
      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['customizer'])
    })

    it('ArrowLeft/ArrowUp move to the previous option and wrap around', async () => {
      const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'customizer' } })
      await wrapper.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['theme-builder'])
    })

    it('Home/End jump to the first/last option', async () => {
      const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'theme-builder' } })
      await wrapper.trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['customizer'])

      await wrapper.setProps({ modelValue: 'customizer' })
      await wrapper.trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['theme-builder'])
    })

    it('ignores unrelated keys', async () => {
      const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'customizer' } })
      await wrapper.trigger('keydown', { key: 'Tab' })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('modified dot', () => {
    it('does not render a dot for an option with modified unset or false', () => {
      const wrapper = mount(SandboxModeSwitch, { props: { options: OPTIONS, modelValue: 'customizer' } })
      expect(wrapper.find('.sms-dot-wrap').exists()).toBe(false)
    })

    it('renders a dot with a tooltip for an option flagged as modified, and its accessible name on the button', () => {
      const options = [
        OPTIONS[0],
        { ...OPTIONS[1], modified: true, modifiedTooltip: 'Unsaved changes.' },
      ]
      const wrapper = mount(SandboxModeSwitch, { props: { options, modelValue: 'customizer' } })
      const buttons = wrapper.findAll('.sms-option')
      expect(buttons[0].find('.sms-dot').exists()).toBe(false)
      expect(buttons[1].find('.sms-dot').exists()).toBe(true)
      expect(buttons[1].find('.sms-dot-tooltip').text()).toBe('Unsaved changes.')
      expect(buttons[1].attributes('aria-label')).toBe('Theme Builder — Unsaved changes.')
    })
  })
})
