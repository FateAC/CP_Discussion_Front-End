<template>
	<n-layout-sider :native-scrollbar="false" bordered width="15%" content-style="padding: 24px; text-align=center;">
		<n-h2 v-for="i in 20" :key="i">{{i}}</n-h2>
	</n-layout-sider>
</template>

<script setup lang="ts">
import {
	NLayoutSider, 
	NH2,
} from "naive-ui"
// const isLogin = useLoginStore()

</script>
<style scoped>
.n-layout-header,
.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}
.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}
.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
}


</style>