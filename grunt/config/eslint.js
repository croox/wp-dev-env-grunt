
const eslint = grunt => {

	const config = grunt.hooks.applyFilters( 'config.eslint', {
		src: {
			src: [
				'src/js/**/*.js',
				'src/js/**/*.jsx',
				...grunt.option( 'pattern' ).exclude,
			],
		},

		dest: {
			src: [
				grunt.option( 'destination' ) + '/js/**/*.js',
				grunt.option( 'destination' ) + '/js/**/*.jsx',
				...grunt.option( 'pattern' ).exclude,
			],
		},
	} );

	grunt.config( 'eslint', config );

};

module.exports = eslint;
