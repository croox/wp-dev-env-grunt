const path = require('path');
const getParentDirs = require('parent-dirs');
const {
	get,
	isString,
	isArray,
	isObject,
	find,
} = require( 'lodash' );

/**
 * Get wp installs
 *
 * - Traverses filsystem up and searches for wde_wp_installs.json files.
 * - If json has a key that equals installSlug, the corresponding path will be used.
 * - Only the first match will be used. So an entry in a file closer to the working directory has priority.
 *
 *
 * returns array of objects like this:
 *	[{
 *		name: installSlug,
 * 		path: path_to_theme_or_plugin_dir,
 *	}]
 *
 * @param string|array	installSlugs	array or comma separated string of wordpress-installs
 * @return array
 */
const getWpInstalls = ( grunt, installSlugs ) => {
	const errorMsg = 'unknown wp_install slug';

	if ( ! installSlugs )
		grunt.warn( errorMsg );

	if ( isString( installSlugs ) )
		installSlugs = installSlugs.split(',');

	const pkg = grunt.file.readJSON( 'package.json' );
	const parentDirs = getParentDirs();

	const filenames = [
		'wde_wp_installs.json',
		'wp_installs.json',		// legacy support
	];

	const foundInstalls = [];
	[...installSlugs].map( installSlug => {
		parentDirs.map( dir => filenames.map( filename => {
			const filepath = path.join( dir, filename );
			if ( grunt.file.exists( filepath ) ) {
				const installs = grunt.file.readJSON( filepath );
				const installPath  = get( installs, [installSlug,pkg.projectType + 's'], false );
				if ( installPath && ! find( foundInstalls, { name: installSlug } ) ) {
					foundInstalls.push( {
						name: installSlug,
						path: path.resolve( installPath, pkg.name ),
					} );
				}
			}
		} ) );
	} );

	if ( foundInstalls.length === 0 )
		grunt.warn( errorMsg );

	return foundInstalls;
}

module.exports = getWpInstalls;
