<template>
    <div class="about">
        <v-header />
        <v-sidebar v-if="!siderbar" />
        <vSidebarNode v-if="siderbar" />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <div class="content">
                <router-view v-slot="{ Component }" :key="route.fullPath">
                    <transition name="move" mode="out-in">
                        <keep-alive>
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { useStore } from "vuex";
import vHeader from "../components/Header.vue"
import vSidebar from "../components/Sidebar.vue"
import vSidebarNode from "../components/SidebarNode.vue"
export default {
    components: {
        vHeader,
        vSidebar,
        vSidebarNode
    },
    setup() {
        const store = useStore();
        const route = useRoute()
        const collapse = computed(() =>
            store.getters.collapse
        );
        const siderbar = computed(() =>
            store.getters.siderbar
        );

        return {
            collapse,
            siderbar,
            route
        }
    },
}
</script>

<style lang="scss" scoped>
:deep(.v-note-show) {
    height: 100vh;
}

.content-box {
    height: 100%;
}
</style>