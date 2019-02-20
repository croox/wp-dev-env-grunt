const path = require('path');
const { startCase } = require('lodash');

const create_autoloader = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerMultiTask( 'create_autoloader', 'sub task: used by build', function() {

		const project_class = startCase( pkg.funcPrefix ) + '_' + startCase( pkg.name ).replace( / /g, '_' );

		const dirs = grunt.file.expand( {
			expand: true,
			cwd: 'src/' + this.target,
		}, [
			'*',
			...grunt.option( 'pattern' ).exclude,
		] ).filter( dir => '' === path.extname( dir ) );


		[...dirs].map( dir => {

			const files = grunt.file.expand( {
				expand: true,
				cwd: 'src/' + this.target + '/' + dir,
			}, [
				'*.php',
				...grunt.option( 'pattern' ).exclude,
			] );

			const fileName = path.join( grunt.option( 'destination' ), this.target, pkg.funcPrefix + '_include_' + dir + '.php' );

			const fileContent = [
				'<?php',
				'',
				'// If this file is called directly, abort.',
				'if ( ! defined( \'WPINC\' ) ) {',
				'	die;',
				'}',
				'',
				'function ' + pkg.funcPrefix + '_include_' + dir + '() {',
				'',
				'	$paths = array(',
				...[...files].map( file => '		\'/' + this.target + '/' + dir + '/' + file + '\','),
				'	);',
				'',
				'	if ( count( $paths ) > 0 ) {',
				'		foreach( $paths as $path ) {',
				'			include_once( ' + project_class + '::' + pkg.projectType + '_dir_path() . $path );',
				'		}',
				'	}',
				'',
				'}',
				'',
				'?>',
			].join( '\n' );

			grunt.file.write( fileName, fileContent );

		} );

	});

};

module.exports = create_autoloader;
