export const routes = [
  {
    path: '/',
    redirect: '/live-pull'
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/live-push',
    name: 'LivePush',
    component: () => import('@/views/livestream/pusher1.vue')
  },
  {
    path: '/live-pull',
    name: 'LivePull',
    component: () => import('@/views/livestream/puller1.vue')
  },
  {
    path: '/meeting',
    name: 'meeting',
    component: () => import('@/views/mediaSoup/meeting.vue')
  }
]
