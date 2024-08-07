<template>
  <div class="app-container channel-page">
    <div class="btn-group">
      <div class="search">
        <el-button type="primary" @click="handleCreate">创建活动</el-button>
<!--        <label style="width: 150px;">活动名称：</label>-->
<!--        <el-input v-model="searchCondition.name" class="filter-item" placeholder="请输入活动名称" />-->
<!--        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchAgent">搜索</el-button>-->
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
      <el-table-column align="center" label="活动ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="活动名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="第一名奖励">
        <template slot-scope="scope">
          {{ scope.row.first_reward }}
        </template>
      </el-table-column>
      <el-table-column label="第二名奖励">
        <template slot-scope="scope">
          {{ scope.row.second_reward }}
        </template>
      </el-table-column>
      <el-table-column label="第三名奖励">
        <template slot-scope="scope">
          {{ scope.row.third_reward }}
        </template>
      </el-table-column>
      <el-table-column label="投注流水倍数">
        <template slot-scope="scope">
          {{ scope.row.multiple }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间">
        <template slot-scope="scope">
          {{ scope.row.start_time }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.end_time }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="获取规则">
        <template slot-scope="scope">
          <div v-html="scope.row.desc"></div>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>

          <el-button
            size="mini"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="pageData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="activity"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
        :rules="formRules"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="activity.name" />
        </el-form-item>
        <el-form-item label="第一名奖励" prop="first_reward">
          <el-input v-model.number="activity.first_reward" type="number" />
        </el-form-item>
        <el-form-item label="第二名奖励" prop="second_reward">
          <el-input v-model.number="activity.second_reward" type="number" />
        </el-form-item>
        <el-form-item label="第三名奖励" prop="third_reward">
          <el-input v-model.number="activity.third_reward" type="number" />
        </el-form-item>
        <el-form-item label="投注流水倍数" prop="multiple">
          <el-input v-model.number="activity.multiple" type="number" />
        </el-form-item>

        <el-form-item label="活动时间" required >
          <el-date-picker
            v-model="data_range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="获取规则" >
          <Editor :content="activity.desc" @changeIntro="getContent"></Editor>
          <!-- <el-input v-model="activity.desc" type="textarea" /> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createOrChangeActivity,
  getActivityList, removeActivity, removeGame
} from '@/api/table'
import Pagination from '@/components/pagination/index.vue'
import Editor from '@/components/editor/editor.vue'
import dayjs from "dayjs";

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
    Pagination,
    Editor
  },
  data() {
    return {
      formRules: {
        name: [{ required: true, min: 1, max: 100, trigger: 'blur', message: '请输入活动名称，不能超过100个字符' }],
        first_reward: [{ required: true, trigger: 'blur', type: 'number', min: 0, message: '第一名奖励为必填数字' }],
        second_reward: [{ required: true, trigger: 'blur', type: 'number', min: 0, message: '第二名奖励为必填数字' }],
        third_reward: [{ required: true, trigger: 'blur', type: 'number', min: 0, message: '第三名奖励为必填数字' }],
        multiple: [{ required: true, trigger: 'blur', type: 'number', min: 0, message: '投注流水倍数为必填数字' }]
      },
      list: [],
      searchCondition: {
        page: 1,
        limit: 20
        // name: ''
      },
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      listLoading: true,
      isCreate: false,
      dialogTitle: '编辑活动',
      dialogVisible: false,
      options: [],
      activity: {
        id: '',
        name: '',
        first_reward: 0,
        second_reward: 0,
        third_reward: 0,
        multiple: 0,
        start_time: '',
        end_time: '',
        desc: ''
      },
      data_range: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getActivityList(this.searchCondition).then((response) => {
        if (response.code === 0) {
          this.pageData = response.data
          this.list = response.data.data
          this.listLoading = false
        }
      })
    },
    handleCurrentChange(val) {
      this.searchCondition.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.searchCondition.limit = val
      this.fetchData()
    },
    searchActivity() {
      this.fetchData()
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleCreate() {
      this.activity = {
        id: '',
        name: '',
        first_reward: 0,
        second_reward: 0,
        third_reward: 0,
        multiple: 0,
        start_time: '',
        end_time: '',
        desc: ''
      }

      this.data_range = [new Date(), new Date(Date.now() + 24 * 3600 * 1000)]
      this.dialogTitle = '创建活动'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      this.data_range = []
      if (row.start_time && row.end_time) {
        this.data_range = [
          new Date(row.start_time),
          new Date(row.end_time)
        ]
      }
      console.error("row",row)
      this.activity = {...row}
        console.error("activity",this.activity)
      this.dialogTitle = '编辑活动'
      this.dialogVisible = true
    },
    async handleSubmit() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          if (this.data_range && this.data_range.length) {
            this.activity.start_time = dayjs(this.data_range[0].getTime()).format('YYYY-MM-DD HH:mm:ss')
            this.activity.end_time = dayjs(this.data_range[1].getTime()).format('YYYY-MM-DD HH:mm:ss')
          } else {
            this.activity.start_time = ''
            this.activity.end_time = ''
          }

          const res = await createOrChangeActivity(this.activity)
          if (res.code === 0) {
            this.dialogVisible = false
            this.fetchData()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeActivity({ id: row.id }).then((response) => {
          if (response.code === 0) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getContent(val) {
      this.activity.desc = val.html;
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
button {
  margin-bottom: 10px;
}
  .channel-page {
    .btn-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      .btn-item {
        margin-right: 10px;
      }
    }
    .search {
      display: flex;
      align-items: center;
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 0px;
      }
      .check {
        margin-left: 20px;
      }
      label {
        margin-right: 10px;
        margin-left: 12px;
      }
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
    .row-amount{
      .cell-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;
        .cell-item-input {
          width: 220px;
          margin-left: 20px;
        }
      }
    }
    .header-row {
      display: flex;
      justify-content: flex-start;
      padding: 10px 0;
    }
    .header-cell {
      text-align: left;
      width: 33.3%;
    }
    .content {
      margin-top: 10px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .row-item {
        width: 33.3%;
        margin-right: 10px;
      }
    }
  }

</style>
