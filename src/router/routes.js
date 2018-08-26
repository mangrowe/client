
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
    path: '/users/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/users/Create.vue') }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/users/Index.vue') }
    ]
  },
  {
    path: '/companies',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/companies/Index.vue') }
    ]
  },
  {
    path: '/companies/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/companies/Create.vue') }
    ]
  },
  {
    path: '/objectives/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/objectives/Edit.vue') }
    ]
  },
  {
    path: '/objectives/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/objectives/Create.vue') }
    ]
  },
  {
    path: '/objectives',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/objectives/Index.vue') }
    ]
  },
  {
    path: '/cycle/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/cycle/Create.vue') }
    ]
  },
  {
    path: '/cycle',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/cycle/Index.vue') }
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
