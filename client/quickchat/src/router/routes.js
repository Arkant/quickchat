
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Main', path: '', component: () => import('pages/Index.vue') },
      { name: 'Login', path: 'login', component: () => import('pages/Login.vue') },
      { name: 'Sign up', path: 'sign-up', component: () => import('pages/Sign-up.vue') }
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
