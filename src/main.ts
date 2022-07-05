import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import "virtual:windi.css"
import { DefaultApolloClient } from "@vue/apollo-composable"
import apolloClient from "./scripts/apolloClient"

createApp(App).use(router).provide(DefaultApolloClient, apolloClient).mount("#app")
