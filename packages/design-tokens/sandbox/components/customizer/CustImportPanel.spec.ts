// @vitest-environment jsdom
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CustImportPanel from './CustImportPanel.vue'
import { useTokenCustomizer, encodeOverrides, setStartingTheme } from '../../composables/useTokenCustomizer'
import { ALL_ENTRIES, DEFAULT_THEME_ID } from '../../composables/useTokens'

type Customizer = ReturnType<typeof useTokenCustomizer>

// Same module-scoped-state pattern as useTokenCustomizer.spec.ts: mount the composable to get
// a handle on the shared overrides/customProps/startingThemeId, and unmount every wrapper so
// its onMounted/watch hooks stop running between tests.
let liveWrappers: VueWrapper[] = []

afterEach(() => {
  for (const wrapper of liveWrappers) wrapper.unmount()
  liveWrappers = []
})

function mountCustomizer(): Customizer {
  let composable!: Customizer
  const wrapper = mount(defineComponent({
    setup() {
      composable = useTokenCustomizer()
      return () => h('div')
    },
  }))
  liveWrappers.push(wrapper)
  return composable
}

function resetHash() {
  history.replaceState(null, '', window.location.pathname + '#/customize')
}

/** Waits a real macrotask tick — needed for FileReader's onload, which is not promise-based. */
function flushFileReader() {
  return new Promise((resolve) => setTimeout(resolve, 10))
}

