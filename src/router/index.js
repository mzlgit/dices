import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path: '/babylon',
    name: 'babylon',
    component: () => import('../views/babylon.vue')
  },
  {
    path: '*',
    redirect: "/index"
  }
]

const router = new VueRouter({
  routes,
  mode: "hash"
})

export default router
