# Kong UI Design Tokens

Kong Design Tokens, via [Style Dictionary](https://github.com/amzn/style-dictionary).

> **Note**: Repository and documentation is a work in progress. This package is currently for Kong internal-use only, but is published publicly in order to consume in our OSS projects.

- [Tokens](#tokens)
  - [Token Formats](#token-formats)
  - [SCSS Variables](#scss-variables)
  - [JavaScript Variables](#javascript-variables)
  - [CSS Variables](#css-variables)
- [Usage](#usage)
  - [Installation](#installation)
  - [Recommended VS Code extension](#recommended-vs-code-extension)
  - [Standalone components](#standalone-components)
  - [Host applications](#host-applications)
- [Updating Tokens \& Local Development](#updating-tokens--local-development)
  - [Token Requirements](#token-requirements)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Build for production](#build-for-production)
  - [Token Update Workflow](#token-update-workflow)
  - [Committing Changes](#committing-changes)
  - [Package Publishing](#package-publishing)

## Tokens

All design tokens **must** be placed inside of the `/tokens` directory in one of two sub-directories.

[View the lists of available tokens here](TOKENS.md), or keep reading for more information.

### Token Formats

The `@kong/design-tokens` package exports tokens in multiple formats:

- [SCSS variables](#scss-variables)
- [JavaScript variables](#javascript-variables) (ESM and CJS), along with corresponding TypeScript types
- [CSS variables](#css-variables) (**for reference only**)

Exports are available from the package root, meaning you do not need to include the `dist/` directory in your imports:

```ts
// Notice that for JavaScript/TypeScript, we can just import from the root
import { KUI_COLOR_BACKGROUND_PRIMARY_STRONG } from '@kong/design-tokens'
```

### SCSS Variables

SCSS variables can be utilized in your project's SCSS files or in-component style blocks (this assumes your app is already configured to compile Sass).

To use the SCSS variables, you need to import them into your component or app stylesheet so they are available throughout your project utilizing one of the methods below:

#### Import into your app or component's stylesheet or style block

```scss
@import '@kong/design-tokens/tokens/scss/variables';
```

#### Globally import with Vite

If your component or application utilizes [Vite](https://vitejs.dev/) to build and compile, you may add the following configuration to your `vite.config.ts` to import the SCSS variables into all components within your project

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Inject the @kong/design-tokens SCSS variables to make them available for all components.
        additionalData: '@import "@kong/design-tokens/tokens/scss/variables";',
      },
    },
  },
})
```

### JavaScript Variables

JavaScript variables can be utilized in your project's component files, or other JavaScript/TypeScript files.

To use the JavaScript variables, simply import the variables you need into your component/file:

```ts
// Notice that for JavaScript/TypeScript, we can just import from the root
import { KUI_COLOR_BACKGROUND_PRIMARY_STRONG } from '@kong/design-tokens'
```

### CSS Variables

**IMPORTANT**: You should **never** import the `@kong/design-tokens/tokens/css/variables.css` file in your host project.

While CSS variables are _utilized_ in Kong's repositories to allow for CSS customization, the variables themselves are never actually provided values or imported from this package.

The purpose of the `@kong/design-tokens/tokens/css/variables.css` file is to provide a list of all available CSS variables, to utilize alongside auto-complete extensions in your IDE, etc.

If you want to customize default token values, provided the element(s) in question utilize CSS variable fallbacks, simply set the variables from this list to your desired value within your host application, scoped inside your desired CSS selector, and it will override the default value.

You may scope your CSS variable overrides inside the `:root` selector as shown here, or inside any other valid CSS selector.

```html
<style>
// You may scope the variable to `root:` to impact the whole application...
:root {
  --kui-color-text-primary: green;
}

// ...or scope the variable to a specific container to keep the changes isolated
table .my-table-row {
  --kui-color-text-primary: purple;
}
</style>
```

## Usage

### Installation

In your host project, install the package **only** as a `devDependency`:

```shell
yarn add -D @kong/design-tokens
```

#### Why a `devDependency`?

This package is intended to be consumed by a host component or application that will be compiled before publishing. This means when the component or app is compiled, any tokens it consumes (e.g. SCSS tokens, JavaScript variables, etc.) will be replaced during the build with the static token value.

This strategy alleviates the need for a consuming application to need to install the `@kong/design-tokens` package when using a component that utilizes the tokens under-the-hood.

### Recommended VS Code extension

To get auto-completion of the SCSS variables in your project within VS Code, you can add the [SCSS IntelliSense extension](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss) to VS Code on your machine along with the corresponding settings object which will auto-import the variables for auto-completion. Notice that we are explicitly **not excluding** `node_modules`:

```jsonc
// settings.json
{
  "scss.scannerExclude": [
    "**/.git",
    "**/bower_components"
  ]
}
```

If you are installing the package as a `devDependency` in your project, you can add a `/.vscode/settings.json` file into your project that will enforce these settings in your project for all developers.

### Standalone components

The primary consideration when using Kong's design tokens in **components** is to determine if the component needs to allow for downstream customization.

**If your component does not need to offer any customization, only utilize the SCSS and JavaScript design tokens in your component.**

If your component _does_ want to offer customization, you will want to reference the corresponding token CSS variable with a fallback SCSS variable.

#### Component Example

As an example, in Kong's [Kongponents](https://kongponents.konghq.com) Vue component library, we want to offer deep levels of customization to allow for an _external_ host application to override component styles. Enabling customization is easy by using the Kong Design Token's CSS variables with SCSS variable values as the fallback.

```html
<style lang="scss">
// Import SCSS variables
@import "@kong/design-tokens/tokens/scss/variables";

.my-component-class {
  --my-css-variable: var(--kui-space-10, #{$kui-space-10});
  margin: var(--my-css-variable);
  color: var(--kui-color-text-primary, $kui-color-text-primary);
  font-weight: var(--kui-font-weight-semibold, $kui-font-weight-semibold);
  padding: var(--kui-space-20, $kui-space-20) var(--kui-space-40, $kui-space-40);
}
</style>
```

Inspecting the example above, you will notice that we fist import the SCSS variables. We then set each style property to the CSS variable, using the SCSS static variable as the fallback.

**Important**: notice we do **not** import CSS variables.

When Kongponents are imported and used in a host application, the components will utilize the SCSS fallback values by default since the CSS variables are undefined. This is the normal usage and works great for most applications.

**Note:** notice how you have to use [interpolation](https://sass-lang.com/documentation/interpolation/) when using SCSS tokens in custom property values (such as defining your CSS variable).

If your application wants to customize some of the properties, it's easy by simply defining the CSS variables you want to override inside of your host application, as shown here:

```html
<style>
// You may scope the variable to `root:` to impact the whole application...
:root {
  --kui-color-text-primary: green;
}

// ...or scope the variable to a specific container to keep the changes isolated
table .my-table-row {
  --kui-color-text-primary: purple;
}
</style>
```

Now that we have set a value for the CSS variable `--kui-color-text-primary` in our host application, any instance of this CSS variable in the components will utilize our custom value instead of the default value.

### Host applications

Typically, a host application should only utilize the SCSS and/or JavaScript variables to define its styles. Host applications typically **do not need to be customized** after compile time, meaning there is no reason to use the CSS variables with SCSS variable fallbacks. Here's an example:

```html
<style lang="scss">
// Import SCSS variables
@import "@kong/design-tokens/tokens/scss/variables";

// We directly reference the SCSS variables here which will be replaced with static values during the build
.my-app-custom-class {
  color: $kui-color-text-primary;
  font-weight: $kui-font-weight-semibold;
  padding: $kui-space-20 $kui-space-40;
}
</style>
```

#### Server-Side Rendering (SSR)

If your host application utilizes SSR, you may need to resolve aliases to the package exports.

For example, in a [VitePress](https://vitepress.vuejs.org/) site, add the following to your `vite.config.ts`

```ts
export default defineConfig({
  resolve: {
    alias: {
      // Explicitly alias the SCSS file since we are overriding the default import below
      '@kong/design-tokens/tokens/scss/variables': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/scss/variables.scss'),
      // Alias `@kong/design-tokens` imports to specifically utilize the esm build
      '@kong/design-tokens': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/js/'),
    },
  },
})
```

## Updating Tokens & Local Development

To get started, install the package dependencies

```sh
yarn install --frozen-lockfile
```

### Token Requirements

- Tokens **must** be defined in the corresponding JSON files within the `/tokens` directory in one of two sub-directories:

    | Directory        | Description                                                                                                                                                                                                                                                                                                                                                                         |
    | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `/tokens/alias`  | The `alias` directory **must** only contain alias values that point directly to a raw CSS value. Any tokens defined within the `alias` directory **will not** be exposed in the package exports. Tokens defined in the `/tokens/alias/` directory can be utilized/referenced within the `/tokens/source/` files; however, these tokens will **NOT** be exported in the build files. |
    | `/tokens/source` | The `source` directory contains all tokens that **will be** available for consumption from the package exports.                                                                                                                                                                                                                                                                     |

- Token keys **must** be lowercase, snake_case, and defined in normal alphabetical order (rules enforced by the eslint config)
- The `category` of each token should be its own directory (e.g. `tokens/color/`)
- Each `type` of token should be a file in the `category` directory, named `{type}.json` (e.g. `tokens/color/background.json`)
- If there is only a single `type` of token within a `category`, you **should** name the file `index.json` (e.g. `tokens/line-height/index.json`)
- Component tokens **must** be defined within the `/tokens/source/components/` directory. All tokens for a component should be defined in a single JSON file, `{component-name}.json`, with the name of the component as the top-level property in the file.
- Token aliases (e.g. color aliases) **must not** be exposed/exported from the package exports
- Tokens at the "root" of their structure **must** be defined with a key of `"_"` to allow for nested child tokens.

    <details>

    <summary>Click to view an example of root-level tokens</summary>

    ```json
    {
      "color": {
        "text": {
          "_": {
            "comment": "blue-100",
            "value": "{color.alias.blue.100}"
          },
          "neutral": {
            "_": {
              "comment": "gray-100",
              "value": "{color.alias.gray.60}"
            },
            "strong": {
              "comment": "gray-70",
              "value": "{color.alias.gray.70}"
            }
          }
        }
      }
    }
    ```

    ```css
    /* Output */
    --kui-color-text: #000933;
    --kui-color-text-neutral: #6c7489;
    --kui-color-text-neutral-strong: #52596e;
    ```

    </details>

### Development Sandbox

This repository includes a Vue sandbox (see the `/sandbox` directory) to allow you to experiment with consuming tokens.

To start the sandbox:

```sh
yarn sandbox
```

This command will simultaneously start the Vite dev server and initialize a watcher on the `/tokens` directory. If any files in the `/tokens` directory are modified, the sandbox will automatically run the build command to update the tokens and then restart the Vite dev server (simulating hot module reload).

Updating any files within the sandbox itself will also trigger hot module reload as expected.

### Lint and fix

Lint package files, and optionally auto-fix detected issues.

```sh
# Lint only
yarn lint

# Lint and fix
yarn lint:fix
```

### Build for production

Utilize the `style-dictionary` CLI to build the token assets for production based on the configuration in `/config.js`.

```sh
yarn build
```

If additional sub-directories (other than `dist/tokens`) are added to the `dist/` directory in `/config.js`, you will also need to create a new corresponding entry in the `package.json > exports` section to allow for importing into the host project without `dist/` in the path.

For example, if I want to add a new `my-feature` folder, I'd update the `exports` entry as shown here:

```jsonc
"exports": {
  // ... more entries
  "./tokens/*": "./dist/tokens/*",
  "./my-feature/*": "./dist/my-feature/*" // New directory
}
```

### Token Update Workflow

1. Ensure you are on the `main` branch, then pull down the latest code by running `git checkout main && git pull origin main`
2. Checkout a new branch for your changes with `git checkout -b {type}/{jira-ticket}-{description}` - as an example, `git checkout feat/khcp-1234-add-color-tokens`
3. Add/edit the tokens in the `/tokens` directory as needed, ensuring to adhere to the [Token Requirements](#token-requirements)
4. Before committing your changes, locally run `yarn lint` to ensure you do not have any linting errors. If you have errors, you can try running `yarn lint:fix` to resolve
5. Commit your changes, adhering to [Conventional Commits](#committing-changes). To make this easier, you're encouraged to run `yarn commit` to help build your commit message
6. Push your branch up to the remote with `git push origin {branch-name}`
7. Open a pull request and request a review

### Committing Changes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

[Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is **highly recommended** to use the following command in order to create your commits:

```sh
yarn commit
```

This will trigger the Commitizen interactive prompt for building your commit message.

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo.

- A `commit-msg` hook is automatically setup that enforces commit message stands with `commitlint`, see [`lefthook.yml`](./lefthook.yaml)
- A `pre-push` hook is used that runs `eslint` before allowing you to push your changes to the repository

Additionally, CI will use `commitlint` to validate the commits associated with a PR in the `Lint and Validate` job.

### Package Publishing

This repository utilizes [Semantic Release](https://github.com/semantic-release/semantic-release) for automated package publishing and version updates.
