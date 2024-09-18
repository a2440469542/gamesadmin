<template>
  <div class="app-container channel-page">
    <div class="btn-group">
      <div class="search">
        <el-button class="filter-item" type="primary" @click="handleCreate">创建渠道</el-button>

        <el-button class="filter-item filter-right" @click="export_channel">渠道数据统计-导出</el-button>


        <label>渠道名称:</label>
        <el-input placeholder="渠道名称" v-model="searchCondition.name" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchChannel">搜索</el-button>


      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="channel"
        label-position="left"
        label-width="170px"
        style="width: 100%;"
      >
        <el-form-item label="渠道名称" prop="name">
          <el-input v-model="channel.name" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <Upload @uploadChange="uploadChangeIcon" />
        </el-form-item>
        <el-form-item label="网站名称" prop="title">
          <el-input v-model="channel.title" />
        </el-form-item>
        <el-form-item label="网站介绍" prop="desc">
          <el-input v-model="channel.desc" />
        </el-form-item>
        <el-form-item label="网站logo" prop="logo">
          <Upload @uploadChange="uploadChange" />
        </el-form-item>
        <el-form-item label="网站主题" prop="url">
          <el-select v-model="channel.tema" placeholder="请选择">
            <el-option
              v-for="item in themeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="channel.url" />
        </el-form-item>
        <el-form-item label="最低充值" prop="min_recharge">
          <el-input v-model="channel.min_recharge" />
        </el-form-item>
        <el-form-item label="最低提款" prop="min_draw">
          <el-input v-model="channel.min_draw" />
        </el-form-item>
        <el-form-item label="充提投注倍数" prop="ct_multiple">
          <el-input v-model="channel.ct_multiple" />
        </el-form-item>
        <el-form-item label="允许重复PIX" prop="re_pix">
          <!-- 0=不允许；1=允许 -->
          <el-switch
  v-model="channel.re_pix"
:active-value="1"
:inactive-value="0"
  active-text="允许"
  inactive-text="不允许">
