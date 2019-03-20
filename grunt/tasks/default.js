
const chalk = require( 'chalk' );
const path = require( 'path' );
const getRepoHost = require( '../getRepoHost' );
const consts = require( '../consts' );


const defaultTask = grunt => {


	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask( 'default', 'entry point, tasks overview', function() {

		// ??? todo: some ui to choose task

		const repoHost = getRepoHost( grunt );

		[
			'',
			chalk.cyan.bold( 'Available tasks:' ),
			'',
			'',
			chalk.yellow( 'grunt ' + 'build' ),
			'	to build this ' + pkg.projectType + ' into  ' + chalk.italic( './test_build' ) + '.' ,
			'',
			chalk.yellow( 'grunt ' + 'sync[:...destinations][:...version]' ),
			'	' + 'Syncs the ' + pkg.projectType + ' to a destination specified in wp_installs.json.',
			'	' + chalk.gray( '...destinations' ) + '		' + chalk.gray.italic( 'Comma separated list of destinations.' ),
			'	' + chalk.gray( '...version' ) + '		' + chalk.gray.italic( 'Sync source, string: test_build || trunk || semVersion.' ),
			'	' + chalk.red.bold( 'Deletes' ) + ' files on destination, if not present in source!',
			'',
			chalk.yellow( 'grunt ' + 'watch' ),
			'	' + 'Build into ./test_build whenever source files change.',
			'',
			chalk.yellow( 'grunt ' + 'watch_sync[:...destinations]' ) + ' or ' + chalk.yellow( 'ws[:...destinations]' ),
			'	' + 'Combination of ' + chalk.italic( 'watch' ) + ' and ' + chalk.italic( 'sync' ) + '.',
			'	' + 'Build into ' + chalk.italic( './test_build' ) + ' whenever source files change and sync to a destination.',
			'	' + chalk.gray( '...destinations' ) + '		' + chalk.gray.italic( 'Comma separated list of destinations.' ),
			'',
			chalk.yellow( 'grunt ' + 'addchange' ),
			'	' + 'To record a change.',
			'	' + 'Changes are used to generate the CHANGELOG.md and commit/tag messages on dist' + chalk.gray( 'ribution' ) + '.',
			'',
			chalk.yellow( 'grunt ' + 'dist' ),
			'	' + 'Bumps the ' + pkg.projectType + ' version and builds into ' + chalk.italic( './test_build' ) + '.',
			'	' + '... ??? and some stuff more',
			'',

			...( consts.supportedHosts.includes( repoHost.name ) ? [

				chalk.yellow( 'grunt ' + 'set_token' ),
				'	Add/replace ' + repoHost.name + ' access token',
				'	' + 'On macOS the tokens are managed by the Keychain',
				'	' + 'on Linux they are managed by the Secret Service API/libsecret,',
				'	' + 'and on Windows they are managed by Credential Vault.',
				'	' + 'see https://github.com/atom/node-keytar',
				'',


				chalk.yellow( 'grunt ' + 'remove_token' ),
				'	' + 'Removes ' + repoHost.name + ' access token',
				'',

			] : [] ),

		].map( str => grunt.log.writeln( str ) );

	} );

};

module.exports = defaultTask;
