import { computed, ref, watch } from "vue"
import { useLoginCheckMutation, useSelfInfoQuery } from "~/scripts/apolloQuery"
import { store } from "~/scripts/vuex"

const { result: selfInfoResult, load: selfInfoLoad, refetch: selfInfoRefetch } = useSelfInfoQuery()
const { mutate: loginMutate, onDone: loginOnDone } = useLoginCheckMutation()
const username = ref<string>()
const loginDone = ref<boolean>()
const loginSuccess = ref<boolean>()

selfInfoLoad()

export const isLogin = computed(() => store?.state.username != undefined)
export const selfInfo = computed(() => selfInfoResult?.value?.selfInfo)

export { selfInfoRefetch }

export const login = (email: string, password: string) => {
	loginDone.value = false
	username.value = email.split("@")[0]
	loginMutate({
		email: email,
		password: password,
	})
	return { done: loginDone, success: loginSuccess }
}

export const logout = () => {
	window.sessionStorage.clear()
	window.localStorage.removeItem("refresh_token")
	window.localStorage.removeItem("access_token")
	store.dispatch("username", null)
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

watch(isLogin, (val) => {
	if (!val) return
	selfInfoRefetch()
})
