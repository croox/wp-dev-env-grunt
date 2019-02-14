
const wp_readme_to_markdown = grunt => {

	const file = grunt.option( 'destination' ) + '/README.md';

	grunt.config( 'wp_readme_to_markdown', {
		readmeMd: {
			files: { [file]:file },
		},
	} );

};

module.exports = wp_readme_to_markdown;