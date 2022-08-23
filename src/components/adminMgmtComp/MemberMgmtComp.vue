<template>
	<n-h1>Member Management</n-h1>
	<div max-w="5xl" m="x-auto">
		<div text="right">
			<n-button type="success" @click="createMemberModel = true">新增使用者</n-button>
		</div>
		<n-modal v-model:show="createMemberModel">
			<n-card style="width: 600px" title="新增使用者">
				<n-spin v-model:show="createMemberShowSpin">
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
							<n-button type="primary" w="full" @click="createMemberHandle">
								新增
							</n-button>
						</n-space>
					</n-form>
				</n-spin>
			</n-card>
		</n-modal>
		<n-modal v-model:show="modifyUserCourseModal" v-if="currentModifyUser">
			<n-card style="width: 600px" title="Edit Course">
				<n-space vertical>
					<n-dynamic-input
						v-model:value="currentModifyCourses"
						:on-create="currentModifyAddCourse">
						<template #default="{ value }">
							<div style="display: flex; align-items: center; width: 100%">
								<n-input
									v-model:value="value.name"
									type="text"
									placeholder="Course Name" />
							</div>
						</template>
					</n-dynamic-input>
					<n-button type="success" @click="updateModifyCourse()">
						Update Course
					</n-button>
				</n-space>
			</n-card>
		</n-modal>
		<n-table :single-line="false" m="t-4" text="center">
			<thead font="extrabold">
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Email</th>
					<th>Course</th>
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
						<n-space justify="center">
							<template v-for="course in member.courses" :key="course">
								<n-tag>
									{{ course.name }}
								</n-tag>
							</template>
						</n-space>
					</td>
					<td>
						<n-space justify="center">
							<n-popconfirm
								v-if="
									member.isAdmin === true &&
									store.state.username !== member.username
								"
								positive-text="確認"
								negative-text="否定"
								@positive-click="updateMemberIsAdminHandle(member._id)">
								<template #trigger>
									<n-switch v-model:value="member.isAdmin" size="large">
										<template #checked> Admin </template>
										<template #unchecked> User </template>
									</n-switch>
								</template>
								確定將 {{ member.email }} 降級成 User 嗎?
							</n-popconfirm>
							<n-tooltip
								v-else-if="
									member.isAdmin === true &&
									store.state.username === member.username
								">
								<template #trigger>
									<n-switch disabled v-model:value="member.isAdmin" size="large">
										<template #checked> Admin </template>
										<template #unchecked> User </template>
									</n-switch>
								</template>
								為什麼會想要把自己降級成 User 呢??
							</n-tooltip>
							<n-popconfirm
								v-else
								positive-text="確認"
								negative-text="否定"
								@positive-click="updateMemberIsAdminHandle(member._id)">
								<template #trigger>
									<n-switch v-model:value="member.isAdmin" size="large">
										<template #checked> Admin </template>
										<template #unchecked> User </template>
									</n-switch>
								</template>
								確定將 {{ member.email }} 提升成 Admin 嗎?
							</n-popconfirm>
						</n-space>
					</td>
					<td>
						<n-space justify="center">
							<n-popconfirm
								v-if="store.state.username !== member.username"
								positive-text="確認刪除"
								negative-text="考慮一下"
								@positive-click="removeMemberHandle(member._id)">
								<template #trigger>
									<n-button round type="error"> 刪除帳戶 </n-button>
								</template>
								真的要刪除 {{ member.email }} 嗎? (此操作不可逆呦!!)
							</n-popconfirm>
							<n-tooltip v-else>
								<template #trigger>
									<n-button disabled round type="error" tag="div">
										刪除帳戶
									</n-button>
								</template>
								為什麼會想要刪除自己呢??
							</n-tooltip>
							<n-button round type="success" @click="openModifyUserModal(index)">
								Edit course
							</n-button>
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
	NH2,
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
	NTooltip,
	NPopconfirm,
	NSpin,
	NTag,
	NDynamicTags,
} from "naive-ui"
import { useQuery, useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"
import emailOptions from "~/scripts/autoComplete"
import bcrypt from "bcryptjs"
import { useStore } from "vuex"
import { shouldWriteResult } from "@apollo/client/core/QueryInfo"

const store = useStore()

interface Course {
	name: string
}

interface Member {
	_id: string
	username: string
	email: string
	isAdmin: boolean
	courses: Course[]
}

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			members {
				_id
				username
				email
				isAdmin
				courses {
					name
				}
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
	courses: ref<string[]>([]),
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

const { mutate: createMemberMutation, onDone: createMemberOnDone } = useMutation<string>(
	gql`
		mutation createMember(
			$email: String!
			$password: String!
			$isAdmin: Boolean!
			$courses: [NewCourse!]!
		) {
			createMember(
				input: { email: $email, password: $password, isAdmin: $isAdmin, courses: $courses }
			) {
				username
			}
		}
	`
)

const createMemberShowSpin = ref(false)

const createMemberHandle = async () => {
	createMemberShowSpin.value = true
	const hashedPassword = await bcrypt.hash(
		createMemberFormInline.password,
		bcrypt.genSaltSync(15)
	)
	createMemberFormRef.value?.validate((error) => {
		if (!error) {
			createMemberMutation({
				email: createMemberFormInline.email,
				password: hashedPassword,
				isAdmin: createMemberFormInline.isAdmin,
				courses: createMemberFormInline.courses,
			})
		}
	})
}

const message = useMessage()

createMemberOnDone((result) => {
	createMemberShowSpin.value = false
	const username = JSON.parse(JSON.stringify(result.data))["createMember"]["username"]
	if (username) {
		message.success("新增成功")
		createMemberModel.value = false
		createMemberFormInline.email = ""
		createMemberFormInline.password = ""
		createMemberFormInline.isAdmin = false
		createMemberFormInline.courses.length = 0
	} else {
		message.success("新增失敗")
	}
	refetch()
})

const { mutate: removeMemberMutation, onDone: removeMemberOnDone } = useMutation<string>(
	gql`
		mutation removeMember($inputID: String!) {
			removeMember(id: $inputID) {
				username
				email
			}
		}
	`
)

const removeMemberHandle = (id: string) => {
	removeMemberMutation({ inputID: id })
}

removeMemberOnDone((result) => {
	const username = JSON.parse(JSON.stringify(result.data))["removeMember"]["username"]
	const email = JSON.parse(JSON.stringify(result.data))["removeMember"]["email"]
	if (username) {
		message.success("刪除" + username + "(" + email + ") 成功")
	} else {
		message.success("刪除失敗")
	}
	refetch()
})

const { mutate: updateMemberIsAdminMutation, onDone: updateMemberIsAdminOnDone } =
	useMutation<string>(
		gql`
			mutation updateMemberIsAdmin($inputID: String!) {
				updateMemberIsAdmin(id: $inputID)
			}
		`
	)

const updateMemberIsAdminHandle = (id: string) => {
	updateMemberIsAdminMutation({ inputID: id })
}

updateMemberIsAdminOnDone((result) => {
	if (
		(JSON.parse(JSON.stringify(result?.data ?? ""))["updateMemberIsAdmin"] ?? false) as boolean
	) {
		message.success("更變權限成功")
	} else {
		message.success("更變失敗")
	}
	refetch()
})

// modify course declaration
const modifyUserCourseModal = ref(false)
const currentModifyUser = ref<Member | null>(null)
const currentModifyCourses = ref<Course[]>([])
function openModifyUserModal(index: number) {
	modifyUserCourseModal.value = true
	currentModifyUser.value = members.value[index]
	currentModifyCourses.value = currentModifyUser.value.courses
}
let currentModifyAddCourse = () => {
	return { name: "" }
}
function updateModifyCourse() {
	let comparePool = currentModifyCourses.value.map((val) => JSON.stringify(val))
	currentModifyCourses.value = currentModifyCourses.value.filter((val, index) => {
		return comparePool.indexOf(JSON.stringify(val)) === index
	})
	// something to call the query
}
</script>
