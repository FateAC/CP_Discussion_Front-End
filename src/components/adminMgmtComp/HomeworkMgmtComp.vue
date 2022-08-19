<template>
	<n-h1>Homework Management</n-h1>
	<div max-w="5xl" m="x-auto" v-if="!loading">
		<div text="right">
			<n-button type="success" @click="createHomeworkModal = true">新增作業</n-button>
		</div>
		<n-modal v-model:show="createHomeworkModal">
			<n-card style="width: 600px" title="新增作業">
				<n-form
					ref="createPostFormRef"
					:model="createPostFormInline"
					:rules="createPostRule">
					<n-space vertical size="medium" text="left">
						<n-form-item path="title" label="Title">
							<n-input
								v-model:value="createPostFormInline.title"
								placeholder="Title" />
						</n-form-item>
						<n-form-item path="year" label="Year">
							<n-input-number
								v-model:value="createPostFormInline.year"
								:show-button="false"
								w="full" />
						</n-form-item>
						<n-form-item path="semester" label="Semester">
							<n-select
								v-model:value="createPostFormInline.semester"
								placeholder="Semester"
								:options="postSemesterOption" />
						</n-form-item>
						<n-form-item path="tag" label="Tags">
							<n-dynamic-tags v-model:value="createPostFormInline.tags" />
						</n-form-item>
						<n-form-item path="mdPath" label="Post">
							<n-upload
								ref="uploadMD"
								list-type="text"
								v-model:file-list="MDfiles"
								:default-upload="false"
								@before-upload="beforeMdUpload"
								:max="1">
								<n-button> Select Markdown </n-button>
							</n-upload>
						</n-form-item>
					</n-space>
				</n-form>
				<n-button type="primary" w="full" @click="createPostClickHandle"> Post </n-button>
			</n-card>
		</n-modal>
		<n-collapse arrow-placement="right">
			<template v-for="[course, posts] in dbHomework" :key="course">
				<n-collapse-item :name="course">
					<template #header>
						<div font="bold" text="lg">{{ course }}</div>
					</template>
					<n-table :single-line="false" m="t-4" text="center">
						<thead font="extrabold">
							<tr>
								<th>#</th>
								<th>PostName</th>
								<th>Author</th>
								<th>PostTime</th>
								<th>LastModify</th>
								<th>Tags</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(post, index) in posts" :key="index">
								<td>{{ index + 1 }}</td>
								<td>
									<n-button
										quaternary
										type="success"
										@click="openPostView(course, index)">
										{{ post.title }}
									</n-button>
								</td>
								<td>{{ post.poster }}</td>
								<td><n-time :time="post.createTime" /></td>
								<td><n-time :time="post.lastModifyTime" /></td>
								<td>
									<n-tag v-for="tag in post.tags" :key="tag">
										{{ tag }}
									</n-tag>
								</td>
								<td>
									<n-space justify="center">
										<n-popconfirm
											positive-text="Confirm"
											negative-text="Cancel"
											@positive-click="deletePostHandle(post._id)">
											<template #trigger>
												<n-button round type="error"> Delete</n-button>
											</template>
											Are you sure about deleting this post?
										</n-popconfirm>
									</n-space>
								</td>
							</tr>
						</tbody>
					</n-table>
				</n-collapse-item>
			</template>
		</n-collapse>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue"
