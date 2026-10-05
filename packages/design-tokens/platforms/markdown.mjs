import StyleDictionary from 'style-dictionary'
import { unquoteString, TOKEN_DIRECTORY } from '../utilities/index.mjs'
import { buildRecords, renderJsObject } from './themeable-tokens.mjs'
import { fileHeader } from 'style-dictionary/utils'

const REPO_URL = 'https://github.com/Kong/design-tokens/tree/main/packages'

// Static usage guide rendered after the generated token lists. Derived from the package README
// and the rule implementations in `@kong/stylelint-plugin-design-tokens` and
// `@kong/eslint-plugin-design-tokens` — keep it in sync when those rules change.
const USAGE_INSTRUCTIONS = `## Usage

### Choosing a format

Themes and host-application overrides work by setting \`--kui-*\` custom properties at runtime. SCSS variables and JavaScript constants are replaced with static values at compile time, so a value used on its own **ignores every theme**. Whenever a token styles the DOM, reference the CSS custom property and pass the static token as its fallback:

| Context | Pattern |
|---|---|
| SCSS declaration | \`color: var(--kui-color-text-primary, $kui-color-text-primary);\` |
| Vue template binding | \`\` :style="{ color: \`var(--kui-color-text-primary, \${KUI_COLOR_TEXT_PRIMARY})\` }" \`\` |
| \`@media\` query | \`@media (min-width: $kui-breakpoint-phablet)\` — custom properties are not valid in media queries |
| Non-DOM consumers (canvas charts, JS math, \`matchMedia\`) | \`KUI_BREAKPOINT_PHABLET\` — the constant on its own; \`var()\` only resolves in CSS, so these values do not follow themes |

The custom property name always matches the token it falls back to:

\`\`\`
--kui-color-text-primary  ↔  $kui-color-text-primary  ↔  KUI_COLOR_TEXT_PRIMARY
\`\`\`

Always include the fallback. A bare \`var(--kui-color-text-primary)\` falls back to the inherited or initial value when nothing defines the property, and neither linter flags it.

### Component tokens

Component tokens (\`--kui-button-*\`, \`--kui-input-*\`, …) have **no value, no SCSS variable, and no JavaScript constant**. They are override slots that only take effect when a theme sets them. Use one as the outermost \`var()\` and fall through to the semantic token:

\`\`\`scss
border-radius: var(--kui-button-border-radius-medium, var(--kui-border-radius-30, $kui-border-radius-30));
//                 ↑ component token (unset by default)  ↑ semantic token          ↑ static fallback
\`\`\`

Never reference a component token without that semantic fallback — on its own it is unset unless a theme writes it.

### Linting

Two plugins enforce the patterns above. Install them as \`devDependencies\` alongside \`@kong/design-tokens\`:

\`\`\`sh
pnpm add -D @kong/stylelint-plugin-design-tokens stylelint
pnpm add -D @kong/eslint-plugin-design-tokens eslint eslint-plugin-vue vue-eslint-parser
\`\`\`

Stylelint (your project must already parse SCSS and Vue \`<style>\` blocks, e.g. via \`postcss-scss\` / \`postcss-html\`):

\`\`\`js
export default {
  plugins: ['@kong/stylelint-plugin-design-tokens'],
  rules: {
    '@kong/stylelint-plugin-design-tokens/token-var-usage': true,
    '@kong/stylelint-plugin-design-tokens/use-proper-token': true,
  },
}
\`\`\`

ESLint (flat config, Vue SFCs):

\`\`\`js
import vue from 'eslint-plugin-vue'
import designTokens from '@kong/eslint-plugin-design-tokens'

export default [
  ...vue.configs['flat/recommended'],
  { files: ['**/*.vue'], ...designTokens.configs.recommended },
]
\`\`\`

Run \`stylelint --fix\` and \`eslint --fix\` to apply the autofixes described below. Full rule documentation: [stylelint plugin](${REPO_URL}/stylelint-plugin-design-tokens#readme), [ESLint plugin](${REPO_URL}/eslint-plugin-design-tokens#readme).

#### \`token-var-usage\` (stylelint)

Every \`$kui-*\` SCSS variable in a declaration must sit inside \`var(--kui-<same-name>, $kui-<same-name>)\` or \`var(--kui-<same-name>, #{$kui-<same-name>})\` — exactly one space after the comma, no other spaces. Bare tokens and misformatted \`var()\` calls are autofixed.

Watch out for:

- **SCSS variable assignments are checked too.** \`$gap: $kui-space-40;\` is rewritten to \`$gap: var(--kui-space-40, $kui-space-40);\`, which breaks any Sass math done with \`$gap\` afterwards. Do the math in CSS instead: \`calc(var(--kui-space-40, $kui-space-40) * 2)\`.
- **Sass functions can't take a runtime value.** \`darken()\`, \`math.div()\`, etc. fail on a \`var()\` argument. Prefer CSS-native equivalents (\`calc()\`, \`color-mix()\`) or a token that already expresses the value you need.
- **Keep each \`var()\` on one line.** Multi-line \`var()\` calls are not parsed correctly.
- **Standalone interpolation is reported but not fixed.** For \`#{$kui-color-text-primary}\` you choose between the plain and the interpolated \`var()\` form yourself.
- **\`@media\` parameters are not checked**, so \`$kui-breakpoint-*\` can be used there directly.

#### \`use-proper-token\` (stylelint)

Reports a token used on a property it was not designed for, e.g. \`background-color: var(--kui-color-text-primary, $kui-color-text-primary)\`. It checks both \`--kui-*\` and \`$kui-*\` references and has **no autofix**. Component-prefixed tokens are matched by family, so \`--kui-button-color-background-primary\` is valid wherever \`color-background\` is. Properties not listed below are not checked.

| Property | Allowed token families |
|---|---|
| \`background\`, \`background-color\` | \`color-background\`, \`color-brand\`, \`status-color\` |
| \`color\` | \`color-text\`, \`icon-color\`, \`status-color\`, \`color-brand\` |
| \`fill\`, \`stroke\` | \`color-text\`, \`color-brand\`, \`status-color\` |
| \`text-decoration-color\` | \`color-text\`, \`color-brand\` |
| \`border\`, \`border-{side}\` | \`border-width\`, \`border-radius\`, \`color-border\`, \`color-brand\` |
| \`border-color\`, \`border-{side}-color\`, \`outline-color\` | \`color-border\`, \`color-brand\` |
| \`border-width\`, \`border-{side}-width\`, \`outline-width\` | \`border-width\` |
| \`outline\` | \`border-width\`, \`color-border\`, \`color-brand\` |
| \`border-radius\`, \`border-{corner}-radius\` | \`border-radius\` |
| \`box-shadow\` | \`shadow\`, \`border-width\`, \`color-border\`, \`color-brand\` |
| \`margin*\`, \`gap\`, \`row-gap\`, \`column-gap\`, \`border-spacing\` | \`space\` |
| \`padding*\` | \`space\`, \`padding\` |
| \`font\` | \`font-family\`, \`font-size\`, \`font-weight\` |
| \`font-family\`, \`font-size\`, \`font-weight\`, \`line-height\`, \`letter-spacing\` | the token family of the same name |
| \`width\`, \`min-width\`, \`max-width\` | \`icon-size\`, \`breakpoint\` |
| \`height\`, \`min-height\`, \`max-height\` | \`icon-size\` |
| \`top\`, \`right\`, \`bottom\`, \`left\`, \`inset\`, \`background-size\`, \`column-width\` | none — no token may be used |

The source of truth is [\`token-map.mjs\`](${REPO_URL.replace('/tree/', '/blob/')}/stylelint-plugin-design-tokens/rules/use-proper-token/token-map.mjs).

#### \`token-constant-requires-css-var\` (ESLint)

The template-side counterpart of \`token-var-usage\`: a \`KUI_*\` constant imported from \`@kong/design-tokens\` and used in a Vue \`<template>\` binding must be wrapped as \`\` \`var(--kui-x, \${KUI_X})\` \`\`. Only template bindings are checked — \`<script>\` code is not, and \`<style>\` blocks are covered by stylelint.

- **Autofixed:** direct bindings (\`:color="KUI_X"\`), ternary branches, and object values in \`:style\`.
- **Reported, fix by hand:** template literals, string concatenation, function arguments (\`darken(KUI_X)\` — the function may not accept a \`var()\` string), and a \`<script setup>\` variable holding a token (\`const c = KUI_X\`). Wrap at the binding site.
- **Not detected:** tokens placed in a script-level object, \`ref()\`, or \`computed()\` before being bound, namespace imports (\`import * as tokens\`), re-exports through your own barrel files, and render functions / JSX. Wrap the token where the value is created, e.g. \`\` const styles = { padding: \`var(--kui-space-40, \${KUI_SPACE_40})\` } \`\`.
- **Excluded:** \`KUI_BREAKPOINT_*\` constants, which feed media-query logic where custom properties don't work.

Tokens from other packages can be tracked with the \`importSources\` option: \`['error', { importSources: ['@kong/design-tokens', 'my-tokens'] }]\`.
`

