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
    component: () => import('@/views/livestream/pusher.vue')
  },
  {
    path: '/live-pull',
    name: 'LivePull1',
    component: () => import('@/views/livestream/puller.vue')
  },
  {
    path: '/live-push1',
    name: 'LivePush1',
    component: () => import('@/views/livestream/pusher1.vue')
  },
  {
    path: '/live-pull1',
    name: 'LivePull',
    component: () => import('@/views/livestream/puller1.vue')
  },
  {
    path: '/meeting',
    name: 'meeting',
    component: () => import('@/views/mediaSoup/meeting.vue')
  }
]
