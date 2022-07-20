<template>
	<n-h1>Member Management</n-h1>
	<div max-w="5xl" m="x-auto">
		<div text="right">
			<n-button type="success" @click="createMemberModel = true">新增使用者</n-button>
		</div>
		<n-modal v-model:show="createMemberModel">
			<n-card style="width: 600px" title="新增使用者">
				<n-form
					ref="createMemberFormRef"
					label-placement="left"
					:model="createMemberFormInline"
					:rules="createMemberRules">
					<n-space vertical size="medium" text="left">
						<n-form-item path="email">
							<n-auto-complete
								v-model:value="createMemberFormInline.email"
								:input-props="{ autocomplete: 'disabled' }"
								:options="options"
								placeholder="信箱">
								<template #prefix>
									<i-ic:outline-email mr="2" color="#808695" />
								</template>
							</n-auto-complete>
						</n-form-item>
						<n-form-item path="password">
							<n-input
								v-model:value="createMemberFormInline.password"
								type="password"
								show-password-on="click"
								placeholder="密碼">
								<template #prefix>
									<i-carbon:locked mr="2" color="#808695" />
								</template>
							</n-input>
							<n-button strong secondary circle ml="2" @click="randPWD">
								<i-fad:random-1dice />
							</n-button>
						</n-form-item>
						<n-form-item label="管理員" path="isAdmin">
							<n-switch v-model:value="createMemberFormInline.isAdmin" />
						</n-form-item>
						<n-form-item label="課程" path="courses">
							<n-dynamic-input
								v-model:value="createMemberFormInline.courses"
								:on-create="onCreateCourse">
								<template #default="{ value }">
									<n-input v-model:value="value.name" type="text" />
								</template>
							</n-dynamic-input>
						</n-form-item>
						<n-button type="primary" w="full" @click="createMenberHandle">
							新增
						</n-button>
					</n-space>
				</n-form>
			</n-card>
		</n-modal>
		<n-table :single-line="false" m="t-4" text="center">
			<thead font="extrabold">
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Email</th>
					<th>管理員</th>
					<th>基本操作</th>
				</tr>
			</thead>
			<tbody v-if="!loading && !error">
				<tr v-for="(member, index) in members" :key="index">
					<td>{{ index + 1 }}</td>
					<td>{{ member.username }}</td>
					<td>{{ member.email }}</td>
					<td>
						<n-button v-if="member.isAdmin" strong secondary round type="success">
							True
						</n-button>
						<n-button v-else strong secondary round>False</n-button>
					</td>
					<td>
						<n-space justify="center">
							<n-button round type="error"> 刪除帳戶 </n-button>
						</n-space>
					</td>
				</tr>
			</tbody>
		</n-table>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue"
import {
	NH1,
	NTable,
	NButton,
	NSpace,
	NModal,
	NCard,
	NForm,
	NFormItem,
	FormInst,
	NAutoComplete,
	NInput,
	NSwitch,
	NDynamicInput,
	useMessage,
} from "naive-ui"
import { useQuery, useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"
import emailOptions from "~/scripts/autoComplete"
import bcrypt from "bcryptjs"

interface Member {
	username: string
	email: string
	isAdmin: boolean
}

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			members {
				username
				email
				isAdmin
			}
		}
	`
)

const members = computed(() => {
	return (JSON.parse(JSON.stringify(result.value))["members"] ?? []) as Member[]
})

const createMemberModel = ref(false)
const createMemberFormRef = ref<FormInst | null>(null)

const createMemberFormInline = reactive({
	email: "",
	password: "",
	isAdmin: ref(false),
	courses: ref([]),
})

const onCreateCourse = () => {
	return { name: "" }
}

const createMemberRules = {
	email: { required: true, message: "請輸入信箱", trigger: "blur" },
	password: { required: true, message: "請輸入密碼", trigger: "blur" },
}

const options = emailOptions(
	computed(() => {
		return createMemberFormInline.email
	})
)

const randPWD = () => {
	const tmp = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	createMemberFormInline.password = ""
	for (let i = 0; i < 20; ++i) {
		createMemberFormInline.password += tmp[Math.floor(Math.random() * tmp.length)]
	}
}

const { mutate: createMemberMutation, onDone } = useMutation<string>(
	gql`
		mutation createMember(
			$email: String!
			$password: String!
			$isAdmin: Boolean!
			$username: String!
			$nickname: String!
			$avatarPath: String!
			$courses: [NewCourse!]!
		) {
			createMember(
				input: {
					email: $email
					password: $password
					isAdmin: $isAdmin
					username: $username
					nickname: $nickname
					avatarPath: $avatarPath
					courses: $courses
				}
			) {
				username
			}
		}
	`,
	() => ({
		variables: {
			email: createMemberFormInline.email,
			password: bcrypt.hashSync(createMemberFormInline.password, bcrypt.genSaltSync(15)),
			isAdmin: createMemberFormInline.isAdmin,
			username: createMemberFormInline.email.split("@")[0],
			nickname: createMemberFormInline.email.split("@")[0],
			avatarPath: "",
			courses: createMemberFormInline.courses,
		},
	})
)

const createMenberHandle = () => {
	createMemberFormRef.value?.validate((error) => {
		if (!error) {
			console.log(createMemberFormInline.courses)
			createMemberMutation()
		}
	})
}

const message = useMessage()

onDone((result) => {
	const username = JSON.parse(JSON.stringify(result.data))["createMember"]["username"]
	if (username) {
		createMemberModel.value = false
		message.success("新增成功")
	} else {
		message.success("新增失敗")
	}
})
</script>
