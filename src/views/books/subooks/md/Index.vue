<template>
  <div>
    <el-card :style="{ 'min-height': minHeight }">
      <template #header>
        <el-button type="primary" @click="goBack">
          <el-icon>
            <Back />
          </el-icon>返回
        </el-button>
      </template>
      <el-form :model="form" ref="formRef" :rules="formRules" size="large" label-width="100px">
        <el-form-item label="分类" prop="category" v-if="categoryId === ''">
          <el-space>
            <el-cascader :options="treeData" v-model="form.category" @change="handleChange"
              :props="{ value: 'id', checkStrictly: true }" clearable :show-all-levels="false" />
            <span style="margin-left: 30px">标签</span>
            <el-cascader :options="taglist" v-model="form.tags" :props="{ value: 'id', label: 'name' }">
            </el-cascader>
          </el-space>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" show-word-limit maxlength="200" placeholder="请输入标题" type="text"></el-input>
        </el-form-item>
        <el-form-item>
          <markdown-com :data="md" @input="getMd"></markdown-com>
        </el-form-item>
        <!-- <el-form-item>
          <v-md-editor v-model="md" height="400px"></v-md-editor>
        </el-form-item> -->
        <!-- <div>
          <markdown-com :data="md" @input="getMd"></markdown-com>
        </div> -->
        <el-form-item label="word解析">
          <input type="file" accept=".docx" @change="loadWord" />
        </el-form-item>
        <el-form-item label="上传附件">
          <span>暂不支持</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveHandle" round>发 布</el-button>
          <el-button round disabled>保存草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import markdown from '@/components/markdown/Index.vue'
import 'mavon-editor/dist/css/index.css';

import { ref, computed, reactive, watch, onMounted, inject } from "vue";
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from "element-plus";
import { getCategorysInfo, addCategorys } from '@/api/category.js'
import { addForum, updateForum, getForumInfo } from '@/api/forum.js'
import { getTag } from "@/api/tag.js"
import { upload } from '@/api/common.js'
export default {
  name: 'editor',
  components: {
    mavonEditor,
    'markdown-com': markdown
  },
  setup() {
    const reload = inject('reload')
    const router = useRouter();
    const route = useRoute();
    const store = useStore()
    // 最小高度
    const minHeight = computed(() => {
      return window.innerHeight - 55 + "px";
    });
    // 工作空间标题名
    const spaceid = computed(() => sessionStorage.getItem('spaceid'));
    // 节点数据
    const node = computed(() => store.getters.node);
    // 节点数据
    const treeData = ref([])
    // 标签列表
    const taglist = ref([])
    // md编辑器数据
    const md = ref('')
    const formRef = ref(null);
    // 路由传参
    const categoryId = ref("")
    // 表单
    const form = reactive({
      category: '',
      title: '',
      tags: [],
      type: 'w',
      body: ''
    })
    // 表单校验
    const formRules = reactive({
      category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
    })

    // 获取节点数据
    const getNodeList = () => {
      getCategorysInfo(spaceid.value).then((res) => {
        treeData.value = res.data
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
      getForumInfo(route.query.mid).then(res => {
        form.title = res.data.title
        form.category = res.data.category
        form.tags = res.data.tags
        md.value = res.data.body
      })
    };

    getNodeList()
    getTagList()
    form.category = node.value.id
    // md.value = ''


    // 监控 文章编辑
    watch(() => route.query.mid, () => {
      if (route.query.mid) {
        getForumData()
      }
    })
    watch(() => route.query, () => {
      if (route.query && route.query.category) {
        categoryId.value = route.query.category
      } else {
        categoryId.value = ''
      }
    },
    )

    onMounted(() => {
      categoryId.value = route.query.category || ''
      form.category = categoryId.value
      md.value = ''
      if (route.query.mid) {
        getForumData()
      }
    })

    // 获取md数据
    const getMd = (evt) => {
      if (typeof (evt) == 'string') {
        form.body = evt
      }
    }

    const handleChange = (id) => {
      var len = id.length
      form.category = id[len - 1]
    }

    // 上传word
    const loadWord = (evt) => {
      const files = evt.target.files
      if (files == null || files.length == 0) {
        alert('No files wait for import')
        return
      }
      let name = files[0].name
      let formData = new FormData();
      let header = {
        "Content-Type": "multipart/form-data"
      };
      formData.append("file", files[0]);
      formData.append("type", 'md');
      upload(header, formData).then(res => {
        form.title = name
        md.value = res.data
      })
    }

    const handleClose = () => {
      formRef.value.resetFields()
      md.value = ''
      form.body = ''
      router.push({ name: 'subbooks', params: { wRefresh: true } })
    }

    // 发布事件
    const saveHandle = () => {
      if (route.query.mid) {
        updateApi()
      } else {
        addApi()
      }
    }

    // 新增
    const addApi = () => {
      form.author = sessionStorage.getItem('username')
      formRef.value.validate((valid) => {
        if (!valid) return
        save()
      })
    }

    // 文章编辑
    const updateApi = () => {
      form.author = sessionStorage.getItem('username')
      form.category = categoryId.value
      formRef.value.validate((valid) => {
        if (!valid) return
        updateForum(route.query.mid, form).then(res => {
          ElMessage({
            message: "编辑成功！",
            type: "success",
          });
          handleClose()
        })
      })
    }

    // getApi
    const save = () => {
      let params = {
        name: form.title,
        parent_category: form.category,
        type: form.type
      }
      console.log("aaaa", params);
      // 新增节点
      addCategorys(params).then((res) => {
        if (res.code == 1000) {
          form.category = res.data
          // 新增markdown
          addForum(form).then(res => {
            ElMessage({
              message: "新增成功",
              type: "success",
            });
            handleClose()
            reload()   
          })
        }
      })
    }
    // 返回
    const goBack = () => {
      router.push({ name: 'subbooks' })
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
      save, reload
    }
  },
}
</script>