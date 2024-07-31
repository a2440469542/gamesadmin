<template>
  <div class="app-container channel-page">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handle_close"
    >
      <el-form
        ref="dataForm"
        :model="activity"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="activity.name" />
        </el-form-item>

        <el-form-item label="第一名奖励" prop="first_reward">
          <el-input v-model="activity.first_reward" />
        </el-form-item>
        <el-form-item label="第二名奖励" prop="second_reward">
          <el-input v-model="activity.second_reward" />
        </el-form-item>

        <el-form-item label="第三名奖励" prop="third_reward">
          <el-input v-model="activity.third_reward" />
        </el-form-item>
        <el-form-item label="投注流水倍数" prop="multiple">
          <el-input v-model="activity.multiple" />
        </el-form-item>
        <el-form-item label="开始/结束时间" prop="time">
          <el-date-picker
            v-model="activity.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            @change="set_other_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动规则 " prop="desc">
          <el-input v-model="activity.desc" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handle_close">取 消</el-button>
        <el-button type="primary" @click="handle_submit">确 定</el-button>
      </span>
    </el-dialog>
    <h1>活动管理</h1>

    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <p>活动排行榜</p>
          <ul>
            <li>活动1</li>
            <li>活动2</li>
            <li>活动3</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="18">
        <div>
          <div class="btn-group">
            <el-button type="primary" @click="open_dialog_visible()">添加配置</el-button>
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
            <el-table-column align="center" label="ID" width="95">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="名称" width="110">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="第一名奖励" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.first_reward }}</span>
              </template>
            </el-table-column>
            <el-table-column label="第二名奖励" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.second_reward }}</span>
              </template>
            </el-table-column>
            <el-table-column label="第三名奖励" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.third_reward }}</span>
              </template>
            </el-table-column>
            <el-table-column label="投注流水要求倍数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.multiple }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" width="150" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handle_edit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handle_delete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getActivityList,
  editActivityInfo,
  edlActivityInfo
} from "@/api/activity";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },

  data() {
    return {
      list: [],
      title: "",
      dialogVisible: false,
      activity: {},
      listLoading: false,

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.get_activity_list();
  },
  methods: {
    // 获取 活动列表
    get_activity_list() {
      this.listLoading = true;
      let parmas = {
        page: 1,
        limit: 20
      };
      getActivityList(parmas)
        .then(res => {
          if (res.code == 0) {
            this.list = res.data.data;
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    open_dialog_visible() {
      this.dialogVisible = true;
      this.activity = {};
      this.title = "添加活动配置";
    },
    // 关闭弹出层
    handle_close() {
      this.dialogVisible = false;
      this.activity = {};
    },
    // 编辑活动配置
    handle_edit(index, val) {
      this.dialogVisible = true;
      this.activity = val;
      this.title = "编辑活动配置";
      this.activity.time = [this.activity.start_time,this.activity.end_time]
    },
    // 删除活动配置
    handle_delete(index,val) {
      const parmas = {
        id: val.id
      }
      edlActivityInfo(parmas).then(res=>{
        if(res.code == 0){
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.get_activity_list()
        }else{
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 保存编辑后的内容
    handle_submit() {
      delete this.activity.time
      editActivityInfo(this.activity).then(res => {
        if(res.code == 0){
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.dialogVisible = false;
          this.get_activity_list()
        }else{
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 设置 开始和结束时间
    set_other_time(val) {
      // 开始时间
      this.activity.start_time = val[0] || ''
      // 结束时间
      this.activity.end_time = val[1] || ''

    }
  }
};
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
  .row-amount {
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
