<template>
  <div class="md-wrap ignore_md_wrap">
    <el-card>
      <template #header style="height:52px">
        <div class="titleInput">
          <span v-if="flag" @click="edit()">{{ form.title }}</span>
          <el-input autofocus v-model="form.title" v-else @change="input()" @blur="editDocTitle" minlength="1" maxlength="30" />
        </div>
        <div class="md_button">
          <el-tooltip class="box-item" effect="dark" content="协作" placement="bottom">
            <div data-testid="doc-action-collaborate" data-aspm-click="d225876" class="ignore-xiezuo-icon" @click="handleCooperation">
              <svg
                style="cursor: pointer;"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-nav-invite"
              >
                <path
                  d="M128 129c5.523 0 10 4.477 10 10s-4.477 10-10 10c-24.125 0-45.174 6.043-60.525 16.179-12.362 8.162-19.354 18.06-19.54 25.146l-.007.911-.001.397.005.747c.034 2.031.212 3.378.664 4.658.4 1.136.947 1.914 1.804 2.514l.203.135.294.186.28.207c.604.443 1.371.869 2.296 1.275l.475.201.501.198.527.195.274.096.565.19.591.187.305.092.628.181.654.178.678.175.703.171.726.168.751.164.775.16 1.207.235 1.26.226.869.147.891.142.915.14.937.134 1.447.196.993.126 1.015.122 1.563.176 1.61.167 1.101.107 1.69.153 1.153.096 1.173.093 1.798.132 1.842.122 1.888.113 1.93.104 1.312.064 1.33.06 2.031.082 2.073.073 1.886.057 2.338.061 3.948.08 1.803.027 3.794.04 3.624.02 5.876.008 9.344-.013L128 207c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996l-.453.004-11.598.014-6.434-.014-3.11-.02-3.85-.043-2.294-.037-1.806-.036-2.476-.06-2.515-.07-2.478-.082-1.62-.061-1.598-.065-1.574-.071-1.55-.076-1.526-.08-2.244-.133-1.467-.095-1.444-.1-2.122-.163-1.386-.115-1.362-.122-1.34-.129-1.316-.134-1.293-.142-1.271-.148-1.248-.155-1.226-.162-1.202-.169-1.18-.176-1.159-.184-1.135-.19-1.114-.2c-.367-.067-.731-.136-1.091-.206l-1.07-.214a89.329 89.329 0 0 1-2.072-.453l-1.004-.238c-.33-.081-.658-.164-.981-.247l-.96-.256c-.317-.086-.63-.175-.94-.264l-.916-.273a55.46 55.46 0 0 1-2.623-.872l-.832-.309c-2.875-1.098-5.363-2.368-7.478-3.835l-.338-.238-.13-.084c-4.586-3.038-7.72-7.229-9.547-12.126l-.172-.476c-1.443-4.088-1.807-7.435-1.809-11.98l.004-1.096c0-14.848 10.912-30.497 28.525-42.126C75.15 136.145 100.04 129 128 129Zm58-12c5.523 0 10 4.477 10 10v35h35c5.523 0 10 4.477 10 10s-4.477 10-10 10h-35v35c0 5.523-4.477 10-10 10s-10-4.477-10-10v-35h-35c-5.523 0-10-4.477-10-10s4.477-10 10-10h35v-35c0-5.523 4.477-10 10-10Zm-58-93c25.405 0 46 20.595 46 46s-20.595 46-46 46-46-20.595-46-46 20.595-46 46-46Zm0 20c-14.36 0-26 11.64-26 26s11.64 26 26 26 26-11.64 26-26-11.64-26-26-26Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </svg>
            </div>
          </el-tooltip>
          <el-button type="default" @click="saveHandle">更新</el-button>
          <div class="ignore-more-icon" :class="{ isMoreActive: moreDrawer }" @click="openMoreDrawer">
            <svg
              style="cursor: pointer;"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              class="larkui-icon-rightboard icon-svg style-module_iconEditMode_55y65 index-module_size_wVASz"
              data-name="Rightboard"
            >
              <path
                d="M209 28c16.569 0 30 13.431 30 30v140c0 16.569-13.431 30-30 30H47c-16.569 0-30-13.431-30-30V58c0-16.569 13.431-30 30-30Zm-80 20H47c-5.523 0-10 4.477-10 10v140c0 5.523 4.477 10 10 10h82V48Zm80 0h-60v160h60c5.43 0 9.848-4.327 9.996-9.72L219 198V58c0-5.523-4.477-10-10-10Zm-15 114c5.523 0 10 4.477 10 10s-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10s4.477-10 10-10h20Zm0-44c5.523 0 10 4.477 10 10s-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10s4.477-10 10-10h20Zm0-44c5.523 0 10 4.477 10 10s-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10s4.477-10 10-10h20Z"
                fill="currentColor"
                fill-rule="nonzero"
              ></path>
            </svg>
          </div>
        </div>
      </template>
      <el-form :model="form" ref="formRef" :rules="formRules" size="large" label-width="0px">
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
        <!-- <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" show-word-limit maxlength="200" placeholder="请输入标题" type="text"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="文章描述" prop="description" v-if="isRight === 'right' || categoryId === ''">
          <el-input v-model="form.description" show-word-limit maxlength="200" placeholder="请输入文章描述" type="text"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="编辑器风格" prop="editorType">
          <el-radio-group v-model="editorType" class="ml-4" :disabled="editorDisabled">
            <el-radio label="tiny" size="large">富文本</el-radio>
            <el-radio label="Markdown" size="large">Markdown</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item label="word解析" v-if="editorType === 'tiny'">
          <div>
            <label for="fileInput" class="customUploadButton">上传文件</label>
            <span>{{ fileName }}</span>
          </div>
          <input type="file" accept=".docx" id="fileInput" @change="loadWord" class="uploadInput" />
        </el-form-item> -->
        <!-- <el-form-item label="文件解析" v-if="editorType === 'Markdown'">
          <div>
            <label for="fileInput" class="customUploadButton">上传文件</label>
            <span>{{ fileName }}</span>
          </div>
          <input type="file" accept=".docx,.md" id="fileInput" @change="loadMd" class="uploadInput" />
        </el-form-item> -->
        <!-- <el-form-item label="上传附件">
          <el-tag type="info">暂不支持</el-tag>
        </el-form-item> -->
        <el-form-item class="markdown-wrap" style="max-height: 89vh;" v-if="editorType === 'Markdown'">
          <markdown-com
            style="z-index: 2013;"
            :data="md"
            @input="getMd"
            @fullScreen="fullScreen"
            @changeEditor="changeEditor"
          ></markdown-com>
          <MoreDrawer :moreDrawer="moreDrawer" :id="node.id" :title="form.title" />
        </el-form-item>
        <el-form-item class="tiny-wrap" v-if="editorType === 'tiny'">
          <tinymce-com v-if="isTinymce" ref="tinymce" v-model="tinyValue" @changeEditor="changeEditor"></tinymce-com>
          <MoreDrawer :moreDrawer="moreDrawer" :id="node.id" :title="form.title" />
          <!-- <WangEdtior :value="tinyValue" @changeEditorMenuClick="changeEditorMenuClick" /> -->
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

