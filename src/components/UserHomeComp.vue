<template>
	<n-card m="x-auto t-12" max-w="2xl">
		<n-h1 font="extrabold">Hello, {{ userName }}</n-h1>
		<n-h3 m="x-12">在這裡你可以選擇你的課程</n-h3>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NH1, NH3 } from "naive-ui"
import { ref } from "vue"

const userName = ref("User")
</script>
