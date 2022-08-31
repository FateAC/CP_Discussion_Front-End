<template>
	<n-card
		class="bg-transparent bg-gradient-to-r from-viceGreen/65 to-viceBlue/65 rounded-xl py-5 px-5 text-center shadow-lg shadow-black/20 dark:shadow-lg dark:shadow-blue-400/40"
		m="x-auto t-12"
		max-w="2xl">
		<n-h1 font="extrabold">Hello, {{ userName }}</n-h1>
		<n-h3 m="x-12">在這裡你可以選擇你的課程</n-h3>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NH1, NH3 } from "naive-ui"
import { useStore } from "~/scripts/vuex"

const store = useStore()
const userName = store.state.username
</script>
