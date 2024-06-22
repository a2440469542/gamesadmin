<template>
  <div class="app-container bill">
    <div class="filter">
      <div class="mobile-filter">
        <label>渠道:</label>
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
        <label>帐变类型:</label>
        <el-select
          v-model="chargeParam.type"
          placeholder="请选择"
          @change="handleBillTypeFilter"
        >
          <el-option
            v-for="item in billType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
      <el-table-column label="用户ID" width="110">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column label="账变金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="账变前的金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.before_money }}
        </template>
      </el-table-column>
      <el-table-column label="账变后的金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.after_money }}
        </template>
      </el-table-column>
      <el-table-column label="赠送金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.gifts }}
        </template>
      </el-table-column>
      <el-table-column label="账变时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
      <el-table-column label="账变类型 " width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 1 ? '支付中' : scope.row.status == 2 ? '支付成功' : '支付失败' }}
        </template>
      </el-table-column>
      <el-table-column label="描述" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
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
import { getBillRecords, getChannelList, getBillType } from '@/api/table'
import Pagination from '@/components/pagination/index.vue'
import { options } from 'runjs'
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
      title: '帐变记录',
      options: [],
      billType: [],
      chargeData: {
        total: 0
      },
      chargeParam: {
        page: 1,
        limit: 10,
        cid: '',
        mobile: '',
        type: ''
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
          this.chargeParam.cid = this.options[0].cid
          this.fetchData()
          this.getBillTypeOptions()
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getBillRecords(this.chargeParam).then((response) => {
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
    getBillTypeOptions() {
      getBillType().then((response) => {
        if (response.code === 0) {
          const options = []
          for (const i in response.data) {
            const obj = {
              label: response.data[i],
              value: i
            }
            options.push(obj)
          }
          this.billType = options
        } else {
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
    handleBillTypeFilter(value) {
      this.fetchData()
    },
    handleSubmit() {}
  }
}
</script>

  <style lang="scss" scoped>
  .bill {
    .filter {
      padding: 20px;
      .mobile-filter {
        label {
          margin-left: 20px;
          margin-right: 20px;
        }
      }
    }
  }
  </style>