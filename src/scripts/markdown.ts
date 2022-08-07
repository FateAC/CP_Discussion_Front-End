import MarkdownIt from "markdown-it"
import MDItAnchor from "markdown-it-anchor"
import MDItEmoji from "markdown-it-emoji"
import MDItMathjax from "markdown-it-mathjax3"
import MDItIns from "markdown-it-ins"
import MDItMark from "markdown-it-mark"
import MDItFootnote from "markdown-it-footnote"
import MDItContainer from "markdown-it-container"
import MDHighlightJS from "~/scripts/mdHighlightJS"

const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
})

md.use(MDHighlightJS)
md.use(MDItAnchor)
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

export default md
