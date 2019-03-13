
const clean = grunt => {

	const config = grunt.hooks.applyFilters( 'config.clean', {
		destination: {
			src: [
				grunt.option( 'destination' ) + '/**/*',
			]

		}
	} );

	grunt.config( 'clean', config );

};

module.exports = clean;