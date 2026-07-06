# @kong/design-token-skills

Claude skills for the `design-tokens` monorepo. This package is not published — it's a home
for reusable [Claude Code skills](https://docs.claude.com/en/docs/claude-code/skills) that
encode workflows specific to this repo (e.g. authoring a new design-tokens theme correctly,
with all the guards and conventions that entails).

## Available skills

| Skill | Purpose |
|---|---|
| [`theme-creation`](./theme-creation/SKILL.md) | Create a new theme for `@kong/design-tokens` — either checked into the repo, or as a standalone theme CSS file for another app. |

## Invoking a skill

These skills aren't auto-discovered by Claude Code (that requires a symlink or copy under
`.claude/skills/` at the repo root). To use one in a session, either:

- Point Claude at it directly: _"Read and follow packages/skills/theme-creation/SKILL.md to
  create a new theme."_
- Or symlink it into your local `.claude/skills/` if you want it to auto-trigger:
  ```sh
  mkdir -p .claude/skills
  ln -s ../../packages/skills/theme-creation .claude/skills/theme-creation
  ```
  (Note: `.claude/skills/` is not currently checked into this repo, so this step is local to
  your machine unless the team decides to commit the symlink.)

## Adding a new skill

Create a new `packages/skills/<skill-name>/SKILL.md` following the same structure as
`theme-creation` (frontmatter with `name` + `description`, an imperative body, and a
`references/` subdirectory for anything too long to keep inline). List it in the table above.
