const { prompt } = require('enquirer');
const chalk = require('chalk');
const getRepoInfo = require('../getRepoInfo');

const askpush = grunt => {

	grunt.registerMultiTask( 'askpush', 'sub task: used by dist, ask to git push', function() {

		const repoInfo = getRepoInfo( grunt );

		const done = this.async();

		new Promise( ( resolve, reject ) => prompt( [
			{
				type: 'toggle',
				name: 'shouldPush',
				message: chalk.yellow( 'Push current branch'
					+ ( 'withRelease' === this.target && repoInfo
						? ' and publish a new release'
						: ''
					)
				),
				initial: true,
		} ] ).then( answers => {

			if ( answers.shouldPush ) {
				grunt.task.run( [
					'gitpush:commit',
					'gitpush:tags',
					...( 'withRelease' === this.target && repoInfo ? [
						'create_release',
					] : [] ),
				] );
			}

			done.apply();
		} ).catch( e => {
			grunt.log.writeln( 'askpush ....  what happend? Did you kill the process?' );
			grunt.log.writeln( e );
			reject( done.apply() );
		} ) );

	} );
};

module.exports = askpush;
