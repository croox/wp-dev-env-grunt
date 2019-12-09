const path = require('path');
const wpPot = require('wp-pot');

const pot = grunt => {
	grunt.registerTask( 'pot', 'generate pot files from php sources', function() {
		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		const destFile = 'src/languages/' + ( 'plugin' === pkg.projectType ? pkg.textDomain + '-' : '' ) + 'LOCALE' + '.pot';
		const result = wpPot( {
			destFile: destFile,
			domain: pkg.textDomain,
			package: pkg.name,
			src: [
				'src/**/*.php',
				...grunt.option( 'pattern' ).exclude,
			],
		} );
		if ( result ) {
			grunt.log.writeln( 'File "' + destFile + '" created.' );
		}
	} );
};

module.exports = pot;
