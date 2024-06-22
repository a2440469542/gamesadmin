<template>
  <div class="user-container">
    <div class="btn-group">
      <div class="search">
        <label>手机号：</label>
        <el-input v-model="userParam.mobile" placeholder="请输入管理员账号" />
        <label>用户名：</label>
        <el-input v-model="userParam.user" placeholder="请输入管理员账号" />
        <el-button class="check" type="primary" @click="check">查询</el-button>
        <label>渠道：</label>
      </div>
      <el-select
        v-model="userParam.cid"
        placeholder="请选择"
        @change="handleChannelFilter"
      >
        <el-option
          v-for="item in options"
          :key="item.cid"
          :label="item.title"
          :value="item.cid"
        />
      </el-select>
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
      <el-table-column props="uid" align="center" label="会员ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上级Id" width="80">
        <template slot-scope="scope">
          {{ scope.row.pid }}
        </template>
      </el-table-column>
      <el-table-column label="上上级ID" width="80">
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
      <el-table-column label="机器人" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.is_rebot === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button> -->
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
      :total="userData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { getUserList, createUser, removeUser, getChannelList } from '@/api/table'
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
      list: null,
      listLoading: true,
      dialogVisible: false,
      title: '创建游戏',
      options: [],
      userData: {
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
        mobile: '',
        cid: ''
      }
    }
  },
  created() {
    this.channelList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      console.log(this.userParam)
      getUserList(this.userParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.userData = response.data
          this.listLoading = false
        }
      })
    },
    channelList() {
      this.listLoading = true
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.options = response.data
          this.userParam.cid = this.options[0].cid
          this.fetchData()
        }
      })
    },
    handleSubmit() {
      createUser(this.admin).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
        Object.assign(this.userParam, { user: '', mobile: '' })
      })
    },
    handleCreate() {
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
    },
    handleChannelFilter(value) {
      this.userParam.cid = value
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.userParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.userParam.limit = val
      this.fetchData()
    },
    check() {
      this.fetchData()
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
    width: 900px;
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
        width: 270px;
        margin-right: 10px;
        margin-left: 12px;
      }
    }
  }
}
</style>
