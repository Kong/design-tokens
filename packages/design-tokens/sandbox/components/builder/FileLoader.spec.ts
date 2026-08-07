// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FileLoader from './FileLoader.vue'
import { BUILT_IN_THEMES } from '@/composables/useBuiltInThemes'

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
    const inputs = wrapper.findAll('input[type="file"]')
    const themeInput = inputs[1] // theme is second input

    const file = makeFile('electric-lime-day.theme.json', '{"a":1}')
    Object.defineProperty(themeInput.element, 'files', { value: [file], configurable: true })
    await themeInput.trigger('change')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('electric-lime-day.theme.json')
    expect(wrapper.find('.fl-btn').attributes('disabled')).toBeDefined()
  })

  it('enables Load Theme and emits load with both files\' text and names once both are chosen', async () => {
    const wrapper = mount(FileLoader)
    const inputs = wrapper.findAll('input[type="file"]')
    const [aliasInput, themeInput] = inputs

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
    const inputs = wrapper.findAll('input[type="file"]')
    const themeInput = inputs[1]
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
    const dropZones = wrapper.findAll('.fl-drop')
    const themeDrop = dropZones[1] // theme drop zone is second
    await themeDrop.trigger('dragenter')
    expect(themeDrop.classes()).toContain('fl-drop--dragover')
    await themeDrop.trigger('dragleave')
    expect(themeDrop.classes()).not.toContain('fl-drop--dragover')
  })

  it('reads a dropped theme file and clears the dragover state', async () => {
    const wrapper = mount(FileLoader)
    const dropZones = wrapper.findAll('.fl-drop')
    const themeDrop = dropZones[1] // theme drop zone is second
    const file = makeFile('classic-day.theme.json', '{"a":1}')

    await themeDrop.trigger('dragenter')
    await themeDrop.trigger('drop', { dataTransfer: { files: [file] } })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(themeDrop.classes()).not.toContain('fl-drop--dragover')
    expect(wrapper.text()).toContain('classic-day.theme.json')
  })

  it('lists a disabled placeholder followed by every built-in theme, in order', () => {
    const wrapper = mount(FileLoader)
    const options = wrapper.findAll('#fl-builtin-select option')
    expect(options[0].attributes('disabled')).toBeDefined()
    expect(options.slice(1).map((o) => o.text())).toEqual(BUILT_IN_THEMES.map((t) => t.label))
  })

  it('does not emit load merely from selecting a built-in theme — requires clicking Load Theme', async () => {
    const wrapper = mount(FileLoader)
    const select = wrapper.find('#fl-builtin-select')
    await select.setValue(BUILT_IN_THEMES[0].id)

    expect(wrapper.emitted('load')).toBeUndefined()
    expect(wrapper.find('.fl-btn').attributes('disabled')).toBeUndefined()
  })

  it('emits load with the built-in theme\'s bundled source text once Load Theme is clicked', async () => {
    const wrapper = mount(FileLoader)
    const select = wrapper.find('#fl-builtin-select')
    const target = BUILT_IN_THEMES[0]
    await select.setValue(target.id)
    await wrapper.find('.fl-btn').trigger('click')

    const emitted = wrapper.emitted('load')
    expect(emitted).toHaveLength(1)
    expect(emitted![0][0]).toEqual({
      themeText: target.themeText,
      aliasText: target.aliasText,
      themeName: target.themeFileName,
      aliasName: target.aliasFileName,
    })
  })

  it('disables the upload drop zones once a built-in theme is selected', async () => {
    const wrapper = mount(FileLoader)
    await wrapper.find('#fl-builtin-select').setValue(BUILT_IN_THEMES[0].id)

    const inputs = wrapper.findAll('input[type="file"]')
    expect(inputs[0].attributes('disabled')).toBeDefined()
    expect(inputs[1].attributes('disabled')).toBeDefined()
    const dropZones = wrapper.findAll('.fl-drop')
    expect(dropZones[0].classes()).toContain('fl-drop--disabled')
    expect(dropZones[1].classes()).toContain('fl-drop--disabled')
  })

  it('disables the built-in theme dropdown once an upload has started', async () => {
    const wrapper = mount(FileLoader)
    const inputs = wrapper.findAll('input[type="file"]')
    const themeInput = inputs[1]
    const file = makeFile('electric-lime-day.theme.json', '{"a":1}')
    Object.defineProperty(themeInput.element, 'files', { value: [file], configurable: true })
    await themeInput.trigger('change')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.find('#fl-builtin-select').attributes('disabled')).toBeDefined()
  })

  it('shows a "Clear selection" control once either method has started, and it resets both', async () => {
    const wrapper = mount(FileLoader)
    expect(wrapper.find('.fl-clear-btn').exists()).toBe(false)

    await wrapper.find('#fl-builtin-select').setValue(BUILT_IN_THEMES[0].id)
    expect(wrapper.find('.fl-clear-btn').exists()).toBe(true)

    await wrapper.find('.fl-clear-btn').trigger('click')
    expect(wrapper.find('.fl-clear-btn').exists()).toBe(false)
    expect((wrapper.find('#fl-builtin-select').element as HTMLSelectElement).value).toBe('')
    expect(wrapper.find('#fl-builtin-select').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.fl-btn').attributes('disabled')).toBeDefined()
  })

  it('still emits load from the existing upload path, unaffected by the new dropdown', async () => {
    const wrapper = mount(FileLoader)
    const themeFile = new File(['{"kui-space-10":{"$value":"4px"}}'], 'my.theme.json', { type: 'application/json' })
    const aliasFile = new File(['{"color":{"alias":{}}}'], 'my.alias.color.json', { type: 'application/json' })
    const inputs = wrapper.findAll('input[type="file"]')

    Object.defineProperty(inputs[0].element, 'files', { value: [aliasFile], configurable: true })
    await inputs[0].trigger('change')
    Object.defineProperty(inputs[1].element, 'files', { value: [themeFile], configurable: true })
    await inputs[1].trigger('change')
    await flushPromises()

    await wrapper.find('.fl-btn').trigger('click')

    const emitted = wrapper.emitted('load')
    expect(emitted).toHaveLength(1)
    expect(emitted![0][0]).toEqual({
      themeText: '{"kui-space-10":{"$value":"4px"}}',
      aliasText: '{"color":{"alias":{}}}',
      themeName: 'my.theme.json',
      aliasName: 'my.alias.color.json',
    })
  })

  it('emits go-to-instructions when the hint link is clicked', async () => {
    const wrapper = mount(FileLoader)
    await wrapper.find('.fl-link').trigger('click')
    expect(wrapper.emitted('go-to-instructions')).toHaveLength(1)
  })
})
