
const path = require('path');

const addDefaultBuildTasks = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	[
		{
			priority: 5,
			tasks: [
				'clean',
			],
		},
		{
			priority: 10,
			tasks: [
				'composer_dumpAutoload',
			],
		},
		{
			priority: 15,
			tasks: [
				'copy:root',
				'copy:images',
				'copy:fonts',
			],
		},
		// hook copy tasks for vendor dirs on priority 20
		{
			priority: 20,
			tasks: [
				'copy:vendor_croox_wde_frame',
				'string-replace:vendor_composer',
			],
		},
		{
			priority: 30,
			tasks: [
				'string-replace:classes',
				'string-replace:root',
				'string-replace:inc_to_dest',
			],
		},
		{
			priority: 35,
			tasks: [
				'create_autoloader:inc',
			],
		},
		{
			priority: 40,
			tasks: [
				'eslint:src',
				'browserify',
			],
		},
		{
			priority: 50,
			tasks: [
				'concat:readme',
				'concat:readmeMd',
				'wp_readme_to_markdown',
				'create_dummy_project_file',
			],
		},
		{
			priority: 60,
			tasks: [
				'sass:all',
				...( grunt.option( 'compress' ) ? [
					'uglify:destination',
					'css_purge:destination',
				] : [] ),
				'css_properties',
			],
		},
		{
			priority: 70,
			tasks: [
				'pot',
				...( grunt.file.expand( { cwd: 'src/languages/' }, ['*.po'] ).length ? [
					'potomo',
					'po2json',
				] : [] ),
			],
		},
		{
			priority: 100,
			tasks: [
				...( 'plugin' === pkg.projectType ? [
					'string-replace:plugin_main_file',
					'concat:plugin_main_file',
					'concat:dummy_plugin_file',
				] : [] ),
				...( 'theme' === pkg.projectType ? [
					'string-replace:templates',
					'string-replace:functionsPhp',
					'concat:style',
					'concat:dummy_theme_style',
				] : [] ),
			],
		},
		{
			priority: 1000,
			tasks: [
				'cleanempty',
				'sound:bling',
			],
		},
	].map( obj => grunt.hooks.addFilter( 'tasks.build.tasks', 'tasks.build.tasks.' + obj.priority, tasks => [
		...tasks,
		...obj.tasks,
	], obj.priority ) );

}

module.exports = addDefaultBuildTasks;
