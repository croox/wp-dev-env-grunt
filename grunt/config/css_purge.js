
const css_purge = grunt => {

	grunt.config( 'css_purge', {
		destination: {
			files: [{
				expand: true,
				cwd: grunt.option( 'destination' ) + '/css',
				src: [
					'**/*.css',
				],
				dest: grunt.option( 'destination' ) + '/css',
			}]
		},

	} );

};

module.exports = css_purge;
