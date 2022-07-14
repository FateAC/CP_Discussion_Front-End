import { createRouter, RouteRecordRaw, Router, createWebHistory } from "vue-router"

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
		path: "/resetpwd",
		name: "resetpwd",
		component: () => import("~/views/ResetPWDView.vue"),
	},
]

const router: Router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
