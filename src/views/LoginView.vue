<template>
	<n-card w="md" max-w="md" m="x-auto y-12" p="y-4">
		<n-space vertical justify="space-around" size="large">
			<div text="center" m="y-8">
				<n-h1>
					<n-text type="primary"> Login </n-text>
				</n-h1>
			</div>
			<n-form ref="formRef" label-placement="left" :model="formInline" :rules="rules">
				<n-space vertical size="medium" text="left">
					<n-form-item path="username">
						<n-auto-complete
							v-model:value="formInline.username"
							:input-props="{ autocomplete: 'disabled' }"
							:options="options"
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
} from "naive-ui"
import gql from "graphql-tag"
import { useMutation } from "@vue/apollo-composable"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import emailOptions from "~/scripts/autoComplete"

const message = useMessage()
const store = useStore()

// const isLogin = useLoginStore()
interface Auth {
	token: string
	state: boolean
}

const rules = {
	username: { required: true, message: "請輸入帳號", trigger: "blur" },
	password: { required: true, message: "請輸入密碼", trigger: "blur" },
}

const router = useRouter()

const formRef = ref<FormInst | null>(null)

const formInline = reactive({
	username: "",
	password: "",
})

const options = emailOptions(
	computed(() => {
		return formInline.username
	})
)

const { mutate: loginQuery, onDone } = useMutation<string>(
	gql`
		mutation loginCheck($email: String!, $password: String!) {
			loginCheck(input: { email: $email, password: $password }) {
				token
				state
			}
		}
	`,
	() => ({
		variables: {
			email: formInline.username,
			password: formInline.password,
		},
	})
)

function loginHandle() {
	formRef.value?.validate((error) => {
		if (!error) {
			loginQuery()
		}
	})
}

const auth = ref<Auth>()

onDone((result) => {
	auth.value = JSON.parse(JSON.stringify(result.data))["loginCheck"] as Auth
	if (auth.value.state) {
		message.success("登入成功")
		window.localStorage.setItem("token", auth.value.token)
		store.dispatch("username", formInline.username.split("@")[0])
		router.replace("/dashboard")
	} else {
		message.error("登入失敗")
	}
})
</script>
