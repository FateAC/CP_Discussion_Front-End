<template>
	<n-layout-content>
		<n-card
			m="x-auto t-8"
			w="2xl"
			class="bg-transparent bg-gradient-to-r from-viceGreen/65 to-viceBlue/65 rounded-xl shadow-lg shadow-black/20 dark:shadow-lg dark:shadow-blue-400/40">
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
						<n-popconfirm
							v-if="avatarPath != ''"
							placement="bottom"
							negative-text="先不要"
							positive-text="確認刪除"
							@positive-click="removeMemberAvatar">
							<template #trigger>
								<n-button w="full" round type="error"> 刪除檔案 </n-button>
							</template>
							確定要刪除 Avatar 嗎? 此操作不可逆呦!
						</n-popconfirm>
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
					<reset-password-comp />
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
	NPopconfirm,
} from "naive-ui"
import type { UploadInst, UploadFileInfo } from "naive-ui"
import { watch, ref, onMounted } from "vue"
import { useStore } from "~/scripts/vuex"
import { useQuery, useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"

const message = useMessage()
const store = useStore()

interface Member {
	_id: string
	username: string
	nickname: string
	email: string
	avatarPath: string
}

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			selfInfo {
				_id
				username
				nickname
				email
				avatarPath
			}
		}
	`
)

const selfInfo = ref<Member | undefined>(undefined)
const userID = ref("")
const username = ref("")
const nickname = ref("")
const email = ref("")
const avatarPath = ref("")

watch(result, () => {
	if (store.state.username) {
		selfInfo.value = (JSON.parse(JSON.stringify(result?.value ?? ""))["selfInfo"] ??
			undefined) as Member
		userID.value = selfInfo.value?._id ?? ""
		username.value = selfInfo.value?.username ?? ""
		nickname.value = selfInfo.value?.nickname ?? ""
		email.value = selfInfo.value?.email ?? ""
		avatarPath.value = selfInfo.value?.avatarPath ?? ""
		if (avatarPath.value != "") avatarPath.value += "?t=" + new Date().getTime()
	}
})

onMounted(() => {
	result.value = undefined
	refetch()
})

const { mutate: removeMemberAvatarMutation, onDone: removeMemberAvatarOnDone } =
	useMutation<string>(
		gql`
			mutation removeMemberAvatar($inID: String!) {
				removeMemberAvatar(id: $inID)
			}
		`
	)

const removeMemberAvatar = () => {
	removeMemberAvatarMutation({ inID: userID.value })
}

removeMemberAvatarOnDone((resultMutation) => {
	if (
		(JSON.parse(JSON.stringify(resultMutation?.data ?? ""))["removeMemberAvatar"] ??
			false) as boolean
	) {
		message.success("Avatar 刪除成功")
	} else {
		message.error("Avatar 刪除失敗")
	}
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
		mutation updateMemberNickname($inNickname: String!) {
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
</script>
