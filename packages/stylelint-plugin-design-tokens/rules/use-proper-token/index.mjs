import stylelint from 'stylelint'
import { PROPERTY_TOKEN_MAP } from './token-map.mjs'
import { KONG_TOKEN_PREFIX, extractTokensFromValue, RULE_NAME_PREFIX } from '../../utilities/index.mjs'

const { ruleMessages, validateOptions, report } = stylelint.utils
const ruleName = `${RULE_NAME_PREFIX}/use-proper-token`
const messages = ruleMessages(ruleName, {
  unexpected: (token, property) => `Unexpected usage of '${token}' token in '${property}' property.`,
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
      /**
       * PostCSS AST declaration node
       * Docs: https://postcss.org/api/#declaration
       */

      const declProp = decl.prop
      const declValue = decl.value
      // check if the value contains a token as CSS or SCSS variable
      const hasToken = [`--${KONG_TOKEN_PREFIX}`, `$${KONG_TOKEN_PREFIX}`].some(pattern => declValue.includes(pattern))
      if (!hasToken) {
        // skip validating if the value does not contain a token
        return
      }

      const tokenProperty = Object.keys(PROPERTY_TOKEN_MAP).find(key => key.split(',').some(prop => prop === declProp))

      // check if the property is in the property map
      const isEnforcedProp = !!tokenProperty
      if (!isEnforcedProp) {
        return
      }

      const valueTokens = extractTokensFromValue(declValue)
      // get the appropriate tokens for the property and create regex for each
      // regex pattern: /kui-(?:[a-z0-9-]+-)?token(?:-[a-z0-9-]+)?$/
      // this allows to match both regular and component tokens
      const appropriateTokens = PROPERTY_TOKEN_MAP[tokenProperty].map(token => new RegExp(KONG_TOKEN_PREFIX + '(?:[a-z0-9-]+-)?' + token + '(?:-[a-z0-9-]+)?$'))
      // filter out tokens that are not appropriate for the property
      const inappropriateTokens = valueTokens.filter(vToken => !appropriateTokens.some(aTokenRegex => aTokenRegex.test(vToken)))

      if (inappropriateTokens.length) {
        // report the error for each inappropriate token
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

export default stylelint.createPlugin(ruleName, ruleFunction)
