<template>
  <div class="navigatorContainer">
    <!-- <div class="item">
      <el-select v-model="lang" size="small" style="width: 100px" @change="onLangChange">
        <el-option v-for="item in langList" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
    </div> -->
    <!-- <div class="item">
      <el-checkbox v-model="openMiniMap" @change="toggleMiniMap">$t('navigatorToolbar.openMiniMap')</el-checkbox>
    </div> -->
    <div class="item">
      <el-switch
        v-model="isReadonly"
        :active-text="$t('navigatorToolbar.readonly')"
        :inactive-text="$t('navigatorToolbar.edit')"
        @change="readonlyChange"
      ></el-switch>
    </div>
    <div class="item">
      <Scale :mindMap="mindMap"></Scale>
    </div>
    <div class="item">
      <Fullscreen :mindMap="mindMap"></Fullscreen>
    </div>
  </div>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 导航器工具栏
 */
import { ref, onMounted, defineProps, watch, reactive, nextTick } from 'vue'
import Scale from './Scale'
import Fullscreen from './Fullscreen'
import bus from '@/utils/bus.js'
import { langList } from '@/config'
import i18n from '@/i18n'
import { storeLang, getLang } from '@/api'
import { useStore } from 'vuex'

const props = defineProps({
  mindMap: {
    type: Object
  }
})

const store = useStore()
const rightPosition = ref(false)
const isReadonly = ref(false)
const openMiniMap = ref(true)
const lang = ref(getLang())

watch(
  () => store.state.activeSidebar,
  () => {
    store.state.activeSidebar ? (rightPosition.value = true) : (rightPosition.value = false)
  }
)

const readonlyChange = value => {
  props.mindMap.setMode(value ? 'readonly' : 'edit')
}

const toggleMiniMap = show => {
  bus.emit('toggle_mini_map', show)
}

const onLangChange = lang => {
  i18n.locale = lang
  storeLang(lang)
}

onMounted(() => {
  toggleMiniMap(openMiniMap.value)
})
</script>

<script>
export default {
  name: 'NavigatorToolbar'
}
</script>

<style lang="less" scoped>
.navigatorContainer {
  padding: 0 12px;
  position: fixed;
  right: v-bind("rightPosition ? '320px' : '20px'");
  transition: all 0.3s;
  bottom: 20px;
  background: hsla(0, 0%, 100%, 0.8);
  border-radius: 5px;
  opacity: 0.8;
  height: 44px;
  font-size: 12px;
  display: flex;
  align-items: center;

  .item {
    margin-right: 20px;

    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>
