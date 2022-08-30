import { computed, ref } from "vue"
import { useLoginCheckMutation, useSelfInfoQuery } from "~/scripts/apolloQuery"
import { store } from "~/scripts/vuex"

const { result: selfInfoResult, load: selfInfoLoad, refetch: selfInfoRefetch } = useSelfInfoQuery()
const { mutate: loginMutate, onDone: loginOnDone } = useLoginCheckMutation()
const username = ref<string>()
const loginDone = ref<boolean>()
const loginSuccess = ref<boolean>()

export const isLogin = computed(() => store?.state.username != undefined)
export const selfInfo = computed(() => selfInfoResult?.value?.selfInfo)

export const login = (email: string, password: string) => {
	loginDone.value = false
	username.value = email.split("@")[0]
	loginMutate({
		email: email,
		password: password,
	})
	return { done: loginDone, success: loginSuccess }
}

loginOnDone((result) => {
	const auth = result.data?.loginCheck
	if (auth?.state) {
		window.localStorage.setItem("refresh_token", auth.token)
		store.dispatch("username", username.value)
	}
	loginSuccess.value = auth?.state ?? false
	loginDone.value = true
})

export const refetchSelfInfo = () => {
	if (!isLogin.value) return
	if (selfInfoResult == undefined) selfInfoLoad()
	else selfInfoRefetch()
}
