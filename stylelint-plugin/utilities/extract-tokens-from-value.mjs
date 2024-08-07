import { KONG_TOKEN_PREFIX } from './constants.mjs'

// returns an array of unique design tokens found in a CSS value
export default function(cssValue) {
  const regex = new RegExp(`${KONG_TOKEN_PREFIX}[a-z0-9-]+`, 'gi')
  const matches = cssValue.match(regex)

  if (!matches) {
    return []
  }

  const uniqueTokens = [...new Set(matches)]

  return uniqueTokens
}
