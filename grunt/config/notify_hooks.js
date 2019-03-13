
const notify_hooks = grunt => {

	const config = grunt.hooks.applyFilters( 'config.notify_hooks', {
		options: {
			enabled: true,
			max_jshint_notifications: 5,
			success: false,
			duration: 0,
		}
	} );

	grunt.config( 'notify_hooks', config );

};

module.exports = notify_hooks;