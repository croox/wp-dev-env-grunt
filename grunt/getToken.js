const chalk = require('chalk');
const path = require('path');
const isWsl = require('is-wsl');
const process = require('process');
const { prompt } = require('enquirer');
const {
	get,
} = require('lodash');

const getRepoHost = require('./getRepoHost');

const getToken = ( grunt ) => {

	const modulePkg = grunt.file.readJSON( path.resolve( 'node_modules/wp-dev-env-grunt/package.json' ) );

	return new Promise( resolve => {

		// Allow to type in token, if keytar fails (eg on wsl2)
		const fallbackPrompt = () => {
			prompt( [ {
				type: 'password',
				name: 'tokenAlt',
				message: chalk.yellow( 'Token' ),
			} ] ).then( ( {
				tokenAlt,
			} ) => {
				resolve( tokenAlt );
			} ).catch( e => {
				resolve( false );	// dont'reject
			} );
		}

		if ( isWsl ) {
			grunt.log.writeln( 'Can not access credentials on wsl. Type in token instead' );
			fallbackPrompt();
		} else {
			const keytar = require('keytar');
			keytar.getPassword( modulePkg.name, get( getRepoHost( grunt ), ['name'] ) )
			.then( token => resolve( token ) )
			.catch( e => {
				grunt.log.writeln( "Couldn't load token" );
				grunt.log.writeln( e );
				if ( 'linux' === process.platform ) {
					grunt.log.writeln( 'Is ' + chalk.underline('libsecret') + ' installed?' );
					grunt.log.writeln( 'On linux the package ' + chalk.underline('libsecret') + ' is required to work with the system\'s keychain.' );
					grunt.log.writeln( '	Debian/Ubuntu: ' + chalk.underline('sudo apt-get install libsecret-1-dev') );
					grunt.log.writeln( '	Red Hat-based: ' + chalk.underline('sudo yum install libsecret-devel') );
					grunt.log.writeln( '	Arch Linux: ' + chalk.underline('sudo pacman -S libsecret') );
				}
				fallbackPrompt();
			} );

		}

	} );

};

module.exports = getToken;

