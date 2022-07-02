<script setup lang="ts">
import { computed } from "vue"
import { darkTheme } from "naive-ui"
import {
	useOsTheme,
	NConfigProvider,
	NLoadingBarProvider,
	NDialogProvider,
	NNotificationProvider,
	NMessageProvider,
	NLayout
} from "naive-ui"
import NavBar from "./components/NavBar.vue"
import FooterComp from "./components/FooterComp.vue"
import { isDark } from "~/scripts/useDarks"

isDark.value = (useOsTheme().value === "dark")
const theme = computed(() => (isDark.value ? darkTheme : null))
</script>

<template>
	<n-config-provider :theme="theme" h="screen">
		<n-loading-bar-provider>
			<n-dialog-provider>
				<n-notification-provider>
					<n-message-provider>
						<n-layout position="absolute">
							<NavBar />
							<n-layout has-sider position="absolute" style="top: 64px; bottom: 64px;">
								<sidebar-comp />
								<n-layout>
									<router-view />
								</n-layout>
							</n-layout>
							<FooterComp />
						</n-layout>
					</n-message-provider>
				</n-notification-provider>
			</n-dialog-provider>
		</n-loading-bar-provider>
	</n-config-provider>
</template>
