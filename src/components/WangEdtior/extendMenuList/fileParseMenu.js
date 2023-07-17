class fileParseMenu {
  constructor() {
    this.title = '文件解析'
    this.tag = 'button'
    this.iconSvg =
      '<svg  t="1689141189928" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11798" width="300" height="300"><path d="M511.6 98C282.3 98 95.7 284.6 95.7 513.8c0 229.3 186.6 415.8 415.8 415.8 229.3 0 415.8-186.5 415.8-415.8C927.4 284.6 740.8 98 511.6 98z m0 805.4C296.8 903.4 122 728.6 122 513.8s174.8-389.6 389.6-389.6S901.2 299 901.2 513.8c-0.1 214.8-174.9 389.6-389.6 389.6z m1.6-735l-1.6-7.3c-194.9 0-352.8 158-352.8 352.8h14.1c0-187.1 151.6-338.7 338.7-338.7l1.6-6.8z m-91.2 204c-33.2 57.5-34.5 138.9-3.1 193.6 1.9 3.4 5.5 5.3 9.1 5.3 1.8 0 3.6-0.5 5.2-1.4 5-2.9 6.8-9.3 3.9-14.3-31.7-55.1-22.5-128.6 3-172.7 17.1-29.6 40.9-45.8 66.9-45.8 75.3 0 92.3 95.3 92.9 99.4 1 5.7 6 9.7 12.1 8.6 5.7-1 9.6-6.4 8.6-12.1-6.8-40.4-39.2-116.9-113.6-116.9-33.8 0-64 20-85 56.3z m143.5 228c-5.1-2.9-11.5-1.2-14.3 3.8-31.9 55-100 83.8-151 83.8h-0.1c-34.2-0.1-60.1-12.4-73.2-35-37.6-65.2 36.4-127.6 39.6-130.2 4.5-3.7 5.1-10.3 1.4-14.8-3.8-4.5-10.3-5.1-14.8-1.4-31.7 26-81.7 92.4-44.4 156.8 16.9 29.3 49.3 45.5 91.2 45.5h0.2c66.3 0 137.4-39.6 169-94.2 3.2-5 1.5-11.4-3.6-14.3z m-18.2-140.7c-5.8 0-10.5 4.7-10.5 10.5s4.7 10.5 10.5 10.5c63.6 0.1 122.6 44.8 148 89 17.1 29.6 19.3 58.3 6.3 80.9-37.7 65.1-128.7 32.1-132.5 30.7-5.5-2.1-11.5 0.7-13.5 6.1-2 5.4 0.7 11.5 6.1 13.5 15.2 5.7 37.3 10.7 60.8 10.7 35.8 0 74.7-11.7 97.2-50.7 16.9-29.3 14.7-65.5-6.3-101.8-33.1-57.4-103-99.3-166.1-99.4z" fill="#2c2c2c" p-id="11799"></path></svg>'
    this.showModal = true
    this.modalWidth = 300
  }

  isActive(editor) {
    return false
  }
  getValue(editor) {
    return ''
  }
  isDisabled(editor) {
    return false
  }
  exec(editor, value) {
    // 菜单点击事件，这里将点击事件暴露出去
    // if (this.isDisabled(editor)) {
    //   return
    // }
    // editor.emit('fileParseMenuClick')
  }
  getModalPositionNode(editor) {
    return null // modal 依据选区定位
  }
  getModalContentElem(editor) {
    const $container = $('<div></div>')

    const inputId = `input-${Math.random()
      .toString(16)
      .slice(-8)}`
    const buttonId = `button-${Math.random()
      .toString(16)
      .slice(-8)}`

    const $inputContainer = $(`<label class="babel-container">
        <span>文件解析</span>
        <input type="file" id="${inputId}" accept=".docx,.md" id="fileInput" @change="loadMd" class="uploadInput" />
      </label>`)
    const $buttonContainer = $(`<div class="button-container">
        <button id="${buttonId}">开始解析</button>
      </div>`)

    $container.append($inputContainer).append($buttonContainer)

    $container.on('click', `#${buttonId}`, e => {
      e.preventDefault()

      // const text = $(`#${inputId}`).val()
      // if (!text) return

      editor.restoreSelection() // 恢复选区
      // editor.insertText(text)
      // editor.insertText(' ')
    })

    setTimeout(() => {
      $(`#${inputId}`).focus()
    })

    return $container[0]

    // PS：也可以把 $container 缓存下来，这样不用每次重复创建、重复绑定事件，优化性能
  }
}

export default fileParseMenu
