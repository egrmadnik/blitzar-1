import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/BlitzFormExample.vue'),
      },
      {
        path: '/validation-example',
        component: () => import('src/pages/ValidationExample.vue'),
      },
      {
        path: '/dynamic-form',
        component: () => import('src/pages/DynamicForm.vue'),
      },
      {
        path: '/conditional-fields',
        component: () => import('src/pages/ConditionalFields.vue'),
      }
    ]
  }
]

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  })

  return Router
})
