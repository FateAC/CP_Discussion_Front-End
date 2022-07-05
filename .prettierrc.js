module.exports = {
	useTabs: true,
	tabWidth: 4,
	jsxSingleQuote: false,
	bracketSameLine: true,
	printWidth: 100,
	singleQuote: false,
	semi: false,
	overrides: [
		{
			files: "*.json",
			options: {
				printWidth: 200,
			},
		},
	],
	arrowParens: "always",
}
