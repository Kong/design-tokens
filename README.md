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

Releases are managed by [lerna-lite](https://github.com/lerna-lite/lerna-lite) in independent mode — each package is versioned and published automatically based on conventional commits on `main`, `alpha`, and `beta` branches.
