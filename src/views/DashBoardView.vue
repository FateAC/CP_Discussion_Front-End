<template>
	<sidebar-comp>
		<!-- For Admin -->
		<template v-if="isAdmin">
			<n-h4 font="bold" @click.prevent="currentView = AdminMgmtHomeComp" cursor="pointer">
				首頁
			</n-h4>
			<n-h4 font="bold" @click.prevent="currentView = MemberMgmtComp" cursor="pointer">
				使用者管理
			</n-h4>
			<n-h4 font="bold" @click.prevent="currentView = HomeworkMgmtComp" cursor="pointer">
				作業管理
			</n-h4>
		</template>
		<template v-else>
			<template v-for="data in mockUserSiderBar" :key="data">
				<n-h4
					font="bold"
					@click.prevent="fetchData(data.year, data.semester)"
					cursor="pointer">
					{{ data.year }} ({{ data.semester }})
				</n-h4>
			</template>
		</template>
	</sidebar-comp>
	<content-comp>
		<n-layout-content w="full" :native-scrollbar="false" content-style="padding:24px;">
			<keep-alive>
				<component v-if="isAdmin" :is="currentView"></component>
				<component v-else-if="course === null" :is="currentView"></component>
				<component v-else :is="currentView">
					<n-h4>{{ course.year }}</n-h4>
					<n-h4>{{ course.semester }}</n-h4>
				</component>
			</keep-alive>
		</n-layout-content>
	</content-comp>
</template>

<script setup lang="ts">
import { NLayoutContent, NH4 } from "naive-ui"
import { shallowRef, ref } from "vue"
import AdminMgmtHomeComp from "~/components/adminMgmtComp/AdminMgmtHomeComp.vue"
import MemberMgmtComp from "~/components/adminMgmtComp/MemberMgmtComp.vue"
import HomeworkMgmtComp from "~/components/adminMgmtComp/HomeworkMgmtComp.vue"
import ContentComp from "~/components/ContentComp.vue"
import UserHomeComp from "~/components/UserHomeComp.vue"

interface CourseData {
	year: number
	semester: string
}

const mockUserSiderBar = [
	{
		year: 2022,
		semester: "fall",
	},
	{
		year: 2022,
		semester: "spring",
	},
	{
		year: 2021,
		semester: "fall",
	},
	{
		year: 2021,
		semester: "spring",
	},
]

let isAdmin = false
const currentView = isAdmin ? shallowRef(AdminMgmtHomeComp) : shallowRef(UserHomeComp)

const course = ref<CourseData | null>(null)

function fetchData(year: number, semester: string) {
	// something to fetch course data here
	let fetchCourse: CourseData = {
		year: year,
		semester: semester,
	}
	course.value = fetchCourse
	currentView.value = ContentComp
	return
}
</script>
