class ImageMenu {
  constructor() {
    this.title = '插入图片' // 鼠标悬浮显示
    this.tag = 'button'
    this.iconSvg =
      '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>' // 菜单图标
    this.showDropPanel = true
  }

  isActive(editor) {
    // 保持默认
    return false
  }
  getValue(editor) {
    // 保持默认
    return ''
  }
  isDisabled(editor) {
    // 保持默认
    return false
  }
  exec(editor, value) {
    // 菜单点击事件，这里将点击事件暴露出去
    if (this.isDisabled(editor)) {
      return
    }
    editor.emit('ImageMenuClick')
  }
  getPanelContentElem(editor) {
    const $list = $(`<ul class="w-e-panel-my-list">
        <li>北京</li>
        <li>上海</li>
        <li>深圳</li>
        <li>广州</li>
        <li>天津</li>
        <li>成都</li>
        <li>南京</li>
        <li>郑州</li>
      </ul>`)

    $list.on('click', 'li', function() {
      editor.insertText(this.innerHTML)
      editor.insertText(' ')
    })

    return $list[0]
  }
}

export default ImageMenu
