<template>
	<n-layout position="absolute">
		<n-space vertical>
			<content-comp style="height:50%; background: rgba(99,99,99,0.4);">
				<slot name="top"></slot>
			</content-comp>
			<content-comp style="height:50%; top:50%;">
				<slot name="bottom"></slot>
			</content-comp>
		</n-space>
	</n-layout>
</template>
<script setup lang="ts">
import {
	NLayout,
	NSpace,
} from "naive-ui"
import ContentComp from "~/components/ContentComp.vue"
// const isLogin = useLoginStore()

</script>
<style scoped>
.n-layout {
  background: rgba(64, 64, 64, 0.4);
}

.n-space:deep() .content-comp {
	height: 50%;
}
</style>