<template>
	<n-space vertical h="full" justify="start" align="center" :wrap-item="false">
		<n-layout
			w="full"
			:native-scrollbar="false"
			:style="'min-height: '+divideRate+'%; ' +  'max-height: '+divideRate+'%'">
			<slot name="two-block-top" />
		</n-layout>
		<n-divider w="full"/>
		<n-layout w="full" :native-scrollbar="false">
			<slot name="two-block-bottom" />
		</n-layout>
	</n-space>
</template>

<script setup lang="ts">
import { ref } from "vue"
import {
	NLayout,
	NSpace,
	NDivider
} from "naive-ui"

const divideRate = ref(70)

</script>