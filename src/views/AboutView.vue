<script setup lang="ts">
import { NLayoutContent, NGrid, NGi, NCard, NAvatar, NH3, NText } from "naive-ui"

const users = [
	{ name: "Adam7066", id: 1, imgName: "adam7066.jpeg", company: "National Taiwan Normal University", description: "小十好可愛~~" },
	{ name: "LoveSnowEx", id: 2, imgName: "lovesnow.png", company: "National Taiwan Normal University", description: "3.14159 早中晚餐都配酒 OuO" },
	{ name: "SubaRya", id: 3, imgName: "subarya.jpg", company: "National Taiwan Normal University", description: "穗乃果我婆 OwOb" },
	{ name: "LaporChen", id: 4, imgName: "laporchen.jpeg", company: "National Taiwan Normal University", description: "韡..." }
]
</script>

<template>
	<n-layout-content>
		<n-grid m="x-auto t-12" max-w="5xl" x-gap="12" y-gap="12" :cols="3">
			<n-gi v-for="user in users" :key="user.id">
				<n-card>
					<template #header>
						<n-avatar round size="large" :src="'src/assets/images/' + user.imgName" />
					</template>
					<template #header-extra>
						<n-h3 m="y-auto">{{ user.name }}</n-h3>
					</template>
					<n-text font="bold">{{ user.company }}</n-text>
					<br />
					<n-text font="bold" text="base" type="info">{{ user.description }}</n-text>
				</n-card>
			</n-gi>
		</n-grid>
	</n-layout-content>
</template>