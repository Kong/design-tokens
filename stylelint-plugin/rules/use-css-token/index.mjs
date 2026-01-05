import stylelint from 'stylelint'
import { KONG_TOKEN_PREFIX, RULE_NAME_PREFIX } from '../../utilities/index.mjs'

const { ruleMessages, validateOptions, report } = stylelint.utils
const ruleName = `${RULE_NAME_PREFIX}/use-css-token`
const messages = ruleMessages(ruleName, {
  expected: 'SCSS tokens must be used as fallback values in CSS custom properties. Use format: var(--kui-design-token, $kui-design-token) with exactly one space before the comma and no other spaces.',
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
// Enforces exact format: var(--token, $token) with exactly one space before comma
const isTokenProperlyWrapped = (value, tokenIndex, token, cssToken) => {
  // Use regex to find all var(--token, $token) patterns
  // Escape $ in token since it's a special regex character
  const escapedToken = token.replace(/\$/g, '\\$')
  const pattern = new RegExp(`var\\(${cssToken}, ${escapedToken}\\)`, 'g')

  console.log(`[DEBUG] Checking token "${token}" at position ${tokenIndex}:`, {
    token,
    tokenIndex,
    cssToken,
    escapedToken,
    pattern: `var(${cssToken}, ${escapedToken})`,
    patternSource: pattern.source,
    valueContext: value.substring(Math.max(0, tokenIndex - 50), Math.min(value.length, tokenIndex + token.length + 50)),
  })

  // Find all matches
  let match
  const matches = []
  while ((match = pattern.exec(value)) !== null) {
    const matchStart = match.index
    const matchEnd = matchStart + match[0].length
    matches.push({
      start: matchStart,
      end: matchEnd,
      match: match[0],
    })

    // Check if our token at tokenIndex is inside this match
    const tokenEndIndex = tokenIndex + token.length
    if (tokenIndex >= matchStart && tokenEndIndex <= matchEnd) {
      console.log(`[DEBUG] Token "${token}" at ${tokenIndex} is properly wrapped in:`, {
        match: match[0],
        matchStart,
        matchEnd,
        tokenIndex,
        tokenEndIndex,
      })
      return true
    }
  }

  console.log(`[DEBUG] Token "${token}" at ${tokenIndex} is NOT properly wrapped. Found ${matches.length} pattern matches:`, {
    matches,
    tokenIndex,
    tokenEndIndex: tokenIndex + token.length,
  })

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

      console.log(`[DEBUG] Checking declaration: ${decl.prop} = "${declValue}"`)

      // Extract all SCSS tokens (starting with $kui-)
      const scssTokenRegex = new RegExp(`\\$${KONG_TOKEN_PREFIX}[a-z0-9-]+`, 'g')
      const scssTokens = declValue.match(scssTokenRegex)

      // If no SCSS tokens are used, skip validation
      if (!scssTokens || scssTokens.length === 0) {
        return
      }

      // Get unique SCSS tokens
      const uniqueScssTokens = Array.from(new Set(scssTokens))

      console.log(`[DEBUG] Found ${uniqueScssTokens.length} unique SCSS tokens:`, uniqueScssTokens)

      // Check if each SCSS token is properly wrapped in var()
      // Pattern: var(--kui-token-name, $kui-token-name)
      const improperlyUsedTokens = []

      uniqueScssTokens.forEach((scssToken) => {
        const cssToken = getCssToken(scssToken)
        const tokenOccurrences = findAllTokenOccurrences(declValue, scssToken)

        console.log(`[DEBUG] Checking token "${scssToken}" (CSS: "${cssToken}") at ${tokenOccurrences.length} occurrence(s):`, tokenOccurrences)

        // Check each occurrence to see if it's properly wrapped
        const hasImproperUsage = tokenOccurrences.some((tokenIndex) => {
          return !isTokenProperlyWrapped(declValue, tokenIndex, scssToken, cssToken)
        })

        if (hasImproperUsage) {
          console.log(`[DEBUG] Token "${scssToken}" has improper usage`)
          improperlyUsedTokens.push(scssToken)
        } else {
          console.log(`[DEBUG] Token "${scssToken}" is properly used`)
        }
      })

      if (improperlyUsedTokens.length > 0) {
        console.log(`[DEBUG] Reporting ${improperlyUsedTokens.length} improperly used token(s):`, improperlyUsedTokens)
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

