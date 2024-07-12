<template>
  <div class="app-container bill">
    <div class="filter">
      <div class="mobile-filter">
        <label>手机号：</label>
        <el-input v-model="billParam.mobile" class="filter-item" placeholder="请输入手机号" />
        <label>邀请码：</label>
        <el-input v-model="billParam.inv_code" class="filter-item" placeholder="请输入邀请码" />
        <el-button class="check" type="primary" @click="handleFilter">查询</el-button>
        <label>渠道:</label>
        <el-select
          v-model="billParam.cid"
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
          v-model="billParam.type"
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
      <el-table-column label="用户ID" width="95" align="center">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
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
      <el-table-column label="账变后的金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.after_money }}
        </template>
      </el-table-column>
      <el-table-column label="赠送金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.gifts }}
        </template>
      </el-table-column>
      <el-table-column label="账变时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
      <el-table-column label="账变类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
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
      title: '帐变记录',
      options: [],
      billType: [
        {
          label: '全部',
          value: ''
        }
      ],
      chargeData: {
        total: 0
      },
      billParam: {
        page: 1,
        limit: 10,
        cid: '',
        mobile: '',
        inv_code: '',
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
          this.billParam.cid = this.options[0].cid
          this.fetchData()
          this.getBillTypeOptions()
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getBillRecords(this.billParam).then((response) => {
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
          this.billType = this.billType.concat(options)
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleFilter() {
      this.fetchData()
    },
    handleChannelFilter(value) {
      this.billParam.cid = value
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.billParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.billParam.limit = val
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
