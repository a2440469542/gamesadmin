<template>
  <div class="common-config">
    <h1>公共配置</h1>
  </div>
</template>

<script>
import { config } from '@/api/table'
export default {
  name: 'CommonSetting',
  data() {
    return {}
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    // 获取公共配置
    getConfig() {
      config().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
