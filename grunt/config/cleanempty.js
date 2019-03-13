
const cleanempty = grunt => {

	const config = grunt.hooks.applyFilters( 'config.cleanempty', {
		options: {
			files: false,
			folders: true,
		},
		destination: {
			src: [
				grunt.option( 'destination' ) + '/**/',
			],
		},

	} );

	grunt.config( 'cleanempty', config );

};

module.exports = cleanempty;
