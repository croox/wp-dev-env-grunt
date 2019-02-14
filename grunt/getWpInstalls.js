const path = require('path');

const {
	get,
	isString,
} = require( 'lodash' );


const errorMsg = 'unknown local wp_install';


const getWpInstall = ( grunt, wp_install, wp_install_path, counter ) => {

	wp_install_path = wp_install_path ? wp_install_path : 'wp_installs.json';
	counter = counter ? counter : 0;

	if ( counter > 9 )
		return grunt.warn( errorMsg );

	if ( grunt.file.expand( { cwd: '' }, [wp_install_path] ).length ) {
		const pkg = grunt.file.readJSON('package.json');
		const wp_installs = grunt.file.readJSON( wp_install_path );

		if ( typeof wp_installs[wp_install] === 'object' ) {
			const _path = get( wp_installs, [wp_install,'plugins'], false );
			if ( _path )
				return path.resolve( _path, pkg.name );
		}
	}

	return getWpInstall( grunt, wp_install, '../' + wp_install_path, counter + 1 );

};


const getWpInstalls = ( grunt, wp_installs ) => {

	// console.log( 'debug getWpInstalls', wp_installs );		// ??? debug

	// wp_installs = wp_installs ? wp_installs : get( grunt.option( 'sync' ), ['wp_installs'], false );
	if ( ! wp_installs )
		grunt.warn( errorMsg );

	if ( isString( wp_installs ) )
		wp_installs = wp_installs.split(',');

	const found_installs = [];
	[...wp_installs].map( wp_install => {
		// console.log( 'debug wp_install', wp_install );		// ??? debug

		found_installs.push( {
			name: wp_install,
			path: getWpInstall( grunt, wp_install )
		} );
	} );
	return found_installs;
}










module.exports = getWpInstalls;