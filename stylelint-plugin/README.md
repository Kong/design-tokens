# @kong/design-tokens/stylelint-plugin

[Stylelint](https://github.com/stylelint/stylelint) plugin for linting design tokens.

## Usage

Install `@kong/design-tokens` and `stylelint` packages as a `devDependency` in your project

```sh
yarn add -D @kong/design-tokens stylelint
```

In your stylelint config file, add the plugin and enable rules that you want to use:

```javascript
plugins: [
  '@kong/design-tokens/stylelint-plugin'
],
rules: {
  '@kong/design-tokens/use-proper-token': [true, {
    disableFix: true,
    severity: 'error' // You can also configure as `warning`
  }]
}
```

## Rules

### `@kong/design-tokens/use-proper-token`

Rule that finds usages of inappropriate design tokens for a given CSS property. Example:

```scss
.foo {
  // This **will** trigger an error, text color token used for background-color property
  background-color: $kui-color-text-primary;
}
```

```scss
.foo {
  // This **will NOT** trigger an error, appropriate token for the property
  background-color: $kui-color-background-primary;
}
```
