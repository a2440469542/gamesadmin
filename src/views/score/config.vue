<template>
  <div class="config-box">
    <el-form ref="dataForm" style="width:700px" :model="set_config" label-position="left" v-loading="config_loading">
      <el-form-item label="每日签到获取的积分" prop="day_sign">
        <el-input class="max-360" v-model.number="set_config.day_sign" type="number" clearable />
      </el-form-item>
       <el-form-item label="每日签到积分说明" prop="day_sign">
        <el-input class="max-360" v-model="set_config.day_sign_desc" clearable />
      </el-form-item>
      <el-form-item label="充值兑换积分倍数" prop="order_score">
        <el-input class="max-360" v-model.number="set_config.order_score" type="number" clearable />
      </el-form-item>
      <el-form-item label="充值兑换积分倍数说明" prop="order_score">
        <el-input class="max-360" v-model="set_config.order_score_desc" clearable />
      </el-form-item>
      <el-form-item label="投注兑换积分倍数" prop="bet_score">
        <el-input class="max-360" v-model.number="set_config.bet_score" type="number" clearable />
      </el-form-item>
        <el-form-item label="投注兑换积分倍数说明" prop="bet_score">
        <el-input class="max-360" v-model="set_config.bet_score_desc" clearable />
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="reset_config()">取 消</el-button>
      <el-button type="primary" @click="handle_submit()">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { getScoreGet_config, getScoreSet_config } from "@/api/score";
export default {
  data() {
    return {
      set_config: {},
      set_config_copy: {},
      config_loading:false,
    };
  },
  created() {
    this.get_data_list();
  },
  methods: {
    get_data_list() {
      this.config_loading = true
      getScoreGet_config().then(res => {
        if(res.code === 0){
          this.set_config = res.data
          this.set_config_copy = JSON.parse(JSON.stringify(res.data))
        }
      }).finally(()=>{
        this.config_loading = false
      });
    },
    reset_config(){
      this.set_config = JSON.parse(JSON.stringify(this.set_config_copy))
    },
    handle_submit(){
      this.config_loading = true
      getScoreSet_config(this.set_config).then(res=>{
        if(res.code === 0){
          this.get_data_list()
          this.$message.success('保存成功')
        }else{
          this.$message.error('保存失败')
        }
      }).finally(()=>{
        this.config_loading = false
      });
    }
  }
};
</script>

<style scoped>
.config-box{
  width: 400px;
}
.max-360{
  max-width: 460px !important;
}
</style>