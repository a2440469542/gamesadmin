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

  {
    path: '/admin',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Admin',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/commonSetting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CommonSetting',
        component: () => import('@/views/commonSetting/index'),
        meta: { title: '通用配置', icon: 'el-icon-s-tools' }
      }
    ]
  },
  {
    path: '/carousel',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'carousel',
        component: () => import('@/views/carousel/index'),
        meta: { title: '轮播图', icon: 'el-icon-picture' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-s-custom' }
      }
    ]
  },
  {
    path: '/Menu',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Menu',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'el-icon-menu' }
      }
    ]
  },
  {
    path: '/Role',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/Channel',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Channel',
        component: () => import('@/views/channel/index'),
        meta: { title: '渠道管理', icon: 'channel' }
      }
    ]
  },
  {
    path: '/ChargeLog',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ChargeLog',
        component: () => import('@/views/chargeLog/index'),
        meta: { title: '充值记录', icon: 'el-icon-money' }
      }
    ]
  },
  {
    path: '/WithdrawLog',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'WithdrawLog',
        component: () => import('@/views/withdrawLog/index'),
        meta: { title: '提现记录', icon: 'el-icon-wallet' }
      }
    ]
  },
  {
    path: '/GameLog',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'GameLog',
        component: () => import('@/views/gameLog/index'),
        meta: { title: '游戏记录', icon: 'el-icon-box' }
      }
    ]
  },
  {
    path: '/Game',
    component: Layout,
    meta: { title: '游戏管理', icon: 'el-icon-s-platform' },
    name: 'GameManagement',
    children: [
      {
        path: 'gamePlatform',
        component: () => import('@/views/gamePlatform/index'),
        name: 'GamePlatform',
        meta: { title: '游戏平台', icon: 'el-icon-s-platform' }
      },
      {
        path: 'game',
        component: () => import('@/views/game/index'),
        name: 'Game',
        meta: { title: '游戏列表' }
      }
    ]

  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
