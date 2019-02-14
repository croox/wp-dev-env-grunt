const { prompt } = require('enquirer');
const chalk = require('chalk');

const askpush = grunt => {

	grunt.registerTask( 'askpush', 'sub task: used by dist, ask to git push', function( type, message ) {

		grunt.log.writeln( '' );
		grunt.log.writeln( chalk.cyan( 'Hurray, all done!' ) );
		grunt.log.writeln( '' );

		const done = this.async();

		new Promise( ( resolve, reject ) => prompt( [
			{
				type: 'toggle',
				name: 'shouldPush',
				message: chalk.yellow( 'Push repository' ),
		} ] ).then( answers => {

			if ( answers.shouldPush ) {
				grunt.task.run( [
					'gitpush:commit',
					'gitpush:tags',
				] );
			}

			done.apply();
		} ) );

	} );
};

module.exports = askpush;