describe('CustImportPanel', () => {
  let composable: Customizer

  beforeEach(() => {
    resetHash()
    composable = mountCustomizer()
    composable.resetAll()
    setStartingTheme(DEFAULT_THEME_ID)
  })

  it('disables Apply when the input is empty, enables it once text is entered', async () => {
    const wrapper = mount(CustImportPanel)
    expect(wrapper.find('.cust-import-apply-btn').attributes('disabled')).toBeDefined()
    await wrapper.find('.cust-import-input').setValue('some text')
    expect(wrapper.find('.cust-import-apply-btn').attributes('disabled')).toBeUndefined()
  })

  it('is a no-op for whitespace-only input (Apply stays disabled)', async () => {
    const wrapper = mount(CustImportPanel)
    await wrapper.find('.cust-import-input').setValue('   ')
    expect(wrapper.find('.cust-import-apply-btn').attributes('disabled')).toBeDefined()
  })

  it('leads the placeholder with CSS, not the removed share-link feature', () => {
    const wrapper = mount(CustImportPanel)
    expect(wrapper.find('.cust-import-input').attributes('placeholder')).toBe(
      'Paste CSS (or a legacy share URL/state code)…',
    )
  })

  describe('CSS text import', () => {
    it('applies a valid :root CSS block, actually mutating overrides/customProps, and shows success feedback', async () => {
      const target = ALL_ENTRIES[0]
      const wrapper = mount(CustImportPanel)
      await wrapper.find('.cust-import-input').setValue(
        `:root {\n  ${target.cssVar}: #123456;\n  --my-custom-var: 10px;\n}`,
      )
      await wrapper.find('.cust-import-apply-btn').trigger('click')
      await wrapper.vm.$nextTick()

      expect(composable.overrides[target.cssVar]).toBe('#123456')
      expect(composable.customProps['--my-custom-var']).toBe('10px')
      expect(wrapper.find('.cust-import-feedback').text()).toBe('Customizations applied.')
      expect(wrapper.find('.cust-import-feedback').classes()).toContain('cust-import-feedback--success')
      // input clears after a successful apply
      expect((wrapper.find('.cust-import-input').element as HTMLInputElement).value).toBe('')
    })

    it('applying via Enter key uses the same code path as clicking Apply', async () => {
      const target = ALL_ENTRIES[1]
      const wrapper = mount(CustImportPanel)
      await wrapper.find('.cust-import-input').setValue(`${target.cssVar}: #abcdef;`)
      await wrapper.find('.cust-import-input').trigger('keydown.enter')
      await wrapper.vm.$nextTick()
      expect(composable.overrides[target.cssVar]).toBe('#abcdef')
      expect(wrapper.find('.cust-import-feedback--success').exists()).toBe(true)
    })
  })

  describe('share URL / state code import', () => {
    it('applies a valid share link, mutating startingThemeId and overrides, and shows success feedback', async () => {
      const target = ALL_ENTRIES[0]
      const encoded = await encodeOverrides({ [target.cssVar]: '#112233' })
      const link = `http://localhost/#/customize?o=${encoded}&startTheme=electric-lime-day`

      const wrapper = mount(CustImportPanel)
      await wrapper.find('.cust-import-input').setValue(link)
      await wrapper.find('.cust-import-apply-btn').trigger('click')
      await wrapper.vm.$nextTick()

      expect(composable.startingThemeId.value).toBe('electric-lime-day')
      expect(composable.overrides[target.cssVar]).toBe('#112233')
      expect(wrapper.find('.cust-import-feedback').text()).toBe('Customizations applied.')
      expect(wrapper.find('.cust-import-feedback').classes()).toContain('cust-import-feedback--success')
    })

    it('still applies a legacy share link using the pre-rename ?theme= key', async () => {
      const target = ALL_ENTRIES[1]
      const encoded = await encodeOverrides({ [target.cssVar]: '#445566' })
      const legacyLink = `http://localhost/#/customize?o=${encoded}&theme=electric-lime-night`

      const wrapper = mount(CustImportPanel)
      await wrapper.find('.cust-import-input').setValue(legacyLink)
      await wrapper.find('.cust-import-apply-btn').trigger('click')
      await wrapper.vm.$nextTick()

      expect(composable.startingThemeId.value).toBe('electric-lime-night')
      expect(composable.overrides[target.cssVar]).toBe('#445566')
      expect(wrapper.find('.cust-import-feedback--success').exists()).toBe(true)
    })

    it('shows an error and leaves state untouched for a garbage code/URL that decodes to nothing', async () => {
      const wrapper = mount(CustImportPanel)
      await wrapper.find('.cust-import-input').setValue('this-is-not-a-valid-code-or-url')
      await wrapper.find('.cust-import-apply-btn').trigger('click')
      await wrapper.vm.$nextTick()

      expect(Object.keys(composable.overrides)).toHaveLength(0)
      expect(Object.keys(composable.customProps)).toHaveLength(0)
      expect(wrapper.find('.cust-import-feedback').text()).toBe(
        'Nothing decoded — check that the URL or state code is correct.',
      )
      expect(wrapper.find('.cust-import-feedback').classes()).toContain('cust-import-feedback--error')
      // input is NOT cleared on failure
      expect((wrapper.find('.cust-import-input').element as HTMLInputElement).value).toBe('this-is-not-a-valid-code-or-url')
    })

    it('clears the error feedback automatically after the timeout', async () => {
      vi.useFakeTimers()
      const wrapper = mount(CustImportPanel)
      await wrapper.find('.cust-import-input').setValue('garbage')
      await wrapper.find('.cust-import-apply-btn').trigger('click')
      await vi.advanceTimersByTimeAsync(0)
      expect(wrapper.find('.cust-import-feedback').exists()).toBe(true)
      await vi.advanceTimersByTimeAsync(3000)
      expect(wrapper.find('.cust-import-feedback').exists()).toBe(false)
      vi.useRealTimers()
    })
  })

  describe('file import', () => {
    it('imports a valid .css file, mutating overrides, and shows a filename-specific success message', async () => {
      const target = ALL_ENTRIES[2]
      const wrapper = mount(CustImportPanel)
      const file = new File([`:root {\n  ${target.cssVar}: #654321;\n}`], 'my-theme.css', { type: 'text/css' })
      const fileInput = wrapper.find('input[type="file"]')
      Object.defineProperty(fileInput.element, 'files', { value: [file], configurable: true })
      await fileInput.trigger('change')
      await flushFileReader()
      await wrapper.vm.$nextTick()

      expect(composable.overrides[target.cssVar]).toBe('#654321')
      expect(wrapper.find('.cust-import-feedback').text()).toBe('Imported from my-theme.css.')
      expect(wrapper.find('.cust-import-feedback').classes()).toContain('cust-import-feedback--success')
    })

    it('shows an error for a .css file with no custom property declarations', async () => {
      const wrapper = mount(CustImportPanel)
      const file = new File(['body { color: red; }'], 'empty.css', { type: 'text/css' })
      const fileInput = wrapper.find('input[type="file"]')
      Object.defineProperty(fileInput.element, 'files', { value: [file], configurable: true })
      await fileInput.trigger('change')
      await flushFileReader()
      await wrapper.vm.$nextTick()

      expect(Object.keys(composable.overrides)).toHaveLength(0)
      expect(wrapper.find('.cust-import-feedback').text()).toBe('No CSS custom properties found in the file.')
      expect(wrapper.find('.cust-import-feedback').classes()).toContain('cust-import-feedback--error')
    })

    it('resets the file input value after import so the same file can be re-imported', async () => {
      const target = ALL_ENTRIES[3]
      const wrapper = mount(CustImportPanel)
      const file = new File([`${target.cssVar}: 4px;`], 'again.css', { type: 'text/css' })
      const fileInput = wrapper.find('input[type="file"]')
      Object.defineProperty(fileInput.element, 'files', { value: [file], configurable: true })
      await fileInput.trigger('change')
      await flushFileReader()

      expect((fileInput.element as HTMLInputElement).value).toBe('')
    })

    it('does nothing when the change event fires with no selected file', async () => {
      const wrapper = mount(CustImportPanel)
      const fileInput = wrapper.find('input[type="file"]')
      Object.defineProperty(fileInput.element, 'files', { value: [], configurable: true })
      await fileInput.trigger('change')
      await flushFileReader()
      expect(wrapper.find('.cust-import-feedback').exists()).toBe(false)
    })
  })
})
