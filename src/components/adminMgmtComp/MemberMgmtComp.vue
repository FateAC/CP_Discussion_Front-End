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
			<tbody>
				<tr v-for="(item, index) in memberDatas" :key="index">
					<td>{{ item.name }}</td>
					<td>{{ item.email }}</td>
					<td>
						<n-button v-if="item.isAdmin" strong secondary round type="success">
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
import { NH1, NTable, NButton } from "naive-ui"

const memberDatas = [
	{
		name: "Test",
		email: "test@ntnu.edu.tw",
		isAdmin: true,
	},
	{
		name: "TestTest",
		email: "testtest@ntnu.edu.tw",
		isAdmin: false,
	},
]
</script>
