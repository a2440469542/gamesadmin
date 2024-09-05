<template>
  <div class="app-container data-statistics">
    <div v-loading="star_rule_loading">
      <div class="lucky-title">
        <div class="title-name">规则说明</div>
        <Editor :content="lucky.star_rule" @changeIntro="getContent"></Editor>
        <div>
          <el-button @click="cancel_handle('star_rule')">取 消</el-button>
          <el-button type="primary" @click="submit_star_rule">确 定</el-button>
        </div>
      </div>
    </div>

    <div class="lucky-title">
      <div class="title-name">数据文件</div>
      <el-table row-key="id" :data="lucky.star_file" border fit highlight-current-row>
        <el-table-column label="文件名称">
          <template slot-scope="scope">{{ scope.row.filename }}</template>
        </el-table-column>
      </el-table>

      <div class="phrase-add gm-upload">
        <input type="file" @change="handleFileUpload" />
        添加文件
      </div>
    </div>

    <div class="lucky-title">
      <div class="title-name">推广活动语</div>
      <el-table row-key="id" :data="lucky.star_phrase" border fit highlight-current-row>
        <el-table-column label="推广短语">
          <template slot-scope="scope">
            <div v-if="scope.row.id == phrase_edit_id">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入推广短语"
                v-model="phrase_edit_content"
              ></el-input>
            </div>
            <div v-else>{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <template v-if="scope.row.id == phrase_edit_id">
              <el-button type="primary" size="mini" @click="submit_phrase()">保存</el-button>
              <el-button type="danger" size="mini" @click="cancel_phrase()">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" @click="edit_phrase(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="delete_phrase(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="phrase-add" @click="phrase_add()">添加推广短语</div>
    </div>

    <div class="lucky-title">
      <div class="title-name">活动彩金档位</div>
      <el-table row-key="id" :data="lucky.star_coin" border fit highlight-current-row>
        <el-table-column align="center" label="邀请最小人数">
          <template slot-scope="scope">
            <div v-if="scope.row.id == coin_info.id">
              <el-input v-model.number="coin_info.min" type="number" />
            </div>
            <div v-else>{{ scope.row.min }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="邀请最大人数">
          <template slot-scope="scope">
            <div v-if="scope.row.id == coin_info.id">
              <el-input v-model.number="coin_info.max" type="number" />
            </div>
            <div v-else>{{ scope.row.max }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="彩金">
          <template slot-scope="scope">
            <div v-if="scope.row.id == coin_info.id">
              <el-input v-model.number="coin_info.money" type="number" />
            </div>
            <div v-else>{{ scope.row.money }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="倍数">
          <template slot-scope="scope">
            <div v-if="scope.row.id == coin_info.id">
              <el-input v-model.number="coin_info.multiple" type="number" />
            </div>
            <div v-else>{{ scope.row.multiple }}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <template v-if="scope.row.id == coin_info.id">
              <el-button type="primary" size="mini" @click="submit_coin()">保存</el-button>
              <el-button type="danger" size="mini" @click="cancel_coin()">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" @click="edit_coin(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="delete_coin(scope.$index, scope.row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="phrase-add" @click="coin_add()">添加活动彩金档位</div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import {
  getLuckyStar,
  LuckyStarAdd,
  StarPhraseAdd,
  StarPhraseEdit,
  StarPhraseDel,
  StarFileAdd,
  StarCoinAdd,
  StarCoinEdit,
  StarCoinDel
} from "@/api/lucky";
import Editor from "@/components/editor/editor.vue";
import dayjs from "dayjs"

export default {
  components: { Editor },
  data() {
    return {
      lucky: {},
      lucky_copy: {},
      star_rule_loading: false,
      listLoading: true,
      dialogVisible: false,
      title: "渠道数据统计",
      phrase_edit_id: "",
      phrase_edit_content: "",
      coin_info: {},
      options: [],
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      dayjs,
      channel: {},
      gameParam: {
        date: "",
        page: 1,
        limit: 20
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getContent(val) {
      this.lucky.star_rule = val.html;
    },
    fetchData() {
      this.listLoading = true;
      getLuckyStar({})
        .then(response => {
          if (response.code === 0) {
            this.lucky = response.data;
            this.lucky_copy = { ...response.data };
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    cancel_handle(type) {
      switch (type) {
        case "star_rule":
          this.lucky.star_rule = this.lucky_copy.star_rule;
          break;
      }
    },
    submit_star_rule() {
      const parmas = {
        star_rule: this.lucky.star_rule
      };
      this.star_rule_loading = true;
      LuckyStarAdd(parmas)
        .then(res => {
          if (res.code == 0) {
            this.$message.success("保存成功");
          } else {
            this.$message.success(res.msg);
          }
        })
        .finally(() => {
          this.star_rule_loading = false;
        });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append("file", file);
      StarFileAdd(formData).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.fetchData();
        } else {
          this.$message.success(res.msg);
        }
      });
    },
    edit_phrase(index, val) {
      this.phrase_edit_id = val.id;
      this.phrase_edit_content = val.content;
    },
    delete_phrase(index, val) {
      this.$confirm("此操作将永久删除这条推广短语, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
          StarPhraseDel({ id: val.id }).then(response => {
            console.error("ssss")
            if (response.code === 0) {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submit_phrase() {
      // 编辑
      const parmas = {
        id: this.phrase_edit_id,
        content: this.phrase_edit_content
      };

      let query_star_phrase = StarPhraseEdit;
      // 新增
      if (parmas.id == "xx00xx00xx00xx00xx00") {
        query_star_phrase = StarPhraseAdd;
        delete parmas.id;
      }
      query_star_phrase(parmas).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.fetchData();
          this.phrase_edit_id = "";
          this.phrase_edit_content = "";
        } else {
          this.$message.success(res.msg);
        }
      });
    },
    phrase_add() {
      this.lucky.star_phrase.push({
        id: "xx00xx00xx00xx00xx00",
        content: ""
      });
      this.phrase_edit_id = "xx00xx00xx00xx00xx00";
      this.phrase_edit_content = "";
    },
    cancel_phrase() {
      if (this.phrase_edit_id == "xx00xx00xx00xx00xx00") {
        this.lucky.star_phrase.pop();
      }
      this.phrase_edit_id = "";
      this.phrase_edit_content = "";
    },
    edit_coin(index, val) {
      this.coin_info = {
        id: val.id,
        min: val.min,
        max: val.max,
        money: val.money,
        multiple: val.multiple,
      };
    },
    coin_add() {
      this.lucky.star_coin.push({
        id: "xx00xx00xx00xx00xx00",
        content: ""
      });
      this.coin_info = {
        id: "xx00xx00xx00xx00xx00"
      };
    },
    cancel_coin() {
      if (this.coin_info.id == "xx00xx00xx00xx00xx00") {
        this.lucky.star_coin.pop();
      }
      this.coin_info = {};
    },
    submit_coin() {
      // 编辑
      let parmas = this.coin_info;

      let query_star_coin = StarCoinEdit;
      // 新增
      if (parmas.id == "xx00xx00xx00xx00xx00") {
        parmas = {
          min: this.coin_info.min,
          max: this.coin_info.max,
          money: this.coin_info.money,
          multiple: this.coin_info.multiple
        };
        query_star_coin = StarCoinAdd;
      }
      query_star_coin(parmas).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.fetchData();
          this.coin_info = {};
        } else {
          this.$message.success(res.msg);
        }
      });
    },
       delete_coin(index, val) {
      this.$confirm("此操作将永久删除这条活动彩金档位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
          StarCoinDel({ id: val.id }).then(response => {
            if (response.code === 0) {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  }
};
</script>

  <style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .mobile-filter {
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
}
.gm-upload {
  position: relative;
  input {
    position: absolute;
    opacity: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: pointer;
  }
}
.phrase-add {
  width: 100%;
  border-radius: 4px;
  height: 40px;
  cursor: pointer;
  border: 1px solid #e5e5e5;
  line-height: 38px;
  font-size: 13px;
  text-align: center;
  margin: 8px 0;
  &:hover {
    opacity: 0.8;
  }
}
.lucky-title {
  width: 100%;
  padding-top: 20px;
  .title-name {
    padding-bottom: 8px;
  }
}
</style>
