import { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore, Store } from "vuex"
import VuexPersistence from "vuex-persist"

export interface State {
	username: string | undefined
	favorDarkmode: boolean | undefined
}

export const key: InjectionKey<Store<State>> = Symbol()

const vuexLocal = new VuexPersistence<State>({
	storage: window.localStorage,
})

export const store = createStore<State>({
	state: {
		username: undefined,
		favorDarkmode: undefined,
	},
	getters: {
		username: (state) => {
			return state.username
		},
		favorDarkmode: (state) => {
			return state.favorDarkmode
		},
	},
	actions: {
		username(context, username) {
			context.commit("username", username)
		},
		favorDarkmode(context, favorDarkmode) {
			context.commit("favorDarkMode", favorDarkmode)
		},
	},
	mutations: {
		async username(state, username) {
			state.username = username
		},
		async favorDarkMode(state, favorDarkmode) {
			state.favorDarkmode = favorDarkmode
		},
	},
	plugins: [vuexLocal.plugin],
})

export function useStore() {
	return baseUseStore(key)
}
