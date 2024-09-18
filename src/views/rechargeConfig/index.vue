<template>
  <div class="app-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">Create</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="game"
        label-position="left"
      >
        <el-form-item label="第三方平台游戏CODE" prop="code">
          <el-input v-model="game.code" />
        </el-form-item>
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="game.name" />
        </el-form-item>
        <el-form-item label="游戏图标" prop="img">
          <view class="pre-img">
            <image :src="game.img" />
          </view>
          <Upload @uploadChange="uploadChange" />
        </el-form-item>
        <el-form-item label="是否开启" prop="type">
          <el-switch v-model="game.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
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
      <el-table-column props="gid" align="center" label="游戏ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.gid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="游戏名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="游戏图标" width="110" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt="" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="gameData.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getGameList, createGame, removeGame, getPlateList } from '@/api/table'
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
      title: '创建游戏',
      options: [],
      gameParam: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      gameData: {
        total: 0,
        per_page: 15,
        current_page: 1,
        last_page: 1
      },
      game: {
        name: '',
        code: '',
        img: '',
        is_open: true,
        gid: ''
      }
    }
  },
  created() {
    this.fetchData()
    this.loadingPlateList()
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
      getGameList(this.gameParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.gameData = response.data
        }
      }).finally(()=>{
         this.listLoading = false
      })
    },
    loadingPlateList() {
      getPlateList().then((response) => {
        if (response.code === 0) {
          this.options = response.data
        }
      })
    },
    handleSubmit() {
      createGame(this.game).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    handleCreate() {
      this.game = {
        name: '',
        code: '',
        img: '',
        is_open: true,
        gid: ''
      }
      this.title = 'Create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      delete row.child
      this.game = row
      this.title = 'Edit'
      this.dialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeGame({ id: row.id }).then((response) => {
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
