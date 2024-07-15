<template>
  <div class="app-container">
    <div class="filter">
      <div class="mobile-filter">
        <label>渠道：</label>
        <el-select
          v-model="gameParam.cid"
          class="filter-item"
          placeholder="请选择"
          filterable
          @change="handleChannelFilter"
          style="width: 150px;"
          >
          <el-option
            v-for="item in options"
            :key="item.cid"
            :label="item.title"
            :value="item.cid"
          />
        </el-select>
        <label>pix手机号:</label>
        <el-input v-model="gameParam.mobile" placeholder="pix手机号" style="width: 150px;" class="filter-item" />
        <label>用户邀请码:</label>
        <el-input v-model="gameParam.inv_code" placeholder="用户邀请码" style="width: 150px;" class="filter-item" />
        <label>用户手机号:</label>
        <el-input v-model="gameParam.phone" placeholder="用户手机号" style="width: 150px;" class="filter-item" />
        <label>银行账号:</label>
        <el-input v-model="gameParam.pix" placeholder="银行账号" style="width: 150px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
      <el-table-column props="id" align="center" label="ID" >
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="渠道ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 'CPF' ? 'CPF' : '手机号' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="pix手机号" >
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行卡号" >
        <template slot-scope="scope">
          {{ scope.row.pix }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户手机号" >
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请码" >
        <template slot-scope="scope">
          {{ scope.row.inv_code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="绑定时间" >
        <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :layout="'total, sizes, prev, pager, next, jumper'"
      :total="gameData.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import {getBankList, getChannelList} from '@/api/table'
import Pagination from '@/components/pagination/index.vue'
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
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogVisible: false,
      title: '用户银行卡',
      options: [],
      gameData: {
        total: 0
      },
      gameParam: {
        page: 1,
        limit: 10,
        cid: '',
        mobile: '',
        inv_code: '',
        phone: '',
        pix: '',
      }
    }
  },
  created() {
    this.channelList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // console.log("黑名单", this.gameParam)
      getBankList(this.gameParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.gameData = response.data
        }
        this.listLoading = false
      })
    },
    channelList() {
      this.listLoading = true
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.options = response.data
          this.gameParam.cid = this.options[0].cid
          this.fetchData()
        }
      })
    },
    handleFilter() {
      this.fetchData()
    },
    handleChannelFilter(value) {
      this.gameParam.cid = value
      this.fetchData()
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.gameParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.gameParam.limit = val
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
    .createbutton{
      margin-right: 20px;
    }
    .mobile-filter {
      .filter-item {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
}
</style>
