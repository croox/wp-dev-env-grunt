
const path = require('path');

const build = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask( 'build', 'build the ' + pkg.projectType + ' into ./test_build', function() {

		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

		let tasks = [
			'clean',
			'composer_dumpAutoload',
			'copy:root',
			'copy:vendor_composer',
			'copy:vendor_croox_wde_frame',
			'copy:vendor_cmb2',
			'string-replace:root',
			'string-replace:inc_to_dest',
			'create_autoloader:inc',
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
					'concat:style',
					'concat:dummy_theme_style',
				];
				break;
		}

		tasks = [
			...tasks,
			'cleanempty',
			'sound:bling',
		];

		tasks = grunt.hooks.applyFilters( 'tasks.build.tasks', tasks );

		grunt.task.run( tasks );
	});
};

module.exports = build;
