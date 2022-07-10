<template>
	<sidebar-comp>
		<!-- For Admin -->
		<n-h4 font="bold" @click.prevent="currentView = AdminMgmtHomeComp" cursor="pointer">
			首頁
		</n-h4>
		<n-h4 font="bold" @click.prevent="currentView = MemberMgmtComp" cursor="pointer">
			使用者管理
		</n-h4>
		<n-h4 font="bold" @click.prevent="currentView = HomeworkMgmtComp" cursor="pointer">
			作業管理
		</n-h4>
	</sidebar-comp>
	<content-comp>
		<n-layout-content w="full" :native-scrollbar="false" content-style="padding:24px;">
			<keep-alive>
				<component :is="currentView"></component>
			</keep-alive>
		</n-layout-content>
	</content-comp>
</template>

<script setup lang="ts">
import { NLayoutContent, NH4 } from "naive-ui"
import { shallowRef } from "vue"
import AdminMgmtHomeComp from "~/components/adminMgmtComp/AdminMgmtHomeComp.vue"
import MemberMgmtComp from "~/components/adminMgmtComp/MemberMgmtComp.vue"
import HomeworkMgmtComp from "~/components/adminMgmtComp/HomeworkMgmtComp.vue"

const currentView = shallowRef(AdminMgmtHomeComp)
</script>
