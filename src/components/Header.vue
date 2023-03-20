<template>
  <div class="header">
    <div class="header-left">
      <div class="collapse-btn">
        <el-button v-if="!drawer" :icon="Operation" class="open" @click="openDrawer('open')" />
        <el-button v-else :icon="CloseBold" class="open" @click="openDrawer('close')" />
        <Drawer :drawer="drawer" @changeDrawer="changeDrawer" />
      </div>
      <div class="logo">
        <el-button text @click="toWorkSpace">
          <span>信安知识库</span>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button text @click="toConsole" :icon="HomeFilled">控制台</el-button>
      </div>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <div class="search">
          <el-input
            v-model="filterText"
            size="small"
            placeholder="搜索知识库"
            style="width: 250px; color: #409EFF"
            @keyup.enter="handleSearch"
            @focus="bus.emit('pauseKeyCommand')"
            @blur="bus.emit('recoveryCommand')"
          >
            <template #prefix>
              <el-icon>
                <search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <!-- 支持 -->
        <div class="support">
          <span>支持</span>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
            <router-link to="/detail">
              <i>
                <el-icon style="margin-top: 5px">
                  <bell />
                </el-icon>
              </i>
              <!-- <i><el-icon style="margin-top: 5px"><bell-filled /></el-icon></i> -->
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 帮助文档 -->
        <div class="help">
          <el-tooltip placement="bottom" trigger="hover" content="帮助文档" class="document">
            <i>
              <el-icon style="color: #909399">
                <question-filled />
              </el-icon>
            </i>
          </el-tooltip>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../assets/img/img.jpg" />
        </div>
        <!-- 用户下拉菜单 -->
        <el-dropdown class="user-name" trigger="click">
          <span class="el-dropdown-link">
            {{ username }}
            <i>
              <el-icon>
                <caret-bottom />
              </el-icon>
            </i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toSelfInfo">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="loginOutFun">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HomeFilled, Operation, CloseBold } from '@element-plus/icons-vue'
import Drawer from '@/components/Drawer.vue'
import bus from '@/utils/bus.js'

const store = useStore()
const router = useRouter()
const drawer = ref(false)
// 未读信息
const message = 2
// 全局搜索数据
const filterText = ref('')
// 用户昵称
const username = computed(() => sessionStorage.getItem('nickname'))
// 折叠
const collapse = computed(() => store.getters.collapse)
// 侧边栏折叠
const collapseChage = () => {
  store.commit('app/handleCollapse', !collapse.value)
}
// 到工作台
const toWorkSpace = () => {
  store.commit('app/handleSiderbar', false)
  sessionStorage.setItem('siderbar', '2')
  router.push('/books')
}

onMounted(() => {
  // if (document.body.clientWidth < 1500) {
  //   collapseChage()
  // }
})

// 控制台跳转
const toConsole = () => {
  let url = process.env.VUE_APP_CONSOLE_URL
  window.location.href = url
  // store.commit("app/handleSiderbar", false)
  // sessionStorage.setItem("siderbar", '2')
}

// 全局搜索
const handleSearch = () => {
  router.push({ name: 'search', query: { content: filterText.value } })
  // filterText.value = ''
}

const toSelfInfo = () => {
  ElMessage({
    message: '暂不支持',
    type: 'warning'
  })
}

// 用户名下拉菜单选择事件
const loginOutFun = () => {
  store.commit('user/clean_Toen')
  store.commit('app/handleSiderbar', false)
  router.push('/login')
}

const openDrawer = val => {
  val === 'open' ? (drawer.value = true) : (drawer.value = false)
}
const changeDrawer = drawer => {
  openDrawer(drawer)
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  color: #fff;
}

.collapse-btn {
  /* background: #409EFF; */
  float: left;
  /* padding: 0 21px; */
  cursor: pointer;
  line-height: 50px;

  .el-button {
    background-color: #242f42;
    color: #fff;
    border: none;
  }
  .el-button:hover {
    color: #409eff;
  }
}

.logo {
  float: left;
  // width: 220px;
  line-height: 50px;
  .el-button {
    color: #fff;
  }
  .el-button:hover {
    color: #242f42;
  }
}

.logo span {
  font-size: 16px;
  font-weight: 800;
  /* color:azure; */
  font-family: '仿宋';
}

.space {
  float: left;
  width: 100px;
  margin-top: 8px;
}

.space .topic {
  font-weight: 700;
  color: #909399;
}

.templates {
  float: left;
  margin-top: 8px;
}

.templates .el-button {
  font-weight: 700;
  color: #909399;
}

.header-right {
  float: right;
  padding-right: 30px;
}

.header-user-con {
  display: flex;
  height: 50px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.bell-filled {
  color: #fff;
}

.help {
  margin-left: 15px;
  margin-top: 3px;
}

.support {
  font-size: 10px;
  color: #909399;
  margin-right: 15px;
}

.search {
  margin-right: 30px;
}

/* .el-input__inner{
  background-color: #E6A23C;    
} */
.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
