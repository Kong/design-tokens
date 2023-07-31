const { KONG_TOKEN_PREFIX, RULE_NAME_PREFIX } = require('./constants')
const extractTokensFromValue = require('./extract-tokens-from-value')

module.exports = {
  KONG_TOKEN_PREFIX,
  extractTokensFromValue,
  RULE_NAME_PREFIX,
}
