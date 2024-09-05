<template>
  <div class="app-container data-statistics">
    <el-tabs v-model="editableTabsValue" type="card" @tab-click="handleTabsEdit">
      <el-tab-pane label="渠道数据统计" name="ChannelTab">
        <ChannelTab
          ref="ChannelTab"
          v-if="editableTabsValue=='ChannelTab'"
          @click_channel="click_channel"
        />
      </el-tab-pane>
      <el-tab-pane label="渠道每日统计" name="EveryDay">
        <EveryDay ref="EveryDay" v-if="editableTabsValue=='EveryDay'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ChannelTab from "@/views/dataCount/channel_tab.vue";
import EveryDay from "@/views/dataCount/everyday.vue";

export default {
  components: { ChannelTab, EveryDay },
  data() {
    return {
      editableTabsValue: "ChannelTab"
    };
  },
  methods: {
    handleTabsEdit(event, val) {
      this.editableTabsValue = event.name;
      if (event.name == "EveryDay") {
        const that = this;
        setTimeout(() => {
          that.$refs.EveryDay.everyday_param.cid = "";
          that.$refs.EveryDay.everyday_data();
        }, 100);
      }
    },
    click_channel(val) {
      this.editableTabsValue = "EveryDay";
      const that = this;
      setTimeout(() => {
        that.$refs.EveryDay.everyday_param.cid = val.cid;
        that.$refs.EveryDay.everyday_data();
      }, 100);
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
