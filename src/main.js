/*
 * @Description: 
 * @Author: maxf
 * @Date: 2022-03-05 22:49:29
 * @LastEditors: maxf
 * @LastEditTime: 2022-03-25 18:54:07
 * @FilePath: \vue3-netforum\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import elementIcon from "./plugins/svgicon"
import './assets/css/icon.css'

// import VMdPreview from '@kangc/v-md-editor/lib/preview';
// import '@kangc/v-md-editor/lib/style/preview.css';
// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
// import hljs from 'highlight.js';

// VMdPreview.use(githubTheme, {
//   Hljs: hljs,
// });

const app = createApp(App)

app.use(installElementPlus)
    .use(elementIcon)
    .use(store)
    .use(router)
    .mount('#app')
