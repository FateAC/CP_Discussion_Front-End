import { createStore } from "vuex"
import VuexPersistence from "vuex-persist"

const vuexLocal = new VuexPersistence<RootState>({
	storage: window.localStorage,
})

const store = createStore({
	state() {
		return {
			user: null,
			favorDarkmode: null,
		}
	},
	getters: {
		user: (state) => {
			return state.user
		},
		favorDarkmode: (state) => {
			return state.favorDarkmode
		},
	},
	actions: {
		user(context, user) {
			context.commit("user", user)
		},
		favorDarkmode(context, favorDarkmode) {
			context.commit("favorDarkMode", favorDarkmode)
		},
	},
	mutations: {
		async user(state, user) {
			state.user = user
		},
		async favorDarkMode(state, favorDarkmode) {
			state.favorDarkmode = favorDarkmode
		},
	},
	plugins: [vuexLocal.plugin],
})

export default store
