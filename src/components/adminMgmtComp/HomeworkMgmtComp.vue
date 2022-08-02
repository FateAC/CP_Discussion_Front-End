<template>
	<n-h1>Homework Management</n-h1>
	<div max-w="5xl" m="x-auto">
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
						<n-form-item path="mdPath" label="Post"> </n-form-item>
						<n-button type="primary" w="full" @click="createPostHandle">
							Post
						</n-button>
					</n-space>
				</n-form>
			</n-card>
		</n-modal>
		<n-modal v-model:show="viewHomeworkModal">
			<n-card style="width: 1000px">
				<Homework></Homework>
			</n-card>
		</n-modal>
		<n-collapse v-for="[course, posts] in MockHomework" :key="course">
			<n-collapse-item :title="course">
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
							<td>{{ post.username }}</td>
							<td>{{ post.createTime }}</td>
							<td>{{ post.lastModifyTime }}</td>
							<td>
								<n-tag v-for="tag in post.tags" :key="tag">
									{{ tag }}
								</n-tag>
							</td>
							<td>
								<n-button type="error" @click="deletePost(course, index)">
									Delete
								</n-button>
							</td>
						</tr>
					</tbody>
				</n-table>
			</n-collapse-item>
		</n-collapse>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
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
} from "naive-ui"

import Homework from "~/assets/homeworks/111-1/HW01.md"

interface Post {
	year: string
	semester: string
	_id: string
	_pid: string
	username: string
	title: string
	tags: string[]
	mdPath: string
	createTime: string
	lastModifyTime: string
}

//const { result, loading, error, refetch } = useQuery<string>(
//	gql`
//		{
//			members {
//				_id
//				username
//				email
//				isAdmin
//			}
//		}
//	`
//)
// this part will be change to query homework infomation in the future

const createHomeworkModal = ref(false)
const viewHomeworkModal = ref(false)
const currentPost = ref("")

const createPostFormRef = ref<FormInst | null>(null)

const createPostFormInline = reactive({
	title: "",
	year: 2022,
	semester: 1,
	mdPath: "",
	tags: ref([]),
})

const createPostRule = {
	title: { required: true, message: "Please enter the post title", trigger: "blur" },
	year: { type: "number", required: true, message: "Please enter the year ", trigger: "blur" },
	mdPath: { required: true, message: "Please upload the post file", trigger: "blur" },
}

const postSemesterOption = [
	{
		label: "Spring",
		value: 1,
	},
	{
		label: "Fall",
		value: 0,
	},
]

let MockHomework = ref(new Map())

for (let i = 0; i < 10; ++i) {
	let tmp: Post[] = []
	let courseName = `${100 + i}學年 ${(i % 2) + 1}`
	for (let j = 0; j < 10; ++j) {
		tmp.push({
			year: `${i}`,
			semester: `${i}`,
			_id: `hehe${j}`,
			_pid: "123",
			username: "fakeuser",
			title: "haha get hacked",
			tags: ["leet", "1337", "lol"],
			mdPath: "noPath :(",
			createTime: `2022-02-${j + 10}`,
			lastModifyTime: "2022-02-22",
		})
	}
	MockHomework.value.set(courseName, tmp.slice())
}

function openPostView(course: string, index: number) {
	currentPost.value = MockHomework.value.get(course)[index]
	viewHomeworkModal.value = true
}

function deletePost(course: string, index: number) {
	let postID = MockHomework.value.get(course)[index]._id
	// something to mutate the db
	MockHomework.value.get(course).splice(index, 1)
	console.log(MockHomework.value.get(course))
	if (MockHomework.value.get(course).length === 0) {
		MockHomework.value.delete(course)
	}
}

function createPostHandle() {
	createPostFormRef.value?.validate((error) => {
		if (!error) {
			console.log(createPostFormInline)
		}
	})
}
</script>
