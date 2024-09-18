<template>
  <div class="admin-container">
    <div class="btn-group">
      <el-button class="add" type="primary" @click="handleCreate">添加账号</el-button>
      <div class="search">
        <label>登录名:</label>
        <el-input v-model="adminParam.keyword" placeholder="请输入登录名" />
        <el-button class="check" type="primary" @click="checkData">查询</el-button>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="admin"
        label-position="left"
      >
        <el-form-item label="角色" prop="username">
          <el-select
            v-model="admin.rid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleList"
              :key="item.rid"
              :label="item.name"
              :value="item.rid"
            />
          </el-select>
        </el-form-item>
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
          <el-switch v-model="admin.status" :active-value="1" :inactive-value="2" active-color="#13ce66" inactive-color="#ff4949" />
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
      <el-table-column props="id" align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="用户权限名称" align="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == '1' ? '正常' : '禁用' }}</span>
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
    <pagination
      background
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="adminData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { getAdminList, createAdmin, removeAdmin, getRoleList } from '@/api/table'
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
      roleList:[],
      list: [],
      listLoading: true,
      dialogVisible: false,
      title: '创建游戏',
      adminData: {
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
        limit: 20,
        orderBy: '',
        keyword: ''
      }
    }
  },
  created() {
    this.fetchData()
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      getRoleList({}).then((response) => {
        if (response.code === 0) {
          this.roleList = response.data
          console.error('this.roleList',this.roleList)
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getAdminList(this.adminParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.adminData = response.data
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
        status: 1
      }
      this.title = '创建管理员'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      // delete row.child
      this.admin = {
        id: row.id,
        user_name: row.user_name,
        password: row.password,
        nickname: row.nickname,
        rid: row.rid,
        status: row.status
      }
      this.title = '管理员编辑'
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
    },
    handleCurrentChange(val) {
      this.adminParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.adminParam.limit = val
      this.fetchData()
    },
    checkData() {
       this.adminParam.page = 1
      this.fetchData()
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
