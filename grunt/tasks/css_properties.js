const path = require('path');

const css_properties = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask( 'css_properties', 'sub task: used by build', function() {

		const cwd = grunt.option( 'destination' ) + '/css';

		const files = grunt.file.expand( {
			expand: true,
			cwd,
		}, [
			'*.css',
			...grunt.option( 'pattern' ).exclude,
		] );

		const properties = {};

		[...files].map( file => {
			const propertiesCss = grunt.file.read( path.resolve( cwd, file ) ).match( /:root\s*{([\s\S]*?)}/g );
			if ( ! propertiesCss || propertiesCss.length !== 1 )
				return;

			const basename = path.basename( file, '.min.css' );
			properties[basename] = {}

			propertiesCss[0]
				.match( /--([a-z0-1\-]*?):\s*?([\s\S]+?)(?=;)/g )
				.map( a => a.replace( /^--/g, '' ).split( /:\s*?/ ) )
				.map( a => { properties[basename][a[0].trim()] = a[1].trim() } );
		} );

		if ( 0 === Object.keys( properties ).length )
			return;

		const fileName = path.join( grunt.option( 'destination' ), 'inc', pkg.funcPrefix + '_include_css_properties.php' );

		const fileContent = [
			'<?php',
			'',
			'// If this file is called directly, abort.',
			'if ( ! defined( \'WPINC\' ) ) {',
			'	die;',
			'}',
			'',
			'use croox\\wde\\utils\\Arr;',
			'',
			'function ' + pkg.funcPrefix + '_get_css_property( $key = null, $filename = null ) {',
			'	if ( null === $key )',
			'		return;',
			'	$filename = null === $filename ? \'' + pkg.funcPrefix + '_frontend\' : $filename;',
			'	return Arr::get( array(',
			...[...Object.keys( properties )].map( file => {
				const inner = [...Object.keys( properties[file] )]
					.map( key => '			\'' + key + '\' => \'' + properties[file][key] + '\',' ).join( '\n' )
				return '		\'' + file + '\' => array( \n'  + inner + ' \n		),'
			} ),
			'	), array( $filename, $key ) );',
			'}',
			'',
		].join( '\n' );

		grunt.file.write( fileName, fileContent );

	});

};

module.exports = css_properties;
