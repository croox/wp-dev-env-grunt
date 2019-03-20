const { prompt } = require('enquirer');
const path = require('path');
const {
	isString,
} = require('lodash');
const chalk = require('chalk');

const printChangesHeader = require('../printChangesHeader');
const getNextRelease = require('../getNextRelease');


const addchange = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	grunt.registerTask( 'addchange', 'Record a change', function() {

		const nextRelease = getNextRelease( grunt );

		grunt.log.writeln( '' );
		grunt.log.writeln( 'Changes are used to generate the CHANGELOG.md and commit/tag messages on dist' + chalk.gray( 'ribution' ) + '. The CHANGELOG.md will be appended to the ' + pkg.projectType + '-readme as well.' ),
		grunt.log.writeln( 'The format is based on ' + chalk.italic( 'Keep a Changelog' ) + ', see: ' + chalk.italic( 'http://keepachangelog.com/' ) + '.' );
		grunt.log.writeln( '' );

		printChangesHeader( grunt, nextRelease );

		const done = this.async();

		grunt.log.writeln( chalk.cyan( nextRelease.changes.length === 0 ? 'Add new change' : 'Add another change' ) );
		return new Promise( ( resolve, reject ) => {

			let prompts = [
				{
					type: 'select',
					name: 'type',
					message: chalk.yellow( 'Type of change' ),
					choices: [
						{
							name: 'added',
							message: chalk.green( 'Added' ),
							hint: '	for new features.',
						},
						{
							name: 'changed',
							message: chalk.green( 'Changed' ),
							hint: '	for changes in existing functionality.',
						},
						{
							name: 'deprecated',
							message: chalk.green( 'Deprecated' ),
							hint: '	for soon-to-be removed features.',
						},
						{
							name: 'removed',
							message: chalk.green( 'Removed' ),
							hint: '	for now removed features.',
						},
						{
							name: 'fixed',
							message: chalk.green( 'Fixed' ),
							hint: '	for any bug fixes.',
						},
						{
							name: 'security',
							message: chalk.green( 'Security' ),
							hint: '	in case of vulnerabilities.',
						},
					],
				},
				{
					type: 'input',
					name: 'message',
					message: chalk.yellow( 'Message' ),
					validate: val => 0 === val.length ? 'Please provide a message!' : true,
				},
			];

			// do prompt
			prompt( prompts ).then( answers => {

				const {
					type,
					message,
					// onemore,
				} = answers;

				const newNextRelease = {
					...nextRelease,
					changes: [
						...nextRelease.changes,
						...( isString( type ) && isString( message ) ? [{
							type: type,
							message: message,
						}] : [] ),
					],
				};

				resolve( newNextRelease );

			} ).catch( e => {
				grunt.log.writeln( 'canceled ... addChangePrompt' );
				reject( done.apply() );
			} );

		} ).then( newNextRelease => {
			grunt.file.write( '.wde_nextRelease.json' , JSON.stringify( newNextRelease, null, 2) );
			done.apply()
		} ).catch( e => {
			grunt.warn( 'addchange... some error or canceled by user' );
			grunt.warn( e );
			done.apply();
		} );

	} );
};

module.exports = addchange;