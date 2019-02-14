const path = require('path');

// return nextRelease
// maybe init .gwde_nextRelease.json
const getNextRelease = grunt => {

	const fileName = path.resolve( '.gwde_nextRelease.json' );

	const emptyRelease = { changes: [] };
	let nextRelease;
	try {
		// nextRelease = grunt.file.readJSON( fileName );
		nextRelease = grunt.file.readJSON( fileName );
	}
	catch( err ) {
		nextRelease = emptyRelease;
		grunt.file.write( fileName, JSON.stringify( emptyRelease, null, 2 ) );
	}

	return nextRelease;
};

module.exports = getNextRelease;

