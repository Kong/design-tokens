// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InstructionsPanel from './InstructionsPanel.vue'

// InstructionsPanel is static markup with no props, emits, or reactive branches.
// These tests assert the actual instructional content stays intact (script paths,
// commands, and the two-file/two-layer explanation) rather than padding with
// trivial "mounts without crashing" filler.
describe('InstructionsPanel', () => {
  it('documents the theme-scaffold command for starting a new theme', () => {
    const wrapper = mount(InstructionsPanel)
    expect(wrapper.text()).toContain('node scripts/theme-scaffold.mjs <name>')
  })

  it('documents the build+test command for finishing up', () => {
    const wrapper = mount(InstructionsPanel)
    expect(wrapper.text()).toContain('pnpm build:tokens && pnpm test')
  })

  it('names both source files edited by the tool', () => {
    const wrapper = mount(InstructionsPanel)
    expect(wrapper.text()).toContain('*.theme.json')
    expect(wrapper.text()).toContain('*.alias.color.json')
  })

  it('explains the two override layers (color alias cascade vs. per-token override)', () => {
    const wrapper = mount(InstructionsPanel)
    const text = wrapper.text()
    expect(text).toContain('Color aliases')
    expect(text).toContain('cascades into every')
    expect(text).toContain('Tokens')
    expect(text).toContain('wins over')
  })

  it('renders exactly five section headings in document order', () => {
    const wrapper = mount(InstructionsPanel)
    const headings = wrapper.findAll('.ip-heading').map((h) => h.text())
    expect(headings).toEqual([
      'What this is',
      'Starting a new theme',
      'Editing an existing theme',
      'While editing',
      'Finishing up',
    ])
  })

  it('renders two ordered steps for starting a new theme', () => {
    const wrapper = mount(InstructionsPanel)
    expect(wrapper.findAll('.ip-steps li')).toHaveLength(2)
  })

  it('renders three list items describing the editing panels', () => {
    const wrapper = mount(InstructionsPanel)
    const items = wrapper.findAll('.ip-list li').map((li) => li.text())
    expect(items).toHaveLength(3)
    expect(items[0]).toContain('Color aliases')
    expect(items[1]).toContain('Tokens')
    expect(items[2]).toContain('Export')
  })

  it('renders two code blocks (scaffold command and build+test command)', () => {
    const wrapper = mount(InstructionsPanel)
    const blocks = wrapper.findAll('.ip-code').map((b) => b.text())
    expect(blocks).toEqual([
      'node scripts/theme-scaffold.mjs <name>',
      'pnpm build:tokens && pnpm test',
    ])
  })
})
