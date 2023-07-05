# @kong/design-tokens/stylelint-plugin

[Stylelint](https://github.com/stylelint/stylelint) plugin for linting design tokens.

## Usage

1. Install `@kong/design-tokens` package as a `devDependency`:
```sh
yarn add --dev @kong/design-tokens
```
2. In your stylelint config file, add the plugin and enable rules that you want to use:
```
plugins: [
  ...
  '@kong/design-tokens/stylelint-plugin'
],
rules: {
  ...
  '@kong/design-tokens/use-proper-token': [true, {
    disableFix: true,
    severity: 'warning'
  }]
}
```

**Note:** you **must** have stylelint as a `devDependency` in your consuming app.

## Rules

### `@kong/design-tokens/use-proper-token`

Rule that finds usages of inappropriate design tokens for a given CSS property. Example:

```scss
.foo {
  background-color: $kui-color-text-primary; // will trigger an error, text color token used for background-color property
}
```

```scss
.foo {
  background-color: $kui-color-background-primary; // will NOT trigger an error, appropriate token for the property
}
```