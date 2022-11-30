<template>
  <div class="frame" id="frame" v-if="dialogVisible">
    <!-- <iframe src="https://10.20.86.27:8080/netppt/" class="frame-iframe" ref="frameRef" /> -->
    <iframe :src="iframeUrl" class="frame-iframe" ref="frameRef" id="iframe3" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const iframeUrl = ref('')
const dialogVisible = ref(true)

onMounted(() => {
  iframeUrl.value = 'http://10.20.70.73:8081/#' + route.fullPath
  console.log('reportUrl', iframeUrl.value)
})

watch(
  () => route.fullPath,
  () => {
    iframeUrl.value = 'http://10.20.70.73:8081/#' + route.fullPath
    if (route.fullPath.includes('ppt')) {
      dialogVisible.value = false
      nextTick(() => {
        dialogVisible.value = true
      })
    }
  }
)
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
