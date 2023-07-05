const stylelint = require('stylelint')
const { ruleMessages, validateOptions, report } = stylelint.utils
const { KONG_TOKEN_PREFIX, PROPERTY_TOKEN_MAP, extractTokensFromValue, RULE_NAME_PREFIX } = require('../../utilities')

const ruleName = `${RULE_NAME_PREFIX}/use-proper-token`
const messages = ruleMessages(ruleName, {
  unexpected: (token, property) => `Unexpected usage of '${token}' token in '${property}' property.`,
})
const meta = {
  // TODO: add separate docs file for all rules
  url: 'https://github.com/Kong/design-tokens#readme',
  fixable: false,
}

const ruleFunction = () => {
  return (postcssRoot, postcssResult) => {
    const validOptions = validateOptions(postcssResult, ruleName, {})

    if (!validOptions) {
      return
    }

    postcssRoot.walkDecls((decl) => {
      /**
       * PostCSS AST declaration node
       * Docs: https://postcss.org/api/#declaration
       */

      const declProp = decl.prop
      const declValue = decl.value
      const hasToken = declValue.includes(`--${KONG_TOKEN_PREFIX}`) || declValue.includes(`$${KONG_TOKEN_PREFIX}`)
      if (!hasToken) {
        return
      }

      // check if the property is in the property map
      const isEnforcedProp = !!Object.keys(PROPERTY_TOKEN_MAP).find(key => key.split(',').some(prop => prop === declProp))
      if (!isEnforcedProp) {
        return
      }

      const valueTokens = extractTokensFromValue(declValue)
      const appropriateTokens = PROPERTY_TOKEN_MAP[Object.keys(PROPERTY_TOKEN_MAP).find(key => key.split(',').some(prop => prop === declProp))].map(token => KONG_TOKEN_PREFIX.concat(token))
      const inappropriateTokens = valueTokens.filter(vToken => !appropriateTokens.some(aToken => vToken.includes(aToken)))

      if (inappropriateTokens.length) {
        inappropriateTokens.forEach((token) => {
          report({
            message: messages.unexpected(token, declProp),
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
