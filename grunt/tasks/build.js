
const path = require('path');

const build = grunt => {

	grunt.registerTask( 'build', 'sub task', function() {

		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

		let tasks = [
			'clean',
			'concat:readme',
			'concat:readmeMd',
			'wp_readme_to_markdown',
			'string-replace:inc_to_dest',
			'copy:images',
			'copy:fonts',
			'copy:root_files',
			'eslint:src',
			'browserify',
			...( grunt.option( 'compress' ) ? ['uglify:destination'] : [] ),
			'pot',
			...( grunt.file.expand( { cwd: 'src/languages/' }, ['*.po'] ).length ? [
				'potomo',
				'po2json',
			] : [] ),
		];

		switch( pkg.projectType ) {
			case 'plugin':
				tasks = [
					...tasks,
					'string-replace:plugin_main_file',	// functionsPhp
					'create_dummy_plugin_main_file',
					'concat:plugin_main_file',			// add banner plugin_main_file
					'concat:dummy_plugin_main_file',	// add banner dummy plugin_main_file
					'sass:all',
				];
				break;
			case 'theme':
				tasks = [
					...tasks,
					'string-replace:templates',		// theme
					'sass:main',
					'sass:other',
					'concat:styleBanner',
				];
				break;
		}

		tasks = [
			...tasks,
			'sound:bling',
		];

		grunt.task.run( tasks );
	});
};

module.exports = build;
