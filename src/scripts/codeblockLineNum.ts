const lineNum = () => {
	const pre = document.getElementsByTagName("pre")
	const pl = pre.length
	for (let i = 0; i < pl; i++) {
		pre[i].innerHTML =
			"<span class='line-number'></span>" + pre[i].innerHTML + "<span class='cl'></span>"
		const num = pre[i].innerHTML.split(/\n/).length
		for (let j = 0; j < num - 1; j++) {
			const line_num = pre[i].getElementsByTagName("span")[0]
			line_num.innerHTML += "<span>" + (j + 1) + "</span>"
		}
	}
}

export default lineNum
