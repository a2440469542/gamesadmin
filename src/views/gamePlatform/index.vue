<template>
  <div class="app-container plate-page">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">创建游戏平台</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="dataForm" :model="plate" label-position="left">
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="plate.name" />
        </el-form-item>
        <el-form-item label="平台code" prop="code">
          <el-input v-model="plate.code" :readonly="isReadonly"/>
        </el-form-item>
        <el-form-item label="平台图标" prop="img">
          <div class="game-img-all">
           <div class="game-img">
            <div class="pre-img pre-img-long" v-if="plate.img">
              <img :src="plate.img" />
            </div>
            <div>
              <Upload @uploadChange="uploadChange" :key="plate.img"/>
            </div>
         </div>
         </div>
          
        </el-form-item>
        <!-- <el-form-item label="平台应用ID" prop="app_id">
          <el-input v-model="plate.app_id" />
        </el-form-item>
        <el-form-item label="平台应用密钥" prop="app_secret">
          <el-input v-model="plate.app_secret" />
        </el-form-item>
        <el-form-item label="接口请求地址" prop="url">
          <el-input v-model="plate.url" />
        </el-form-item> -->
        <el-form-item label="钱包模式" prop="url">
          <el-select v-model="plate.wallet_type">
            <el-option v-for="item in walletTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启" prop="is_open">
          <el-switch v-model="plate.is_open" :active-value="1" :inactive-value="0" active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'线路'" :visible.sync="routeDialogVisible" width="80%" :before-close="handleClose">
      <div class="route-container">
        <div class="route-list" v-if="isRouteList">
          <el-button type="primary" @click="handleCreateRoute">创建线路</el-button>
          <el-table v-loading="listLoading" row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="routeList"
            element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label="游戏平台ID" width="95">
              <template slot-scope="scope">
                {{ scope.row.lid }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="线路名称" width="140">
              <template slot-scope="scope">
                {{ scope.row.title }}
              </template>
            </el-table-column>
            <el-table-column label="平台应用ID" align="center">
              <template slot-scope="scope">
                {{ scope.row.app_id }}
              </template>
            </el-table-column>
            <el-table-column label="平台应用密钥" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.app_secret }}</span>
              </template>
            </el-table-column>
            <el-table-column label="接口请求地址" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.url }}</span>
              </template>
            </el-table-column>
            <el-table-column label="RTP" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.rtp }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否测试线路" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.is_rebot == '1' ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleRouteEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleRouteDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="create-route" v-else>
          <el-form ref="dataForm" :model="routeParam" label-position="left">
            <el-form-item label="线路名称" prop="title">
              <el-input v-model="routeParam.title" />
            </el-form-item>
            <el-form-item label="平台应用ID" prop="app_id">
              <el-input v-model="routeParam.app_id" />
            </el-form-item>
            <el-form-item label="平台应用密钥" prop="app_secret">
              <el-input v-model="routeParam.app_secret" />
            </el-form-item>
            <el-form-item label="接口请求地址" prop="url">
              <el-input v-model="routeParam.url" />
            </el-form-item>
            <el-form-item label="RTP" prop="is_rebot">
              <el-input type="number" v-model="routeParam.rtp" />
            </el-form-item>
            <el-form-item label="是否测试线路" prop="is_rebot">
              <el-switch v-model="routeParam.is_rebot" :active-value="1" :inactive-value="0" active-color="#13ce66"
                inactive-color="#ff4949" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isRouteList = true">取 消</el-button>
            <el-button type="primary" @click="routeSubmit">确 定</el-button>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="routeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-table v-loading="listLoading" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="游戏平台ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="平台图标" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt="" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台CODE">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="平台应用ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.app_id }}
        </template>
      </el-table-column>
      <el-table-column label="平台应用密钥" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.app_secret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口请求地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" label="是否测试线路">
        <template slot-scope="scope">
          {{ scope.row.is_rebot == '1' ? '是' : '否' }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="是否开启">
        <template slot-scope="scope">
          {{ scope.row.is_open == '1' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="钱包模式">
        <template slot-scope="scope">
          {{ scope.row.wallet_type == '1' ? '免转钱包' : '转账钱包' }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">设置线路</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPlateList, createPlate, removePlate, routeList, updateRoute, removeRoute } from '@/api/table'
import Pagination from '@/components/pagination/index.vue'
import Upload from '@/components/upload'
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
    Upload
  },
  data() {
    return {
      list: [],
      listLoading: true,
      dialogVisible: false,
      routeDialogVisible: false,
      title: 'Create',
      isReadonly: false,
      routeList: [],
      isRouteList: true,
      walletTypes: [
        {
          label: '免转钱包',
          value: 1
        },
        {
          label: '转账钱包',
          value: 2
        }
      ],
      routeParam: {
        lid: '',
        pid: '',
        title: '',
        app_id: '',
        app_secret: '',
        url: '',
        rtp: '',
        is_rebot: false
      },
      routeListParam: {
        pid: ''
      },
      plate: {
        id: '',
        name: '',
        code: '',
        // app_id: '',
        // app_secret: '',
        // url: '',
        wallet_type: 1,
        is_open: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPlateList().then((response) => {
        if (response.code === 0) {
          this.list = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      createPlate(this.plate).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    async routeSubmit() {
      const res = await updateRoute(this.routeParam)
      if (res.code === 0) {
        this.isRouteList = true
        this.$message.success(res.msg)
        this.loadingRouteList()
      } else {
        this.$message.error(res.msg)
      }
    },
    handleCreateRoute() {
      this.routeParam = {
        lid: '',
        pid: this.routeListParam.pid,
        title: '',
        app_id: '',
        app_secret: '',
        url: '',
        rtp:'',
        is_rebot: false
      }
      this.isRouteList = false
      this.title = '创建线路'
    },
    handleCreate() {
      this.isReadonly = false
      this.plate = {
        name: '',
        code: '',
        // app_id: '',
        // app_secret: '',
        // url: '',
        wallet_type: 1,
        is_open: 1
      }
      this.title = '创建游戏平台'
      this.dialogVisible = true
    },
    async loadingRouteList() {
      const res = await routeList(this.routeListParam)
      console.log(res)
      if (res.code === 0) {
        this.routeDialogVisible = true
        this.isRouteList = true
        this.routeList = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
     uploadChange(val) {
      console.log('val', val)
      this.plate.img = val
    },
    handleDetail(index, row) {
      this.routeListParam.pid = row.id
      this.loadingRouteList()
    },
    handleRouteDelete(index, row) {
      this.$confirm('此操作将永久删除该路线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeRoute({ id: row.lid }).then((response) => {
          if (response.code === 0) {
            this.$message.success(response.msg)
            this.loadingRouteList(row.pid)
            this.isRouteList = true
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleRouteEdit(index, row) {
      this.routeParam = row
      this.isRouteList = false
    },
    handleEdit(index, row) {
      delete row.child
      this.plate = row
      this.title = '编辑线路'
      this.dialogVisible = true
      this.isReadonly = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removePlate({ id: row.id }).then((response) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.plate-page {
  .btn-group {
    padding: 20px;
  }
}

.game-img-all{
  padding-top: 40px;
}
.game-img{
  display: flex;
  justify-items: center;
  justify-content: flex-start;
}
.pre-img{
  width: 148px;
  height: 148px;
  margin-right: 20px;
  img{
    width: 100%;
  }
  &.pre-img-long{
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
