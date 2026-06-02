import StyleDictionary from 'style-dictionary'

/** Replaces empty string token values with `initial` so CSS custom properties are truly undefined rather than empty. */
StyleDictionary.registerTransform({
  name: 'value/empty-to-initial',
  type: 'value',
  filter: (token) => token.$value === '',
  transform: () => 'initial',
})

export const emptyToInitialTransform = 'value/empty-to-initial'
