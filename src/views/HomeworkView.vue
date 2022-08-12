<template>
	<sidebar-comp v-if="!getPostsByTagsLoading && !getPostsByTagsError">
		<n-menu v-model:value="menuValue" :options="menuOptions" />
	</sidebar-comp>
	<two-block-comp :divideRate="70">
		<template #two-block-top>
			<div p="x-1/12 y-4">
				<Suspense v-if="mdURL != ''">
					<markdown-comp :key="menuValue" :mdURL="mdURL" />
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
import { onMounted, ref, watch, computed, Component, h, ComputedRef } from "vue"
import { NMenu, NIcon } from "naive-ui"
import type { MenuOption } from "naive-ui"
import { useRoute } from "vue-router"
import { useQuery } from "@vue/apollo-composable"
import gql from "graphql-tag"
import { DocumentTextOutline } from "@vicons/ionicons5"

const route = useRoute()

function renderIcon(icon: Component) {
	return () => h(NIcon, null, { default: () => h(icon) })
}

const year = ref(new Date().getFullYear() - 1911)
const semester = ref(0)
const mdURL = computed(() => {
	if (menuValue.value == "") return ""
	return (
		"http://localhost:8080/post/" +
		year.value.toString() +
		"/" +
		semester.value.toString() +
		"/" +
		menuValue.value +
		".md"
	)
})

onMounted(() => {
	semester.value = route.query.semester?.toString() === "Fall" ? 0 : 1
	year.value = Number(route.query.year?.toString()) - 1911 - semester.value
	getPostsByTagsResult.value = undefined
	getPostsByTagsRefetch()
})

interface Post {
	_id: string
	title: string
}

const {
	result: getPostsByTagsResult,
	loading: getPostsByTagsLoading,
	error: getPostsByTagsError,
	refetch: getPostsByTagsRefetch,
} = useQuery<string>(
	gql`
		query getPostsByTags($inYear: Int!, $inSemester: Int!, $inTags: [String!]!) {
			getPostsByTags(year: $inYear, semester: $inSemester, tags: $inTags) {
				_id
				title
			}
		}
	`,
	computed(() => {
		return {
			inYear: year.value,
			inSemester: semester.value,
			inTags: ["Homework"],
		}
	})
)

const posts = ref<Post[]>([])

watch(getPostsByTagsLoading, (watchLoading) => {
	if (!watchLoading) {
		posts.value = (JSON.parse(JSON.stringify(getPostsByTagsResult.value))["getPostsByTags"] ??
			[]) as Post[]
	}
})

const menuValue = ref("")

const menuOptions: ComputedRef<MenuOption[]> = computed(() => {
	return posts.value.map((data) => {
		return {
			label: data["title"],
			key: data["_id"],
			icon: renderIcon(DocumentTextOutline),
		}
	})
})
</script>
