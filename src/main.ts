import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import "virtual:windi.css"
import { DefaultApolloClient } from "@vue/apollo-composable"
import apolloClient from "./scripts/apolloClient"
import { store, key } from "~/scripts/vuex"

createApp(App).use(router).use(store, key).provide(DefaultApolloClient, apolloClient).mount("#app")
