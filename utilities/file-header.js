// Define a custom file header for all formats
const customFileHeader = (defaultMessage) => {
  return [
    ...defaultMessage,
    '',
    'Kong Design Tokens',
    'GitHub: https://github.com/Kong/design-tokens',
    'License: Apache-2.0',
  ]
}

module.exports = customFileHeader
