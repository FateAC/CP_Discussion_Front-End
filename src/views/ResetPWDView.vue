<template>
	<n-card m="x-auto t-12 b-auto" max-w="xl">
		<template #header>
			<n-h1>重設密碼</n-h1>
		</template>
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
	</n-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { NCard, NH1, NSpace, NAutoComplete, NButton, NPopconfirm } from "naive-ui"

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

const handlePositiveClick = () => {
	console.log(positiveText)
}

const handleNegativeClick = () => {
	console.log(negativeText)
}
</script>
