const path = require('path');
const chalk = require('chalk');
const {
	get,
} = require('lodash');


// return nextRelease
// maybe init .wde_nextRelease.json
const getNextRelease = grunt => {

	const fileName = path.resolve( '.wde_nextRelease.json' );

	const emptyRelease = { changes: [] };
	let nextRelease;
	try {
		// nextRelease = grunt.file.readJSON( fileName );
		nextRelease = grunt.file.readJSON( fileName );
	}
	catch( err ) {
		if ( 'ENOENT' === get( err, ['origError','code'] ) ) {
			// file not existing. initialize it
			nextRelease = emptyRelease;
			grunt.file.write( fileName, JSON.stringify( emptyRelease, null, 2 ) );
		} else {
			// other error, may be parsing. show error and exit
			grunt.log.writeln( '' );
			grunt.log.error( chalk.red.bold( 'Can\'t read/parse ' + fileName ) );
			grunt.log.writeln( '' );
			grunt.log.writeln( 'Error message:' );
			grunt.log.writeln( '' );
			grunt.log.writeln( err );
			grunt.log.writeln( '' );
			grunt.fail.fatal( ' ' );
		}
	}

	return nextRelease;
};

module.exports = getNextRelease;

