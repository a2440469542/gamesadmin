<template>
  <div>
    <el-table
      v-loading="list_loading"
      row-key="id"
      :data="list_data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="日期" width="220">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="签到人数" >
        <template slot-scope="scope">{{ scope.row.sign_num }}</template>
      </el-table-column>
      <el-table-column label="签到领取积分">
        <template slot-scope="scope">{{ scope.row.sign_score }}</template>
      </el-table-column>
      <el-table-column label="充值领取积分">
      <template slot-scope="scope">{{ scope.row.order_score }}</template>
      </el-table-column>
      <el-table-column label="下注领取积分" >
        <template slot-scope="scope">{{ scope.row.bet_score }}</template>
      </el-table-column>
       <el-table-column label="兑换人数" >
        <template slot-scope="scope">{{ scope.row.exchange_num }}</template>
      </el-table-column>
       <el-table-column label="充值人数" >
        <template slot-scope="scope">{{ scope.row.order_num }}</template>
      </el-table-column>
       <el-table-column label="下注人数" >
        <template slot-scope="scope">{{ scope.row.bet_num }}</template>
      </el-table-column>
       <el-table-column label="总领取积分" >
        <template slot-scope="scope">{{ scope.row.total_score }}</template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="page_data.total"
      @handleCurrentChange="handle_current_change"
      @handleSizeChange="handle_size_change"
    />

  </div>
</template>

<script>
import { GoodsStatic } from "@/api/score";
import Pagination from "@/components/pagination/index.vue";

export default {
  data() {
    return {
      list_loading: false,
      list_data: [],
      page_data: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      parmas: {
        page: 1,
        limit: 20,
        keyword: ""
      },
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.get_data_list();
  },
  methods: {
    get_data_list() {
      this.list_loading = true;
      GoodsStatic(this.parmas)
        .then(res => {
          if (res.code === 0) {
            this.list_data = res.data.data;
            this.page_data = res.data;
          }
        })
        .finally(() => {
          this.list_loading = false;
        });
    },
   
    handle_current_change(val) {
      this.parmas.page = val;
      this.get_data_list();
    },
    handle_size_change(val) {
      this.parmas.limit = val;
      this.get_data_list();
    },
  }
};
</script>

