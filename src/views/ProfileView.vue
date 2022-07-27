<template>
	<n-layout-content>
		<n-card m="x-auto t-8" w="2xl">
			<n-tabs>
				<n-tab-pane name="個人資訊">
					<n-space vertical>
						<n-text text="2xl">Avatar</n-text>
						<div text="center">
							<n-image
								v-if="avatarPath != ''"
								flex
								height="150"
								:src="avatarPath"
								preview-disabled />
						</div>
						<n-upload
							ref="avatarUpload"
							list-type="image"
							:default-upload="false"
							:custom-request="avatarCustomRequest"
							@change="avatarChangeHandle">
							<n-button>更新檔案</n-button>
						</n-upload>
						<n-button
							w="full"
							type="success"
							round
							:disabled="!(avatarListLength == 1)"
							@click="avatarHandleClick">
							上傳檔案
						</n-button>
						<n-text text="2xl">User Info</n-text>
						<n-form inline justify="between">
							<n-form-item label="Username">
								<n-input type="text" v-model:value="username" :disabled="true" />
							</n-form-item>
							<n-form-item label="Email">
								<n-input type="text" v-model:value="email" :disabled="true" />
							</n-form-item>
							<n-form-item label="Nickname">
								<n-input type="text" v-model:value="nickname" />
							</n-form-item>
						</n-form>
						<n-button w="full" type="success" round @click="userInfoUpdate">
							更新
						</n-button>
					</n-space>
				</n-tab-pane>
				<n-tab-pane name="重設密碼">
					<n-form>
						<n-form-item label="新密碼">
							<n-input
								type="password"
								v-model:value="newPWD"
								show-password-on="click" />
						</n-form-item>
						<n-form-item label="確認密碼">
							<n-input
								type="password"
								v-model:value="checkPWD"
								show-password-on="click" />
						</n-form-item>
						<n-button w="full" type="success" round @click="resetPWDHandle">
							重設
						</n-button>
					</n-form>
				</n-tab-pane>
			</n-tabs>
		</n-card>
	</n-layout-content>
</template>

<script setup lang="ts">
import {
	NLayoutContent,
	NCard,
	NTabs,
	NTabPane,
	NUpload,
	NText,
	NForm,
	NFormItem,
	NInput,
	NButton,
	NImage,
	NSpace,
	UploadCustomRequestOptions,
	useMessage,
} from "naive-ui"
import type { UploadInst, UploadFileInfo } from "naive-ui"
import { watch, ref, onMounted } from "vue"
import { useStore } from "vuex"
import { useQuery, useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"
import bcrypt from "bcryptjs"

const message = useMessage()
const store = useStore()

interface Member {
	username: string
	nickname: string
	email: string
	avatarPath: string
}

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			selfInfo {
				username
				nickname
				email
				avatarPath
			}
		}
	`
)

const selfInfo = ref<Member | undefined>(undefined)
const username = ref("")
const nickname = ref("")
const email = ref("")
const avatarPath = ref("")

watch(result, () => {
	if (store.state.username) {
		selfInfo.value = (JSON.parse(JSON.stringify(result?.value ?? ""))["selfInfo"] ??
			undefined) as Member
		username.value = selfInfo.value?.username ?? ""
		nickname.value = selfInfo.value?.nickname ?? ""
		email.value = selfInfo.value?.email ?? ""
		avatarPath.value = (selfInfo.value?.avatarPath ?? "") + "?t=" + new Date().getTime()
	}
})

onMounted(() => {
	result.value = undefined
	refetch()
})

const avatarListLength = ref(0)
const avatarUpload = ref<UploadInst | null>(null)

const avatarChangeHandle = (options: { fileList: UploadFileInfo[] }) => {
	avatarListLength.value = options.fileList.length
}

const { mutate: uploadAvatarMutation, onDone: uploadAvatarOnDone } = useMutation<string>(
	gql`
		mutation updateMemberAvatar($file: Upload!) {
			updateMemberAvatar(avatar: $file)
		}
	`
)

const avatarCustomRequest = ({ file }: UploadCustomRequestOptions) => {
	const fileType = ["image/bmp", "image/png", "image/jpeg", "image/gif"]
	if (fileType.includes(file.type ?? "")) {
		uploadAvatarMutation({ file: file.file })
	}
}

uploadAvatarOnDone((resultMutation) => {
	if (
		(JSON.parse(JSON.stringify(resultMutation?.data ?? ""))["updateMemberAvatar"] ??
			false) as boolean
	) {
		message.success("Avatar 重設成功")
	} else {
		message.error("Avatar 重設失敗")
	}
	avatarUpload.value?.clear()
	result.value = undefined
	refetch()
})

const avatarHandleClick = () => {
	avatarUpload.value?.submit()
}

const { mutate: userInfoUpdateMutation, onDone: userInfoUpdateOnDone } = useMutation<string>(
	gql`
		mutation updateMemberNickname($inNickname: String) {
			updateMemberNickname(nickname: $inNickname)
		}
	`
)

const userInfoUpdate = () => {
	userInfoUpdateMutation({ inNickname: nickname.value })
}

userInfoUpdateOnDone((resultMutation) => {
	if (
		(JSON.parse(JSON.stringify(resultMutation?.data ?? ""))["updateMemberNickname"] ??
			false) as boolean
	) {
		message.success("Nickname 重設成功")
	} else {
		message.error("Nickname 重設失敗")
	}
	result.value = undefined
	refetch()
})

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
		resetPWDMutation({
			pwd: bcrypt.hashSync(checkPWD.value, bcrypt.genSaltSync(15)),
			// pwd: checkPWD.value,
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
	result.value = undefined
	refetch()
})
</script>
