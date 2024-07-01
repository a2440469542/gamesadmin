<template>
  <div class="user-container">
    <div class="btn-group">
      <div class="search">
        <label>手机号：</label>
        <el-input v-model="userParam.mobile" class="filter-item" placeholder="请输入手机号" />
        <label>用户名：</label>
        <el-input v-model="userParam.user" class="filter-item" placeholder="请输入用户名" />
        <label>会员ID：</label>
        <el-input v-model="userParam.uid" class="filter-item" placeholder="请输入会员ID" />
        <label>邀请码：</label>
        <el-input v-model="userParam.inv_code" class="filter-item" placeholder="请输入邀请码" />
        <el-button class="check" type="primary" @click="check">查询</el-button>

        <label>渠道：</label>
        <el-select
          v-model="userParam.cid"
          class="filter-item"
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
      <div class="export">
        <el-button class="check" type="primary" @click="isShowBot = true">生成试玩账号</el-button>
      </div>
    </div>
    <el-dialog :title="'生成试玩账号'" :visible.sync="isShowBot" width="30%" :before-close="handleClose">
      <el-form
        ref="botForm"
        :model="botParam"
        label-position="left"
      >
        <el-form-item label="账号数量：" prop="num">
          <el-input v-model="botParam.num" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowBot = false">取 消</el-button>
        <el-button type="primary" @click="exportExcel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改密码'" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="userUpdate"
        label-position="left"
      >
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="userUpdate.pwd" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'充值'" :visible.sync="rechargeDialog" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="recahrge"
        label-position="left"
      >
        <el-form-item label="金额" prop="recahrge">
          <el-input v-model="recahrge.money" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rechargeDialog=false">取 消</el-button>
        <el-button type="primary" @click="rechargeSubmit">确 定</el-button>
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
      <el-table-column label="上上级ID" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.ppid }}
        </template>
      </el-table-column>
      <el-table-column label="上上上级ID" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.pppid }}
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
      <el-table-column label="邀请码" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.inv_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" width="100">
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
      <el-table-column label="最后登录IP" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试玩账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_rebot == '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="recharge(scope.$index, scope.row)"
          >充值</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >修改密码</el-button>
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
import { getUserList, updateUserPwd, removeUser, getChannelList, recharge } from '@/api/table'
import { createRebot } from '@/api/user'
import Pagination from '@/components/pagination/index.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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
      isShowBot: false,
      title: '创建游戏',
      options: [],
      userData: {
        total: 0,
        per_page: 15,
        current_page: 1,
        last_page: 1
      },
      userUpdate: {
        cid: '',
        pwd: '',
        uid: ''
      },
      recahrge: {
        money: 0,
        uid: '',
        cid: ''
      },
      userParam: {
        page: 1,
        limit: 15,
        orderBy: '',
        user: '',
        mobile: '',
        uid: '',
        cid: '',
        inv_code: ''
      },
      rechargeDialog: false,
      botParam: {
        cid: '',
        num: 0
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
      const param = {
        cid: this.userUpdate.cid,
        pwd: this.userUpdate.pwd,
        uid: this.userUpdate.uid
      }
      updateUserPwd(param).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
        Object.assign(this.userParam, { user: '', mobile: '' })
      })
    },
    rechargeSubmit() {
      recharge(this.recahrge).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.fetchData()
          this.rechargeDialog = false
          this.$message({
            type: 'success',
            message: '充值成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '充值失败!'
          })
        }
      })
    },
    handleCreate() {
      this.title = 'Create'
      this.dialogVisible = true
    },
    recharge(index, row) {
      this.recahrge.cid = row.cid
      this.recahrge.uid = row.uid
      this.rechargeDialog = true
    },
    handleEdit(index, row) {
      this.userUpdate = Object.assign({}, row)
      this.title = '修改密码'
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
    },
    exportExcel() {
      this.botParam.cid = this.userParam.cid
      createRebot(this.botParam).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.isShowBot = false
          const ws = XLSX.utils.json_to_sheet(response.data) // 将数据转换为工作表
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

          // 导出Excel
          const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '试玩账号.xlsx')
          } catch (e) {
            console.error(e)
          }
          this.$message({
            type: 'success',
            message: '导出成功!'
          })
        }
      })
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
    width: 100%;
    .add {
      margin: 0 20px;
    }
    .search {
      width: 90%;
      display: flex;
      align-items: center;
      .filter-item {
        width: 220px;
      }
      .check {
        margin-left: 20px;
      }
      label {
        width: 80px;
        margin-right: 10px;
        margin-left: 12px;
      }
    }
  }
}
</style>
