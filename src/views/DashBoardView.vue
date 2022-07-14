<template>
	<sidebar-comp>
		<!-- For Admin -->
		<div v-if="isAdmin">
			<n-h4 font="bold" @click.prevent="currentView = AdminMgmtHomeComp" cursor="pointer">
				首頁
			</n-h4>
			<n-h4 font="bold" @click.prevent="currentView = MemberMgmtComp" cursor="pointer">
				使用者管理
			</n-h4>
			<n-h4 font="bold" @click.prevent="currentView = HomeworkMgmtComp" cursor="pointer">
				作業管理
			</n-h4>
		</div>
		<!-- For User -->
		<div v-else>
			<div v-for="(data, index) in mockUserSiderBar" :key="index">
				<n-h4
					font="bold"
					@click.prevent="fetchData(data.year, data.semester)"
					cursor="pointer">
					{{ data.year }} - {{ data.semester }}
				</n-h4>
			</div>
		</div>
	</sidebar-comp>
	<content-comp>
		<keep-alive>
			<div>
				<component v-if="isAdmin" :is="currentView" />
				<component v-else-if="course === null" :is="currentView" />
				<component v-else :is="currentView">
					<div m="x-auto t-12" max-w="2xl">
						<n-card>
							<template #header>
								<n-h2 font="bold">{{ course.year }} - {{ course.semester }}</n-h2>
							</template>
							<n-menu :options="menuOptions" font="bold" text="lg" />
						</n-card>
					</div>
				</component>
			</div>
		</keep-alive>
	</content-comp>
</template>

<script setup lang="ts">
import { shallowRef, ref, h } from "vue"
import { RouterLink } from "vue-router"
import { NH2, NH4, NCard, NMenu } from "naive-ui"
import type { MenuOption } from "naive-ui"
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
		year: 2021,
		semester: "Spring",
	},
	{
		year: 2021,
		semester: "Fall",
	},
	{
		year: 2022,
		semester: "Spring",
	},
	{
		year: 2022,
		semester: "Fall",
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

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: "homework",
				},
				{ default: () => "作業" }
			),
		key: "homework",
	},
]
</script>
