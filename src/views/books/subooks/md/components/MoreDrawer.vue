<template>
  <el-drawer
    v-model="props.moreDrawer"
    modal-class="moreDrawer-modal"
    custom-class="moreDrawer"
    title="I am the title"
    :with-header="false"
    :modal="false"
    size="304px"
  >
    <el-tabs v-model="moreDrawerTab" class="moreDrawerTab" @tab-click="handleClick">
      <el-tab-pane name="first">
        <template #label>
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
            class="larkui-icon larkui-icon-functionboard icon-svg moreFeaturesTab-module_icon_pSX83 index-module_size_wVASz"
            data-name="Functionboard"
            style="width: 18px; min-width: 18px; height: 18px;"
          >
            <path
              d="M74 32c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46Zm0 20c14.36 0 26 11.64 26 26s-11.64 26-26 26-26-11.64-26-26 11.64-26 26-26Zm16 84H58c-16.569 0-30 13.431-30 30v32c0 16.569 13.431 30 30 30h32c16.569 0 30-13.431 30-30v-32c0-16.569-13.431-30-30-30Zm0 20c5.523 0 10 4.477 10 10v32c0 5.523-4.477 10-10 10H58c-5.523 0-10-4.477-10-10v-32c0-5.523 4.477-10 10-10h32Zm108-20h-32c-16.569 0-30 13.431-30 30v32c0 16.569 13.431 30 30 30h32c16.569 0 30-13.431 30-30v-32c0-16.569-13.431-30-30-30Zm0 20c5.523 0 10 4.477 10 10v32c0 5.523-4.477 10-10 10h-32c-5.523 0-10-4.477-10-10v-32c0-5.523 4.477-10 10-10h32Zm23.598-99.213-18.385-18.385c-11.716-11.716-30.71-11.716-42.426 0l-18.385 18.385c-11.716 11.716-11.716 30.71 0 42.426l18.385 18.385c11.716 11.716 30.71 11.716 42.426 0l18.385-18.385c11.716-11.716 11.716-30.71 0-42.426Zm-14.142 14.142c3.905 3.905 3.905 10.237 0 14.142l-18.385 18.385c-3.905 3.905-10.237 3.905-14.142 0L156.544 85.07c-3.905-3.905-3.905-10.237 0-14.142l18.385-18.385c3.905-3.905 10.237-3.905 14.142 0l18.385 18.385Z"
              fill="currentColor"
              fill-rule="nonzero"
            ></path>
          </svg>
        </template>
        <div class="operate-tab">
          <div class="style-item noUse">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 20 26"
              xmlns="http://www.w3.org/2000/svg"
              class="larkui-icon larkui-icon-width docOperationTabContent-module_docIconWrapper_QVEbI"
            >
              <g transform="translate(1 1)" fill="none" fill-rule="evenodd">
                <rect stroke="#262626" stroke-width="1.2" fill="#FFF" width="18" height="24" rx="3.2"></rect>
                <rect fill="#D8D8D8" x="3.198" y="10.8" width="11.455" height="1.2" rx="0.6"></rect>
                <rect fill="#D8D8D8" x="3.198" y="14.8" width="11.455" height="1.2" rx="0.6"></rect>
                <rect fill="#D8D8D8" x="3.198" y="18.8" width="5.727" height="1.2" rx="0.6"></rect>
                <path
                  d="m13.017 3.615 1.362 1.523a.8.8 0 0 1 0 1.066l-1.362 1.523h0"
                  stroke="#2F81F4"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path d="M4.617 5.056h9.436a.6.6 0 0 1 0 1.2H4.617a.6.6 0 1 1 0-1.2Z" fill="#2F81F4"></path>
                <path
                  d="M5.038 3.615 3.676 5.138a.8.8 0 0 0 0 1.066l1.362 1.523h0"
                  stroke="#2F81F4"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
            <div class="item">
              <div class="title">文档样式</div>
              <div class="tip">设置正文大小、段间距、页面尺寸</div>
            </div>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              class="larkui-icon larkui-icon-arrow-right"
            >
              <path
                d="M101.005 198.563c-3.834-3.834-3.904-10.008-.21-13.927l.21-.215 48.99-48.99c3.834-3.834 3.904-10.008.21-13.927l-.21-.215-48.99-48.99c-3.905-3.905-3.905-10.237 0-14.142 3.834-3.834 10.008-3.904 13.927-.21l.215.21 48.99 48.99c11.599 11.598 11.715 30.331.348 42.072l-.348.354-48.99 48.99c-3.905 3.905-10.237 3.905-14.142 0Z"
                fill="currentColor"
                fill-rule="nonzero"
              ></path>
            </svg>
          </div>
          <div class="setting-item">
            <div class="item-top noUse">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-moresetting icon-svg docOperationTabContent-module_menuIcon_s1LqR index-module_size_wVASz"
                data-name="Moresetting"
              >
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h256v256H0z"></path>
                  <path
                    d="M130 53c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L130 73H38c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L38 53h92Zm88 65c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L218 138h-92c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L126 118h92Zm-90 44c5.43 0 9.848 4.327 9.996 9.72l.004.28v13h80c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L218 205h-80v13c0 5.523-4.477 10-10 10-5.43 0-9.848-4.327-9.996-9.72L118 218v-46c0-5.523 4.477-10 10-10Zm-44 23c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L84 205H39c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L39 185h45Zm87-155c5.43 0 9.848 4.327 9.996 9.72L181 40v13h37c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L218 73h-37v13c0 5.523-4.477 10-10 10-5.43 0-9.848-4.327-9.996-9.72L161 86V40c0-5.523 4.477-10 10-10ZM85 95c5.523 0 10 4.477 10 10v46l-.004.28C94.848 156.673 90.43 161 85 161c-5.523 0-10-4.477-10-10v-13H39l-.28-.004C33.327 137.848 29 133.43 29 128c0-5.523 4.477-10 10-10h36v-13l.004-.28C75.152 99.327 79.57 95 85 95Z"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </g>
              </svg>
              <div>文档设置</div>
            </div>
            <div class="hr"></div>
            <div class="item-list">
              <div class="item noUse" @click="noUse">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  class="larkui-icon larkui-icon-save-as-template icon-svg docOperationTabContent-module_menuIcon_s1LqR index-module_size_wVASz"
                  data-name="SaveAsTemplate"
                >
                  <path
                    d="m141.474 16.332.15.032.072.018.21.066 66.538 16.608c15.9 3.983 25.638 19.966 21.96 35.885l-.115.482-16.7 67.047c-3.273 13.189-14.811 22.147-27.727 22.735l23.12 40.732c7.088 12.488 2.711 28.357-9.777 35.446a26 26 0 0 1-12.834 3.388H96.02c-14.36 0-26-11.64-26-26a26 26 0 0 1 2.746-11.629C42.494 193.862 20 166.586 20 134.055c0-38.106 30.864-69 68.94-69 3.141 0 6.257.21 9.333.628l6.844-27.481c3.992-16.084 20.274-25.876 36.357-21.87Zm2.684 111.634a6 6 0 0 0-8.18 2.256L90.803 209.81a6 6 0 0 0 5.218 8.962h90.35a6 6 0 0 0 5.218-8.962l-45.175-79.587a6 6 0 0 0-2.256-2.256ZM88.94 85.055c-27.027 0-48.941 21.935-48.941 49 0 25.113 18.87 45.811 43.184 48.664l23.89-42.09C92.936 135.38 84.7 120.23 88.418 105.247l4.98-19.994c-1.474-.132-2.96-.2-4.457-.2Zm35.657-42.298-.071.27-16.7 67.047c-1.332 5.364 1.933 10.798 7.287 12.139l2.113.527 1.358-2.39c7.017-12.364 22.641-16.777 35.07-9.987l.375.21a26 26 0 0 1 9.777 9.776l9.268 16.33 9.387 2.342.152.032a9.988 9.988 0 0 0 11.495-7.138l.07-.271 16.7-67.046c1.332-5.365-1.933-10.798-7.286-12.14l-67.35-16.81-.15-.03a9.988 9.988 0 0 0-11.495 7.139Z"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </svg>
                <div>另存为模板</div>
              </div>
              <div class="item noUse" @click="noUse">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  class="larkui-icon larkui-icon-action-version icon-svg docOperationTabContent-module_menuIcon_s1LqR index-module_size_wVASz"
                  data-name="ActionVersion"
                >
                  <g fill="currentColor" fill-rule="nonzero">
                    <path
                      d="M128 25c56.885 0 103 46.115 103 103s-46.115 103-103 103S25 184.885 25 128c0-5.523 4.477-10 10-10s10 4.477 10 10c0 45.84 37.16 83 83 83s83-37.16 83-83-37.16-83-83-83c-25.335 0-48.78 11.41-64.455 30.702-3.482 4.286-9.78 4.938-14.067 1.455-4.286-3.483-4.937-9.78-1.455-14.067C67.457 39.172 96.577 25 128 25Z"
                    ></path>
                    <path
                      d="m123.04 116 42 .171c5.523.023 9.982 4.518 9.96 10.041-.023 5.43-4.367 9.83-9.761 9.956l-.28.003-42-.171c-5.523-.023-9.981-4.518-9.959-10.04.022-5.43 4.367-9.831 9.76-9.957l.28-.003Z"
                    ></path>
                    <path
                      d="M122.982 116c5.43-.01 9.856 4.309 10.014 9.702l.004.28.072 40c.01 5.523-4.46 10.008-9.982 10.018-5.43.01-9.856-4.31-10.014-9.702l-.004-.28-.072-40c-.01-5.523 4.46-10.008 9.982-10.018ZM107.693 81.272c-1.247 5.277-6.463 8.58-11.739 7.496l-.293-.065L48.522 77.56c-5.454-1.289-8.764-6.796-7.393-12.19l.08-.294 13.493-47.132c1.52-5.31 7.056-8.382 12.366-6.862 5.213 1.492 8.269 6.856 6.94 12.076l-.079.29-10.608 37.06 36.941 8.733c5.277 1.247 8.58 6.463 7.496 11.74l-.065.292Z"
                    ></path>
                  </g>
                </svg>
                <div>查看历史版本</div>
              </div>
              <div class="item " @click="handleExport">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  class="larkui-icon larkui-icon-action-version icon-svg docOperationTabContent-module_menuIcon_s1LqR index-module_size_wVASz"
                  data-name="ActionVersion"
                >
                  <g fill="currentColor" fill-rule="nonzero">
                    <path
                      d="M128 25c56.885 0 103 46.115 103 103s-46.115 103-103 103S25 184.885 25 128c0-5.523 4.477-10 10-10s10 4.477 10 10c0 45.84 37.16 83 83 83s83-37.16 83-83-37.16-83-83-83c-25.335 0-48.78 11.41-64.455 30.702-3.482 4.286-9.78 4.938-14.067 1.455-4.286-3.483-4.937-9.78-1.455-14.067C67.457 39.172 96.577 25 128 25Z"
                    ></path>
                    <path
                      d="m123.04 116 42 .171c5.523.023 9.982 4.518 9.96 10.041-.023 5.43-4.367 9.83-9.761 9.956l-.28.003-42-.171c-5.523-.023-9.981-4.518-9.959-10.04.022-5.43 4.367-9.831 9.76-9.957l.28-.003Z"
                    ></path>
                    <path
                      d="M122.982 116c5.43-.01 9.856 4.309 10.014 9.702l.004.28.072 40c.01 5.523-4.46 10.008-9.982 10.018-5.43.01-9.856-4.31-10.014-9.702l-.004-.28-.072-40c-.01-5.523 4.46-10.008 9.982-10.018ZM107.693 81.272c-1.247 5.277-6.463 8.58-11.739 7.496l-.293-.065L48.522 77.56c-5.454-1.289-8.764-6.796-7.393-12.19l.08-.294 13.493-47.132c1.52-5.31 7.056-8.382 12.366-6.862 5.213 1.492 8.269 6.856 6.94 12.076l-.079.29-10.608 37.06 36.941 8.733c5.277 1.247 8.58 6.463 7.496 11.74l-.065.292Z"
                    ></path>
                  </g>
                </svg>
                <div>导出...</div>
              </div>
              <div class="item noUse" @click="noUse">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  class="larkui-icon larkui-icon-action-copy icon-svg docOperationTabContent-module_menuIcon_s1LqR index-module_size_wVASz"
                  data-name="ActionCopy"
                >
                  <g fill="currentColor" fill-rule="nonzero">
                    <path
                      d="M198 28h-80c-16.569 0-30 13.431-30 30v80c0 16.569 13.431 30 30 30h80c16.569 0 30-13.431 30-30V58c0-16.569-13.431-30-30-30Zm-80 20h80c5.523 0 10 4.477 10 10v80c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10V58c0-5.523 4.477-10 10-10Z"
                    ></path>
                    <path
                      d="M97.6 88v20H58c-5.43 0-9.848 4.327-9.996 9.72L48 118v80c0 5.43 4.327 9.848 9.72 9.996L58 208h80c5.43 0 9.848-4.327 9.996-9.72L148 198v-40.705h20V198c0 16.403-13.164 29.731-29.504 29.996L138 228H58c-16.403 0-29.731-13.164-29.996-29.504L28 198v-80c0-16.403 13.164-29.731 29.504-29.996L58 88h39.6Z"
                    ></path>
                  </g>
                </svg>
                <div>复制...</div>
              </div>
              <div class="item noUse" @click="noUse">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  class="larkui-icon larkui-icon-action-move icon-svg docOperationTabContent-module_menuIcon_s1LqR index-module_size_wVASz"
                  data-name="ActionMove"
                >
                  <g fill="currentColor" fill-rule="nonzero">
                    <path
                      d="M81.148 29H44c-12.15 0-22 9.85-22 22v155c0 12.15 9.85 22 22 22h168c12.15 0 22-9.85 22-22V80c0-12.15-9.85-22-22-22h-89.53a6 6 0 0 1-4.171-1.686l-21.86-21.132A22 22 0 0 0 81.149 29ZM44 49h37.148a2 2 0 0 1 1.39.562l21.86 21.132A26 26 0 0 0 122.47 78H212a2 2 0 0 1 2 2v126a2 2 0 0 1-2 2H44a2 2 0 0 1-2-2V51a2 2 0 0 1 2-2Z"
                    ></path>
                    <path
                      d="M171.08 134.22c5.522 0 10 4.478 10 10 0 5.43-4.327 9.848-9.72 9.997l-.28.003H79.5c-5.523 0-10-4.477-10-10 0-5.429 4.327-9.847 9.72-9.996l.28-.004h91.58Z"
                    ></path>
                    <path
                      d="M137.618 100.228c3.835-3.834 10.008-3.904 13.927-.21l.216.21 22.696 22.696c11.599 11.6 11.715 30.332.348 42.073l-.348.354-23.019 23.019c-3.905 3.905-10.237 3.905-14.142 0-3.834-3.834-3.904-10.007-.21-13.927l.21-.215 23.019-23.02c3.834-3.833 3.904-10.007.21-13.926l-.21-.215-22.697-22.697c-3.905-3.905-3.905-10.237 0-14.142Z"
                    ></path>
                  </g>
                </svg>
                <div>移动...</div>
              </div>
              <div class="item delete" @click="handleDelete">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  class="larkui-icon larkui-icon-action-delete icon-svg docOperationTabContent-module_menuIcon_s1LqR index-module_size_wVASz"
                  data-name="ActionDelete"
                >
                  <path
                    d="M13.625 4.25a.625.625 0 1 1 0 1.25H12.59l-.385 6.746a2.125 2.125 0 0 1-1.97 1.999l-.152.005H5.917a2.125 2.125 0 0 1-2.122-2.004L3.41 5.5H2.375a.625.625 0 1 1 0-1.25h11.25ZM11.338 5.5H4.661l.382 6.675a.875.875 0 0 0 .768.819l.106.006h4.166a.875.875 0 0 0 .874-.825l.381-6.675ZM6.75 7c.345 0 .625.28.625.625v2.75a.625.625 0 1 1-1.25 0v-2.75c0-.345.28-.625.625-.625Zm2.5 0c.345 0 .625.28.625.625v2.75a.625.625 0 1 1-1.25 0v-2.75c0-.345.28-.625.625-.625Zm1.625-5.25a.625.625 0 1 1 0 1.25h-5.75a.625.625 0 1 1 0-1.25h5.75Z"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </svg>
                <div>删除...</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <template #label>
          <svg
            width="1.5em"
            height="1.5em"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
            class="larkui-icon larkui-icon-information icon-svg moreFeaturesTab-module_icon_pSX83 index-module_size_wVASz"
            data-name="Information"
            style="width: 18px; min-width: 18px; height: 18px;"
          >
            <path
              d="M128.5 15.5c62.408 0 113 50.592 113 113s-50.592 113-113 113-113-50.592-113-113 50.592-113 113-113Zm0 20c-51.362 0-93 41.638-93 93s41.638 93 93 93 93-41.638 93-93-41.638-93-93-93ZM131 113c5.523 0 10 4.477 10 10v62c0 5.523-4.477 10-10 10s-10-4.477-10-10v-52h-6c-5.523 0-10-4.477-10-10s4.477-10 10-10h16Zm-3-44c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14 6.268-14 14-14Z"
              fill="currentColor"
              fill-rule="nonzero"
            ></path>
          </svg>
        </template>
        <div class="detail-tab">
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-saveastemplate2 icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="Saveastemplate2"
              >
                <g fill="currentColor" fill-rule="evenodd">
                  <path
                    d="M186 16H70c-16.569 0-30 13.431-30 30v164c0 16.569 13.431 30 30 30h116c16.569 0 30-13.431 30-30V46c0-16.569-13.431-30-30-30ZM70 36h116c5.523 0 10 4.477 10 10v164c0 5.523-4.477 10-10 10H70c-5.523 0-10-4.477-10-10V46c0-5.523 4.477-10 10-10Z"
                    fill-rule="nonzero"
                  ></path>
                  <rect x="80" y="60" width="96" height="20" rx="10"></rect>
                  <rect x="80" y="108" width="96" height="20" rx="10"></rect>
                  <rect x="80" y="156" width="55" height="20" rx="10"></rect>
                </g>
              </svg>
              字数
            </div>
            <div class="item-right">22</div>
          </div>
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-action-version icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="ActionVersion"
              >
                <g fill="currentColor" fill-rule="nonzero">
                  <path
                    d="M128 25c56.885 0 103 46.115 103 103s-46.115 103-103 103S25 184.885 25 128c0-5.523 4.477-10 10-10s10 4.477 10 10c0 45.84 37.16 83 83 83s83-37.16 83-83-37.16-83-83-83c-25.335 0-48.78 11.41-64.455 30.702-3.482 4.286-9.78 4.938-14.067 1.455-4.286-3.483-4.937-9.78-1.455-14.067C67.457 39.172 96.577 25 128 25Z"
                  ></path>
                  <path
                    d="m123.04 116 42 .171c5.523.023 9.982 4.518 9.96 10.041-.023 5.43-4.367 9.83-9.761 9.956l-.28.003-42-.171c-5.523-.023-9.981-4.518-9.959-10.04.022-5.43 4.367-9.831 9.76-9.957l.28-.003Z"
                  ></path>
                  <path
                    d="M122.982 116c5.43-.01 9.856 4.309 10.014 9.702l.004.28.072 40c.01 5.523-4.46 10.008-9.982 10.018-5.43.01-9.856-4.31-10.014-9.702l-.004-.28-.072-40c-.01-5.523 4.46-10.008 9.982-10.018ZM107.693 81.272c-1.247 5.277-6.463 8.58-11.739 7.496l-.293-.065L48.522 77.56c-5.454-1.289-8.764-6.796-7.393-12.19l.08-.294 13.493-47.132c1.52-5.31 7.056-8.382 12.366-6.862 5.213 1.492 8.269 6.856 6.94 12.076l-.079.29-10.608 37.06 36.941 8.733c5.277 1.247 8.58 6.463 7.496 11.74l-.065.292Z"
                  ></path>
                </g>
              </svg>
              历史版本
            </div>
            <div class="item-right">22</div>
          </div>
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 257"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-date icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="Date"
              >
                <g fill="currentColor" fill-rule="nonzero">
                  <path
                    d="M197 35c17.673 0 32 14.327 32 32v130c0 17.673-14.327 32-32 32H59c-17.673 0-32-14.327-32-32V67c0-17.673 14.327-32 32-32h138Zm0 20H59c-6.525 0-11.834 5.209-11.996 11.695L47 67v130c0 6.525 5.209 11.834 11.695 11.996L59 209h138c6.525 0 11.834-5.209 11.996-11.695L209 197V67c0-6.525-5.209-11.834-11.695-11.996L197 55Z"
                  ></path>
                  <path d="M47 90h162v20H47z"></path>
                  <rect x="77" y="17" width="20" height="56" rx="10"></rect>
                  <rect x="160" y="17" width="20" height="56" rx="10"></rect>
                </g>
              </svg>
              创建时间
            </div>
            <div class="item-right">今天 09:34</div>
          </div>
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 257"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-date icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="Date"
              >
                <g fill="currentColor" fill-rule="nonzero">
                  <path
                    d="M197 35c17.673 0 32 14.327 32 32v130c0 17.673-14.327 32-32 32H59c-17.673 0-32-14.327-32-32V67c0-17.673 14.327-32 32-32h138Zm0 20H59c-6.525 0-11.834 5.209-11.996 11.695L47 67v130c0 6.525 5.209 11.834 11.695 11.996L59 209h138c6.525 0 11.834-5.209 11.996-11.695L209 197V67c0-6.525-5.209-11.834-11.695-11.996L197 55Z"
                  ></path>
                  <path d="M47 90h162v20H47z"></path>
                  <rect x="77" y="17" width="20" height="56" rx="10"></rect>
                  <rect x="160" y="17" width="20" height="56" rx="10"></rect>
                </g>
              </svg>
              更新时间
            </div>
            <div class="item-right">今天 12:47</div>
          </div>
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 257"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-assignee icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="Assignee"
              >
                <path
                  d="M128.017 129c27.925.016 52.78 7.159 71.454 19.489 17.435 11.512 28.304 26.962 28.522 41.675l.007 1.548c0 4.346-.335 7.598-1.626 11.45l-.182.53-.173.475c-1.768 4.74-4.76 8.817-9.107 11.828l-.439.298-.13.084-.338.238c-1.953 1.354-4.223 2.54-6.822 3.579l-.656.256-.832.31c-.632.227-1.282.448-1.95.66l-.673.211-.918.273-.466.133-.472.131-.96.256-.488.124-.494.123-1.004.238c-.45.104-.908.206-1.372.305l-.7.148-1.07.214-.542.104-.549.102-1.113.2-1.136.19-1.158.184-1.18.176-1.203.17-1.225.161-1.248.155-1.271.148-1.294.142-1.316.134-1.34.129-1.362.122-1.386.115-2.121.163-1.444.1-1.467.095-2.245.132-1.526.081-1.55.076-1.573.07-1.598.066-1.621.06-2.477.082-2.515.072-2.477.06-1.805.035-2.295.037-3.85.043-3.11.02-6.433.014L128.1 227l-.137-.002-.136.002-11.598.014-6.434-.014-3.11-.02-3.85-.043-2.294-.037-1.806-.036-2.476-.06-2.515-.07-2.478-.082-1.62-.061-1.598-.065-1.574-.071-1.55-.076-1.526-.08-2.244-.133-1.467-.095-1.444-.1-2.122-.163-1.386-.115-1.362-.122-1.34-.129-1.316-.134-1.293-.142-1.271-.148-1.248-.155-1.226-.162-1.202-.169-1.18-.176-1.159-.184-1.135-.19-1.114-.2c-.367-.067-.731-.136-1.091-.206l-1.07-.214a89.329 89.329 0 0 1-2.072-.453l-1.004-.238c-.33-.081-.658-.164-.981-.247l-.96-.256c-.317-.086-.63-.175-.94-.264l-.916-.273a55.46 55.46 0 0 1-2.623-.872l-.832-.309c-2.875-1.098-5.363-2.368-7.478-3.835l-.338-.238-.13-.084c-4.586-3.038-7.72-7.229-9.547-12.126l-.172-.476c-1.443-4.088-1.809-7.435-1.809-11.98l.004-1.096c0-14.848 10.912-30.497 28.525-42.126 18.462-12.19 42.965-19.31 70.503-19.486l1.06-.003Zm-.054 19.999-.866.004c-23.747.149-44.463 6.166-59.622 16.176-12.362 8.162-19.354 18.06-19.54 25.146l-.008.911v.397l.005.747c.034 2.031.212 3.378.664 4.658.4 1.136.947 1.914 1.804 2.514l.203.135.294.186.28.207c.604.443 1.371.869 2.296 1.275l.475.201.501.198.527.195.274.096.565.19.743.233.781.227.654.178.678.175.703.171.726.168.751.164.775.16 1.207.235 1.26.226.869.147.891.142.915.14.937.134 1.447.196.993.126 1.015.122 1.563.176 1.61.167 1.101.107 1.69.153 1.153.096 1.173.093 1.798.132 1.842.122 1.888.113 1.93.104 1.312.064 1.33.06 2.031.082 2.073.073 1.886.057 2.338.061 3.948.08 1.803.027 3.794.04 3.624.02 5.876.008 11.08-.015 11 .015 5.877-.009 3.623-.02 3.794-.039 1.803-.027 3.948-.08 2.338-.061 1.887-.057 2.072-.073 2.03-.082 1.331-.06 1.312-.064 1.93-.104 1.888-.113 1.843-.122 1.797-.132 1.174-.093 1.152-.096 1.69-.153 1.1-.107 1.612-.167 1.562-.176 1.015-.122.993-.126 1.447-.196.938-.135.914-.139.892-.142.868-.147 1.26-.226 1.207-.234.775-.161.75-.164.728-.168.702-.171.678-.175.654-.178.933-.273.591-.187.703-.238.663-.243.501-.198.476-.201c.809-.356 1.497-.726 2.061-1.11l.234-.165.28-.207.294-.186.204-.135c.856-.6 1.403-1.378 1.804-2.514.421-1.194.605-2.447.654-4.261l.009-.397.006-.747-.008-1.308c-.187-7.086-7.178-16.984-19.54-25.146-15.16-10.01-35.876-16.027-59.622-16.176l-.867-.004ZM128 24c25.405 0 46 20.595 46 46s-20.595 46-46 46-46-20.595-46-46 20.595-46 46-46Zm0 20c-14.36 0-26 11.64-26 26s11.64 26 26 26 26-11.64 26-26-11.64-26-26-26Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </svg>
              作者
            </div>
            <div class="item-right">就叫小黄好了</div>
          </div>
          <div class="hr"></div>
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-nav-book1 icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="NavBook1"
              >
                <path
                  d="M22 55.923c0-20.374 12.5-34.899 34.209-33.872l7.16.35c21.097 1.105 33.884 3.047 45.317 8.203 7.507 3.385 13.36 7.001 18.113 11.262 2.59-2.381 5.672-4.447 9.245-6.305.39-.202.777-.4 1.164-.592l.581-.286c3.791-1.844 7.755-3.345 14.813-5.762l2.27-.772c13.594-4.554 24.405-6.007 43.589-6.104l1.795-.006C223.044 22.023 234 35.21 234 55.923V183.3c0 18.725-15.066 33.883-33.736 33.883h-39.062c-3.543 0-8.873 1.224-13.46 3.215-4.311 1.872-7.11 4.07-7.58 5.172-1.905 4.485-5.647 8.022-10.87 8.4-1.65.12-3.262-.125-4.745-.685-1.727-.437-3.326-1.274-4.706-2.415-1.771-1.464-3.093-3.331-4.095-5.511-.187-.406-.807-1.134-1.89-1.994-1.366-1.086-3.208-2.167-5.351-3.123-4.274-1.905-9.196-3.058-12.579-3.058h-40.19C37.066 217.184 22 202.024 22 183.3ZM200.27 42.04h-.826c-18.05.05-26.96 1.246-38.765 5.258l-.528.18c-13.463 4.596-18.806 7.229-21.213 10.666l-.017 144.233c6.944-3.227 14.845-5.112 21.832-5.19l.45-.002h39.06c7.598 0 13.737-6.177 13.737-13.884l-.001-127.72c-.064-10.134-3.02-13.548-13.728-13.54Zm-145.358-.024C45.845 41.705 42 46.295 42 55.923V183.3c0 7.707 6.139 13.883 13.736 13.883h40.19c6.781 0 14.423 1.81 21.168 4.949l-.015-141.459c-3.533-4.588-8.243-8.004-16.066-11.588l-.548-.25c-8.458-3.813-19.447-5.482-38.13-6.46l-1.774-.092Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </svg>
              阅读数
            </div>
            <div class="item-right">0</div>
          </div>
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-comment-reply icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="CommentReply"
              >
                <path
                  d="M8 1.063a6.937 6.937 0 1 1 0 13.874H1.937a.625.625 0 0 1-.526-.961l1.105-1.727-.017-.02a6.91 6.91 0 0 1-1.436-4.177V8A6.938 6.938 0 0 1 8 1.062Zm0 1.25a5.688 5.688 0 0 0-4.245 9.472c.187.21.211.517.06.753l-.735 1.15H8a5.688 5.688 0 0 0 5.687-5.594V8A5.688 5.688 0 0 0 8 2.312Zm.938 6.562a.625.625 0 1 1 0 1.25h-3.75a.625.625 0 1 1 0-1.25h3.75Zm1.874-3a.625.625 0 1 1 0 1.25H5.189a.625.625 0 1 1 0-1.25h5.625Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </svg>
              评论数
            </div>
            <div class="item-right">0</div>
          </div>
          <div class="detail-tab-items">
            <div class="item-left">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-like icon-svg docInfoTabContent-module_infoIcon_1fIbt index-module_size_wVASz"
                data-name="Like"
              >
                <path
                  d="M147.827 20.644c10.18 1.9 18.546 7.8 22.546 17.499 3.302 8.003 3.163 18.086.7 30.171-1.146 5.621-2.777 11.51-4.783 17.579-.19.572-.38 1.14-.573 1.707l-.18.523h41.237c16.403 0 29.732 13.163 29.998 29.503l.004.496c0 2.868-.411 5.722-1.221 8.473l-21.484 72.987c-6.011 20.423-24.757 34.447-46.046 34.447H73c-.256 0-.51-.01-.761-.029H54c-16.569 0-30-13.431-30-30v-87c0-16.569 13.431-30 30-30l28.087-.001c16.584-35.788 30.038-56.442 42.27-63.188 6.293-3.47 15.282-4.694 23.47-3.167Zm-13.812 20.68c-7.531 4.154-20.26 24.271-36.014 58.954L98 214.028h70.025a28 28 0 0 0 26.86-20.093l21.484-72.987a10 10 0 0 0 .407-2.825c0-5.523-4.478-10-10.001-10h-55.706c-6.994 0-11.8-6.98-9.374-13.483l1.016-2.53a248.67 248.67 0 0 0 1.308-3.33 204.313 204.313 0 0 0 3.281-9.163c1.776-5.373 3.203-10.524 4.176-15.296 1.736-8.52 1.827-15.114.409-18.552-1.201-2.91-3.776-4.727-7.726-5.464-3.789-.707-8.07-.124-10.144 1.02ZM78 107H54c-5.43 0-9.848 4.327-9.996 9.72L44 117v87c0 5.523 4.477 10 10 10h24V107Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </svg>
              点赞数
            </div>
            <div class="item-right">0</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { downloadFile } from '@/utils/file.js'