import WangEdtior from '@/components/WangEdtior/index.vue'

import MoreDrawer from './components/MoreDrawer.vue'

import { ref, computed, reactive, watch, onMounted, onUnmounted, nextTick, inject, watchEffect } from 'vue'
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
    'tinymce-com': Tinymce,
    WangEdtior,
    MoreDrawer
    // 'CKEditor5-com': CKEditor5
  },
  setup() {
    const reload = inject('reload')
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const isTinymce = ref(true)
    // 是否显示分类
    const isRight = ref('')
    // 最小高度
    const minHeight = computed(() => {
      return window.innerHeight - 55 + 'px'
    })
    // 工作空间标题名
    const spaceid = ref(sessionStorage.getItem('spaceid'))
    const docTitle = computed(() => store.getters.docTitle)
    // 节点数据
    const node = computed(() => store.getters.node)
    const tinymce = ref(null)
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
    const flag = ref(true)
    const moreDrawer = ref(false)
    const moreDrawerTab = ref('first')
    const formRef = ref(null)
    // 路由传参
    const categoryId = ref('')
    // 表单
    const form = reactive({
      category: '',
      title: '无标题文档',
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

    const edit = () => {
      flag.value = false
    }

    const input = () => {
      flag.value = true
      if (form.title === '') {
        form.title = '无标题'
      }
      console.log(`output->formform`, form, editorType.value)
      judgeEditor()
      updateForum(route.query.mid || route.query.tid, form).then(res => {
        if (res.code === 1000) {
          getUpdateCategorysApi()
        }
        reload()
      })
    }

    const editDocTitle = () => {
      flag.value = true
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

    watch(
      () => route.query.tid,
      () => {
        isTinymce.value = false
        setTimeout(() => {
          isTinymce.value = true
        }, 100)
      }
    )

    watchEffect(() => {
      if (docTitle.value) {
        form.title = docTitle.value
        store.commit('books/SET_DOC_TITLE', '')
      }
    })

    onMounted(() => {
      form.body = ''
      tinyValue.value = ''
      form.category = categoryId.value = route.query.category || ''
      isRight.value = route.query.isRight || ''
      route.query.typeof === 'w'
        ? (editorType.value = 'Markdown') && (editorDisabled.value = true)
        : (editorType.value = 'tiny') && (editorDisabled.value = true)
      rawData.value = ''
      md.value = ''
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
      rawData.value = ''
      tinyValue.value = ''
      md.value = ''
      form.body = ''
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

    const changeEditorMenuClick = () => {
      editorType.value = 'Markdown'
    }
    const changeEditor = val => {
      const [type, data] = val
      editorType.value = type
      if (type === 'tiny') {
        tinyValue.value = data
      } else {
        md.value = data
        form.body = data
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

    const openMoreDrawer = () => {
      moreDrawer.value = !moreDrawer.value
      if (!moreDrawer.value) {
        moreDrawerTab.value = 'first'
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
          updateForum(route.query.mid || route.query.tid, form).then(res => {
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
          message: '更新成功！',
          type: 'success'
        })
      })
    }

    // 新增文章 API
    const getSaveApi = form => {
      addForum(form).then(res => {
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
      addCategorys(params).then(res => {
        if (res.code == 1000) {
          form.category = res.data
          store.commit('changeCurTreeId', res.data) // 定位
          // 新增markdown
          addForum(form).then(res => {
            ElMessage({
              message: '新增成功',
              type: 'success'
            })
            if (res.code === 1000) {
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

    const handleCooperation = () => {
      ElMessage.warning('暂不支持')
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
      flag,
      edit,
      input,
      editDocTitle,
      changeEditorMenuClick,
      changeEditor,
      moreDrawer,
      openMoreDrawer,
      moreDrawerTab,
      handleCooperation,
      tinymce,
      isTinymce
    }
  }
}
</script>

<style lang="scss" scoped>
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
    .titleInput {
      width: max-content;
      span {
        cursor: pointer;
      }
    }
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

.ignore_md_wrap {
  :deep(.el-card__header) {
    height: 52px;
    padding: 0 32px 0 16px;
    display: flex;
    align-items: center;
    border-bottom: none;
  }
  :deep(.el-card__body) {
    margin-top: 52px;
    padding: 0px;
  }
  .md_button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-button {
      margin: 0 16px;
    }
  }
}
.ignore-xiezuo-icon,
.ignore-more-icon {
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
}
.isMoreActive {
  background-color: #e0e0e0;
}
.markdown-wrap,
.tiny-wrap {
  position: relative;
  :deep(.moreDrawer-modal) {
    position: absolute !important;
    z-index: auto !important;
  }
  :deep(.moreDrawer) {
    z-index: 2013 !important;
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
}
:deep(.my-tinymce) {
  // z-index: 2013 !important;
}
</style>

<style lang="scss">
.v-note-help-wrapper {
  z-index: 99999 !important;
}
</style>
