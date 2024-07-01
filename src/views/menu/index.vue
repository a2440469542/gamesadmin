<template>
  <div class="app-container menu">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">创建菜单</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="menu"
        label-position="left"
        label-width="100px"
        style="width: 100%;"
      >
        <el-form-item label="上级菜单" prop="parent_id">
          <el-cascader
            v-model="menu.pid"
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
            clearable
            :options="list"
            @change="getMenuOption"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" />
        </el-form-item>
        <el-form-item label="菜单控制器" prop="controllers">
          <el-input v-model="menu.controllers" />
        </el-form-item>
        <el-form-item label="菜单方法" prop="methods">
          <el-input v-model="menu.methods" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menu.path" />
        </el-form-item>
        <el-form-item label="页面路径" prop="path">
          <el-input v-model="menu.component" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="menu.sort" />
        </el-form-item>
        <el-form-item label="是否菜单" prop="is_menu">
          <el-switch v-model="menu.is_menu" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" />
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
      <el-table-column align="center" label="排序" width="95">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上级ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.pid }}
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="控制器" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.controllers }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法" align="center">
        <template slot-scope="scope">
          {{ scope.row.methods }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否是菜单" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_menu | statusFilter">{{
            scope.row.is_menu == '1' ? '是' : '否'
          }}</el-tag>
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
import { mapGetters } from 'vuex'
import { getMenuList, createMenu, removeMenu } from '@/api/table'
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
    ...mapGetters(['menus'])
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      title: 'Create',
      menu: {
        name: '',
        controllers: '',
        id: '',
        methods: '',
        path: '',
        is_menu: true,
        pid: '',
        sort: 0
      }
    }
  },
  created() {
    console.log(this.menus)
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMenuList().then((response) => {
        this.list = response.data
        this.$store.dispatch('SET_MENUS', true)
        this.listLoading = false
      })
    },
    handleSubmit() {
      createMenu(this.menu).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    handleCreate() {
      this.menu = {
        name: '',
        controllers: '',
        id: '',
        methods: '',
        is_menu: '',
        path: '',
        pid: '',
        sort: 0
      }
      this.title = '创建菜单'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      delete row.children
      delete row.child
      delete row.meta
      this.menu = row
      this.title = '编辑菜单'
      this.dialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeMenu({ id: row.id }).then((response) => {
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
    },
    getMenuOption(value) {
      this.menu.pid = value
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  .btn-group {
    padding: 20px;
  }
}
</style>
