const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', component: () => import('pages/IndexPage.vue') },
      { path: '/despesa', component: () => import('pages/DespesaPage.vue') },
      { path: '/formDespesa/:id?', component: () => import('pages/FormDespesaPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
