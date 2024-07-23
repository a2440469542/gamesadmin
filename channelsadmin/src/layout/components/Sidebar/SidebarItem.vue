<template>
  <el-submenu v-if="item.children && item.children.length" :index="item.path || index">
    <template slot="title">
      <i class="el-icon-menu" />
      <span>{{ item.name }}</span>
    </template>
    <submenu-item
      v-for="(child, idx) in item.children"
      :key="idx"
      :item="child"
      :index="`${index}-${idx}`"
      @click="$emit('click', child.path)"
    />
  </el-submenu>
  <el-menu-item v-else :index="item.path || index" @click="$emit('click', item.path)">
    <i class="el-icon-menu" />
    <span>{{ item.name }}</span>
  </el-menu-item>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SubmenuItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    index: {
      type: String,
      default: ''
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        //console.log('onlyOneChild', item)
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath = '') {
      console.log('resolvePath', routePath)
      if (!routePath) {
        return
      }
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
