const {
	isString,
} = require('lodash');
const chalk = require('chalk');

const printChangesHeader = ( grunt, nextRelease ) => {

	// header
	grunt.log.writeln( '' );
	if ( nextRelease.changes.length > 0 ) {
		grunt.log.writeln( chalk.cyan( 'Documented changes:' ) );
		[...nextRelease.changes].map( change => isString( change.type ) && isString( change.message )
			? grunt.log.writeln( chalk.green( '  ' + change.type ) + '  	' + change.message )
			: null );
	} else {
		grunt.log.writeln( chalk.cyan( 'No changes documented yet' ) );
	}
	grunt.log.writeln( '' );

}

module.exports = printChangesHeader;