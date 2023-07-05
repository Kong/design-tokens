const { KONG_TOKEN_PREFIX } = require('./constants')

// returns an array of unique design tokens found in a css value
const extractTokensFromValue = (cssValue) => {
  const regex = new RegExp(`${KONG_TOKEN_PREFIX}[a-zA-Z0-9-]+`, 'g')
  const matches = cssValue.match(regex)

  if (!matches) {
    return []
  }

  const uniqueTokens = [...new Set(matches)]

  return uniqueTokens
}

module.exports = extractTokensFromValue