import {
	NInput,
	NTag,
	NH1,
	NTable,
	NButton,
	NModal,
	NCard,
	NCollapse,
	NCollapseItem,
	NForm,
	NFormItem,
	NInputNumber,
	NSelect,
	FormInst,
	NDynamicTags,
	NSpace,
	NUpload,
	UploadInst,
	NPopconfirm,
	useMessage,
	NTime,
} from "naive-ui"
import type { UploadFileInfo } from "naive-ui"
import { useQuery, useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const message = useMessage()
const router = useRouter()
const store = useStore()

interface Post {
	year: string
	semester: string
	_id: string
	_pid: string
	poster: string
	title: string
	tags: string[]
	mdPath: string
	createTime: Date
	lastModifyTime: Date
}

const createHomeworkModal = ref(false)
const uploadMD = ref<UploadInst | null>(null)
const MDfiles = ref<UploadFileInfo[]>([])
const createPostFormRef = ref<FormInst | null>(null)

const createPostFormInline = reactive({
	title: "",
	year: new Date().getFullYear() - 1911,
	semester: 1,
	mdPath: "",
	tags: ref(["Homework"]),
})

const createPostRule = {
	title: { required: true, message: "Please enter the post title", trigger: "blur" },
	year: { type: "number", required: true, message: "Please enter the year ", trigger: "blur" },
	//mdPath: { type:"text", required: true, message: "Please upload the post file", trigger: "blur" },
}

const postSemesterOption = [
	{
		label: "Fall",
		value: 0,
	},
	{
		label: "Spring",
		value: 1,
	},
]

const beforeMdUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
	if (data.file.file?.name.endsWith(".md") === false) {
		message.error("Only .md file is allowed.")
		return false
	}
	return true
}

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			posts {
				_id
				poster
				title
				year
				semester
				tags
				mdPath
				createTime
				lastModifyTime
			}
		}
	`
)

const { mutate: uploadPostMutate, onDone: uploadPostDone } = useMutation<string>(
	gql`
		mutation addPost($input: NewPost!) {
			addPost(input: $input) {
				_id
				poster
				title
				year
				semester
				tags
				mdPath
				createTime
				lastModifyTime
			}
		}
	`
)

const { mutate: deletePostMutate, onDone: deletePostDone } = useMutation<string>(
	gql`
		mutation removePost($input: String!) {
			removePost(id: $input) {
				_id
				poster
				title
				year
				semester
				tags
				mdPath
				createTime
				lastModifyTime
			}
		}
	`
)

const dbHomework = ref(new Map())

watch(result, () => {
	if (!result.value) {
		return
	}
	let hws = (JSON.parse(JSON.stringify(result.value))["posts"] ?? []) as Post[]
	dbHomework.value = new Map()
	hws.forEach((hw) => {
		const course = `${hw["year"]}-${hw["semester"] + 1}`
		if (dbHomework.value.has(course) === false) {
			dbHomework.value.set(course, [])
		}
		let current = dbHomework.value.get(course)
		current?.push({
			year: hw["year"],
			semester: hw["semester"],
			_id: hw["_id"],
			_pid: "still not here",
			poster: hw["poster"],
			title: hw["title"],
			tags: hw["tags"],
			mdPath: hw["mdPath"],
			createTime: new Date(hw["createTime"]),
			lastModifyTime: new Date(hw["lastModifyTime"]),
		} as Post)
	})
})

const openPostView = (course: string, index: number) => {
	const post = dbHomework.value.get(course)[index]
	const year = post.year + 1911 + post.semester
	const semester = post.semester == 0 ? "Fall" : "Spring"
	const routeURL = router.resolve({
		name: "homework",
		query: {
			year: year,
			semester: semester,
			menuValue: index.toString(),
		},
	})
	window.open(routeURL.fullPath, "_blank")
}

const deletePostHandle = (id: string) => {
	deletePostMutate({
		input: id,
	})
}

const createPostClickHandle = () => {
	if (MDfiles.value.length !== 1) {
		message.error("Please upload a markdown file.")
		return
	}
	createPostFormRef.value?.validate((error) => {
		if (!error) {
			let file = MDfiles.value[0]
			uploadPostMutate({
				input: {
					mdFile: file.file,
					poster: store.state.username,
					title: createPostFormInline.title,
					year: createPostFormInline.year,
					semester: createPostFormInline.semester,
					tags: createPostFormInline.tags,
				},
			})
		}
	})
}

uploadPostDone((resultMutation) => {
	if (JSON.parse(JSON.stringify(resultMutation.data))["addPost"]) {
		message.success("Post success")
		createHomeworkModal.value = false
		refetch()
	} else {
		message.error("Post failed")
	}
})

deletePostDone((resultMutation) => {
	if (JSON.parse(JSON.stringify(resultMutation.data))["removePost"]) {
		message.success("Delete success")
		createHomeworkModal.value = false
		refetch()
	} else {
		message.error("Delete failed")
	}
})

onMounted(() => {
	result.value = undefined
	refetch()
})
</script>
