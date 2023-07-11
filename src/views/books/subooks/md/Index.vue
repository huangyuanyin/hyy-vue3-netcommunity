<template>
  <div class="md-wrap">
    <el-card>
      <template #header>
        <el-button type="danger" @click="goBack">
          返回
        </el-button>
        <div>
          <el-button type="info" disabled>保存草稿</el-button>
          <el-button
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="文章更新中，请稍后..."
            @click="saveHandle"
            >发布文章</el-button
          >
        </div>
      </template>
      <el-form :model="form" ref="formRef" :rules="formRules" size="large" label-width="100px">
        <el-form-item label="分类" prop="category" v-if="isRight === 'right' || categoryId === ''">
          <el-space>
            <el-cascader
              :options="treeData"
              v-model="form.category"
              @change="handleChange"
              :props="{ value: 'id', checkStrictly: true }"
              :show-all-levels="false"
            />
            <span style="margin-left: 30px">标签</span>
            <el-cascader :options="taglist" v-model="form.tags" :props="{ value: 'id', label: 'name' }"> </el-cascader>
          </el-space>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" show-word-limit maxlength="200" placeholder="请输入标题" type="text"></el-input>
        </el-form-item>
        <el-form-item label="文章描述" prop="description" v-if="isRight === 'right' || categoryId === ''">
          <el-input v-model="form.description" show-word-limit maxlength="200" placeholder="请输入文章描述" type="text"></el-input>
        </el-form-item>
        <el-form-item label="编辑器风格" prop="editorType">
          <el-radio-group v-model="editorType" class="ml-4" :disabled="editorDisabled">
            <el-radio label="tiny" size="large">富文本</el-radio>
            <el-radio label="Markdown" size="large">Markdown</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="word解析" v-if="editorType === 'tiny'">
          <div>
            <label for="fileInput" class="customUploadButton">上传文件</label>
            <span>{{ fileName }}</span>
          </div>
          <input type="file" accept=".docx" id="fileInput" @change="loadWord" class="uploadInput" />
        </el-form-item>
        <el-form-item label="文件解析" v-if="editorType === 'Markdown'">
          <div>
            <label for="fileInput" class="customUploadButton">上传文件</label>
            <span>{{ fileName }}</span>
          </div>
          <input type="file" accept=".docx,.md" id="fileInput" @change="loadMd" class="uploadInput" />
        </el-form-item>
        <el-form-item label="上传附件">
          <el-tag type="info">暂不支持</el-tag>
        </el-form-item>
        <el-form-item prop="body" style="height: 60vh;" v-if="editorType === 'Markdown'">
          <markdown-com style="z-index: 99999;" :data="md" @input="getMd" @fullScreen="fullScreen"></markdown-com>
        </el-form-item>
        <el-form-item prop="body" v-if="editorType === 'tiny'">
          <tinymce-com v-model="tinyValue" placeholder="请输入帖子详情内容(不少于10个字)"> </tinymce-com>
        </el-form-item>
        <!-- <el-form-item prop="body" v-if="editorType === 'tiny'">
          <CKEditor5-com :data="tinyValue" @input="CKEditorInput" />
        </el-form-item> -->
        <!-- <el-form-item>
          <v-md-editor v-model="md" height="400px"></v-md-editor>
        </el-form-item> -->
        <!-- <div>
          <markdown-com :data="md" @input="getMd"></markdown-com>
        </div> -->
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import markdown from '@/components/markdown/Index.vue'
import 'mavon-editor/dist/css/index.css'

import Tinymce from '@/components/tinymce'
// import CKEditor5 from '@/components/CKEditor5/index.vue'

import { ref, computed, reactive, watch, onMounted, onUnmounted, nextTick, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute, NavigationGuardNext } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategorysInfo, addCategorys, updateCategorys } from '@/api/category.js'
import { addForum, updateForum, getForumInfo } from '@/api/forum.js'
import { getTag } from '@/api/tag.js'
import { upload } from '@/api/common.js'
import { judgeNodeType } from '@/utils/methods.js'
import MarkdownIt from 'markdown-it'
import { uploadMdImageApi } from '@/api/upload'

