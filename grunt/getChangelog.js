const path = require('path');

const {
	parser,
	Changelog,
} = require('keep-a-changelog');

// return parsed changelog
// maybe init CHANGELOG.md
const getChangelog = ( grunt, pkg ) => {

	pkg = pkg ? pkg : grunt.file.readJSON( path.resolve( 'package.json' ) );

	const fileName = 'CHANGELOG.md';

	let changelog;
	try {
		changelog = parser( grunt.file.read( fileName, 'UTF-8') );
	}
	catch( err ) {
		changelog = new Changelog( pkg.displayName );
		grunt.file.write( fileName, changelog.toString() );
	}

	return changelog;
};

module.exports = getChangelog;

