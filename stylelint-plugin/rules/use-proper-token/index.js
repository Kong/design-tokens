const stylelint = require('stylelint')
const { ruleMessages, validateOptions, report } = stylelint.utils
const { RULE_NAME_PREFIX } = require('../../utilities')
const getInappropriateTokens = require('./get-inappropriate-tokens')

const ruleName = `${RULE_NAME_PREFIX}/use-proper-token`
const messages = ruleMessages(ruleName, {
  unexpected: (token, property) => `Unexpected usage of "${token}" token in "${property}" property`,
})
const meta = {
  url: 'https://github.com/Kong/design-tokens/blob/main/stylelint-plugin/README.md',
  fixable: false,
}

const ruleFunction = () => {
  return (postcssRoot, postcssResult) => {
    const validOptions = validateOptions(postcssResult, ruleName, {})

    if (!validOptions) {
      return
    }

    postcssRoot.walkDecls((decl) => {
      const inappropriateTokens = getInappropriateTokens(decl)

      if (inappropriateTokens.length) {
        // report the error for each inappropriate token
        inappropriateTokens.forEach((token) => {
          report({
            message: messages.unexpected(token, decl.prop),
            node: decl,
            result: postcssResult,
            ruleName,
          })
        })
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

module.exports = stylelint.createPlugin(ruleName, ruleFunction)
