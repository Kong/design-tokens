import { describe, expect, it } from 'vitest'
import plugin from './index.mjs'
import { createRuleLinter } from '../../test/test-utils.mjs'
import { USE_PROPER_TOKEN } from '../../test/test-fixtures.mjs'

const linter = createRuleLinter(plugin)
const { valid, invalid } = USE_PROPER_TOKEN

/**
 * Fixture name -> the `[token, property]` pairs it is expected to report, in order.
 * Messages are built from the rule's own `messages.unexpected()` so the text is never
 * retyped here and the `(ruleName)` suffix stays in sync automatically.
 */
const EXPECTED = {
  textTokenBothSigils: [['kui-color-text-primary', 'background-color']],
  textTokenCssSigil: [['kui-color-text-primary', 'background-color']],
  textTokenScssSigil: [['kui-color-text-primary', 'background-color']],
  spaceTokenOnTop: [['kui-space-40', 'top']],
  spaceTokenOnInset: [['kui-space-40', 'inset']],
  spaceTokenOnBackgroundSize: [['kui-space-40', 'background-size']],
  // Two distinct inappropriate tokens in one declaration report separately
  twoBadTokensOnColor: [['kui-space-40', 'color'], ['kui-border-width-10', 'color']],
  // ...but the same token twice is deduped by `extractTokensFromValue`
  sameBadTokenTwice: [['kui-space-40', 'color']],
  mixedGoodAndBadOnPadding: [['kui-color-text-primary', 'padding']],
  spaceTokenOnHeight: [['kui-space-40', 'height']],
  fontSizeTokenOnFontFamily: [['kui-font-size-30', 'font-family']],
  uppercaseToken: [['kui-COLOR-TEXT-PRIMARY', 'color']],
}

const expectedMessages = name => EXPECTED[name].map(([token, property]) => linter.messages.unexpected(token, property))

describe('@kong/stylelint-plugin-design-tokens/use-proper-token', () => {
  describe('valid', () => {
    it.each(Object.entries(valid))('reports nothing for %s', async (name, code) => {
      const { messages, output } = await linter.lintAndFix(code)

      expect(messages, `${name} should not report`).toEqual([])
      // The rule is not fixable, so a fix pass must be a no-op for valid sources too
      expect(output, `${name} should not be rewritten`).toBe(code)
    })
  })

  describe('invalid', () => {
    it('has an expectation for every invalid fixture', () => {
      expect(Object.keys(EXPECTED).sort()).toEqual(Object.keys(invalid).sort())
    })

    it.each(Object.entries(invalid))('reports the expected tokens for %s', async (name, code) => {
      const { messages } = await linter.lint(code)

      expect(messages, `${name} reported the wrong tokens`).toEqual(expectedMessages(name))
    })

    it.each(Object.entries(invalid))('never rewrites %s, because the rule is not fixable', async (name, code) => {
      // `meta.fixable` is false and the rule passes no `fix` callback, so running stylelint
      // in autofix mode still reports and leaves the source untouched.
      expect(await linter.fix(code), `${name} was rewritten`).toBe(code)
    })
  })

  describe('warning position', () => {
    it('anchors the warning to the whole declaration, not the offending token', async () => {
      const { warnings } = await linter.lint(invalid.textTokenScssSigil)

      expect(warnings[0]).toMatchObject({ line: 1, column: 6, endLine: 1, endColumn: 48, severity: 'error' })
    })

    it('gives two bad tokens in one declaration the same range, differing only in text', async () => {
      const { warnings } = await linter.lint(invalid.twoBadTokensOnColor)

      expect(warnings).toHaveLength(2)
      expect(warnings[0]).toMatchObject({ line: 1, column: 6, endLine: 1, endColumn: 48 })
      expect(warnings[1]).toMatchObject({ line: 1, column: 6, endLine: 1, endColumn: 48 })
      expect(warnings[0].text).not.toBe(warnings[1].text)
    })
  })

  describe('options', () => {
    // KNOWN LIMITATION (S8): the rule calls `validateOptions(result, ruleName, {})` with an
    // empty descriptor, so nothing is validated and typos in a consumer's config are silently
    // ignored. The README also documents a `disableFix` option that the rule never reads —
    // and which would be meaningless anyway, since the rule is not fixable.
    it.each([
      ['bare true', true],
      ['primary only', [true]],
      ['the options the README documents', [true, { disableFix: true, severity: 'error' }]],
      ['an entirely unknown secondary option', [true, { bogus: 1 }]],
    ])('accepts %s without an invalid-option warning', async (_label, options) => {
      const { messages } = await linter.lint(valid.noVariable, { options })

      expect(messages).toEqual([])
    })

    it('honours the core severity secondary option', async () => {
      // `severity` is handled by stylelint core, not by the rule, which is why it works
      // despite the rule ignoring its options entirely.
      const { warnings } = await linter.lint(invalid.textTokenScssSigil, { options: [true, { severity: 'warning' }] })

      expect(warnings.map(warning => warning.severity)).toEqual(['warning'])
    })
  })

  describe('metadata', () => {
    it('is namespaced and declares itself unfixable', () => {
      expect(plugin.ruleName).toBe('@kong/stylelint-plugin-design-tokens/use-proper-token')
      expect(plugin.rule.meta.fixable).toBe(false)
    })

    it('builds the message with the token and property interpolated', () => {
      expect(linter.messages.unexpected('kui-space-40', 'color'))
        .toBe("Unexpected usage of 'kui-space-40' token in 'color' property. (@kong/stylelint-plugin-design-tokens/use-proper-token)")
    })

    it('points at a documentation url', () => {
      // KNOWN ISSUE (S9): this url 404s — the top-level `stylelint-plugin/` directory no longer
      // holds a README. The real doc is packages/stylelint-plugin-design-tokens/README.md.
      expect(plugin.rule.meta.url).toBe('https://github.com/Kong/design-tokens/blob/main/stylelint-plugin/README.md')
    })
  })
})
