const path = require('path');
const getParentDirs = require('parent-dirs');
const {
	get,
	isString,
	find,
	omit,
} = require( 'lodash' );

const getRepoInfo = require('./getRepoInfo');
const isCygwin = require('./isCygwin');

/**
 * Get wp installs
 *
 * - Traverses filsystem up and searches for wde_wp_installs.json files.
 * - If json has a key that equals installSlug, the corresponding entry will be used
 *	to create an object for the returned collection.
 *	key `plugins|themes` will be use as `dest`.
 * 	All other keys are merged directly. For example: set an array with args to parse it to the rsync command.
 *
 *	 "installSlug": {
 *		 "args": [
 *			 // possible top repend `!`
 *			 // example, ensable the verbose output but don't show stats:
 *			 "--verbose",
 *			 "!--stats",
 *		 ],
 *		 "plugins": "abs_path/to/local_wp/wp-content/plugins/",
 *		 "themes": "abs_path/to/local_wp/wp-content/themes/"
 *	 },
 *	 "otherInstallSlug": {
 *		 "port": 1234,
 *		 "args": [
 *			 "--size-only"
 *		 ],
 *		 "plugins": "login@host.com:/abs_path/to/wp/wp-content/plugins/",
 *		 "themes": "login@host.com:/abs_path/to/wp/wp-content/themes/"
 *	 }
 * - Only the first match will be used. So an entry in a file closer to the working directory has priority.
 *
 * @param string|array	installSlugs	array or comma separated string of wordpress-installs
 * @return array 	collection of objects. Example:
 *	[
 *		{
 *			name: installSlug,
 *	 		dest: path_to_theme_or_plugin_dir/repo_name,
 *			args: [
 *				'--verbose',
 *				'!--stats',
 * 			],
 *		},{
 *			name: otherInstallSlug,
 *	 		dest: login@host.com:/path_to_theme_or_plugin_dir/repo_name,
 * 			args: [
 *				'--size-only',
 * 			],
 *		}
 *	]
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

	const repoName = get( getRepoInfo( grunt ), ['name'], pkg.name );

	const foundInstalls = [];
	[...installSlugs].map( installSlug => {
		parentDirs.map( dir => filenames.map( filename => {
			const filepath = path.join( dir, filename );
			if ( grunt.file.exists( filepath ) ) {
				const installs = grunt.file.readJSON( filepath );
				const installPath  = get( installs, [installSlug,pkg.projectType + 's'], false );
				if ( installPath && ! find( foundInstalls, { name: installSlug } ) ) {
					foundInstalls.push( {
						...omit( get( installs, [installSlug] ), ['plugins','themes'] ),
						name: installSlug,
						dest: installPath.includes( '@' )
							? path.join( installPath, repoName )		// ??? missing test remote path and cygwin
							: isCygwin()
								? path.resolve( installPath, repoName )
									.replace( /\\/g, '/' )
									.replace( /^\S:\//g, '/' )
								: path.resolve( installPath, repoName ),
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
