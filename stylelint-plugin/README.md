# @kong/design-tokens/stylelint-plugin

[Stylelint](https://github.com/stylelint/stylelint) plugin for linting design tokens.

- [Usage](#usage)
- [Rules](#rules)
  - [`use-proper-token`](#use-proper-token)

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

### `use-proper-token`

Rule that parses CSS properties for inappropriate tokens being referenced.

For example, the `kui-color-text-primary` token **should** be used as a value for `color`, but **should not** be used for `background-color`.

#### :red_circle: Incorrect

```scss
.foo {
  // This **will** trigger an error, text color token used for background-color property
  background-color: $kui-color-text-primary;
}
```

#### :green_circle: Correct

```scss
.foo {
  // This **will NOT** trigger an error, appropriate token for the property
  color: $kui-color-text-primary;
}
```
