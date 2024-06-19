<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Modal',
  data() {
    return {
      dialogVisible: false,
      title: '',
      content: ''
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
