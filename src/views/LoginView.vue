<template>
	<n-card
		class="bg-transparent bg-gradient-to-r rounded-xl from-viceGreen/50 to-viceBlue/50 shadow-lg shadow-black/20 dark:shadow-lg dark:shadow-blue-400/40"
		w="md"
		max-w="md"
		m="x-auto y-12"
		p="y-4">
		<n-space vertical justify="space-around" size="large">
			<div text="center" m="y-8">
				<n-h1>
					<n-text type="primary"> Login </n-text>
				</n-h1>
			</div>
			<n-form ref="formRef" label-placement="left" :model="formInline" :rules="formRules">
				<n-space vertical size="medium" text="left">
					<n-form-item path="username">
						<n-auto-complete
							v-model:value="formInline.email"
							:input-props="{ autocomplete: 'disabled' }"
							:options="formOptions"
							placeholder="帳號">
							<template #prefix>
								<i-carbon:user mr="2" color="#808695" />
							</template>
						</n-auto-complete>
					</n-form-item>
					<n-form-item path="password">
						<n-input
							v-model:value="formInline.password"
							type="password"
							show-password-on="click"
							placeholder="密碼"
							@keyup.enter="loginHandle()">
							<template #prefix>
								<i-carbon:locked mr="2" color="#808695" />
							</template>
						</n-input>
					</n-form-item>
					<n-button type="primary" w="full" size="large" @click="loginHandle()">
						Sign in
					</n-button>
				</n-space>
			</n-form>
			<n-space justify="end">
				<div text="blue-500" font="bold">
					<router-link to="/resetpwd">Reset Password</router-link>
				</div>
			</n-space>
		</n-space>
	</n-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue"
import {
	NCard,
	NSpace,
	NForm,
	NButton,
	NFormItem,
	NAutoComplete,
	NInput,
	NH1,
	NText,
	useMessage,
	FormInst,
	FormRules,
} from "naive-ui"
import { useRouter } from "vue-router"
import emailOptions from "~/scripts/autoComplete"
import { login } from "../scripts/login"
import { watchOnce } from "@vueuse/core"

const router = useRouter()

const message = useMessage()

const formRules: FormRules = {
	email: { required: true, message: "請輸入帳號", trigger: "blur" },
	password: { required: true, message: "請輸入密碼", trigger: "blur" },
}

const formRef = ref<FormInst | null>(null)

const formInline = reactive({
	email: "",
	password: "",
})

const formOptions = emailOptions(
	computed(() => {
		return formInline.email
	})
)

function loginHandle() {
	formRef.value?.validate((error) => {
		if (!error) {
			const { done: loginDone, success: loginSucess } = login(
				formInline.email,
				formInline.password
			)
			watchOnce(loginDone, () => {
				if (loginSucess) {
					message.success("登入成功")
					router.replace("/dashboard")
				} else {
					message.error("登入失敗")
				}
			})
		}
	})
}
</script>
