<script setup lang="ts">
import { NLayoutFooter } from "naive-ui"

const copyright = new Date().getFullYear()
</script>

<template>
    <n-layout-footer w="full" h="16" m="x-auto" text="lg center" bordered position="absolute">
        <span style="line-height: 3em;">Copyright &copy; {{ copyright }} FateAC</span>
    </n-layout-footer>
</template>
