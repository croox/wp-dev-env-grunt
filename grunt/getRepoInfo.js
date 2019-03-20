
const url = require('url');	// don't remove this line
const path = require('path');

// ??? works only for github
const getRepoInfo = grunt => {
	const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
	const repositoryUrl =  new URL( pkg.repositoryUri );
	let repoInfo = repositoryUrl.hostname.includes( 'github' )
		? repositoryUrl.pathname.replace( '/', '' ).split( '/' )
		: false;
	repoInfo = repoInfo && repoInfo.length === 2 ? {
		owner: repoInfo[0],
		name: repoInfo[1],
	} : false;
	return repoInfo;
};

module.exports = getRepoInfo;
