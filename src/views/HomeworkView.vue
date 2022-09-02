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
				<div v-if="menuValue !== -1">
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
import { onMounted, ref, computed, Component, h, ComputedRef } from "vue"
import { NMenu, NIcon } from "naive-ui"
import type { MenuOption } from "naive-ui"
import { useRoute } from "vue-router"
import { DocumentTextOutline } from "@vicons/ionicons5"
import { CourseTime } from "~/scripts/interface"
import { useGetPostsByTagsQuery } from "../scripts/apolloQuery"

const route = useRoute()

const renderIcon = (icon: Component) => {
	return () => h(NIcon, null, { default: () => h(icon) })
}

const courseTime: CourseTime = {
	year: Number(route.query.year ?? new Date().getFullYear() - 1911),
	semester: Number(route.query.semester ?? 0),
}

const menuValue = ref(Number(route.query.menuValue ?? -1))

const {
	result: getPostsByTagsResult,
	loading: getPostsByTagsLoading,
	error: getPostsByTagsError,
	load: getPostsByTagsLoad,
	refetch: getPostsByTagsRefetch,
} = useGetPostsByTagsQuery()

onMounted(() => {
	getPostsByTagsLoad(undefined, {
		year: courseTime.year,
		semester: courseTime.semester,
		tags: ["Homework"],
	})
})

const posts = computed(() => getPostsByTagsResult.value?.getPostsByTags ?? [])
const mdURL = computed(() => posts.value.at(menuValue.value)?.mdPath ?? "")
const comments = computed(() => posts.value.at(menuValue.value)?.comments ?? [])

const menuOptions: ComputedRef<MenuOption[]> = computed(() => {
	return posts.value.map((data, index) => {
		return {
			label: data["title"],
			key: index,
			icon: renderIcon(DocumentTextOutline),
		}
	})
})
</script>
