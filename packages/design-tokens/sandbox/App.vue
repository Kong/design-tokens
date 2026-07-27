<template>
  <router-view v-slot="{ Component, route }">
    <!--
      Keying on the full route (including every query param) used to force a remount whenever
      ANY query changed — e.g. the token browser's search box or theme picker updating `?q=`/
      `?theme=` via `router.replace` on every keystroke, which destroyed and recreated the
      search input and threw away its focus mid-type. `embedded`/`host` are the only query
      params whose value is read once at setup (`getHashParam('embedded'|'host')` in
      TokenCustomizer/ThemeBuilder) and would otherwise go stale without a remount — see the
      standalone↔embedded staleness this key was originally added for. Every other query param
      (`q`, `theme`, `o`, `selector`, `inject`, …) is already reactive within the mounted
      instance and doesn't need one.
    -->
    <keep-alive :max="10">
      <component
        :is="Component"
        :key="`${route.path}?embedded=${route.query.embedded ?? ''}&host=${route.query.host ?? ''}`"
      />
    </keep-alive>
  </router-view>
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

// Thin scrollbars across all scrollable containers.
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 10, 60, 0.18) transparent;
}
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(0, 10, 60, 0.18);
  border-radius: 3px;
  &:hover { background: rgba(0, 10, 60, 0.32); }
}
</style>
