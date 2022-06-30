import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import { resolve } from "path"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import ViteComponents from "unplugin-vue-components/vite"

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"~": resolve(__dirname, "src"),
		},
	},
	plugins: [
		vue(),
		WindiCSS(),
		ViteComponents({
			resolvers: [
				IconsResolver({
					prefix: "i",
				}),
			]
		}),
		Icons({ autoInstall: true }),
	],
})
