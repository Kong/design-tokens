import { describe, expect, it } from 'vitest'
import plugin from './index.mjs'
import { createRuleLinter } from '../../test/test-utils.mjs'
import { TOKEN_VAR_USAGE } from '../../test/test-fixtures.mjs'

const linter = createRuleLinter(plugin)
const { valid, invalid } = TOKEN_VAR_USAGE

describe('@kong/stylelint-plugin-design-tokens/token-var-usage', () => {
  describe('valid', () => {
    it.each(Object.entries(valid))('reports nothing for %s', async (name, code) => {
      const { messages, output } = await linter.lintAndFix(code)

      expect(messages, `${name} should not report`).toEqual([])
      expect(output, `${name} should not be rewritten`).toBe(code)
    })
  })

  describe('invalid', () => {
    it.each(Object.entries(invalid))('reports exactly once for %s', async (name, { code }) => {
      const { messages } = await linter.lint(code)

      // This rule accumulates every offending token in a declaration and then reports ONE
      // warning for the declaration as a whole — see `twoBareTokens` and `threeBareTokens`,
      // which each produce a single message. The message never names the offending token.
      expect(messages, `${name} reported the wrong messages`).toEqual([linter.messages.expected])
    })

    it.each(Object.entries(invalid))('autofixes %s to the expected output', async (name, { code, output }) => {
      // `output: null` means the rule reports but its fix deliberately declines to act.
      expect(await linter.fix(code), `${name} produced the wrong fix`).toBe(output ?? code)
    })
  })

  describe('autofix stability', () => {
    it.each(Object.entries(valid))('leaves already-correct source %s byte-identical', async (name, code) => {
      expect(await linter.fix(code), `${name} was rewritten`).toBe(code)
    })

    it.each(Object.entries(invalid))('reaches a stable fixpoint for %s', async (name, { code }) => {
      const once = await linter.fix(code)

      // A second pass changes nothing, so the S1/S2 double-wrap is a correctness bug rather
      // than an unbounded-growth one — repeated `--fix` runs cannot keep nesting var()s.
      expect(await linter.fix(once), `${name} is not a stable fixpoint`).toBe(once)
    })

    it.each(Object.entries(invalid).filter(([, { output }]) => output !== null))(
      'no longer reports once %s has been fixed',
      async (name, { code }) => {
        // Only fixtures the rule actually rewrites can become clean. `standaloneInterpolation`
        // is excluded by the filter above: the rule reports it and then deliberately declines
        // to fix it, so it reports forever by design (README limitation #2).
        const once = await linter.fix(code)

        expect((await linter.lint(once)).messages, `${name} still reports after being fixed`).toEqual([])
      },
    )
  })

  describe('metadata', () => {
    it('is namespaced and declares itself fixable', () => {
      expect(plugin.ruleName).toBe('@kong/stylelint-plugin-design-tokens/token-var-usage')
      // `meta.fixable: true` is load-bearing, not documentation: stylelint's `report()` throws
      // if a rule passes a `fix` callback while `meta.fixable` is falsy, and this rule always
      // passes one. Flipping this flag breaks the rule at runtime, not just under --fix.
      expect(plugin.rule.meta.fixable).toBe(true)
    })

    it('exposes a single, static expected message', () => {
      expect(plugin.rule.messages.expected).toBe(
        'SCSS tokens must be used as fallback values in CSS custom properties. '
        + 'Use format: var(--kui-design-token, $kui-design-token) or var(--kui-design-token, #{$kui-design-token}) '
        + 'for interpolation, with exactly one space after the comma and no other spaces. '
        + '(@kong/stylelint-plugin-design-tokens/token-var-usage)',
      )
    })

    it('points at a documentation url', () => {
      // KNOWN ISSUE (S9): this url 404s. See the matching note in use-proper-token's spec.
      expect(plugin.rule.meta.url).toBe('https://github.com/Kong/design-tokens/blob/main/stylelint-plugin/README.md')
    })
  })
})
