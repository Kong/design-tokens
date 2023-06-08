import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from './pages/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
