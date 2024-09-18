<template>
  <div class="app-container data-statistics">
    <div class="filter">
      <div class="mobile-filter">
        <label>渠道:</label>
        <ChannelSelect v-model="everyday_param.cid" class="filter-item" @change="handleChannelFilter"></ChannelSelect>
        <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      </div>
      <!-- <div class="export">
        <el-button @click="exportExcel">导出 Excel</el-button>
      </div> -->
    </div>
    <el-table
      ref="exportTable"
      v-loading="listLoading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="渠道名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="注册人数" align="center">
        <template slot-scope="scope">{{ scope.row.reg_num }}</template>
      </el-table-column>
      <el-table-column label="充值人数" align="center">
        <template slot-scope="scope">{{ scope.row.cz_num }}</template>
      </el-table-column>
      <el-table-column label="总充值金额" align="center">
        <template slot-scope="scope">{{ scope.row.cz_money }}</template>
      </el-table-column>
      <el-table-column label="总提款金额" align="center">
        <template slot-scope="scope">{{ scope.row.cash_money }}</template>
      </el-table-column>
      <el-table-column label="总投注金额" align="center">
        <template slot-scope="scope">{{ scope.row.bet_money }}</template>
      </el-table-column>
      <el-table-column label="宝箱领取人数" align="center">
        <template slot-scope="scope">{{ scope.row.box_num }}</template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="pageData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { channel_day_stat } from "@/api/data";
import ChannelSelect from "@/views/channel/channelSelect";
import Pagination from "@/components/pagination/index.vue";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  components: { ChannelSelect, Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogVisible: false,
      options: [],
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      everyday_param: {
        cid: "",
        page: 1,
        limit: 20
      }
    };
  },
  created(){
    // if(this.$route.name == 'channel_everyday'){
    //   this.everyday_data()
    // }
  },
  methods: {
    handleChannelFilter(value) {
        this.everyday_param.page = 1;
      this.everyday_param.cid = value;
      this.everyday_data();
    },
    everyday_data() {
      this.listLoading = true;
      channel_day_stat(this.everyday_param)
        .then(response => {
          if (response.code === 0) {
            this.list = response.data.data;
            this.pageData = response.data;
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.everyday_data();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.everyday_param.page = val;
      this.everyday_data();
    },
    handleSizeChange(val) {
      this.everyday_param.limit = val;
      this.everyday_data();
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
