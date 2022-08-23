<template>
	<sidebar-comp v-if="!getPostsByTagsLoading && !getPostsByTagsError">
		<n-menu v-model:value="menuValue" :options="menuOptions" />
	</sidebar-comp>
	<two-block-comp v-if="!getPostsByTagsLoading && !getPostsByTagsError">
		<template #two-block-top>
			<div p="x-1/12 y-4">
				<Suspense v-if="mdURL != ''">
					<markdown-comp :key="menuValue" :mdURL="mdURL" />
				</Suspense>
			</div>
		</template>
		<template #two-block-bottom>
			<div p="x-1/12 y=4">
				<div v-if="menuValue !== '-1'">
					<comment-comp
						@updateCommentComp="getPostsByTagsRefetch"
						:postID="posts[Number(menuValue)]._id"
						:comments="comments" />
				</div>
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

const renderIcon = (icon: Component) => {
	return () => h(NIcon, null, { default: () => h(icon) })
}

const year = ref(new Date().getFullYear() - 1911)
const semester = ref(0)

onMounted(() => {
	if (route.query.menuValue) menuValue.value = route.query.menuValue.toString()
	semester.value = route.query.semester?.toString() === "Fall" ? 0 : 1
	year.value = Number(route.query.year?.toString()) - 1911 - semester.value
	getPostsByTagsResult.value = undefined
	getPostsByTagsRefetch()
})

interface Comment {
	commenter: string
	content: string
	mainLevel: number
	subLevel: number
	timestamp: Date
	deleted: boolean
}

interface Post {
	_id: string
	title: string
	mdPath: string
	comments: Comment[]
}

const {
	result: getPostsByTagsResult,
	loading: getPostsByTagsLoading,
	error: getPostsByTagsError,
	refetch: getPostsByTagsRefetch,
} = useQuery<string>(
	gql`
		query ($inYear: Int!, $inSemester: Int!, $inTags: [String!]!) {
			getPostsByTags(year: $inYear, semester: $inSemester, tags: $inTags) {
				_id
				title
				mdPath
				comments {
					commenter
					content
					mainLevel
					subLevel
					timestamp
					deleted
				}
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
const mdURL = computed(() => {
	return menuValue.value === "-1" ? "" : posts.value[Number(menuValue.value)]["mdPath"]
})
const comments = computed(() => {
	return menuValue.value === "" ? [] : posts.value[Number(menuValue.value)]["comments"]
})

watch(getPostsByTagsLoading, (watchLoading) => {
	if (!watchLoading) {
		posts.value = (JSON.parse(JSON.stringify(getPostsByTagsResult.value))["getPostsByTags"] ??
			[]) as Post[]
	}
})

const menuValue = ref("-1")

const menuOptions: ComputedRef<MenuOption[]> = computed(() => {
	return posts.value.map((data, index) => {
		return {
			label: data["title"],
			key: index.toString(),
			icon: renderIcon(DocumentTextOutline),
		}
	})
})
</script>
