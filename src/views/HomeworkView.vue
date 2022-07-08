<template>
	<sidebar-comp>
		<n-h2>Homework</n-h2>
	</sidebar-comp>
	<two-block-comp :divideRate="70">
		<template #two-block-top>
			<div p="x-1/12 y=4">
				<Homework />
				<!-- <n-h2>this is top element</n-h2>
				<n-space>
					<n-h2>{{ txt }}</n-h2>
					<n-input v-model="txt" @input="txt = $event" type="textarea" />
					<n-button @click="refetch()" />
				</n-space>
				<div v-if="loading">Loading...</div>
				<div v-else-if="error">Error: {{ error?.message }}</div>
				<n-ul v-else>
					<n-h2>{{ res }}</n-h2>
					<n-li v-for="(movie, index) in movies" :key="index">
						<n-h2>{{ "idx " + index.toString() + ": " + movie.name }}</n-h2>
					</n-li>
				</n-ul>
				<n-image v-for="i in 30" :key="i" width="300"
					src="https://static.popdaily.com.tw/u/202204/425de133-dae7-425f-852f-6b8fd03a030a.jpeg" /> -->
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
import { ref, computed } from "vue"
import { NH2, NImage, NSpace, NInput, NButton, NUl, NLi } from "naive-ui"
import { useQuery } from "@vue/apollo-composable"
import gql from "graphql-tag"
import "~/styles/markdown.css"
import Homework from "~/assets/homeworks/111-1/HW01.md"

const txt = ref(`{
	movies {
		name
	}
}`)

interface Movie {
	id?: number
	name?: string
}

const { result, loading, error, refetch } = useQuery<string>(gql(txt.value))
const res = computed(() => {
	return JSON.parse(JSON.stringify(result.value))
})
const movies = computed(() => {
	return JSON.parse(JSON.stringify(result.value))["movies"] as Movie[]
})
</script>
