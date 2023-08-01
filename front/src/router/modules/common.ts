export const routes = [
  {
    path: '/',
    redirect: '/live-push'
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
    path: '/mobile/live-pull',
    name: 'mobilePull',
    component: () => import('@/views/livestream/mobile/pull.vue')
  },
  {
    path: '/meeting/oneToOne',
    name: 'OneToOne',
    component: () => import('@/views/meeting/OneToOne.vue')
  }
]
