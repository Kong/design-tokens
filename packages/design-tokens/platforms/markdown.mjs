import StyleDictionary from 'style-dictionary'
import { unquoteString, TOKEN_DIRECTORY } from '../utilities/index.mjs'
import { buildRecords, renderJsObject } from './themeable-tokens.mjs'
import { fileHeader } from 'style-dictionary/utils'

StyleDictionary.registerFormat({
  name: 'css/variables/custom/markdown',
  format: async function({ dictionary, file }) {
    // Value-carrying semantic tokens are documented in the SCSS/CSS/JS/JSON sections; value-less
    // component tokens are documented separately (CSS section only), rendered as `initial`.
    const valueTokens = dictionary.allTokens.filter(token => token.$type !== 'component')
    const componentTokens = dictionary.allTokens.filter(token => token.$type === 'component')

    // Generate the SCSS variable tokens
    const scssTokens = valueTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.$value))
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `$${token.name}: ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the SCSS variable tokens
    const scssMap = valueTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.$value))
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `  /* ${comment} */\n`
      }
      tokenOutput += `  '${token.name}': ${value},`
      return tokenOutput
    }).join('\n')

    // Generate the CSS custom properties
    const cssTokens = valueTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.$value))
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `--${token.name}: ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the component-token CSS custom properties. Component tokens are value-less override
    // slots, so they are documented with `initial` (no default value) rather than a resolved value.
    const cssComponentTokens = componentTokens.map(token => {
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `--${token.name}: initial;`
      return tokenOutput
    }).join('\n')

    // Generate the themeable-tokens registry (semantic + value-less component tokens), rendered
    // identically to the exported `KUI_THEMEABLE_TOKENS` array.
    const themeableTokens = buildRecords(dictionary).map(renderJsObject).join('\n')

    // Generate the JavaScript variable tokens
    const javascriptTokens = valueTokens.map(token => {
      const value = JSON.stringify(token.$value)
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `export const ${token.name.replace(/-/g, '_').toUpperCase()} = ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the JavaScript variable tokens
    const jsonTokens = valueTokens.map((token, idx) => {
      const value = JSON.stringify(token.$value)

      let tokenOutput = `  "${token.name.replace(/-/g, '_').toLowerCase()}": ${value},`
      if ((idx + 1) === valueTokens.length) {
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

## CSS

### CSS Custom Properties

You may scope your CSS custom property overrides inside the \`:root\` selector as shown here, or inside any other valid CSS selector.

<details>

<summary>Click to view the list of CSS custom properties</summary>

\`\`\`css
${cssTokens}
\`\`\`

</details>

### Component CSS Custom Properties

Component tokens are documented here for reference. They ship **with no default value** (shown as \`initial\`) — they exist purely as override slots consumed via \`var()\` fallback chains, and only take effect when a theme or host application sets them.

<details>

<summary>Click to view the list of component CSS custom properties</summary>

\`\`\`css
${cssComponentTokens}
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

### Themeable Tokens

\`KUI_THEMEABLE_TOKENS\` (exported from \`@kong/design-tokens/tokens/themeable-tokens\`) lists every \`--kui-*\` custom property a theme may override — both semantic tokens and value-less component tokens (\`value: null\`). Each entry is a \`{ name, description, category, value }\` record.

<details>

<summary>Click to view the KUI_THEMEABLE_TOKENS array</summary>

\`\`\`javascript
export const KUI_THEMEABLE_TOKENS = [
${themeableTokens}
]
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
      // Exclude alias tokens and asset tokens. Component tokens ARE included: the format documents
      // them separately (CSS section, rendered as `initial`) and in the KUI_THEMEABLE_TOKENS array.
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}
