'use strict';

const path = require('path');

const loadNpmTasks = ( grunt, name ) => {
	const wdeg = 'wp-dev-env-grunt';
	const root = path.resolve( 'node_modules' );
	const pkgfile = path.join( root, wdeg, 'node_modules', name,'package.json' );
	const pkg = grunt.file.exists( pkgfile ) ? grunt.file.readJSON( pkgfile ) : { keywords: [] };

	// Process task plugins.
	const tasksdir = path.join( root, wdeg, 'node_modules', name, 'tasks' );
	if ( grunt.file.exists( tasksdir ) )
		grunt.loadTasks( tasksdir );
};

module.exports = loadNpmTasks;
