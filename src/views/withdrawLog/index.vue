<template>
  <div class="app-container">
    <div class="filter">
      <div class="mobile-filter">
        <label>用户手机号:</label>
        <el-input v-model="withdrawParam.mobile" placeholder="用户手机号" style="width: 200px;" class="filter-item" />
        <label>订单号:</label>
        <el-input v-model="withdrawParam.order_sn" placeholder="订单号" style="width: 200px;" class="filter-item" />
        <label>邀请码:</label>
        <el-input v-model="withdrawParam.inv_code" placeholder="邀请码" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>

        <el-select
          v-model="withdrawParam.cid"
          placeholder="请选择"
          @change="handleChannelFilter"
          filterable
        >
          <el-option
            v-for="item in options"
            :key="item.cid"
            :label="item.title"
            :value="item.cid"
          />
        </el-select>
      </div>
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
      <el-table-column props="id" align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="渠道ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID" width="110">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请码" width="110">
        <template slot-scope="scope">
          {{ scope.row.inv_code }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_sn }}
        </template>
      </el-table-column>
      <el-table-column label="三方平台订单号" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderno }}
        </template>
      </el-table-column>
      <el-table-column label="提现类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 'CPF' ? 'CPF' : '手机号' }}
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" align="center">
        <template slot-scope="scope">
          {{ scope.row.pix }}
        </template>
      </el-table-column>
      <el-table-column label="提款人姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="提现时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.update_time }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ setStatus(scope.row.status) }}
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="withdrawData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { withdrawLog, getChannelList } from '@/api/table'
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
      list: [],
      listLoading: true,
      dialogVisible: false,
      title: '充值记录',
      options: [],
      withdrawData: {
        total: 0
      },
      withdrawParam: {
        page: 1,
        limit: 10,
        cid: '',
        mobile: '',
        order_sn: '',
        inv_code: ''
      }
    }
  },
  created() {
    this.channelList()
  },
  methods: {
    // 状态 状态：0=待审核；1=审核通过；-1=拒绝提现；2=提现成功；-2=提现失败
    setStatus(val) {
      const statusMap = {
        '0': '待审核',
        '1': '审核通过',
        '-1': '拒绝提现',
        '2': '提现成功',
        '-2': '提现失败'
      }
      return statusMap[val]
    },
    uploadChange(val) {
      console.log('val', val)
      this.game.img = val
    },
    channelList() {
      this.listLoading = true
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.options = response.data
          this.withdrawParam.cid = this.options[0].cid
          this.fetchData()
        }
      })
    },
    fetchData() {
      this.listLoading = true
      withdrawLog(this.withdrawParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.withdrawData = response.data
          this.listLoading = false
        }
      })
    },
    handleFilter() {
      this.fetchData()
    },
    handleChannelFilter(value) {
      this.withdrawParam.cid = value
      this.fetchData()
    },

    handleCurrentChange(val) {
      console.log(val)
      this.withdrawParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.withdrawParam.limit = val
      this.fetchData()
    },
    handleSubmit() {}
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
    .mobile-filter {
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
}
</style>