import { deleteTopics } from '@/api/forum.js'

const props = defineProps({
  moreDrawer: {
    type: Boolean,
    default: false
  },
  // 节点id
  id: {
    type: Number,
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const router = useRouter()
const store = useStore()
const moreDrawerTab = ref('first')
const arctileId = ref(route.query.tid || route.query.mid || null) // 文章id
const categoryId = ref(route.query.category || null) // 父节点id

const handleDelete = () => {
  if (props.author !== sessionStorage.getItem('username')) {
    return ElMessage.error('非作者暂无删除文章权限')
  }
  ElMessageBox.confirm(`确认删除 【${props.title}】 ？`, '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteTopics(props.id).then(async res => {
        if (res.code === 1000) {
          ElMessage.success('删除成功!')
          await store.commit('books/SET_REFRESH', true)
          sessionStorage.setItem('deleteNode', JSON.stringify(res.data))
          router.push({ name: 'subbooks', params: { wRefresh: true } })
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消操作')
    })
}

const handleExport = () => {
  ElMessageBox.confirm(`确认导出 【${props.title}】 ？`, '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(() => {
      handleDownload(route.query.wid)
    })
    .catch(() => {
      ElMessage.info('取消操作')
    })
}

// 下载预览文件
const handleDownload = async id => {
  downloadFile.judgeType(id)
}

const handleClick = () => {}

const noUse = () => {
  ElMessage.info('暂未开放')
}
</script>

<style lang="scss" scoped>
.moreDrawer {
  .el-drawer__body {
    padding: 0 !important;
    .moreDrawerTab {
      .el-tabs__nav-scroll {
        width: 100%;
      }
      .el-tabs__header {
        margin-bottom: 0px;
      }
      .el-tabs__nav {
        width: 100%;
        display: flex;
        justify-content: space-around;
        .el-tabs__item {
          padding-left: 0;
          padding-right: 0;
          display: flex;
          align-items: center;
          svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      }
      .detail-tab {
        padding: 12px 20px 0 20px;
        .detail-tab-items {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 20px;
          font-size: 15px;
          font-family: Consolas;
          color: #262626;
          svg {
            width: 16px;
            height: 16px;
            margin-right: 12px;
          }
          .item-left {
            display: flex;
            align-items: center;
          }
        }
        .hr {
          height: 1px;
          background: rgba(0, 0, 0, 0.04);
          margin: 20px 0;
        }
      }
      .operate-tab {
        padding: 12px 20px 0 20px;
        .noUse {
          cursor: not-allowed !important;
          div {
            color: #c0c4cc !important;
          }
          svg {
            color: #c0c4cc !important;
          }
        }
        .style-item {
          box-sizing: border-box;
          margin-top: 20px;
          height: 70px !important;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fafafa;
          border-radius: 8px;
          cursor: pointer;
          svg {
            width: 18px !important;
            height: 24px !important;
          }
          .item {
            margin-left: 12px;
            .title {
              line-height: 22px;
            }
            .tip {
              font-size: 10px;
              line-height: 17px;
              color: #8a8f8d;
            }
          }
        }
        .setting-item {
          margin-top: 8px;
          background-color: #fafafa;
          border-radius: 8px;
          padding: 8px;
          .noUse {
            cursor: not-allowed !important;
            div {
              color: #c0c4cc !important;
            }
            svg {
              color: #c0c4cc !important;
            }
          }
          .item-top {
            display: flex;
            align-items: center;
            height: 36px !important;
            line-height: 36px !important;
            padding: 10px 8px;
            box-sizing: border-box;
            border-radius: 6px;
            cursor: pointer;
            svg {
              width: 18px;
              height: 18px;
            }
            div {
              font-size: 14px;
              color: #262626;
              margin-left: 8px;
            }
            &:hover {
              background-color: #eff0f0;
            }
          }
          .hr {
            height: 1px;
            margin: 4px 8px;
            background-color: #eff0f0;
          }
          .item-list {
            .noUse {
              cursor: not-allowed !important;
              div {
                color: #c0c4cc !important;
              }
              svg {
                color: #c0c4cc !important;
              }
            }
            .item {
              display: flex;
              align-items: center;
              height: 36px !important;
              padding: 10px 8px !important;
              border-radius: 6px;
              cursor: pointer;
              svg {
                width: 18px;
                height: 18px;
              }
              div {
                font-size: 14px;
                color: #262626;
                margin-left: 8px;
                height: 16px;
                line-height: 16px;
              }
              &:hover {
                background-color: #eff0f0;
              }
            }
            .delete {
              color: #df2a3f !important;
              div {
                color: #df2a3f !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.moreDrawer {
  position: fixed !important;
  top: 105px !important;
  right: 18px !important;
  .el-drawer__body {
    padding: 0 !important;
    .moreDrawerTab {
      .el-tabs__nav-scroll {
        width: 100%;
      }
      .el-tabs__header {
        margin-bottom: 0px;
      }
      .el-tabs__nav {
        height: 44px !important;
        width: 100%;
        display: flex;
        justify-content: space-around;
        .el-tabs__item {
          padding-left: 0;
          padding-right: 0;
          display: flex;
          align-items: center;
          svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      }
      .detail-tab {
        padding: 12px 20px 0 20px;
        .detail-tab-items {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 20px;
          font-size: 15px;
          font-family: Consolas;
          color: #262626;
          svg {
            width: 16px;
            height: 16px;
            margin-right: 12px;
          }
          .item-left {
            display: flex;
            align-items: center;
          }
        }
        .hr {
          height: 1px;
          background: rgba(0, 0, 0, 0.04);
          margin: 20px 0;
        }
      }
      .operate-tab {
        padding: 12px 20px 0 20px;
        .style-item {
          box-sizing: border-box;
          margin-top: 20px;
          height: 70px !important;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fafafa;
          border-radius: 8px;
          cursor: pointer;
          svg {
            width: 18px !important;
            height: 24px !important;
          }
          .item {
            margin-left: 12px;

            .title {
              line-height: 22px;
            }
            .tip {
              font-size: 10px;
              line-height: 17px;
              color: #8a8f8d;
            }
          }
        }
        .setting-item {
          margin-top: 8px;
          background-color: #fafafa;
          border-radius: 8px;
          padding: 8px;
          .item-top {
            display: flex;
            align-items: center;
            height: 36px !important;
            line-height: 36px !important;
            padding: 10px 8px;
            box-sizing: border-box;
            border-radius: 6px;
            cursor: pointer;
            svg {
              width: 18px;
              height: 18px;
            }
            div {
              font-size: 14px;
              color: #262626;
              margin-left: 8px;
            }
            &:hover {
              background-color: #eff0f0;
            }
          }
          .hr {
            height: 1px;
            margin: 4px 8px;
            background-color: #eff0f0;
          }
          .item-list {
            .item {
              display: flex;
              align-items: center;
              height: 36px !important;
              padding: 10px 8px !important;
              border-radius: 6px;
              cursor: pointer;
              svg {
                width: 18px;
                height: 18px;
              }
              div {
                font-size: 14px;
                color: #262626;
                margin-left: 8px;
                height: 16px;
                line-height: 16px;
              }
              &:hover {
                background-color: #eff0f0;
              }
            }
            .delete {
              color: #df2a3f !important;
              div {
                color: #df2a3f !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
