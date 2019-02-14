
const {
	// get,
	isString,
} = require( 'lodash' );

const getWpInstalls = require( '../getWpInstalls' );

const watch_sync = grunt => {

	grunt.registerTask( 'watch_sync', '???', function( wp_installs ) {

		if ( ! isString( wp_installs ) || wp_installs.length === 0 || 'undefined' === wp_installs ) {
			grunt.log.writeln('sync dest is empty ... no sync, just watch'); // ???
		} else {
			grunt.option( 'sync', {
				wp_installs: getWpInstalls( grunt, wp_installs ),		// wp_installs: wp_installs,
				version: 'test_build',
			} );
		}

		// run tasks
		grunt.task.run([
			'watch',
		]);

	});
};

module.exports = watch_sync;
