const chalk = require('chalk');
const path = require('path');
const keytar = require('keytar')

const {
	get,
} = require('lodash');
const getRepoHost = require('./getRepoHost');

const removeToken = ( grunt ) => {

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

	grunt.log.writeln( '' );

	return new Promise( ( resolve, reject ) => {

		keytar.deletePassword( modulePkg.name, get( repoHost, ['name'] ) ).then( res => {
			grunt.log.writeln( res
				? 'Successfully removed Personal Access Token for ' + chalk.yellow( get( repoHost, ['name'] ) )
				: 'Couldn\'t remove Personal Access Token for ' + chalk.yellow( get( repoHost, ['name'] ) ) + ', entry not found'
			);
			resolve( res );
		} ).catch( e => {
			grunt.log.writeln( 'removeToken ....  what happend? Did you kill the process?' );
			grunt.log.writeln( e );
			reject( e );
		} );

	} );

};

module.exports = removeToken;