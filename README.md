# Kong UI Design Tokens

Kong's Design Tokens and **Style Dictionary**, created with [Style Dictionary](https://github.com/amzn/style-dictionary).

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> **Note**: Repository and documentation is a work in progress. This package is currently for Kong internal-use only, but is published publicly in order to consume in our OSS projects.

A **Style Dictionary** is a build system that allows you to define styles once, in a way for any platform or language to consume. A single place to create and edit your styles, and a single command exports these rules to all the places you need them - iOS, Android, CSS, JS, HTML, sketch files, style documentation, or anything you can think of.

- [Usage](#usage)
- [Tokens](#tokens)
  - [Token Requirements](#token-requirements)
- [Updating Tokens \& Local Development](#updating-tokens--local-development)
  - [VS Code extensions](#vs-code-extensions)
  - [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Build for production](#build-for-production)
  - [Token Update Workflow](#token-update-workflow)
  - [Committing Changes](#committing-changes)
  - [Package Publishing](#package-publishing)

## Usage

TODO.

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
