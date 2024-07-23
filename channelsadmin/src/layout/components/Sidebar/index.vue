<template>
  <div :class="{'has-logo':showLogo}">
    <logo :collapse="isCollapse" />
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
        <submenu-item v-for="(route, index) in routes" :key="index" :item="route" :base-path="route.path" @click="toPage" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SubmenuItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss'

export default {
  components: { SubmenuItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'menus'
    ]),
    routes() {
      //console.log(this.filterChildrenByIsMenu(this.menus))
      return this.filterChildrenByIsMenu(this.menus)
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
    filterChildrenByIsMenu(array) {
      return array.map(item => {
        // 复制当前项以避免修改原数组
        const newItem = { ...item }

        // 检查当前项是否有children并且children不是空数组
        if (newItem.children && newItem.children.length > 0) {
          // 对children进行递归过滤
          newItem.children = this.filterChildrenByIsMenu(newItem.children)

          // 如果过滤后children为空数组（即所有子项的is_menu都为0），则删除children属性
          if (newItem.children.length === 0) {
            delete newItem.children
          }
        }

        // 仅当is_menu为1时保留当前项，否则返回null（后续处理中会被过滤掉）
        return newItem.is_menu === 1 ? newItem : null
      }).filter(Boolean) // 过滤掉null值
    },
    toPage(route) {
      console.log(route)
      this.$router.push({ path: route })
    }
  }
}
</script>
