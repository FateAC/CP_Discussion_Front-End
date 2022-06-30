<template>
	<n-card w="md" max-w="md" m="x-auto y-12" p="y-4">
		<n-space vertical justify="space-around" size="large">
			<div text="center" m="y-8">
				<n-h1>
					<n-text type="primary">
						Login
					</n-text>
				</n-h1>
			</div>
			<n-form
				ref="formRef"
				label-placement="left"
				:model="formInline"
				:rules="rules"
			>
				<n-space vertical size="medium" text="left">
					<n-form-item path="username">
						<n-input
							v-model:value="formInline.username"
							placeholder="帳號"
						>
							<template #prefix>
								<i-carbon:user mr="2" color="#808695" />
							</template>
						</n-input>
					</n-form-item>
					<n-form-item path="password">
						<n-input
							v-model:value="formInline.password"
							type="password"
							show-password-on="click"
							placeholder="密碼"
						>
							<template #prefix>
								<i-carbon:locked mr="2" color="#808695" />
							</template>
						</n-input>
					</n-form-item>
					<n-button type="primary" w="full" size="large">
						Sign in
					</n-button>
				</n-space>
			</n-form>
		</n-space>
	</n-card>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import {
	NCard,
	NSpace,
	NForm,
	NButton,
	NFormItem,
	NInput,
	NH1,
	NText
} from "naive-ui"
// const isLogin = useLoginStore()

const rules = {
	username: { required: true, message: "請輸入帳號", trigger: "blur" },
	password: { required: true, message: "請輸入密碼", trigger: "blur" },
}

const formInline = reactive({
	username: "",
	password: "",
})
</script>
