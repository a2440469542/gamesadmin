<template>
  <div class="app-container channel-page">
    <div class="filter">
      <div class="mobile-filter">
        <el-button class="filter-item" type="primary" @click="handleCreate()">上传视频</el-button>
        <el-button class="filter-item" type="primary" @click="handleGetInfo()">规则说明</el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="视频id" width="120">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="视频地址">
        <template slot-scope="scope">{{ scope.row.url }}</template>
      </el-table-column>
      <el-table-column label="视频大小KB" width="160">
        <template slot-scope="scope">{{ scope.row.size }}</template>
      </el-table-column>
      <el-table-column label="上传时间" width="220">
        <template slot-scope="scope">{{ scope.row.add_time }}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->

          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="pageData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div class="lucky-title">
        <div class="title-name">视频上传</div>
        <el-table row-key="id" :data="upload_video" border fit highlight-current-row>
          <el-table-column align="center" label="链接">
            <template slot-scope="scope">{{ scope.row.url }}</template>
          </el-table-column>
          <el-table-column align="center" label="大小" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.url">{{ scope.row.size }}KB</div>
              <div v-else>loading {{scope.row.progress.toFixed(2)}}%</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160">
            <template slot-scope="scope">
              <el-button v-if="scope.row.url" size="mini" @click="copy_url(scope.row)">复制</el-button>
              <el-button type="danger" size="mini" @click="cancel_video(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="phrase-add gm-upload">
          <input type="file" multiple @change="handleFileUpload" />
          添加文件
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="规则说明"
      :visible.sync="dialogVisibleInfo"
      width="60%"
      :before-close="handleCloseInfo"
    >
      <el-form ref="dataForm" :model="set_config" label-position="left">
        <el-form-item label="TIKTOK链接" prop="tiktok_url">
          <el-input v-model="set_config.tiktok_url" />
        </el-form-item>
        <el-form-item label="KWAIN链接" prop="kwain_url">
          <el-input v-model="set_config.kwain_url" />
        </el-form-item>
        <el-form-item label="insgram链接" prop="insgram_url">
          <el-input v-model="set_config.insgram_url" />
        </el-form-item>
        <el-form-item label="telegram客服" prop="tg_kefu">
          <el-table row-key="id" :data="tg_kefu" border fit highlight-current-row>
            <el-table-column align="center" label="链接">
              <template slot-scope="scope">
                <div v-if="scope.row.id === tg_kefu_id">
                  <el-input v-model="tg_detail.url" />
                </div>
                <div v-else>{{ scope.row.url }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="160">
              <template slot-scope="scope">
                <template v-if="scope.row.id === tg_kefu_id">
                  <el-button type="primary" size="mini" @click="tg_kefu_submit()">保存</el-button>
                  <el-button type="danger" size="mini" @click="tg_kefu_id = ''">取消</el-button>
                </template>
                <template v-else>
                  <el-button size="mini" @click="tg_kefu_edit(scope.row,scope.$index)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="tg_kefu_del(scope.$index)">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div class="phrase-add" @click="tg_kefu_add()">添加telegram客服</div>
        </el-form-item>
        <el-form-item label="whatsapp客服" prop="whatsapp_kefu">
          <el-table row-key="id" :data="whatsapp_kefu" border fit highlight-current-row>
            <el-table-column align="center" label="链接">
              <template slot-scope="scope">
                <div v-if="scope.row.id === whatsapp_kefu_id">
                  <el-input v-model="whatsapp_detail.url" />
                </div>
                <div v-else>{{ scope.row.url }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="160">
              <template slot-scope="scope">
                <template v-if="scope.row.id === whatsapp_kefu_id">
                  <el-button type="primary" size="mini" @click="whatsapp_kefu_submit()">保存</el-button>
                  <el-button type="danger" size="mini" @click="whatsapp_kefu_id = ''">取消</el-button>
                </template>
                <template v-else>
                  <el-button size="mini" @click="whatsapp_kefu_edit(scope.row,scope.$index)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="whatsapp_kefu_del(scope.$index)">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div class="phrase-add" @click="whatsapp_kefu_add()">添加whatsapp客服</div>
        </el-form-item>
        <el-form-item label="规则说明" prop="video_rule">
          <Editor :content="set_config.video_rule" @changeIntro="getContent"></Editor>
        </el-form-item>
      </el-form>

      <el-button @click="dialogVisibleInfo = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmitInfo">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { aws_key } from "@/utils/aws_key.js";
import {
  VideoIndex,
  VideoEdit,
  VideoDel,
  VideoSet_config,
  VideoGet_config
} from "@/api/video";
import Pagination from "@/components/pagination/index.vue";
import Editor from "@/components/editor/editor.vue";
import ChannelSelect from "@/views/channel/channelSelect";

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
  components: {
    Pagination,
    Editor,
    ChannelSelect
  },
  data() {
    return {
      sign_detail: {},
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
      dialogTitle: "编辑活动",
      dialogVisible: false,
      dialogVisibleInfo: false,
      options: [],
      detail: {},
      progress: "",
      set_config: {},
      upload_video: {},
      tg_kefu_id: "",
      tg_kefu: [],
      tg_detail: {},
      whatsapp_kefu_id: "",
      whatsapp_kefu: [],
      whatsapp_detail: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async copy_url(row) {
      try {
        await navigator.clipboard.writeText(row.url);
        this.$message.success("复制成功");
      } catch (err) {
        console.error("Failed to copy text: ", err);
        this.$message.error("复制失败");
      }
    },
    // ams_upload(file) {
    //   const params = {
    //     Bucket: "rs3games",
    //     Key: `videos/${file.name}`,
    //     Body: file,
    //     ContentType: file.type
    //   };

    //   return s3.upload(params).promise();
    // },
    async uploadFile(file, id, s3) {
      const params = {
        Bucket: "rs3games",
        Key: file.name,
        Body: file
      };

      s3.upload(params)
        .on("httpUploadProgress", event => {
          if (event.total) {
            let progress = (event.loaded / event.total) * 100;
            this.progress = (event.loaded / event.total) * 100;
            this.upload_video.forEach(item => {
              if (item.time == id) {
                item.progress = progress;
              }
            });
          }
        })
        .send((err, data) => {
          if (err) {
            console.error("Error:", err);
          } else {
            this.upload_video.forEach(item => {
              if (item.time == id) {
                item.url = data.Location;
              }
            });
            console.error("上传成功", data);
          }
        });
    },
    async handleFileUpload(event) {
      const file_list = event.target.files;

      AWS.config.update(aws_key);

      const s3 = new AWS.S3();

      let upload_list = [];
      file_list.forEach(item => {
        let obj = {
          url: "",
          size: (item.size / 1024).toFixed(2),
          time: Date.now(),
          progress: 0
        };
        item.time = obj.time;
        upload_list.push(obj);
      });

      this.upload_video = upload_list;

      for (let file of file_list) {
        this.uploadFile(file, file.time, s3);
        // try {
        //   const result = await this.ams_upload(file);
        //   const obj = {
        //     url: result.Location,
        //     size: (file.size / 1024).toFixed(2),
        //     time: Date.now()
        //     add_time:  file.lastModified
        //   };
        //   console.error("上传成功", result);
        //   this.upload_video.push(obj);
        // } catch (error) {
        //   console.error("上传失败:", error);
        // }
      }
    },
    fetchData() {
      this.listLoading = true;
      VideoIndex(this.searchCondition)
        .then(response => {
          if (response.code === 0) {
            this.pageData = response.data;
            this.list = response.data.data;
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },

    searchActivity() {
      this.fetchData();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleCreate() {
      this.dialogTitle = "上传视频";
      this.dialogVisible = true;
      this.upload_video = [];
    },
    // handleEdit(index, row) {
    //   this.upload_video = [{ ...row }]
    //   this.dialogTitle = "编辑视频信息";
    //   this.dialogVisible = true;
    // },
    async handleSubmit() {
      for (const item of this.upload_video) {
        let video_info = {
          size: item.size,
          url: item.url
        };
        try {
          await VideoEdit(video_info);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      this.dialogVisible = false;
      this.fetchData();
    },
    async handleSubmitInfo() {
      this.set_config.tg_kefu = this.tg_kefu.map(item => item.url);
      this.set_config.whatsapp_kefu = this.whatsapp_kefu.map(item => item.url);

      const res = await VideoSet_config(this.set_config);
      if (res.code === 0) {
        this.dialogVisibleInfo = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },

    getContent(val) {
      this.set_config.video_rule = val.html;
    },

    async handleGetInfo() {
      const res = await VideoGet_config();
      if (res.code === 0) {
        this.dialogVisibleInfo = true;
        this.set_config = res.data || {};
        let tg_kefu = res.data.tg_kefu || [];
        let whatsapp_kefu = res.data.whatsapp_kefu || [];

        this.tg_kefu = tg_kefu.map((item, index) => {
          return {
            id: index,
            url: item
          };
        });

        this.whatsapp_kefu = whatsapp_kefu.map((item, index) => {
          return {
            id: index,
            url: item
          };
        });

        this.tg_detail = {};
        this.tg_kefu_id = "";
        this.whatsapp_kefu_id = "";
        this.whatsapp = {};
      } else {
        this.$message.error(res.msg);
      }
    },
    async handleCreateInfo() {
      const res = await VideoSet_config();
      if (res.code === 0) {
        this.dialogVisibleInfo = false;
      } else {
        this.$message.error(res.msg);
      }
    },

    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该视频链接, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          VideoDel({ id: row.id }).then(response => {
            if (response.code === 0) {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCloseInfo() {
      this.dialogVisibleInfo = false;
    },
    handleCurrentChange(val) {
      console.log(val);
      this.everyday_param.page = val;
      this.get_list_data();
    },
    handleSizeChange(val) {
      this.everyday_param.limit = val;
      this.get_list_data();
    },
    cancel_video(index) {
      this.upload_video.splice(index, 1);
    },
    tg_kefu_add() {
      this.tg_kefu_id = this.tg_kefu.length;
      this.tg_kefu.push({
        url: "",
        id: this.tg_kefu.length
      });
      this.tg_detail = {
        id: this.tg_kefu_id,
        url: ""
      };
    },
    tg_kefu_edit(row) {
      this.tg_kefu_id = row.id;
      this.tg_detail = {
        url: row.url,
        id: row.id
      };
    },
    tg_kefu_del(index) {
      this.tg_kefu.splice(index, 1);
    },
    tg_kefu_submit() {
      this.tg_kefu.forEach(item => {
        if (item.id === this.tg_detail.id) {
          item.url = this.tg_detail.url;
          this.tg_kefu_id = "";
        }
      });
    },
    whatsapp_kefu_add() {
      this.whatsapp_kefu_id = this.whatsapp_kefu.length;
      this.whatsapp_kefu.push({
        url: "",
        id: this.whatsapp_kefu.length
      });
      this.whatsapp_detail = {
        id: this.whatsapp_kefu_id,
        url: ""
      };
    },
    whatsapp_kefu_edit(row) {
      this.whatsapp_kefu_id = row.id;
      this.whatsapp_detail = {
        url: row.url,
        id: row.id
      };
    },
    whatsapp_kefu_del(index) {
      this.whatsapp_kefu.splice(index, 1);
    },
    whatsapp_kefu_submit() {
      this.whatsapp_kefu.forEach(item => {
        if (item.id === this.whatsapp_detail.id) {
          item.url = this.whatsapp_detail.url;
          this.whatsapp_kefu_id = "";
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.gm-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gm-video {
  width: 200px;
  height: 30px;
  position: relative;
  input {
    position: absolute;
    opacity: 0;
    z-index: 3;
    width: 200px;
    height: 30px;
    top: 0;
    left: 0;
    cursor: pointer;
  }
}
.gm-btn {
  position: relative;
  z-index: 2;
  width: 200px;
  height: 30px;
}
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
