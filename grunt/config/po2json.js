
const po2json = grunt => {

	grunt.config( 'po2json', {
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

};

module.exports = po2json;

