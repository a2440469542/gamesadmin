<template>
  <div class="app-container">
    <h1>公共配置</h1>
    <div class="field-list">
      <div class="list-item" style="margin-bottom: 10px;">
        <label>服务地址：</label>
        <el-input v-model="items.service_path" class="item-input" placeholder="" />
        <label>telegram：</label>
        <el-input v-model="items.tg_path" class="item-input" placeholder="" />
      </div>
    </div>
    <el-button @click="save">保存</el-button>
  </div>
</template>

<script>
import { config, saveConfig } from '@/api/table'
export default {
  name: 'CommonSetting',
  data() {
    return {
      items: {
        service_path: 'www.google.com',
        tg_path: 'www.telegram.com'
      } // 初始包含一个空的键值对
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    // 获取公共配置
    getConfig() {
      config().then(res => {
        console.log(res)
        for (const i in res.data) {
          this.items.push({ key: i, value: res.data[i] })
        }
      })
    },
    saveConfigSetting() {
      saveConfig(this.items).then(res => {
        console.log(res)
      })
    },
    addItem() {
      this.items.push({ key: '', value: '' }) // 点击添加时，向数组中添加一个新的键值对对象
    },
    removeItem(index) {
      this.items.splice(index, 1) // 删除指定索引的键值对
    },
    save() {
      console.log('保存的键值对：', this.items) // 打印或处理所有键值对数据
      this.saveConfigSetting()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .field-list {
    .list-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      margin-top: 10px;
      .item-input {
        width: 400px;
        margin-right: 10px;
      }
    }
  }
}
</style>
