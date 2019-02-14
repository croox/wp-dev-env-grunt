
const defaultTask = grunt => {
	grunt.registerTask( 'default', 'default task', function() {

		console.log( 'debug defaultTask' );		// ??? debug


		// was gibts denn für tasks ???

		// build
		// sync
		// watch
		// watch_sync	ws
		// dist

		// addchange


		// ??? ach die handles


		grunt.task.run( [
			'build',
		] );

	} );

};

module.exports = defaultTask;
