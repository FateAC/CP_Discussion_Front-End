<template>
	<n-space vertical h="full" justify="start" align="center" :wrap-item="false">
		<content-comp :style="'min-height: '+divideRate+'%; ' +  'max-height: '+divideRate+'%'">
			<slot name="two-block-top" />
		</content-comp>
		<n-divider w="full"/>
		<content-comp>
			<slot name="two-block-bottom" />
		</content-comp>
	</n-space>
</template>

<script setup lang="ts">
import { ref } from "vue"
import {
	NSpace,
	NDivider
} from "naive-ui"

const divideRate = ref(70)

</script>