<template>
	<n-layout-sider
		:native-scrollbar="false"
		bordered
		h="full"
		width="288px"
		collapse-mode="width"
		:collapsed-width="80"
		show-trigger="arrow-circle"
		content-style="padding: 24px; text-align=center;">
		<slot></slot>
	</n-layout-sider>
</template>

<script setup lang="ts">
import { NLayoutSider } from "naive-ui"
</script>
