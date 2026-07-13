# Minimal/partial overrides

Read this when the user only wants a handful of tokens overridden (e.g. "just recolor this
customer's primary button"), not a full color system or component set. Skip Steps 3 through 6B's
scaffold/iterate/extract/tear-down flow in `SKILL.md` entirely — it's needless overhead for a
small edit, and the theme classes in this repo can't represent "partial" anyway (both
`EXHAUSTIVE_THEMES` and `SEMANTIC_ONLY_THEMES` require every token in their tier to be present;
see `token-model.md`'s theme classes). Instead, hand-write a small CSS block directly, using real
`--kui-*` token names — verify each name is real (see below), don't guess or invent one:

```css
[data-kui-theme="<new>"] {
  --kui-color-background-primary: #123456;
  --kui-button-color-background-primary: #123456;
}
```

This relies on ordinary CSS cascade: any `--kui-*` custom property not set here simply inherits
its existing value, so you never need to enumerate the full token set for a targeted override.
Skip `SKILL.md` Steps 4-5 and the numbered scaffold flow entirely for this case.

**Confirming a token name exists.** Don't rely on memory or guessing for a token name, whether
for a minimal override above or while hand-editing a full scaffold. After any build
(`pnpm --filter @kong/design-tokens build:tokens`), the authoritative list is
`dist/tokens/themeable-tokens/index.mjs`'s `KUI_THEMEABLE_TOKENS` export — the same list
`themes.spec.mjs`'s own guards check against:

```sh
node -e "import('./dist/tokens/themeable-tokens/index.mjs').then(m => console.log(m.KUI_THEMEABLE_TOKENS.map(t => t.name).join('\n')))"
```

A theme file that sets a name not in this list fails the guarded build's drift check as an
"EXTRA token" (not silently dropped) — but for a hand-authored standalone CSS snippet, which
isn't guard-checked at all, a typo'd or invented token name would silently do nothing in the
consumer's app, so verify names up front rather than after the fact.
