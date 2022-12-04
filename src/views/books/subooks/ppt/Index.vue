<template>
  <div class="frame" id="frame" v-if="dialogVisible">
    <!-- <iframe src="https://10.20.86.27:8080/netppt/" class="frame-iframe" ref="frameRef" /> -->
    <iframe :src="iframeUrl" class="frame-iframe" ref="frameRef" id="iframe3" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const _reload = inject('reload')
const iframeUrl = ref('')
const dialogVisible = ref(true)
const iframeWin = ref('')
const frameRef = ref(null)

onMounted(() => {
  iframeUrl.value = 'http://192.168.0.102:8081#' + route.fullPath
  window.addEventListener('message', handleMessage)
})

watch(
  () => route.fullPath,
  () => {
    iframeUrl.value = 'http://192.168.0.102:8081#' + route.fullPath
    if (route.fullPath.includes('ppt')) {
      dialogVisible.value = false
      nextTick(() => {
        dialogVisible.value = true
      })
    }
  }
)

const handleMessage = event => {
  const { isRefresh, id } = event.data
  if (isRefresh) {
    setTimeout(_reload, 100)
    store.commit('changeCurTreeId', id)
  }
}
</script>

<style lang="less" scoped>
.frame {
  height: 100vh;

  .frame-iframe {
    height: 100vh;
    width: calc(100vw - 270px);
  }
}
</style>
