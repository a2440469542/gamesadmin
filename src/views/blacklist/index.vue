<template>
  <div class="app-container">
    <div class="filter">
      <div class="mobile-filter">
        <el-button type="primary" class="createbutton" @click="handleCreate">拉黑账户</el-button>
        <label>银行账号或手机:</label>
        <el-input v-model="gameParam.pix" placeholder="银行账号或手机" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="blackModel"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="类型" prop="type">
          <el-select v-model="blackModel.type" placeholder="请选择">
            <el-option
              v-for="item in selectoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="银行账号或手机" prop="pix">
          <el-input v-model="blackModel.pix" />
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
      <el-table-column props="id" align="center" label="ID" >
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type == '1' ? 'pix' : 'ip' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行账号或手机" >
        <template slot-scope="scope">
          {{ scope.row.pix }}
        </template>
      </el-table-column>
      <el-table-column label="拉黑时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="gameData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import {bindBlackList, getBlackList, removeBlackList} from '@/api/table'
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
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogVisible: false,
      title: '黑名单列表',
      options: [],
      gameData: {
        total: 0
      },
      gameParam: {
        page: 1,
        limit: 10,
        pix: ''
      },
      selectoptions: [
        {
          value: 1,
          label: '银行账号或手机'
        },
        {
          value: 2,
          label: 'ip'
        }
      ],
      blackModel: {
        type: 1,
        pix: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // console.log("黑名单", this.gameParam)
      getBlackList(this.gameParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.gameData = response.data
        }
        this.listLoading = false
      }).finally(()=>{
        this.listLoading = false
      })
    },
    handleFilter() {
       this.gameParam.page = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.gameParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.gameParam.limit = val
      this.fetchData()
    },
    async handleSubmit() {
      const res = await bindBlackList(this.blackModel)
      if (res.code === 0) {
        this.dialogVisible = false
        this.fetchData()
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    handleCreate() {
      this.blackModel = {
        type: 1,
        pix: ''
      }
      this.title = '拉黑账户'
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeBlackList({ id: row.id }).then((response) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
    .createbutton{
      margin-right: 20px;
    }
    .mobile-filter {
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
}
</style>
