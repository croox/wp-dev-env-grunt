
const {
	// get,
	isString,
} = require( 'lodash' );

const getWpInstalls = require( '../getWpInstalls' );

const watch_sync = grunt => {

	grunt.registerTask( 'watch_sync', 'Comnbination watch and sync. Watch for filechanges, build into .test_build and sync to wp_install', function( wp_installs ) {

		if ( undefined === wp_installs || ! isString( wp_installs ) || wp_installs.length === 0 || 'undefined' === wp_installs ) {
			grunt.log.writeln('sync dest is empty ... no sync, just watch');
		} else {
			grunt.option( 'sync', {
				wp_installs: getWpInstalls( grunt, wp_installs ),
				version: 'test_build',
			} );
		}

		grunt.task.run([
			'watch',
		]);

	});
};

module.exports = watch_sync;
