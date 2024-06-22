<template>
  <div class="app-container channel-page">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">创建渠道</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="channel"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="渠道名称" prop="name">
          <el-input v-model="channel.name" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <Upload @uploadChange="uploadChangeIcon" />
        </el-form-item>
        <el-form-item label="网站名称" prop="title">
          <el-input v-model="channel.title" />
        </el-form-item>
        <el-form-item label="网站介绍" prop="desc">
          <el-input v-model="channel.desc" />
        </el-form-item>
        <el-form-item label="网站logo" prop="logo">
          <Upload @uploadChange="uploadChange" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="channel.url" />
        </el-form-item>
        <el-form-item label="最低充值" prop="min_recharge">
          <el-input v-model="channel.min_recharge" />
        </el-form-item>
        <el-form-item label="最低提款" prop="min_draw">
          <el-input v-model="channel.min_draw" />
        </el-form-item>
        <el-form-item label="充提投注倍数 " prop="ct_multiple">
          <el-input v-model="channel.ct_multiple" />
        </el-form-item>
        <el-form-item label="有效玩家累计充值" prop="cz_money">
          <el-input v-model="channel.cz_money" />
        </el-form-item>
        <el-form-item label="有效玩家累计投注" prop="bet_money">
          <el-input v-model="channel.bet_money" />
        </el-form-item>
        <el-form-item label="pg线路ID" prop="pg_id">
          <el-select v-model="channel.pg_id" placeholder="请选择">
            <el-option
              v-for="item in pgOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
      <el-table-column label="渠道名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="前端图标" width="110" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column label="网站名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站介绍" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站logo" width="110" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column label="网站地址" width="280" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="400" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="handleChargeConfig(scope.$index, scope.row)"
          >充值配置</el-button>
          <el-button
            size="mini"
            @click="handleBoxConfig(scope.$index, scope.row)"
          >宝箱配置</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="渠道充值金额配置" :visible.sync="isShowRecharge">
      <div>
        <el-button @click="addRecharge(0, {})">添加</el-button>
      </div>
      <div v-if="!isCreate">
        <el-table :data="rechargeLsit">
          <el-table-column property="date" label="ID" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column property="date" label="渠道ID" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.cid }}</span>
            </template>
          </el-table-column>
          <el-table-column property="name" label="充值金额" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.money }}</span>
            </template>
          </el-table-column>
          <el-table-column property="address" label="赠送金额">
            <template slot-scope="scope">
              <span>{{ scope.row.gifts }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="addRecharge(1, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleChargeDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-form :model="addChargeParam">
          <el-form-item label="渠道ID" :label-width="formLabelWidth">
            <el-input v-model="addChargeParam.cid" readonly autocomplete="off" />
          </el-form-item>
          <el-form-item label="充值金额" :label-width="formLabelWidth">
            <el-input v-model="addChargeParam.money" autocomplete="off" />
          </el-form-item>
          <el-form-item label="赠送金额" :label-width="formLabelWidth">
            <el-input v-model="addChargeParam.gifts" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isCreate = false">取 消</el-button>
          <el-button type="primary" @click="submitCreate">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="宝箱配置" :visible.sync="isShowBox">
      <div class="row-amount">
        <div class="cell-item">
          <label>累计充值（以上）</label>
          <el-input v-model="channelBoxParam.cz_money" class="cell-item-input" autocomplete="off" />
        </div>
        <div class="cell-item">
          <label>累计投注（以上）</label>
          <el-input v-model="channelBoxParam.bet_money" class="cell-item-input" autocomplete="off" />
        </div>
      </div>
      <div>
        <div class="header-row">
          <!-- 顶部四栏 -->
          <div class="header-cell">有效玩家人数</div>
          <div class="header-cell">奖金</div>
          <!-- <div class="header-cell">显示图标</div> -->
          <div class="header-cell">操作</div>
        </div>
        <div class="content">
          <div v-for="(item, index) in items" :key="index" class="row">
            <el-input v-model="item.user_num" class="row-item" placeholder="请输入有效玩家人数" />
            <el-input v-model="item.money" class="row-item" placeholder="请输入奖金" />
            <!-- <el-select v-model="item.icon" class="row-item" placeholder="请选择图标">
              <el-option label="图标1" value="icon1" />
              <el-option label="图标2" value="icon2" />
            </el-select> -->
            <el-button class="row-item" @click="removeItem(index)">删除</el-button>
          </div>
        </div>
        <!-- 添加按钮 -->
        <el-button type="primary" @click="addItem">添加</el-button>
        <!-- 提交按钮 -->
        <el-button type="primary" @click="submitBox">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getChannelList,
  createChannel,
  removeChannel,
  getRechargeConfigList,
  createRechargeConfigList,
  removeRechargeConfigList,
  getBoxConfigList,
  createBoxConfigList,
  getPGRouteList
} from '@/api/table'
import Upload from '@/components/upload'

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
    Upload
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      title: 'Create',
      channel: {
        cid: '',
        name: '',
        icon: '',
        title: '',
        desc: '',
        logo: '',
        url: '',
        min_recharge: '',
        min_draw: '',
        ct_multiple: '',
        cz_money: '',
        bet_money: '',
        pg_id: ''
      },
      isShowRecharge: false,
      isCreate: false,
      rechargeLsit: [],
      cid: '',
      addChargeParam: {
        cid: '',
        money: '',
        gifts: '',
        id: ''
      },
      formLabelWidth: '120px',
      items: [
        {
          user_num: '',
          money: '',
          icon: ''
        }
      ],
      isShowBox: false,
      channelBoxParam: {
        cid: '',
        cz_money: '',
        bet_money: ''
      },
      pgOptions: []
    }
  },
  created() {
    this.fetchData()
    this.loadPGRoutes()
  },
  methods: {
    loadPGRoutes() {
      getPGRouteList().then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.pgOptions = response.data
        }
      })
    },
    uploadChange(val) {
      console.log('val', val)
      this.channel.logo = val
    },
    uploadChangeIcon(val) {
      console.log('val', val)
      this.channel.icon = val
    },
    addItem() {
      // 添加新行
      this.items.push({ user_num: '', money: '' })
    },
    removeItem(index) {
      // 删除当前行
      this.items.splice(index, 1)
    },
    submitBox() {
      // 提交数据，这里可以根据需要处理数据，如发送到服务器
      console.log('提交的数据:', this.items)
      const param = {
        cid: this.cid,
        box: this.items,
        cz_money: this.channelBoxParam.cz_money,
        bet_money: this.channelBoxParam.bet_money
      }
      createBoxConfigList(param).then((response) => {
        this.isShowBox = false
        this.$message.success(response.msg)
      })
    },
    fetchData() {
      this.listLoading = true
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.list = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      createChannel(this.channel).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    handleCreate() {
      this.channel = {
        cid: '',
        name: '',
        icon: '',
        title: '',
        desc: '',
        logo: '',
        url: '',
        min_recharge: '',
        min_draw: '',
        ct_multiple: '',
        cz_money: '',
        bet_money: '',
        pg_id: ''
      }
      this.title = '创建渠道'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      console.log(row)
      delete row.child
      this.channel = row
      this.title = '编辑渠道'
      this.dialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeChannel({ id: row.id }).then((response) => {
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
    handleChargeDelete(index, row) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeRechargeConfigList({ id: row.id }).then((response) => {
          this.getRechargeConfigList()
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
    handleChargeConfig(index, row) {
      this.cid = row.cid
      this.getRechargeConfigList()
    },
    getRechargeConfigList() {
      getRechargeConfigList({ cid: this.cid }).then((response) => {
        if (response.code === 0) {
          this.isShowRecharge = true
          this.rechargeLsit = response.data
        }
      })
    },
    addRecharge(index, row) {
      if (index === 0) {
        this.addChargeParam = {
          cid: this.addChargeParam.cid,
          money: '',
          gifts: '',
          id: ''
        }
      } else {
        this.addChargeParam = {
          cid: row.cid,
          money: row.money,
          gifts: row.gifts,
          id: row.id
        }
      }
      this.isCreate = true
    },
    submitCreate() {
      createRechargeConfigList(this.addChargeParam).then((response) => {
        console.log(response)
        this.isCreate = false
        let msg = ''
        if (this.addChargeParam.id !== '') {
          msg = '修改成功!'
        } else {
          msg = '添加成功!'
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getRechargeConfigList()
      })
    },
    getBoxConfigList() {
      getBoxConfigList({ cid: this.cid }).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.isShowBox = true
          this.items = response.data.box
          this.channelBoxParam.cz_money = response.data.cz_money
          this.channelBoxParam.bet_money = response.data.bet_money
        }
      })
    },
    handleBoxConfig(index, row) {
      this.cid = row.cid
      this.getBoxConfigList()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .channel-page {
    .row-amount{
      .cell-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;
        .cell-item-input {
          width: 220px;
          margin-left: 20px;
        }
      }
    }
    .header-row {
      display: flex;
      justify-content: flex-start;
      padding: 10px 0;
    }
    .header-cell {
      text-align: left;
      width: 33.3%;
    }
    .content {
      margin-top: 10px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .row-item {
        width: 33.3%;
        margin-right: 10px;
      }
    }
  }

</style>
