/*
 * @Author: maxf
 * @Date: 2021-12-05 22:09:29
 * @Description: Element icon 组件
 * @FilePath: \vue3-netforum\src\plugins\svgicon.js
 */
import * as components from "@element-plus/icons"
export default {
    install: (app) => {
        for (const key in components) {
            const componentConfig = components[key];
            app.component(componentConfig.name, componentConfig);
        }
    }
}