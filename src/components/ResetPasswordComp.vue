<template>
	<n-form>
		<n-spin v-model:show="resetPasswordShowSpin">
			<n-form-item label="新密碼">
				<n-input type="password" v-model:value="newPWD" show-password-on="click" />
			</n-form-item>
			<n-form-item label="確認密碼">
				<n-input type="password" v-model:value="checkPWD" show-password-on="click" />
			</n-form-item>
			<n-button w="full" type="info" round @click="resetPWDHandle">重設</n-button>
		</n-spin>
	</n-form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { NButton, useMessage, NForm, NFormItem, NInput, NSpin } from "naive-ui"
import { useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"
import bcrypt from "bcryptjs"

const message = useMessage()

const newPWD = ref("")
const checkPWD = ref("")

const { mutate: resetPWDMutation, onDone: resetPWDOnDone } = useMutation<string>(
	gql`
		mutation resetPWD($pwd: String!) {
			resetPWD(password: $pwd)
		}
	`
)

const resetPasswordShowSpin = ref(false)

const resetPWDHandle = async () => {
	resetPasswordShowSpin.value = true
	if (newPWD.value == checkPWD.value) {
		console.log(checkPWD.value)
		const tmp = await bcrypt.hash(checkPWD.value, bcrypt.genSaltSync(15))
		console.log(tmp)
		resetPWDMutation({
			pwd: tmp,
		})
	} else {
		resetPasswordShowSpin.value = false
		message.error("請確認密碼是否一致")
	}
}

resetPWDOnDone((resultMutation) => {
	resetPasswordShowSpin.value = false
	if ((JSON.parse(JSON.stringify(resultMutation?.data ?? ""))["resetPWD"] ?? false) as boolean) {
		message.success("密碼重設成功")
		newPWD.value = ""
		checkPWD.value = ""
	} else {
		message.error("密碼重設失敗")
	}
})
</script>
