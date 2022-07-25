/*
 * @Author: maxf
 * @Date: 2022-01-11 11:11:32
 * @LastEditTime: 2022-01-25 23:07:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-netforum\src\store\index.js
 */
let modules = {};
const files = require.context("./modules", false, /\.js$/);
files.keys().forEach((key) => {
    const fileName = key.replace(/(\.\/|\.js)/g, "");
    modules[fileName] = files(key).default;
});

import { createStore } from "vuex";
import getters from "./getters";
export default createStore({
    getters,
    modules,
});