</el-switch>
        </el-form-item>
        <el-form-item :label="`${item.name}平台`" prop="pg_id" v-for="(item, index) in pgOptions" :key="index">
          <el-select placeholder="线路选择" v-model="selectedOptions[index]" @change="changeRoute(index)">
            <el-option
              v-for="option in item.line"
              :key="option.lid"
              :label="option.title"
              :value="option.lid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务地址" prop="service_path">
          <el-input v-model="channel.service_path" />
        </el-form-item>
        <el-form-item label="Telegram" prop="tg_path">
          <el-input v-model="channel.tg_path" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
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
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="前端图标" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
       <el-table-column label="允许重复PIX" width="100" align="re_pix">
        <template slot-scope="scope">
          {{ scope.row.re_pix ? "允许" : "不允许" }}
        </template>
      </el-table-column>
      <el-table-column label="网站名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站介绍" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站logo" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column label="网站地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网站主题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tema }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="380" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="handleChargeConfig(scope.$index, scope.row)"
          >充值配置</el-button>
          <el-button
            size="mini"
            @click="handleBoxConfig(scope.$index, scope.row)"
          >宝箱配置</el-button>
          <el-button
            size="mini"
            @click="handleWagesConfig(scope.$index, scope.row)"
          >工资配置</el-button>
            <el-button
            size="mini"
            @click="openActivity(scope.$index, scope.row)"
          >活动配置</el-button>
          <el-button
            size="mini"
            @click="openStat(scope.$index, scope.row)"
          >统计</el-button>
          <el-button
            size="mini"
            type="danger"
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
    <el-dialog title="渠道充值金额配置" :visible.sync="isShowRecharge">
      <div>
        <el-button @click="addRecharge(0, {})">添加</el-button>
      </div>
      <div v-if="!isCreate">
        <el-table :data="rechargeLsit">
          <el-table-column property="date" label="ID" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column property="date" label="渠道ID" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cid }}</span>
            </template>
          </el-table-column>
          <el-table-column property="name" label="充值金额" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.money }}</span>
            </template>
          </el-table-column>
          <el-table-column property="address" label="赠送金额" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.gifts }}</span>
            </template>
          </el-table-column>
          <el-table-column property="multiple" label="赠送金额投注倍数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.multiple }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="addRecharge(1, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleChargeDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-form :model="addChargeParam">
          <el-form-item label="渠道ID" :label-width="rechargeFormLabelWidth">
            <el-input v-model="addChargeParam.cid" readonly autocomplete="off" />
          </el-form-item>
          <el-form-item label="充值金额" :label-width="rechargeFormLabelWidth">
            <el-input v-model="addChargeParam.money" autocomplete="off" />
          </el-form-item>
          <el-form-item label="赠送金额" :label-width="rechargeFormLabelWidth">
            <el-input v-model="addChargeParam.gifts" autocomplete="off" />
          </el-form-item>
          <el-form-item label="赠送金额投注倍数" :label-width="rechargeFormLabelWidth">
            <el-input v-model="addChargeParam.multiple" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isCreate = false">取 消</el-button>
          <el-button type="primary" @click="submitCreate">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="宝箱配置" :visible.sync="isShowBox">
      <div class="row-amount">
        <div class="cell-item">
          <label>累计充值（以上）</label>
          <el-input v-model="channelBoxParam.cz_money" class="cell-item-input" autocomplete="off" />
        </div>
        <div class="cell-item">
          <label>累计投注（以上）</label>
          <el-input v-model="channelBoxParam.bet_money" class="cell-item-input" autocomplete="off" />
        </div>
      </div>
      <div>
        <div class="header-row">
          <!-- 顶部四栏 -->
          <div class="header-cell">有效玩家人数</div>
          <div class="header-cell">奖金</div>
          <!-- <div class="header-cell">显示图标</div> -->
          <div class="header-cell">操作</div>
        </div>
        <div class="content">
          <div v-for="(item, index) in items" :key="index" class="row">
            <el-input v-model="item.user_num" class="row-item" placeholder="请输入有效玩家人数" />
            <el-input v-model="item.money" class="row-item" placeholder="请输入奖金" />
            <!-- <el-select v-model="item.icon" class="row-item" placeholder="请选择图标">
              <el-option label="图标1" value="icon1" />
              <el-option label="图标2" value="icon2" />
            </el-select> -->
            <el-button class="row-item" @click="removeItem(index)">删除</el-button>
          </div>
        </div>
        <!-- 添加按钮 -->
        <el-button type="primary" @click="addItem">添加</el-button>
        <!-- 提交按钮 -->
        <el-button type="primary" @click="submitBox">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="工资配置" :visible.sync="isShowWages">
      <div class="add-wages">
        <el-form :model="addChargeParam">
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-select v-model="wagesParam.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="wagesParam.type === 1" label="平均值" :label-width="formLabelWidth">
            <el-input v-model="wagesParam.ave_value" autocomplete="off" />
          </el-form-item>
          <el-form-item label="充值人数" :label-width="formLabelWidth">
            <el-input v-model="wagesParam.cz_num" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="wagesParam.type === 1" label="博主工资" :label-width="formLabelWidth">
            <el-input v-model="wagesParam.bozhu" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="wagesParam.type === 1" label="代理工资" :label-width="formLabelWidth">
            <el-input v-model="wagesParam.daili" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="wagesParam.type === 2" label="博主比例配置" :label-width="formLabelWidth">
            <el-input v-model="wagesParam.bozhu" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="wagesParam.type === 2" label="代理比例配置" :label-width="formLabelWidth">
            <el-input v-model="wagesParam.daili" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="wagesParam.type === 2 ? 'N3代理比例' : 'N3代理工资'" :label-width="formLabelWidth">
            <el-input v-model="wagesParam.n3" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowWages = false">取 消</el-button>
          <el-button type="primary" @click="submitWages">更新</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="渠道统计" :visible.sync="isShowSta">
      <div class="statics">
        <div class="statics-list">
          <div class="statics-item">
            <div class="statics-item-title">注册人数:</div>
            <div class="statics-item-content">{{ channelSta.reg_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">充值人数:</div>
            <div class="statics-item-content">{{ channelSta.cz_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">总充值金额:</div>
            <div class="statics-item-content">{{ channelSta.cz_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">总投注金额:</div>
            <div class="statics-item-content">{{ channelSta.bet_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">总提现金额:</div>
            <div class="statics-item-content">{{ channelSta.cash_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">宝箱领取人数:</div>
            <div class="statics-item-content">{{ channelSta.box_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">代理工资领取人数:</div>
            <div class="statics-item-content">{{ channelSta.daili_wages_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">代理工资领取总额:</div>
            <div class="statics-item-content">{{ channelSta.daili_wages_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">博主工资领取人数:</div>
            <div class="statics-item-content">{{ channelSta.bozhu_wages_num }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">博主工资领取总额:</div>
            <div class="statics-item-content">{{ channelSta.bozhu_wages_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">平台用户的余额:</div>
            <div class="statics-item-content">{{ channelSta.user_money }}</div>
          </div>
          <div class="statics-item">
            <div class="statics-item-title">宝箱领取金额:</div>
            <div class="statics-item-content">{{ channelSta.box_money }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="渠道活动配置" width="600px" :visible.sync="isShowActivity">
        <el-row :gutter="20">
          <el-col :span="12">
             <div>
                <h4>活动名称</h4>
                <ul>
                  <li>排行榜活动</li>
                </ul>
              </div>
          </el-col>
          <el-col :span="12">
           <el-row :gutter="20">
             <el-col :span="12">
               <h4>选择配置</h4>
             </el-col>
             <el-col :span="12">
                <el-button
                  size="mini"
                 type="primary"
                  @click="handle_edit_activity()"
                >修改</el-button>
             </el-col>


           </el-row>
             <el-select width="260px" v-model="channelActivity.activity" placeholder="请选择">
              <el-option
                v-for="item in activityInfo"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getChannelList,
  createChannel,
  removeChannel,
  getRechargeConfigList,
  createRechargeConfigList,
  removeRechargeConfigList,
  getBoxConfigList,
  createBoxConfigList,
  getPGRouteList,
  wagesConfig,
  addWagesConfig,
  channelUserStat,
  routeList
} from '@/api/table'
import {
  getActivityList,
  channelSetActivity,
} from "@/api/activity";
import {
  channelExport,
} from "@/api/channel";
import Upload from '@/components/upload'
import Pagination from '@/components/pagination/index.vue'
import { JSONToExcelConvertor } from "@/utils/excel.js"

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
    Upload,
    Pagination
  },
  data() {
    return {
      list: [],
      searchCondition: {
        page: 1,
        limit: 20,
        name: ''
      },
      pageData: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      },
      selectedOptions: [], // 存储每个select框当前选中的值
      listLoading: true,
      dialogVisible: false,
      title: 'Create',
      isShowWages: false,
      isAddWages: true,
      isShowSta: false,
      themeOptions: [
        {
          value: 'theme1',
          label: '主题1'
        },
        {
          value: 'theme2',
          label: '主题2'
        },
        {
          value: 'theme3',
          label: '主题3'
        },
        {
          value: 'green',
          label: '绿色'
        },
        {
          value: 'green2',
          label: '绿色2'
        },
        {
          value: 'purple',
          label: '紫色'
        },
        // {
        //   value: 'purple2',
        //   label: '紫色2'
        // },
        // {
        //   value: 'dark',
        //   label: '暗色'
        // },
        {
          value: 'dark2',
          label: '暗色2'
        },
        {
          value: 'cyanBlue',
          label: '深青蓝'
        },
        {
          value: 'aquaGreen',
          label: '水绿色'
        },
        {
          value: 'darkPurple',
          label: '暗紫'
        },
        {
          value: 'darkGreen',
          label: '暗绿'
        },
        {
          value: 'brown',
          label: '褐色'
        },
        {
          value: 'darkBrown',
          label: '深褐色'
        },
        {
          value: 'black',
          label: '黑色'
        },
        {
          value: 'bluePurple',
          label: '蓝紫色'
        },
        {
          value: 'darkGreenPurple',
          label: '深绿紫'
        }
      ],
      options: [
        {
          value: 1,
          label: '平均充值'
        },
        {
          value: 2,
          label: '充值比例'
        }
      ],
      channel: {
        cid: '',
        name: '',
        icon: '',
        title: '',
        desc: '',
        logo: '',
        url: '',
        min_recharge: '',
        min_draw: '',
        ct_multiple: '',
        cz_money: '',
        bet_money: '',
        pg_id: '',
        tema: '',
        plate_line: null,
        service_path: '',
        tg_path: ''
      },
      isShowRecharge: false,
      isCreate: false,
      rechargeLsit: [],
      cid: '',
      addChargeParam: {
        cid: '',
        money: '',
        gifts: '',
        multiple: '',
        id: ''
      },
      formLabelWidth: '120px',
      rechargeFormLabelWidth: '140px',
      items: [
        {
          user_num: '',
          money: '',
          icon: ''
        }
      ],
      isShowBox: false,
      channelBoxParam: {
        cid: '',
        cz_money: '',
        bet_money: ''
      },
      pgOptions: [],
      wagesList: [],
      wagesParam: {
        id: '',
        cid: '',
        type: 1,
        ave_value: '',
        cz_num: '',
        bozhu: '',
        daili: ''
      },
      channelSta: {},
      routeList: [],
      isShowActivity:false,
      activityInfo:[],
      channelActivity: {},
      activity_name:'',
    }
  },
  created() {
    this.fetchData()
    this.loadPGRoutes()
    this.get_activity_list()
  },
  methods: {

    changeRoute(index) {
      // 当选择发生变化时，更新resultObject
      const selectedItem = this.selectedOptions[index]
      if (selectedItem) {
        this.channel.plate_line[this.pgOptions[index].id] = selectedItem
      } else {
        delete this.resultObject[this.pgOptions[index].id] // 如果未选择任何项，则删除对应的key
      }
      console.log(this.channel.plate_line)
    },
    async loadingRouteList(pid) {
      const res = await routeList({ pid: pid })
      console.log(res)
      if (res.code === 0) {
        this.routeList = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    openStat(index, row) {
      channelUserStat({ cid: row.cid }).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.isShowSta = true
          this.channelSta = response.data
        }
      })
    },

    openActivity(index,row) {
      this.isShowActivity = true
       this.activity_name = ''
      this.channelActivity = {
        activity: row.activity?.rank || '',
        cid: row.cid
      }
      if(row.activity?.rank){
        this.activity_name = this.activityInfo.find(item => item.id == row.activity.rank ).name || ""
      }
    },
    get_activity_list (){
      getActivityList({ page: 1,limit: 200 }).then((response) => {
        let activity_list = [] 
        if (response.code == 0) {
          activity_list = response.data.data
        }
        activity_list.unshift({id:0,name:"不开启"})
        this.activityInfo = activity_list
      })
    },
    loadPGRoutes() {
      getPGRouteList().then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.pgOptions = response.data
        }
      })
    },
    uploadChange(val) {
      console.log('val', val)
      this.channel.logo = val
    },
    uploadChangeIcon(val) {
      console.log('val', val)
      this.channel.icon = val
    },
    addItem() {
      // 添加新行
      this.items.push({ user_num: '', money: '' })
    },
    removeItem(index) {
      // 删除当前行
      this.items.splice(index, 1)
    },
    submitBox() {
      // 提交数据，这里可以根据需要处理数据，如发送到服务器
      console.log('提交的数据:', this.items)
      const param = {
        cid: this.cid,
        box: this.items,
        cz_money: this.channelBoxParam.cz_money,
        bet_money: this.channelBoxParam.bet_money
      }
      createBoxConfigList(param).then((response) => {
        this.isShowBox = false
        this.$message.success(response.msg)
      })
    },
    fetchData() {
      this.listLoading = true
      getChannelList(this.searchCondition).then((response) => {
        if (response.code === 0) {
          this.pageData = response.data
          this.list = response.data.data || []
          this.listLoading = false
        }
      })
    },
    handleCurrentChange(val) {
      console.log(val)
      this.searchCondition.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchCondition.limit = val
      this.fetchData()
    },
    searchChannel() {
       this.searchCondition.page = 1
      this.fetchData()
    },
    async handleSubmit() {
      const res = await createChannel(this.channel)
      if (res.code === 0) {
        this.dialogVisible = false
        this.fetchData()
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    handleCreate() {
      this.channel = {
        cid: '',
        name: '',
        icon: '',
        title: '',
        desc: '',
        logo: '',
        url: '',
        min_recharge: '',
        min_draw: '',
        ct_multiple: '',
        cz_money: '',
        bet_money: '',
        pg_id: '',
        tema: '',
        plate_line: null,
        service_path: '',
        tg_path: ''
      }
      this.title = '创建渠道'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      // console.log("row", row, this.selectedOptions)
      this.selectedOptions = []
      delete row.child
      if (row.plate_line) {
        for (const i in row.plate_line) {
          this.selectedOptions = [...this.selectedOptions, row.plate_line[i]]
        }
      } else {
        row.plate_line = {}
      }
      this.channel = row
      this.title = '编辑渠道'
      this.dialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeChannel({ cid: row.cid }).then((response) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleChargeDelete(index, row) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeRechargeConfigList({ id: row.id }).then((response) => {
          this.getRechargeConfigList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleChargeConfig(index, row) {
      this.cid = row.cid
      this.getRechargeConfigList()
    },
    getRechargeConfigList() {
      getRechargeConfigList({ cid: this.cid }).then((response) => {
        if (response.code === 0) {
          this.isCreate = false
          this.isShowRecharge = true
          this.rechargeLsit = response.data || []
        }
      })
    },
    addRecharge(index, row) {
      if (index === 0) {
        this.addChargeParam = {
          cid: this.cid,
          money: '',
          gifts: '',
          multiple: ''
        }
      } else {
        this.addChargeParam = {
          cid: row.cid,
          money: row.money,
          gifts: row.gifts,
          multiple: row.multiple,
          id: row.id
        }
      }
      this.isCreate = true
    },
    submitCreate() {
      createRechargeConfigList(this.addChargeParam).then((response) => {
        console.log(response)
        this.isCreate = false
        let msg = ''
        if (this.addChargeParam.id !== '') {
          msg = '修改成功!'
        } else {
          msg = '添加成功!'
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getRechargeConfigList()
      })
    },
    getBoxConfigList() {
      getBoxConfigList({ cid: this.cid }).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.isShowBox = true
          this.items = response.data.box
          this.channelBoxParam.cz_money = response.data.cz_money
          this.channelBoxParam.bet_money = response.data.bet_money
        }
      })
    },
    handleBoxConfig(index, row) {
      this.cid = row.cid
      this.getBoxConfigList()
    },
    addWagesBtn() {
      this.isAddWages = false
      delete this.wagesParam.id
    },
    editWages(index, row) {
      this.wagesParam = Object.assign({}, row)
    },
    handleWagesConfig(index, row) {
      this.cid = row.cid
      this.loadWagesConfig()
    },
    loadWagesConfig() {
      wagesConfig({ cid: this.cid }).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.isShowWages = true
          if (response.data.length === 0) {
            return
          }
          this.wagesParam = Object.assign({}, response.data)
        }
      })
    },
    submitWages() {
      this.wagesParam.cid = this.cid
      addWagesConfig(this.wagesParam).then((response) => {
        console.log(response)
        if (response.code === 0) {
          this.isAddWages = true
          this.isShowWages = false
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        }
      })
    },
    handle_edit_activity(){
      channelSetActivity({cid: this.channelActivity.cid,rank: this.channelActivity.activity}).then(res=>{
        if(res.code == 0){
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.isShowActivity = false
          this.fetchData()
        }else{
           this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    // 数据导出
    export_channel () {
      this.$message({
            type: 'waring',
            message: '正在导出!'
          })
      channelExport({}).then((response) => {
        console.log(response)
        if (response.code === 0) {
          const title = [
            "渠道ID",
            "渠道名称",
            "添加时间",
            "PG平台",
            "JILI平台",
            "PP游戏",
            "注册人数",
            "平台用户的余额",
            "充值人数",
            "总充值金额",
            "总投注金额",
            "总提现金额",
            "宝箱领取金额",
            "宝箱领取人数",
            "代理工资领取人数",
            "代理工资领取总额",
            "博主工资领取人数",
            "博主工资领取总额",
          ]

          const date = new Date()

          const ye_time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`
          const ho_time = `${date.getHours() < 10 ? '0'+date.getHours():date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}:${date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds()}`

          JSONToExcelConvertor(response.data,`渠道数据统计${ye_time} ${ho_time}`,title,false)
          this.$message({
            type: 'success',
            message: '导出成功!'
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
h4{
  margin: 4px 0;
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
      width: 90%;
      display: flex;
      align-items: center;
      .filter-item {
        margin-right: 20px;
        margin-bottom: 0px;
      }
      .check {
        margin-left: 20px;
      }
      label {
        width: 80px;
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
.filter-right{
  float: right;
}
</style>
