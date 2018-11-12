
const routes = [
  {
    path: '/reports',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/reports/Index.vue') }
    ]
  },
  {
    path: '/impediments/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/impediments/Create.vue') }
    ]
  },
  {
    path: '/impediments/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/impediments/Show.vue') }
    ]
  },
  {
    path: '/impediments',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/impediments/Index.vue') }
    ]
  },
  {
    path: '/objectives/dashboard',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/objectives/Dashboard.vue') }
    ]
  },
  {
    path: '/tags/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/tags/Show.vue') }
    ]
  },
  {
    path: '/tags',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/tags/Index.vue') }
    ]
  },
  {
    path: '/settings/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/settings/Edit.vue') }
    ]
  },
  {
    path: '/settings/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/settings/Create.vue') }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/settings/Index.vue') }
    ]
  },
  {
    path: '/departments/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/departments/Edit.vue') }
    ]
  },
  {
    path: '/departments/show',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/departments/Show.vue') }
    ]
  },
  {
    path: '/departments/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/departments/Create.vue') }
    ]
  },
  {
    path: '/departments',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/departments/Index.vue') }
    ]
  },
  {
    path: '/checkIns/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/checkIns/Edit.vue') }
    ]
  },
  {
    path: '/keyResults/edit/:id/checkIns/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/checkIns/Create.vue') }
    ]
  },
  {
    path: '/keyResults/edit/:id/checkIns',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/checkIns/Index.vue') }
    ]
  },
  {
    path: '/keyResults/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/keyResults/Edit.vue') }
    ]
  },
  {
    path: '/keyResults/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/keyResults/Create.vue') }
    ]
  },
  {
    path: '/keyResults/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/keyResults/Show.vue') }
    ]
  },
  {
    path: '/keyResults',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/keyResults/Index.vue') }
    ]
  },
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
    path: '/users/profile',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/users/Profile.vue') }
    ]
  },
  {
    path: '/users/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/users/Edit.vue') }
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
    path: '/organizations/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/organizations/Edit.vue') }
    ]
  },
  {
    path: '/organizations/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/organizations/Create.vue') }
    ]
  },
  {
    path: '/organizations',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/organizations/Index.vue') }
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
    path: '/objectives/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/objectives/Show.vue') }
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
    path: '/cycles/edit/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/cycles/Edit.vue') }
    ]
  },
  {
    path: '/cycles/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/cycles/Create.vue') }
    ]
  },
  {
    path: '/cycles',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/cycles/Index.vue') }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') }
    ]
  },
  {
    path: '/recover',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Recover.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ],
    meta: {
      guest: true
    }
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
