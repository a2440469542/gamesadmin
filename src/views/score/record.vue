<template>
  <div>
    <div class="mobile-filter">
      <label>手机号:</label>
      <el-input
        v-model="parmas.mobile"
        placeholder="手机号"
        style="width: 260px;"
        class="filter-item"
        type="number"
        clearable
      />
      <label>商品名称:</label>
      <el-input
        v-model="parmas.keyword"
        placeholder="商品名称"
        style="width: 260px;"
        class="filter-item"
        clearable
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handle_filter()"
      >搜索</el-button>
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
      <el-table-column label="渠道ID">
        <template slot-scope="scope">{{ scope.row.cid }}</template>
      </el-table-column>
      <el-table-column label="用户id">
        <template slot-scope="scope">{{ scope.row.uid }}</template>
      </el-table-column>
      <el-table-column label="用户账号">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column label="用户邀请码">
        <template slot-scope="scope">{{ scope.row.inv_code }}</template>
      </el-table-column>
      <el-table-column label="商品ID">
        <template slot-scope="scope">{{ scope.row.gid }}</template>
      </el-table-column>
      <el-table-column label="兑换数量">
        <template slot-scope="scope">{{ scope.row.num }}</template>
      </el-table-column>
      <el-table-column label="兑换积分">
        <template slot-scope="scope">{{ scope.row.score }}</template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="收货人电话">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="收货地址">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">{{ scope.row.desc }}</template>
      </el-table-column>
      <el-table-column label="兑换时间">
        <template slot-scope="scope">{{ scope.row.add_time }}</template>
      </el-table-column>
      <el-table-column label="发货时间">
        <template slot-scope="scope">{{ scope.row.send_time }}</template>
      </el-table-column>
      <el-table-column label="状态" fixed="right">
        <!-- 状态：0=待发货；1=已发货   -->
        <template slot-scope="scope">{{ scope.row.status ? '已发货' : '待发货' }}</template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handle_edit(scope.row)">修改状态</el-button>
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
      title="发货信息"
      :visible.sync="detail_visible"
      width="60%"
      :before-close="handle_visible"
      v-loading="dialog_loading"
    >
      <el-form ref="dataForm" :model="details" label-position="left">
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="details.title" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="details.sort" clearable type="number" />
        </el-form-item>
        <el-form-item label="首页缩略图" prop="thumb_img">
          <div class="thumb-img-all">
            <div class="thumb-img">
              <div class="pre-img pre-img-long" v-if="details.thumb_img">
                <img :src="details.thumb_img" />
              </div>
              <div>
                <Upload @uploadChange="upload_change" :key="details.thumb_img" />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品图片" prop="img">
          <div class="thumb-img-all">
            <div class="thumb-img">
              <div class="pre-img pre-img-long" v-if="details.img">
                <img :src="details.img" />
              </div>
              <div>
                <Upload @uploadChange="upload_change_long" :key="details.img" />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="score">
          <el-input v-model.number="details.score" clearable type="number" />
        </el-form-item>
        <el-form-item label="规则说明" prop="desc">
          <Editor :content="details.desc" @changeIntro="get_content"></Editor>
        </el-form-item>
      </el-form>

      <el-button @click="dialog_visible = false">取 消</el-button>
      <el-button type="primary" @click="handle_submit()">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { GoodsGoodsOrder,GoodsSendGoods } from "@/api/score";
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
      dialog_loading: false
    };
  },
  components: {
    Pagination,
    Editor,
    Upload
  },
  created() {
    this.get_data_list();
  },
  methods: {
    get_data_list() {
      this.list_loading = true;
      GoodsGoodsOrder(this.parmas)
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
    handle_filter() {
      this.parmas.page = 1;
      this.get_data_list();
    },
    add_detail() {
      this.detail_visible = true;
      this.details = {};
    },
    handle_edit(row) {
      this.detail_visible = true;
      this.details = row;
    },
    handle_submit() {
      this.dialog_loading = true;
      GoodsEdit(this.details)
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
</style>