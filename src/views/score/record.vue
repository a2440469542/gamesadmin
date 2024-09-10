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
      <el-table-column label="状态" fixed="right" align="center">
        <!-- 状态：0=待发货；1=已发货   -->
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style="color:green">已发货</span>
          <span v-else>待发货</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
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
      <el-row :gutter="20">
        <el-col :span="12">
          <h2>修改状态</h2>

          <el-form ref="dataForm" :model="details" label-position="left">
            <el-form-item label="发货状态:" prop="status">
              <!-- 0=待发货；1=已发货    -->
              <el-switch
                v-model="details.status"
                :active-value="1"
                active-text="已发货"
                :inactive-value="0"
                inactive-text="待发货"
              ></el-switch>
            </el-form-item>

            <el-form-item label="备注" prop="desc">
              <el-input class="el-inpit" type="textarea" v-model="details.desc" clearable />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <h2>客户详情</h2>

          <el-form ref="dataForm" :model="details_info" label-position="left">
            <el-form-item label="商品名称:" prop="title">
              {{details_info.title}}
            </el-form-item>
            <el-form-item label="姓名:" prop="title">
               {{details_info.name}}
            </el-form-item>
            <el-form-item label="电话:" prop="title">
               {{details_info.phone}}
            </el-form-item>
            <el-form-item label="地址:" prop="title">
               {{details_info.address}}
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-button @click="detail_visible = false">取 消</el-button>
      <el-button type="primary" @click="handle_submit()">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { GoodsGoodsOrder, GoodsSendGoods } from "@/api/score";
import Pagination from "@/components/pagination/index.vue";

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
      details_info: {},
      detail_visible: false,
      dialog_loading: false
    };
  },
  components: {
    Pagination
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
    handle_edit(row) {
      this.detail_visible = true;
      this.details = {
        status: row.status,
        desc: row.desc,
        id: row.id
      };
      this.details_info = row;
    },
    handle_submit() {
      this.dialog_loading = true;
      GoodsSendGoods(this.details)
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