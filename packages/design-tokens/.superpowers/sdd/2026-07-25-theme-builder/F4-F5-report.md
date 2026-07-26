# F4-F5 report

Status: done, all three fixes applied and verified.

Files changed:
- sandbox/composables/useEmbeddedBridge.ts
- sandbox/components/builder/FileLoader.vue
- sandbox/components/builder/AliasPicker.vue
- sandbox/components/builder/OutputPanel.vue
- sandbox/components/builder/PalettePanel.vue
- sandbox/components/builder/TokenList.vue
- sandbox/components/builder/TokenRow.vue

Verify: `pnpm build:tokens` + `pnpm typecheck:sandbox` clean; `pnpm exec eslint <7 files>` reported "No issues found".

Concerns: none.
