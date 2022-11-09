let modules = {};
const files = require.context("./modules", false, /\.js$/);
files.keys().forEach((key) => {
    const fileName = key.replace(/(\.\/|\.js)/g, "");
    modules[fileName] = files(key).default;
});

import { createStore } from "vuex";
import getters from "./getters";
import exampleData from 'simple-mind-map/example/exampleData';
export default createStore({
    state: {
        mindMapData: null, // 思维导图数据
        isHandleLocalFile: false,// 是否操作的是本地文件
        curTreeId: sessionStorage.getItem('curTreeId') || null,  // 存放 高亮的节点ID
        defaultExpandIds: sessionStorage.getItem('defaultExpandIds') || []
    },
    mutations: {
        /** 
         * @Author: 黄原寅 
         * @Desc: 设置思维导图数据 
         */
        setMindMapData(state, data) {
            state.mindMapData = data
        },
        /** 
        * @Author: 黄原寅
        * @Desc: 设置操作本地文件标志位 
        */
        setIsHandleLocalFile(state, data) {
            state.isHandleLocalFile = data
        },
        changeCurTreeId(state, data) {
            state.curTreeId = data
            sessionStorage.setItem('curTreeId', data)
            state.defaultExpandIds = []
            // 保存当前展开的节点
            state.defaultExpandIds.push(data)
            sessionStorage.setItem('defaultExpandIds', state.defaultExpandIds)

        }
    },
    actions: {
        /** 
         * @Author: 黄原寅 
         * @Desc: 设置初始思维导图数据 
         */
        getUserMindMapData(ctx) {
            try {
                let { data } = {
                    data: {
                        data: {
                            mindMapData: exampleData
                        }
                    }
                }
                ctx.commit('setMindMapData', data.data)
            } catch (error) {
                console.log(error)
            }
        }
    },
    getters,
    modules,
});
