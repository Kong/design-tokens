// Define a custom file header for all formats
export const customFileHeader = (defaultMessage) => {
  return [
    ...defaultMessage,
    '',
    'Kong Konnect Design Tokens',
    'GitHub: https://github.com/Kong/design-tokens/packages/design-tokens',
    'License: Apache-2.0',
  ]
}
