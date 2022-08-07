<template>
	<sidebar-comp>
		<n-h2>Homework</n-h2>
	</sidebar-comp>
	<two-block-comp :divideRate="70">
		<template #two-block-top>
			<div p="x-1/12 y=4">
				<Suspense>
					<markdown-comp :mdURL="mdURL" />
				</Suspense>
			</div>
		</template>
		<template #two-block-bottom>
			<div p="x-1/12 y=4">
				<comment-comp />
			</div>
		</template>
	</two-block-comp>
</template>

<script setup lang="ts">
import { NH2 } from "naive-ui"

const mdURL = "http://localhost:8080/post/111/1/test.md"
</script>
