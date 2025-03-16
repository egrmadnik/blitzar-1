import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: [
      {
        path: '/',
        component: () => import('../layouts/MainLayout.vue'),
        children: [
          {
            path: '',
            component: () => import('../pages/Index.vue')
          },
          {
            path: 'blitz/list-form',
            component: () => import('../pages/ListFormExample.vue')
          },
          {
            path: 'blitz/blitz-form',
            component: () => import('../pages/BlitzFormExample.vue')
          },
          {
            path: 'blitz/filters-example',
            component: () => import('../pages/FiltersExample.vue')
          },
          {
            path: 'blitz/table-example',
            component: () => import('../pages/TableExample.vue')
          },
          {
            path: 'blitz/validation-example',
            component: () => import('../pages/ValidationExample.vue'),
          },
          {
            path: 'blitz/input-example',
            component: () => import('../pages/InputExample.vue'),
          },
          {
            path: 'blitz/dynamic-form',
            component: () => import('../pages/DynamicForm.vue'),
          },
          {
            path: 'blitz/conditional-fields',
            component: () => import('../pages/ConditionalFields.vue'),
          }
        ]
      },

      // Always leave this as last one,
      // but you can also remove it
      {
        path: '/:catchAll(.*)*',
        component: () => import('../pages/Error404.vue')
      }
    ],

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  return Router
})
