<template>
  <div class="app-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">Create</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="plate"
        label-position="left"
      >
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="plate.name" />
        </el-form-item>
        <el-form-item label="平台code" prop="code">
          <el-input v-model="plate.code" />
        </el-form-item>
        <el-form-item label="平台应用ID" prop="app_id">
          <el-input v-model="plate.app_id" />
        </el-form-item>
        <el-form-item label="平台应用密钥" prop="app_secret">
          <el-input v-model="plate.app_secret" />
        </el-form-item>
        <el-form-item label="接口请求地址" prop="url">
          <el-input v-model="plate.url" />
        </el-form-item>
        <el-form-item label="是否开启" prop="is_open">
          <el-switch v-model="plate.is_open" active-color="#13ce66" inactive-color="#ff4949" />
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
      <el-table-column align="center" label="游戏平台ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台名称" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="平台应用ID">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="平台应用密钥" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台应用密钥" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rule }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
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
  </div>
</template>

<script>
import { getPlateList, createPlate, removePlate } from '@/api/table'
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
  components: {},
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      title: 'Create',
      plate: {
        id: '',
        name: '',
        code: '',
        app_id: '',
        app_secret: '',
        url: '',
        is_open: false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPlateList().then((response) => {
        if (response.code === 0) {
          this.list = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      createPlate(this.plate).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    handleCreate() {
      this.plate = {
        name: '',
        code: '',
        app_id: '',
        app_secret: '',
        url: '',
        is_open: false
      }
      this.title = 'Create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      delete row.child
      this.plate = row
      this.title = 'Edit'
      this.dialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removePlate({ id: row.id }).then((response) => {
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
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>
