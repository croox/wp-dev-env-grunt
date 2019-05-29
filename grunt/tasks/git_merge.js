const chalk = require('chalk');
const simpleGit = require('simple-git')();
const { prompt } = require('enquirer');
const {
	get,
} = require('lodash');

const git_merge = grunt => {

	grunt.registerMultiTask( 'git_merge', 'sub task: used by dist', function() {

		const done = this.async();

		const askFixed = () => {

			return new Promise( ( resolve, reject ) => {
				grunt.log.writeln( '' );
				prompt( [ {
					type: 'toggle',
					name: 'fixed',
					message: chalk.yellow( 'All conflicts manually fixed and result commited?' ),
					help: '!!!',
					initial: false,
				} ] ).then( answers => {
					if ( answers.fixed ) {
						resolve( true );
					} else {
						grunt.log.writeln( chalk.red.bold( 'You have to fix all conflicts and commit result!' ) );
						reject( false );
					}
				} ).catch( e => grunt.log.warn( e ) );
			} ).catch( askFixed );
		};

		simpleGit.merge( [
			'--no-ff',
			this.data.commit,
		], function ( err, mergeSummary ) {

			if ( get( err, ['conflicts'], [] ).length > 0 ) {
				[
					'',
					chalk.yellow.bold( 'Conflicts while merge!' ),
					chalk.yellow( 'Fix conflicts manually and then commit the result:' ),
					...[...err.conflicts].map( conflict => '	' + conflict.file + ':' + conflict.reason ),
				].map( str => grunt.log.writeln( str ) );
				askFixed().then( () => done.apply() ).catch( e => grunt.log.warn( e ) );
			} else {
				done.apply();
			}

		} );
	} );

};

module.exports = git_merge;
