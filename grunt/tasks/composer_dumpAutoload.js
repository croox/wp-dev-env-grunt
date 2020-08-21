
const path = require( 'path' );
const chalk = require( 'chalk' );

const composer_dumpAutoload = grunt => {

	grunt.registerTask( 'composer_dumpAutoload', 'sub task: used by build', function() {

		const done = this.async();

		new Promise( ( resolve, reject ) => grunt.util.spawn( {
			cmd: 'composer',
			args: [
				'dump-autoload',
				'--optimize',
				'--classmap-authoritative',
			],
		}, ( error, result, code ) => {
			// Maybe throw error
			if ( error ) {
				grunt.warn( error );
				done.apply( false );
			}

			// Adjust composer/autoload_static.php classMap
			// Add function to remove all entries for `croox/wp-dev-env-frame`, if plugin active `Croox__wp-dev-env-frame-loader_wp-plugin`
			const autoload_static_path = path.resolve( 'vendor/composer/autoload_static.php' )
			grunt.file.write( autoload_static_path, grunt.file.read( autoload_static_path ).replace( /^(\s*?)\$loader->classMap\s*?=\s*?(ComposerStaticInit[a-z\d]+?::\$classMap);/gm, ( match, p1, p2 ) => [
				p1 + 'if ( function_exists( "is_plugin_active" )',
				p1 + '  && false === strpos( __DIR__, "Croox__wp-dev-env-frame-loader_wp-plugin" )',
				p1 + '	&& is_plugin_active( "Croox__wp-dev-env-frame-loader_wp-plugin/Croox__wp-dev-env-frame-loader_wp-plugin.php" )',
				p1 + ') {',
				p1 + '	$loader->classMap = array_filter( ' + p2 + ', function( $path ) {',
				p1 + '		return false === strpos( $path, "croox/wp-dev-env-frame" );',
				p1 + '	} );',
				p1 + '} else {',
				p1 + '	$loader->classMap = ' + p2 + ';',
				p1 + '}',
			].join( '\n' ) ) );

			// Print result
			[
				 result.stdout,
				 result.stderr,
			].map( str => grunt.log.writeln( chalk.green( str ) ) );

			done.apply();
		} ) );

	} );

};

module.exports = composer_dumpAutoload;

