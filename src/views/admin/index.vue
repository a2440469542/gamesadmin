<template>
  <div class="admin-container">
    <div class="btn-group">
      <el-button class="add" type="primary" @click="handleCreate">添加账号</el-button>
      <div class="search">
        <label>账号：</label>
        <el-input v-model="adminParam.keyword" placeholder="请输入管理员账号" />
        <el-button class="check" type="primary" @click="handleCreate">查询</el-button>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="admin"
        label-position="left"
      >
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="admin.user_name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="admin.password" show-password />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="admin.nickname" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="admin.status" active-color="#13ce66" inactive-color="#ff4949" />
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
      <el-table-column props="gid" align="center" label="账号" width="95">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="95">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.img }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status === '1' ? '正常' : '禁用' }}</span>
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
    <el-pagination
      background
      layout="prev, pager, next"
      :total="gameData.total"
    />
  </div>
</template>

<script>
import { getAdminList, createAdmin, removeAdmin } from '@/api/table'
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
      title: '创建游戏',
      gameData: {
        total: 0,
        per_page: 15,
        current_page: 1,
        last_page: 1
      },
      admin: {
        user_name: '',
        password: '',
        nickname: '',
        status: true
      },
      adminParam: {
        page: 1,
        limit: 15,
        orderBy: '',
        keyword: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAdminList(this.adminParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.gameData = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      createAdmin(this.admin).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    handleCreate() {
      this.admin = {
        user_name: '',
        password: '',
        nickname: '',
        status: true
      }
      this.title = 'Create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      delete row.child
      this.admin = row
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
        removeAdmin({ id: row.id }).then((response) => {
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
<style lang="scss" scoped>
.admin-container {
  .btn-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 68px;
    .add {
      margin: 0 20px;
    }
    .search {
      width: 480px;
      display: flex;
      align-items: center;
      .check {
        margin-left: 20px;
      }
      label {
        width: 80px;
        margin-right: 10px;
      }
    }
  }
}
</style>
