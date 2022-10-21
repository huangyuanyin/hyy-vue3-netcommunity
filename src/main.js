import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import elementIcon from "./plugins/svgicon"
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import './assets/css/icon.css'
import '@/assets/icon-font/iconfont.css';

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
    .use(VueViewer)
    .use(store)
    .use(router)
    .mount('#app')
