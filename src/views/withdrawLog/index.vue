<template>
  <div class="app-container">
    <div class="filter">
      <div class="mobile-filter">
        <label>用户手机号:</label>
        <el-input v-model="withdrawParam.mobile" clearable placeholder="用户手机号" style="width: 160px;" class="filter-item" />
        <label>订单号:</label>
        <el-input v-model="withdrawParam.order_sn" clearableplaceholder="订单号" style="width: 200px;" class="filter-item" />
        <label>邀请码:</label>
        <el-input v-model="withdrawParam.inv_code" clearable placeholder="邀请码" style="width: 160px;" class="filter-item" />
         <label>提款账号:</label>
        <el-input v-model="withdrawParam.pix" clearable placeholder="提款账号(银行卡)" style="width: 160px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <ChannelSelect v-model="withdrawParam.cid" @change="handleChannelFilter" from="withdrawLog">
        </ChannelSelect>
       <el-select
         v-model="withdrawParam.status"
         placeholder="请选择提现状态"
         style="margin-left:10px"
         @change="handleStatusFilter"
         filterable
       >
         <el-option
           v-for="item in options"
           :key="item.value"
           :label="item.label"
           :value="item.value"
         />
       </el-select>
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
      <el-table-column props="id" align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="渠道ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
       <el-table-column align="center" label="渠道名称" width="195">
        <template slot-scope="scope">
          {{ scope.row.cname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID" width="110">
        <template slot-scope="scope">
         <span class="btn-span" @click="check_user_param(scope.row)" > {{ scope.row.uid }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请码" width="110">
        <template slot-scope="scope">
          {{ scope.row.inv_code }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_sn }}
        </template>
      </el-table-column>
      <el-table-column label="三方平台订单号" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderno }}
        </template>
      </el-table-column>
      <el-table-column label="提现类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 'CPF' ? 'CPF' : '手机号' }}
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" align="center">
        <template slot-scope="scope">
          {{ scope.row.pix }}
        </template>
      </el-table-column>
      <el-table-column label="提款人姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="提现时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.update_time }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ setStatus(scope.row.status) }}
           <el-button type="danger" size="mini" v-if="scope.row.status == 0" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="withdrawData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />

      <el-dialog
      :title="'审核提现'"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataForm"
        :model="detail_data"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="状态" prop="status">
           <el-switch v-model="detail_data.status" :active-value="1" active-text="通过"  inactive-text="拒绝"  :inactive-value="-1" />
        </el-form-item>
         <el-form-item label="备注" prop="desc">
            <el-input v-model="detail_data.desc" />
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
import { withdrawLog } from '@/api/table'
import { api_cash_examine } from "@/api/user"
import Pagination from '@/components/pagination/index.vue'
import ChannelSelect from '@/views/channel/channelSelect'
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
  components: {ChannelSelect, Pagination },
  data() {
    return {
      list: [],
      listLoading: true,
      dialogVisible: false,
      title: '充值记录',
      // 状态：0=待审核；1=审核通过；-1=拒绝提现；2=提现成功；-2=提现失败  
      options: [
        {
          value:'',
          label:"所有"
        },
        {
          value:0,
          label:"待审核"
        },
         {
          value:1,
          label:"审核通过"
        },
         {
          value:-1,
          label:"拒绝提现"
        }, {
          value:2,
          label:"提现成功"
        }, {
          value:-2,
          label:"提现失败"
        }
      ],
      withdrawData: {
        total: 0
      },
      withdrawParam: {
        page: 1,
        limit: 10,
        cid: '',
        mobile: '',
        order_sn: '',
        inv_code: '',
        status: 0
      },
      detail_data:{}
    }
  },
  created() {
    // this.channelList()
  },
  methods: {
    // 状态 状态：0=待审核；1=审核通过；-1=拒绝提现；2=提现成功；-2=提现失败
    setStatus(val) {
      const statusMap = {
        '0': '待审核',
        '1': '审核通过',
        '-1': '拒绝提现',
        '2': '提现成功',
        '-2': '提现失败'
      }
      return statusMap[val]
    },
    uploadChange(val) {
      console.log('val', val)
      this.game.img = val
    },
    // channelList() {
    //   this.listLoading = true
    //   getChannelList().then((response) => {
    //     if (response.code === 0) {
    //       this.options = response.data.data
    //       this.withdrawParam.cid = this.options[0].cid
    //       this.fetchData()
    //     }
    //   })
    // },
    fetchData() {
      this.listLoading = true
      withdrawLog(this.withdrawParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.withdrawData = response.data
         
        }
      }).finally(()=>{
         this.listLoading = false
      })
    },
    handleFilter() {
      this.withdrawParam.page = 1
      this.fetchData()
    },
    handleChannelFilter(value) {
      this.withdrawParam.page = 1
      this.withdrawParam.cid = value
      this.fetchData()
    },
     handleStatusFilter(value) {
      this.withdrawParam.page = 1
      this.withdrawParam.status = value
      this.fetchData()
    },

    handleCurrentChange(val) {
      console.log(val)
      this.withdrawParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.withdrawParam.limit = val
      this.fetchData()
    },
    handleSubmit() {
      const parmas = {
        id:this.detail_data.id,
        cid: this.detail_data.cid,
        status: this.detail_data.status,
        desc: this.detail_data.desc,
      }
      api_cash_examine(parmas).then(response => {
        if (response.code === 0) {
          this.dialogVisible = false;
          this.fetchData();
          this.$message({
            type: "success",
            message: "成功!"
          });
        }
      });
    },
    check_user_param(row){
      this.$router.push(`/user/index?uid=${row.uid}&cid=${row.cid}`)
    },
     handleEdit(index, val) {
      this.dialogVisible = true;
      this.dialogTitle = "";
      this.detail_data = Object.assign({},val)
    },
     handleClose() {
      this.dialogVisible = false;
      this.detail_data = {};
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
    .mobile-filter {
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
}
</style>
