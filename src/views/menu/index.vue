<template>
  <div class="app-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">Create</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="menu"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="上级菜单" prop="parent_id">
          <el-cascader
            v-model="menu.pid"
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
            clearable
            :options="list"
            @change="getMenuOption"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" />
        </el-form-item>
        <el-form-item label="菜单控制器" prop="controllers">
          <el-input v-model="menu.controllers" />
        </el-form-item>
        <el-form-item label="菜单方法" prop="methods">
          <el-input v-model="menu.methods" />
        </el-form-item>
        <el-form-item label="是否菜单" prop="title">
          <el-switch v-model="menu.is_menu" active-color="#13ce66" inactive-color="#ff4949" />
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Controllers" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.controllers }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Methods" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.methods }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_menu | statusFilter">{{
            scope.row.is_menu
          }}</el-tag>
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
import { getMenuList, createMenu, removeMenu } from '@/api/table'
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
      menu: {
        name: '',
        controllers: '',
        id: '',
        methods: '',
        is_menu: true,
        pid: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMenuList().then((response) => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSubmit() {
      createMenu(this.menu).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    handleCreate() {
      this.menu = {
        name: '',
        controllers: '',
        id: '',
        methods: '',
        is_menu: '',
        pid: ''
      }
      this.title = 'Create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      delete row.child
      this.menu = row
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
        removeMenu({ id: row.id }).then((response) => {
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
    },
    getMenuOption(value) {
      this.menu.pid = value
    }
  }
}
</script>
