<template>
  <router-view v-if="isRouterAlive" />
</template>

<script>
import axios from 'axios'
import { nextTick, provide, ref } from 'vue'
export default {
  setup() {
    const isRouterAlive = ref(true)
    const reload = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    const setServerConfig = () => {
      // axios.get('./../netforum/static/config.json').then(res => {
      // /netforum/static/ -- 线上
      // axios.get('./../static/config1.json').then(res => {
      // /static/ 本地
      // sessionStorage.setItem('COMMUNITY_URL', process.env.VUE_APP_BASE_URL)
      // sessionStorage.setItem('CONSOLE_URL', process.env.VUE_APP_CONSOLE_URL)
      // })
      // sessionStorage.setItem('COMMUNITY_URL', process.env.VUE_APP_BASE_URL)
      // sessionStorage.setItem('CONSOLE_URL', process.env.VUE_APP_CONSOLE_URL)
      console.log(process.env.VUE_APP_BASE_URL)
    }
    setServerConfig()
    provide('reload', reload)
    return {
      isRouterAlive,
      reload
    }
  }
}
</script>

<style scoped>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
