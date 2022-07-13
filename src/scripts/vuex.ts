import { createStore } from "vuex"
import createPresistedState from "vuex-persistedstate"

const store = createStore({
	state() {
		return {
			user: null,
		}
	},
	getters: {
		user: (state) => {
			return state.user
		},
	},
	actions: {
		user(context, user) {
			context.commit("user", user)
		},
	},
	mutations: {
		async user(state, user) {
			state.user = user
		},
	},
	plugins: [createPresistedState()],
})

export default store
