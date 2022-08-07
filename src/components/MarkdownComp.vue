<template>
	<div class="markdown-body" v-html="mdResult" />
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import md from "~/scripts/markdown"
import "~/styles/markdown.css"
import lineNum from "~/scripts/codeblockLineNum"

onMounted(() => {
	lineNum()
})

const props = defineProps({
	mdURL: String,
})

const getMDFile = async () => {
	return fetch(props["mdURL"] ?? "")
		.then((response) => response.text())
		.then((data) => {
			return data
		})
}
let mdResult = md.render(await getMDFile())
</script>
