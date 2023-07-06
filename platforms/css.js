const StyleDictionary = require('style-dictionary')
const { TOKEN_DIRECTORY } = require('../constants')
const { unquoteString } = require('../utilities')

const { fileHeader } = StyleDictionary.formatHelpers
StyleDictionary.registerFormat({
  name: 'css/variables/custom/initial-values',
  formatter: function({ dictionary, file }) {
    return fileHeader({ file }) +
    '/**\n' +
    ' * IMPORTANT: You should **not** import this file in your host project.\n' +
    ' *\n' +
    ' * The purpose of this file is to provide a list of all available CSS variables.\n' +
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
        let tokenOutput = `  --${token.name}: initial; /* `
        if (comment) {
          tokenOutput += comment.replace(/([^.])$/, '$1.')
        }
        tokenOutput += ` Default value: \`${value}\` */`
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
const platform = {
  transformGroup: 'css',
  buildPath: `${TOKEN_DIRECTORY}/css/`,
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
  ],
  files: [
    {
      format: 'css/variables/custom/initial-values',
      destination: 'variables.css',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}

module.exports = platform
