const { prompt } = require('enquirer');
const chalk = require('chalk');
const getRepoInfo = require('../getRepoInfo');

const askpush = grunt => {

	grunt.registerTask( 'askpush', 'sub task: used by dist, ask to git push', function() {

		const repoInfo = getRepoInfo( grunt );

		[
			'',
			chalk.green( 'Hurray, almost done ...'),
			'',
		].map( str => grunt.log.writeln( str ) );

		const done = this.async();

		new Promise( ( resolve, reject ) => prompt( [
			{
				type: 'toggle',
				name: 'shouldPush',
				message: chalk.yellow( 'Push repository' + ( repoInfo
					? ' and publish a new release'
					: ''
				) ),
				initial: true,
		} ] ).then( answers => {

			if ( answers.shouldPush ) {
				grunt.task.run( [
					'gitpush:commit',
					'gitpush:tags',
					...( repoInfo ? [
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
