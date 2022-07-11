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
							placeholder="密碼">
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
} from "naive-ui"
import gql from "graphql-tag"
import { useMutation } from "@vue/apollo-composable"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

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

const formInline = reactive({
	username: "",
	password: "",
})

const options = computed(() => {
	return ["@ntnu.edu.tw"].map((suffix) => {
		const prefix = formInline.username.split("@")[0]
		return {
			label: prefix + suffix,
			value: prefix + suffix,
		}
	})
})

const { mutate: loginHandle, onDone } = useMutation<string>(
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

const auth = ref<Auth>()

onDone((result) => {
	auth.value = JSON.parse(JSON.stringify(result.data))["loginCheck"] as Auth
	if (auth.value.state) {
		message.success("登入成功")
		store.dispatch("user",formInline.username)
		router.replace("/")
	} else {
		message.error("登入失敗")
	}
})

if (store.state.user !== null) {
	router.replace("/dashboard")
}
</script>
