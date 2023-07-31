/**
 * Map of CSS properties and their corresponding allowed design tokens
 * Example: `background,background-color` CSS properties allowed tokens are `color-background` and `method-color-background`
 *
 * key: CSS Property name
 * value: Array of valid Kong Design Tokens, without the `kui-` prefix
 *
 * To enforce no token should be used for a CSS property, set the value to an empty array.
 */
const PROPERTY_TOKEN_MAP = {
  background: ['color-background', 'method-color-background'],
  'background-color': ['color-background', 'method-color-background'],
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
  color: ['color-text', 'method-color-text'],
  'column-gap': ['space'],
  font: ['font-family', 'font-size', 'font-weight'],
  'font-family': ['font-family'],
  'font-size': ['font-size'],
  'font-weight': ['font-weight'],
  gap: ['space'],
  height: [],
  inset: [],
  left: [],
  'line-height': ['line-height'],
  margin: ['space'],
  'margin-bottom': ['space'],
  'margin-left': ['space'],
  'margin-right': ['space'],
  'margin-top': ['space'],
  'max-height': [],
  'max-width': [],
  'min-height': [],
  'min-width': [],
  padding: ['space'],
  'padding-bottom': ['space'],
  'padding-left': ['space'],
  'padding-right': ['space'],
  'padding-top': ['space'],
  right: [],
  'row-gap': ['space'],
  stroke: ['color-text', 'method-color-text'],
  top: [],
  width: [],
}

module.exports = PROPERTY_TOKEN_MAP
