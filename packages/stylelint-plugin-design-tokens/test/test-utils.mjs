import stylelint from 'stylelint'
import scssSyntax from 'postcss-scss'

/**
 * Runs stylelint over an inline fixture with exactly one plugin rule enabled.
 *
 * Fails loudly on anything that is not a warning from the rule under test.
 * Stylelint reports fixture syntax errors as ordinary `warnings[]` entries with
 * `rule: 'CssSyntaxError'` — NOT in `parseErrors` — so a typo'd fixture would
 * otherwise read as "the rule fired once" and quietly satisfy a length check.
 *
 * @param {string} code - Inline SCSS/CSS source
 * @param {object} opts
 * @param {object} opts.rule - The imported plugin object (`{ ruleName, rule }`)
 * @param {string} opts.ruleName - Fully qualified rule name
 * @param {boolean} [opts.fix] - Run stylelint in autofix mode
 * @param {*} [opts.options] - Rule config value (defaults to `true`)
 * @param {*} [opts.syntax] - Custom syntax (defaults to postcss-scss)
 * @returns {Promise<{ warnings: object[], messages: string[], output: string }>}
 */
export const lintCss = async (code, { rule, ruleName, fix = false, options = true, syntax = scssSyntax } = {}) => {
  const result = await stylelint.lint({
    code,
    config: {
      plugins: [rule],
      rules: { [ruleName]: options },
    },
    customSyntax: syntax,
    fix,
  })

  const [first] = result.results
  const foreign = first.warnings.filter(warning => warning.rule !== ruleName)

  if (foreign.length || first.parseErrors.length || first.invalidOptionWarnings.length) {
    const details = [
      ...foreign.map(warning => `  [${warning.rule}] ${warning.text} (${warning.line}:${warning.column})`),
      ...first.parseErrors.map(error => `  [parseError] ${error.text}`),
      ...first.invalidOptionWarnings.map(option => `  [invalidOption] ${option.text}`),
    ]

    throw new Error(
      `Fixture did not lint cleanly under ${ruleName}.\n`
      + `Fixture:\n${code}\n`
      + `Unexpected diagnostics:\n${details.join('\n')}`,
    )
  }

  return {
    warnings: first.warnings,
    messages: first.warnings.map(warning => warning.text),
    // `result.code` is only populated when `fix: true` and `code` was provided
    output: result.code ?? code,
  }
}

/**
 * Binds {@link lintCss} to a single plugin so specs never repeat `{ rule, ruleName }`,
 * and can never enable a rule name that does not belong to the plugin they passed.
 *
 * @param {{ ruleName: string, rule: Function }} plugin - Default export of a rule module
 */
export const createRuleLinter = (plugin) => {
  const bound = { rule: plugin, ruleName: plugin.ruleName }

  return {
    ruleName: plugin.ruleName,
    messages: plugin.rule.messages,
    meta: plugin.rule.meta,

    /** Lint without autofix — the only pass that yields warnings for fixable rules. */
    lint: (code, options) => lintCss(code, { ...bound, ...options }),

    /** Lint with autofix — returns the rewritten source. Warnings are suppressed by stylelint. */
    fix: async (code, options) => (await lintCss(code, { ...bound, fix: true, ...options })).output,

    /**
     * Two-pass run. Required because `report()` returns early without recording a
     * warning once a `fix` callback has been applied, so a single run can never
     * assert both the message and the fixed output.
     */
    lintAndFix: async (code, options) => {
      const reported = await lintCss(code, { ...bound, ...options })
      const fixed = await lintCss(code, { ...bound, fix: true, ...options })

      return { warnings: reported.warnings, messages: reported.messages, output: fixed.output }
    },
  }
}
