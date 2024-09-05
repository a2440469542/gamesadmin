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
    path: '/menu',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Menu',
      component: () => import('@/views/menu/index'),
      meta: { title: '菜单管理', icon: 'el-icon-menu' }
    }]
  },
  {
    path: '/bill',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/billRecord/index'),
        name: 'billRecord',
        meta: { title: '帐变记录', icon: 'el-icon-notebook-2' }
      }
    ]
  },
  {
    path: '/salary',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/salaryRecord/index'),
        name: 'billRecord',
        meta: { title: '工资明细', icon: 'el-icon-notebook-2' }
      }
    ]
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
      // {
      //   path: 'menu',
      //   name: 'Menu',
      //   component: () => import('@/views/menu/index'),
      //   meta: { title: '菜单管理', icon: 'el-icon-menu' }
      // },
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
    path: '/role',
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
    path: '/data',
    component: Layout,
    children: [{
      path: 'index',
      name: 'data',
      component: () => import('@/views/dataCount/index'),
      meta: { title: '数据统计', icon: 'dashboard' }
    },
    {
      path: 'channel',
      name: 'data_channel',
      component: () => import('@/views/dataCount/channel.vue'),
      meta: { title: '渠道数据统计', icon: 'dashboard' }
    },
    {
      path: 'channel_everyday',
      name: 'channel_everyday',
      component: () => import('@/views/dataCount/everyday.vue'),
      meta: { title: '渠道每日统计', icon: 'dashboard' }
    },
    {
      path: 'vip',
      name: 'vip',
      component: () => import('@/views/dataCount/vip.vue'),
      meta: { title: 'VIP等级数据统计', icon: 'dashboard' }
    },
  ]},
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
    path: '/sign_in',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'sign_in',
        component: () => import('@/views/sign_in/index'),
        meta: { title: '签到配置', icon: 'el-icon-box' }
      }
    ]
  },
  {
    path: '/game',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/game/index'),
        name: 'Game',
        meta: { title: '游戏列表', icon: 'el-icon-coordinate' }
      }
    ]
  },
  {
    path: '/gamePlatform',
    component: Layout,
    name: 'GameManagement',
    children: [
      {
        path: 'index',
        component: () => import('@/views/gamePlatform/index'),
        name: 'GamePlatform',
        meta: { title: 'PG线路管理', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/blacklist',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/blacklist/index'),
        name: 'blacklist',
        meta: { title: '黑名单管理', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/banklist',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/banklist/index'),
        name: 'banklist',
        meta: { title: '用户银行卡', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/vip_level',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/vip/index.vue'),
        name: 'vip_level',
        meta: { title: 'VIP等级配置', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/agent/index'),
        name: 'agent',
        meta: { title: '代理列表', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/activity/index'),
        name: 'activity',
        meta: { title: '活动列表', icon: 'el-icon-s-platform' }
      },
      {
        path: 'video',
        component: () => import('@/views/activity/video'),
        name: 'video',
        meta: { title: '短视频分享活动', icon: 'el-icon-s-platform' }
      },
      {
        path: 'lucky',
        component: () => import('@/views/activity/lucky'),
        name: 'lucky',
        meta: { title: '幸运星配置', icon: 'el-icon-s-platform' }
      },
    ]
  },

]

export const asyncRoutes = [
  {
    path: '/menu',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Menu',
      component: () => import('@/views/menu/index'),
      meta: { title: '菜单管理', icon: 'el-icon-menu' }
    }]
  },
  {
    path: '/bill',
    component: Layout,
    children: [
      {
        path: 'billRecord',
        component: () => import('@/views/billRecord/index'),
        name: 'billRecord',
        meta: { title: '帐变记录', icon: 'el-icon-notebook-2' }
      }
    ]
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
      // {
      //   path: 'menu',
      //   name: 'Menu',
      //   component: () => import('@/views/menu/index'),
      //   meta: { title: '菜单管理', icon: 'el-icon-menu' }
      // },
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
    path: '/data',
    component: Layout,
    children: [{
      path: 'index',
      name: 'data',
      component: () => import('@/views/dataCount/index'),
      meta: { title: '数据统计', icon: 'dashboard' }
    }]
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
    path: '/Game/index',
    component: Layout,
    children: [
      {
        path: 'game',
        component: () => import('@/views/game/index'),
        name: 'Game',
        meta: { title: '游戏列表', icon: 'el-icon-coordinate' }
      }
    ]
  },
  {
    path: '/Game',
    component: Layout,
    meta: { title: '游戏管理', icon: 'el-icon-coordinate' },
    name: 'GameManagement',
    children: [
      {
        path: 'gamePlatform',
        component: () => import('@/views/gamePlatform/index'),
        name: 'GamePlatform',
        meta: { title: 'PG线路管理', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/blacklist',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/blacklist/index'),
        name: 'blacklist',
        meta: { title: '黑名单管理', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/banklist',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/banklist/index'),
        name: 'banklist',
        meta: { title: '用户银行卡', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/agent/index'),
        name: 'agent',
        meta: { title: '代理列表', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/activity/index'),
        name: 'activity',
        meta: { title: '活动列表', icon: 'el-icon-s-platform' }
      },
     
    ]
  }
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
