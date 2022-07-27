<template>
	<n-layout-header h="16" p="x-6" bordered>
		<n-space
			h="full"
			max-w="7xl"
			m="x-auto"
			p="x-sm"
			align="center"
			justify="space-between"
			font="bold"
			text="xl">
			<n-space>
				<router-link to="/">Home</router-link>
				<router-link to="/about">About</router-link>
				<router-link v-if="isLogin" to="/dashboard">Dashboard</router-link>
			</n-space>
			<n-space>
				<router-link v-if="!isLogin" to="/login">Login</router-link>
				<n-dropdown
					v-else-if="!loading && !error"
					trigger="click"
					:options="avatarOptions"
					@select="avatarHandleSelect">
					<n-avatar :src="avatarPath" />
				</n-dropdown>
				<n-switch v-model:value="isDark" @update:value="changeDarkmode" size="large">
					<template #checked-icon>
						<i-mdi:weather-night />
					</template>
					<template #unchecked-icon>
						<i-mdi:weather-sunny />
					</template>
				</n-switch>
			</n-space>
		</n-space>
	</n-layout-header>
</template>

<script setup lang="ts">
import { NLayoutHeader, NSpace, NSwitch, NAvatar, NDropdown, NIcon } from "naive-ui"
import { isDark } from "~/scripts/useDarks"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { computed, h, watch, ref, onMounted } from "vue"
import type { Component } from "vue"
import { PersonCircleOutline as profileIcon, LogOutOutline as logoutIcon } from "@vicons/ionicons5"
import { useQuery } from "@vue/apollo-composable"
import gql from "graphql-tag"

const store = useStore()
const router = useRouter()
const isLogin = computed(() => store.state.username != null)

const logoutHandle = () => {
	window.sessionStorage.clear()
	store.dispatch("username", null)
	router.replace("/login")
	return
}

const changeDarkmode = () => {
	store.dispatch("favorDarkmode", isDark.value)
}

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			selfInfo {
				avatarPath
			}
		}
	`
)

interface Member {
	avatarPath: string
}

const selfInfo = ref<Member | undefined>(undefined)
const avatarPath = ref("")

watch(result, () => {
	if (store.state.username) {
		selfInfo.value = (JSON.parse(JSON.stringify(result?.value ?? ""))["selfInfo"] ??
			undefined) as Member
		avatarPath.value = selfInfo.value?.avatarPath
			? selfInfo.value?.avatarPath
			: "src/assets/avatar.png"
	}
})

onMounted(() => {
	result.value = undefined
	refetch()
})

const renderIcon = (icon: Component) => {
	return () => {
		return h(NIcon, null, {
			default: () => h(icon),
		})
	}
}

const avatarOptions = [
	{
		label: "Profile",
		key: "profile",
		icon: renderIcon(profileIcon),
	},
	{
		label: "Logout",
		key: "logout",
		icon: renderIcon(logoutIcon),
	},
]

const avatarHandleSelect = (key: string | number) => {
	if (key == "profile") {
		router.replace("/profile")
	} else if (key == "logout") {
		logoutHandle()
	}
}
</script>
