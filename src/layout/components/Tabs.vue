<template>
  <div class="tabs">
    <el-tabs v-model="activeName" type="card" editable @edit="handleTabsEdit" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabbars"
        :key="item.path"
        :label="item.meta.title"
        :name="item.path"
      />
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  data() {
    return {
      activeName: 'Lobby',
      tabbars: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'])
  },
  watch: {
    $route() {
      this.setTabs()
    }
  },
  created() {
    this.setTabs()
  },
  methods: {
    setTabs() {
      console.log('tabs：：：', this.tabbars, this.$route)
      this.tabbars = this.tabbars.push(this.$route)
      this.editableTabsValue = this.$route.path
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.$emit('addTab', targetName)
      } else if (action === 'remove') {
        this.$emit('removeTab', targetName)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
    padding: 10px;
}
</style>
