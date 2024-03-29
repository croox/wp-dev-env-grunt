const { prompt } = require('enquirer');
const chalk = require('chalk');
const path = require('path');
const isWsl = require('is-wsl');

const {
	get,
} = require('lodash');
const getRepoHost = require('./getRepoHost');


const setToken = ( grunt ) => {

	const modulePkg = grunt.file.readJSON( path.resolve( 'node_modules/wp-dev-env-grunt/package.json' ) );

	const repoHost = getRepoHost( grunt );

	if ( ! repoHost ) {
		return new Promise( ( resolve, reject ) => () => {
			grunt.log.writeln( 'Repository not hosted on ' + [
				'GitHub',
				'Bitbucket',
				'GitLab',
				'Gitea',
			].join( '||' ) );
			reject();
		} );
	}

	if ( isWsl ) {
		return new Promise( ( resolve, reject ) => () => {
			grunt.log.writeln( 'Can not access credentials on wsl. Unable to set token.' );
			grunt.log.writeln( 'In case a token is required, you will be asked to type it in then.' );
			grunt.log.writeln( '' );
			reject();
		} );
	}

	grunt.log.writeln( '' );

	if ( get( repoHost, ['help','accessToken'] ) ) {
		grunt.log.writeln( 'How to create a personal access token for ' + chalk.yellow( get( repoHost, ['name'] ) ) );
		grunt.log.writeln( chalk.underline( get( repoHost, ['help','accessToken'] ) ) );
		grunt.log.writeln( '' );
	}

	const keytar = require('keytar');
	return new Promise( ( resolve, reject ) => prompt( [ {
		type: 'password',
		name: 'password',
		message: 'Personal Access Token for ' + chalk.yellow( get( repoHost, ['name'] ) ),
	} ] ).then( answers => {

		keytar.setPassword( modulePkg.name, get( repoHost, ['name'] ), answers.password ).then( () => {
			resolve( answers.password );
		} );

	} ).catch( e => {
		grunt.log.writeln( 'setToken ....  what happend? Did you kill the process?' );
		grunt.log.writeln( e );
		reject( e );
	} ) );

};

module.exports = setToken;