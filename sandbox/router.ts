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
  history: createWebHistory(),
  routes,
})

export default router
