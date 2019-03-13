
const wp_readme_to_markdown = grunt => {

	const file = grunt.option( 'destination' ) + '/README.md';

	const config = grunt.hooks.applyFilters( 'config.wp_readme_to_markdown', {
		readmeMd: {
			files: { [file]:file },
		},
	}, file );

	grunt.config( 'wp_readme_to_markdown', config );

};

module.exports = wp_readme_to_markdown;