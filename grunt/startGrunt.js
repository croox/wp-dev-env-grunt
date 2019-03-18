'use strict';

const path = require('path');
const fs = require('fs');
const player = require('play-sound')();

const {
	parser,
	Changelog,
} = require('keep-a-changelog');

const {
	debounce,
	isBoolean,
	omit,
} = require( 'lodash' );

const createHooks = require('./createHooks');
const updateConfigs = require('./updateConfigs');
const setupHooks = require('./setupHooks');
const getChangelog = require('./getChangelog');

const startGrunt = grunt => {

	if ( ! grunt.hooks ) createHooks( grunt );

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	// load tasks
	grunt.hooks.doAction( 'startGrunt.loadTasks.before' );
	require('time-grunt')(grunt);
	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-cleanempty' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify-es' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-css-purge' );
	grunt.loadNpmTasks( 'grunt-git' );
	grunt.loadNpmTasks( 'grunt-notify' );
	grunt.loadNpmTasks( 'grunt-po2json' );
	grunt.loadNpmTasks( 'grunt-pot' );
	grunt.loadNpmTasks( 'grunt-potomo' );
	grunt.loadNpmTasks( 'grunt-string-replace' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
	grunt.loadNpmTasks( 'gruntify-eslint' );
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
		],
		excludeFromRoot: [
			'!inc',
			'!inc/**/*',
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
	// let changelog;
	const changelog = getChangelog( grunt, pkg );
	// try { changelog = parser( grunt.file.read( 'CHANGELOG.md', 'UTF-8') ); }
	// catch( err ) { changelog = new Changelog( pkg.displayName ); }
	changelog.title = '';
	changelog.description = '== Changelog ==';
	grunt.option( 'changelog', changelog );
	grunt.hooks.doAction( 'startGrunt.initOptions.after' );


	// setup config
	grunt.initConfig( {} );
	updateConfigs( grunt );


	grunt.task.run('notify_hooks');
	setupHooks(grunt);
};

module.exports = startGrunt;

