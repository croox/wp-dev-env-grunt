
const po2json = grunt => {

	const config = grunt.hooks.applyFilters( 'config.po2json', {
		options: {
			format: 'jed',
		},
		all: {
			files: [{
				expand: true,
				cwd: 'src/languages/',
				src: ['*.po'],
				dest: grunt.option( 'destination' ) + '/languages',
				rename: ( dst, src ) => dst + '/' + src.replace( src, ''),
			}]
		}
	} );

	grunt.config( 'po2json', config );

};

module.exports = po2json;

