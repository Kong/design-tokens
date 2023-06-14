<template>
  <router-view />
</template>

<style lang="scss">
// Import CSS variables
@import "../dist/tokens/css/variables.css";

html,
body {
  font-family: var(--kui-font-family-text, 'Inter', sans-serif);
  margin: var(--kui-space-0);
  padding: var(--kui-space-0);
}

body {
  padding: var(--kui-space-20) var(--kui-space-40);
}
</style>
