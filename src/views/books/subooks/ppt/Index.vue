<template>
  <div class="frame" id="frame" v-if="dialogVisible">
    <iframe :src="iframeUrl" class="frame-iframe" ref="frameRef" id="iframe3" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const _reload = inject('reload')
const iframeUrl = ref('')
const dialogVisible = ref(true)
const frameRef = ref(null)
const iframeIp = ref(process.env.VUE_APP_PPT_URL)

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})

watch(
  () => route.fullPath,
  () => {
    iframeUrl.value = iframeIp.value + route.fullPath
    if (route.fullPath.includes('ppt')) {
      dialogVisible.value = false
      nextTick(() => {
        dialogVisible.value = true
      })
    }
  },
  { immediate: true }
)

const handleMessage = event => {
  const { isRefresh, id } = event.data
  if (isRefresh) {
    _reload()
    store.commit('changeCurTreeId', id)
  }
}
</script>

<style lang="less" scoped>
.frame {
  height: 100%;
  overflow: hidden;

  .frame-iframe {
    height: 100vh;
    width: calc(100vw - 270px);
    border: none;
  }
}
</style>
