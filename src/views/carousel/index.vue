<template>
  <div class="app-container">
    <div class="filter">
      <label>渠道：</label>
      <el-select
        v-model="Carousel.cid"
        placeholder="请选择"
        @change="handleChannelFilter"
      >
        <el-option
          v-for="item in options"
          :key="item.cid"
          :label="item.title"
          :value="item.cid"
        />
      </el-select>
      <div class="btn-group">
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </div>
    </div>

    <el-dialog :title="dialogType === 'create' ? '创建广告: ' : '编辑广告:'" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="Carousel"
        label-position="left"
      >
        <el-form-item label="广告名称" prop="code">
          <el-input v-model="Carousel.title" />
        </el-form-item>
        <el-form-item label="广告简介" prop="name">
          <el-input v-model="Carousel.desc" />
        </el-form-item>
        <el-form-item label="广告链接" prop="name">
          <el-input v-model="Carousel.link" />
        </el-form-item>
        <el-form-item label="广告图片" prop="img">
          <view class="pre-img">
            <image :src="Carousel.img" />
          </view>
          <Upload @uploadChange="uploadChange" />
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
      <el-table-column props="gid" align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="广告名称" width="95">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="广告简介" width="110">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="广告链接" width="210">
        <template slot-scope="scope">
          {{ scope.row.link }}
        </template>
      </el-table-column>
      <el-table-column label="广告图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt="" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="CarouselData.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getCarouselList, createCarousel, removeCarousel, getChannelList } from '@/api/table'
import Upload from '@/components/upload'
import { Carousel } from 'element-ui'
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
    Upload
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogType: 'create',
      title: '轮播图列表',
      options: [],
      Carousel: {
        title: '',
        desc: '',
        link: '',
        img: '',
        id: '',
        cid: ''
      },
      carouselParam: {
        page: 1,
        limit: 10,
        keyword: '',
        orderBy: ''
      },
      CarouselData: {
        total: 0,
        per_page: 15,
        current_page: 1,
        last_page: 1
      }
    }
  },
  created() {
    this.channelList()
  },
  methods: {
    uploadChange(val) {
      console.log('val', val)
      this.Carousel.img = val
    },
    channelList() {
      this.listLoading = true
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.options = response.data
          this.Carousel.cid = this.options[0].cid
          this.fetchData()
        }
      })
    },
    handleCurrentChange(val) {
      console.log(val)
      this.Carousel.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getCarouselList(this.carouselParam).then((response) => {
        if (response.code === 0) {
          this.list = response.data.data
          this.CarouselData = response.data
          this.listLoading = false
        }
      })
    },
    handleSubmit() {
      createCarousel(this.Carousel).then((response) => {
        console.log(response)
        this.dialogVisible = false
        this.fetchData()
        Object.assign(this.Carousel, { title: '', desc: '', link: '', img: '', id: '' })
      })
    },
    handleCreate() {
      this.dialogType = 'create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      delete row.child
      this.Carousel = row
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeCarousel({ id: row.id }).then((response) => {
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
    handleClose() {
      this.dialogVisible = false
    },
    handleChannelFilter(value) {
      this.Carousel.cid = value
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
   .btn-group {
     margin-left: 20px;
   }
  }
}
</style>
