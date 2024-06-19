<template>
  <div class="user-container">
    <div class="btn-group">
      <div class="search">
        <label>手机号：</label>
        <el-input v-model="userParam.keyword" placeholder="请输入管理员账号" />
        <label>邀请码：</label>
        <el-input v-model="userParam.keyword" placeholder="请输入管理员账号" />
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
      <el-table-column props="gid" align="center" label="会员ID">
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上级Id">
        <template slot-scope="scope">
          {{ scope.row.pid }}
        </template>
      </el-table-column>
      <el-table-column label="上上级ID">
        <template slot-scope="scope">
          {{ scope.row.ppid }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inv_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reg_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机器人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_rebot === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="300">
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
import { getUserList, createUser, removeUser } from '@/api/table'
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
      userParam: {
        page: 1,
        limit: 15,
        orderBy: '',
        user: '',
        mobile: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getUserList(this.userParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.gameData = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      createUser(this.admin).then((response) => {
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
        removeUser({ id: row.id }).then((response) => {
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
.user-container {
  .btn-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 68px;
    padding-left: 12px;
    .add {
      margin: 0 20px;
    }
    .search {
      width: 680px;
      display: flex;
      align-items: center;
      .check {
        margin-left: 20px;
      }
      label {
        width: 220px;
        margin-right: 10px;
        margin-left: 12px;
      }
    }
  }
}
</style>
