<template>
  <div id="divcontent">
    <div id="divleft">
      <ckeditor :editor="editor" v-model="editorData" @input="onEditorInput" :config="editorConfig"></ckeditor>
    </div>
    <!-- <div id="divright">
      {{ editorData }}
    </div> -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ClassicEditor from 'hyy-ckeditor5'

const emit = defineEmits(['input'])
const props = defineProps({
  data: {
    type: String,
    default: ''
  }
})

const editorData = ref('请输入文章标题')
const editor = ClassicEditor
const upload = require('../../assets/upload.js')
const editorConfig = {
  height: '5000px',
  language: 'zh-cn',
  heading: false, // 去掉标题选项
  fontSize: {
    options: [8, 10, 'default', 14, 16, 18, 20, 22, 24, 26, 28, 32, 48]
  },
  fontFamily: {
    options: ['宋体', '仿宋', '微软雅黑', '黑体', '仿宋_GB2312', '楷体', '隶书', '幼圆']
  },
  image: {
    resizeUnit: 'px',
    resizeOptions: [
      {
        name: 'resizeImage:original',
        label: 'Original',
        value: null
      },
      {
        name: 'resizeImage:100',
        label: '100px',
        value: '100'
      },
      {
        name: 'resizeImage:200',
        label: '200px',
        value: '200'
      }
    ],
    toolbar: ['resizeImage']
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties']
  },
  toolbar: {
    items: [
      'heading',
      // 'style',
      '|',
      'codeBlock',
      'htmlEmbed',
      'code',
      '|',
      'alignment',
      'bold',
      'italic',
      'link',
      'horizontalLine',
      'bulletedList',
      'numberedList',
      'underline',
      'fontFamily',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      'findAndReplace',
      'highlight',
      'removeFormat',
      'selectAll',
      '|',
      'outdent',
      'indent',
      '|',
      // 'imageUpload',
      'imageInsert',
      'imageResize',
      'blockQuote',
      'insertTable',
      // 'mediaEmbed',
      'undo',
      'redo',
      '|',
      'superscript',
      'subscript',
      'restrictedEditingException',
      'strikethrough',
      'specialCharacters',
      'pageBreak'
    ]
  },
  extraPlugins: [upload.MyCustomUploadAdapterPlugin, upload.MyUploadAdapter]
}

watch(
  () => props.data,
  val => {
    editorData.value = val
  }
)

const onEditorInput = val => {
  emit('input', val)
}
</script>

<style lang="scss" scoped>
#divcontent {
  width: 80vw; /* 父容器的80% */
  height: 80vh; /* 父容器的80% */
}

#divleft {
  width: 100%;
  height: 100%;
}
:deep(.ck.ck-content .image) {
  position: relative;
}
:deep(.ck.ck-content .image img) {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
:deep(.ck.ck-content .image::before) {
  content: '';
  padding-top: 100%;
  display: block;
}

:deep(.ck-restricted-editing_mode_standard) {
  height: 77vh;
}

:deep(.ck-restricted-editing_mode_standard) {
  padding: 0 2%;
}
</style>
