<script setup lang="ts">
import { NLayoutFooter } from "naive-ui"

const copyright = new Date().getFullYear()
</script>

<template>
    <n-layout-footer class="flex" w="full" h="16" position="absolute" bordered>
        <span m="auto" text="lg">Copyright &copy; {{ copyright }} FateAC</span>
    </n-layout-footer>
</template>