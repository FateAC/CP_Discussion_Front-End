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
								<n-input type="text" placeholder="username" :disabled="true" />
							</n-form-item>
							<n-form-item label="Email">
								<n-input type="text" placeholder="email" :disabled="true" />
							</n-form-item>
							<n-form-item label="Nickname">
								<n-input type="text" placeholder="nickname" />
							</n-form-item>
						</n-form>
						<n-button w="full" type="success" round>更新</n-button>
					</n-space>
				</n-tab-pane>
				<n-tab-pane name="重設密碼">
					<n-form>
						<n-form-item label="新密碼">
							<n-input type="password" show-password-on="click" />
						</n-form-item>
						<n-form-item label="確認密碼">
							<n-input type="password" show-password-on="click" />
						</n-form-item>
						<n-button w="full" type="success" round>重設</n-button>
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
} from "naive-ui"
import type { UploadInst, UploadFileInfo } from "naive-ui"
import { watch, ref, onMounted } from "vue"
import { useStore } from "vuex"
import { useQuery, useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"

const store = useStore()

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			selfInfo {
				avatarPath
			}
		}
	`
)

interface Member {
	avatarPath: string
}

const selfInfo = ref<Member | undefined>(undefined)
const avatarPath = ref("")

watch(result, () => {
	if (store.state.username) {
		selfInfo.value = (JSON.parse(JSON.stringify(result?.value ?? ""))["selfInfo"] ??
			undefined) as Member
		avatarPath.value = selfInfo.value?.avatarPath ?? ""
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

uploadAvatarOnDone(() => {
	avatarUpload.value?.clear()
	refetch()
})

const avatarHandleClick = () => {
	avatarUpload.value?.submit()
}
</script>