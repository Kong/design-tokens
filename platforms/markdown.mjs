import StyleDictionary from 'style-dictionary'
import { unquoteString, TOKEN_DIRECTORY } from '../utilities/index.mjs'
import { fileHeader } from 'style-dictionary/utils'

StyleDictionary.registerFormat({
  name: 'css/variables/custom/markdown',
  format: async function({ dictionary, file, options }) {
    // Generate the SCSS variable tokens
    const scssTokens = dictionary.allTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.value))
      const comment = unquoteString(JSON.stringify(token.comment))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `$${token.name}: ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the SCSS variable tokens
    const scssMap = dictionary.allTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.value))
      const comment = unquoteString(JSON.stringify(token.comment))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `  /* ${comment} */\n`
      }
      tokenOutput += `  '${token.name}': ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the LESS variable tokens
    const lessTokens = dictionary.allTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.value))
      const comment = unquoteString(JSON.stringify(token.comment))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `@${token.name}: ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the CSS custom properties
    const cssTokens = dictionary.allTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.value))
      const comment = unquoteString(JSON.stringify(token.comment))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `--${token.name}: ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the JavaScript variable tokens
    const javascriptTokens = dictionary.allTokens.map(token => {
      const value = JSON.stringify(token.value)
      const comment = unquoteString(JSON.stringify(token.comment))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `export const ${token.name.replace(/-/g, '_').toUpperCase()} = ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the JavaScript variable tokens
    const jsonTokens = dictionary.allTokens.map((token, idx) => {
      const value = JSON.stringify(token.value)

      let tokenOutput = `  "${token.name.replace(/-/g, '_').toLowerCase()}": ${value},`
      if ((idx + 1) === dictionary.allTokens.length) {
        tokenOutput = tokenOutput.replace(/,$/, '')
      }
      return tokenOutput
    }).join('\n')

    // Generate the markdown file
    return (await fileHeader({ file })).replace('/**', '<!--').replace(' */', '-->') + `# Kong Design Tokens
This document outlines the majority of the available tokens.

## SCSS

### SCSS Variables

<details>

<summary>Click to view the list of SCSS variables</summary>

\`\`\`scss
${scssTokens}
\`\`\`

</details>

### SCSS Map

<details>

<summary>Click to view exported SCSS map</summary>

\`\`\`scss
$tokens-map: (
${scssMap}
);
\`\`\`

</details>

## LESS

### LESS Variables

<details>

<summary>Click to view the list of LESS variables</summary>

\`\`\`less
${lessTokens}
\`\`\`

</details>

## CSS

### CSS Custom Properties

You may scope your CSS custom property overrides inside the \`:root\` selector as shown here, or inside any other valid CSS selector.

<details>

<summary>Click to view the list of CSS custom properties</summary>

\`\`\`scss
${cssTokens}
\`\`\`

</details>

## JavaScript

### JavaScript / TypeScript Constants

<details>

<summary>Click to view the list of JavaScript variables</summary>

\`\`\`javascript
${javascriptTokens}
\`\`\`

</details>

### JSON

<details>

<summary>Click to view the exported JSON object</summary>

\`\`\`json
{
${jsonTokens}
}
\`\`\`

</details>
`
  },
})

/**
 * Markdown files
 */
export default {
  transformGroup: 'web',
  buildPath: `${TOKEN_DIRECTORY}/`,
  transforms: [
    'attribute/cti',
    'name/kebab',
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
