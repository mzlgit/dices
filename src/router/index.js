import { createRouter, createWebHistory } from 'vue-router'
import index from '../views/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: index
    },
    {
      path: '/babylon',
      name: 'babylon',
      component: () => import('../views/babylon.vue')
    },
    // {
    //   path: '/zdog',
    //   name: 'zdog',
    //   component: () => import('../views/zdog.vue')
    // }
  ]
})

export default router
