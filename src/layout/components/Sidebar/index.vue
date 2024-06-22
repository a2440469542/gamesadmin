<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'menus'
    ]),
    routes() {
      // console.log('菜单', this.mergeArraysByPath(this.menus, this.$router.options.routes))
      return this.mergeArraysByPath(this.menus, this.$router.options.routes)
      // 作为开发时使用
      // return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    mergeArraysByPath(arr1, arr2) {
      // 使用Map来存储arr1中的项，key为path，value为对应的对象
      const map = new Map(arr1.map(item => [item.path, item]))

      // 遍历arr2
      arr2.forEach(item => {
        // 如果map中已经有这个path，则更新该对象
        if (map.has(item.path)) {
          // 获取原有对象并更新其属性
          const originalItem = map.get(item.path)
          // 根据需要更新属性，这里假设我们想保留arr1中原有的属性，
          // 并且用arr2中的同名属性覆盖原有属性（如果存在的话）
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              originalItem[key] = item[key]
            }
          }
        }
        // 注意：根据你的需求描述，这里不处理arr2中有而arr1中没有的path的情况，
        // 即不做添加操作。如果需要添加，请取消下面注释
        // else {
        //   map.set(item.path, item); // 或者你想直接添加到arr1，这里需要修改实现逻辑
        // }
      })

      // 将Map转换回数组返回
      return Array.from(map.values())
    }
  }
}
</script>
