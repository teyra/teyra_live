import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './modules/common'
import { UserStore } from '@/stores/modules/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})
router.beforeEach(async (to) => {
  // const token = localStorage.getItem('token')
  // if (token) {
  //   const userStore = UserStore()
  //   await userStore.getUserInfo()
  // }
})
export default router
