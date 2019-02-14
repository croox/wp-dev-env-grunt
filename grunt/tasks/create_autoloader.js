const path = require('path');
const { startCase } = require('lodash');

const create_autoloader = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerMultiTask( 'create_autoloader', 'sub task: used by build', function() {

		const files = [...this.files].map( file => file.src[0].replace( 'src','' ) );
		const project_class = startCase( pkg.funcPrefix ) + '_' + startCase( pkg.name ).replace( / /g, '_' );
		const fileName = this.data.files[0]['dest'] + pkg.funcPrefix + '_include_' + this.target + '.php';
		const fileContent = [
			'<?php',
			'',
			'// If this file is called directly, abort.',
			'if ( ! defined( \'WPINC\' ) ) {',
			'	die;',
			'}',
			'',
			'function ' + pkg.funcPrefix + '_include_' + this.target + '() {',
			'',
			'	$paths = array(',
			...[...files].map( file => '		\'' + file + '\','),
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

	});

};

module.exports = create_autoloader;
