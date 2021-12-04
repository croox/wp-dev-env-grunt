const setToken = require('../setToken');
const isWsl = require('is-wsl');

const set_token = ( grunt ) => {
	grunt.registerTask( 'set_token', '', function() {
		const done = this.async();

		if ( isWsl )  {
			grunt.log.writeln( 'Can not access credentials on wsl. Unable to set token.' );
			grunt.log.writeln( 'In case a token is required, you will be asked to type it in then.' );
			grunt.log.writeln( '' );
			done.apply();
		}

		setToken( grunt )
		.then( token => done.apply( token ) )
		.catch( e => {
			grunt.log.writeln( 'set_token ....  what happend? Did you kill the process?' );
			grunt.log.writeln( e );
			done.apply( e );
		} );
	} );
};

module.exports = set_token;