<template>
    <n-layout-content has-sider position="absolute" style="top:64px">
        <SidebarComp></SidebarComp>
        <ContentComp></ContentComp>
    </n-layout-content>
</template>

<script setup lang="ts">
import SidebarComp from "~/components/SidebarComp.vue"
import ContentComp from "~/components/ContentComp.vue"
import { NLayoutContent } from "naive-ui"
</script>
