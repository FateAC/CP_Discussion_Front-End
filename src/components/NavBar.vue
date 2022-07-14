<script setup lang="ts">
import { NLayoutHeader, NSpace, NSwitch } from "naive-ui"
import { isDark } from "~/scripts/useDarks"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { computed } from "vue"

const store = useStore()
const router = useRouter()
const isLogin = computed(() => store.state.user != null)

function logoutHandle() {
	window.sessionStorage.clear()
	store.dispatch("user", null)
	router.replace("/login")
	return
}
</script>

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
				<template v-if="!isLogin">
					<router-link to="/login">Login</router-link>
				</template>
				<template v-else>
					<a href="#" @click="logoutHandle()">Logout</a>
				</template>
				<n-switch v-model:value="isDark" size="large">
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
