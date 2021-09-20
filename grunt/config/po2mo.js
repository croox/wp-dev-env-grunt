
const po2mo = grunt => {

	const config = grunt.hooks.applyFilters( 'config.po2mo', {
		options: {
            deleteSrc: false,
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

	grunt.config( 'po2mo', config );

};

module.exports = po2mo;

