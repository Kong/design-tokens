# @kong/design-tokens/stylelint-plugin

[Stylelint](https://github.com/stylelint/stylelint) plugin for linting design tokens.

- [Usage](#usage)
- [Rules](#rules)
  - [`use-proper-token`](#use-proper-token)
  - [`token-var-usage`](#token-var-usage)

## Usage

Install `@kong/design-tokens` and `stylelint` packages as a `devDependency` in your project

```sh
pnpm add -D @kong/design-tokens stylelint
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

#### :red_circle: Incorrect usage

```scss
.foo {
  // This **will** trigger an error, text color token used for background-color property
  background-color: $kui-color-text-primary;
}
```

#### :green_circle: Correct usage

```scss
.foo {
  // This **will NOT** trigger an error, appropriate token for the property
  color: $kui-color-text-primary;
}
```

### `token-var-usage`

Rule that ensures SCSS design tokens are properly used as fallback values in CSS custom properties.

SCSS tokens (e.g., `$kui-color-text-primary`) **must** be wrapped in the `var()` function with the corresponding CSS custom property as the first argument and the SCSS token as the fallback. The format must be exact: `var(--kui-token-name, $kui-token-name)` with exactly one space before the comma and no other spaces.

This approach provides progressive enhancement: browsers use the CSS custom property (which can be overridden), with the SCSS token as a compile-time fallback.

#### :red_circle: Incorrect usage

```scss
.foo {
  // Direct SCSS token usage without var()
  color: $kui-color-text-primary;
}

.bar {
  // Missing space before comma
  color: var(--kui-color-text-primary,$kui-color-text-primary);
}

.baz {
  // Extra spaces
  color: var(--kui-color-text-primary,  $kui-color-text-primary);
}
```

#### :green_circle: Correct usage

```scss
.foo {
  // Proper format with CSS custom property and SCSS fallback
  color: var(--kui-color-text-primary, $kui-color-text-primary);
}
```
