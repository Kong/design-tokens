// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import router from './router'
import HomeView from './pages/HomeView.vue'
import CustomizerView from './pages/CustomizerView.vue'
import ThemeBuilderView from './pages/ThemeBuilderView.vue'
import EmbeddedView from './pages/EmbeddedView.vue'

/**
 * Nothing else in this codebase verifies the actual path → component wiring in `router.ts` —
 * every other spec either mounts a component directly (bypassing the router) or uses its own
 * throwaway `createRouter()` just for `<router-link>` behavior. A typo'd path or a wrong
 * component import here would silently break navigation (or the bookmarklet's `/embedded`
 * destination) with nothing catching it, so this is worth its own minimal, direct check.
 */
async function resolve(path: string) {
  await router.push(path)
  await router.isReady()
  return router.currentRoute.value
}

describe('router', () => {
  it('resolves / to HomeView', async () => {
    const route = await resolve('/')
    expect(route.name).toBe('home')
    expect(route.matched[0]?.components?.default).toBe(HomeView)
  })

  it('resolves /customize to CustomizerView', async () => {
    const route = await resolve('/customize')
    expect(route.name).toBe('customize')
    expect(route.matched[0]?.components?.default).toBe(CustomizerView)
  })

  it('resolves /theme-builder to ThemeBuilderView', async () => {
    const route = await resolve('/theme-builder')
    expect(route.name).toBe('theme-builder')
    expect(route.matched[0]?.components?.default).toBe(ThemeBuilderView)
  })

  it('resolves /embedded to EmbeddedView — the bookmarklet\'s one destination', async () => {
    const route = await resolve('/embedded')
    expect(route.name).toBe('embedded')
    expect(route.matched[0]?.components?.default).toBe(EmbeddedView)
  })

  it('preserves query params (e.g. ?embedded=1&tool=...) across resolution', async () => {
    const route = await resolve('/embedded?embedded=1&tool=theme-builder')
    expect(route.query.embedded).toBe('1')
    expect(route.query.tool).toBe('theme-builder')
  })
})
