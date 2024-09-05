<template>
  <div class="app-container data-statistics">
    <el-tabs v-model="editableTabsValue" type="card" @tab-click="handleTabsEdit">
      <el-tab-pane label="积分任务配置" name="ScoreConfig">
        <ScoreConfig ref="ScoreConfig" v-if="editableTabsValue == 'ScoreConfig'" />
      </el-tab-pane>
      <el-tab-pane label="积分兑换商品" name="ScoreProDuct">
        <ScoreProDuct ref="ScoreProDuct" v-if="editableTabsValue == 'ScoreProDuct'" />
      </el-tab-pane>
      <el-tab-pane label="积分兑换记录" name="ScoreRecord">
        <ScoreRecord ref="ScoreRecord" v-if="editableTabsValue == 'ScoreRecord'" />
      </el-tab-pane>
      <el-tab-pane label="积分兑换统计" name="ScoreStatistics">
        <ScoreStatistics ref="ScoreStatistics" v-if="editableTabsValue == 'ScoreStatistics'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ScoreConfig from "@/views/score/config.vue";
import ScoreProDuct from "@/views/score/product.vue";
import ScoreRecord from "@/views/score/record.vue";
import ScoreStatistics from "@/views/score/statistics.vue";

export default {
  components: { ScoreConfig, ScoreProDuct, ScoreRecord, ScoreStatistics },
  data() {
    return {
      editableTabsValue: "ScoreConfig"
    };
  },
  methods: {
    handleTabsEdit(event, val) {
      this.editableTabsValue = event.name;
    }
  }
};
</script>

  <style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .mobile-filter {
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
}
</style>
