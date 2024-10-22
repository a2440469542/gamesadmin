<template>
  <div class="app-container">
    <h1>公共配置</h1>
    <div class="field-list">
      <div class="list-item" style="margin-bottom: 10px;">
        <label>服务地址：</label>
        <el-input v-model="items.service_path" class="item-input" placeholder />
      </div>

      <div class="list-item" style="margin-bottom: 10px;">
        <label>代收（充值）配置项目：</label>
        <el-select v-model="items.pay_config" filterable placeholder="请选择">
          <el-option
            v-for="item in options_pay"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

       <div class="list-item" style="margin-bottom: 10px;">
        <label>代付（提款）配置项目：</label>
        <el-select v-model="items.cash_pay_config" filterable placeholder="请选择">
          <el-option
            v-for="item in options_pay"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="list-item" style="margin-bottom: 10px;">
        <label>telegram：</label>
        <el-input v-model="items.tg_path" class="item-input" placeholder />
      </div>
      <div class="list-item" style="margin-bottom: 10px;">
        <label>是否开启维护：</label>
        <el-switch v-model="items.is_maintain" active-value="1" inactive-value="0" />
      </div>
      <div class="list-item" style="margin-bottom: 10px;">
        <label>维护文字显示：</label>
        <el-input v-model="items.maintain_text" class="item-input" placeholder />
      </div>
      <div class="list-item" style="margin-bottom: 10px;">
        <label>是否开启验证码注册：</label>
        <el-switch v-model="items.sms_open" active-value="1" inactive-value="0" />
      </div>
       <div class="list-item" style="margin-bottom: 10px;">
        <label>提现审核配置：</label>
        <el-input v-model="items.cash_sh_num" class="item-input" placeholder />
      </div>
        <div class="list-item" style="margin-bottom: 10px;">
        <label>工资最低领取金额：</label>
        <el-input v-model="items.min_wages" class="item-input" placeholder />
      </div>
    </div>
    
    <el-button @click="save">保存</el-button>
  </div>
</template>

<script>
import { config, saveConfig } from "@/api/table";
export default {
  name: "CommonSetting",
  data() {
    return {
      items: {}, // 初始包含一个空的键值对
      options_pay: [
        {
          value: "KirinPay",
          lable: "Kirin支付"
        },
        {
          value: "CapivaraPay",
          lable: "Capivara支付"
        }
      ]
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    // 获取公共配置
    getConfig() {
      config().then(res => {
        if (res.code === 0) {
          this.items = res.data;
        }
        console.log(this.items);
      });
    },
    saveConfigSetting() {
      saveConfig(this.items).then(res => {
        if (res.code === 0) {
          this.getConfig();
          this.$message({
            message: res.msg,
            type: "success"
          });
        }
      });
    },
    addItem() {
      this.items.push({ key: "", value: "" }); // 点击添加时，向数组中添加一个新的键值对对象
    },
    removeItem(index) {
      this.items.splice(index, 1); // 删除指定索引的键值对
    },
    save() {
      console.log("保存的键值对：", this.items); // 打印或处理所有键值对数据
      this.saveConfigSetting();
    }
  }
};
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
