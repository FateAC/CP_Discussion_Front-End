<template>
	<n-layout position="absolute" style="width:70%; margin-left:15%; margin-right:15%;" content-style="padding:24px;">
		<n-space vertical>
			<slot></slot>
		</n-space>
	</n-layout>
</template>
<script setup lang="ts">
import {
	NLayout,
	NSpace,
} from "naive-ui"
// const isLogin = useLoginStore()
// 

</script>
