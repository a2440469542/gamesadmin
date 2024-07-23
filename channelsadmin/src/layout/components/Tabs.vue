<template>
  <div class="tabs" v-if="tabs.length > 0">
    <div class="tab-item" :class="{ active: activePath === item.path }" v-for="item in tabs" :key="item.path"
      @click="handleClick(item)">{{ item.meta.title || '' }}<i class="el-icon-close"
        @click.stop="handleTabsEdit(item, 'remove')"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  data() {
    return {
      tabbars: []
    }
  },
  computed: {
    ...mapGetters([
      'tabs']),
    activePath() {
      return this.$route.path
    }
  },
  watch: {
    $route() {
      this.setTabs()
    }
  },
  created() {
    // this.setTabs()
  },
  methods: {
    setTabs() {
      //console.log('tabs：：：', this.tabbars, this.$route, this.$store)
      // 使用 some 方法
      if (!this.tabbars.some(item => item.path === this.$route.path)) {
        this.tabbars.push(this.$route);
      }
      this.$store.dispatch('user/setTabs', this.tabbars).then(() => {
        // console.log('tabs：', this.tabs)
      })
    },
    handleClick(item) {
      console.log(item)
      this.$router.push({ path: item.path })
    },
    handleTabsEdit(obj, action) {
      let index = this.tabs.findIndex(item => item.path === obj.path);
      if (index !== -1) {
        this.tabs.splice(index, 1);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  padding: 10px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #f4f4f4;

  .tab-item {
    cursor: pointer;
    padding: 5px;
    margin-right: 10px;
    color: #97a8be;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .tab-item.active {
    background-color: #fff;
    color: #222;
  }
}
</style>
