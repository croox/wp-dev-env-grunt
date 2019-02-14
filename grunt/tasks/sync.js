const path = require('path');
const rsync = require( 'rsyncwrapper' );
const {
	get,
} = require( 'lodash' );


const getWpInstalls = require('../getWpInstalls');
const updateConfigs = require('../updateConfigs');




const getSyncSource = grunt => {

	const version = get( grunt.option( 'sync' ), ['version'], 'test_build' );

	var syncSource;
	if ( version === 'test_build' ){
		syncSource = path.resolve('test_build') + path.sep;

	} else if ( version === 'trunk'){
		syncSource = path.resolve('dist','trunk') + path.sep;

	} else if ( /((\d)\.(\d)\.(\d))/.test(version)){
		syncSource = path.resolve('dist','tags',version) + path.sep;

		if (! grunt.file.exists(syncSource)){
			grunt.warn('"' + version + '" is no valid version');
		}
	} else {
		grunt.warn('"' + version + '" is no valid version');
	}
	return syncSource;
}






const sync = grunt => {


	grunt.registerTask( 'sync', 'sync to local wp install', function( wp_installs, version ){


		// wp_installs
		if ( ! get( grunt.option( 'sync' ), ['wp_installs'], false ) ) {
			// check if args
			if ( ! wp_installs || ! wp_installs.length || wp_installs.length === 0 ) {
				return grunt.warn("no wp_install specified. sync skipped");
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



		var syncSource = getSyncSource( grunt );




		const done = this.async();
		const promises = [...get( grunt.option( 'sync' ), ['wp_installs'], [] )].map( wp_install => {
			return new Promise( ( resolve, reject ) => {
				try {
					rsync( {
						src: syncSource,
						dest: wp_install.path,
						recursive: true,
						delete: true,
					}, ( error, stdout, stderr, cmd ) => {
						grunt.log.writeln( 'Sync to ' + wp_install.name );
						grunt.log.writeln( 'Shell command was: ' + cmd );
						if ( error ) {
							grunt.log.error();
							grunt.log.writeln( error.toString().red );
							resolve( false );
						} else {
							grunt.log.ok();
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
