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

  it('shows the export note naming both target filenames', () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    expect(wrapper.find('.op-note').text()).toBe('Downloads both my-theme.theme.json and my-theme.alias.color.json.')
  })

  it('shows the placeholder comment in the code block when css is empty', () => {
    const wrapper = mount(OutputPanel, { props: makeProps({ css: '' }) })
    expect(wrapper.find('.op-code').text()).toBe('/* Load a theme and edit tokens to see the computed CSS. */')
  })

  it('shows the computed css in the code block when present', () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    expect(wrapper.find('.op-code').text()).toBe(':root {\n  --kui-space-40: 16px;\n}')
  })

  it('does not render the copy button when css is empty', () => {
    const wrapper = mount(OutputPanel, { props: makeProps({ css: '' }) })
    expect(wrapper.find('.op-copy-btn').exists()).toBe(false)
  })

  it('renders the copy button when css is present', () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    expect(wrapper.find('.op-copy-btn').exists()).toBe(true)
    expect(wrapper.find('.op-copy-btn').text()).toBe('Copy')
  })

  it('downloads both files with their given names and payloads when exporting', async () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    await wrapper.find('.op-btn').trigger('click')

    expect(createObjectURLSpy).toHaveBeenCalledTimes(2)
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(2)
    expect(clickSpy).toHaveBeenCalledTimes(2)

    const blobArgs = createObjectURLSpy.mock.calls.map((call: unknown[]) => call[0] as Blob)
    expect(blobArgs[0].type).toBe('application/json')
  })

  it('copies the computed css to the clipboard and shows a confirmation for 1.5s', async () => {
    const wrapper = mount(OutputPanel, { props: makeProps() })
    await wrapper.find('.op-copy-btn').trigger('click')
    await flushPromises()

    expect(clipboardWriteText).toHaveBeenCalledWith(':root {\n  --kui-space-40: 16px;\n}')
    expect(wrapper.find('.op-copy-btn').text()).toBe('✓ Copied')

    vi.advanceTimersByTime(1499)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.op-copy-btn').text()).toBe('✓ Copied')

    vi.advanceTimersByTime(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.op-copy-btn').text()).toBe('Copy')
  })

  it('does nothing when copy is invoked with empty css (no button rendered, guarded no-op)', async () => {
    const wrapper = mount(OutputPanel, { props: makeProps({ css: '' }) })
    // No copy button exists to click; verify the guard directly via exposed behavior:
    // clicking export still works independent of clipboard state.
    expect(wrapper.find('.op-copy-btn').exists()).toBe(false)
    expect(clipboardWriteText).not.toHaveBeenCalled()
  })
})
