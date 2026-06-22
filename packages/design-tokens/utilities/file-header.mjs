/**
 * Creates a Style Dictionary `fileHeader` function for a package.
 * @param {object} options
 * @param {string} options.product - Product name shown in generated file headers
 * @param {string} options.packageDirectory - Directory name under `packages/` for the GitHub URL
 * @returns {(defaultMessage: string[]) => string[]}
 */
export const createFileHeader = ({ product, packageDirectory }) => (defaultMessage) => [
  ...defaultMessage,
  '',
  product,
  `GitHub: https://github.com/Kong/design-tokens/tree/main/packages/${packageDirectory}`,
  'License: Apache-2.0',
]

// Define a custom file header for all formats
export const customFileHeader = createFileHeader({
  product: 'Kong Konnect Design Tokens',
  packageDirectory: 'design-tokens',
})
