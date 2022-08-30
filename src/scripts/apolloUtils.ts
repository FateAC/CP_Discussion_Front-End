import { ref, watch } from "vue"
import {
	provideApolloClient,
	useLazyQuery as _useLazyQuery,
	useMutation as _useMutation,
	MutateOverrideOptions,
} from "@vue/apollo-composable"
import apolloClient from "~/scripts/apolloClient"
import {
	ApolloError,
	ApolloQueryResult,
	DocumentNode,
	FetchResult,
	OperationVariables,
} from "@apollo/client/core"
import {
	DocumentParameter,
	VariablesParameter,
	UseQueryOptions,
} from "@vue/apollo-composable/dist/useQuery"
import { UseMutationOptions } from "@vue/apollo-composable/dist/useMutation"
import { refreshAccessToken } from "./auth"
import router from "~/router/index"

provideApolloClient(apolloClient)

const isNoTokenProvideError = (error: ApolloError | null | undefined): boolean => {
	return error?.message == "Access Denied: no token provided"
}

const isTokenExpiredError = (error: ApolloError | null | undefined): boolean => {
	return error?.message == "Access Denied: token is expired"
}

const isAuthError = (error: ApolloError | null | undefined): boolean => {
	return isNoTokenProvideError(error) || isTokenExpiredError(error)
}

export function useLazyQuery<TResult, TVariables>(
	document: DocumentParameter<TResult, TVariables>,
	variables?: VariablesParameter<TVariables>,
	options?: UseQueryOptions<TResult, TVariables>
): ReturnType<typeof _useLazyQuery<TResult, TVariables>> {
	const ret = _useLazyQuery<TResult, TVariables>(document, variables, options)
	const load = ret.load
	const result = ret.result
	const loading = ret.loading
	const error = ret.error
	const refetch = ret.refetch
	const onError = ret.onError
	const onResult = ret.onResult
	let errorFn: (param: ApolloError) => void
	let resultFn: (param: ApolloQueryResult<TResult>) => void
	const initQuery = () => {
		ret.result = ref(undefined)
		ret.loading = ref(true)
		ret.error = ref(null)
	}
	const finishQuery = () => {
		ret.result = result
		ret.loading = loading
		ret.error = error
	}
	ret.load = (document?: DocumentNode, variables?: TVariables, options?: UseQueryOptions) => {
		initQuery()
		return load(document, variables, options)
	}
	ret.refetch = (
		variables?: TVariables | undefined
	): Promise<ApolloQueryResult<TResult>> | undefined => {
		initQuery()
		return refetch(variables)
	}
	ret.onError = (fn: (param: ApolloError) => void) => {
		errorFn = fn
		return {
			off: () => {
				return
			},
		}
	}
	ret.onResult = (fn: (param: ApolloQueryResult<TResult>) => void) => {
		resultFn = fn
		return {
			off: () => {
				return
			},
		}
	}
	onError((err) => {
		if (isAuthError(err)) {
			const { failed: refreshFailed, done: refreshDone } = refreshAccessToken()
			watch(refreshDone, (done) => {
				if (!done) return
				if (refreshFailed.value == false) {
					// refresh success, refetch again
					ret.restart()
				} else {
					// refresh failed, run default error
					finishQuery()
					errorFn(err)
					router.push({ path: "/login" })
				}
			})
		} else {
			// default error
			finishQuery()
			errorFn(err)
		}
	})
	onResult((param) => {
		if (!param.error) {
			// no error
			finishQuery()
			resultFn(param)
		}
	})
	return ret
}

export function useMutation<TResult, TVariables extends OperationVariables = OperationVariables>(
	document: DocumentParameter<TResult, TVariables>,
	options?: UseMutationOptions<TResult, TVariables>
): ReturnType<typeof _useMutation<TResult, TVariables>> {
	const ret = _useMutation<TResult, TVariables>(document, options)
	const mutate = ret.mutate
	const loading = ret.loading
	const error = ret.error
	const onDone = ret.onDone
	const onError = ret.onError
	let refetch: () => void
	let errorFn: (param: ApolloError) => void
	let doneFn: (param: FetchResult<TResult>) => void
	const initQuery = () => {
		ret.loading = ref(true)
		ret.error = ref(null)
	}
	const finishQuery = () => {
		ret.loading = loading
		ret.error = error
	}
	ret.mutate = (
		variables?: TVariables | null,
		overrideOptions?: MutateOverrideOptions<TResult>
	) => {
		console.log(variables)
		initQuery()
		refetch = () => {
			mutate(variables, overrideOptions)
		}
		return mutate(variables, overrideOptions)
	}
	ret.onError = (fn: (param: ApolloError) => void) => {
		errorFn = fn
		return {
			off: () => {
				return
			},
		}
	}
	ret.onDone = (fn: (param: FetchResult<TResult>) => void) => {
		doneFn = fn
		return {
			off: () => {
				return
			},
		}
	}
	onError((err) => {
		if (isAuthError(err)) {
			const { failed: refreshFailed, done: refreshDone } = refreshAccessToken()
			watch(refreshDone, (done) => {
				if (!done) return
				if (refreshFailed.value == false) {
					// refresh success, refetch again
					refetch()
				} else {
					// refresh failed, run default error
					finishQuery()
					errorFn(err)
					router.push({ path: "/login" })
				}
			})
		} else {
			// default error
			finishQuery()
			errorFn(err)
		}
	})
	onDone((param) => {
		if (!param.errors) {
			// no error
			finishQuery()
			doneFn(param)
		}
	})
	return ret
}
