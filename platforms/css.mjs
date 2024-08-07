import StyleDictionary from 'style-dictionary'
import { unquoteString, TOKEN_DIRECTORY } from '../utilities/index.mjs'
import { fileHeader } from 'style-dictionary/utils'

StyleDictionary.registerFormat({
  name: 'css/variables/custom/initial-values',
  format: async function({ dictionary, file, options }) {
    return (await fileHeader({ file })) +
    '/**\n' +
    ' * IMPORTANT: You should **not** import this file in your host project.\n' +
    ' *\n' +
    ' * The purpose of this file is to provide a list of all available CSS variables, to\n' +
    ' * utilize alongside auto-complete extensions in your IDE, etc.\n' +
    ' *\n' +
    ' * If you want to customize default token values, provided the element(s) in question\n' +
    ' * utilize CSS variable fallbacks, simply set the variables from this list\n' +
    ' * to your desired value within your host application, scoped inside \n' +
    ' * your desired CSS selector, and it will override the default value.\n' +
    ' *\n' +
    ' * You may scope your CSS variable overrides inside the `:root` selector\n' +
    ' * as shown here, or inside any other valid CSS selector.\n' +
    '*/\n' +
    ':root {\n' +
      dictionary.allTokens.map(token => {
        const value = unquoteString(JSON.stringify(token.value))
        const comment = unquoteString(JSON.stringify(token.comment))

        // Set the value of the variable to `initial` to initialize as essentially an empty value
        let tokenOutput = `  /* ${comment ? comment.replace(/([^.])$/, '$1.') : ''} Default value: \`${value}\` */\n`
        tokenOutput += `  --${token.name}: initial;`
        return tokenOutput
      }).join('\n') +
    '\n}\n'
  },
})

/**
 * CSS Variables
 *
 * We only export the CSS variables with their value set to `initial` -- the exported file is for reference only and should *NEVER* be imported by a host project.
 */
export default {
  transformGroup: 'css',
  buildPath: `${TOKEN_DIRECTORY}/css/`,
  transforms: [
    'attribute/cti',
    'name/kebab',
    'color/css',
  ],
  files: [
    {
      format: 'css/variables/custom/initial-values',
      destination: 'custom-properties-list.css',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    {
      format: 'css/variables',
      destination: 'custom-properties.css',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}
