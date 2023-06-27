import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './modules/common'
import { UserStore } from '@/stores/modules/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})
router.beforeEach(async (to) => {
  const token = localStorage.getItem('token')
  if (token) {
    const userStore = UserStore()
    await userStore.getUserInfo()
  } else if (
    // 检查用户是否已登录
    !token &&
    // ❗️ 避免无限重定向
    to.name !== 'Login'
  ) {
    // 将用户重定向到登录页面
    const path = '/login?redirect=' + to.fullPath
    return path
  }
})
export default router
