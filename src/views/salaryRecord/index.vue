<template>
  <div class="app-container bill">
    <div class="filter">
      <div class="mobile-filter">
        <label>渠道:</label>
        <el-select
          v-model="wagesParam.cid"
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
        <label>类型:</label>
        <el-select
          v-model="wagesParam.type"
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
        <label>用户手机号:</label>
        <el-input v-model="wagesParam.mobile" class="filter-item" placeholder="请输入手机号" />
        <div><el-button type="primary" @click="check">查询</el-button></div>
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
      <el-table-column label="邀请码" align="center">
        <template slot-scope="scope">
          {{ scope.row.inv_code }}
        </template>
      </el-table-column>
      <el-table-column label="获得的金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          {{ setType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="工资类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.wages_type == 1 ? '平均充值' : '充值比例' }}
        </template>
      </el-table-column>
      <el-table-column label="领取时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
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
import { wagesList, getChannelList, getBillType } from '@/api/table'
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
        },
        {
          label: '博主',
          value: 1
        },
        {
          label: '代理',
          value: 2
        },
        {
          label: '经理',
          value: 3
        }
      ],
      chargeData: {
        total: 0
      },
      wagesParam: {
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
    check() {
      this.fetchData()
    },
    setType(type){
      switch (type) {
        case 1:
          return '博主'
        case 2:
          return '代理'
        case 3:
          return '经理'
      }
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
          this.wagesParam.cid = this.options[0].cid
          this.fetchData()
        }
      })
    },
    fetchData() {
      this.listLoading = true
      wagesList(this.wagesParam).then((response) => {
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
      this.wagesParam.cid = value
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.wagesParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.wagesParam.limit = val
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
        display: flex;
        align-items: center;
        .filter-item {
          width: 220px;
          margin-right: 20px;
        }
        label {
          margin-left: 20px;
          margin-right: 20px;
        }
      }
    }
  }
  </style>
