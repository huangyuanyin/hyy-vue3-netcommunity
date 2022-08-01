<!--
  * @Description: 帖子详情
  * @Author: maxf
  * @Date: 2021-12-12 22:49:29
  * @LastEditors: maxf
  * @LastEditTime: 2022-03-25 18:54:07
  * @FilePath: \vue3-netforum\src\forum\components\Detail.vue
-->
<template>
  <div>
    <el-card :style="{ 'min-height': minHeight }">
      <!-- 帖子内容 -->
      <el-row>
        <el-col :span="1" :offset="1" style="margin-top: 10px">
          <div class="suspension">
            <el-row>
              <el-space direction="vertical" :size="12">
                <el-tooltip content="点赞" placement="top" :show-after="500">
                  <el-button text @click="likeHandle">
                    <img src="@/assets/img/1.png" />
                  </el-button>
                </el-tooltip>
                <span>{{ fourumdata.linknum }}</span>
              </el-space>
            </el-row>
            <el-row class="collect">
              <el-space direction="vertical" :size="12">
                <el-tooltip content="编辑" placement="left" :show-after="500">
                  <el-button text @click="handleEdit">
                    <i>
                      <el-icon :size="24" color="#000000">
                        <Edit />
                      </el-icon>
                    </i>
                  </el-button>
                </el-tooltip>
                <span>{{ fourumdata.collertnum }}</span>
              </el-space>
            </el-row>
            <el-row class="collect">
              <el-space direction="vertical" :size="12">
                <el-tooltip content="回复" placement="right" :show-after="500">
                  <el-button text>
                    <i>
                      <el-icon :size="24" color="#000000" @click="answerHandle">
                        <comment />
                      </el-icon>
                    </i>
                  </el-button>
                </el-tooltip>
                <span>{{ fourumdata.comment_num }}</span>
              </el-space>
            </el-row>
            <el-row class="collect">
              <el-space direction="vertical" :size="12">
                <el-tooltip content="返回" placement="right" :show-after="500">
                  <el-button text>
                    <i>
                      <el-icon :size="24" color="#000000" @click="goBack">
                        <Back />
                      </el-icon>
                    </i>
                  </el-button>
                </el-tooltip>
              </el-space>
            </el-row>
            <el-row>
              <el-tooltip effect="light" content="更多操作" placement="bottom" :show-after="500">
                <el-dropdown @command="handleCommandMore" trigger="click">
                  <div class="more">
                    <img src="@/assets/img/more.png" />
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="delete">
                        <el-icon>
                          <delete />
                        </el-icon>删除
                      </el-dropdown-item>
                      <el-dropdown-item command="update" disabled>
                        <el-icon>
                          <Checked />
                        </el-icon>评审
                      </el-dropdown-item>
                      <!-- <el-dropdown-item command="update">
                        <el-icon><edit /></el-icon>编辑
                      </el-dropdown-item> -->
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
            </el-row>
          </div>
        </el-col>
        <el-col :span="18" :offset="1">
          <!-- <el-card shadow="never" :body-style="{ padding: '30px' }"> -->
          <el-row>
            <span class="title">{{ fourumdata.title }}</span>
          </el-row>
          <el-row class="topinfo">
            <el-col :span="2" class="user">
              <div>
                <img src="@/assets/img/img.jpg" />
              </div>
              <span>{{ fourumdata.author }}</span>
            </el-col>
            <el-col :span="4" :offset="18">
              <time class="time">{{ fourumdata.pub_time }}</time>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px">
            <markdown-com :data="fourumdata.body"></markdown-com>
          </el-row>
          <!-- v-md-editor -->
          <!-- <el-row style="margin-top: 30px">
              <v-md-preview :text="fourumdata.body"></v-md-preview>
            </el-row> -->
          <el-row class="bottom">
            <el-col :span="6">
              <!-- <el-tag size="large" type="success">{{fourumdata.tags[0].name}}</el-tag> -->
            </el-col>
          </el-row>
          <!-- 回复列表 -->
          <answer-list-com :refresh="isRefresh" id="answerlist"></answer-list-com>
          <!-- </el-card> -->
        </el-col>
      </el-row>

      <!-- <el-col :span="20" :offset="2">
          <markdown-com :data="fourumdata.body"></markdown-com>
        </el-col> -->
      <!-- </el-row> -->
      <!-- 回复列表 -->
      <!-- <answer-list-com :refresh="isRefresh" id="answerlist"></answer-list-com> -->
    </el-card>
  </div>
