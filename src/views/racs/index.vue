<template>
  <div class="app-container channel-page">
    <div class="mobile-filter">
      <el-button class="filter-item" type="primary" @click="add_detail()">添加比赛活动</el-button>
    </div>

    <el-table
      v-loading="list_loading"
      row-key="id"
      :data="list_data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- <el-table-column align="center" label="id" width="120">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>-->
      <el-table-column label="排序" width="120">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="奖励类型">
        <template slot-scope="scope">{{ scope.row.award_type }}</template>
      </el-table-column>
      <el-table-column label="比赛方式">
        <template slot-scope="scope">{{ scope.row.race_type }}</template>
      </el-table-column>
      <el-table-column label="游戏">
        <template slot-scope="scope">{{ scope.row.game }}</template>
      </el-table-column>
      <el-table-column label="game_id">
        <template slot-scope="scope">{{ scope.row.game_id }}</template>
      </el-table-column>
      <el-table-column label="第一名奖励">
        <template slot-scope="scope">{{ scope.row.first }}</template>
      </el-table-column>
      <el-table-column label="流水倍数">
        <template slot-scope="scope">{{ scope.row.multiple }}</template>
      </el-table-column>
      <el-table-column label="开始时间">
        <template slot-scope="scope">{{ scope.row.start_time }}</template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">{{ scope.row.end_time }}</template>
      </el-table-column>
      <el-table-column label="平台">
        <template slot-scope="scope">{{ scope.row.channel }}</template>
      </el-table-column>
      <el-table-column label="规则">
        <template slot-scope="scope">{{ scope.row.rules }}</template>
      </el-table-column>
      <el-table-column label="获奖uid">
        <template slot-scope="scope">{{ scope.row.uid }}</template>
      </el-table-column>
      <el-table-column label="获奖账号">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column label="获奖邀请码">
        <template slot-scope="scope">{{ scope.row.inv_code }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handle_edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handle_del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="page_data.total"
      @handleCurrentChange="handle_current_change"
      @handleSizeChange="handle_size_change"
    />

    <el-dialog
      title="比赛活动"
      :visible.sync="detail_visible"
      width="60%"
      :before-close="handle_visible"
     
    >
    <div v-loading="dialog_loading">
      <el-form ref="dataForm" :model="details" label-position="left">
        <el-form-item label="活动名称" prop="title">
          <el-input class="el-inpit" v-model="details.title" clearable />
        </el-form-item>

        <el-form-item label="第一名奖励" prop="first">
          <el-input class="el-inpit" v-model.number="details.first" clearable type="number" />
        </el-form-item>
        <el-form-item label="流水倍数" prop="multiple">
          <el-input class="el-inpit" v-model.number="details.multiple" clearable type="number" />
        </el-form-item>
        <el-form-item label="奖励类型" prop="award_type">
          <!-- 1=现金；2=积分   -->
          <el-switch
            v-model="details.award_type"
            :active-value="1"
            active-text="现金"
            :inactive-value="2"
            inactive-text="积分"
          ></el-switch>
        </el-form-item>
        <el-form-item label="比赛方式" prop="race_type">
          <!-- ：1=充值；2=投注     -->
          <el-switch
            v-model="details.race_type"
            :active-value="1"
            active-text="充值"
            :inactive-value="2"
            inactive-text="投注"
          ></el-switch>
        </el-form-item>
        <el-form-item label="所有游戏" prop="game">
          <el-radio-group v-model="details.game">
            <el-radio :label="1">所有的游戏</el-radio>
            <el-radio :label="2">某个平台</el-radio>
            <el-radio :label="3">某款游戏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="details.game == 2" label="平台选择" prop="channel">
          <el-select
            v-model="details.channel"
            multiple
            clearable
            value-key="cid"
            filterable
            placeholder="请选择平台"
          >
            <el-option
              v-for="item in channel_options"
              :key="item.cid"
              :label="item.name"
              :value="item.cid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="details.game == 3" label="游戏选择" prop="game_id">
          <el-select
            v-model="details.game_id"
            multiple
            clearable
            value-key="gid"
            filterable
            placeholder="请选择游戏"
          >
            <el-option
              v-for="item in game_options"
              :key="item.gid"
              :label="item.name"
              :value="item.gid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动时间" required>
          <el-date-picker
            v-model="data_range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="获奖uid" prop="uid">
          <el-input class="el-inpit" v-model="details.uid" clearable />
        </el-form-item>
        <el-form-item label="获奖账号" prop="mobile">
          <el-input class="el-inpit" v-model="details.mobile" clearable />
        </el-form-item>
        <el-form-item label="获奖邀请码" prop="inv_code">
          <el-input class="el-inpit" v-model="details.inv_code" clearable />
        </el-form-item>
        <el-form-item label="规则说明" prop="rules">
          <Editor :content="details.rules" @changeIntro="get_content"></Editor>
        </el-form-item>
      </el-form>

      <el-button @click="dialog_visible = false">取 消</el-button>
      <el-button type="primary" @click="handle_submit()">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {
  RacsIndex,
  RacsEdit,
  RacsDel,
  GameIndex,
  ChannelIndex
} from "@/api/racs";
import Pagination from "@/components/pagination/index.vue";
import Editor from "@/components/editor/editor.vue";
import Upload from "@/components/upload";

export default {
  data() {
    return {
      list_loading: false,
      list_data: [],
      page_data: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      parmas: {
        page: 1,
        limit: 20,
        keyword: ""
      },
      details: {},
      detail_visible: false,
      dialog_loading: false,
      data_range: [],
      game_options: [],
      channel_options: []
    };
  },
  components: {
    Pagination,
    Editor,
    Upload
  },
  created() {
    this.get_data_list();
    this.get_channel_list();
    this.get_game_list();
  },
  methods: {
    get_data_list() {
      this.list_loading = true;
      RacsIndex(this.parmas)
        .then(res => {
          if (res.code === 0) {
            this.list_data = res.data.data;
            this.page_data = res.data;
          }
        })
        .finally(() => {
          this.list_loading = false;
        });
    },
    get_channel_list() {
      ChannelIndex({ limit: 1000, page: 1 }).then(res => {
        if (res.code === 0) {
          this.channel_options = res.data.data;
        }
      });
    },
    get_game_list() {
      GameIndex({ limit: 1000, page: 1 }).then(res => {
        if (res.code === 0) {
          this.game_options = res.data.data;
        }
      });
    },
    handle_filter() {
      this.parmas.page = 1;
      this.get_data_list();
    },
    add_detail() {
      this.detail_visible = true;
      this.data_range = [new Date(), new Date(Date.now() + 24 * 3600 * 1000)];
      this.details = {};
    },
    handle_edit(row) {
      this.detail_visible = true;
      this.details = row;
      this.data_range = [];
      if (row.start_time && row.end_time) {
        this.data_range = [new Date(row.start_time), new Date(row.end_time)];
      }
    },
    handle_del(row) {
      this.$confirm("此操作将永久删除该比赛活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          RacsDel({ id: row.id }).then(res => {
            if (res.code === 0) {
              this.get_data_list();
              this.$message.success("删除成功");
            } else {
              this.$message.info("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    handle_submit() {
      this.dialog_loading = true;
      if (this.data_range && this.data_range.length) {
        this.details.start_time = dayjs(this.data_range[0].getTime()).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.details.end_time = dayjs(this.data_range[1].getTime()).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.details.start_time = "";
        this.details.end_time = "";
      }

      if(this.details.game == 1){
        this.details.game_id = []
        this.details.channel = []
      }

      RacsEdit(this.details)
        .then(res => {
          if (res.code === 0) {
            this.$message.success("保存成功");
            this.detail_visible = false;
            this.parmas.page = 1;
            this.get_data_list();
          } else {
            this.$message.success("保存失败");
          }
        })
        .finally(() => {
          this.dialog_loading = false;
        });
    },
    handle_visible() {
      this.detail_visible = false;
    },
    handle_current_change(val) {
      this.parmas.page = val;
      this.get_data_list();
    },
    handle_size_change(val) {
      this.parmas.limit = val;
      this.get_data_list();
    },
    upload_change(val) {
      this.details.thumb_img = val;
    },
    upload_change_long(val) {
      this.details.img = val;
    },
    get_content(val) {
      this.details.desc = val.html;
    }
  }
};
</script>

<style scoped lang="scss">
.thumb-img-all {
  padding-top: 40px;
  .thumb-img {
    display: flex;
    justify-items: center;
    justify-content: flex-start;
  }
  .pre-img {
    width: 148px;
    height: 148px;
    margin-right: 20px;
    img {
      width: 100%;
    }
    &.pre-img-long {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.mobile-filter {
  padding-bottom: 10px;
}

.scope-img {
  width: 80px;
  height: 80px;
}
.filter-item {
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
.el-inpit {
  max-width: 360px;
}
</style>