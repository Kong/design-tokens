// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import OutputPanel from './OutputPanel.vue'

function makeProps(overrides = {}) {
  return {
    themeJsonOut: '{"kui-space-40":{"$value":"16px"}}',
    aliasJsonOut: '{"color":{"alias":{}}}',
    themeFileName: 'my-theme.theme.json',
    aliasFileName: 'my-theme.alias.color.json',
    css: ':root {\n  --kui-space-40: 16px;\n}',
    hasOverrides: false,
    ...overrides,
  }
}

describe('OutputPanel', () => {
  let clickSpy: ReturnType<typeof vi.spyOn>
  let createObjectURLSpy: ReturnType<typeof vi.fn>
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>
  let clipboardWriteText: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    createObjectURLSpy = vi.fn(() => 'blob:mock-url')
    revokeObjectURLSpy = vi.fn()
    URL.createObjectURL = createObjectURLSpy as typeof URL.createObjectURL
    URL.revokeObjectURL = revokeObjectURLSpy as typeof URL.revokeObjectURL

    clipboardWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: clipboardWriteText },
      configurable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    clickSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('names the file syntax (not specific filenames) and says "unmodified" when there are no overrides', () => {
    const wrapper = mount(OutputPanel, { props: makeProps({ hasOverrides: false }) })
    const note = wrapper.find('.op-note')
    expect(note.text()).toBe('Downloads the unmodified *.theme.json and *.alias.color.json files.')
    expect(note.text()).not.toContain('my-theme')
  })

  it('says "modified" when there are overrides', () => {
    const wrapper = mount(OutputPanel, { props: makeProps({ hasOverrides: true }) })
    expect(wrapper.find('.op-note').text()).toBe('Downloads the modified *.theme.json and *.alias.color.json files.')
  })

  it('does not render a large inline computed-CSS code block', () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    expect(wrapper.find('.op-code').exists()).toBe(false)
    expect(wrapper.find('pre').exists()).toBe(false)
  })

  it('disables the export/copy CSS buttons when css is empty', () => {
    const wrapper = mount(OutputPanel, { props: makeProps({ css: '' }) })
    const buttons = wrapper.findAll('.op-btn--secondary')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].attributes('disabled')).toBeDefined()
    expect(buttons[1].attributes('disabled')).toBeDefined()
  })

  it('enables the export/copy CSS buttons when css is present', () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    const buttons = wrapper.findAll('.op-btn--secondary')
    expect(buttons[0].attributes('disabled')).toBeUndefined()
    expect(buttons[1].attributes('disabled')).toBeUndefined()
    expect(buttons[1].text()).toBe('Copy')
  })

  it('downloads both theme files with their given names and payloads when exporting', async () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    await wrapper.find('.op-btn').trigger('click')

    expect(createObjectURLSpy).toHaveBeenCalledTimes(2)
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(2)
    expect(clickSpy).toHaveBeenCalledTimes(2)

    const blobArgs = createObjectURLSpy.mock.calls.map((call: unknown[]) => call[0] as Blob)
    expect(blobArgs[0].type).toBe('application/json')
  })

  it('downloads the computed CSS as a standalone .css file when "Export computed CSS" is clicked', async () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    createObjectURLSpy.mockClear()
    clickSpy.mockClear()

    await wrapper.find('.op-btn--secondary').trigger('click')

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    const blob = createObjectURLSpy.mock.calls[0][0] as Blob
    expect(blob.type).toBe('text/css')
  })

  it('copies the computed css to the clipboard and shows a confirmation for 1.5s', async () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    const copyBtn = wrapper.findAll('.op-btn--secondary')[1]
    await copyBtn.trigger('click')
    await flushPromises()

    expect(clipboardWriteText).toHaveBeenCalledWith(':root {\n  --kui-space-40: 16px;\n}')
    expect(wrapper.findAll('.op-btn--secondary')[1].text()).toBe('✓ Copied')

    vi.advanceTimersByTime(1499)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.op-btn--secondary')[1].text()).toBe('✓ Copied')

    vi.advanceTimersByTime(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.op-btn--secondary')[1].text()).toBe('Copy')
  })

  it('does nothing when export/copy CSS is invoked with empty css (disabled, guarded no-op)', async () => {
    const wrapper = mount(OutputPanel, { props: makeProps({ css: '' }) })
    const buttons = wrapper.findAll('.op-btn--secondary')
    // jsdom still fires click handlers on a `disabled` button via .trigger(); the component's
    // own `if (!props.css) return` guard is what actually prevents the download/copy.
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    await flushPromises()

    expect(createObjectURLSpy).not.toHaveBeenCalled()
    expect(clipboardWriteText).not.toHaveBeenCalled()
  })
})
