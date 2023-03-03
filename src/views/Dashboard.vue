<!--
  * @Description: 平台首页
  * @Author: maxf
  * @Date: 2021-12-12 22:49:29
  * @LastEditors: maxf
  * @LastEditTime: 2022-03-25 18:54:07
  * @FilePath: \vue3-netforum\src\Dashboard.vue
-->
<template>
  <div style="height: 100%;">
    <el-card shadow="never" style="height: 100%;">
      <span class="spantop">推荐话题</span>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-carousel :interval="4000" type="card" class="carousel">
            <el-carousel-item v-for="(item, index) in topics" :key="index">
              <el-card :body-style="{ padding: '0px' }">
                <el-image :src="item.url" fit="cover" class="image"></el-image>
                <!-- <img :src="item.url" class="image"/> -->
                <div style="padding: 14px">
                  <span>{{ item.title }}</span>
                  <div class="bottom">
                    <el-button circle size="small">
                      <el-icon><star /></el-icon>
                    </el-button>
                    <el-button type="text" class="button">11 人关注</el-button>
                  </div>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="10" :offset="2">
          <el-table :data="popularData" highlight-current-row size="large">
            <el-table-column label="热门内容">
              <template #default="scope">
                <el-button text type="primary" @click="handleOpen(scope.row.id)">
                  {{ scope.row.title }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="10">
          <el-table :data="myData" highlight-current-row size="large">
            <el-table-column label="我的关注">
              <template #default="scope">
                <el-button text type="primary" @click="handleOpen(scope.row.id)">
                  {{ scope.row.title }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getForum } from '@/api/forum.js'
export default {
  setup() {
    const router = useRouter()
    const topics = ref([
      {
        url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        title: 'Bug反馈'
      },
      {
        url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        title: '技术分享'
      },
      {
        url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        title: '产品信息'
      },
      {
        url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        title: '日常工作'
      },
      {
        url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        title: '技术支持'
      },
      {
        url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        title: '其他'
      }
    ])

    // 热门内容数据
    const popularData = ref([])
    // 关注数据
    const myData = ref([])

    // 获取热门数据
    const getPopular = () => {
      let params = {
        views: 'reverse'
      }
      getForum(params).then(res => {
        popularData.value = res.data
      })
    }

    // 获取热门数据
    const getMyData = () => {
      let params = {
        author: sessionStorage.getItem('username')
      }
      getForum(params).then(res => {
        myData.value = res.data
      })
    }

    getPopular()
    getMyData()

    // 查看文章
    const handleOpen = id => {
      // router.push({name: 'detail', params: { id: id,  refreshData: true}} );
    }

    return {
      popularData,
      myData,
      topics,
      getPopular,
      handleOpen
    }
  }
}
</script>

<style scoped>
.spantop {
  margin-left: 9%;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  color: #606266;
}

.carousel {
  height: 400px;
}
.el-row {
  margin-top: 15px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button {
  padding: 0;
  min-height: auto;
}
.image {
  height: 300px;
  width: 100%;
  display: block;
}
</style>
