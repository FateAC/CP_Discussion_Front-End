<template>
    <n-layout-content has-sider position="absolute">
        <sidebar-comp></sidebar-comp>
        <content-comp></content-comp>
    </n-layout-content>
</template>

<script setup lang="ts">
import SidebarComp from "~/components/SidebarComp.vue"
import ContentComp from "~/components/ContentComp.vue"
import { NLayoutContent } from "naive-ui"
</script>
