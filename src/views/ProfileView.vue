<template>
	<n-layout-content>
		<n-card m="x-auto t-8" w="2xl">
			<n-tabs>
				<n-tab-pane name="個人資訊">
					<n-text text="2xl">Avatar</n-text>
					<n-upload directory-dnd>
						<n-upload-dragger>
							<div m="b-4">
								<n-icon size="40" :depth="3">
									<i-ic:twotone-upload-file />
								</n-icon>
							</div>
							<n-text>點擊或者拖曳檔案到該區域進行上傳</n-text>
						</n-upload-dragger>
					</n-upload>
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
	NUploadDragger,
	NIcon,
	NText,
	NForm,
	NFormItem,
	NInput,
	NButton,
} from "naive-ui"
</script>
