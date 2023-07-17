import changeEditorMenu from './extendMenuList/changeEditorMenu.js'
import fileParseMenu from './extendMenuList/fileParseMenu.js'
// import ImageMenu from './extendMenuList/ImageMenu.js'
import { Boot } from '@wangeditor/editor'

const MenusList = [
  // {
  //   key: 'ImageMenu',
  //   class: ImageMenu,
  //   index: 0 // 菜单要在工具栏显示的位置
  // },
  {
    key: 'changeEditorMenu',
    class: changeEditorMenu,
    index: 0
  },
  {
    key: 'fileParseMenu',
    class: fileParseMenu,
    index: 1
  }
]

export function registerMenu(editor, toolbarConfig) {
  const allRegisterMenu = editor.getAllMenuKeys() // 获取所有已注册的菜单
  let keys = []
  for (let item of MenusList) {
    if (allRegisterMenu.indexOf(item.key) < 0) {
      // 如果未注册，则注册
      const menuObj = {
        key: item.key,
        factory: function() {
          return new item.class()
        }
      }
      Boot.registerMenu(menuObj)
    }
    keys.push(item.key)
  }
  toolbarConfig.insertKeys = {
    index: MenusList[0].index,
    keys: keys
  }
}
