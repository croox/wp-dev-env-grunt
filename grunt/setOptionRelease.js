
const path = require('path');
const {
	get,
} = require('lodash');

const getChangelog = require('./getChangelog');

const setOptionRelease = ( grunt, release ) => {

	if ( ! release ) {
		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		release = get( getChangelog( grunt, pkg ), ['releases',0], false );
	}

	if ( release ) {
		const releaseString = release.toString();

		const releaseName = releaseString.split( '\n', 1 )[0];

		let releaseBody = releaseString.replace( releaseName, '' );
		releaseBody = releaseBody.startsWith( '\n' )
			? releaseBody.replace( '\n', '' )
			: releaseBody;

		grunt.option( 'release', {
			name: releaseName,
			body: releaseBody,
		} );

	} else {
		grunt.option( 'release', {
			name: '',
			body: '',
		} );
	}

};

module.exports = setOptionRelease;
