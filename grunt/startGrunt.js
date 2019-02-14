'use strict';

const path = require('path');

const {
	parser,
	Changelog,
} = require('keep-a-changelog');
const fs = require('fs');

const {
	// get,
	isBoolean,
} = require( 'lodash' );


const updateConfigs = require('./updateConfigs');

const player = require('play-sound')();

var wdeg = 'wp-dev-env-grunt';

const loadNpmTasks = ( grunt, name ) => {
	const root = path.resolve( 'node_modules' );
	const pkgfile = path.join( root, wdeg, 'node_modules', name,'package.json' );
	const pkg = grunt.file.exists( pkgfile ) ? grunt.file.readJSON( pkgfile ) : { keywords: [] };

	// Process task plugins.
	const tasksdir = path.join( root, wdeg, 'node_modules', name, 'tasks' );
	if ( grunt.file.exists( tasksdir ) )
		grunt.loadTasks( tasksdir );
};


const startGrunt = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	loadNpmTasks( grunt, 'grunt-browserify' );
	loadNpmTasks( grunt, 'grunt-contrib-clean' );
	loadNpmTasks( grunt, 'grunt-contrib-compress' );
	loadNpmTasks( grunt, 'grunt-contrib-concat' );
	loadNpmTasks( grunt, 'grunt-contrib-copy' );
	loadNpmTasks( grunt, 'grunt-contrib-sass' );
	loadNpmTasks( grunt, 'grunt-contrib-uglify-es' );
	loadNpmTasks( grunt, 'grunt-contrib-watch' );
	loadNpmTasks( grunt, 'grunt-git' );
	loadNpmTasks( grunt, 'grunt-notify' );
	loadNpmTasks( grunt, 'grunt-po2json' );
	loadNpmTasks( grunt, 'grunt-pot' );
	loadNpmTasks( grunt, 'grunt-potomo' );
	loadNpmTasks( grunt, 'grunt-string-replace' );
	loadNpmTasks( grunt, 'grunt-wp-readme-to-markdown' );
	loadNpmTasks( grunt, 'gruntify-eslint' );

	grunt.loadTasks( path.join( path.resolve( 'node_modules' ), wdeg, 'grunt','tasks' ) );


	// set option pattern
	grunt.option( 'pattern', {
		exclude: [
			'!*~',
			'!**/*~',
			'!*.xcf',
			'!**/*.xcf',
		],
	} );
	// set option compress
	if ( ! isBoolean( grunt.option( 'compress' ) ) )
		grunt.option( 'compress', false );
	// set option destination
	if ( ! ['test_build','dist/trunk'].includes( grunt.option( 'destination' ) ) )
		grunt.option( 'destination', 'test_build' );
	// set option changelog
	let changelog;
	try { changelog = parser( grunt.file.read( 'CHANGELOG.md', 'UTF-8') ); }
	catch( err ) { changelog = new Changelog( pkg.displayName ); }
	changelog.title = '';
	changelog.description = '== Changelog ==';
	grunt.option( 'changelog', changelog );


	// setup config
	grunt.initConfig( {} );
	updateConfigs( grunt );




	// grunt.event.on('watch', function(action, filepath, target) {
	// 	grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	// });

	// grunt.task.run('notify_hooks');
	// onWatchUpdateConfig(grunt);
	// setupFailHooks
	setupFailHooks(grunt);
};

module.exports = startGrunt;












function onWatchUpdateConfig( grunt ) {
	let changedFiles = Object.create(null);

	let onChange = grunt.util._.debounce(function() {
		// update js config
		updateJsConfig( grunt, changedFiles );
		// update scss config
		updateScssConfig( grunt, changedFiles );
		// reset changedFiles
		changedFiles = Object.create(null);
	}, 200);

	grunt.event.on('watch', function( action, filepath, target ) {
		if ( 'commonJS' === target ){
			changedFiles[filepath] = action;
			onChange();
		}
	});
}

function updateJsConfig( grunt, changedFiles ) {
	const changed = Object.keys( grunt.util._.omit( changedFiles, ( value, key, object ) => ! ['.js','.jsx'].includes( path.extname( key ) ) ) );

	// update eslint config
	grunt.config('eslint.commonJS.src', changed );

	// update browserify config
	const config = grunt.config('browserify.debug.files' )[0];
	config.src = [];
	grunt.util._.each( changed, function( filepath ){
		let filepathCwd = filepath.replace( config.cwd + '/', '' );
		if ( -1 !== filepathCwd.indexOf('/') ) {
			const rootFileMayBe = filepathCwd.substring( 0, filepathCwd.indexOf('/') ) + '.js';
			config.src.push( rootFileMayBe );
			grunt.file.expand( { cwd: 'src/commonJS' }, [rootFileMayBe] ).length > 0 ? grunt.option( 'silent', false ) : grunt.option( 'silent', true );
		} else {
			config.src.push( filepathCwd );
			grunt.option( 'silent', false );
		}
	});
	grunt.config('browserify.debug.files', [config]);
}

function updateScssConfig( grunt, changedFiles ) {
	// let changed = Object.keys( grunt.util._.omit( changedFiles, function(value, key, object) {
	// 	return path.extname(key) !== '.scss'
	// }));
	// ... waiting for sunshine
}




function setupFailHooks( grunt ) {

	const sound = () => grunt.option( 'sound' ) !== false || grunt.option( 'silent' ) !== true
		? player.play( grunt.config( 'sound.error.filepath' ) )
		: null;

	grunt.util.hooker.hook(grunt, 'warn', sound );
	grunt.util.hooker.hook(grunt.fail, 'warn', sound );
	// run on error
	grunt.util.hooker.hook(grunt.fail, 'error', sound );
	grunt.util.hooker.hook(grunt.log, 'fail', sound );
	grunt.util.hooker.hook(grunt.log, 'error', sound );
	// run on fatal
	grunt.util.hooker.hook(grunt.fail, 'fatal', sound );
}
