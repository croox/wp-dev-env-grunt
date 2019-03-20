const setToken = require('../setToken');

const set_token = ( grunt ) => {
	grunt.registerTask( 'set_token', '', function() {
		const done = this.async();
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