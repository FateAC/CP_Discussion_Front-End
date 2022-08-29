import { ref, watch } from "vue"
import {
	provideApolloClient,
	useQuery as _useQuery,
	// useQuery as _useQuery,
	useMutation as _useMutation,
	UseQueryReturn,
	UseMutationReturn,
	MutateOverrideOptions,
} from "@vue/apollo-composable"
import apolloClient from "~/scripts/apolloClient"
import { ApolloError, FetchResult, OperationVariables } from "@apollo/client/core"
import { DocumentParameter } from "@vue/apollo-composable/dist/useQuery"
import { refreshAccessToken } from "./auth"
import router from "~/router/index"

provideApolloClient(apolloClient)

export function useQuery<TResult, TVariables extends OperationVariables = OperationVariables>(
	document: DocumentParameter<TResult, TVariables>
): UseQueryReturn<TResult, TVariables> {
	const ret = _useQuery<TResult, TVariables>(document)
	const result = ret.result
	const loading = ret.loading
	const error = ret.error
	const onError = ret.onError
	const errorFnList: ((param: ApolloError) => void)[] = []
	const iterateErrorFnList = (error: ApolloError) => {
		errorFnList.forEach((fn) => {
			fn(error)
		})
	}
	ret.result = ref(undefined)
	ret.loading = ref(true)
	ret.error = ref(null)
	onError((err) => {
		console.log("on error!!")
		console.log(err.message)
		if (
			err.message == "Access Denied: no token provided" ||
			err.message == "Access Denied: token is expired"
		) {
			const { failed: refreshFailed, done: refreshDone } = refreshAccessToken()
			watch(refreshDone, (done) => {
				if (!done) return
				if (refreshFailed.value == false) {
					// refresh success, refetch again
					console.log("refetching")
					ret.restart()
				} else {
					// refresh failed, run default error
					ret.result = result
					ret.loading = loading
					ret.error = error
					iterateErrorFnList(err)
					router.push({ path: "/login" })
				}
			})
		} else {
			// default error
			ret.loading = loading
			iterateErrorFnList(err)
		}
	})
	ret.onResult(() => {
		ret.result = result
		ret.loading = loading
		ret.error = error
	})
	ret.onError = (fn: (param: ApolloError) => void) => {
		errorFnList.push(fn)
		return {
			off: () => {
				return
			},
		}
	}
	return ret
}

export function useMutation<TResult, TVariables extends OperationVariables = OperationVariables>(
	document: DocumentParameter<TResult>
): UseMutationReturn<TResult, TVariables> {
	const ret = _useMutation<TResult, TVariables>(document)
	const mutate = ret.mutate
	const loading = ret.loading
	const onDone = ret.onDone
	const onError = ret.onError
	let refetch: () => void
	const errorFnList: ((param: ApolloError) => void)[] = []
	const iterateErrorFnList = (error: ApolloError) => {
		errorFnList.forEach((fn) => {
			fn(error)
		})
	}
	ret.loading = ref(false)
	onError((err) => {
		console.log("on error!!")
		console.log(err.message)
		if (
			err.message == "Access Denied: no token provided" ||
			err.message == "Access Denied: token is expired"
		) {
			const { failed: refreshFailed, done: refreshDone } = refreshAccessToken()
			watch(refreshDone, (done) => {
				if (!done) return
				if (refreshFailed.value == false) {
					// refresh success, refetch again
					refetch()
				} else {
					// refresh failed, run default error
					ret.loading = loading
					iterateErrorFnList(err)
					router.push({ path: "/login" })
				}
			})
		} else {
			// default error
			ret.loading = loading
			iterateErrorFnList(err)
		}
	})
	ret.mutate = (
		variables?: TVariables | null,
		overrideOptions?: MutateOverrideOptions<TResult>
	) => {
		console.log("on mutate!!")
		ret.loading.value = true
		refetch = () => {
			mutate(variables, overrideOptions)
		}
		return mutate(variables, overrideOptions)
	}
	ret.onDone = (fn: (param: FetchResult<TResult>) => void) => {
		return onDone((param) => {
			console.log("on done!!", param.data)
			if (!param.errors) {
				ret.loading = loading
				fn(param)
			}
		})
	}
	ret.onError = (fn: (param: ApolloError) => void) => {
		errorFnList.push(fn)
		return {
			off: () => {
				return
			},
		}
	}
	return ret
}
