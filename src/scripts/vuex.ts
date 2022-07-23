import { createStore } from "vuex"
import VuexPersistence from "vuex-persist"

const vuexLocal = new VuexPersistence<RootState>({
	storage: window.localStorage,
})

const store = createStore({
	state() {
		return {
			username: null,
			favorDarkmode: null,
		}
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

export default store
