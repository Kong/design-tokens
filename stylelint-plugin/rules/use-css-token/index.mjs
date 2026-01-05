import stylelint from 'stylelint'
import { KONG_TOKEN_PREFIX, RULE_NAME_PREFIX } from '../../utilities/index.mjs'

const { ruleMessages, validateOptions, report } = stylelint.utils
const ruleName = `${RULE_NAME_PREFIX}/use-css-token`
const messages = ruleMessages(ruleName, {
  expected: 'SCSS tokens must be used as fallback values in CSS custom properties. Use format: var(--kui-design-token, $kui-design-token)',
})
const meta = {
  url: 'https://github.com/Kong/design-tokens/blob/main/stylelint-plugin/README.md',
  fixable: true,
}

// Convert SCSS token ($kui-token) to CSS token (--kui-token)
const getCssToken = (scssToken) => {
  const tokenName = scssToken.substring(1) // Remove $
  return `--${tokenName}`
}

// Find all occurrences of a token in a value
const findAllTokenOccurrences = (value, token) => {
  const occurrences = []
  let searchIndex = 0
  while (true) {
    const index = value.indexOf(token, searchIndex)
    if (index === -1) {
      break
    }
    occurrences.push(index)
    searchIndex = index + 1
  }
  return occurrences
}

// Check if token at given position is properly wrapped in var()
const isTokenProperlyWrapped = (value, tokenIndex, token, cssToken) => {
  // Find the var() expression that contains this token
  // Look backwards to find the nearest var( before the token
  const beforeToken = value.substring(0, tokenIndex)
  const varStartIndex = beforeToken.lastIndexOf('var(')

  if (varStartIndex === -1) {
    return false
  }

  // Find the matching closing parenthesis starting from var(
  let parenCount = 0
  let searchIndex = varStartIndex
  let varEndIndex = -1

  while (searchIndex < value.length) {
    const char = value[searchIndex]
    if (char === '(') {
      parenCount++
    } else if (char === ')') {
      parenCount--
      if (parenCount === 0) {
        varEndIndex = searchIndex
        break
      }
    }
    searchIndex++
  }

  if (varEndIndex === -1) {
    return false
  }

  // Verify the token is actually inside this var() expression
  const tokenEndIndex = tokenIndex + token.length
  if (tokenIndex < varStartIndex || tokenEndIndex > varEndIndex) {
    return false
  }

  // Extract the full var() expression and check if it matches the pattern
  const varExpression = value.substring(varStartIndex, varEndIndex + 1)
  const expectedPattern = new RegExp(`^var\\(\\s*${cssToken}\\s*,\\s*${token}\\s*\\)$`)
  return expectedPattern.test(varExpression)
}

const ruleFunction = () => {
  return (postcssRoot, postcssResult) => {
    const validOptions = validateOptions(postcssResult, ruleName, {})

    if (!validOptions) {
      return
    }

    postcssRoot.walkDecls((decl) => {
      const declValue = decl.value

      // Extract all SCSS tokens (starting with $kui-)
      const scssTokenRegex = new RegExp(`\\$${KONG_TOKEN_PREFIX}[a-z0-9-]+`, 'g')
      const scssTokens = declValue.match(scssTokenRegex)

      // If no SCSS tokens are used, skip validation
      if (!scssTokens || scssTokens.length === 0) {
        return
      }

      // Get unique SCSS tokens
      const uniqueScssTokens = Array.from(new Set(scssTokens))

      // Check if each SCSS token is properly wrapped in var()
      // Pattern: var(--kui-token-name, $kui-token-name)
      const improperlyUsedTokens = []

      uniqueScssTokens.forEach((scssToken) => {
        const cssToken = getCssToken(scssToken)
        const tokenOccurrences = findAllTokenOccurrences(declValue, scssToken)

        // Check each occurrence to see if it's properly wrapped
        const hasImproperUsage = tokenOccurrences.some((tokenIndex) => {
          return !isTokenProperlyWrapped(declValue, tokenIndex, scssToken, cssToken)
        })

        if (hasImproperUsage) {
          improperlyUsedTokens.push(scssToken)
        }
      })

      if (improperlyUsedTokens.length > 0) {
        // Create fix function
        const fix = () => {
          let fixedValue = declValue
          const replacements = []

          // First, identify all positions that need to be replaced
          improperlyUsedTokens.forEach((scssToken) => {
            const cssToken = getCssToken(scssToken)
            const tokenOccurrences = findAllTokenOccurrences(fixedValue, scssToken)
            const properFormat = `var(${cssToken}, ${scssToken})`

            tokenOccurrences.forEach((index) => {
              // Check if this occurrence is in proper format
              if (!isTokenProperlyWrapped(fixedValue, index, scssToken, cssToken)) {
                // This occurrence needs to be replaced
                replacements.push({
                  start: index,
                  end: index + scssToken.length,
                  replacement: properFormat,
                })
              }
            })
          })

          // Sort replacements by position (descending) to avoid offset issues
          replacements.sort((a, b) => b.start - a.start)

          // Apply replacements from end to start
          replacements.forEach(({ start, end, replacement }) => {
            fixedValue = fixedValue.substring(0, start) + replacement + fixedValue.substring(end)
          })

          decl.value = fixedValue
        }

        report({
          message: messages.expected,
          node: decl,
          result: postcssResult,
          ruleName,
          fix,
        })
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

export default stylelint.createPlugin(ruleName, ruleFunction)

