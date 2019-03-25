'use strict';

const path = require('path');
const {
	isBoolean,
} = require( 'lodash' );

const createHooks = require('./createHooks');
const updateConfigs = require('./updateConfigs');
const setupHooks = require('./setupHooks');
const setOptionRelease = require('./setOptionRelease');
const setOptionChangelog = require('./setOptionChangelog');

const startGrunt = grunt => {

	if ( ! grunt.hooks ) createHooks( grunt );

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	// load tasks
	grunt.hooks.doAction( 'startGrunt.loadTasks.before' );
	require('time-grunt')(grunt);

	[
		'grunt-browserify',
		'grunt-cleanempty',
		'grunt-contrib-clean',
		'grunt-contrib-compress',
		'grunt-contrib-concat',
		'grunt-contrib-copy',
		'grunt-contrib-sass',
		'grunt-contrib-uglify-es',
		'grunt-contrib-watch',
		'grunt-css-purge',
		'grunt-git',
		'grunt-notify',
		'grunt-po2json',
		'grunt-pot',
		'grunt-potomo',
		'grunt-string-replace',
		'grunt-wp-readme-to-markdown',
		'gruntify-eslint',
	].map( module => grunt.loadNpmTasks( module ) );
	grunt.loadTasks( path.join( path.resolve( 'node_modules' ), 'wp-dev-env-grunt', 'grunt', 'tasks' ) );
	grunt.hooks.doAction( 'startGrunt.loadTasks.after' );


	grunt.hooks.doAction( 'startGrunt.initOptions.before' );
	// set option pattern
	grunt.option( 'pattern', grunt.hooks.applyFilters( 'startGrunt.option.pattern', {
		exclude: [
			'!*~',
			'!**/*~',
			'!#*#',
			'!**/#*#',
			'!*.xcf',
			'!**/*.xcf',
			'!readme.md',	// lower case is used for generator docs
			'!**/readme.md',	// lower case is used for generator docs
		],
		excludeFromRoot: [
			'!inc',
			'!inc/**/*',
			'!classes',
			'!classes/**/*',
			'!images',
			'!images/**/*',
			'!fonts',
			'!fonts/**/*',
			'!js',
			'!js/**/*',
			'!scss',
			'!scss/**/*',
			'!languages',
			'!languages/**/*',
			...( 'theme' === pkg.projectType ? [
				'!templates',
				'!templates/**/*',
			] : [] ),
		],
	} ) );
	// set option compress
	if ( ! isBoolean( grunt.option( 'compress' ) ) )
		grunt.option( 'compress', false );
	// set option destination
	if ( ! ['test_build','dist/trunk'].includes( grunt.option( 'destination' ) ) )
		grunt.option( 'destination', 'test_build' );
	// set option changelog
	setOptionChangelog( grunt, null );
	// set option release
	setOptionRelease( grunt, null );
	grunt.hooks.doAction( 'startGrunt.initOptions.after' );

	// setup config
	grunt.initConfig( {} );
	updateConfigs( grunt );


	grunt.task.run('notify_hooks');
	setupHooks(grunt);
};

module.exports = startGrunt;

