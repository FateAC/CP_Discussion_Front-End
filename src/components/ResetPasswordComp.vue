<template>
	<n-form>
		<n-form-item label="新密碼">
			<n-input type="password" v-model:value="newPWD" show-password-on="click" />
		</n-form-item>
		<n-form-item label="確認密碼">
			<n-input type="password" v-model:value="checkPWD" show-password-on="click" />
		</n-form-item>
		<n-button w="full" type="info" round @click="resetPWDHandle">重設</n-button>
	</n-form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { NButton, useMessage, NForm, NFormItem, NInput } from "naive-ui"
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

const resetPWDHandle = () => {
	if (newPWD.value == checkPWD.value) {
		console.log(checkPWD.value)
		const tmp = bcrypt.hashSync(checkPWD.value, bcrypt.genSaltSync(15))
		console.log(tmp)
		resetPWDMutation({
			pwd: bcrypt.hashSync(checkPWD.value, bcrypt.genSaltSync(15)),
		})
	} else {
		message.error("請確認密碼是否一致")
	}
}

resetPWDOnDone((resultMutation) => {
	if ((JSON.parse(JSON.stringify(resultMutation?.data ?? ""))["resetPWD"] ?? false) as boolean) {
		message.success("密碼重設成功")
	} else {
		message.error("密碼重設失敗")
	}
})
</script>
