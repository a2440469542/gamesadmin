<template>
  <div class="app-container">
    <div class="filter">
      <div class="mobile-filter">
        <label>用户手机号:</label>
        <el-input v-model="chargeParam.mobile" placeholder="用户手机号" style="width: 200px;" class="filter-item" />
        <label>订单号:</label>
        <el-input v-model="chargeParam.order_sn" placeholder="订单号" style="width: 200px;" class="filter-item" />
        <label>邀请码:</label>
        <el-input v-model="chargeParam.inv_code" placeholder="邀请码" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>

        <el-select
          v-model="chargeParam.cid"
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
      <el-table-column align="center" label="用户ID" width="95">
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
      <el-table-column label="充值金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="赠送金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.gifts }}
        </template>
      </el-table-column>
      <el-table-column label="订单创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '支付中' : scope.row.status == 2 ? '支付成功' : '支付失败' }}
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="chargeData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { chargeLog, getChannelList } from '@/api/table'
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
      chargeData: {
        total: 0
      },
      chargeParam: {
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
    uploadChange(val) {
      console.log('val', val)
      this.game.img = val
    },
    channelList() {
      this.listLoading = true
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.options = response.data
          this.chargeParam.cid = this.options[0]?.cid
          this.fetchData()
        }
      })
    },
    fetchData() {
      this.listLoading = true
      chargeLog(this.chargeParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.chargeData = response.data
          this.listLoading = false
        } else {
          this.listLoading = false
          this.$message.error(response.msg)
        }
      })
    },
    handleFilter() {
      this.fetchData()
    },
    handleChannelFilter(value) {
      this.chargeParam.cid = value
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.chargeParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.chargeParam.limit = val
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
