<template>
  <div class="app-container">
      <div class="filter">
        <el-button class="filter-item" type="primary" icon="el-icon-s-data" @click="openStat">Dados estatísticos</el-button>
      </div>
    <el-table
      ref="table1"
      v-loading="listLoading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="list"
      element-loading-text="Loading"
      empty-text="Sem dados"
      border
      fit
      show-summary
      :summary-method="getSummaries"
      highlight-current-row
    >
      <el-table-column props="date" align="center" label="data" >
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column props="invite_user" align="center" label="Número de pessoas convidadas" >
        <template slot-scope="scope">
          {{ scope.row.invite_user }}
        </template>
      </el-table-column>
      <el-table-column props="cz_money" label="Valor de recarga" align="center">
        <template slot-scope="scope">
          {{ scope.row.cz_money }}
        </template>
      </el-table-column>
      <el-table-column props="bet_money" label="Valor da aposta" align="center">
        <template slot-scope="scope">
          {{ scope.row.bet_money }}
        </template>
      </el-table-column>
      <el-table-column props="cash_money" align="center" label="Quantidade retirada" >
        <template slot-scope="scope">
          {{ scope.row.cash_money }}
        </template>
      </el-table-column>
      <el-table-column props="cz_num" align="center" label="Número de pessoas recarregando" >
        <template slot-scope="scope">
          {{ scope.row.cz_num }}
        </template>
      </el-table-column>
      <el-table-column props="cash_num" align="center" label="Número de pessoas que sacaram dinheiro" >
        <template slot-scope="scope">
          {{ scope.row.cash_num }}
        </template>
      </el-table-column>
      <el-table-column props="bozhu_num" align="center" label="Número de destinatários N1" >
        <template slot-scope="scope">
          {{ scope.row.bozhu_num }}
        </template>
      </el-table-column>
      <el-table-column props="bozhu_money" align="center" label="Salário N1" >
        <template slot-scope="scope">
          {{ scope.row.bozhu_money }}
        </template>
      </el-table-column>
      <el-table-column props="daili_num" align="center" label="Número de destinatários N2" >
        <template slot-scope="scope">
          {{ scope.row.daili_num }}
        </template>
      </el-table-column>
      <el-table-column props="daili_money" align="center" label="Salário N2" >
        <template slot-scope="scope">
          {{ scope.row.daili_money }}
        </template>
      </el-table-column>
      <el-table-column props="n3_num" align="center" label="Número de destinatários N3" >
        <template slot-scope="scope">
          {{ scope.row.n3_num }}
        </template>
      </el-table-column>
      <el-table-column props="n3_money" align="center" label="Salário N3" >
        <template slot-scope="scope">
          {{ scope.row.n3_money }}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Estatísticas do canal" :visible.sync="isShowSta">
      <div class="statics">
        <div class="statics-list">
          <div class="statics-item">
            <div class="statics-item-title">Número de pessoas cadastradas:</div>
            <div class="statics-item-content">{{ channelSta.reg_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Número de pessoas recarregando:</div>
            <div class="statics-item-content">{{ channelSta.cz_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Valor total de recarga:</div>
            <div class="statics-item-content">{{ channelSta.cz_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Valor total da aposta:</div>
            <div class="statics-item-content">{{ channelSta.bet_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Valor total da retirada:</div>
            <div class="statics-item-content">{{ channelSta.cash_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Número de pessoas que recebem baús de tesouro:</div>
            <div class="statics-item-content">{{ channelSta.box_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Número de beneficiários de salário de agência:</div>
            <div class="statics-item-content">{{ channelSta.daili_wages_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Salário total da agência recebido:</div>
            <div class="statics-item-content">{{ channelSta.daili_wages_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Número de blogueiros que recebem salário:</div>
            <div class="statics-item-content">{{ channelSta.bozhu_wages_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Salário total recebido por blogueiros:</div>
            <div class="statics-item-content">{{ channelSta.bozhu_wages_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Saldo de usuários da plataforma:</div>
            <div class="statics-item-content">{{ channelSta.user_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">Valor da arrecadação do baú do tesouro:</div>
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
      title: 'dados diários',
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
          sums[index] = 'total'
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
          sums[index] = 'total'
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
        width: 45%;
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
