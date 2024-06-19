<template>
  <div>
    <el-upload
      ref="upload"
      :action="uploadUrl"
      :multiple="true"
      :auto-upload="true"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
    >
      <el-button slot="trigger">选取文件</el-button>
      <!-- <el-button @click="submitUpload">开始上传</el-button> -->
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="previewImage" alt="Preview Image">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [], // 存储文件列表
      dialogVisible: false, // 控制预览对话框的显示
      previewImage: '', // 预览图片的URL
      uploadUrl: process.env.VUE_APP_BASE_API + '/admin/Upload/uploader' // 修改为你的实际上传接口
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // 处理文件移除逻辑
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      console.log('file', file, 'fileList', fileList)
      // 处理文件状态改变，比如更新文件列表
      this.fileList = fileList
      if (file.status === 'success') {
        this.previewImage = file.response.data.img
        this.$emit('uploadChange', this.previewImage)
      }
    },
    handleExceed(files, fileList) {
      // 处理超过文件上传限制
      this.$message.warning(`当前限制选择 ${files.length} 个文件，已选择 ${files.length + fileList.length} 个文件`)
    },
    beforeUpload(file) {
      // 在这里可以对文件进行校验，如大小、类型等
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt500KB = file.size / 1024 < 500

      if (!isJPGorPNG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt500KB) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isJPGorPNG && isLt500KB
    },
    submitUpload() {
      // 手动上传逻辑
      this.$refs.upload.submit()
    }
  }
}
</script>
