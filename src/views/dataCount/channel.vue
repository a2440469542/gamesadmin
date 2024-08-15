<template>
  <div class="app-container data-statistics">
    <div class="filter">
      <div class="mobile-filter">
        <label>日期选择:</label>
        <el-date-picker
          v-model="gameParam.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <!-- <label>渠道:</label>
        <ChannelSelect v-model="gameParam.cid" class="filter-item" @change="handleChannelFilter">
        </ChannelSelect>-->
      </div>
      <!-- <div class="export">
        <el-button @click="exportExcel">导出 Excel</el-button>
      </div>-->
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
        <template slot-scope="scope">{{ scope.row.add_time }}</template>
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
      <el-table-column align="center" prop="created_at" width="120" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
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
import { channel_stat } from "@/api/data";
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
      listLoading: true,
      dialogVisible: false,
      title: "渠道数据统计",
      options: [],
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      gameParam: {
        date: "",
        page: 1,
        limit: 20
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      channel_stat(this.gameParam)
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
      this.fetchData();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.gameParam.page = val;
      this.fetchData();
    },
    handleSizeChange(val) {
      this.gameParam.limit = val;
      this.fetchData();
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
