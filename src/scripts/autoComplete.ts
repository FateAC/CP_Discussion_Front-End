import { computed, Ref } from "vue"

const emailOptions = (email: Ref<string>) => {
	return computed(() => {
		return ["@ntnu.edu.tw"].map((suffix) => {
			const prefix = email.value.split("@")[0]
			return {
				label: prefix + suffix,
				value: prefix + suffix,
			}
		})
	})
}

export default emailOptions
