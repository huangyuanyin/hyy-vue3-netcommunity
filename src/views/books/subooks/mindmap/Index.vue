<template>
  <div id="wrapper">
    <div>
      <div style="width: 600px; height: 400px" id="minder-container"></div>
    </div>
  </div>
</template>

<script>
import kity from "kity";
import kityminder from "kityminder-core";

export default {
  data() {
    return {};
  },
  mounted() {
    this.naotu();
  },
  methods: {
    naotu() {
      this.km = new window.kityminder.Minder({
        renderTo: "#minder-container",
      });
      this.km.importJson({
        root: {
          data: {
            text: "test111",
          },
          children: [
            { data: { text: "新闻" } },
            { data: { text: "网页" } },
            { data: { text: "贴吧" } },
            { data: { text: "知道" } },
            { data: { text: "音乐" } },
            { data: { text: "图片" } },
            { data: { text: "视频" } },
            { data: { text: "地图" } },
            { data: { text: "百科", expandState: "collapse" } },
          ],
        },
        template: "default",
      });
    },
  },
};


</script>

<style>
#wrapper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
