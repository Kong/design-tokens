import { createRouter, createWebHistory } from 'vue-router'
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
  // Pass the base URL from the Vite config to ensure the router works correctly when the sandbox is deployed to a subdirectory (e.g. GitHub pages)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
