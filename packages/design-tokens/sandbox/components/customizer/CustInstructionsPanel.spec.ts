// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CustInstructionsPanel from './CustInstructionsPanel.vue'

describe('CustInstructionsPanel', () => {
  it('explains what the tool is and how to use it', () => {
    const wrapper = mount(CustInstructionsPanel)
    expect(wrapper.text()).toContain('Token Customizer overrides')
    expect(wrapper.text()).toContain('Live preview')
    expect(wrapper.text()).toContain('Export')
  })
})
