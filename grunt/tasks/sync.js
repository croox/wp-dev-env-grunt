const path = require('path');
const isCygwin = require('is-cygwin');
const chalk = require('chalk');
const rsync = require( 'rsyncwrapper' );
const {
	get,
	omit,
	union,
} = require( 'lodash' );

const getWpInstalls = require('../getWpInstalls');

// ??? recode this
const getSyncSource = grunt => {

	const version = get( grunt.option( 'sync' ), ['version'], 'test_build' );

	let syncSource = '';
	if ( version === 'test_build' ){
		syncSource = path.resolve('test_build') + path.sep;

	} else if ( version === 'trunk'){
		syncSource = path.resolve( 'dist', 'trunk' ) + path.sep;

	} else if ( /((\d)\.(\d)\.(\d))/.test(version)){
		syncSource = path.resolve( 'dist', 'tags', version ) + path.sep;
		if ( ! grunt.file.exists( syncSource ) )
			grunt.warn('"' + version + '" is no valid version');

	} else {
		grunt.warn('"' + version + '" is no valid version');
	}

	if ( isCygwin() ) {
		syncSource = '/cygdrive/' + syncSource
			.replace( /\\/g, '/' )
			.replace( /^\S:\//g, match => match
				.toLowerCase()
				.replace( ':', '' )
			);
	}

	return syncSource;
}

const sync = grunt => {

	grunt.registerTask( 'sync', 'sync to wp_install(s)', function( wp_installs, version ){

		// wp_installs
		if ( ! get( grunt.option( 'sync' ), ['wp_installs'], false ) ) {
			// check if args
			if ( ! wp_installs || ! wp_installs.length || wp_installs.length === 0 ) {
				return grunt.log.writeln( 'no wp_install specified. sync skipped' ).yellow;
			} else {
				grunt.option( 'sync', {
					...grunt.option( 'sync' ),
					wp_installs: getWpInstalls( grunt, wp_installs ),
				} );
			}
		}

		// version
		if ( ! get( grunt.option( 'sync' ), ['version'], false ) ) {
			grunt.option( 'sync', {
				...grunt.option( 'sync' ),
				version: undefined === version || ! version.length ? 'test_build' : version,
			} );
		}

		const syncSource = getSyncSource( grunt );

		const done = this.async();
		const promises = [...get( grunt.option( 'sync' ), ['wp_installs'], [] )].map( wp_install => {
			return new Promise( ( resolve, reject ) => {
				try {

					const excludeArgs  = [...get( wp_install, ['args'], [] )].filter( arg => arg.startsWith( '!' ) ).map( arg => arg.replace( '!', '' ) );
					const args = union(
						[...get( wp_install, ['args'], [] )].filter( arg => ! arg.startsWith( '!' ) ),
						[
							'--archive',
							'--stats',
						]
					).filter( arg => ! excludeArgs.includes( arg ) );

					rsync( {
						onStdout: data => grunt.log.write( data ),
						onStderr: data => grunt.log.write( chalk.bgRed( data ) ),
						src: syncSource,
						recursive: true,
						delete: true,
						...( wp_install.dest.includes( '@' ) && { ssh: true } ),
						...omit( wp_install, ['name','args'] ),
						args: args,
					}, ( error, stdout, stderr, cmd ) => {

						const outputColorFn = error ? chalk.bgRed : chalk.green;
						grunt.log.writeln( '' );
						grunt.log.writeln( outputColorFn( 'Sync to ' ) + wp_install.name );
						grunt.log.writeln( outputColorFn( 'Shell command was: ' ) + cmd );

						if ( error ) {
							grunt.log.error();
							grunt.log.writeln( outputColorFn( error.toString() ) );
							resolve( false );
						} else {
							grunt.log.writeln( outputColorFn( 'Sync successfull' ) );
							resolve( true );
						}
					} );

				} catch ( error ) {
					grunt.log.writeln( '\n' + error.toString().red );
					resolve( false );
				}
			} );
		} );
		Promise.all( promises ).then( result => done.apply() );

	});
};

module.exports = sync;
