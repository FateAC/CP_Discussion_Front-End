<template>
	<sidebar-comp>
		<n-h2>Homework</n-h2>
	</sidebar-comp>
	<two-block-comp :divideRate="70">
		<template #two-block-top>
			<div p="x-1/12 y=4">
				<Homework />
			</div>
		</template>
		<template #two-block-bottom>
			<div p="x-1/12 y=4">
				<n-h2>this is bottom element</n-h2>
				<n-image
					src="https://upload.wikimedia.org/wikipedia/zh/thumb/b/ba/Nyan_cat_250px_frame.jpg/220px-Nyan_cat_250px_frame.jpg" />
			</div>
		</template>
	</two-block-comp>
</template>

<script setup lang="ts">
import { NH2, NImage } from "naive-ui"
import "~/styles/markdown.css"
import Homework from "~/assets/homeworks/111-1/HW01.md"
</script>
