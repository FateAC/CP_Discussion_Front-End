<template>
	<div v-if="isAdmin != undefined" display="flex" w="full">
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
				<div v-if="selfInfo != undefined">
					<div v-for="(data, index) in mockUserSiderBar" :key="index">
						<n-h4
							font="bold"
							@click.prevent="fetchData(data.year, data.semester)"
							cursor="pointer">
							{{ data.year }} - {{ data.semester }}
						</n-h4>
					</div>
				</div>
			</div>
		</sidebar-comp>
		<content-comp>
			<keep-alive>
				<div>
					<component :is="currentView">
						<div v-if="!isAdmin" m="x-auto t-12" max-w="2xl">
							<n-card>
								<template #header>
									<n-h2 font="bold">
										{{ course?.year }} - {{ course?.semester }}
									</n-h2>
								</template>
								<n-menu :options="menuOptions" font="bold" text="lg" />
							</n-card>
						</div>
					</component>
				</div>
			</keep-alive>
		</content-comp>
	</div>
</template>

<script setup lang="ts">
import { shallowRef, ref, h, computed, onMounted, watch } from "vue"
import { RouterLink } from "vue-router"
import { NH2, NH4, NCard, NMenu, MenuOption } from "naive-ui"
import AdminMgmtHomeComp from "~/components/adminMgmtComp/AdminMgmtHomeComp.vue"
import MemberMgmtComp from "~/components/adminMgmtComp/MemberMgmtComp.vue"
import HomeworkMgmtComp from "~/components/adminMgmtComp/HomeworkMgmtComp.vue"
import ContentComp from "~/components/ContentComp.vue"
import UserHomeComp from "~/components/UserHomeComp.vue"
import { isLogin, selfInfo } from "~/scripts/login"
import router from "~/router/index"

const isAdmin = computed(() => selfInfo.value?.isAdmin ?? false)
const currentView = shallowRef()

onMounted(() => {
	currentView.value = isAdmin.value ? AdminMgmtHomeComp : UserHomeComp
})

watch(isLogin, () => {
	router.go(0)
})

interface CourseData {
	year: number
	semester: string
}

const mockUserSiderBar = computed<CourseData[]>(() => {
	return (
		selfInfo.value?.courses.map<CourseData>((course) => {
			return {
				year: Number(course.name.split("_")[0]),
				semester: course.name.split("_")[1],
			}
		}) ?? []
	)
})

const course = ref<CourseData | null>(null)

const fetchData = (year: number, semester: string) => {
	course.value = {
		year: year,
		semester: semester,
	}
	currentView.value = ContentComp
	return
}

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: "homework",
						query: {
							year: course.value?.year,
							semester: course.value?.semester,
						},
					},
				},
				{ default: () => "作業" }
			),
		key: "homework",
	},
]
</script>
