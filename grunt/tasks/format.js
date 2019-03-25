

const format = grunt => {

	grunt.registerTask( 'format', '', function() {

		grunt.task.run( [
			'phpcs:format',
		] );

	} );
};

module.exports = format;
