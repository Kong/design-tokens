const PROPERTY_TOKEN_MAP = require('./token-map')
const { KONG_TOKEN_PREFIX, extractTokensFromValue } = require('../../utilities')

/**
 * @param {Object} decl PostCSS AST declaration node (https://postcss.org/api/#declaration)
 * @returns {Array} Array of inappropriate tokens
 */
const getInappropriateTokens = (decl) => {
  const declProp = decl.prop
  const declValue = decl.value

  // check if the value contains a token as CSS or SCSS variable
  const hasToken = [`--${KONG_TOKEN_PREFIX}`, `$${KONG_TOKEN_PREFIX}`].some(pattern => declValue.includes(pattern))
  if (!hasToken) {
    // skip validating if the value does not contain a token
    return []
  }

  const tokenProperty = Object.keys(PROPERTY_TOKEN_MAP).find(key => key.split(',').some(prop => prop === declProp))

  // check if the property is in the property map
  const isEnforcedProp = !!tokenProperty
  if (!isEnforcedProp) {
    return []
  }

  const valueTokens = extractTokensFromValue(declValue)
  // get the appropriate tokens for the property and create regex for each
  // regex pattern: /kui-(?:[a-z0-9-]+-)?token(?:-[a-z0-9-]+)?$/
  // this allows to match both regular and component tokens
  const appropriateTokens = PROPERTY_TOKEN_MAP[tokenProperty].map(token => new RegExp(KONG_TOKEN_PREFIX + '(?:[a-z0-9-]+-)?' + token + '(?:-[a-z0-9-]+)?$'))
  // filter out tokens that are not appropriate for the property
  const inappropriateTokens = valueTokens.filter(vToken => !appropriateTokens.some(aTokenRegex => aTokenRegex.test(vToken)))

  return inappropriateTokens
}

export default getInappropriateTokens