StyleDictionary.registerFormat({
  name: 'css/variables/custom/markdown',
  format: async function({ dictionary, file }) {
    // Value-carrying semantic tokens are documented in the SCSS/CSS/JS/JSON sections; value-less
    // component tokens are documented separately (CSS section only), rendered as `initial`.
    const valueTokens = dictionary.allTokens.filter(token => token.$type !== 'component')
    const componentTokens = dictionary.allTokens.filter(token => token.$type === 'component')

    // Generate the SCSS variable tokens
    const scssTokens = valueTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.$value))
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `$${token.name}: ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the SCSS variable tokens
    const scssMap = valueTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.$value))
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `  /* ${comment} */\n`
      }
      tokenOutput += `  '${token.name}': ${value},`
      return tokenOutput
    }).join('\n')

    // Generate the CSS custom properties
    const cssTokens = valueTokens.map(token => {
      const value = unquoteString(JSON.stringify(token.$value))
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `--${token.name}: ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the component-token CSS custom properties. Component tokens are value-less override
    // slots, so they are documented with `initial` (no default value) rather than a resolved value.
    const cssComponentTokens = componentTokens.map(token => {
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `--${token.name}: initial;`
      return tokenOutput
    }).join('\n')

    // Generate the themeable-tokens registry (semantic + value-less component tokens), rendered
    // identically to the exported `KUI_THEMEABLE_TOKENS` array.
    const themeableTokens = buildRecords(dictionary).map(renderJsObject).join('\n')

    // Generate the JavaScript variable tokens
    const javascriptTokens = valueTokens.map(token => {
      const value = JSON.stringify(token.$value)
      const comment = unquoteString(JSON.stringify(token.$description))

      let tokenOutput = ''
      if (comment) {
        tokenOutput += `/* ${comment} */\n`
      }
      tokenOutput += `export const ${token.name.replace(/-/g, '_').toUpperCase()} = ${value};`
      return tokenOutput
    }).join('\n')

    // Generate the JavaScript variable tokens
    const jsonTokens = valueTokens.map((token, idx) => {
      const value = JSON.stringify(token.$value)

      let tokenOutput = `  "${token.name.replace(/-/g, '_').toLowerCase()}": ${value},`
      if ((idx + 1) === valueTokens.length) {
        tokenOutput = tokenOutput.replace(/,$/, '')
      }
      return tokenOutput
    }).join('\n')

    // Generate the markdown file
    return (await fileHeader({ file })).replace('/**', '<!--').replace(' */', '-->') + `# Kong Design Tokens

This document outlines the majority of the available tokens and explains how to use them — see [Usage](#usage) at the end.

## SCSS

### SCSS Variables

<details>

<summary>Click to view the list of SCSS variables</summary>

\`\`\`scss
${scssTokens}
\`\`\`

</details>

### SCSS Map

<details>

<summary>Click to view exported SCSS map</summary>

\`\`\`scss
$tokens-map: (
${scssMap}
);
\`\`\`

</details>

## CSS

### CSS Custom Properties

You may scope your CSS custom property overrides inside the \`:root\` selector as shown here, or inside any other valid CSS selector.

<details>

<summary>Click to view the list of CSS custom properties</summary>

\`\`\`css
${cssTokens}
\`\`\`

</details>

### Component CSS Custom Properties

Component tokens are documented here for reference. They ship **with no default value** (shown as \`initial\`) — they exist purely as override slots consumed via \`var()\` fallback chains, and only take effect when a theme or host application sets them.

<details>

<summary>Click to view the list of component CSS custom properties</summary>

\`\`\`css
${cssComponentTokens}
\`\`\`

</details>

## JavaScript

### JavaScript / TypeScript Constants

<details>

<summary>Click to view the list of JavaScript variables</summary>

\`\`\`javascript
${javascriptTokens}
\`\`\`

</details>

### Themeable Tokens

\`KUI_THEMEABLE_TOKENS\` (exported from \`@kong/design-tokens/tokens/themeable-tokens\`) lists every \`--kui-*\` custom property a theme may override — both semantic tokens and value-less component tokens (\`value: null\`). Each entry is a \`{ name, description, category, value }\` record.

<details>

<summary>Click to view the KUI_THEMEABLE_TOKENS array</summary>

\`\`\`javascript
export const KUI_THEMEABLE_TOKENS = [
${themeableTokens}
]
\`\`\`

</details>

### JSON

<details>

<summary>Click to view the exported JSON object</summary>

\`\`\`json
{
${jsonTokens}
}
\`\`\`

</details>

${USAGE_INSTRUCTIONS}`
  },
})

/**
 * Markdown files
 */
export default {
  transformGroup: 'web',
  buildPath: `${TOKEN_DIRECTORY}/`,
  transforms: [
    'attribute/cti',
    'name/kebab',
    'color/css',
  ],
  files: [
    {
      format: 'css/variables/custom/markdown',
      destination: 'README.md',
      // Exclude alias tokens and asset tokens. Component tokens ARE included: the format documents
      // them separately (CSS section, rendered as `initial`) and in the KUI_THEMEABLE_TOKENS array.
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}
