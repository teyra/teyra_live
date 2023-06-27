export const routes = [
  {
    path: '/',
    redirect: '/live-pull'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
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
