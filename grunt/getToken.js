const chalk = require('chalk');
const path = require('path');
const keytar = require('keytar')
const process = require('process');
const { prompt } = require('enquirer');
const {
	get,
} = require('lodash');

const getRepoHost = require('./getRepoHost');

const getToken = ( grunt ) => {

	const modulePkg = grunt.file.readJSON( path.resolve( 'node_modules/wp-dev-env-grunt/package.json' ) );

	return new Promise( resolve => {

		keytar.getPassword( modulePkg.name, get( getRepoHost( grunt ), ['name'] ) )
		.then( token => resolve( token ) )
		.catch( e => {
			// grunt.log.writeln( 'getToken ....  what happend? Did you kill the process?' );
			// grunt.log.writeln( e );
			grunt.log.writeln( "Couldn't load token" );

			if ( 'linux' === process.platform ) {
				grunt.log.writeln( '' );
				grunt.log.writeln( 'Is ' + chalk.underline('libsecret') + ' installed?' );
				grunt.log.writeln( 'On linux the package ' + chalk.underline('libsecret') + ' is required to work with the system\'s keychain.' );
				grunt.log.writeln( '	Debian/Ubuntu: ' + chalk.underline('sudo apt-get install libsecret-1-dev') );
				grunt.log.writeln( '	Red Hat-based: ' + chalk.underline('sudo yum install libsecret-devel') );
				grunt.log.writeln( '	Arch Linux: ' + chalk.underline('sudo pacman -S libsecret') );
			}

			// Allow to type in token, if keytar fails (eg on wsl2)
			prompt( [ {
				type: 'password',
				name: 'tokenAlt',
				message: chalk.yellow( 'Type in token instead' ),
			} ] ).then( ( {
				tokenAlt,
			} ) => {
				resolve( tokenAlt );
			} ).catch( e => {
				resolve( false );	// dont'reject
			} );

		} );

	} );

};

module.exports = getToken;

