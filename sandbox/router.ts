import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from './pages/HomeView.vue'
import CustomizerView from './pages/CustomizerView.vue'

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
]

const router = createRouter({
  // Hash routing ensures direct navigation and refresh work on GitHub Pages (static hosting)
  // without a server-side fallback. All routing state lives after the `#`.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
