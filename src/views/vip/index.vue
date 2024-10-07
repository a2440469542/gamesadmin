<template>
  <div class="app-container data-statistics">
    <div class="filter">
      <div class="mobile-filter">
        <el-button class="filter-item" type="primary" @click="add_vip()">添加</el-button>
        <div class="ty-upload filter-item">
          <el-button type="primary">导入等级表格</el-button>
          <input type="file" class="ty-file" @change="get_import_data" />
        </div>
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
    
      <el-table-column label="等级" align="center">
        <template slot-scope="scope">{{ scope.row.level }}</template>
      </el-table-column>
       <el-table-column label="图标" align="img">
         <template slot-scope="scope">
          <img :src="scope.row.img" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column label="经验" align="center">
        <template slot-scope="scope">{{ scope.row.exp }}</template>
      </el-table-column>
      <el-table-column label="等级奖金" align="center">
        <template slot-scope="scope">{{ scope.row.bonus }}</template>
      </el-table-column>
      <el-table-column label="每日提款次数" align="center">
        <template slot-scope="scope">{{ scope.row.cash_num }}</template>
      </el-table-column>
      <el-table-column label="每日提款限制" align="center">
        <template slot-scope="scope">{{ scope.row.cash_money }}</template>
      </el-table-column>
      <el-table-column label="每周返现比例" align="center">
        <template slot-scope="scope">{{ scope.row.week_back }}</template>
      </el-table-column>
      <el-table-column label="每日投注返现比例" align="center">
        <template slot-scope="scope">{{ scope.row.beet_back_day }}</template>
      </el-table-column>
        <el-table-column align="center" prop="created_at" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="pageData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataForm"
        :model="vip_data"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="等级" prop="level">
          <el-input v-model="vip_data.level" />
        </el-form-item>
        <el-form-item label="图标" prop="img">
          <Upload @uploadChange="uploadChange" />
        </el-form-item>
        <el-form-item label="经验" prop="exp">
          <el-input v-model="vip_data.exp" />
        </el-form-item>
        <el-form-item label="奖金" prop="bonus">
          <el-input v-model="vip_data.bonus" />
        </el-form-item>
        <el-form-item label="每日提款次数" prop="cash_num">
          <el-input v-model="vip_data.cash_num" />
        </el-form-item>
        <el-form-item label="每日提款限制" prop="cash_money">
          <el-input v-model="vip_data.cash_money" />
        </el-form-item>
        <el-form-item label="每周返现比例" prop="week_back">
          <el-input v-model="vip_data.week_back" />
        </el-form-item>
        <el-form-item label="每日投注返现比例" prop="beet_back_day">
          <el-input v-model="vip_data.beet_back_day" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { levelIndex, levelImport,levelEdit,levelDel } from "@/api/vip.js";
import ChannelSelect from "@/views/channel/channelSelect";
import Pagination from "@/components/pagination/index.vue";
import Upload from '@/components/upload'
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
  components: { ChannelSelect, Pagination ,Upload},
  data() {
    return {
      list: [],
      dialogTitle: "",
      listLoading: true,
      vip_data: {},
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
      },
      dialogVisible: false
    };
  },
  created() {
    this.get_list_data();
  },
  methods: {
    add_vip() {
      this.dialogVisible = true;
      this.dialogTitle = "新增等级配置";
      this.vip_data = {};
    },
    handleEdit(index, val) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑等级配置";
      this.vip_data = Object.assign({},val)
    },
    handleClose() {
      this.dialogVisible = false;
      this.vip_data = {};
    },
     uploadChange(val) {
      console.log('val', val)
      this.vip_data.img = val
    },
    handleSubmit() {
      levelEdit(this.vip_data).then(response => {
        if (response.code === 0) {
          this.dialogVisible = false;
          this.get_list_data();
          this.$message({
            type: "success",
            message: "成功!"
          });
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该等级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          levelDel({ id: row.id }).then(response => {
            this.get_list_data();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    get_import_data(res) {
      let file = res.currentTarget.files[0];
      let formData = new FormData();
      formData.append("file", file);
      this.$message.warning("数据导入中...");
      levelImport(formData).then(response => {
        if (response.code == 0) {
          this.$message.success("导入成功");
        } else {
          this.$message.success("导入失败，请重试");
        }
        
        res.currentTarget.files = {};
      }).finally(()=>{
         this.get_list_data();
      })
    },
    get_list_data() {
      this.listLoading = true;
      levelIndex(this.everyday_param)
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
      this.get_list_data();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.everyday_param.page = val;
      this.get_list_data();
    },
    handleSizeChange(val) {
      this.everyday_param.limit = val;
      this.get_list_data();
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
.ty-upload {
  display: inline-block;
  position: relative;
  cursor: pointer;

  .ty-file {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
