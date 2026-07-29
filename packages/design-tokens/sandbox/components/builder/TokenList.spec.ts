// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TokenList from './TokenList.vue'
import TokenRow from './TokenRow.vue'
import type { BuilderToken } from '../../utils/themeBuilderUtils'

function makeToken(overrides: Partial<BuilderToken> = {}): BuilderToken {
  return {
    key: 'kui-color-background-primary',
    cssVar: '--kui-color-background-primary',
    rawValue: '{color.alias.blue.30}',
    isColor: true,
    derivedValue: '#3B82F6',
    source: 'inherited',
    ...overrides,
  }
}

const ALIAS_FLAT = [
  { key: 'blue.30', family: 'blue', step: '30', baseHex: '#3B82F6' },
]

describe('TokenList', () => {
  it('renders one TokenRow per token, passing through aliasFlat', () => {
    const tokens = [
      makeToken(),
      makeToken({ key: 'kui-space-40', cssVar: '--kui-space-40', isColor: false, rawValue: '16px' }),
    ]
    const wrapper = mount(TokenList, { props: { tokens, aliasFlat: ALIAS_FLAT } })
    const rows = wrapper.findAllComponents(TokenRow)
    expect(rows).toHaveLength(2)
    expect(rows[0].props('aliasFlat')).toEqual(ALIAS_FLAT)
  })

  it('shows the empty-state message with the filter text when nothing matches', async () => {
    const wrapper = mount(TokenList, { props: { tokens: [makeToken()], aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.tl-search').setValue('nonexistent-token')
    expect(wrapper.find('.tl-empty').exists()).toBe(true)
    expect(wrapper.find('.tl-empty').text()).toBe('No tokens match "nonexistent-token"')
    expect(wrapper.findAllComponents(TokenRow)).toHaveLength(0)
  })

  it('does not show the empty state when tokens are present and unfiltered', () => {
    const wrapper = mount(TokenList, { props: { tokens: [makeToken()], aliasFlat: ALIAS_FLAT } })
    expect(wrapper.find('.tl-empty').exists()).toBe(false)
  })

  it('shows the empty state for an empty token list', () => {
    const wrapper = mount(TokenList, { props: { tokens: [], aliasFlat: ALIAS_FLAT } })
    expect(wrapper.find('.tl-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('No tokens match ""')
  })

  it('filters the visible rows by the fuzzy search text against cssVar', async () => {
    const tokens = [
      makeToken(),
      makeToken({ key: 'kui-space-40', cssVar: '--kui-space-40', isColor: false, rawValue: '16px' }),
    ]
    const wrapper = mount(TokenList, { props: { tokens, aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.tl-search').setValue('space')
    const rows = wrapper.findAllComponents(TokenRow)
    expect(rows).toHaveLength(1)
    expect(rows[0].props('token').cssVar).toBe('--kui-space-40')
  })

  it('re-emits reset from a row with the token key', async () => {
    const wrapper = mount(TokenList, { props: { tokens: [makeToken({ source: 'overridden' })], aliasFlat: ALIAS_FLAT } })
    await wrapper.findComponent(TokenRow).vm.$emit('reset', 'kui-color-background-primary')
    expect(wrapper.emitted('reset')).toEqual([['kui-color-background-primary']])
  })

  it('re-emits set from a row with the token key and value', async () => {
    const wrapper = mount(TokenList, { props: { tokens: [makeToken()], aliasFlat: ALIAS_FLAT } })
    await wrapper.findComponent(TokenRow).vm.$emit('set', 'kui-color-background-primary', '{color.alias.gray.10}')
    expect(wrapper.emitted('set')).toEqual([['kui-color-background-primary', '{color.alias.gray.10}']])
  })

  it('the modified-only toggle is disabled with zero modified tokens and shows a zero count', () => {
    const wrapper = mount(TokenList, { props: { tokens: [makeToken()], aliasFlat: ALIAS_FLAT } })
    const btn = wrapper.find('.tl-modified-btn')
    expect(btn.attributes('disabled')).toBeDefined()
    expect(btn.text()).toBe('Show modified (0)')
  })

  it('the modified-only toggle is enabled and counts overridden tokens correctly', () => {
    const tokens = [
      makeToken({ source: 'overridden' }),
      makeToken({ key: 'kui-space-40', cssVar: '--kui-space-40', source: 'inherited' }),
    ]
    const wrapper = mount(TokenList, { props: { tokens, aliasFlat: ALIAS_FLAT } })
    const btn = wrapper.find('.tl-modified-btn')
    expect(btn.attributes('disabled')).toBeUndefined()
    expect(btn.text()).toBe('Show modified (1)')
  })

  it('restricts the visible rows to overridden tokens when modified-only is toggled on', async () => {
    const tokens = [
      makeToken({ source: 'overridden' }),
      makeToken({ key: 'kui-space-40', cssVar: '--kui-space-40', source: 'inherited' }),
    ]
    const wrapper = mount(TokenList, { props: { tokens, aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.tl-modified-btn').trigger('click')
    expect(wrapper.findAllComponents(TokenRow)).toHaveLength(1)
    expect(wrapper.find('.tl-modified-btn').text()).toBe('✕ Modified only (1)')
    expect(wrapper.find('.tl-modified-btn').attributes('aria-pressed')).toBe('true')
  })

  it('shows all rows again once modified-only is toggled back off', async () => {
    const tokens = [
      makeToken({ source: 'overridden' }),
      makeToken({ key: 'kui-space-40', cssVar: '--kui-space-40', source: 'inherited' }),
    ]
    const wrapper = mount(TokenList, { props: { tokens, aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.tl-modified-btn').trigger('click')
    await wrapper.find('.tl-modified-btn').trigger('click')
    expect(wrapper.findAllComponents(TokenRow)).toHaveLength(2)
  })

  it('combines search and modified-only filters (both must match)', async () => {
    const tokens = [
      makeToken({ source: 'overridden' }),
      makeToken({ key: 'kui-space-40', cssVar: '--kui-space-40', source: 'overridden' }),
    ]
    const wrapper = mount(TokenList, { props: { tokens, aliasFlat: ALIAS_FLAT } })
    await wrapper.find('.tl-modified-btn').trigger('click')
    await wrapper.find('.tl-search').setValue('space')
    const rows = wrapper.findAllComponents(TokenRow)
    expect(rows).toHaveLength(1)
    expect(rows[0].props('token').cssVar).toBe('--kui-space-40')
  })
})
