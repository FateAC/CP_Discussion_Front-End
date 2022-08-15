<template>
	<n-h2 font="bold">討論區</n-h2>
	<div m="l-8" max-w="4xl">
		<div display="flex" m="y-4">
			<n-input
				v-model:value="newComment.content"
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
			<n-button self="center" round type="info" @click="newCommentHandle">留言</n-button>
		</div>
		<div m="b-4">
			<div v-for="(row, i) in comments" :key="i">
				<div v-for="(comment, j) in row" :key="j">
					<div display="flex">
						<div v-if="j != 0" m="l-8" />
						<n-card size="small">
							<template #header>
								<Suspense>
									<commenter-comp :key="comment" :commenter="comment.commenter" />
								</Suspense>
							</template>
							<p v-if="comment.deleted" text="lg">
								刪除的內容就像流星一樣，錯過是無法再相見的！
							</p>
							<p v-else text="lg">{{ comment.content }}</p>
							<template #footer>
								<n-space align="center">
									<span> {{ comment.mainLevel }} - {{ comment.subLevel }} </span>
									<n-time :time="comment.timestamp" type="relative" />
									<div v-if="!comment.deleted">
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
														v-model:value="replyComment.content"
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
													<n-button
														self="center"
														round
														type="info"
														@click="
															replyCommentHandle(
																modalComment?.mainLevel ?? -1,
																modalComment?.subLevel ?? -1
															)
														">
														回覆
													</n-button>
												</div>
											</template>
										</n-modal>
									</div>
								</n-space>
							</template>
						</n-card>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from "vue"
import { NH2, NInput, NButton, NCard, NModal, NSpace, NTime, useMessage } from "naive-ui"
import { useMutation } from "@vue/apollo-composable"
import gql from "graphql-tag"

const message = useMessage()

const isShowModal = ref(false)
const modalComment = ref<Comment | null>(null)

const showModal = (comment: Comment) => {
	isShowModal.value = true
	modalComment.value = comment
}

const bodyStyle = {
	width: "600px",
}

interface Comment {
	commenter: string
	content: string
	mainLevel: number
	subLevel: number
	timestamp: Date
	deleted: boolean
}

interface Props {
	postID: string
	comments: Comment[]
}

const props = defineProps<Props>()
const emit = defineEmits(["updateCommentComp"])

interface printComment {
	commenter: string
	content: string
	mainLevel: number
	subLevel: number
	timestamp: Date
	deleted: boolean
}

const comments = ref<printComment[][]>([])

onMounted(() => {
	propsRefetch()
})

const propsRefetch = () => {
	comments.value.length = 0
	props["comments"].forEach((data) => {
		if (comments.value.length != data["mainLevel"]) {
			comments.value.push([])
		}
		comments.value[comments.value.length - 1].push({
			commenter: data["commenter"],
			content: data["content"],
			mainLevel: data["mainLevel"],
			subLevel: data["subLevel"],
			timestamp: new Date(data["timestamp"]),
			deleted: data["deleted"],
		})
	})
	newComment.mainLevel = comments.value.length + 1
}

watch(props, () => {
	propsRefetch()
})

const { mutate: addPostCommentMutation, onDone: addPostCommentOnDone } = useMutation<string>(
	gql`
		mutation addPostComment($inID: String!, $inNewComment: NewComment!) {
			addPostComment(id: $inID, newComment: $inNewComment)
		}
	`
)

const newComment = reactive({
	content: "",
	mainLevel: 0,
	subLevel: 0,
})

const newCommentHandle = () => {
	addPostCommentMutation({
		inID: props["postID"],
		inNewComment: newComment,
	})
}

const replyComment = reactive({
	content: "",
	mainLevel: 0,
	subLevel: 0,
})

const replyCommentHandle = (replyMainLevel: number, replySubLevel: number) => {
	replyComment.content =
		"Reply " +
		replyMainLevel.toString() +
		"-" +
		replySubLevel.toString() +
		": " +
		replyComment.content
	replyComment.mainLevel = replyMainLevel
	replyComment.subLevel = comments.value[replyMainLevel - 1].length
	addPostCommentMutation({
		inID: props["postID"],
		inNewComment: replyComment,
	})
	replyComment.content = ""
	isShowModal.value = false
}

addPostCommentOnDone((resultMutation) => {
	if (
		(JSON.parse(JSON.stringify(resultMutation?.data ?? ""))["addPostComment"] ??
			false) as boolean
	) {
		message.success("留言已新增")
		newComment.content = ""
		emit("updateCommentComp")
	} else {
		message.error("留言新增失敗")
	}
})
</script>
