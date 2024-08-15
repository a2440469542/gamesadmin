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
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="pageData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
     <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="channel"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="渠道名称" prop="name">
          {{channel.name}}
        </el-form-item>
        <el-form-item label="网站名称" prop="title">
          {{channel.title}}
        </el-form-item>
         <el-form-item label="注册人数" prop="reg_num">
          {{channel.reg_num}}
        </el-form-item>
         <el-form-item label="充值人数" prop="cz_num">
          {{channel.cz_num}}
        </el-form-item>
         <el-form-item label="总充值金额" prop="cz_money">
          {{channel.cz_money}}
        </el-form-item>
         <el-form-item label="总提款金额" prop="cash_money">
          {{channel.cash_money}}
        </el-form-item>
         <el-form-item label="总投注金额" prop="bet_money">
          {{channel.bet_money}}
        </el-form-item>
        <el-form-item label="宝箱领取人数" prop="desc">
          {{channel.box_num }}
        </el-form-item>
        <el-form-item label="网站logo" prop="logo">
          <img :src="channel.logo" style="width:40px;height:40px" />
        </el-form-item>
        <el-form-item label="网站主题" prop="url">
          {{channel.tema }}
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          {{channel.url}}
        </el-form-item>
        <el-form-item label="最低充值" prop="min_recharge">
          {{channel.min_recharge}}
        </el-form-item>
        <el-form-item label="最低提款" prop="min_draw">
         {{channel.min_draw}}
        </el-form-item>
        <el-form-item label="充提投注倍数 " prop="ct_multiple">
         {{channel.ct_multiple}}
        </el-form-item>
        <el-form-item label="添加时间  " prop="add_time" >
        {{channel.add_time}}
        </el-form-item>
        <el-form-item label="服务地址" prop="service_path">
          {{channel.service_path}}
        </el-form-item>
        <el-form-item label="Telegram" prop="tg_path">
          {{channel.tg_path}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
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
      channel:{},
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
    handleClose(){
      this.dialogVisible = false
    },
    handleEdit(index, row) {
      this.channel = row
      this.title = '渠道数据统计'
      this.dialogVisible = true
    },
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
