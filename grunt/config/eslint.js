
const eslint = grunt => {

	grunt.config( 'eslint', {
		src: {
			src: [
				'src/js/**/*.js',
				'src/js/**/*.jsx',
				...grunt.option( 'pattern' ).exclude,
			]
		},

		dest: {
			src: [
				grunt.option( 'destination' ) + '/js/**/*.js',
				grunt.option( 'destination' ) + '/js/**/*.jsx',
				...grunt.option( 'pattern' ).exclude,
			]
		},
	} );

};

module.exports = eslint;
