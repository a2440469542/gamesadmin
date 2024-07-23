<template>
  <div class="app-container channel-page">
    <div class="btn-group">
      <div class="search">
        <label style="width: 150px;">手机号：</label>
        <el-input v-model="searchCondition.mobile" class="filter-item" placeholder="请输入手机号" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchAgent">搜索</el-button>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="agentModel"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
      <el-form-item label="选择渠道" prop="name">
        <el-select v-model="agentModel.pids" multiple placeholder="请选择" style="width: 80%" filterable>
          <el-option
            v-for="item in options"
            :key="item.cid"
            :label="item.title"
            :value="item.cid">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
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
      <el-table-column align="center" label="代理ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
<!--      <el-table-column label="PID">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.pid }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
<!--      <el-table-column label="密码">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.pwd }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          {{ scope.row.reg_time }}
        </template>
      </el-table-column>
      <el-table-column label="注册IP">
        <template slot-scope="scope">
          {{ scope.row.reg_ip }}
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间">
        <template slot-scope="scope">
          {{ scope.row.last_login_time }}
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP">
        <template slot-scope="scope">
          {{ scope.row.last_login_ip }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >分配渠道</el-button>
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
import {
  agentSetChannel,
  getAgentList, getChannelList
} from '@/api/table'
import Pagination from '@/components/pagination/index.vue'

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
    Pagination
  },
  data() {
    return {
      list: [],
      searchCondition: {
        page: 1,
        limit: 20,
        mobile: ''
      },
      channelCondition: {
        page: 1,
        limit: 9999999,
        name: ''
      },
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      listLoading: true,
      dialogVisible: false,
      title: '分配渠道',
      agentModel: {
        id: '',
        pids: []
      },
      options: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAgentList(this.searchCondition).then((response) => {
        if (response.code === 0) {
          this.pageData = response.data
          this.list = response.data.data
          this.listLoading = false
        }
      })
    },
    handleCurrentChange(val) {
      this.searchCondition.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.searchCondition.limit = val
      this.fetchData()
    },
    searchAgent() {
      this.fetchData()
    },
    handleEdit(index, row) {
      this.options = []
      // this.agentModel.pids = [1]
      // console.error(row.pid)
      //
      this.agentModel.id = row.id
      this.agentModel.pids = JSON.parse(row.pid || '[]')

      getChannelList(this.channelCondition).then((response) => {
        console.error(response)
        if (response.code === 0) {
          const options = response.data.data
          let pid = []
          if (row.pid) {
            pid = JSON.parse(row.pid || '[]').filter(r => options.find(a => a.cid === r))
          }
          this.agentModel.pids = pid
          this.options = options
          this.dialogVisible = true
        } else {
          this.$message({
            type: 'error',
            message: '获取渠道列表失败'
          })
        }
      })
    },
    handleSubmit(row) {
      agentSetChannel({
        id: this.agentModel.id,
        pid: this.agentModel.pids
      }).then((response) => {
        if (response.code === 0) {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '分配渠道成功！'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '分配渠道失败，请重试!'
          })
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
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
