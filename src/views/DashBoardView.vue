<template>
    <n-layout-content has-sider position="absolute">
        <sidebar-comp>
			<n-h4>This is title</n-h4>
			<n-ul>
				<template v-for="i in 20" :key="i">
					<n-li>
						<a @click.prevent="change(i)" class="canclick">ITEM {{i}}</a>
					</n-li>
				</template>
			</n-ul>
		</sidebar-comp>
        <content-comp>
			<n-layout-content w="full" :native-scrollbar="false" content-style="padding:24px;">
				<n-h1>{{msg}}</n-h1>
			</n-layout-content >
		</content-comp>
    </n-layout-content>
</template>

<script setup lang="ts">
import SidebarComp from "~/components/SidebarComp.vue"
import ContentComp from "~/components/ContentComp.vue"
import { NLayoutContent , NH1 ,NH4 , NLi, NUl} from "naive-ui"
import { ref } from "vue"

let msg = ref("Hello World")

function change(i: number) {
	msg.value = "ITEM " + i
}
</script>

<style scoped>
.canclick {
	cursor: pointer;
}
</style>