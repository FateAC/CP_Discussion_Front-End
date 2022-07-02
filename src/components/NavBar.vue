<script setup lang="ts">
import { NLayoutHeader, NSpace, NSwitch } from "naive-ui"
import { isDark } from "~/scripts/useDarks"
</script>

<template>
	<n-layout-header h="16" p="x-6" bordered>
		<n-space h="full" max-w="7xl" m="x-auto" p="x-sm" align="center" justify="space-between" font="bold" text="xl">
			<n-space>
				<router-link to="/">Home</router-link>
				<router-link to="/about">About</router-link>
			</n-space>
			<n-space>
				<router-link to="/login">Login</router-link>
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
