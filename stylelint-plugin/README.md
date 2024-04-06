# @kong/design-tokens/stylelint-plugin

[Stylelint](https://github.com/stylelint/stylelint) plugin for linting design tokens.

- [Usage](#usage)
- [Testing](#testing)
- [Rules](#rules)
  - [`use-proper-token`](#use-proper-token)
- [Creating a rule](#creating-a-rule)

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

## Testing

Run `yarn test:unit` or `test:unit:open`

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

## Creating a rule

1. Create a directory with same name as your rule (use kebab case) in `stylelint-plugin/rules/`
2. Organize the directory in such way so that rule logic lives in a separate file that exports the function(s) with rule logic
3. Create a `*.spec.ts` - this is where unit tests for your rule will live
4. Check out helpful utilities in `stylelint-plugin/utilities/`
   * If you need to create any helper/utility functions that might be helpful in other rules, you can place it there