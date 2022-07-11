import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import "virtual:windi.css"
import { DefaultApolloClient } from "@vue/apollo-composable"
import apolloClient from "./scripts/apolloClient"
import store from "./scripts/vuex"

createApp(App).use(router).use(store).provide(DefaultApolloClient, apolloClient).mount("#app")
