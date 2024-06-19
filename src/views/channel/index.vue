<template>
  <div class="app-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">Create</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="channel"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="渠道名称" prop="name">
          <el-input v-model="channel.name" />
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="channel.icon" />
        </el-form-item>
        <el-form-item label="网站名称" prop="title">
          <el-input v-model="channel.title" />
        </el-form-item>
        <el-form-item label="网站介绍" prop="desc">
          <el-input v-model="channel.desc" />
        </el-form-item>
        <el-form-item label="网站logo" prop="logo">
          <el-input v-model="channel.logo" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="channel.url" />
        </el-form-item>
        <el-form-item label="是否删除" prop="is_del">
          <el-switch v-model="channel.is_del" active-color="#13ce66" inactive-color="#ff4949" />
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="前端图标" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站介绍" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站logo" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.logo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站地址" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time }}</span>
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
  </div>
</template>

<script>
import { getChannelList, createChannel, removeChannel } from '@/api/table'
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
  components: {},
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      title: 'Create',
      channel: {
        cid: '',
        name: '',
        icon: '',
        title: '',
        desc: '',
        logo: '',
        url: '',
        is_del: false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.list = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      createChannel(this.channel).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    handleCreate() {
      this.channel = {
        name: '',
        icon: '',
        title: '',
        desc: '',
        logo: '',
        url: '',
        is_del: false
      }
      this.title = 'Create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      delete row.child
      this.channel = row
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
        removeChannel({ id: row.id }).then((response) => {
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
