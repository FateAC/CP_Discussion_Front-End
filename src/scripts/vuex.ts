import { createStore } from "vuex"
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage
})

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
	plugins: [vuexLocal.plugin],
})

export default store
