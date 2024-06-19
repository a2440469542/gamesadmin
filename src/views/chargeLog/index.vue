<template>
  <div class="app-container">
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
      <el-table-column label="用户ID">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_sn }}
        </template>
      </el-table-column>
      <el-table-column label="三方平台订单号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderno }}
        </template>
      </el-table-column>
      <el-table-column label="充值金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="赠送金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.gifts }}
        </template>
      </el-table-column>
      <el-table-column label="订单创建时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="chargeData.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { chargeLog } from '@/api/table'
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
    
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      title: '充值记录',
      options: [],
      chargeData: {},
      chargeParam: {
        page: 1,
        limit: 10,
        cid: 1,
        mobile: '',
        order_sn: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    uploadChange(val) {
      console.log('val', val)
      this.game.img = val
    },
    handleCurrentChange(val) {
      console.log(val)
      this.gameParam.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      chargeLog(this.chargeParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.chargeData = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      
    }
  }
}
</script>
