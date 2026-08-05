// @vitest-environment jsdom
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { useSearchShortcut } from './useSearchShortcut'

// useSearchShortcut registers a real `window.addEventListener('keydown', ...)` on mount and
// only removes it in `onUnmounted` — every mounted wrapper must be unmounted, or a stale
// listener from one test keeps intercepting Ctrl+F in the next.
let liveWrappers: VueWrapper[] = []

function mountShortcut(enabled?: boolean | (() => boolean)) {
  const inputEl = ref<HTMLInputElement | null>(null)
  const wrapper = mount(defineComponent({
    setup() {
      useSearchShortcut(inputEl, enabled)
      return () => h('input', { ref: (el) => {
        inputEl.value = el as HTMLInputElement | null
      } })
    },
  }), { attachTo: document.body })
  liveWrappers.push(wrapper)
  return { wrapper, inputEl }
}

function dispatchCtrlF() {
  const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, cancelable: true })
  window.dispatchEvent(event)
  return event
}

describe('useSearchShortcut', () => {
  afterEach(() => {
    for (const wrapper of liveWrappers) wrapper.unmount()
    liveWrappers = []
    document.body.innerHTML = ''
  })

  it('focuses the input and prevents default on Ctrl+F when enabled is omitted (default true)', () => {
    const { inputEl } = mountShortcut()
    const event = dispatchCtrlF()
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(inputEl.value)
  })

  it('focuses the input and prevents default on Ctrl+F when enabled is explicitly true', () => {
    const { inputEl } = mountShortcut(true)
    const event = dispatchCtrlF()
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(inputEl.value)
  })

  it('is a no-op when enabled is false: native find-in-page is not intercepted', () => {
    const { inputEl } = mountShortcut(false)
    const event = dispatchCtrlF()
    expect(event.defaultPrevented).toBe(false)
    expect(document.activeElement).not.toBe(inputEl.value)
  })

  it('re-reads a getter each time, so toggling enabled at runtime takes effect immediately', () => {
    let enabled = false
    const { inputEl } = mountShortcut(() => enabled)

    let event = dispatchCtrlF()
    expect(event.defaultPrevented).toBe(false)

    enabled = true
    event = dispatchCtrlF()
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(inputEl.value)
  })
})
