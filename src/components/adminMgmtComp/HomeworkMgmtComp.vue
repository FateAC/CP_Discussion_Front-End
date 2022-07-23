<template>
	<n-h1>Homework Management</n-h1>
	<div max-w="5xl" m="x-auto">
		<div text="right">
			<n-button type="success" @click="createHomeworkModal = true">新增作業</n-button>
		</div>
		<n-modal v-model:show="createHomeworkModal">
			<n-card style="width: 600px" title="新增作業"> </n-card>
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
						</tr>
					</thead>
					<tbody>
						<tr v-for="(post, index) in posts" :key="index">
							<td>{{ index + 1 }}</td>
							<td>{{ post.title }}</td>
							<td>{{ post.username }}</td>
							<td>{{ post.createTime }}</td>
							<td>{{ post.lastModifyTime }}</td>
						</tr>
					</tbody>
				</n-table>
			</n-collapse-item>
		</n-collapse>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { NH1, NTable, NButton, NModal, NCard, NCollapse, NCollapseItem } from "naive-ui"

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

let MockHomework = new Map()

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
	MockHomework.set(courseName, tmp.slice())
}
</script>
