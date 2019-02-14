
const potomo = grunt => {

	grunt.config( 'potomo', {
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

};

module.exports = potomo;