export default {
  name: 'editor',
  components: {
    mavonEditor,
    'markdown-com': markdown,
    'tinymce-com': Tinymce
    // 'CKEditor5-com': CKEditor5
  },
  setup() {
    const reload = inject('reload')
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    // 是否显示分类
    const isRight = ref('')
    // 最小高度
    const minHeight = computed(() => {
      return window.innerHeight - 55 + 'px'
    })
    // 工作空间标题名
    const spaceid = ref(sessionStorage.getItem('spaceid'))
    // 节点数据
    const node = computed(() => store.getters.node)
    // 节点数据
    const treeData = ref([])
    // 标签列表
    const taglist = ref([])
    const rawData = ref('') // 原始数据
    const md = ref('') // markdown编辑器数据
    const tinyValue = ref('') // 富文本编辑器数据
    const editorType = ref('tiny')
    const editorDisabled = ref(false)
    const fileName = ref('暂无文件')
    const formRef = ref(null)
    // 路由传参
    const categoryId = ref('')
    // 表单
    const form = reactive({
      category: '',
      title: '',
      description: '',
      tags: [],
      type: '',
      body: ''
    })
    // 表单校验
    const formRules = reactive({
      category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      body: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
    })
    const fullscreenLoading = ref(false)

    // 获取节点数据
    const getNodeList = () => {
      getCategorysInfo(spaceid.value).then(res => {
        treeData.value = judgeNodeType(res.data)
      })
    }

    // 获取标签列表
    const getTagList = () => {
      getTag().then(res => {
        taglist.value = res.data
      })
    }

    // 获取帖子数据
    const getForumData = () => {
      getForumInfo(route.query.mid || route.query.tid).then(res => {
        form.title = res.data.title
        form.category = res.data.category
        form.tags = res.data.tags
        form.description = res.data.description
        tinyValue.value = res.data.body
        md.value = res.data.body
        rawData.value = res.data.body
      })
    }

    rawData.value = ''
    md.value = ''
    tinyValue.value = ''
    getNodeList()
    getTagList()
    form.category = node.value.id
    watch(
      () => route.query,
      () => {
        // 监控 文章编辑
        if (route.query.mid || route.query.tid) {
          getForumData()
        }
        if (route.query && route.query.category) {
          categoryId.value = route.query.category
          isRight.value = ''
        } else {
          categoryId.value = ''
        }
        // 监控 是否显示分类
        if (route.query && route.query.isRight) {
          isRight.value = route.query.isRight
          spaceid.value = sessionStorage.getItem('spaceid')
          getNodeList()
        } else {
          isRight.value = ''
        }
        if (route.query && route.query.isAdd) {
          md.value = ''
          form.body = ''
          formRef.value.resetFields()
          form.category = node.value.id
          editorDisabled.value = false
          editorType.value = 'tiny'
        }
        // 监控 编辑器种类与禁用
        if (route.query && route.query.typeof) {
          route.query.typeof === 'w' ? (editorType.value = 'Markdown') : (editorType.value = 'tiny')
          editorDisabled.value = true
        }
      }
    )

    onMounted(() => {
      window.addEventListener('beforeunload', beforeUnloadHandler, false)
      form.category = categoryId.value = route.query.category || ''
      isRight.value = route.query.isRight || ''
      route.query.typeof === 'w'
        ? (editorType.value = 'Markdown') && (editorDisabled.value = true)
        : (editorType.value = 'tiny') && (editorDisabled.value = true)
      rawData.value = ''
      md.value = ''
      tinyValue.value = ''
      if (route.query && route.query.isAdd) {
        editorType.value = 'tiny'
        editorDisabled.value = false
      }
      if (route.query.mid || route.query.tid) {
        getForumData()
      }
    })

    // 卸载
    onUnmounted(() => {
      window.removeEventListener('beforeunload', beforeUnloadHandler, false)
      rawData.value = ''
      tinyValue.value = ''
      md.value = ''
    })

    const beforeUnloadHandler = e => {
      e.returnValue = '离开此页面？'
    }

    const checkUnsavedContent = callback => {
      if (rawData.value !== tinyValue.value || rawData.value !== md.value) {
        ElMessageBox.confirm('有未保存的内容，确定离开？', '提示', {
          confirmButtonText: '去保存',
          cancelButtonText: '直接离开',
          type: 'warning'
        })
          .then(() => {
            // saveHandle()
            // rawData.value = ''
            // tinyValue.value = ''
            // md.value = ''
            // callback()
          })
          .catch(() => {
            rawData.value = ''
            tinyValue.value = ''
            md.value = ''
            callback()
          })
      } else {
        callback()
      }
    }

    // 使用路由守卫，在离开页面时，判断是否有未保存的内容
    router.beforeEach((to, from, next) => {
      checkUnsavedContent(() => {
        next()
      })
    })

    // 返回
    const goBack = () => {
      checkUnsavedContent(() => {
        router.go(-1)
      })
    }

    // 获取md数据
    const getMd = evt => {
      if (typeof evt == 'string') {
        form.body = evt
      }
    }

    const fullScreen = val => {
      console.log(`output->`)
    }

    // 选择分类ID
    const handleChange = id => {
      var len = id.length
      form.category = id[len - 1]
    }

    // const CKEditorInput = val => {
    //   tinyValue.value = val
    // }

    // 上传word
    const loadWord = evt => {
      const files = evt.target.files
      fileName.value = files[0].name
      if (files == null || files.length == 0) {
        alert('请至少选择一个文件！')
        return
      }
      let name = files[0].name
      let formData = new FormData()
      let header = {
        'Content-Type': 'multipart/form-data'
      }
      formData.append('file', files[0])
      editorType.value === 'Markdown' ? formData.append('type', 'md') : formData.append('type', 'html')
      upload(header, formData).then(res => {
        form.title = name
        editorType.value === 'Markdown' ? (md.value = res.data) : (tinyValue.value = res.data)
      })
    }

    // 解析md
    const loadMd = () => {
      // 本地上传md文件并解析
      const file = document.getElementById('fileInput').files[0]
      fileName.value = file.name
      console.log(`output->file`, file)
      if (file) {
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = evt => {
          md.value = evt.target.result
        }
      }
    }

    const uploadFile = async file => {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('id', route.query.mid)
      formdata.append('file', file)
      let res = await uploadMdImageApi(formdata)
      if (res.code === 1000) {
        return res.data
      }
    }

    const handleClose = () => {
      formRef.value.resetFields()
      md.value = ''
      form.body = ''
      form.category = ''
      router.push({ name: 'subbooks', params: { wRefresh: true } })
    }

    // 发布文章
    const saveHandle = () => {
      if (route.query.mid || route.query.tid) {
        updateApi()
      } else {
        addApi()
      }
    }

    // 新增文章 流程
    const addApi = () => {
      form.author = sessionStorage.getItem('username')
      judgeEditor()
      formRef.value.validate(valid => {
        if (!valid) return
        if (route.query.isRight == 'right') {
          // 判断新增的文章是否为节点 right - 否
          getSaveApi(form)
        } else {
          save()
        }
      })
    }

    // 编辑文章 流程
    const updateApi = () => {
      form.author = sessionStorage.getItem('username')
      judgeEditor()
      formRef.value.validate(valid => {
        if (!valid) return
        if (route.query && route.query.isRight == 'right') {
          // 判断编辑的文章是否为节点 right - 否
          getUpdateForumApi(route.query.mid || route.query.tid, form)
        } else {
          fullscreenLoading.value = true
          updateForum(route.query.mid || route.query.tid, form).then(res => {
            fullscreenLoading.value = false
            if (res.code === 1000) {
              getUpdateCategorysApi()
            }
            handleClose()
            reload()
            toDetail(res.data)
          })
        }
      })
    }

    // 编辑文章 API
    const getUpdateForumApi = (id, form) => {
      updateForum(id, form).then(res => {
        ElMessage({
          message: '编辑成功！',
          type: 'success'
        })
        toDetail(res.data)
        reload()
        store.commit('changeCurTreeId', Number(form.category)) // 定位
      })
    }

    // 更新节点 API
    const getUpdateCategorysApi = () => {
      const title = { name: form.title }
      updateCategorys(form.category, title).then(res => {
        store.commit('changeCurTreeId', res.data) // 定位
        ElMessage({
          message: '编辑成功！',
          type: 'success'
        })
      })
    }

    // 新增文章 API
    const getSaveApi = form => {
      fullscreenLoading.value = true
      addForum(form).then(res => {
        fullscreenLoading.value = false
        ElMessage({
          message: '新增成功',
          type: 'success'
        })
        store.commit('changeCurTreeId', Number(form.category)) // 定位
        if (res.code === 1000) {
          handleClose()
          reload()
          toDetail(res.data)
        }
      })
    }

    // getApi
    const save = () => {
      let params = {
        name: form.title,
        // parent_category: form.category,
        parent_category: route.query.category,
        type: form.type,
        description: form.description,
        author: sessionStorage.getItem('username'),
        public: sessionStorage.getItem('spacePublic')
      }
      // 新增节点
      fullscreenLoading.value = true
      addCategorys(params).then(res => {
        if (res.code == 1000) {
          form.category = res.data
          store.commit('changeCurTreeId', res.data) // 定位
          // 新增markdown
          addForum(form).then(res => {
            fullscreenLoading.value = false
            if (res.code === 1000) {
              ElMessage({
                message: '新增成功',
                type: 'success'
              })
              handleClose()
              reload()
              toDetail(res.data)
            }
          })
        }
      })
    }
    // 跳转到详情页
    const toDetail = wid => {
      if (route.query && route.query.isRight) {
        router.replace({ name: 'detail', query: { wid: wid, isRight: 'right' } })
      } else {
        router.replace({ name: 'detail', query: { wid: wid } })
      }
    }

    // 判断编辑器种类和内容
    const judgeEditor = () => {
      editorType.value === 'Markdown' ? '' : (form.body = tinyValue.value)
      editorType.value === 'Markdown' ? (form.type = 'w') : (form.type = 'a')
    }

    return {
      minHeight,
      form,
      formRef,
      formRules,
      treeData,
      taglist,
      node,
      md,
      getMd,
      goBack,
      handleChange,
      loadWord,
      handleClose,
      saveHandle,
      categoryId,
      save,
      reload,
      getSaveApi,
      isRight,
      toDetail,
      editorType,
      tinyValue,
      editorDisabled,
      judgeEditor,
      fullScreen,
      fileName,
      loadMd,
      MarkdownIt,
      uploadFile,
      // CKEditorInput,
      beforeUnloadHandler,
      fullscreenLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.my-tinymce {
  margin-bottom: 30px;
  width: 100%;
}

.md-wrap {
  min-height: calc(100vh - 50px);
  // max-width: calc(100vw - 260px);
  position: relative;
  :deep(.el-card__header) {
    position: fixed;
    top: 50px;
    width: -webkit-fill-available;
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    // max-width: calc(100vw - 260px);
    overflow: hidden;
    padding-right: 40px;
    padding-left: 40px;
    z-index: 2;
  }
  :deep(.el-card__body) {
    position: relative;
    margin-top: 60px;
  }
  :deep(.el-card) {
    min-height: 100vh;
  }
  .customUploadButton {
    display: inline-block;
    background-color: #ecf5ff;
    color: #409eff;
    border: 1px solid #d9ecff;
    cursor: pointer;
    padding: 0 0.556vw;
    height: 1.616vw;
    line-height: 1.616vw;
    border-radius: 0.202vw;
    font-size: 0.606vw;
    box-sizing: border-box;
    margin-right: 10px;
  }
  .uploadInput {
    display: none;
  }
}
</style>

<style lang="scss">
.v-note-help-wrapper {
  z-index: 99999 !important;
}
</style>
