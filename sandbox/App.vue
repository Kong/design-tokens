<template>
  <router-view />
</template>

<style lang="scss">
html,
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}

// Remove default browser outline globally; each interactive element provides
// its own :focus-visible style so keyboard users always see a visible indicator.
*:focus { outline: none; }
*:focus-visible { outline: revert; }
</style>
