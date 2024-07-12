<template>
  <div class="app-container role">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">创建角色</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="role"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" />
        </el-form-item>
        <el-form-item label="角色权限" prop="rule">
          <el-tree ref="treeRef" node-key="id" :data="Menulist" :props="{ label: 'name', value: 'id' }" get-checked-nodes="getCheckedNodes" show-checkbox @node-click="handleNodeClick" @check-change="handleCheckChange" />
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
      <el-table-column align="center" label="角色ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
import { getRoleList, createRole, removeRole, getMenuList } from '@/api/table'
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
      list: [],
      listLoading: true,
      dialogVisible: false,
      title: 'Create',
      Menulist: [],
      role: {
        name: '',
        rid: '',
        rule: ''
      }
    }
  },
  created() {
    this.fetchData()
    this.lodingMenu()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRoleList().then((response) => {
        if (response.code === 0) {
          this.list = response.data
          this.listLoading = false
        }
      })
    },
    lodingMenu() {
      this.listLoading = true
      getMenuList().then((response) => {
        this.Menulist = response.data
        this.listLoading = false
      })
    },
    handleSubmit() {
      const selectedNodeIds = this.$refs.treeRef.getCheckedKeys()
      console.log(selectedNodeIds)
      this.role.rule = selectedNodeIds
      createRole(this.role).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.dialogVisible = false
          this.$message.success(response.msg)
          this.fetchData()
          this.role = {
            name: '',
            rule: []
          }
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleCreate() {
      this.role = {
        name: '',
        rule: []
      }
      this.title = '创建角色'
      this.dialogVisible = true
      setTimeout(() => {
        this.$refs.treeRef.setCheckedKeys([])
      }, 500)
    },
    handleEdit(index, row) {
      console.log(row, this.$refs.treeRef)
      delete row.child
      this.role = row
      // this.$refs.treeRef.setCheckedKeys(row.rule)
      this.title = '编辑角色'
      this.dialogVisible = true
      setTimeout(() => {
        this.$refs.treeRef.setCheckedKeys(row.rule)
      }, 500)
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeRole({ id: row.id }).then((response) => {
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
    handleNodeClick(data) {
      console.log(data)
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log('节点数据:', data)
      console.log('节点是否被选中:', checked)
      console.log('节点是否半选:', indeterminate)
      // 在这里可以根据需要处理节点选中或取消选中的逻辑
    }
  }
}
</script>
<style lang="scss" scoped>
  .role {
    .btn-group {
      padding: 20px;
    }
  }
</style>
