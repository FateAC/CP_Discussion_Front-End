<template>
	<div v-if="!memberLoading && !memberError" display="flex">
		<n-avatar m="r-4" size="large" :src="commenter?.avatarPath" round object-fit="cover" />
		<n-h3 m="y-auto">{{ commenter?.nickname }}</n-h3>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { NAvatar, NH3 } from "naive-ui"
import { useQuery } from "@vue/apollo-composable"
import gql from "graphql-tag"

onMounted(() => {
	commenter.value = undefined
	memberRefetch()
})

interface Commenter {
	nickname: string
	avatarPath: string
}

const props = defineProps({
	commenter: String,
})

const {
	result: memberResult,
	loading: memberLoading,
	error: memberError,
	refetch: memberRefetch,
} = useQuery<string>(
	gql`
		query ($inID: String!) {
			member(_id: $inID) {
				nickname
				avatarPath
			}
		}
	`,
	{
		inID: props["commenter"],
	}
)

const commenter = ref<Commenter | undefined>()

watch(memberResult, () => {
	commenter.value = JSON.parse(JSON.stringify(memberResult.value))["member"] as Commenter
})
</script>
