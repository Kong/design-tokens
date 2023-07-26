// prefix for all tokens
const KONG_TOKEN_PREFIX = 'kui-'

// map of appropriate tokens for each property
const PROPERTY_TOKEN_MAP = {
  'background,background-color': ['color-background', 'method-color-background'],
  'border-bottom-color,border-color,border-left-color,border-right-color,border-top-color': ['color-border'],
  'border-bottom-left-radius,border-bottom-right-radius,border-radius,border-top-left-radius,border-top-right-radius': ['border-radius'],
  'border-bottom-width,border-left-width,border-right-width,border-top-width,border-width': ['border-width'],
  'border-spacing,column-gap,gap,margin,margin-bottom,margin-left,margin-right,margin-top,padding,padding-bottom,padding-left,padding-right,padding-top,row-gap': ['space'],
  'border,border-bottom,border-left,border-right,border-top': ['border-radius', 'border-width', 'color-border'],
  'color,stroke': ['color-text', 'method-color-text'],
  font: ['font-family', 'font-size', 'font-weight'],
  'font-family': ['font-family'],
  'font-size': ['font-size'],
  'font-weight': ['font-weight'],
  'line-height': ['line-height'],
}

// prefix for all rule names
const RULE_NAME_PREFIX = '@kong/design-tokens'

module.exports = {
  KONG_TOKEN_PREFIX,
  PROPERTY_TOKEN_MAP,
  RULE_NAME_PREFIX,
}
