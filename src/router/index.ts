import { createRouter, RouteRecordRaw, Router, createWebHistory } from "vue-router"
import store from "~/scripts/vuex"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: () => import("~/views/HomeView.vue"),
	},
	{
		path: "/about",
		name: "about",
		component: () => import("~/views/AboutView.vue"),
	},
	{
		path: "/login",
		name: "login",
		component: () => import("~/views/LoginView.vue"),
	},
	{
		path: "/dashboard",
		name: "dashboard",
		component: () => import("~/views/DashBoardView.vue"),
	},
	{
		path: "/homework",
		name: "homework",
		component: () => import("~/views/HomeworkView.vue"),
	},
	{
		path: "/profile",
		name: "profile",
		component: () => import("~/views/ProfileView.vue"),
	},
	{
		path: "/resetpwd",
		name: "resetpwd",
		component: () => import("~/views/ResetPWDView.vue"),
	},
	{
		path: "/404",
		name: "notfound",
		component: () => import("~/views/NotFoundView.vue"),
	},
	// must be the last one
	{
		path: "/:pathMatch(.*)*",
		redirect: "/404",
	},
]

const router: Router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	if (store.state.username !== null) {
		if (to.path === "/login" || to.path === "/resetpwd") {
			router.push("/dashboard")
		}
		const adminPath = ["/dashboard", "/profile"]
		const userPath = ["/dashboard", "/profile", "/homework"]
	} else {
		const tmpPath = ["/", "/about", "/login", "/resetpwd"]
		if (!tmpPath.includes(to.path)) {
			router.push("/login")
		}
	}
	next()
})

export default router
