const fs = require('fs');
const path = require('path');

const create_dummy_plugin_main_file = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask('create_dummy_plugin_main_file', 'sub task', function() {
		const dummyFileName = pkg.name + '.php';

		// check if file exist, and remove file
		const files = grunt.file.expand( {}, [dummyFileName] )
		if ( files.length )
			fs.unlinkSync( files[0] );

		// create new dummy file with content
		const dummyFileContent = [
			'<?php',
			'',
			'/**',
			' * This is a dummy main plugin file that is named identically to the main plugin file.',
			' * This file is required by GitHub Updater Plugin (https://github.com/afragen/github-updater).',
			' * It has the same header and version number as the actual plugin main file',
			' * GitHub Updater Plugin will query this file for updates.',
			' */',
			'',
			'?>',
		].join( '\n' );
		fs.writeFileSync( dummyFileName, dummyFileContent );
	});

};

module.exports = create_dummy_plugin_main_file;
