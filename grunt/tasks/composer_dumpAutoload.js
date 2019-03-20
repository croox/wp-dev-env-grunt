
const chalk = require( 'chalk' );

const composer_dumpAutoload = grunt => {

	grunt.registerTask( 'composer_dumpAutoload', 'sub task: used by build', function() {

		const done = this.async();

		new Promise( ( resolve, reject ) => grunt.util.spawn( {
			cmd: 'composer',
			args: [
				'dump-autoload',
				'--optimize',
			],
		}, ( error, result, code ) => {
			if ( error ) {
				grunt.warn( error );
				done.apply( false );
			}

			[
				 result.stdout,
				 result.stderr,
			].map( str => grunt.log.writeln( chalk.green( str ) ) )

			done.apply();
		} ) );

	} );

};

module.exports = composer_dumpAutoload;
