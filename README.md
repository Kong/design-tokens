# design-tokens

This is a **pnpm monorepo** that publishes three independently-versioned packages for Kong UI design systems.

## Packages

| Package | Description | Version |
|---|---|---|
| [`@kong/design-tokens`](./packages/design-tokens/README.md) | Konnect design tokens | [![npm](https://img.shields.io/npm/v/@kong/design-tokens.svg)](https://www.npmjs.com/package/@kong/design-tokens) |
| [`@kong/stylelint-plugin-design-tokens`](./packages/stylelint-plugin-design-tokens/README.md) | Stylelint plugin for Kong design token rules | [![npm](https://img.shields.io/npm/v/@kong/stylelint-plugin-design-tokens.svg)](https://www.npmjs.com/package/@kong/stylelint-plugin-design-tokens) |
| [`@kong/eslint-plugin-design-tokens`](./packages/eslint-plugin-design-tokens/README.md) | ESLint plugin for Kong design token rules | [![npm](https://img.shields.io/npm/v/@kong/eslint-plugin-design-tokens.svg)](https://www.npmjs.com/package/@kong/eslint-plugin-design-tokens) |

## Getting Started

Install dependencies from the repo root:

```sh
pnpm install
```

### Workspace Scripts

| Script | Description |
|---|---|
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Typecheck all packages |
| `pnpm sandbox:design-tokens` | Open the Konnect tokens sandbox |
| `pnpm commit` | Create a conventional commit |

### Building a single package

```sh
pnpm --filter @kong/design-tokens build
```

## Contributing

See each package's README for token structure, development workflow, and contribution guidelines.

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Run `pnpm commit` to create a guided commit message.

Releases are managed by [lerna-lite](https://github.com/lerna-lite/lerna-lite) in independent mode — each package is versioned and published automatically.

### Committing Changes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

[Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is **highly recommended** to use the following command from the repo root in order to create your commits:

```sh
pnpm commit
```

This will trigger the Commitizen interactive prompt for building your commit message.

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo.

- A `commit-msg` hook is automatically setup that enforces commit message standards with `commitlint`
- A `pre-push` hook is used that runs `eslint` before allowing you to push your changes to the repository

Additionally, CI will use `commitlint` to validate the commits associated with a PR in the `Lint and Validate` job.

### Agentic reviewer

[View the reference for the `/muthur` agentic reviewer](./agentic-reviewer.md)

### Approvals

- All pull requests require review and approval from authorized team members.
- Automated approvals through workflows are strictly prohibited.
  - There is an exception for automated pull request approvals originating from generated dependency updates that satisfy status checks and other requirements.
- Protected branches require at least one approval from code owners.
- All status checks must pass before a pull request may be merged.

### Package Publishing

Packages are published automatically via [lerna-lite](https://github.com/lerna-lite/lerna-lite) in independent mode. Releases are triggered by conventional commits on `main`, `alpha`, and `beta` branches.
