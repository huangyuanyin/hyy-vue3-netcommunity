<template>
  <div class="about">
    <v-header />
    <div class="box" ref="box">
      <div class="box-left" v-if="siderbar">
        <vSidebarNode />
        <div class="resize" v-resizable></div>
      </div>
      <div class="box-left" v-if="!siderbar">
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

    return {
      collapse,
      siderbar,
      route
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
  max-height: 100vh;
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
</style>
