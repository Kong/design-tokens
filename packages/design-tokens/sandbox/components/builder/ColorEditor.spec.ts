// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ColorEditor from './ColorEditor.vue'

describe('ColorEditor', () => {
  it('emits update:modelValue with a normalized hex when typing a valid hex value', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.ce-text').setValue('#00ff00')
    expect(wrapper.emitted('update:modelValue')).toEqual([['#00FF00']])
  })

  it('accepts rgb() input and normalizes it to hex', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.ce-text').setValue('rgb(0, 255, 0)')
    expect(wrapper.emitted('update:modelValue')).toEqual([['#00FF00']])
  })

  it('does not emit while the typed draft is not a parseable color', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.ce-text').setValue('not-a-color')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows the invalid hint only once the draft is non-empty and unparseable', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    expect(wrapper.find('.ce-hint').exists()).toBe(false)
    await wrapper.find('.ce-text').setValue('nope')
    expect(wrapper.find('.ce-hint').exists()).toBe(true)
    expect(wrapper.find('.ce-text').classes()).toContain('ce-text--invalid')
  })

  it('emits the picker hex when the native color input changes', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.ce-native-input').setValue('#0000ff')
    expect(wrapper.emitted('update:modelValue')).toEqual([['#0000FF']])
  })

  it('switches the draft text between hex and rgb formats without changing the underlying value', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#3B82F6' } })
    expect(wrapper.find<HTMLInputElement>('.ce-text').element.value).toBe('#3B82F6')

    const rgbBtn = wrapper.findAll('.ce-format-btn').find((b) => b.text() === 'RGB')!
    await rgbBtn.trigger('click')
    expect(wrapper.find<HTMLInputElement>('.ce-text').element.value).toBe('rgb(59, 130, 246)')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    const hexBtn = wrapper.findAll('.ce-format-btn').find((b) => b.text() === 'HEX')!
    await hexBtn.trigger('click')
    expect(wrapper.find<HTMLInputElement>('.ce-text').element.value).toBe('#3B82F6')
  })

  it('marks the active format button with the active class and aria-selected', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#3B82F6' } })
    const hexBtn = wrapper.findAll('.ce-format-btn').find((b) => b.text() === 'HEX')!
    const rgbBtn = wrapper.findAll('.ce-format-btn').find((b) => b.text() === 'RGB')!
    expect(hexBtn.classes()).toContain('ce-format-btn--active')
    expect(hexBtn.attributes('aria-selected')).toBe('true')
    expect(rgbBtn.classes()).not.toContain('ce-format-btn--active')
  })

  it('commits the current draft and emits close on Enter', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.ce-text').setValue('#00ff00')
    await wrapper.find('.ce-text').trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['#00FF00'])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close without emitting an update when Enter is pressed on an invalid draft', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.ce-text').setValue('garbage')
    await wrapper.find('.ce-text').trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close on Escape', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' }, attachTo: document.body })
    await wrapper.trigger('keydown.esc')
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits close on a pointerdown outside the editor, but not inside it', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' }, attachTo: document.body })

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.find('.ce-text').trigger('pointerdown')
    // Still just the one close from the outside click above.
    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })

  it('removes the outside-pointerdown listener on unmount', async () => {
    const wrapper = mount(ColorEditor, { props: { modelValue: '#FF0000' }, attachTo: document.body })
    wrapper.unmount()
    // Should not throw, and should not affect anything else listening on the document.
    expect(() => document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))).not.toThrow()
  })

  it('applies the alpha checkerboard background for transparent and 8-digit hex values', () => {
    const opaque = mount(ColorEditor, { props: { modelValue: '#FF0000' } })
    expect(opaque.find('.ce-preview').classes()).not.toContain('ce-preview--alpha')

    const alpha = mount(ColorEditor, { props: { modelValue: '#FF000080' } })
    expect(alpha.find('.ce-preview').classes()).toContain('ce-preview--alpha')

    const transparent = mount(ColorEditor, { props: { modelValue: 'transparent' } })
    expect(transparent.find('.ce-preview').classes()).toContain('ce-preview--alpha')
  })
})
