??? sorry README.md still missing


Grunt environment for WordPress Plugins/Themes/Childthemes generated with generator-wp-dev-env

Can't be used as an ordinary grunt plugin. Only in combintion with generator-wp-dev-env

## customization

[@wordpress/hooks](https://www.npmjs.com/package/@wordpress/hooks) is used to create action and filter hooks.

Hooks can be added in projects Gruntfile.js, after hooks are created and before grunt is started.

Example Gruntfile:
	'use strict';

	const {
		startGrunt,
		createHooks,
	} = require( 'wp-dev-env-grunt' );

	module.exports = grunt => {
		createHooks( grunt );

		grunt.hooks.addFilter( 'config.copy', 'emk.configCopy', config => {
			// do something with the config object. Maybe log something:
			grunt.log.writeln( config.vendor_composer.src );
			return config;
		}, 10 )

		startGrunt( grunt );
	};

### filter

startGrunt.option.pattern
replacements.replacements
config.browserify
config.clean
config.cleanempty
config.compress
config.concat					commonconfig
config.copy
config.create_autoloader
config.css_purge
config.eslint
config.gitadd
config.gitcommit
config.gittag
config.gitpush
config.notify_hooks
config.po2json
config.pot.handles
config.pot.options
config.pot						handles		options
config.potomo
config.sass
config.string-replace
config.uglify
config.watch
config.wp_readme_to_markdown
tasks.build.tasks
tasks.dist.tasks
tasks.sound.file
tasks.sound.soundsPath
tasks.sound.play

### actions
startGrunt.loadTasks.before
startGrunt.loadTasks.after
startGrunt.initOptions.before
startGrunt.initOptions.after
updateConfigs.before
updateConfigs.after