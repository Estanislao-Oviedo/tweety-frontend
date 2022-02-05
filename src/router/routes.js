
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/home' },
      { path: '/about', component: () => import('src/pages/About.vue'), name: 'About'},
      { path: '/home', component: () => import('src/pages/Home.vue'), name: 'Home' },
      { path: '/messages', component: () => import('src/pages/Messages.vue'), name: 'Messages not yet implemented' },
      //{ path: '/settings', component: () => import('src/pages/Settings.vue'), name: 'Settings' },
      { path: '/:link', component: () => import('src/pages/User.vue'), name: 'User'},
      { path: '/:link/status/:id', component: () => import('src/pages/Post.vue'), name: 'Post'},
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
