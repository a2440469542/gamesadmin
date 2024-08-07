<template>
  <div>
    <quill-editor class="ql-editor"
        v-model="editor"
        ref="QuillEditor"
        :options="editorOption"
        @change="onEditorChange($event)"
    ></quill-editor>
    <input type="file" class="upload-demo" id="upload-demo" style="display:none" />
  </div>
</template>

<script>
import Vue from "vue"
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const titleConfig = {
  "ql-bold": "加粗" ,
  "ql-color": "颜色",
  "ql-font": "字体",
  "ql-code": "插入代码",
  "ql-italic": "斜体",
  "ql-link": "添加链接",
  "ql-background": "背景颜色",
  "ql-size": "字体大小",
  "ql-strike": "删除线",
  "ql-script": "上标/下标",
  "ql-underline": "下划线",
  "ql-blockquote": "引用",
  "ql-header": "标题",
  "ql-indent": "缩进",
  "ql-list": "列表",
  "ql-align": "文本对齐",
  "ql-direction": "文本方向",
  "ql-code-block": "代码块",
  "ql-formula": "公式",
  "ql-image": "图片",
  "ql-video": "视频",
  "ql-clean": "清除字体样式",
  "ql-upload": "文件"
};
export default {
  props:{
    content:{}
  },
  data(){
    return{
      editor:"",
      editorOption: {
        placeholder: '请输入内容',
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                    ['blockquote', 'code-block'],     //引用，代码块
                    [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                    [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                    [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                    [{ 'direction': 'rtl' }],             // 文本方向
                    [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                    [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                    [{ 'font': [] }],     //字体
                    [{ 'align': [] }],    //对齐方式
                    ['clean'],    //清除字体样式
                    // ['image']    //上传图片
                    // ['image','video','link']    //上传图片、上传视频、上传文件
                ],
                handlers: {
                    'image': function (value) {
                        if (value) {
                            // 调用iview图片上传
                            document.querySelector('#upload-demo').click()
                        } else {
                            this.quill.format('image', false);
                        }
                    }
                }
            }
        }
      },
    }
  },
  watch:{
    content(val){
      this.editor = val
    }
  },
  mounted(){
    // 富文本提示信息
    this.$nextTick(() => {
      const oToolBar = document.getElementsByClassName('ql-editor')[0];
      const aButton = oToolBar.querySelectorAll('button');
      const aSelect = oToolBar.querySelectorAll('select');
      aButton.forEach(function(item){
          if(item.className === 'ql-script'){
              item.value === 'sub' ? item.title = '下标': item.title = '上标';
          }else if(item.className === 'ql-indent'){
              item.value === '+1' ? item.title ='向右缩进': item.title ='向左缩进';
          }else{
              item.title = titleConfig[item.classList[0]];
          }
      });
      aSelect.forEach(function(item){
          item.parentNode.title = titleConfig[item.classList[0]];
      });

      this.editor = this.content
    })
  },
  methods:{
    onEditorChange(e){
      console.log(e, '内容改变事件');
      this.$emit("changeIntro",e)
    },
  }
}
</script>
<style scoped lang="scss">
::v-deep .ql-container.ql-snow{
  height: 200px;
}

::v-deep .ql-editor{
  padding: 12px 15px;
}
::v-deep .quill-editor.ql-editor{
  margin-top: -10px;
}
</style>
