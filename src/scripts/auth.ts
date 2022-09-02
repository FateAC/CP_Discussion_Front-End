import { ref } from "vue"
import { useFetch } from "@vueuse/core"

const refreshUrl = "http://localhost:8080/refresh"

interface RefreshTokenReturn {
	access_token?: string
	refresh_token?: string
	error?: string
}

export function refreshAccessToken() {
	const done = ref<boolean>(false)
	const failed = ref<boolean | undefined>(undefined)
	const accessToken = ref<string | undefined>(undefined)
	const refreshToken = ref<string | undefined>(localStorage.getItem("refresh_token") ?? undefined)
	const refreshDone = () => {
		done.value = true
		if (accessToken.value && refreshToken.value) {
			localStorage.setItem("access_token", accessToken.value)
			localStorage.setItem("refresh_token", refreshToken.value)
			failed.value = false
		} else {
			localStorage.removeItem("refresh_token")
			localStorage.removeItem("access_token")
			failed.value = true
		}
	}
	if (!refreshToken.value) {
		refreshDone()
	}
	const { data, onFetchResponse, onFetchError } = useFetch(refreshUrl, {
		async beforeFetch({ options }) {
			options.headers = {
				...options.headers,
				Authorization: refreshToken.value ? `Bearer ${refreshToken.value}` : "",
			}
			return {
				options,
			}
		},
	})
		.post()
		.json<RefreshTokenReturn>()
	onFetchResponse(() => {
		accessToken.value = data.value?.access_token
		refreshToken.value = data.value?.refresh_token
		refreshDone()
	})
	onFetchError(() => {
		refreshDone()
	})
	return { done: done, failed: failed }
}
