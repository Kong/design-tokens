// Define a custom file header for all formats
export const customFileHeader = (defaultMessage) => {
  return [
    ...defaultMessage,
    '',
    'Kong Konnect Dev Portal Design Tokens',
    'GitHub: https://github.com/Kong/design-tokens/packages/portal-design-tokens',
    'License: Apache-2.0',
  ]
}
