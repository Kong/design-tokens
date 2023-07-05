# Kong UI Design Tokens

Kong's Design Tokens and **Style Dictionary**, created with [Style Dictionary](https://github.com/amzn/style-dictionary).

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> **Note**: Repository and documentation is a work in progress. This package is currently for Kong internal-use only, but is published publically in order to consume in our OSS projects.

A **Style Dictionary** is a build system that allows you to define styles once, in a way for any platform or language to consume. A single place to create and edit your styles, and a single command exports these rules to all the places you need them - iOS, Android, CSS, JS, HTML, sketch files, style documentation, or anything you can think of.

- [Tokens](#tokens)
  - [Token Requirements](#token-requirements)
  - [Package Exports](#package-exports)
- [Usage](#usage)
  - [Installation](#installation)
  - [Standalone components](#standalone-components)
  - [Host applications](#host-applications)
  - [Customization](#customization)
  - [Reusability](#reusability)
- [Updating Tokens \& Local Development](#updating-tokens--local-development)
  - [VS Code extensions](#vs-code-extensions)
  - [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Build for production](#build-for-production)
  - [Token Update Workflow](#token-update-workflow)
  - [Committing Changes](#committing-changes)
  - [Package Publishing](#package-publishing)

## Tokens

All design tokens **must** be placed inside of the `/tokens` directory in one of two sub-directories.

Directory | Description
---------|----------
`/tokens/alias` | The `alias` directory **must** only contain alias values that point directly to a raw CSS value. Any tokens defined within the `alias` directory **will not** be exposed in the package exports.
`/tokens/source` | The `source` directory contains all tokens that **will be** available for consumption from the package exports.

### Token Requirements

- Tokens **must** be defined in the corresponding JSON files within the `/tokens` directory
  - The `category` of each token should be its own directory.
  - Each `type` of token should be a file in the `category` directory, named `{type}.json`
  - If there is only a single `type` of token within a `category`, you **should** name the file `index.json`
- Token keys **must** be lowercase and snake_case
- Token keys **must** be defined in normal alphabetical order
- Tokens defined in the `/tokens/source/` directory **WILL** be exported in the build files.
- Tokens defined in the `/tokens/alias/` directory can be utilized/referenced within the `/tokens/source/` files; however, these tokens will **NOT** be exported in the build files.
- Token aliases (e.g. color aliases) **must not** be exposed/exported from the production build
- Component tokens **must** be defined within the `/tokens/source/components` directory. All tokens for a component should be defined in a single JSON file, `{component-name}.json`
- Tokens at the "root" of their structure **must** be defined with a key of `"_"` to allow for nested child tokens. Example:

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

### Package Exports

This package exports Kong's design tokens in multiple formats:

- JavaScript tokens (ESM and CJS), along with corresponding TypeScript types
- SCSS variables
- CSS variables, exported raw as well as within a SCSS mixin for scoping the parent container

## Usage

### Installation

In your host project, install the package **only** as a `devDependency`:

```shell
yarn add -D @kong/design-tokens
```

#### Why a `devDependency`?

This package is intended to be consumed by a host component or application that will be compiled before publishing. This means when the component or app is compiled, any tokens it consumes (e.g. SCSS tokens, JavaScript variables, etc.) will be replaced during the build with the static token value.

This strategy alleviates the need for a consuming application to need to install the `@kong/design-tokens` package when using a component that utilizes the tokens under-the-hood.

### Standalone components

The primary consideration when using Kong's design tokens in **components** is to determine if the component needs to allow for downstream customization.

**If your component does not need to offer any customization, only utilize the SCSS and JavaScript design tokens in your component.**

If your component _does_ want to offer customization, you will want to reference CSS variables with a fallback value.

As an example, in Kong's [Kongponents](https://kongponents.konghq.com) Vue component library, we want to offer deep levels of customization to allow for an _external_ host application to override component styles. Enabling customization is easy by using Kong's Design System's CSS variables with the SCSS variable as the fallback.

```html
<style lang="scss">
// Import SCSS variables
@import "@kong/design-tokens/tokens/scss/variables";

.my-component-class {
  color: var(--kui-color-text-primary, $kui-color-text-primary);
  font-weight: var(--kui-font-weight-semibold, $kui-font-weight-semibold);
  padding: var(--kui-space-20, $kui-space-20) var(--kui-space-40, $kui-space-40);
}
</style>
```

Inspecting the example above, you will notice that we fist import the SCSS variables. We then set each style property to the CSS variable, using the SCSS static variable as the fallback.

**Important**: notice we did **not** import the CSS variables.

When Kongponents are imported and used in a host application, the components will utilize the SCSS fallback values by default since the CSS variables are undefined. This is the normal usage and works great for most applications.

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

Most commonly, a host application should utilize the SCSS and/or JavaScript variables to define its styles. Host applications typically do not need to be customized after compile time, meaning there is no reason to use the CSS variables with fallbacks. Here's an example:

```html
<style lang="scss">
// Import SCSS variables
@import "@kong/design-tokens/tokens/scss/variables";

.my-app-custom-class {
  color: $kui-color-text-primary;
  font-weight: $kui-font-weight-semibold;
  padding: $kui-space-20 $kui-space-40;
}
</style>
```

### Customization

### Reusability

## Updating Tokens & Local Development

To get started, install the package dependencies

```sh
yarn install --frozen-lockfile
```

### VS Code extensions

> Note: TODO

```json
{
  "cssVariables.lookupFiles": [
    "**/*.css",
    "**/*.scss",
    "node_modules/@kong/design-tokens/dist/tokens/css/variables.css",
  ],
  "scss.scannerExclude": [
    "**/.git",
    "**/bower_components",
    "**/node_modules/!(@kong/design-tokens),"
  ],
}
```

### Server-Side Rendering (SSR)

If your host app utilizes SSR, you may need to resolve aliases to the package exports.

For example, for a VitePress site, add the following to your `vite.config.ts`

```ts
export default defineConfig({
  resolve: {
    alias: {
      // We must alias `@kong/design-tokens` imports to specifically utilize the esm build
      '@kong/design-tokens/tokens/scss/variables': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/scss/variables.scss'),
      '@kong/design-tokens': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/js/'),
    },
  },
})

```

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

For example, if I want to add a new `icons` folder, I'd update the `exports` entry as shown here:

```jsonc
"exports": {
  "./package.json": "./package.json",
  "./tokens/*": "./dist/tokens/*",
  "./icons/*": "./dist/icons/*" // New directory
}
```

### Token Update Workflow

1. Pull down the latest code by running `git pull origin main`
2. Checkout a new branch for your changes with `git checkout -b {type}/{jira-ticket}-{description}` - as an example, `feat/khcp-1234-add-color-tokens`
3. Add/edit the tokens in the `/tokens` directory as needed, ensuring to adhere to the [Token Requirements](#token-requirements)
4. Before committing your changes, locally run `yarn lint` to ensure you do not have any linting errors. If you have errors, you can try running `yarn lint:fix` to resolve
5. Commit your changes, adhering to [Conventional Commits](#committing-changes). To make this easier, you're encouraged to run `yarn commit` to help build your commit message
6. Push your branch up to the remote with `git push origin {branch-name}`
7. Open a pull request and request review

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
