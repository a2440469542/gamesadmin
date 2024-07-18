<template>
  <div class="app-container data-statistics">
    <div class="filter">
      <div class="mobile-filter">
        <label>用户手机号:</label>
        <el-input v-model="gameParam.mobile" placeholder="用户手机号" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <label>渠道:</label>
<!--        <el-select-->
<!--          v-model="gameParam.cid"-->
<!--          placeholder="请选择"-->
<!--          class="filter-item"-->
<!--          @change="handleChannelFilter"-->
<!--          filterable-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in options"-->
<!--            :key="item.cid"-->
<!--            :label="item.title"-->
<!--            :value="item.cid"-->
<!--          />-->
<!--        </el-select>-->
        <ChannelSelect v-model="gameParam.cid" class="filter-item" @change="handleChannelFilter">
        </ChannelSelect>
      </div>
      <div class="export">
        <el-button @click="exportExcel">导出 Excel</el-button>
      </div>
    </div>
    <el-table
      ref="exportTable"
      v-loading="listLoading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="渠道ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="游戏名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="邀请人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.invite_user }}
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.cz_money }}
        </template>
      </el-table-column>
      <el-table-column label="充值次数" align="center">
        <template slot-scope="scope">
          {{ scope.row.cz_num }}
        </template>
      </el-table-column>
      <el-table-column label="投注金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.bet_money }}
        </template>
      </el-table-column>
      <el-table-column label="盈利金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.win_money }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.cash_money }}
        </template>
      </el-table-column>
      <el-table-column label="提现次数" align="center">
        <template slot-scope="scope">
          {{ scope.row.cash_num }}
        </template>
      </el-table-column>
      <el-table-column label="宝箱获取金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.box_money }}
        </template>
      </el-table-column>
      <el-table-column label="平均充值金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.avg_cz_money }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { getData } from '@/api/table'
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
  components: {ChannelSelect },
  data() {
    return {
      list: [],
      listLoading: true,
      dialogVisible: false,
      title: '游戏记录',
      options: [],
      gameParam: {
        cid: '',
        mobile: ''
      }
    }
  },
  created() {
    // this.channelList()
  },
  methods: {
    // 状态 状态：1=支付中;2=支付成功;3=支付失败
    setStatus(val) {
      const statusMap = {
        '1': '支付中',
        '2': '支付成功',
        '3': '支付失败'
      }
      return statusMap[val]
    },
    uploadChange(val) {
      console.log('val', val)
      this.game.img = val
    },
    // channelList() {
    //   this.listLoading = true
    //   getChannelList().then((response) => {
    //     if (response.code === 0) {
    //       this.options = response.data.data
    //       this.gameParam.cid = this.options[0].cid
    //       this.fetchData()
    //     }
    //   })
    // },
    fetchData() {
      this.listLoading = true
      getData(this.gameParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data
          this.listLoading = false
        }
      })
    },
    handleFilter() {
      this.fetchData()
    },
    handleChannelFilter(value) {
      this.gameParam.cid = value
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.gameParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.gameParam.limit = val
      this.fetchData()
    },
    handleSubmit() {},
    exportExcel() {
      const ws = XLSX.utils.table_to_sheet(this.$refs.exportTable.$el)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

      // 导出Excel
      const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data_statistics.xlsx')
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .app-container {
    .filter {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .mobile-filter {
        .filter-item {
          margin-left: 20px;
          margin-right: 20px;
        }
      }
    }
  }
  </style>
