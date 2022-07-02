<template>
	<two-block-comp>
		<template #two-block-top>
			<div p="x-1/12 y=4">
				<n-h2>this is top element</n-h2>
				<n-image v-for="i in 30" :key="i" width=300 src="https://static.popdaily.com.tw/u/202204/425de133-dae7-425f-852f-6b8fd03a030a.jpeg" />
			</div>
		</template>
		<template #two-block-bottom>
			<div p="x-1/12 y=4">
				<n-h2>this is bottom element</n-h2>
				<n-image src="https://upload.wikimedia.org/wikipedia/zh/thumb/b/ba/Nyan_cat_250px_frame.jpg/220px-Nyan_cat_250px_frame.jpg" />
			</div>
		</template>
	</two-block-comp>
</template>

<script setup lang="ts">
import { NH2, NImage } from "naive-ui"
</script>