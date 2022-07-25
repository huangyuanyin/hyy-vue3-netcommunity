<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes"
            :collapse="collapse" nique-opened router>
            <el-menu-item index="/dashboard">
                <el-icon><House /></el-icon>
                <template #title>概览</template>
            </el-menu-item>
            <el-menu-item index="/note" disabled>
                <el-icon><Notebook /></el-icon>
                <template #title>小记</template>
            </el-menu-item>
            <el-menu-item index="/topics" disabled>
                <el-icon><Collection /></el-icon>
                <template #title>收藏</template>
            </el-menu-item>
            <el-menu-item index="/books">
                <el-icon><Files /></el-icon>
                <template #title>我的知识库</template>
            </el-menu-item>
            <el-menu-item index="/tag">
                <el-icon><PriceTag /></el-icon>
                <template #title>标签</template>
            </el-menu-item>
            <el-menu-item index="/trash" disabled>
                <el-icon><Delete /></el-icon>
                <template #title>回收站</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from 'vue-router'
export default {
    setup() {
        const route = useRoute();

        const onRoutes = computed(() => {
            return route.path
        });

        const store = useStore();
        const collapse = computed(() => store.getters.collapse);

        return {
            onRoutes,
            collapse
        };
    },
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 280px;
}
.sidebar > ul {
    height: 100%;
}
</style>