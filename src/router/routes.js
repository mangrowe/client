
const routes = [
  {
    path: '/teams/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/teams/Edit.vue') }
    ]
  },
  {
    path: '/teams/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/teams/Create.vue') }
    ]
  },
  {
    path: '/teams',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/teams/Index.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
