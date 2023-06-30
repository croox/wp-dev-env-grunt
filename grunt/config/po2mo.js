const path = require('path');
const glob = require('glob');

const po2mo = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const cwd = 'src/languages/';

	const config = grunt.hooks.applyFilters( 'config.po2mo', {
		options: {
            deleteSrc: false,
		},
		main: {
			files: [{
				expand: true,
				cwd,
				src: glob.sync( path.resolve( cwd + '/*.po' ) ).reduce( ( acc, file ) => {
					const regex = RegExp( '(' + pkg.funcPrefix + '-)?[a-z]{2}_[A-Z]{2}(_[a-zA-z_]+)?.po' );
					if (  regex.test( path.basename( file ) ) ) {
						acc = [
							...acc,
							path.basename( file )
						];
					};
					return acc;
				}, [] ),
				dest: grunt.option( 'destination' ) + '/languages',
				nonull: true
			}]
		},
	} );

	grunt.config( 'po2mo', config );

};

module.exports = po2mo;

