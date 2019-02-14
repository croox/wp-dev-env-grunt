
const uglify = grunt => {

	grunt.config( 'uglify', {
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

};

module.exports = uglify;
