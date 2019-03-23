
const url = require('url');	// don't remove this line
const path = require('path');
const consts = require('./consts');

const getRepoInfo = grunt => {
	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
	const repositoryUrl = new URL( pkg.repositoryUri );

	return [...consts.supportedHosts].reduce( ( accumulator, host ) => {
		if ( ! accumulator && repositoryUrl.hostname.includes( host.toLowerCase() ) ) {
			let repoInfo = repositoryUrl.pathname.replace( '/', '' ).split( '/' );
			repoInfo = repoInfo && repoInfo.length === 2 ? {
				owner: repoInfo[0],
				name: repoInfo[1],
			} : false;
			return repoInfo;
		}
		return false;
	}, false );
};

module.exports = getRepoInfo;
