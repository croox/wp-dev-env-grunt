
const potomo = grunt => {

	const config = grunt.hooks.applyFilters( 'config.potomo', {
		options: {
			poDel: false
		},
		main: {
			files: [{
				expand: true,
				cwd: 'src/languages/',
				src: ['*.po'],
				dest: grunt.option( 'destination' ) + '/languages',
				ext: '.mo',
				nonull: true
			}]
		},
	} );

	grunt.config( 'potomo', config );

};

module.exports = potomo;

