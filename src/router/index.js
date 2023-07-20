import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '系统首页'
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
      },
      {
        path: '/tag',
        name: 'tag',
        meta: {
          title: '标签'
        },
        component: () => import(/* webpackChunkName: "scene" */ '../views/tags/Index.vue')
      },
      {
        path: '/note',
        name: 'note',
        meta: {
          title: '小记'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/note/Index.vue')
      },
      {
        path: '/books',
        name: 'books',
        meta: {
          title: '我的知识库'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/Index.vue')
      },
      {
        path: '/subbooks',
        name: 'subbooks',
        meta: {
          title: '知识库详情'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/subooks/Index.vue')
      },
      {
        path: '/mindMap',
        name: 'mindMap',
        meta: {
          title: '思维导图'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/subooks/mindMap/Index.vue')
      },
      {
        path: '/ppt',
        name: 'FramePPT',
        meta: {
          title: 'PPT'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/subooks/ppt/Index.vue')
      },
      {
        path: '/excel',
        name: 'excel',
        meta: {
          title: 'Excel文档'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/subooks/excel/Index.vue')
      },
      {
        path: '/tiny',
        name: 'tiny',
        meta: {
          title: '富文本编辑'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/subooks/tiny/Index.vue')
      },
      {
        path: '/md',
        name: 'md',
        meta: {
          title: 'markdown编辑器'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/subooks/md/Index-new.vue')
      },
      {
        path: '/detail',
        name: 'detail',
        meta: {
          title: '知识库详情'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/books/subooks/word/Index-new.vue')
      },
      {
        path: '/search',
        name: 'search',
        meta: {
          title: '全局筛选'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/search/Index.vue')
      },
      {
        path: '/trash',
        name: 'trash',
        meta: {
          title: '回收站'
        },
        component: () => import(/* webpackChunkName: "monitor" */ '../views/trash/Index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

import store from '@/store'
if (localStorage.getItem('token')) {
  store.commit('user/SET_TOKEN', localStorage.getItem('token'))
}

if (sessionStorage.getItem('siderbar') == '1') {
  store.commit('app/handleSiderbar', true)
}
if (sessionStorage.getItem('siderbar') == '2') {
  store.commit('app/handleSiderbar', false)
}

// let node = sessionStorage.getItem('node')
// console.log(node.value)
// if () {
//   console.log(sessionStorage.getItem('node'))
//   store.commit("books/SET_NODE_DATA", sessionStorage.getItem('node'));
// }

router.beforeEach((to, from, next) => {
  document.title = `信安知识库`
  // 解决进入知识库后,返回上一页面,左侧导航菜单不变的bug
  if (from.path == '/subbooks' && to.path == '/books') {
    sessionStorage.setItem('siderbar', '2')
    store.commit('app/handleSiderbar', false)
  }
  if (from.path == '/subbooks' && to.path == '/trash') {
    sessionStorage.setItem('siderbar', '2')
    store.commit('app/handleSiderbar', false)
  }
  if (from.path == '/books' && to.path == '/subbooks') {
    sessionStorage.setItem('siderbar', '1')
    store.commit('app/handleSiderbar', true)
  }
  // 获取Token
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})

export default router
