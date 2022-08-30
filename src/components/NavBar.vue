<template>
	<n-layout-header h="16" p="x-8" bordered>
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
				<span class="text-xl py-1.5 px-4 whitespace-nowrap md:my-0">CP Discussion</span>
				<router-link
					to="/"
					class="rounded-md font-bold bg-viceBlue/2.5 shadow-md text-sm text-white py-1.5 px-4 shadow-black/20 md:my-0 lg:my-0 dark:shadow-md dark:shadow-blue-400/40 hover:bg-indigo-500"
					>Home</router-link
				>
				<router-link
					to="/about"
					class="rounded-md font-bold bg-viceBlue/2.5 shadow-md text-sm text-white py-1.5 px-4 shadow-black/20 md:my-0 lg:my-0 dark:shadow-md dark:shadow-blue-400/40 hover:bg-indigo-500"
					>About</router-link
				>
				<router-link
					v-if="isLogin"
					to="/dashboard"
					class="rounded-md font-bold bg-viceBlue/2.5 shadow-md text-sm text-white py-1.5 px-4 shadow-black/20 md:my-0 lg:my-0 dark:shadow-md dark:shadow-blue-400/40 hover:bg-indigo-500"
					>Dashboard</router-link
				>
			</n-space>
			<n-space>
				<router-link
					v-if="!isLogin"
					to="/login"
					class="rounded-md font-bold bg-viceBlue/2.5 shadow-md text-sm text-white py-1.5 px-4 shadow-black/20 md:my-0 lg:my-1 dark:shadow-md dark:shadow-blue-400/40 hover:bg-indigo-500"
					>Login</router-link
				>
				<n-dropdown
					v-else-if="avatarPath != undefined"
					trigger="click"
					:options="avatarOptions"
					@select="avatarHandleSelect">
					<n-avatar class="cursor-pointer" :src="avatarPath" round object-fit="cover" />
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
import { computed, h, watch, onMounted } from "vue"
import type { Component } from "vue"
import { PersonCircleOutline as profileIcon, LogOutOutline as logoutIcon } from "@vicons/ionicons5"
import { useSelfInfoQuery } from "~/scripts/apolloQuery"

const store = useStore()
const router = useRouter()
const isLogin = computed(() => store.state.username != null)
const selfInfo = computed(() => selfInfoResult?.value?.selfInfo)
const avatarPath = computed(() => {
	const path = selfInfo.value?.avatarPath
	if (path == undefined) return undefined
	return path != "" ? path : "src/assets/avatar.png"
})

const logoutHandle = () => {
	window.sessionStorage.clear()
	store.dispatch("username", null)
	router.replace("/login")
	return
}

const changeDarkmode = () => {
	store.dispatch("favorDarkmode", isDark.value)
}

const { result: selfInfoResult, load: selfInfoLoad, refetch: selfInfoRefetch } = useSelfInfoQuery()

onMounted(() => {
	selfInfoLoad()
})

watch(isLogin, (val) => {
	if (!val) return
	selfInfoRefetch()
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

<style>
a.router-link-exact-active {
	color: #ffd000;
}
</style>
