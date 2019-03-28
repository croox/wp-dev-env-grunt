
const format = grunt => {

	grunt.registerTask( 'format', '', function( extensions ) {

		const tasks = extensions ? [...extensions.split(',')].map( ext => {
			switch( ext ) {
				case 'php':
					return 'phpcs:format:php';
				case 'js':
				case 'jsx':
				case 'scss':
				case 'md':
					return 'prettier:' + ext.trim();
			}

		} ) : [
			'phpcs:format:php',
			'prettier',		// js, jsx, scss, md
		];

		grunt.task.run( tasks );

	} );
};

module.exports = format;
