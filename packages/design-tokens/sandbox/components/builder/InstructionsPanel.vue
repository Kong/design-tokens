<template>
  <div class="instructions-panel">
    <h3 class="ip-heading">
      What this is
    </h3>
    <p class="ip-text">
      The Theme Builder edits a <a
        href="https://github.com/Kong/design-tokens/tree/main/packages/design-tokens"
        target="_blank"
      >@kong/design-tokens</a> theme's two source files — <code>*.theme.json</code> and
      <code>*.alias.color.json</code> — with a live preview, no token rebuild required. It has two
      override layers: editing a <strong>color alias</strong> (Color aliases tab) cascades into every
      token that references it; overriding an individual <strong>token</strong> (Tokens tab) wins over
      that cascade for just that token.
    </p>

    <h3 class="ip-heading">
      Starting a new theme
    </h3>
    <ol class="ip-steps">
      <li>
        From <code>packages/design-tokens</code>, scaffold it:
        <pre class="ip-code">node scripts/theme-scaffold.mjs &lt;name&gt;</pre>
        This seeds semantic tokens with their source defaults and leaves component tokens as
        empty slots for you to fill in deliberately.
      </li>
      <li>
        Load the two generated files — <code>themes/&lt;name&gt;/&lt;name&gt;.theme.json</code> and
        <code>&lt;name&gt;.alias.color.json</code> — with the file picker.
      </li>
    </ol>

    <h3 class="ip-heading">
      Editing an existing theme
    </h3>
    <p class="ip-text">
      Load its two files straight from <code>themes/&lt;name&gt;/</code> in the repo — the same
      <code>*.theme.json</code> and <code>*.alias.color.json</code> pair described above.
    </p>

    <h3 class="ip-heading">
      While editing
    </h3>
    <ul class="ip-list">
      <li>
        <strong>Color aliases</strong> — the palette this theme's color tokens draw from. Edited
        here, a step's new color applies everywhere it's referenced.
      </li>
      <li>
        <strong>Tokens</strong> — every token in the theme file. Color tokens can only be pointed
        at an alias (no freeform hex); everything else is a plain text value.
      </li>
      <li><strong>Export</strong> — preview the computed CSS, or download both edited source files.</li>
    </ul>

    <h3 class="ip-heading">
      Finishing up
    </h3>
    <p class="ip-text">
      Save the exported files back over their originals at <code>themes/&lt;name&gt;/</code>, then
      from <code>packages/design-tokens</code> run:
    </p>
    <pre class="ip-code">pnpm build:tokens &amp;&amp; pnpm test</pre>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.instructions-panel { padding: 20px; max-width: 640px; overflow-y: auto; height: 100%; box-sizing: border-box; }

.ip-heading {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $tb-text-muted;
  margin: 24px 0 10px;

  &:first-child { margin-top: 0; }
}

.ip-text {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.6;
  color: $tb-text;

  code { font-family: $tb-mono; font-size: 12px; background: $tb-surface-2; padding: 1px 5px; border-radius: 3px; }
}

.ip-steps, .ip-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.6;
  color: $tb-text;

  li { margin-bottom: 10px; }
  code { font-family: $tb-mono; font-size: 12px; background: $tb-surface-2; padding: 1px 5px; border-radius: 3px; }
}

.ip-code {
  margin: 6px 0;
  font-family: $tb-mono;
  font-size: 12px;
  color: $tb-text;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  padding: 8px 10px;
  overflow-x: auto;
}
</style>
