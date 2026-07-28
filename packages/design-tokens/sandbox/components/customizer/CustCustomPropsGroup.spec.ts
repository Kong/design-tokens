// @vitest-environment jsdom
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import CustCustomPropsGroup from './CustCustomPropsGroup.vue'
import { useTokenCustomizer, removeCustomProp, setCustomProp } from '../../composables/useTokenCustomizer'
import type { CustomPropsGroup } from '../../composables/useTokenCustomizer'

type Customizer = ReturnType<typeof useTokenCustomizer>

// `useTokenCustomizer`'s `customProps` map is module-scoped and only reachable through the
// composable's return value (it isn't exported directly). Mounting it inside a real component
// also registers an onMounted hook + a watch, so every wrapper must be unmounted in afterEach —
// same pattern as useTokenCustomizer.spec.ts.
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

function makeGroup(entries: Array<{ cssVar: string, value: string }> = [], totalCount = entries.length): CustomPropsGroup {
  return { entries, totalCount }
}

describe('CustCustomPropsGroup', () => {
  beforeEach(() => {
    mountCustomizer().resetAll()
  })

  it('shows the total count and no modified badge when there are no custom props', () => {
    const wrapper = mount(CustCustomPropsGroup, {
      props: { group: makeGroup([], 0), isCollapsed: false },
    })
    expect(wrapper.find('.group-count').text()).toBe('0')
    expect(wrapper.find('.group-modified-badge').exists()).toBe(false)
  })

  it('shows the modified badge with the count when there are custom props', () => {
    const wrapper = mount(CustCustomPropsGroup, {
      props: {
        group: makeGroup([{ cssVar: '--my-var', value: 'red' }], 1),
        isCollapsed: false,
      },
    })
    expect(wrapper.find('.group-modified-badge').text()).toBe('1 modified')
  })

  it('emits toggle when the header is clicked', async () => {
    const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
    await wrapper.find('.ccp-group-header').trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('reflects isCollapsed via aria-expanded and hides the body', () => {
    const collapsed = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: true } })
    expect(collapsed.find('.ccp-group-header').attributes('aria-expanded')).toBe('false')
    expect(collapsed.find('.ccp-group-body').isVisible()).toBe(false)

    const expanded = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
    expect(expanded.find('.ccp-group-header').attributes('aria-expanded')).toBe('true')
    expect(expanded.find('.ccp-group-body').isVisible()).toBe(true)
  })

  it('renders one row per entry with the css var name and value', () => {
    const wrapper = mount(CustCustomPropsGroup, {
      props: {
        group: makeGroup([
          { cssVar: '--my-var-a', value: 'red' },
          { cssVar: '--my-var-b', value: 'blue' },
        ], 2),
        isCollapsed: false,
      },
    })
    const rows = wrapper.findAll('.ccp-row')
    expect(rows).toHaveLength(2)
    expect(rows[0].find('.ccp-var-name').text()).toBe('--my-var-a')
    expect((rows[0].find('.ccp-value-input').element as HTMLInputElement).value).toBe('red')
    expect(rows[1].find('.ccp-var-name').text()).toBe('--my-var-b')
  })

  it('shows the "no match" placeholder only when entries is empty but totalCount is not', () => {
    const filteredOut = mount(CustCustomPropsGroup, { props: { group: makeGroup([], 3), isCollapsed: false } })
    expect(filteredOut.find('.ccp-no-match').exists()).toBe(true)

    const trulyEmpty = mount(CustCustomPropsGroup, { props: { group: makeGroup([], 0), isCollapsed: false } })
    expect(trulyEmpty.find('.ccp-no-match').exists()).toBe(false)

    const hasEntries = mount(CustCustomPropsGroup, {
      props: { group: makeGroup([{ cssVar: '--x', value: 'y' }], 1), isCollapsed: false },
    })
    expect(hasEntries.find('.ccp-no-match').exists()).toBe(false)
  })

  it('updating a row value writes through setCustomProp on change', async () => {
    const composable = mountCustomizer()
    setCustomProp('--my-var', 'red')
    const wrapper = mount(CustCustomPropsGroup, {
      props: { group: makeGroup([{ cssVar: '--my-var', value: 'red' }], 1), isCollapsed: false },
    })
    const input = wrapper.find('.ccp-value-input')
    await input.setValue('green')
    await input.trigger('change')
    expect(composable.customProps['--my-var']).toBe('green')
  })

  it('removes a custom prop via the remove button', async () => {
    const composable = mountCustomizer()
    setCustomProp('--my-var', 'red')
    const wrapper = mount(CustCustomPropsGroup, {
      props: { group: makeGroup([{ cssVar: '--my-var', value: 'red' }], 1), isCollapsed: false },
    })
    await wrapper.find('.ccp-remove-btn').trigger('click')
    expect(composable.customProps['--my-var']).toBeUndefined()
  })

  it('remove button acts on the row cssVar (not a stale closure) — removes only the clicked row', async () => {
    const composable = mountCustomizer()
    setCustomProp('--a', '1')
    setCustomProp('--b', '2')
    const wrapper = mount(CustCustomPropsGroup, {
      props: {
        group: makeGroup([{ cssVar: '--a', value: '1' }, { cssVar: '--b', value: '2' }], 2),
        isCollapsed: false,
      },
    })
    const rows = wrapper.findAll('.ccp-row')
    await rows[1].find('.ccp-remove-btn').trigger('click')
    expect(composable.customProps['--b']).toBeUndefined()
    expect(composable.customProps['--a']).toBe('1')
    expect(typeof removeCustomProp).toBe('function')
  })

  describe('add form', () => {
    it('disables the Add button until both a --var name and a value are entered', async () => {
      mountCustomizer()
      const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
      const addBtn = wrapper.find('.ccp-add-btn')
      expect(addBtn.attributes('disabled')).toBeDefined()

      await wrapper.find('.ccp-add-input--var').setValue('--my-new-var')
      expect(wrapper.find('.ccp-add-btn').attributes('disabled')).toBeDefined()

      await wrapper.find('.ccp-add-input--val').setValue('10px')
      expect(wrapper.find('.ccp-add-btn').attributes('disabled')).toBeUndefined()
    })

    it('requires the var name to start with --, even via Enter which bypasses the disabled button', async () => {
      const composable = mountCustomizer()
      const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
      await wrapper.find('.ccp-add-input--var').setValue('not-dashed')
      await wrapper.find('.ccp-add-input--val').setValue('10px')
      await wrapper.find('.ccp-add-input--var').trigger('keydown.enter')
      expect(wrapper.find('.ccp-error').text()).toBe('Variable name must start with --')
      expect(composable.customProps['not-dashed']).toBeUndefined()
    })

    it('adding a valid custom prop calls setCustomProp and clears the form', async () => {
      const composable = mountCustomizer()
      const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
      await wrapper.find('.ccp-add-input--var').setValue('--brand-radius')
      await wrapper.find('.ccp-add-input--val').setValue('4px')
      await wrapper.find('.ccp-add-btn').trigger('click')

      expect(composable.customProps['--brand-radius']).toBe('4px')
      expect((wrapper.find('.ccp-add-input--var').element as HTMLInputElement).value).toBe('')
      expect((wrapper.find('.ccp-add-input--val').element as HTMLInputElement).value).toBe('')
      expect(wrapper.find('.ccp-error').exists()).toBe(false)
    })

    it('trims whitespace from the var name and value before adding', async () => {
      const composable = mountCustomizer()
      const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
      await wrapper.find('.ccp-add-input--var').setValue('  --spaced-var  ')
      await wrapper.find('.ccp-add-input--val').setValue('  8px  ')
      await wrapper.find('.ccp-add-btn').trigger('click')
      expect(composable.customProps['--spaced-var']).toBe('8px')
    })

    it('shows an error and does not add when the value is empty', async () => {
      const composable = mountCustomizer()
      const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
      await wrapper.find('.ccp-add-input--var').setValue('--only-name')
      await wrapper.find('.ccp-add-input--var').trigger('keydown.enter')
      expect(wrapper.find('.ccp-error').text()).toBe('Enter a value')
      expect(composable.customProps['--only-name']).toBeUndefined()
    })

    it('shows an error when the var name is empty (whitespace-only input)', async () => {
      const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
      await wrapper.find('.ccp-add-input--var').setValue('   ')
      await wrapper.find('.ccp-add-input--val').setValue('1px')
      await wrapper.find('.ccp-add-input--var').trigger('keydown.enter')
      expect(wrapper.find('.ccp-error').text()).toBe('Enter a CSS variable name')
    })

    it('pressing Enter in either add input triggers the same add flow as clicking Add', async () => {
      const composable = mountCustomizer()
      const wrapper = mount(CustCustomPropsGroup, { props: { group: makeGroup(), isCollapsed: false } })
      await wrapper.find('.ccp-add-input--var').setValue('--enter-var')
      await wrapper.find('.ccp-add-input--val').setValue('1px')
      await wrapper.find('.ccp-add-input--val').trigger('keydown.enter')
      expect(composable.customProps['--enter-var']).toBe('1px')
    })
  })
})
