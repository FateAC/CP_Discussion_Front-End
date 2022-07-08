import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import { resolve } from "path"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import ViteComponents from "unplugin-vue-components/vite"
import Markdown, { code, link, meta } from "vite-plugin-md"
import MDItAnchor from "markdown-it-anchor"
import MDItPrism from "markdown-it-prism"
import MDItEmoji from "markdown-it-emoji"
import MDItMathjax from "markdown-it-mathjax3"
import MDItIns from "markdown-it-ins"
import MDItMark from "markdown-it-mark"
import MDItFootnote from "markdown-it-footnote"
import MDItContainer from "markdown-it-container"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-c"

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"~": resolve(__dirname, "src"),
		},
	},
	plugins: [
		vue({
			include: [/\.vue$/, /\.md$/],
		}),
		WindiCSS(),
		ViteComponents({
			resolvers: [
				IconsResolver({
					prefix: "i",
				}),
			],
		}),
		Icons({ autoInstall: true }),
		Markdown({
			markdownItOptions: {
				html: true,
				linkify: true,
				typographer: true,
			},
			markdownItSetup(md) {
				md.use(MDItAnchor)
				md.use(MDItPrism)
				md.use(MDItEmoji)
				md.use(MDItMathjax)
				md.use(MDItIns)
				md.use(MDItMark)
				md.use(MDItFootnote)
				md.use(MDItContainer, "spoiler", {
					validate: (params) => {
						return params.trim().match(/^spoiler\s+(.*)$/)
					},
					render: (tokens, idx) => {
						const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/)
						if (tokens[idx].nesting === 1) {
							return "<details><summary>" + md.utils.escapeHtml(m[1]) + "</summary>\n"
						} else {
							return "</details>\n"
						}
					},
				})
				md.use(MDItContainer, "success")
				md.use(MDItContainer, "info")
				md.use(MDItContainer, "warning")
				md.use(MDItContainer, "danger")
				// md.renderer.rules.table_open = () => {
				// 	return "<n-table>"
				// }
				// md.renderer.rules.table_close = () => {
				// 	return "</n-table>"
				// }
			},
			builders: [meta(), link(), code({ theme: "base" })],
		}),
	],
})
