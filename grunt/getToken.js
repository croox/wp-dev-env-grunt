const chalk = require('chalk');
const path = require('path');
const keytar = require('keytar')
const process = require('process');
const {
	get,
} = require('lodash');

const getRepoHost = require('./getRepoHost');

const getToken = ( grunt ) => {

	const modulePkg = grunt.file.readJSON( path.resolve( 'node_modules/wp-dev-env-grunt/package.json' ) );

	return new Promise( ( resolve, reject ) => {

		keytar.getPassword( modulePkg.name, get( getRepoHost( grunt ), ['name'] ) )
		.then( token => resolve( token ) )
		.catch( e => {
			grunt.log.writeln( 'getToken ....  what happend? Did you kill the process?' );
			grunt.log.writeln( e );

			if ( 'linux' === process.platform ) {
				grunt.log.writeln( '' );
				grunt.log.writeln( 'Is ' + chalk.underline('libsecret') + ' installed?' );
				grunt.log.writeln( 'On linux the package ' + chalk.underline('libsecret') + ' is required to work with the system\'s keychain.' );
				grunt.log.writeln( '	Debian/Ubuntu: ' + chalk.underline('sudo apt-get install libsecret-1-dev') );
				grunt.log.writeln( '	Red Hat-based: ' + chalk.underline('sudo yum install libsecret-devel') );
				grunt.log.writeln( '	Arch Linux: ' + chalk.underline('sudo pacman -S libsecret') );
			}

			reject( e );
		} );

	} );

};

module.exports = getToken;

