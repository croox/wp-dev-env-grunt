
const uglify = grunt => {

	const config = grunt.hooks.applyFilters( 'config.uglify', {
		destination: {
			options: {
				mangle: true,
				compress: true,
				beautify: false,
			},
			files: [{
				expand: true,
				cwd: grunt.option( 'destination' ) + '/js',
				src: [
					'**/*.js',
				],
				dest: grunt.option( 'destination' ) + '/js',
			}]
		},

	} );

	grunt.config( 'uglify', config );

};

module.exports = uglify;
