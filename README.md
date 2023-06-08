# Kong UI Design System

Kong's Design System and **Style Dictionary**, created with [Style Dictionary](https://github.com/amzn/style-dictionary).

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> **Note**: Repository and documentation is a work in progress.

A **Style Dictionary** is a build system that allows you to define styles once, in a way for any platform or language to consume. A single place to create and edit your styles, and a single command exports these rules to all the places you need them - iOS, Android, CSS, JS, HTML, sketch files, style documentation, or anything you can think of.

- [Usage](#usage)
- [Tokens](#tokens)
  - [Token Requirements](#token-requirements)
- [Local Development](#local-development)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Build for production](#build-for-production)
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

## Local Development

To get started, install the package dependencies

```sh
yarn install --frozen-lockfile
```

### Development Sandbox

This repository includes a Vue sandbox (see the `/sandbox` directory) to allow you to experiment with consuming tokens.

To start the sandbox:

```sh
yarn run sandbox
```

This command will simultaneously start the Vite dev server and initialize a watcher on the `/tokens` directory. If any files in the `/tokens` directory are modified, the sandbox will automatically run the build command to update the tokens and then restart the Vite dev server (simulating hot module reload).

Updating any files within the sandbox itself will also trigger hot module reload as expected.

### Lint and fix

Lint package files, and optionally auto-fix detected issues.

```sh
# Lint only
yarn run lint

# Lint and fix
yarn run lint:fix
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
