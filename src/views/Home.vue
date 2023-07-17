<template>
  <div class="about">
    <v-header />
    <div class="box" ref="box">
      <div
        class="box-left"
        @mouseenter="isShowResizeButton = true"
        @mouseleave="isShowResizeButton = false"
        v-if="siderbar"
        :style="{ width: isFold ? '0px' : '270px', 'min-width': isFold ? '0px' : '' }"
      >
        <vSidebarNode :isFold="isFold" />
        <div v-if="!isFold" class="resize" v-resizable></div>
        <el-tooltip class="box-item" effect="dark" content="收起" placement="right">
          <div class="resize-button-left" v-if="!isFold && isShowResizeButton" @click.stop="packUp">
            <span></span>
          </div>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="展开" placement="right">
          <div class="resize-button-right" v-if="isFold" @click.stop="expand">
            <span></span>
          </div>
        </el-tooltip>
      </div>
      <div class="box-left" v-if="!siderbar" style="width:270px">
        <v-sidebar />
      </div>
      <div class="box-right">
        <div class="content-box" :class="{ 'content-collapse': collapse }">
          <div class="content">
            <router-view v-slot="{ Component }">
              <transition name="move" mode="out-in">
                <!-- <keep-alive> -->
                <component :is="Component" />
                <!-- </keep-alive> -->
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import vHeader from '../components/Header.vue'
import vSidebar from '../components/Sidebar.vue'
import vSidebarNode from '../components/SidebarNode.vue'

// 自定义指令 v-resizable
const resizableDirective = {
  mounted(el) {
    let startX = 0
    let startWidth = 0

    const handleMouseDown = event => {
      const parentElement = el.parentNode // 获取父级元素
      startX = event.clientX
      startWidth = parentElement.offsetWidth // 使用父级元素的宽度

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = event => {
      const deltaX = event.clientX - startX
      const newWidth = startWidth + deltaX
      if (newWidth < 270) return
      if (newWidth > 600) return
      el.parentNode.style.width = `${newWidth}px`
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    el.addEventListener('mousedown', handleMouseDown)
  }
}

export default {
  components: {
    vHeader,
    vSidebar,
    vSidebarNode
  },
  directives: {
    resizable: resizableDirective
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const collapse = computed(() => store.getters.collapse)
    const siderbar = computed(() => store.getters.siderbar)
    const isFold = ref(false)
    const isShowResizeButton = ref(false)

    const packUp = () => {
      isFold.value = !isFold.value
      resizeExcel('packUp')
    }

    const expand = () => {
      isFold.value = !isFold.value
      resizeExcel('expand')
    }

    const resizeExcel = type => {
      const box = document.getElementsByClassName('luckysheet-grid-container')[0]
      const box2 = document.getElementsByClassName('luckysheet-work-area')[0]
      const box3 = document.getElementById('luckysheetTableContent')
      if (type === 'packUp') {
        box.style.width = '100vw'
        box2.style.width = '100vw'
        box3.style.width = '100vw'
      } else {
        box.style.width = '100%'
        box2.style.width = '100%'
        box3.style.width = '100%'
      }
    }

    return {
      collapse,
      siderbar,
      route,
      isFold,
      packUp,
      expand,
      isShowResizeButton,
      resizeExcel
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.v-note-show) {
  height: 100vh;
}
.box {
  display: flex;
}
.box-left {
  position: relative;
  float: left;
  height: 100vh;
  min-width: 270px;
  width: 270px;
  display: flex;
}
.box-right {
  flex: 1;
  // max-height: 100vh;
  overflow-y: auto;
}

.resize {
  position: absolute;
  z-index: 202;
  top: 0;
  bottom: 0;
  right: -6px;
  width: 6px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  cursor: ew-resize;
}
.resize::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: var(--yq-border-light);
}
.resize::after {
  right: 6px;
  width: 1px;
}

.resize-button-left {
  z-index: 3;
  position: absolute;
  right: -11px;
  top: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 18px;
  background-color: #eff0f0;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  opacity: 1;
  will-change: top, opacity;
  transform: translateY(-50%);
  color: #8a8f8d;
  span {
    display: inline-block;
    border-left: 6px solid #262626;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid transparent;
    align-self: center;
    transform: rotate(180deg);
    margin-left: -6px;
    color: #262626;
  }
}

.resize-button-right {
  z-index: 3;
  position: absolute;
  left: 0px;
  top: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 18px;
  background-color: #eff0f0;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  opacity: 1;
  will-change: top, opacity;
  transform: translateY(-50%);
  transition: all 0.3s ease 0.5s;
  color: #8a8f8d;
  span {
    display: inline-block;
    border-left: 6px solid #262626;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid transparent;
    align-self: center;
    transform: rotate(360deg);
    margin-right: -6px;
    color: #262626;
  }
}
</style>
