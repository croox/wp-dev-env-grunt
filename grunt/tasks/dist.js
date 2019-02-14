const {
	prompt,
} = require('enquirer');

const path = require('path');

const {
	isFunction,
	isString,
} = require('lodash');

const {
	Changelog,
	Release,
	parser,
} = require('keep-a-changelog');

const semver = require('semver');
const chalk = require('chalk');
const printChangesHeader = require('../printChangesHeader');





const updateConfigs = require('../updateConfigs');

const simpleGit = require('simple-git')();

const dist = grunt => {

	grunt.registerTask( 'dist', 'sub task', function(){

		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );



		grunt.log.writeln( '' );
		console.log( 'debug pkg', pkg );		// ??? debug
		grunt.log.writeln( '' );
		grunt.log.writeln( '' );
		grunt.log.writeln( '' );





		grunt.log.writeln( '' );
		grunt.log.writeln( chalk.cyan( 'Starting dist task from version ' ) + pkg.version );
		grunt.log.writeln( '' );

		// get changelog
		let changelog;
		try {
			changelog = parser( grunt.file.read( 'CHANGELOG.md', 'UTF-8') );
		}
		catch( err ) {
			changelog = new Changelog( pkg.displayName );
		}

		// get nextRelease
		const nextReleaseFile = '.gwde_nextRelease.json';
		const emptyRelease = { changes: [] };
		let nextRelease;
		try {
			nextRelease = grunt.file.readJSON( nextReleaseFile );
		}
		catch( err ) {
			nextRelease = emptyRelease;
		}

		const done = this.async();

		const checkStaged = staged => staged.length === 0 ? new Promise( ( resolve, reject ) => prompt( [
			{
				type: 'toggle',
				name: 'proceed',
				message: chalk.yellow( 'Nothing staged. Proceed dist task?' ),
			},
		] ).then( answers => answers.proceed ? resolve() : reject() ).catch( e => {
			grunt.log.writeln( 'checkStaged .... shit, something happend!' );
			grunt.log.writeln( e );
			reject( done.apply() );
		} ) ) : true;

		const getDistInfo = () => new Promise( ( resolve, reject ) =>
			prompt( [
				{
					type: 'select',
					name: 'releaseType',
					message: chalk.yellow( 'Release Type' ),
					choices: [
						'patch',
						'minor',
						'major',
					],
				},
				{
					type: 'input',
					name: 'description',
					message: chalk.yellow( 'Release Description' ),
					validate: val => 0 === val.length ? 'Please provide a description!' : true,
				},
			] ).then( distInfo => resolve( distInfo ) ).catch( e => {
				grunt.log.writeln( 'getDistInfo .... shit, something happend!' );
				grunt.log.writeln( e );
				reject( done.apply() );
			} )
		);

		const checkChanges = distInfo => {

			printChangesHeader( grunt, nextRelease );

			grunt.log.writeln( chalk.cyan( 'To add ' + ( nextRelease.changes.length > 0 ? 'more ' : '' ) + 'changes, cancel dist-task and run: ' ) + 'grunt addchange' );
			grunt.log.writeln( '' );

			return new Promise( ( resolve, reject ) => prompt( [
				{
					type: 'toggle',
					name: 'proceed',
					message: chalk.yellow( 'Proceed dist task?' ),
				},
			] ).then( answers => answers.proceed ? resolve( distInfo ) : reject() ).catch( e => {
				grunt.log.writeln( 'checkChanges .... shit, something happend!' );
				grunt.log.writeln( e );
				reject( done.apply() );
			} ) )

		};

		const incVersion = props => {

			const newVersion = semver.inc( pkg.version, props.releaseType );
			pkg.version = newVersion;
			grunt.file.write( 'package.json' , JSON.stringify( pkg, null, 2 ) );
			grunt.log.writeln( '' );
			grunt.log.writeln( chalk.green( 'Changed version in package.json to ' ) + newVersion );

			return {
				...props,
				newVersion,
			};
		};

		const updateChangelog = props => {

			const {
				description,
				newVersion,
			} = props;

			const newRelease = new Release( newVersion, new Date(), description );
			[...nextRelease.changes].map( change => isFunction( newRelease[change.type] ) && isString( change.message )
				? newRelease[change.type]( change.message )
				: null );
			changelog.addRelease( newRelease );

			grunt.file.write( 'CHANGELOG.md', changelog.toString() );
			grunt.log.writeln( '' );
			grunt.log.writeln( chalk.green( 'Added new release ' ) + newVersion + chalk.green( ' to CHANGELOG.md' ) );

			return {
				...props,
				changelog,
				newRelease,
			};
		};

		const resetNextReleaseFile = props => {
			grunt.file.write( nextReleaseFile, JSON.stringify( emptyRelease, null, 2 ) );
			grunt.log.writeln( '' );
			grunt.log.writeln( chalk.green( 'Reset changes in ' + nextReleaseFile ) );
			return props;
		};

		const setOptionsUpdateConfigs = props => {
			const {
				newRelease,
				changelog,
			} = props;

			grunt.option( 'destination', 'dist/trunk' );
			grunt.option( 'compress', true );

			changelog.title = '';
			changelog.description = '== Changelog ==';
			grunt.option( 'changelog', changelog );

			grunt.option( 'commitmsg', newRelease.toString().replace( '\n', '\n\n' ) );

			updateConfigs( grunt );

			return props;
		};


		new Promise( ( resolve, reject ) => simpleGit.status( ( err, status ) => resolve( status.staged ) ) )
		.then( checkStaged )
		.then( getDistInfo )
		.then( checkChanges )
		.then( incVersion )
		.then( updateChangelog )
		.then( resetNextReleaseFile )
		.then( setOptionsUpdateConfigs )
		.then( props => {

			grunt.task.run( [
				'build',
				'eslint:dest',
				'copy:trunkToTags',
				'compress:trunk_to_releases',
				'gitadd:ondist',
				'gitcommit:ondist',
				'gittag:ondist',
				'sound:fanfare',
				'askpush',
			] );

			done.apply();

			return props;

		} ).catch( e => {
			grunt.warn( 'shit, something happend!' );
			grunt.warn( e );
			done.apply();
		} );

	});
};

module.exports = dist;
