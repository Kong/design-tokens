import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from './pages/HomeView.vue'
import CustomizerView from './pages/CustomizerView.vue'
import ThemeBuilderView from './pages/ThemeBuilderView.vue'
import EmbeddedView from './pages/EmbeddedView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Browse' },
  },
  {
    path: '/customize',
    name: 'customize',
    component: CustomizerView,
    meta: { title: 'Customize' },
  },
  {
    path: '/theme-builder',
    name: 'theme-builder',
    component: ThemeBuilderView,
    meta: { title: 'Theme Builder' },
  },
  {
    path: '/embedded',
    name: 'embedded',
    component: EmbeddedView,
    meta: { title: 'Sandbox' },
  },
]

const router = createRouter({
  // Hash routing ensures direct navigation and refresh work on GitHub Pages (static hosting)
  // without a server-side fallback. All routing state lives after the `#`.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
