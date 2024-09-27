<template>
  <div class="user-container">
    <div class="btn-group">
      <div class="search">
        <label>Número de telefone：</label>
        <el-input v-model="userParam.mobile" class="filter-item" placeholder="Número de telefone" />
        <label>nome de usuário：</label>
        <el-input v-model="userParam.user" class="filter-item" placeholder="nome de usuário" />
        <label>ID de membro：</label>
        <el-input v-model="userParam.uid" class="filter-item" placeholder="ID de membro" />
        <label>Código de Convite：</label>
        <el-input v-model="userParam.inv_code" class="filter-item" placeholder="Código de Convite" />
        <el-button class="check" type="primary" @click="check">Investigar</el-button>
      </div>
      <div class="export">
        <el-button class="check" type="primary" @click="isShowBot=true">Gerar conta de teste</el-button>
      </div>
    </div>
    <el-dialog :title="'Gerar conta de teste'" :visible.sync="isShowBot" width="30%" :before-close="handleClose">
      <el-form
        ref="botForm"
        :model="botParam"
        label-position="left"
      >
        <el-form-item label="Número de contas：" prop="num">
          <el-input v-model="botParam.num" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowBot = false">Cancelar</el-button>
        <el-button type="primary" @click="exportExcel">Claro</el-button>
      </span>
    </el-dialog>
    <el-table
      v-loading="listLoading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="list"
      empty-text="Sem dados"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column props="uid" align="center" label="ID de membro" width="80">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
<!--      <el-table-column align="center" label="ID Superior 1" width="80">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.pid }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="ID Superior 2" align="center" width="90">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.ppid }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="ID Superior 3" align="center" width="100">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.pppid }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="nome de usuário" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Número de telefone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Código de Convite" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inv_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="equilíbrio" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="quantidade congelada" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lock_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="integrante" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hora do registro" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reg_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="última hora de login" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Último IP de login" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Conta de teste" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_rebot == '1' ? 'sim' : 'não' }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" prop="created_at" label="operar">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="danger"-->
<!--            @click="handleDelete(scope.$index, scope.row)"-->
<!--          >excluir</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="userData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import {
  createRebot,
  getUserList, removeUser
} from '@/api/table'
import Pagination from '@/components/pagination/index.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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
      isShowBot: false,
      title: 'conta virtual',
      options: [],
      userData: {
        total: 0,
        per_page: 15,
        current_page: 1,
        last_page: 1
      },
      userParam: {
        page: 1,
        limit: 15,
        orderBy: '',
        user: '',
        mobile: '',
        uid: '',
        cid: '',
        inv_code: ''
      },
      botParam: {
        cid: '',
        num: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.userParam.cid = Number(localStorage.getItem('cid')) || this.$store.state.user.cid
      //console.log(this.userParam)
      getUserList(this.userParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.userData = response.data
          this.listLoading = false
        }
      }).finally(()=>{
        this.listLoading = false
      })
    },
    handleDelete(index, row) {
      // console.log('handleDelete', row.uid)
      this.$confirm('Esta operação excluirá permanentemente o registro. Deseja continuar?', 'dica', {
        confirmButtonText: 'Claro',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        center: true
      }).then(() => {
        removeUser({
          uid: row.uid,
          cid: Number(localStorage.getItem('cid')) || this.$store.state.user.cid
        }).then((response) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: 'excluído com sucesso!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
            message: 'Recuperar exclusão'
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleChannelFilter(value) {
      this.userParam.cid = value
      this.fetchData()
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.userParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.userParam.limit = val
      this.fetchData()
    },
    check() {
      this.fetchData()
    },
    exportExcel() {
      this.botParam.cid = this.userParam.cid
      createRebot(this.botParam).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.isShowBot = false
          const ws = XLSX.utils.json_to_sheet(response.data) // 将数据转换为工作表
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

          // 导出Excel
          const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Conta de teste.xlsx')
          } catch (e) {
            console.error(e)
          }
          this.$message({
            type: 'success',
            message: 'Exportação bem-sucedida!'
          })
          this.fetchData()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  .btn-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 68px;
    padding-left: 12px;
    width: 100%;
    .add {
      margin: 0 20px;
    }
    .search {
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
