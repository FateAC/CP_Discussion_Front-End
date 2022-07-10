<template>
	<n-h1>Member Management</n-h1>
	<div max-w="5xl" m="x-auto">
		<div text="right">
			<n-button type="success">新增使用者</n-button>
		</div>
		<n-table :single-line="false" m="t-4" text="center">
			<thead font="extrabold">
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>管理員</th>
					<th>基本操作</th>
				</tr>
			</thead>
			<tbody v-if="!loading && !error">
				<tr v-for="(member, index) in members" :key="index">
					<td>{{ member.username }}</td>
					<td>{{ member.email }}</td>
					<td>
						<n-button v-if="member.isAdmin" strong secondary round type="success">
							True
						</n-button>
						<n-button v-else strong secondary round>False</n-button>
					</td>
					<td>
						<n-button round type="info"> 重設密碼 </n-button>
					</td>
				</tr>
			</tbody>
		</n-table>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { NH1, NTable, NButton } from "naive-ui"
import { useQuery } from "@vue/apollo-composable"
import gql from "graphql-tag"

interface Member {
	username: string
	email: string
	isAdmin: boolean
}

const { result, loading, error, refetch } = useQuery<string>(
	gql`
		{
			members {
				username
				email
				isAdmin
			}
		}
	`
)

const members = computed(() => {
	return (JSON.parse(JSON.stringify(result.value))["members"] ?? []) as Member[]
})
</script>
