<template>
	<n-layout position="absolute" style="width:70%; margin-left:15%; margin-right:15%;" content-style="padding:24px;">
		<n-space vertical>
			<n-h2 v-for="i in 10" :key="i">YEET</n-h2>
		</n-space>
	</n-layout>
</template>
<script setup lang="ts">
import {
	NLayout,
	NH2,
	NSpace,
} from "naive-ui"
// const isLogin = useLoginStore()
// 

</script>
<style scoped>
.n-layout-header,
.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}
.n-layout-sider {
  background: rgba(64, 64, 64, 0.3);
}
.n-layout-content {
  background: rgba(64, 64, 64, 0.4);
}

.n-layout {
  background: rgba(64, 64, 64, 0.4);
}
</style>