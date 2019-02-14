
const ws = grunt => {
	grunt.registerTask( 'ws', 'Alias task for watch_sync', function( wp_installs ) {
		grunt.task.run(['watch_sync:' + wp_installs]);
	});
};

module.exports = ws;
