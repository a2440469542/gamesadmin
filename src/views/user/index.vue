<template>
<div class="app-container channel-page">
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
        <ChannelSelect v-model="userParam.cid" @change="handleChannelFilter">
        </ChannelSelect>
 <label>提款：</label>
 <el-select style="margin:0 6px"
              v-model="userParam.is_cash"
              clearable
              filterable
              @change="fetchData"
              placeholder="请选择是否有提款"
            >
              <el-option
                :key="1"
                label="能"
                :value="1"
              ></el-option>
               <el-option
                :key="0"
                label="不能"
                :value="0"
              ></el-option>
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

    <el-dialog :title="'充值积分'" :visible.sync="re_score_dialog" width="30%" :before-close="handleCloseScore">
      <el-form
        ref="dataForm"
        :model="re_score"
        label-position="left"
      >
        <el-form-item label="积分" prop="score">
          <el-input v-model="re_score.score" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="re_score_dialog=false">取 消</el-button>
        <el-button type="primary" @click="handle_submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'邀请人数'" :visible.sync="inviteDialog" width="80%" :before-close="handleInviteDialogClose">
      <el-table
        v-loading="inviteListLoading"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :data="invitelist"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column props="gid" align="center" label="邀请码">
          <template slot-scope="scope">
            {{ scope.row.inv_code }}
          </template>
        </el-table-column>
        <el-table-column props="gid" align="center" label="手机号码">
          <template slot-scope="scope">
            {{ scope.row.mobile }}
          </template>
        </el-table-column>
        <el-table-column props="pid" align="center" label="邀请人数">
          <template slot-scope="scope">
            {{ scope.row.invite_user }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="充值次数">
          <template slot-scope="scope">
            {{ scope.row.cz_num }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="充值金额" >
          <template slot-scope="scope">
            {{ scope.row.cz_money }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="投注金额" >
          <template slot-scope="scope">
            {{ scope.row.bet_money }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="提款金额" >
          <template slot-scope="scope">
            {{ scope.row.cash_money }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="宝箱领取金额" >
          <template slot-scope="scope">
            {{ scope.row.box_money }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inviteDialog=false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'绑定上级'" :visible.sync="bindParentDialog" width="30%" :before-close="handleBindParentDialogClose">
      <el-form
        ref="bindParentForm"
        :model="bindParentModel"
        label-position="left"
      >
        <el-form-item label="邀请码" prop="inv_code">
          <el-input v-model="bindParentModel.inv_code" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindParentDialog=false">取 消</el-button>
        <el-button type="primary" @click="handlebindParentSubmit">确 定</el-button>
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
         <span @click="check_user_param(scope.row.pid)" class="btn-span"> {{ scope.row.pid }} </span>
        </template>
      </el-table-column>
      <el-table-column label="上上级ID" align="center" width="90">
        <template slot-scope="scope">
          <span @click="check_user_param(scope.row.ppid)" class="btn-span">{{ scope.row.ppid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上上上级ID" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.pppid }}
        </template>
      </el-table-column>
      <el-table-column label="邀请人数" align="center" width="80">
        <template slot-scope="scope">
          <el-link type="primary" @click="showInviteDialog(scope.$index, scope.row, 1)">{{ scope.row.child_num }}</el-link>
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
      <el-table-column label="提现金额" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cash_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lock_money }}</span>
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
      <el-table-column label="试玩账号" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.is_rebot == '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="recharge(scope.$index, scope.row)"
          >充值</el-button>
            <el-button
            size="mini"
            @click="re_score_btn(scope.$index, scope.row)"
          >充值积分</el-button>
          <el-button
            size="mini"
            @click="showBindParentDialog(scope.$index, scope.row)"
          >绑定上级</el-button>
           <el-button
            size="mini"
            @click="showBindUserAmount(scope.$index, scope.row)"
          >冻结余额</el-button>
           <el-button
            size="mini"
            @click="showBindUserChilendAmount(scope.$index, scope.row)"
          >冻结下级余额</el-button>
          <el-button
            size="mini"
            @click="showInviteDialog(scope.$index, scope.row, 2)"
          >n2</el-button>
          <el-button
            size="mini"
            @click="showInviteDialog(scope.$index, scope.row, 3)"
          >n3</el-button>
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
  </div>
</template>

<script>
import {
  getUserList,
  updateUserPwd,
  removeUser,
  recharge,
  getInviteData,
  bindWithInvCode
} from '@/api/table'
import { createRebot,getlock_money,reSCoreMoney,lock_chilend_money } from '@/api/user'
import Pagination from '@/components/pagination/index.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ChannelSelect from '@/views/channel/channelSelect'

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
  components: { ChannelSelect, Pagination },
  data() {
    return {
      list: [],
      invitelist: [],
      listLoading: true,
      inviteListLoading: true,
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
      invite: {
        uid: '',
        cid: '',
        type: 1
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
      inviteDialog: false,
      bindParentDialog: false,
      botParam: {
        cid: '',
        num: 0
      },
      bindParentModel: {
        uid: '',
        cid: '',
        inv_code: ''
      },
      re_score_dialog:false,
      re_score:{}
    }
  },
  created() {
  },
  methods: {
    fetchData() {
      this.listLoading = true
      console.log(this.userParam)
      getUserList(this.userParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          // console.log(this.list)
          this.userData = response.data
         
        }
      }).finally(()=>{
         this.listLoading = false
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
        // console.log(response)
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
    showInviteDialog(index, row, type) {
      this.invite.cid = row.cid
      this.invite.uid = row.uid
      this.invite.type = type
      // console.log(this.invite)
      this.inviteListLoading = true
      // this.inviteDialog = true
      getInviteData(this.invite).then((response) => {
        if (response.code === 0) {
          console.log(response.data)
          this.invitelist = response.data
          console.log(this.invitelist)
          this.inviteDialog = true
        } else {
          this.$message({
            type: 'error',
            message: '获取邀请人数失败，请重试!'
          })
        }
        this.inviteListLoading = false
      })
    },
    showBindParentDialog(index, row) {
      this.bindParentModel.cid = row.cid
      this.bindParentModel.uid = row.uid
      this.bindParentModel.inv_code = ''
      this.bindParentDialog = true
    },
    handlebindParentSubmit() {
      bindWithInvCode(this.bindParentModel).then((response) => {
        if (response.code === 0) {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '绑定上级成功！'
          })
          this.bindParentDialog = false
        } else {
          this.$message({
            type: 'error',
            message: '获取邀请人数失败，请重试!'
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
    showBindUserAmount(index, row) {
      if(!row.money){
        return this.$message({
            type: 'warning',
            message: '余额为0，无法冻结'
          })
      }
      this.$confirm('此操作会将用户余额冻结, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const params = {
          cid: row.cid,
          uid: row.uid,
          money: row.money,
        }
        getlock_money(params).then((response) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '冻结成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消冻结'
        })
      })
    },
    showBindUserChilendAmount(index, row) {
      this.$confirm('此操作会将用户下级余额冻结, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const params = {
          cid: row.cid,
          uid: row.uid,
        }
        lock_chilend_money(params).then((response) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '冻结成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消冻结'
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleInviteDialogClose() {
      this.inviteDialog = false
    },
    handleBindParentDialogClose() {
      this.bindParentDialog = false
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
    re_score_btn(index, row){
      this.re_score
      this.re_score
      this.re_score = {
        cid : row.cid,
        uid: row.uid,
        score : ""
      }
      this.re_score_dialog = true
    },  
    handleCloseScore(){
      this.re_score_dialog = false
    },
     handle_submit() {
      reSCoreMoney(this.re_score)
        .then(res => {
          if (res.code === 0) {
            this.$message.success("保存成功");
            this.fetchData();
            this.re_score_dialog = false
          } else {
            this.$message.success("保存失败");
          }
        })
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
    },
    check_user_param(uid){
      this.userParam.uid = uid
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
.btn-span{
  cursor: pointer;
  text-decoration: underline;
}
</style>

