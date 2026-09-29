import { describe, expect, it } from 'vitest'
import stylelint from 'stylelint'
import scssSyntax from 'postcss-scss'
import plugins from './index.mjs'
import useProperToken from './rules/use-proper-token/index.mjs'
import tokenVarUsage from './rules/token-var-usage/index.mjs'
import { lintCss } from './test-utils.mjs'
import { MALFORMED, TOKEN_VAR_USAGE, USE_PROPER_TOKEN } from './test-fixtures.mjs'

describe('package entry', () => {
  it('default-exports both plugins in a stable order', () => {
    expect(plugins).toEqual([useProperToken, tokenVarUsage])
  })

  it('exposes a createPlugin-shaped object for each rule', () => {
    for (const plugin of plugins) {
      expect(Object.keys(plugin).sort()).toEqual(['rule', 'ruleName'])
      expect(typeof plugin.rule).toBe('function')
    }
  })

  it('namespaces every rule name as <package>/<rule>', () => {
    // A rule name without a `/` is rejected by stylelint as un-namespaced and will not load.
    for (const { ruleName } of plugins) {
      expect(ruleName).toContain('/')
      expect(ruleName.startsWith('@kong/stylelint-plugin-design-tokens/')).toBe(true)
    }

    expect(plugins.map(plugin => plugin.ruleName)).toEqual([
      '@kong/stylelint-plugin-design-tokens/use-proper-token',
      '@kong/stylelint-plugin-design-tokens/token-var-usage',
    ])
  })

  it('declares distinct fixability per rule', () => {
    expect(plugins.map(plugin => plugin.rule.meta.fixable)).toEqual([false, true])
  })

  it('works when the whole array is handed to config.plugins', async () => {
    // Mirrors real consumer usage: `plugins: ['@kong/stylelint-plugin-design-tokens']` resolves
    // to this array, which stylelint flattens. One declaration can trip both rules at once.
    const result = await stylelint.lint({
      code: USE_PROPER_TOKEN.invalid.textTokenScssSigil,
      config: {
        plugins: [plugins],
        rules: {
          '@kong/stylelint-plugin-design-tokens/use-proper-token': true,
          '@kong/stylelint-plugin-design-tokens/token-var-usage': true,
        },
      },
      customSyntax: scssSyntax,
    })

    expect(result.results[0].warnings.map(warning => warning.rule)).toEqual([
      '@kong/stylelint-plugin-design-tokens/use-proper-token',
      '@kong/stylelint-plugin-design-tokens/token-var-usage',
    ])
  })
})

describe('test helper', () => {
  it('throws when the fixture fails to parse rather than reporting a phantom warning', async () => {
    // Guard for the helper itself: stylelint surfaces a CssSyntaxError as an ordinary
    // `warnings[]` entry, NOT in `parseErrors`. Without the `rule !== ruleName` filter a
    // typo'd fixture produces exactly one warning and silently satisfies a length check.
    await expect(lintCss(MALFORMED.unclosedBlock, {
      rule: useProperToken,
      ruleName: useProperToken.ruleName,
    })).rejects.toThrow(/CssSyntaxError/)
  })
})

describe('fixtures', () => {
  const groups = {
    'use-proper-token valid': Object.entries(USE_PROPER_TOKEN.valid),
    'use-proper-token invalid': Object.entries(USE_PROPER_TOKEN.invalid),
    'token-var-usage valid': Object.entries(TOKEN_VAR_USAGE.valid),
    'token-var-usage invalid': Object.entries(TOKEN_VAR_USAGE.invalid).map(([name, { code }]) => [name, code]),
  }

  it.each(Object.entries(groups))('has no duplicate snippets in %s', (_group, entries) => {
    // The whole point of centralising fixtures is that near-identical snippets stop
    // multiplying. Two names for the same source means one of them is redundant.
    const seen = new Map()

    for (const [name, code] of entries) {
      expect(seen.get(code), `${name} duplicates ${seen.get(code)}`).toBeUndefined()
      seen.set(code, name)
    }
  })
})
