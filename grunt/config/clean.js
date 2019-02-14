
const clean = grunt => {

	grunt.config( 'clean', {
		destination: {
			src: [
				grunt.option( 'destination' ) + '/**/*',
			]

		}
	} );

};

module.exports = clean;