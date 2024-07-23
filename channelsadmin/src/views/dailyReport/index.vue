<template>
  <div class="app-container">
      <div class="filter">
        <el-button class="filter-item" type="primary" icon="el-icon-s-data" @click="openStat">统计数据</el-button>
      </div>
    <el-table
      ref="table1"
      v-loading="listLoading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      show-summary
      :summary-method="getSummaries"
      highlight-current-row
    >
      <el-table-column props="date" align="center" label="邀请人数" >
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column props="invite_user" align="center" label="邀请人数" >
        <template slot-scope="scope">
          {{ scope.row.invite_user }}
        </template>
      </el-table-column>
      <el-table-column props="cz_money" label="充值金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.cz_money }}
        </template>
      </el-table-column>
      <el-table-column props="bet_money" label="下注金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.bet_money }}
        </template>
      </el-table-column>
      <el-table-column props="cash_money" align="center" label="提现金额" >
        <template slot-scope="scope">
          {{ scope.row.cash_money }}
        </template>
      </el-table-column>
      <el-table-column props="cz_num" align="center" label="充值人数" >
        <template slot-scope="scope">
          {{ scope.row.cz_num }}
        </template>
      </el-table-column>
      <el-table-column props="cash_num" align="center" label="提现人数" >
        <template slot-scope="scope">
          {{ scope.row.cash_num }}
        </template>
      </el-table-column>
      <el-table-column props="bozhu_num" align="center" label="N1领取人数" >
        <template slot-scope="scope">
          {{ scope.row.bozhu_num }}
        </template>
      </el-table-column>
      <el-table-column props="bozhu_money" align="center" label="N1工资" >
        <template slot-scope="scope">
          {{ scope.row.bozhu_money }}
        </template>
      </el-table-column>
      <el-table-column props="daili_num" align="center" label="N2领取人数" >
        <template slot-scope="scope">
          {{ scope.row.daili_num }}
        </template>
      </el-table-column>
      <el-table-column props="daili_money" align="center" label="N2工资" >
        <template slot-scope="scope">
          {{ scope.row.daili_money }}
        </template>
      </el-table-column>
      <el-table-column props="n3_num" align="center" label="N3领取人数" >
        <template slot-scope="scope">
          {{ scope.row.n3_num }}
        </template>
      </el-table-column>
      <el-table-column props="n3_money" align="center" label="N3工资" >
        <template slot-scope="scope">
          {{ scope.row.n3_money }}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="渠道统计" :visible.sync="isShowSta">
      <div class="statics">
        <div class="statics-list">
          <div class="statics-item">
            <div class="statics-item-title">注册人数:</div>
            <div class="statics-item-content">{{ channelSta.reg_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">充值人数:</div>
            <div class="statics-item-content">{{ channelSta.cz_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">总充值金额:</div>
            <div class="statics-item-content">{{ channelSta.cz_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">总投注金额:</div>
            <div class="statics-item-content">{{ channelSta.bet_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">总提现金额:</div>
            <div class="statics-item-content">{{ channelSta.cash_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">宝箱领取人数:</div>
            <div class="statics-item-content">{{ channelSta.box_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">代理工资领取人数:</div>
            <div class="statics-item-content">{{ channelSta.daili_wages_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">代理工资领取总额:</div>
            <div class="statics-item-content">{{ channelSta.daili_wages_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">博主工资领取人数:</div>
            <div class="statics-item-content">{{ channelSta.bozhu_wages_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">博主工资领取总额:</div>
            <div class="statics-item-content">{{ channelSta.bozhu_wages_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">平台用户的余额:</div>
            <div class="statics-item-content">{{ channelSta.user_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">宝箱领取金额:</div>
            <div class="statics-item-content">{{ channelSta.box_money }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { channelUserStat, getDailyReport } from '@/api/table'
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
  components: { },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogVisible: false,
      title: '每日数据',
      isShowSta: false,
      channelSta: {},
      options: []
    }
  },
  created() {
    this.fetchData()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['table1'].doLayout()
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // console.error(Number(localStorage.getItem('cid')) || this.$store.state.user.cid)
      getDailyReport({
        cid: Number(localStorage.getItem('cid')) || this.$store.state.user.cid
      }).then((response) => {
        if (response.code === 0) {
          this.list = response.data
        }
        this.listLoading = false
      })
    },
    openStat() {
      channelUserStat({ cid: Number(localStorage.getItem('cid')) || this.$store.state.user.cid }).then((response) => {
        // console.log(response)
        if (response.code === 0) {
          this.isShowSta = true
          this.channelSta = response.data
        }
      })
    },
    getSummaries(param) {
      // console.error("getSummaries",param)
      const { columns, data } = param
      const sums = []
      const props = ['date','invite_user','cz_money','bet_money','cash_money','cz_num','cash_num','bozhu_num','bozhu_money','daili_num','daili_money','n3_num','n3_money']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => {
          // console.error(index, props[index], item[props[index]])
          return Number(item[props[index]])
        })
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = 'N/A'
        }
      })

      sums.forEach((item, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => {
          // console.error(index, props[index], item[props[index]])
          return Number(item[props[index]])
        })
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)

          if (index === 3) {
            sums[index] = sums[index].toFixed(1)
          }

          sums[index] += ''
        } else {
          sums[index] = 'N/A'
        }
      })

      // sums.forEach((item, index) => {
      //   item = item.toFixed(2)
      // })

      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
  }

  .statics {
    .statics-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
      .statics-item {
        display: flex;
        align-items: center;
        width: 30%;
        font-size: 20px;
        .statics-item-title {
          font-weight: bold;
          margin-right: 20px;
        }
      }
    }
  }

  .el-table{
    overflow:visible !important;
  }
}
</style>
