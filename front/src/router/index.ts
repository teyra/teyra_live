import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/live-push'
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/live-push',
      name: 'LivePush',
      component: () => import('@/views/livestream/pusher.vue')
    },
    {
      path: '/live-pull',
      name: 'LivePull',
      component: () => import('@/views/livestream/puller.vue')
    },
    {
      path: '/meeting',
      name: 'meeting',
      component: () => import('@/views/mediaSoup/meeting.vue')
    }
  ]
})
export default router