const StyleDictionary = require('style-dictionary')
const { TOKEN_DIRECTORY } = require('../constants')
const { unquoteString } = require('../utilities')

StyleDictionary.registerFormat({
  name: 'css/variables/custom/markdown',
  formatter: function({ dictionary }) {
    // Generate the SCSS variable tokens
    const scssTokens = dictionary.allTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.value))
      const comment = unquoteString(JSON.stringify(token.comment))

      // Set the value of the variable to `initial` to initialize as essentially an empty value
      let tokenOutput = `$${token.name}: ${value};`
      if (comment) {
        tokenOutput += ` /* ${comment} */`
      }
      return tokenOutput
    }).join('\n')

    // Generate the CSS variable tokens
    const cssTokens = dictionary.allTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.value))
      const comment = unquoteString(JSON.stringify(token.comment))

      // Set the value of the variable to `initial` to initialize as essentially an empty value
      let tokenOutput = `  --${token.name}: initial; /* `
      if (comment) {
        tokenOutput += comment.replace(/([^.])$/, '$1.')
      }
      tokenOutput += ` Default value: \`${value}\` */`
      return tokenOutput
    }).join('\n')

    // Generate the JavaScript variable tokens
    const javascriptTokens = dictionary.allTokens.map(token => {
      const value = JSON.stringify(token.value)
      const comment = unquoteString(JSON.stringify(token.comment))

      // Set the value of the variable to `initial` to initialize as essentially an empty value
      let tokenOutput = `export const ${token.name.replace(/-/g, '_').toUpperCase()} = ${value};`
      if (comment) {
        tokenOutput += ` /* ${comment} */`
      }
      return tokenOutput
    }).join('\n')

    // Generate the markdown file
    return `
# Kong Design Tokens

This document outlines all of the available tokens.

## SCSS Variables

<details>

<summary>Click to view the list of SCSS variables</summary>

\`\`\`scss
${scssTokens}
\`\`\`

</details>

## JavaScript Variables

<details>

<summary>Click to view the list of JavaScript variables</summary>

\`\`\`javascript
${javascriptTokens}
\`\`\`

</details>

## CSS Variables

**IMPORTANT**: You should **never** import the \`@kong/design-tokens/tokens/css/variables.css\` file in your host project.

The purpose of the \`@kong/design-tokens/tokens/css/variables.css\` file is to provide a list of all available CSS variables.

If you want to customize default token values, provided the element(s) in question utilize CSS variable fallbacks, simply set the variables from this list to your desired value within your host application, scoped inside your desired CSS selector, and it will override the default value.

You may scope your CSS variable overrides inside the \`:root\` selector as shown here, or inside any other valid CSS selector.

While CSS variables are _utilized_ in Kong's repositories to allow for CSS customization, the variables themselves are never actually provided values or imported from this package.

<details>

<summary>Click to view the list of CSS variables</summary>

\`\`\`css
${cssTokens}
\`\`\`

</details>
`
  },
})

/**
 * Markdown files
 */
const platform = {
  transformGroup: 'markdown',
  buildPath: `${TOKEN_DIRECTORY}/`,
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
  ],
  files: [
    {
      format: 'css/variables/custom/markdown',
      destination: 'README.md',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}

module.exports = platform
