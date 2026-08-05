<template>
  <div class="instructions-panel">
    <h3 class="ip-heading">
      What this is
    </h3>
    <p class="ip-text">
      The Token Customizer overrides any design token's value and previews the change live,
      directly on this page. Nothing is saved automatically — overrides live only in this
      sidebar session unless you export them.
    </p>

    <h3 class="ip-heading">
      How to use it
    </h3>
    <ol class="ip-steps">
      <li>Optionally pick a different <strong>Starting theme</strong> to begin from its values.</li>
      <li>Search or browse tokens on the <strong>Tokens</strong> tab, then edit a value — the page updates immediately.</li>
      <li>Use the <strong>Live preview</strong> switch above to compare with and without your changes.</li>
      <li>
        On the <strong>Export</strong> tab, copy or download the resulting CSS — or import a
        <code>.css</code> file (or paste CSS) to pick up where you left off.
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.instructions-panel { box-sizing: border-box; height: 100%; max-width: 640px; overflow-y: auto; padding: 20px; }

.ip-heading {
  color: $tb-text-muted;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin: 24px 0 10px;
  text-transform: uppercase;

  &:first-child { margin-top: 0; }
}

.ip-text {
  color: $tb-text;
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 8px;

  code { background: $tb-surface-2; border-radius: 3px; font-family: $tb-mono; font-size: 12px; padding: 1px 5px; }
}

.ip-steps {
  color: $tb-text;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  padding-left: 20px;

  li { margin-bottom: 10px; }

  code { background: $tb-surface-2; border-radius: 3px; font-family: $tb-mono; font-size: 12px; padding: 1px 5px; }
}
</style>
