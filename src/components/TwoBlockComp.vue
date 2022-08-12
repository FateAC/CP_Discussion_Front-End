<template>
	<n-space vertical w="full" h="full" justify="start" align="center" :wrap-item="false">
		<content-comp>
			<slot name="two-block-top" />
		</content-comp>
		<div w="full">
			<hr p="y-2" @mousedown="resizeContent" style="cursor: row-resize" />
			<content-comp id="down" w="full" h="200px" max-h="300px" m="b-6">
				<slot name="two-block-bottom" />
			</content-comp>
		</div>
	</n-space>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { NSpace } from "naive-ui"

const resizeContent = (event: MouseEvent) => {
	const targetDiv = ref(document.getElementById("down"))
	let targetDivHeight = targetDiv.value?.offsetHeight ?? 0
	let startY = event.clientY
	document.onmousemove = (event: MouseEvent) => {
		event.preventDefault()
		let distY = Math.abs(event.clientY - startY)
		if (targetDiv.value != null) {
			if (event.clientY > startY)
				targetDiv.value.style.height = targetDivHeight - distY + "px"
			if (event.clientY < startY)
				targetDiv.value.style.height = targetDivHeight + distY + "px"
			if (parseInt(targetDiv.value.style.height) <= 100) {
				targetDiv.value.style.height = 100 + "px"
			}
		}
	}
	document.onmouseup = function () {
		document.onmousemove = null
	}
}
</script>
