
const css_purge = grunt => {

	const config = grunt.hooks.applyFilters( 'config.css_purge', {
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

	grunt.config( 'css_purge', config );

};

module.exports = css_purge;
