// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FileLoader from './FileLoader.vue'

function makeFile(name: string, text: string) {
  const file = new File([text], name, { type: 'application/json' })
  return file
}

describe('FileLoader', () => {
  it('disables the Load Theme button until both files are chosen', () => {
    const wrapper = mount(FileLoader)
    expect(wrapper.find('.fl-btn').attributes('disabled')).toBeDefined()
  })

  it('reads a chosen theme file and shows its name, without enabling the button until the alias file also loads', async () => {
    const wrapper = mount(FileLoader)
    const [themeInput] = wrapper.findAll('input[type="file"]')

    const file = makeFile('electric-lime-day.theme.json', '{"a":1}')
    Object.defineProperty(themeInput.element, 'files', { value: [file], configurable: true })
    await themeInput.trigger('change')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('electric-lime-day.theme.json')
    expect(wrapper.find('.fl-btn').attributes('disabled')).toBeDefined()
  })

  it('enables Load Theme and emits load with both files\' text and names once both are chosen', async () => {
    const wrapper = mount(FileLoader)
    const [aliasInput, themeInput] = wrapper.findAll('input[type="file"]')

    const themeFile = makeFile('electric-lime-day.theme.json', '{"kui-space-40":{"$value":"16px"}}')
    const aliasFile = makeFile('electric-lime-day.alias.color.json', '{"color":{"alias":{}}}')

    Object.defineProperty(themeInput.element, 'files', { value: [themeFile], configurable: true })
    await themeInput.trigger('change')
    Object.defineProperty(aliasInput.element, 'files', { value: [aliasFile], configurable: true })
    await aliasInput.trigger('change')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.find('.fl-btn').attributes('disabled')).toBeUndefined()

    await wrapper.find('.fl-btn').trigger('click')
    expect(wrapper.emitted('load')).toEqual([[{
      themeText: '{"kui-space-40":{"$value":"16px"}}',
      aliasText: '{"color":{"alias":{}}}',
      themeName: 'electric-lime-day.theme.json',
      aliasName: 'electric-lime-day.alias.color.json',
    }]])
  })

  it('does not emit load on click while a required file is still missing', async () => {
    const wrapper = mount(FileLoader)
    await wrapper.find('.fl-btn').trigger('click')
    expect(wrapper.emitted('load')).toBeUndefined()
  })

  it('does nothing when a change event fires with no file selected', async () => {
    const wrapper = mount(FileLoader)
    const [themeInput] = wrapper.findAll('input[type="file"]')
    Object.defineProperty(themeInput.element, 'files', { value: [], configurable: true })
    await themeInput.trigger('change')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('Choose *.theme.json')
  })

  it('displays a passed-in error message', () => {
    const wrapper = mount(FileLoader, { props: { error: 'Alias file must contain a color.alias tree.' } })
    expect(wrapper.find('.fl-error').text()).toBe('Alias file must contain a color.alias tree.')
  })

  it('toggles the dragover style class while a file is dragged over a drop zone', async () => {
    const wrapper = mount(FileLoader)
    const [themeDrop] = wrapper.findAll('.fl-drop')
    await themeDrop.trigger('dragenter')
    expect(themeDrop.classes()).toContain('fl-drop--dragover')
    await themeDrop.trigger('dragleave')
    expect(themeDrop.classes()).not.toContain('fl-drop--dragover')
  })

  it('reads a dropped theme file and clears the dragover state', async () => {
    const wrapper = mount(FileLoader)
    const [themeDrop] = wrapper.findAll('.fl-drop')
    const file = makeFile('classic-day.theme.json', '{"a":1}')

    await themeDrop.trigger('dragenter')
    await themeDrop.trigger('drop', { dataTransfer: { files: [file] } })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(themeDrop.classes()).not.toContain('fl-drop--dragover')
    expect(wrapper.text()).toContain('classic-day.theme.json')
  })
})
