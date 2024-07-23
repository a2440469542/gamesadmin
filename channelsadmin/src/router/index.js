import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/dailyReport',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'dailyReport',
        component: () => import('@/views/dailyReport/index'),
        meta: { title: '每日数据', icon: 'channel' }
      }
    ]
  },
  {
    path: '/mockAccount',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'mockAccount',
        component: () => import('@/views/mockAccount/index'),
        meta: { title: '虚拟账号', icon: 'channel' }
      }
    ]
  }
]

export const asyncRoutes = [
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
