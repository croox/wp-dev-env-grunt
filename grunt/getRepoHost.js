
const url = require('url');	// don't remove this line
const path = require('path');
const {
	set,
} = require('lodash');

const getRepoHost = grunt => {

	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );

	const repositoryUrl =  new URL( pkg.repositoryUri );

	const repoHost = [
		'GitHub',
		'Bitbucket',
		'GitLab',
		'Gitea',
	].reduce( ( accumulator, host ) => null !== accumulator
		? accumulator
		: repositoryUrl.hostname.includes( host.toLowerCase() ) ? {
			name: host,
			slug: host.toLowerCase(),

		} : null, null
	);

	if ( repoHost ) {
		switch( repoHost.name ) {
			case 'GitHub':
				set( repoHost, ['help','accessToken'], 'https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line' );
				break;
			default:
				// ... silence
		}
	}

	return repoHost;
};
module.exports = getRepoHost;