</template>

<script>
import { getForumInfo, deleteForum } from '@/api/forum.js'
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import markdown from '@/components/markdown/preview.vue'
import answerpost from "./subdetail/AnswerPost.vue";
import answerlist from "./subdetail/AnswerList.vue";
export default {
  components: {
    'markdown-com': markdown,
    "answer-post-com": answerpost,
    "answer-list-com": answerlist
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    // 是否刷新回复列表
    const isRefresh = ref(0)
    // 数据
    const fourumdata = ref({})

    // 最小高度
    const minHeight = computed(() => {
      return window.innerHeight - 55 + "px";
    });

    // 回复按钮事件
    const answerHandle = () => {
      document.querySelector('#answerlist').scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }

    // 获取帖子数据
    const getForumData = () => {
      getForumInfo(route.params.wid).then(res => {
        fourumdata.value = res.data
      })
    };

    getForumData()

    watch(() => route.params.wid, () => {
      if (route.params.wid) {
        getForumData()
      }
    })

    onMounted(() => {
      setTimeout(() => {
        if (route.params.status == 'answer') {
          document.querySelector('#answerlist').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    })

    // 点赞事件
    const likeHandle = () => {
      ElMessage({
        message: "暂不支持",
        type: "warning",
      });
    };

    // 收藏事件
    const collectHandle = () => {
      ElMessage({
        message: "暂不支持",
        type: "warning",
      });
    };

    // 编辑按钮
    const handleEdit = () => {
      if (fourumdata.value.type == 'a') {
        console.log("aa", route.params.wid)
        router.push({ name: 'tiny', params: { tid: route.params.wid }, query: { category: fourumdata.value.category, type: "edit", isRight: route.query.isRight } })
      } else {
        console.log("fourumdata", fourumdata.value,);
        console.log("md", route.params.wid)
        router.push({ name: 'md', params: { mid: route.params.wid }, query: { category: fourumdata.value.category, type: "edit", isRight: route.query.isRight } })
      }
    }

    // 返回
    const goBack = () => {
      router.go(-1)
    }

    // 是否刷新
    const getAnswerPostMsg = (msg) => {
      isRefresh.value = msg
    }

    // 更多操作按钮帖子
    const handleCommandMore = (command) => {
      if (command == 'delete') {
        deleteApi();
      }
    };

    // 删除接口
    const deleteApi = () => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: "warning",
        draggable: true,
      })
        .then(() => {
          deleteForum(route.params.wid).then(res => {
            ElMessage.success("删除成功");
            // router.go(-1)
            router.push({ name: 'subbooks', params: { wRefresh: true } })
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        });
    };

    return {
      fourumdata,
      minHeight,
      isRefresh,
      goBack,
      getForumData,
      answerHandle,
      handleEdit,
      getAnswerPostMsg,
      likeHandle,
      collectHandle,
      handleCommandMore
    };
  },
};
</script>

<style scoped>
.title {
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  font-family: "宋体";
  color: black;
}

.topinfo {
  margin-top: 30px;
}

.topinfo .user {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topinfo .user img {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.topinfo .user span {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  margin-left: 15px;
  color: #606266;
}

.topinfo .time {
  line-height: 20px;
  font-size: 14px;
  color: #999;
}

.suspension {
  position: fixed;
}

.suspension img {
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.collect {
  margin-top: 25px;
  margin-left: 5px;
}

.more {
  margin-top: 15px;
}

.more img {
  display: block;
  margin-left: 14px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.bottom {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>