<template>
	<n-h1>Homework Management</n-h1>
	<div max-w="5xl" m="x-auto" v-if="!postsLoading && !postsError">
		<div text="right">
			<n-button type="success" @click="showHomeworkModal = true">新增作業</n-button>
		</div>
		<n-modal v-model:show="showHomeworkModal">
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
						<div font="bold" text="lg">
							{{
								parseCourseToCourseTime({ name: course }).year.toString() +
								"-" +
								(parseCourseToCourseTime({ name: course }).semester + 1).toString()
							}}
						</div>
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
								<td><n-time :time="new Date(post.createTime)" /></td>
								<td><n-time :time="new Date(post.lastModifyTime)" /></td>
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
import { ref, reactive, onMounted, computed } from "vue"
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
	FormRules,
} from "naive-ui"
import type { UploadFileInfo } from "naive-ui"
import { useRouter } from "vue-router"
import { usePostsQuery, useAddPostMutation, useRemovePostMutation } from "~/scripts/apolloQuery"
import { CourseTime, Post, NewPost } from "~/scripts/interface"
import { parseCourseTimeToCourse, parseCourseToCourseTime } from "~/scripts/course"
import { SelectBaseOption } from "naive-ui/es/select/src/interface"
import { selfInfo } from "../../scripts/login"

const message = useMessage()
const router = useRouter()

const showHomeworkModal = ref(false)
const uploadMD = ref<UploadInst | null>(null)
const MDfiles = ref<UploadFileInfo[]>([])
const createPostFormRef = ref<FormInst | null>(null)

const createPostFormInline = reactive<NewPost>({
	poster: "",
	title: "",
	year: new Date().getFullYear() - 1911,
	semester: 1,
	tags: ["Homework"],
	mdFile: new File([], ""),
})

const createPostRule: FormRules = {
	title: { required: true, message: "Please enter the post title", trigger: "blur" },
	year: { type: "number", required: true, message: "Please enter the year ", trigger: "blur" },
	//mdPath: { type:"text", required: true, message: "Please upload the post file", trigger: "blur" },
}

const postSemesterOption: SelectBaseOption[] = [
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

const {
	result: postsResult,
	loading: postsLoading,
	error: postsError,
	load: postsLoad,
	refetch: postsRefetch,
} = usePostsQuery()
postsLoad()

const { mutate: uploadPostMutate, onDone: uploadPostDone } = useAddPostMutation()

const { mutate: deletePostMutate, onDone: deletePostDone } = useRemovePostMutation()

const dbHomework = computed<Map<string, Post[]>>(() => {
	return new Map(
		[
			...(
				postsResult.value?.posts?.reduce((map: Map<string, Post[]>, post: Post) => {
					const courseTime: CourseTime = {
						year: Number(post.year),
						semester: Number(post.semester),
					}
					const course = parseCourseTimeToCourse(courseTime)
					if (!map.has(course.name)) map.set(course.name, [])
					map.get(course.name)?.push(post)
					return map
				}, new Map<string, Post[]>()) ?? new Map<string, Post[]>()
			).entries(),
		].sort()
	)
})

const openPostView = (course: string, index: number) => {
	const post = dbHomework.value.get(course)?.[index]
	if (!post) return
	const routeURL = router.resolve({
		name: "homework",
		query: {
			year: post.year.toString(),
			semester: post.semester.toString(),
			menuValue: index.toString(),
		},
	})
	window.open(routeURL.fullPath, "_blank")
}

const deletePostHandle = (id: string) => {
	deletePostMutate({
		id: id,
	})
}

const createPostClickHandle = () => {
	if (MDfiles.value.length !== 1) {
		message.error("Please upload a markdown file.")
		return
	}
	createPostFormRef.value?.validate((error) => {
		if (!error) {
			const file = MDfiles.value?.[0]?.file
			if (file) {
				createPostFormInline.poster = selfInfo.value?.username ?? ""
				createPostFormInline.mdFile = file
				uploadPostMutate({ input: createPostFormInline })
			}
		}
	})
}

uploadPostDone((resultMutation) => {
	if (resultMutation.data?.addPost) {
		message.success("Post success")
		showHomeworkModal.value = false
		postsRefetch()
	} else {
		message.error("Post failed")
	}
})

deletePostDone((resultMutation) => {
	if (resultMutation.data?.removePost) {
		message.success("Delete success")
		showHomeworkModal.value = false
		postsRefetch()
	} else {
		message.error("Delete failed")
	}
})

onMounted(() => {
	postsRefetch()
})
</script>
