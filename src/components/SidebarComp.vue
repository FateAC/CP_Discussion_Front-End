<template>
	<n-layout-sider :native-scrollbar="false" bordered width="288px" content-style="padding: 24px; text-align=center;">
		<slot></slot>
	</n-layout-sider>
</template>

<script setup lang="ts">
import {
	NLayoutSider, 
} from "naive-ui"

</script>
