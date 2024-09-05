<template>
  <div class="app-container channel-page">
     <div class="filter">
      <div class="mobile-filter">
        <el-button class="filter-item" type="primary" @click="handleCreate()">添加签到配置</el-button>
        <el-button class="filter-item" type="primary" @click="handleCreateInfo()">规则说明</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="签到天数">
        <template slot-scope="scope">
          {{ scope.row.day }}
        </template>
      </el-table-column>
      <el-table-column label="奖励奖金">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="倍数">
        <template slot-scope="scope">
          {{ scope.row.multiple }}
        </template>
      </el-table-column>
        <el-table-column label="是否特殊">
        <template slot-scope="scope">
          {{ scope.row.is_esp ? '是':"否" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="pageData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    /> -->

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="detail"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="天数" prop="name">
          <el-input v-model="detail.day" />
        </el-form-item>
        <el-form-item label="奖励奖金" prop="money">
          <el-input v-model.number="detail.money" type="number" />
        </el-form-item>
          <el-form-item label="倍数" prop="multiple">
          <el-input v-model.number="detail.multiple" type="number" />
        </el-form-item>
        <el-form-item label="是否特殊" prop="is_esp">
          <el-switch
          :active-value="1"
          v-model="detail.is_esp"
          active-text="是"
          inactive-text="否">
        </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="规则说明" :visible.sync="dialogVisibleInfo" width="60%" :before-close="handleCloseInfo">
     
     <div>
       规则说明
     </div>
     <div>
          <Editor :content="sign_detail.sign_rule" @changeIntro="getContent"></Editor>
          <!-- <el-input v-model="activity.desc" type="textarea" /> -->
     </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleInfo = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
SignConfigEdit,
SignConfigIndex,
SignConfigSetRule,
SignConfigDel,
SignConfigget_rule
} from '@/api/sign_in'
import Pagination from '@/components/pagination/index.vue'
import Editor from '@/components/editor/editor.vue'
import dayjs from "dayjs";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    Pagination,
    Editor
  },
  data() {
    return {
      sign_detail:{},
      list: [],
      searchCondition: {
        page: 1,
        limit: 20
        // name: ''
      },
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      listLoading: true,
      isCreate: false,
      dialogTitle: '编辑活动',
      dialogVisible: false,
      dialogVisibleInfo: false,
      options: [],
      detail: {},
      data_range: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      SignConfigIndex(this.searchCondition).then((response) => {
        if (response.code === 0) {
          // this.pageData = response.data
          this.list = response.data
          
        }
      }).finally(()=>{
this.listLoading = false
      })
    },
   
    searchActivity() {
      this.fetchData()
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleCreate() {
      this.detail = {}

      this.dialogTitle = '添加签到配置'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      this.data_range = []
      if (row.start_time && row.end_time) {
        this.data_range = [
          new Date(row.start_time),
          new Date(row.end_time)
        ]
      }
      this.detail = {...row}
      this.dialogTitle = '编辑签到配置'
      this.dialogVisible = true
    },
    async handleSubmit() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const res = await SignConfigEdit(this.detail)
          if (res.code === 0) {
            this.dialogVisible = false
            this.fetchData()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    async handleSubmitInfo() {
  
          const res = await SignConfigSetRule(this.sign_detail)
          if (res.code === 0) {
            this.dialogVisibleInfo = false
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
      
    },

      getContent(val) {
      this.sign_detail.sign_rule = val.html;
    },

   async handleCreateInfo(){
        const res = await SignConfigget_rule()
          if (res.code === 0) {
            this.dialogVisibleInfo = true
            this.sign_detail.sign_rule = res.data.value || ''
          } else {
            this.$message.error(res.msg)
          }
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        SignConfigDel({ id: row.id }).then((response) => {
          if (response.code === 0) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCloseInfo(){
this.dialogVisibleInfo = false
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
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
button {
  margin-bottom: 10px;
}
  .channel-page {
    .btn-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      .btn-item {
        margin-right: 10px;
      }
    }
    .search {
      display: flex;
      align-items: center;
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 0px;
      }
      .check {
        margin-left: 20px;
      }
      label {
        margin-right: 10px;
        margin-left: 12px;
      }
    }
    .statics {
      .statics-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 20px;
        .statics-item {
          display: flex;
          align-items: center;
          width: 30%;
          font-size: 20px;
          .statics-item-title {
            font-weight: bold;
            margin-right: 20px;
          }
        }
      }
    }
    .row-amount{
      .cell-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;
        .cell-item-input {
          width: 220px;
          margin-left: 20px;
        }
      }
    }
    .header-row {
      display: flex;
      justify-content: flex-start;
      padding: 10px 0;
    }
    .header-cell {
      text-align: left;
      width: 33.3%;
    }
    .content {
      margin-top: 10px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .row-item {
        width: 33.3%;
        margin-right: 10px;
      }
    }
  }

</style>
