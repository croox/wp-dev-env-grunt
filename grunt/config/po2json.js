const path = require('path');
const glob = require('glob');

const po2json = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const cwd = 'src/languages/';

	const config = grunt.hooks.applyFilters( 'config.po2json', {
		options: {
			format: 'jed',
		},
		all: {
			files: [{
				expand: true,
				cwd,
				src: glob.sync( path.resolve( cwd + '/*.po' ) ).reduce( ( acc, file ) => {
					const regex = RegExp( '(' + pkg.funcPrefix + '-)?[a-z]{2}_[A-Z]{2}(_[a-zA-z_]+)?-[a-zA-z_-]+.po' );
					if (  regex.test( path.basename( file ) ) ) {
						acc = [
							...acc,
							path.basename( file )
						];
					};
					return acc;
				}, [] ),
				dest: grunt.option( 'destination' ) + '/languages',
				rename: ( dst, src ) => dst + '/' + src.replace( src, ''),
			}]
		}
	} );

	grunt.config( 'po2json', config );

};

module.exports = po2json;

