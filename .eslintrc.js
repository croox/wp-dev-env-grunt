module.exports = {
	root: true,
	extends: ['xo', 'prettier'],
	env: {
		node: true,
	},
	rules: {
		// The repo deliberately uses snake_case identifiers (e.g. wp_installs, watch_sync).
		camelcase: 'off',
	},
	ignorePatterns: ['node_modules'],
};
