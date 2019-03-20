const path = require('path');

const create_dummy_project_file = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask('create_dummy_project_file', 'sub task: used by build', function() {

		let dummyFileName;
		let dummyFileContent;
		switch( pkg.projectType ) {

			case 'plugin':
				dummyFileName = pkg.name + '.php';
				dummyFileContent = [
					'<?php',
					'',
					'/**',
					' * This is a dummy plugin file, required by GitHub Updater Plugin (https://github.com/afragen/github-updater).',
					' * GitHub Updater Plugin will query this file for updates.',
					' */',
					'',
					'?>',
				].join( '\n' );
				break;

			case 'theme':
				dummyFileName = 'style.css';
				dummyFileContent = [
					'',
					'/**',
					' * This is a dummy theme stylesheet, required by GitHub Updater Plugin (https://github.com/afragen/github-updater).',
					' * GitHub Updater Plugin will query this file for updates.',
					' */',
					'',
				].join( '\n' );
				break;
		}

		// check if file exist, and remove file
		const files = grunt.file.expand( {}, [dummyFileName] )
		if ( files.length )
			grunt.file.delete( files[0], { force: true } );

		// create new dummy file with content
		grunt.file.write( dummyFileName, dummyFileContent );

	});

};

module.exports = create_dummy_project_file;
