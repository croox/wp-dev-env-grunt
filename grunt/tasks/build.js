
const path = require('path');

const build = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask( 'build', 'build the ' + pkg.projectType + ' into ./test_build', function() {

		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

		let tasks = [
			'clean',
			'string-replace:inc_to_dest',
			'string-replace:template_parts',
			'create_autoloader:fun',
			'create_autoloader:post_types_taxs',
			'create_autoloader:roles_capabilities',
			'copy:images',
			'copy:fonts',
			'copy:root_files',
			'eslint:src',
			'browserify',
			'concat:readme',
			'concat:readmeMd',
			'wp_readme_to_markdown',
			'create_dummy_project_file',
			'sass:all',
			...( grunt.option( 'compress' ) ? [
				'uglify:destination',
				'css_purge:destination',
			] : [] ),
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
					'string-replace:plugin_main_file',
					'concat:plugin_main_file',
					'concat:dummy_plugin_file',
				];
				break;
			case 'theme':
				tasks = [
					...tasks,
					'string-replace:templates',
					'string-replace:functionsPhp',
					'create_autoloader:template_functions',
					'create_autoloader:template_tags',
					'concat:style',
					'concat:dummy_theme_style',
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
