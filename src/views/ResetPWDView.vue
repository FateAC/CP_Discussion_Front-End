<template>
	<n-card
		class="bg-transparent bg-gradient-to-r from-viceGreen/50 to-viceBlue/50 rounded-xl shadow-lg shadow-black/20 dark:shadow-lg dark:shadow-blue-400/40"
		m="x-auto t-12 b-auto"
		max-w="xl">
		<template #header>
			<n-h1>重設密碼</n-h1>
		</template>
		<div v-if="urlToken == ''">
			<p>請輸入要重設密碼的帳號(信箱)</p>
			<n-space m="t-4">
				<n-auto-complete
					m="r-48"
					v-model:value="email"
					:input-props="{
						autocomplete: 'disabled',
					}"
					:options="options"
					placeholder="帳號" />
				<n-popconfirm
					:positive-text="positiveText"
					:negative-text="negativeText"
					@positive-click="handlePositiveClick"
					@negative-click="handleNegativeClick">
					<template #trigger>
						<n-button m="l-4" type="info">重設</n-button>
					</template>
					真的要為 {{ email }} 重設密碼嗎?
				</n-popconfirm>
			</n-space>
		</div>
		<reset-password-comp v-else />
	</n-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { NCard, NH1, NSpace, NAutoComplete, NButton, NPopconfirm, useMessage } from "naive-ui"
import { useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"
import { useRoute } from "vue-router"
import ResetPasswordComp from "~/components/ResetPasswordComp.vue"

const message = useMessage()
const route = useRoute()

let routeQuery = computed(() => route.query)
const urlToken = ref("")

watch(routeQuery, (newVal, oldVal) => {
	if (Object.entries(oldVal).length === 0 || oldVal === newVal) return
	location.reload()
})

onMounted(() => {
	urlToken.value = route.query.token?.toString() ?? ""
	if (urlToken.value != "") {
		window.localStorage.setItem("token", urlToken.value)
	}
	console.log(urlToken.value)
})

const email = ref("")
const positiveText = "確認重設"
const negativeText = "先不要"

const options = computed(() => {
	return ["@ntnu.edu.tw"].map((suffix) => {
		const prefix = email.value.split("@")[0]
		return {
			label: prefix + suffix,
			value: prefix + suffix,
		}
	})
})

const { mutate: sendResetPWDMutation, onDone: sendResetPWDOnDone } = useMutation<string>(
	gql`
		mutation sendResetPWD($inEmail: String!) {
			sendResetPWD(email: $inEmail)
		}
	`
)

const handlePositiveClick = () => {
	sendResetPWDMutation({ inEmail: email.value })
}

const handleNegativeClick = () => {
	message.warning("想好了再說")
}

sendResetPWDOnDone((resultMutation) => {
	if (
		(JSON.parse(JSON.stringify(resultMutation?.data ?? ""))["sendResetPWD"] ?? false) as boolean
	) {
		message.success("已寄送重設密碼之 mail")
	} else {
		message.error("請確認此信箱是否存在，或連繫管理員")
	}
})
</script>
