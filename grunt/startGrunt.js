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



const updateConfigs = require('./updateConfigs');
const loadNpmTasks = require('./loadNpmTasks');
const setupHooks = require('./setupHooks');
const getChangelog = require('./getChangelog');


const startGrunt = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	// load tasks
	require('time-grunt')(grunt);
	loadNpmTasks( grunt, 'grunt-browserify' );
	loadNpmTasks( grunt, 'grunt-cleanempty' );
	loadNpmTasks( grunt, 'grunt-contrib-clean' );
	loadNpmTasks( grunt, 'grunt-contrib-compress' );
	loadNpmTasks( grunt, 'grunt-contrib-concat' );
	loadNpmTasks( grunt, 'grunt-contrib-copy' );
	loadNpmTasks( grunt, 'grunt-contrib-sass' );
	loadNpmTasks( grunt, 'grunt-contrib-uglify-es' );
	loadNpmTasks( grunt, 'grunt-contrib-watch' );
	loadNpmTasks( grunt, 'grunt-css-purge' );
	loadNpmTasks( grunt, 'grunt-git' );
	loadNpmTasks( grunt, 'grunt-notify' );
	loadNpmTasks( grunt, 'grunt-po2json' );
	loadNpmTasks( grunt, 'grunt-pot' );
	loadNpmTasks( grunt, 'grunt-potomo' );
	loadNpmTasks( grunt, 'grunt-string-replace' );
	loadNpmTasks( grunt, 'grunt-wp-readme-to-markdown' );
	loadNpmTasks( grunt, 'gruntify-eslint' );
	grunt.loadTasks( path.join( path.resolve( 'node_modules' ), 'wp-dev-env-grunt', 'grunt','tasks' ) );


	// set option pattern
	grunt.option( 'pattern', {
		exclude: [
			'!*~',
			'!**/*~',
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
	} );
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


	// setup config
	grunt.initConfig( {} );
	updateConfigs( grunt );


	grunt.task.run('notify_hooks');
	setupHooks(grunt);
};

module.exports = startGrunt;

