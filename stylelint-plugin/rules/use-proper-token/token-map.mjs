/**
 * Map of CSS properties and their corresponding allowed design tokens
 * Example: for `background-color` CSS property allowed tokens are `color-background` and `method-color-background`
 *
 * As long as tokens follow this pattern, they don't need to be added to the arrays in the map:
 * - starts with a prefix `kui-`
 * - optionally followed by a component name in kebab-case
 * - followed by a token name in kebab-case
 * - optionally followed by a variant name in kebab-case
 * Examples: `kui-analytics-chart-background-color-inverse`, `kui-color-background`, `kui-color-background-inverse`
 *
 * key: CSS Property name
 * value: Array of valid Kong Design Tokens, without the `kui-` prefix
 *
 * ! To enforce no token should be used for a CSS property, set the value to an empty array.
 */
export const PROPERTY_TOKEN_MAP = {
  background: ['color-background', 'status-color'],
  'background-color': ['color-background', 'status-color'],
  'background-size': [],
  border: ['border-radius', 'border-width', 'color-border'],
  'border-bottom': ['border-radius', 'border-width', 'color-border'],
  'border-bottom-color': ['color-border'],
  'border-bottom-left-radius': ['border-radius'],
  'border-bottom-right-radius': ['border-radius'],
  'border-bottom-width': ['border-width'],
  'border-color': ['color-border'],
  'border-left': ['border-radius', 'border-width', 'color-border'],
  'border-left-color': ['color-border'],
  'border-left-width': ['border-width'],
  'border-radius': ['border-radius'],
  'border-right': ['border-radius', 'border-width', 'color-border'],
  'border-right-color': ['color-border'],
  'border-right-width': ['border-width'],
  'border-spacing': ['space'],
  'border-top': ['border-radius', 'border-width', 'color-border'],
  'border-top-color': ['color-border'],
  'border-top-left-radius': ['border-radius'],
  'border-top-right-radius': ['border-radius'],
  'border-top-width': ['border-width'],
  'border-width': ['border-width'],
  bottom: [],
  'box-shadow': ['border-width', 'color-border', 'shadow'],
  color: ['color-text', 'icon-color', 'status-color'],
  'column-gap': ['space'],
  'column-width': [],
  fill: ['color-text', 'status-color'],
  font: ['font-family', 'font-size', 'font-weight'],
  'font-family': ['font-family'],
  'font-size': ['font-size'],
  'font-weight': ['font-weight'],
  gap: ['space'],
  height: ['icon-size'],
  inset: [],
  left: [],
  'letter-spacing': ['letter-spacing'],
  'line-height': ['line-height'],
  margin: ['space'],
  'margin-bottom': ['space'],
  'margin-left': ['space'],
  'margin-right': ['space'],
  'margin-top': ['space'],
  'max-height': ['icon-size'],
  'max-width': ['icon-size', 'breakpoint'],
  'min-height': ['icon-size'],
  'min-width': ['icon-size', 'breakpoint'],
  outline: ['border-width', 'color-border'],
  'outline-color': [],
  'outline-width': [],
  padding: ['space'],
  'padding-bottom': ['space'],
  'padding-left': ['space'],
  'padding-right': ['space'],
  'padding-top': ['space'],
  right: [],
  'row-gap': ['space'],
  stroke: ['color-text', 'status-color'],
  'text-decoration-color': ['color-text'],
  top: [],
  width: ['icon-size', 'breakpoint'],
}
