<template>
  <div class="app-container">
    <div class="filter">
      <div class="mobile-filter">
        <label>用户手机号:</label>
        <el-input v-model="gameParam.mobile" placeholder="用户手机号" style="width: 200px;" class="filter-item" />
        <label>邀请码:</label>
        <el-input v-model="gameParam.inv_code" placeholder="邀请码" style="width: 200px;" class="filter-item" />
        <label>平台ID:</label>
        <el-input v-model="gameParam.pid" placeholder="平台ID" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <ChannelSelect v-model="gameParam.cid" class="filter-item" @change="handleChannelFilter">
        </ChannelSelect>
<!--        <el-select-->
<!--          v-model="gameParam.cid"-->
<!--          placeholder="请选择"-->
<!--          @change="handleChannelFilter"-->
<!--          filterable-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in options"-->
<!--            :key="item.cid"-->
<!--            :label="item.title"-->
<!--            :value="item.cid"-->
<!--          />-->
<!--        </el-select>-->
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
      <el-table-column props="id" align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="渠道ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.pid }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" width="90">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请码" width="110">
        <template slot-scope="scope">
          {{ scope.row.inv_code }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="游戏ID" width="90" align="center">
        <template slot-scope="scope">
          {{ scope.row.gid }}
        </template>
      </el-table-column>
      <el-table-column label="游戏名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="账变关联ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.bid }}
        </template>
      </el-table-column>
      <el-table-column label="输赢" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.win_lose }}
        </template>
      </el-table-column>
      <el-table-column label="三方平台游戏ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.game_id }}
        </template>
      </el-table-column>
      <el-table-column label="游戏记录流水号" align="center">
        <template slot-scope="scope">
          {{ scope.row.term }}
        </template>
      </el-table-column>
      <el-table-column label="本局下注额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.bet }}
        </template>
      </el-table-column>
      <el-table-column label="本局得分" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.award }}
        </template>
      </el-table-column>
      <el-table-column label="下注时间" width="110" align="center">
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
import { gameLog } from '@/api/table'
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
  components: { ChannelSelect, Pagination },
  data() {
    return {
      list: [],
      listLoading: true,
      dialogVisible: false,
      title: '游戏记录',
      options: [],
      gameData: {
        total: 0
      },
      gameParam: {
        page: 1,
        limit: 10,
        cid: '',
        pid: '',
        mobile: '',
        inv_code: ''
      }
    }
  },
  created() {
    // this.channelList()
  },
  methods: {
    // 状态 状态：1=支付中;2=支付成功;3=支付失败
    setStatus(val) {
      const statusMap = {
        '1': '支付中',
        '2': '支付成功',
        '3': '支付失败'
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
    //       this.gameParam.cid = this.options[0].cid
    //       this.fetchData()
    //     }
    //   })
    // },
    fetchData() {
      this.listLoading = true
      gameLog(this.gameParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.gameData = response.data
          this.listLoading = false
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
      console.log(val)
      this.gameParam.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.gameParam.limit = val
      this.fetchData()
    },
    handleSubmit() {}
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
