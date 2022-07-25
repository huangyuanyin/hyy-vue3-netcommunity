<!--
  * @Description: Home页面
  * @Author: maxf
  * @Date: 2021-12-12 22:49:29
  * @LastEditors: maxf
  * @LastEditTime: 2022-03-25 18:54:07
  * @FilePath: \vue3-netforum\src\Home.vue
-->
<template>
    <div class="about">
        <v-header />
        <v-sidebar v-if="!siderbar" />
        <vSidebarNode v-if="siderbar" />
        <div class="content-box" :class="{'content-collapse': collapse}">
            <div class="content">
                <router-view v-slot="{ Component }">
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
        const collapse = computed(() => 
            store.getters.collapse
        );
        const siderbar = computed(() => 
          store.getters.siderbar
        );

        return {
            collapse,
            siderbar
        }
    },
}
</script>