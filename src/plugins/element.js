/*
 * @Author: maxf
 * @Date: 2021-12-05 22:49:29
 * @Description: Element组件
 * @FilePath: \vue3-netforum\src\plugins\element.js
 */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from "element-plus/es/locale/lang/zh-cn"
import "dayjs/locale/zh-cn";
export default {
    install: (app) => {
        app.use(ElementPlus, {
            locale: zhCn,
            size: 'default'
        })
    }
}