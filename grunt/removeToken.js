const chalk = require('chalk');
const path = require('path');
const isWsl = require('is-wsl');
const {
	get,
} = require('lodash');
const getRepoHost = require('./getRepoHost');

const removeToken = ( grunt ) => {

	const modulePkg = grunt.file.readJSON( path.resolve( 'node_modules/wp-dev-env-grunt/package.json' ) );

	return new Promise( ( resolve, reject ) => {
		const repoHost = getRepoHost( grunt );
		if ( ! repoHost ) {
			grunt.log.writeln( 'Repository not hosted on ' + [
				'GitHub',
				'Bitbucket',
				'GitLab',
				'Gitea',
			].join( '||' ) );
			reject();
		}
		if ( isWsl ) {
			grunt.log.writeln( 'Can not access credentials on wsl. Tokens can\'t be added, neiter removed.' );
			reject();
		} else {
			grunt.log.writeln( '' );
			const keytar = require('keytar');
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
		}
	} );
};

module.exports = removeToken;
