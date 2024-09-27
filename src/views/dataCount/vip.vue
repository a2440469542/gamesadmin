<template>
  <div class="app-container data-statistics">

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
      <el-table-column label="VIP等级" align="center">
        <template slot-scope="scope">{{ scope.row.level }}</template>
      </el-table-column>
      <el-table-column label="VIP人数" align="center">
        <template slot-scope="scope">{{ scope.row.num }}</template>
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
import { levelGetStat } from "@/api/vip";
import Pagination from "@/components/pagination/index.vue";

export default {
 
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: true,
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      gameParam: {
        page: 1,
        limit: 20
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
   
   
    fetchData() {
      this.listLoading = true;
      levelGetStat(this.gameParam)
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
