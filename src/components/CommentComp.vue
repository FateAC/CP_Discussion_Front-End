<template>
	<n-h2 font="bold">討論區</n-h2>
	<div m="l-8" max-w="4xl">
		<div display="flex" m="y-4">
			<n-input
				m="r-4"
				type="textarea"
				text="lg"
				round
				placeholder="我要留言..."
				maxlength="500"
				show-count
				:autosize="{
					minRows: 2,
					maxRows: 3,
				}" />
			<n-button self="center" round type="info">留言</n-button>
		</div>
		<div m="b-4">
			<div v-for="(row, i) in comments" :key="i">
				<div v-for="(comment, j) in row" :key="j">
					<div display="flex">
						<div v-if="j != 0" m="l-8" />
						<n-card size="small">
							<template #header>
								<div display="flex">
									<n-avatar
										m="r-4"
										round
										size="large"
										:src="'src/assets/images/' + comment.avatar" />
									<n-h3 m="y-auto">{{ comment.username }}</n-h3>
								</div>
							</template>
							<p text="lg">{{ comment.content }}</p>
							<template #footer>
								<span> {{ comment.mainLevel }} - {{ comment.subLevel }} </span>
								<n-button
									m="l-4"
									self="center"
									quaternary
									round
									type="info"
									@click="showModal(comment)">
									回覆
								</n-button>
								<n-modal
									v-model:show="isShowModal"
									preset="card"
									:style="bodyStyle"
									:bordered="false">
									<template #header>
										<span>
											回覆：
											{{ modalComment?.mainLevel }} -
											{{ modalComment?.subLevel }}
										</span>
									</template>
									{{ modalComment?.content }}
									<template #footer>
										<div display="flex" m="y-4">
											<n-input
												m="r-4"
												type="textarea"
												text="lg"
												round
												placeholder="我要回覆..."
												maxlength="500"
												show-count
												:autosize="{
													minRows: 1,
													maxRows: 3,
												}" />
											<n-button self="center" round type="info">
												回覆
											</n-button>
										</div>
									</template>
								</n-modal>
							</template>
						</n-card>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { NH2, NH3, NInput, NButton, NCard, NAvatar, NModal } from "naive-ui"

interface Comment {
	username: string
	avatar: string
	content: string
	mainLevel: number
	subLevel: number
}

const isShowModal = ref(false)
const modalComment = ref<Comment | null>(null)

const showModal = (comment: Comment) => {
	isShowModal.value = true
	modalComment.value = comment
}

const bodyStyle = {
	width: "600px",
}

const comments: Comment[][] = [
	[
		{
			username: "Adam7066",
			avatar: "adam7066.jpeg",
			content: "小十最可愛了",
			mainLevel: 1,
			subLevel: 0,
		},
		{
			username: "Adam7066",
			avatar: "adam7066.jpeg",
			content: "小十是我的",
			mainLevel: 1,
			subLevel: 1,
		},
	],
	[
		{
			username: "LoveSnowEx",
			avatar: "lovesnow.png",
			content: "喝酒真快樂",
			mainLevel: 2,
			subLevel: 0,
		},
	],
]
</script>
