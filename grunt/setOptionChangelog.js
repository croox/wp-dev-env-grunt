
const path = require('path');

const getChangelog = require('./getChangelog');

const setOptionChangelog = ( grunt, changelog ) => {

	if ( ! changelog ) {
		const pkg = grunt.file.readJSON( path.resolve( 'package.json' ) );
		changelog = getChangelog( grunt, pkg );
	}

	changelog.title = '';
	changelog.description = '== Changelog ==';
	grunt.option( 'changelog', changelog );

};

module.exports = setOptionChangelog;
