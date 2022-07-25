<!--
  * @Description: 
  * @Author: maxf
  * @Date: 2022-03-05 22:49:29
  * @LastEditors: maxf
  * @LastEditTime: 2022-03-25 18:54:07
  * @FilePath: \vue3-netforum\src\App.vue
-->
<template>
    <router-view/>
</template>

<script>
import axios from 'axios';
export default {
  setup() {
    const setServerConfig = () => {
      axios.get('./../netforum/static/config.json').then((res) => {
      // axios.get('./../static/config.json').then((res) => {
        // console.log(res.data.BASE_URL)
        axios.defaults.baseURL = res.data.BASE_URL;
        sessionStorage.setItem("CONSOLE_URL", res.data.CONSOLE_URL)
      })
    }
    setServerConfig()
  }
};
</script>
<style scoped>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
