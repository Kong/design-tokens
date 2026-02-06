import stylelint from 'stylelint'
import { KONG_TOKEN_PREFIX, RULE_NAME_PREFIX } from '../../utilities/index.mjs'

const { ruleMessages, validateOptions, report } = stylelint.utils
const ruleName = `${RULE_NAME_PREFIX}/token-var-usage`
const messages = ruleMessages(ruleName, {
  expected: 'SCSS tokens must be used as fallback values in CSS custom properties. Use format: var(--kui-design-token, $kui-design-token) or var(--kui-design-token, #{$kui-design-token}) for interpolation, with exactly one space before the comma and no other spaces.',
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

// Check if token is inside standalone interpolation (#{$token}) without var() wrapper
const isTokenInStandaloneInterpolation = (value, tokenIndex, token) => {
  // Check if token is inside #{...}
  const beforeToken = value.substring(0, tokenIndex)
  const afterTokenStart = tokenIndex + token.length

  // Look for #{ before the token
  const interpolationStartIndex = beforeToken.lastIndexOf('#{')
  if (interpolationStartIndex === -1) {
    return false
  }

  // Check if there's anything between #{ and the token (should be nothing or whitespace)
  const betweenInterpolationAndToken = value.substring(interpolationStartIndex + 2, tokenIndex)
  if (betweenInterpolationAndToken.trim() !== '') {
    return false
  }

  // Look for } after the token
  const afterToken = value.substring(afterTokenStart)
  const interpolationEndMatch = afterToken.match(/^\s*}/)
  if (!interpolationEndMatch) {
    return false
  }

  // Now check if this #{$token} is inside a var() function
  // If it is, it's not "standalone" interpolation
  const fullBeforeToken = value.substring(0, interpolationStartIndex)
  const varStartIndex = fullBeforeToken.lastIndexOf('var(')

  if (varStartIndex !== -1) {
    // Check if the var() contains this interpolation
    // Find the closing paren of the var()
    let parenCount = 0
    let searchIndex = varStartIndex

    while (searchIndex < value.length) {
      const char = value[searchIndex]
      if (char === '(') {
        parenCount++
      } else if (char === ')') {
        parenCount--
        if (parenCount === 0) {
          // Found the closing paren
          // Check if our token is inside this var()
          if (tokenIndex < searchIndex) {
            // Token is inside the var(), so this is NOT standalone interpolation
            return false
          }
          break
        }
      }
      searchIndex++
    }
  }

  return true
}

// Check if token at given position is properly wrapped in var()
// Accepts both formats:
// - var(--token, $token) with exactly one space before comma
// - var(--token, #{$token}) with exactly one space before comma (interpolated)
const isTokenProperlyWrapped = (value, tokenIndex, token, cssToken) => {
  // Use regex to find all var(--token, $token) or var(--token, #{$token}) patterns
  // Escape regex metacharacters in token so it is treated literally in the pattern
  const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Pattern 1: var(--token, $token)
  const pattern1 = new RegExp(`var\\(${cssToken}, ${escapedToken}\\)`, 'g')

  // Pattern 2: var(--token, #{$token})
  const pattern2 = new RegExp(`var\\(${cssToken}, #{${escapedToken}}\\)`, 'g')

  // Check both patterns
  const patterns = [pattern1, pattern2]

  for (const pattern of patterns) {
    // Reset lastIndex for each pattern
    pattern.lastIndex = 0

    let match
    while ((match = pattern.exec(value)) !== null) {
      const matchStart = match.index
      const matchEnd = matchStart + match[0].length

      // Check if our token at tokenIndex is inside this match
      const tokenEndIndex = tokenIndex + token.length
      if (tokenIndex >= matchStart && tokenEndIndex <= matchEnd) {
        return true
      }
    }
  }

  return false
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

            tokenOccurrences.forEach((tokenIndex) => {
              // Check if this occurrence is in proper format
              if (!isTokenProperlyWrapped(fixedValue, tokenIndex, scssToken, cssToken)) {
                // Skip auto-fix for tokens in standalone interpolation (e.g., #{$token})
                // Let the developer decide the appropriate fix
                if (isTokenInStandaloneInterpolation(fixedValue, tokenIndex, scssToken)) {
                  return
                }

                // Find the var() expression containing this token to replace the whole thing
                const beforeToken = fixedValue.substring(0, tokenIndex)
                const varStartIndex = beforeToken.lastIndexOf('var(')

                if (varStartIndex === -1) {
                  // No var( found, just replace the token with proper format
                  replacements.push({
                    start: tokenIndex,
                    end: tokenIndex + scssToken.length,
                    replacement: properFormat,
                  })
                  return
                }

                // Find the matching closing parenthesis
                let parenCount = 0
                let searchIndex = varStartIndex
                let varEndIndex = -1

                while (searchIndex < fixedValue.length) {
                  const char = fixedValue[searchIndex]
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

                if (varEndIndex !== -1) {
                  // Replace the entire var() expression
                  replacements.push({
                    start: varStartIndex,
                    end: varEndIndex + 1,
                    replacement: properFormat,
                  })
                }
              }
            })
          })

          // Sort replacements by position (descending) to avoid offset issues
          replacements.sort((a, b) => b.start - a.start)

          // Remove duplicates (same start position)
          const uniqueReplacements = []
          const seenStarts = new Set()
          replacements.forEach((replacement) => {
            if (!seenStarts.has(replacement.start)) {
              seenStarts.add(replacement.start)
              uniqueReplacements.push(replacement)
            }
          })

          // Apply replacements from end to start
          uniqueReplacements.forEach(({ start, end, replacement }) => {
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

