
const notify_hooks = grunt => {

	grunt.config( 'notify_hooks', {
		options: {
			enabled: true,
			max_jshint_notifications: 5,
			success: false,
			duration: 0,
		}
	} );

};

module.exports = notify_hooks;