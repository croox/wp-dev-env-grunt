const {
	prompt,
} = require('enquirer');

const path = require('path');

const {
	isFunction,
	isString,
	find,
} = require('lodash');

const {
	Changelog,
	Release,
	parser,
} = require('keep-a-changelog');

const semver = require('semver');
const chalk = require('chalk');
const simpleGit = require('simple-git')();


const printChangesHeader = require('../printChangesHeader');
const updateConfigs = require('../updateConfigs');
const getChangelog = require('../getChangelog');
const getNextRelease = require('../getNextRelease');


const dist = grunt => {

	grunt.registerTask( 'dist', 'Distribute a new version', function(){

		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

		grunt.log.writeln( '' );
		grunt.log.writeln( chalk.cyan( 'Starting dist task from version ' ) + pkg.version );
		grunt.log.writeln( '' );

		// get changelog
		const changelog = getChangelog( grunt, pkg );
		// get nextRelease
		const nextRelease = getNextRelease( grunt );

		const done = this.async();

		let gitStatus;

		const checkStaged = status => status.staged.length === 0 ? new Promise( ( resolve, reject ) => prompt( [
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
					initial: true,
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

			const nextReleaseFile = '.wde_nextRelease.json';
			const emptyRelease = { changes: [] };

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




		new Promise( ( resolve, reject ) => simpleGit.status( ( err, status ) => resolve( gitStatus = status ) ) )
		.then( checkStaged )
		.then( getDistInfo )
		.then( checkChanges )
		.then( incVersion )
		.then( updateChangelog )
		.then( resetNextReleaseFile )
		.then( setOptionsUpdateConfigs )
		.then( props => {
			const tasks = grunt.hooks.applyFilters( 'tasks.dist.tasks', [
				...( find( gitStatus.files, file => file.path.includes( 'dist/trunk/' ) ) ? [
					'gitrm:ondist',
				] : [] ),
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

			grunt.task.run( tasks );

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
